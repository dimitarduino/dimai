import { NextResponse } from "next/server";
import Replicate from "replicate";

export async function POST(req) {
  try {
    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || process.env.REPLICATE_APIKEY
    });

    const { model, messages, searchResults, enableWebSearch } = await req.json();

    if (!model) {
      return NextResponse.json(
        { error: "Model is required" },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Format messages for Replicate
    // Replicate OpenAI models expect messages in OpenAI format
    // Filter out system messages from the messages array as they're handled separately
    const chatMessages = messages.filter(m => m.role !== 'system').map(msg => {
      let messageContent = msg.content || '';
      
      // Add document text to message content if documents are present
      if (msg.documents && msg.documents.length > 0) {
        const documentTexts = msg.documents.map((doc, idx) => {
          // Check if document has valid extracted text (not just error messages)
          const hasValidText = doc.text && 
            !doc.text.includes('[Document uploaded but text extraction failed') &&
            !doc.text.includes('[Error extracting text') &&
            doc.text.trim().length > 50; // At least 50 characters of actual content
          
          if (hasValidText) {
            return `\n\n[Document ${idx + 1}: ${doc.name}${doc.pageCount ? ` (${doc.pageCount} pages)` : ''}]\n${doc.text}`;
          } else {
            // For documents with extraction issues, provide a note to the AI
            return `\n\n[Document ${idx + 1}: ${doc.name} - Note: Text extraction had issues. The document file is available at ${doc.url}. Please inform the user that the document was uploaded but text extraction encountered problems, and suggest they describe the document content or ask specific questions.]`;
          }
        }).join('\n\n');
        messageContent = messageContent ? `${messageContent}${documentTexts}` : documentTexts;
      }
      
      // Format message with images if present
      if (msg.images && msg.images.length > 0) {
        // For vision models, include images in the message
        return {
          role: msg.role,
          content: [
            { type: 'text', text: messageContent },
            ...msg.images.map(imgUrl => ({
              type: 'image_url',
              image_url: { url: imgUrl }
            }))
          ]
        }
      }
      
      return {
        role: msg.role,
        content: messageContent
      }
    });
    
    const systemMessage = messages.find(m => m.role === 'system');
    
    // Build enhanced system prompt with search results if available
    let systemPrompt = systemMessage?.content || "You are a helpful assistant.";
    
    // Check if there are documents in the conversation
    const hasDocuments = messages.some(msg => msg.documents && msg.documents.length > 0);
    if (hasDocuments) {
      systemPrompt += "\n\nYou have access to uploaded documents. When documents are provided, analyze their content and answer questions based on the document text. If a document extraction note indicates issues, inform the user politely and suggest alternatives like describing the document content or asking specific questions.";
    }
    
    if (enableWebSearch && searchResults && searchResults.results && searchResults.results.length > 0) {
      const searchContext = searchResults.results.map((result, idx) => 
        `[${idx + 1}] ${result.title}\nURL: ${result.url}${result.snippet ? `\n${result.snippet}` : ''}`
      ).join('\n\n');
      
      systemPrompt += `\n\nCurrent web search results for "${searchResults.query}":\n\n${searchContext}\n\nUse this information to provide accurate, up-to-date answers. Cite sources using [1], [2], etc. when referencing search results.`;
    }
    
    const input = {
      messages: chatMessages,
      system_prompt: systemPrompt,
    };
    
    // Extract citations from search results
    const citations = searchResults?.results?.map(result => ({
      title: result.title,
      url: result.url
    })) || [];

    // Run the model on Replicate
    // Note: Some models may require version hash (e.g., "openai/gpt-4o:abc123...")
    // If you get 404 errors, check Replicate's website for exact model identifiers
    const output = await replicate.run(model, { input });

    // Handle different response formats from Replicate
    let response = "";
    
    // Replicate can return different formats:
    // 1. Direct string
    if (typeof output === 'string') {
      response = output;
    } 
    // 2. Array of strings (streaming chunks or multiple outputs)
    else if (Array.isArray(output)) {
      response = output.map(item => 
        typeof item === 'string' ? item : JSON.stringify(item)
      ).join('');
    } 
    // 3. Object with response fields
    else if (output && typeof output === "object") {
      const o = output as Record<string, unknown>;
      response =
        (typeof o.text === "string" ? o.text : null) ??
        (typeof o.response === "string" ? o.response : null) ??
        (typeof o.content === "string" ? o.content : null) ??
        (typeof o.message === "string" ? o.message : null) ??
        (typeof o.output === "string" ? o.output : null) ??
        JSON.stringify(output);
    } 
    // 4. Fallback to string conversion
    else {
      response = String(output || 'No response received');
    }

    return NextResponse.json({ 
      response: response,
      model: model,
      citations: citations
    });
  } catch (error) {
    console.error('Replicate API Error:', error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'An error occurred while processing your request';
    
    if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      errorMessage = 'Invalid API token. Please check your Replicate API credentials.';
    } else if (error.message?.includes('404') || error.message?.includes('not found')) {
      errorMessage = 'Model not found. Please check if the model name is correct.';
    } else if (error.message?.includes('rate limit')) {
      errorMessage = 'Rate limit exceeded. Please try again later.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: (error as { status?: number }).status ?? 500 }
    );
  }
}

