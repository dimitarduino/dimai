import { NextResponse } from "next/server";
import { storage } from "configs/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import path from "path";

// Import document processing libraries using require (works in Next.js API routes)
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('documents');

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: "No documents provided" },
        { status: 400 }
      );
    }

    const processedDocuments = [];

    for (const file of files) {
      if (!(file instanceof File) && !(file instanceof Blob)) continue;

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileName = file.name || `document-${Date.now()}`;
      const fileType = file.type || 'application/octet-stream';
      const fileExtension = path.extname(fileName).toLowerCase();

      // Upload file to Firebase Storage
      const storageRef = ref(storage, `chat-documents/${Date.now()}-${fileName}`);
      await uploadBytes(storageRef, fileBuffer);
      const fileUrl = await getDownloadURL(storageRef);

      // Extract text content based on file type
      let extractedText = '';
      let pageCount = null;
      let extractionError = null;

      try {
        if (fileExtension === '.pdf') {
          try {
            const pdfData = await pdfParse(fileBuffer, {
              // Options for better text extraction
              max: 0, // Parse all pages
            });
            
            extractedText = pdfData.text || '';
            pageCount = pdfData.numpages || null;
            
            // Clean up extracted text
            if (extractedText) {
              extractedText = extractedText.trim();
              // Remove excessive whitespace
              extractedText = extractedText.replace(/\s+/g, ' ');
            }
            
            if (!extractedText || extractedText.length < 10) {
              // PDF might be image-based, encrypted, or have minimal text
              extractionError = 'PDF contains minimal or no extractable text (may be image-based or encrypted)';
              // Still set a minimal text so the document is processed
              extractedText = `[PDF "${fileName}" (${pageCount || 'unknown'} pages) - This PDF appears to be image-based or contains minimal text. The file has been uploaded successfully.]`;
            }
          } catch (pdfError) {
            console.error('PDF parsing error for', fileName, ':', pdfError);
            extractionError = `Failed to parse PDF: ${pdfError.message}`;
            
            // Check if it's a specific error type
            if (pdfError.message && pdfError.message.includes('encrypted')) {
              extractionError = 'PDF is encrypted and cannot be processed';
            } else if (pdfError.message && pdfError.message.includes('Invalid')) {
              extractionError = 'PDF file appears to be corrupted or invalid';
            }
            
            extractedText = '';
          }
        } else if (fileExtension === '.docx') {
          try {
            const result = await mammoth.extractRawText({ buffer: fileBuffer });
            extractedText = result.value || '';
            
            if (result.messages && result.messages.length > 0) {
              console.warn('Mammoth warnings:', result.messages);
            }
            
            if (!extractedText || extractedText.trim().length === 0) {
              extractionError = 'DOCX appears to be empty';
            }
          } catch (docxError) {
            console.error('DOCX parsing error:', docxError);
            extractionError = `Failed to parse DOCX: ${docxError.message}`;
            extractedText = '';
          }
        } else if (fileExtension === '.doc') {
          // .doc files are older format, mammoth might not work well
          extractionError = 'Legacy .doc format not fully supported. Please convert to .docx or PDF.';
          extractedText = '';
        } else if (fileExtension === '.txt' || fileExtension === '.md') {
          // For text files, read directly
          try {
            extractedText = fileBuffer.toString('utf-8');
            if (!extractedText || extractedText.trim().length === 0) {
              extractionError = 'Text file appears to be empty';
            }
          } catch (txtError) {
            console.error('Text file reading error:', txtError);
            extractionError = `Failed to read text file: ${txtError.message}`;
            extractedText = '';
          }
        } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
          try {
            const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
            
            // Extract text from all sheets
            const sheetTexts = [];
            workbook.SheetNames.forEach((sheetName, idx) => {
              const sheet = workbook.Sheets[sheetName];
              const sheetText = XLSX.utils.sheet_to_txt(sheet);
              if (sheetText && sheetText.trim()) {
                sheetTexts.push(`[Sheet ${idx + 1}: ${sheetName}]\n${sheetText}`);
              }
            });
            
            extractedText = sheetTexts.join('\n\n');
            
            if (!extractedText || extractedText.trim().length === 0) {
              extractionError = 'Excel file appears to be empty';
            }
          } catch (xlsxError) {
            console.error('Excel parsing error:', xlsxError);
            extractionError = `Failed to parse Excel file: ${xlsxError.message}`;
            extractedText = '';
          }
        } else {
          extractionError = `Unsupported file type: ${fileExtension}`;
          extractedText = '';
        }
      } catch (extractError) {
        console.error('General extraction error:', extractError);
        extractionError = `Error extracting text: ${extractError.message}`;
        extractedText = '';
      }
      
      // If extraction failed, provide a helpful message but don't include error details in text
      // that would confuse the AI. Instead, mark it as failed.
      if (extractionError && (!extractedText || extractedText.trim().length === 0)) {
        // For PDFs with images only, provide a note
        if (fileExtension === '.pdf' && extractionError.includes('empty')) {
          extractedText = `[This PDF file "${fileName}" appears to contain only images or is encrypted. The file has been uploaded and is available for reference, but text extraction was not possible. Please describe the content or ask specific questions about the document.]`;
        } else {
          extractedText = `[The document "${fileName}" was uploaded successfully but text extraction encountered an issue: ${extractionError}. The file is available for reference. If this is a PDF, it may be image-based, encrypted, or corrupted. Please try re-saving the document or provide a description of its contents.]`;
        }
      }
      
      // Ensure we always have some text, even if minimal
      if (!extractedText || extractedText.trim().length === 0) {
        extractedText = `[Document "${fileName}" uploaded successfully. Content extraction completed.]`;
      }

      processedDocuments.push({
        name: fileName,
        type: fileType,
        url: fileUrl,
        text: extractedText,
        pageCount: pageCount,
        size: fileBuffer.length
      });
    }

    return NextResponse.json({ documents: processedDocuments });
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to process documents" },
      { status: 500 }
    );
  }
}

