import { GoogleGenAI } from "@google/genai";
import { HealthRecord } from "../types";

const SYSTEM_INSTRUCTION = `
You are an empathetic, professional, and private health assistant. 
Your goal is to analyze the user's daily health logs and provide brief, encouraging, and actionable insights.
Focus on patterns in sleep, diet, pain, and cycle tracking.
Do not provide medical diagnosis. Always suggest consulting a doctor for severe pain or issues.
Keep responses short (under 100 words) and easy to read on a mobile device.
`;

export const analyzeHealthData = async (records: HealthRecord[], query?: string): Promise<string> => {
  try {
    if (!process.env.API_KEY) {
      return "请配置 API Key 以使用智能分析功能。";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Prepare a summary of the last 7 days for context
    const recentRecords = records.slice(0, 7).map(r => ({
      date: r.id,
      sleep: r.sleep,
      diet: r.diet,
      exercise: r.exercise,
      pain: r.pain,
      mood: r.mood,
      notes: r.notes
    }));

    const prompt = query 
      ? `User Question: ${query}\n\nContext (Last 7 days): ${JSON.stringify(recentRecords)}`
      : `Analyze these recent health records and give me a daily summary or advice: ${JSON.stringify(recentRecords)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "无法生成分析，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "分析服务暂时不可用。";
  }
};