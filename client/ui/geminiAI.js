import { GoogleGenerativeAI } from "@google/generative-ai";

export const getEmailsClassified = async (apiKey) => {
  const genAI = new GoogleGenerativeAI(apiKey, prompt);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
  } catch (err) {
    console.log(err);
  }
};
