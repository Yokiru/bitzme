import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyCcAGH0c2gI7mzo0jwUtjG449urWiOI5VI";

const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    console.log(`Testing model: ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Say hello");
        const response = await result.response;
        console.log(`SUCCESS: ${modelName} responded:`, response.text());
        return true;
    } catch (error) {
        console.error(`FAILED: ${modelName} error:`, error.message);
        return false;
    }
}

async function runTests() {
    console.log("Starting API Key Test...");

    // Try the latest flash model first (fastest, free tier eligible)
    await testModel("gemini-1.5-flash");

    // Try the standard pro model
    await testModel("gemini-pro");

    // Try gemini-1.0-pro just in case
    await testModel("gemini-1.0-pro");
}

runTests();
