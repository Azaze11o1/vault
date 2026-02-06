
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getTreasurerComment(balance: number, change: number, vaultName: string): Promise<string> {
  if (!process.env.API_KEY) return `The ${vaultName} awaits your gold, sire.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are the Royal Treasurer of a medieval kingdom. You are currently looking at the "${vaultName}". 
      The current balance of this specific vault is ${balance} pieces. The user just added or removed ${change} pieces. 
      Give a short, witty, 1-sentence medieval comment about this transaction. 
      If they are rich, be sycophantic. If they are poor, be slightly concerned or judgmental but loyal.
      Mention the vault name if it makes sense.
      Keep it strictly under 15 words.`,
      config: {
          temperature: 0.8,
      }
    });
    return response.text || "A fine addition to the royal coffers!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The ledgers remain true, m'lord.";
  }
}
