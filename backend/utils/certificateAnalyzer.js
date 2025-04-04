const sharp = require('sharp');
const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const { visionModel, textModel } = require('../config/geminiConfig');

// Function to extract text from PDF
async function extractTextFromPDF(pdfBuffer) {
  try {
    console.log('Starting PDF text extraction...');
    const data = await pdfParse(pdfBuffer);
    console.log('PDF text extracted successfully');
    return data.text;
  } catch (error) {
    console.error('Error in extractTextFromPDF:', error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
}

// Function to process image for Gemini AI
async function processImageForAI(imageBuffer) {
  try {
    console.log('Starting image processing...');
    const processedImage = await sharp(imageBuffer)
      .resize(1024, 1024, { fit: 'inside' })
      .toFormat('png')
      .toBuffer();
    
    console.log('Image processed successfully');
    return processedImage;
  } catch (error) {
    console.error('Error in processImageForAI:', error);
    throw new Error(`Failed to process image: ${error.message}`);
  }
}

// Function to ensure response is valid JSON
async function getValidJSONResponse(model, prompt, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Attempt ${i + 1} to get valid JSON response...`);
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      console.log('Raw response:', response);
      
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        return JSON.parse(jsonStr);
      }
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
    }
  }
}

// Function to analyze certificate content
async function analyzeCertificate(fileBuffer, fileType, userInput) {
  try {
    console.log(`Starting certificate analysis for file type: ${fileType}`);
    console.log('User input:', userInput);

    if (!fileBuffer) {
      throw new Error('No file buffer provided');
    }

    if (!fileType) {
      throw new Error('File type not specified');
    }

    if (!['pdf', 'image'].includes(fileType)) {
      throw new Error(`Invalid file type: ${fileType}`);
    }

    const prompt = `You are a certificate analyzer AI. Your task is to analyze the provided certificate and return ONLY a JSON object with the specified structure. Do not include any additional text or explanations.

IMPORTANT: Your response must be a valid JSON object with exactly this structure:
{
  "extracted_info": {
    "title": "exact certificate title",
    "issuer": "issuing organization name",
    "issue_date": "YYYY-MM-DD",
    "credential_id": "ID if present, or null"
  },
  "validation": {
    "matches": ["exact matches with user input"],
    "discrepancies": ["any differences found"]
  },
  "suggested_skills": ["skill1", "skill2", "skill3"],
  "category": "most appropriate category"
}

Remember:
- Return ONLY the JSON object
- Include ALL required fields
- Use null for missing values
- Format dates as YYYY-MM-DD
- Ensure arrays are never null (use empty array if none)

User provided information for comparison:
${JSON.stringify(userInput, null, 2)}

`;

    let content;
    let result;

    if (fileType === 'pdf') {
      console.log('Processing PDF file...');
      try {
        content = await extractTextFromPDF(fileBuffer);
        console.log('PDF content extracted, length:', content.length);
        
        const pdfPrompt = prompt + `\n\nAnalyze this certificate text:\n${content}`;
        result = await getValidJSONResponse(textModel, pdfPrompt);
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw new Error(`PDF processing failed: ${pdfError.message}`);
      }
    } else {
      console.log('Processing image file...');
      try {
        const processedImage = await processImageForAI(fileBuffer);
        const imageBase64 = processedImage.toString('base64');

        const imagePart = {
          inlineData: {
            data: imageBase64,
            mimeType: 'image/png'
          }
        };

        console.log('Sending image to Gemini AI Vision model...');
        result = await getValidJSONResponse(visionModel, [prompt, imagePart]);
      } catch (imageError) {
        console.error('Image processing error:', imageError);
        throw new Error(`Image processing failed: ${imageError.message}`);
      }
    }

    // Validate the result structure
    if (!result || !result.extracted_info || !result.validation || !result.suggested_skills) {
      console.error('Invalid result structure:', result);
      throw new Error('AI returned invalid response structure');
    }

    return result;
  } catch (error) {
    console.error('Error in analyzeCertificate:', error);
    console.error('Stack trace:', error.stack);
    throw new Error(`Failed to analyze certificate: ${error.message}`);
  }
}

// Function to validate certificate authenticity
async function validateCertificateAuthenticity(analysis) {
  try {
    console.log('Starting certificate authenticity validation...');
    
    const prompt = `You are a certificate validator AI. Return ONLY a JSON object with the specified structure. Do not include any additional text.

IMPORTANT: Your response must be a valid JSON object with exactly this structure:
{
  "authenticity_score": 0.95,
  "confidence_level": "high",
  "flags": [],
  "recommendations": []
}

Rules:
- authenticity_score must be a number between 0 and 1
- confidence_level must be exactly "high", "medium", or "low"
- flags and recommendations must be arrays (use empty array if none)
- Return ONLY the JSON object, no other text

Analysis to evaluate:
${JSON.stringify(analysis, null, 2)}`;

    return await getValidJSONResponse(textModel, prompt);
  } catch (error) {
    console.error('Error in validateCertificateAuthenticity:', error);
    console.error('Stack trace:', error.stack);
    throw new Error(`Failed to validate certificate authenticity: ${error.message}`);
  }
}

module.exports = {
  analyzeCertificate,
  validateCertificateAuthenticity
}; 