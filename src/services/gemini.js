import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error("Missing VITE_GEMINI_API_KEY in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy_key");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const generateExplanation = async (topic) => {
    try {
        const prompt = `
      Explain "${topic}" in a simple, engaging way for a learner. 
      Break it down into 3-5 distinct parts or steps.
      Return ONLY a JSON array of objects, where each object has a "title" and "content" property.
      Example format:
      [
        { "title": "Introduction", "content": "..." },
        { "title": "Key Concept", "content": "..." }
      ]
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Raw Response:", text); // Debugging

        // Robust JSON extraction
        const jsonMatch = text.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.warn("JSON Parse failed, falling back to text", e);
            // Fallback if JSON fails
            return [{
                title: "Explanation",
                content: text.replace(/```json/g, '').replace(/```/g, '')
            }];
        }
    } catch (error) {
        console.error("Error generating explanation:", error);
        throw error;
    }
};

export const generateClarification = async (topic, confusion) => {
    try {
        const prompt = `
      The user is learning about "${topic}" and is confused about: "${confusion}".
      Provide a specific clarification to help them understand.
      Return ONLY a JSON object with "title" and "content".
      Example format:
      { "title": "Clarification", "content": "..." }
      Do not include markdown formatting.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Clarification Response:", text); // Debugging

        const jsonMatch = text.match(/\{.*\}/s);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return {
                title: "Clarification",
                content: text.replace(/```json/g, '').replace(/```/g, '')
            };
        }
    } catch (error) {
        console.error("Error generating clarification:", error);
        throw error;
    }
};

export const generateQuizQuestions = async (topic, numQuestions = 3) => {
    try {
        const prompt = `
      Create ${numQuestions} quiz questions about "${topic}" for a learner.
      Mix multiple choice and true/false questions.
      Return ONLY a JSON array of question objects.
      Each object must have:
      - "question": the question text
      - "type": either "multiple_choice" or "true_false"
      - "options": array of answer options (4 for multiple choice, 2 for true/false: ["True", "False"])
      - "correctAnswer": the correct option (exact match from options array)
      - "explanation": brief explanation of why the answer is correct
      
      Example format:
      [
        {
          "question": "What is photosynthesis?",
          "type": "multiple_choice",
          "options": ["A process plants use to make food", "A type of cell", "A chemical reaction", "An animal behavior"],
          "correctAnswer": "A process plants use to make food",
          "explanation": "Photosynthesis is the process by which plants convert light energy into chemical energy (food)."
        },
        {
          "question": "Photosynthesis requires sunlight.",
          "type": "true_false",
          "options": ["True", "False"],
          "correctAnswer": "True",
          "explanation": "Photosynthesis requires sunlight as the energy source to convert CO2 and water into glucose."
        }
      ]
      Do not include markdown formatting. Just the raw JSON array.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Gemini Quiz Response:", text);

        // Extract JSON array
        const jsonMatch = text.match(/\[.*\]/s);
        const jsonString = jsonMatch ? jsonMatch[0] : text;

        try {
            const questions = JSON.parse(jsonString);
            // Validate structure
            if (Array.isArray(questions) && questions.length > 0) {
                return questions;
            }
            throw new Error("Invalid quiz format");
        } catch (e) {
            console.warn("Quiz JSON parse failed", e);
            // Fallback quiz
            return [{
                question: `What is the main concept of ${topic}?`,
                type: "true_false",
                options: ["True", "False"],
                correctAnswer: "True",
                explanation: "This is a basic understanding check."
            }];
        }
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw error;
    }
};
