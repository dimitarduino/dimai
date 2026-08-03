import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import axios from "axios";

type SearchHit = { title: string; url: string; snippet: string };

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { query, deepResearch } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Use DuckDuckGo Instant Answer API (free, no API key required)
    // For production, consider using SerpAPI, Google Custom Search, or Tavily API
    const searchResults = await performWebSearch(query, deepResearch);

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error('Web search error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to perform web search" },
      { status: 500 }
    );
  }
}

async function performWebSearch(query: string, deepResearch = false) {
  try {
    // Using DuckDuckGo Instant Answer API (free, no API key required)
    // For production with better results, consider:
    // - SerpAPI (https://serpapi.com/) - requires API key
    // - Google Custom Search API - requires API key
    // - Tavily API (https://tavily.com/) - requires API key
    // - Bing Search API - requires API key
    
    // Try DuckDuckGo Instant Answer API first (better structured results)
    try {
      const instantAnswerUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
      const instantResponse = await axios.get(instantAnswerUrl);
      
      const results: SearchHit[] = [];
      
      // Add abstract if available
      if (instantResponse.data.AbstractText) {
        results.push({
          title: instantResponse.data.Heading || query,
          url: instantResponse.data.AbstractURL || '',
          snippet: instantResponse.data.AbstractText
        });
      }
      
      // Add related topics
      if (instantResponse.data.RelatedTopics) {
        instantResponse.data.RelatedTopics.slice(
          0,
          deepResearch ? 8 : 4,
        ).forEach((topic: { Text?: string; FirstURL?: string }) => {
          if (topic.Text && topic.FirstURL) {
            results.push({
              title: topic.Text.split(' - ')[0] || topic.Text.substring(0, 60),
              url: topic.FirstURL,
              snippet: topic.Text
            });
          }
        });
      }
      
      // If we have good results, return them
      if (results.length > 0) {
        return {
          query: query,
          results: results.slice(0, deepResearch ? 10 : 5),
          deepResearch: deepResearch
        };
      }
    } catch (instantError) {
      console.log('Instant answer API failed, trying HTML search');
    }
    
    // Fallback to HTML search
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 5000
    });

    const html = response.data;
    const results: SearchHit[] = [];
    
    // Improved regex patterns for DuckDuckGo HTML
    const linkRegex = /<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    const snippetRegex = /<a class="result__snippet"[^>]*>([^<]+)<\/a>/g;
    
    let match;
    let count = 0;
    const maxResults = deepResearch ? 10 : 5;
    const snippets: string[] = [];
    
    // Extract snippets
    let snippetMatch;
    while ((snippetMatch = snippetRegex.exec(html)) !== null) {
      snippets.push(snippetMatch[1].trim());
    }

    // Extract links
    while ((match = linkRegex.exec(html)) !== null && count < maxResults) {
      results.push({
        title: match[2].trim(),
        url: match[1],
        snippet: snippets[count] || ''
      });
      count++;
    }

    // Return results or fallback
    if (results.length > 0) {
      return {
        query: query,
        results: results,
        deepResearch: deepResearch
      };
    }

    // Final fallback
    return {
      query: query,
      results: [],
      message: "Search completed. Using available information to answer your question."
    };
  } catch (error) {
    console.error('Search execution error:', error);
    return {
      query: query,
      results: [],
      error: "Search service temporarily unavailable"
    };
  }
}

