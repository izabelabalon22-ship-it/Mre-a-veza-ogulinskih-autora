/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { Author, Connection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function suggestConnections(newAuthor: Author, existingAuthors: Author[]): Promise<Connection[]> {
  const prompt = `
    Analiziraš mrežu autora koji pišu o Ogulinu. 
    Novi autor: ${newAuthor.name}, motives: ${newAuthor.motives.join(', ')}.
    Postojeći autori: ${existingAuthors.map(a => `${a.name} (motives: ${a.motives.join(', ')})`).join('; ')}.
    
    Predloži do 3 veze (konekcije) između novog autora i postojećih na temelju njihovih motiva ili povijesnog konteksta.
    Vrati rezultat isključivo kao JSON listu objekata s poljima: source (uvijek "${newAuthor.id}"), target (id postojećeg autora), type ("influence", "theme" ili "collaboration"), description (kratki opis na hrvatskom jeziku).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING },
              target: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["influence", "theme", "collaboration"] },
              description: { type: Type.STRING }
            },
            required: ["source", "target", "type", "description"]
          }
        }
      }
    });

    const text = response.text || '[]';
    return JSON.parse(text);
  } catch (error) {
    console.error("Error suggesting connections:", error);
    return [];
  }
}
