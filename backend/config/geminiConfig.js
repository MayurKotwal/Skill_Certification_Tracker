const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Debug logging
console.log('Environment variables loaded from:', path.resolve(__dirname, '../../.env'));
console.log('Current environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'Set' : 'Not set'
});

// Check if API key is available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY is not set in environment variables');
  throw new Error('GEMINI_API_KEY is required');
}

console.log('Initializing Gemini AI...');

// Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configure the models with the correct model names
const visionModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro-vision',
  generationConfig: {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 2048,
  },
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
});

const textModel = genAI.getGenerativeModel({ 
  model: 'gemini-1.5-pro',
  generationConfig: {
    temperature: 0.4,
    topK: 32,
    topP: 1,
    maxOutputTokens: 2048,
  }
});

// Test connection function with better error handling
const testConnection = async () => {
  try {
    console.log('Testing Gemini AI connection...');
    const prompt = 'Test connection';
    const result = await textModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini AI connection test successful. Response:', text);
    return true;
  } catch (error) {
    console.error('Gemini AI connection test failed:', error);
    if (error.message.includes('API key')) {
      throw new Error('Invalid or unauthorized API key. Please check your Gemini API key.');
    }
    throw error;
  }
};

// Test the connection immediately
testConnection().catch(error => {
  console.warn('Warning: Initial Gemini AI connection test failed:', error.message);
});

module.exports = {
  visionModel,
  textModel,
  testConnection
}; 