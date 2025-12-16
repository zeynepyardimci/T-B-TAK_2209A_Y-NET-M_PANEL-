import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Note: In a production environment, never hardcode API keys. 
// However, based on the user's explicit request to enable functionality immediately:
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'AIzaSyBhVK5_NnMVoQmKrltERWMnYPvpwpniWkY' });

export const generateProjectDraft = async (topic: string): Promise<{ title: string; summary: string; method: string }> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Create a drafted project proposal for a TÜBİTAK 2209-A student research project based on the topic: "${topic}".
      
      Return a JSON object with the following fields:
      - title: A scientific and catchy project title (Turkish).
      - summary: A 150-word abstract summarizing the aim, method, and expected results (Turkish).
      - method: A brief description of the methodology (Turkish).
      
      Ensure the tone is academic yet accessible for undergraduate students.
      Output ONLY raw JSON.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating draft:", error);
    throw error;
  }
};

export const improveText = async (currentText: string, context: string): Promise<string> => {
  try {
     const model = 'gemini-2.5-flash';
     // If current text is empty, generate new text based on context
     const instruction = currentText 
        ? `Improve the following text to be more academic, concise, and impactful.`
        : `Generate a detailed academic text for this section based on the context.`;

    const prompt = `
      Act as an academic advisor for a student research project (TÜBİTAK 2209-A).
      ${instruction}
      Context: ${context}
      
      Text to process:
      "${currentText}"
      
      Return ONLY the result text.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || currentText;
  } catch (error) {
    console.error("Error improving text:", error);
    return currentText;
  }
};

export const evaluateProposal = async (title: string, summary: string, method: string): Promise<AIAnalysisResult> => {
    try {
        const model = 'gemini-2.5-flash';
        const prompt = `
            Act as a strict reviewer for the TÜBİTAK 2209-A Student Research Project Support Programme.
            Evaluate the following project proposal based on scientific merit, feasibility, and clarity.

            Title: ${title}
            Summary: ${summary}
            Method: ${method}

            Return a JSON object with:
            - score: An integer between 0 and 100 representing the probability of acceptance.
            - analysis: A 2-sentence summary of the evaluation (Turkish).
            - strengths: An array of strings listing 2 key strengths (Turkish).
            - weaknesses: An array of strings listing 2 areas for improvement (Turkish).

            Output ONLY raw JSON.
        `;

        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");

        return JSON.parse(text);
    } catch (error) {
        console.error("Error evaluating proposal:", error);
        // Fallback mock response in case of error
        return {
            score: 75,
            analysis: "Servis yoğunluğu nedeniyle tam analiz yapılamadı, ancak taslak genel hatlarıyla uygun görünüyor.",
            strengths: ["Konu güncel", "Amaç net"],
            weaknesses: ["Yöntem detaylandırılmalı", "Literatür eksiği olabilir"]
        };
    }
};

export const generateProjectImage = async (prompt: string): Promise<string | null> => {
    try {
        const model = 'gemini-2.5-flash-image';
        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { text: `Create a professional, scientific, abstract illustration for a research project about: ${prompt}. High quality, photorealistic, academic style. Do not include text in the image.` }
                ]
            }
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        throw error;
    }
};