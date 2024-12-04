const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyAVwnWVhqWsZ2pFfQIRctMEHvX8j9WwCj8";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Generate Travel Plan",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const translateToEN = async (text: string) => {
  const chatSession = model.startChat({
    generationConfig,
  });
 const prompt = `translate ${text} into Chinese in JSON format {en: ${text}, zh: ""}`
  const result = await chatSession.sendMessage(prompt);
  return JSON.parse(result.response.text());
};
