const { GoogleGenerativeAI } = require('@google/generative-ai');

// Check if API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is required');
}

console.log('Initializing Gemini AI...');

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure the model
const modelConfig = {
  model: 'gemini-pro-vision',
  safetySettings: [
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
};

try {
  console.log('Creating Gemini AI model instances...');
  // Create model instances
  const visionModel = genAI.getGenerativeModel(modelConfig);
  const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
  console.log('Gemini AI models created successfully');

  module.exports = {
    visionModel,
    textModel,
  };
} catch (error) {
  console.error('Error initializing Gemini AI models:', error);
  throw error;
} 