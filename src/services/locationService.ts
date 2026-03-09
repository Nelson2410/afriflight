import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface Agency {
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  url?: string;
}

export async function getNearbyAgencies(lat: number, lng: number, radiusKm: number = 2): Promise<Agency[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Trouve les agences de voyages situées dans un rayon de ${radiusKm}km autour des coordonnées ${lat}, ${lng}.`,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng
          }
        }
      }
    }
  });

  // Extract from grounding metadata if available, otherwise fallback to text parsing
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    return chunks.map((chunk: any) => ({
      name: chunk.maps?.title || "Agence de voyage",
      address: chunk.maps?.uri || "",
      url: chunk.maps?.uri
    }));
  }

  return [];
}

export async function getCityAgencies(city: string): Promise<Agency[]> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Liste toutes les agences de voyages à ${city}.`,
    config: {
      tools: [{ googleMaps: {} }]
    }
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks) {
    return chunks.map((chunk: any) => ({
      name: chunk.maps?.title || "Agence de voyage",
      address: chunk.maps?.uri || "",
      url: chunk.maps?.uri
    }));
  }

  return [];
}

export async function getUserLocationInfo(lat: number, lng: number): Promise<{ city: string; country: string; currency: string }> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Quelle est la ville, le pays et la devise locale pour les coordonnées ${lat}, ${lng}? Réponds au format JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          currency: { type: Type.STRING, description: "Code de la devise (ex: XOF, EUR, USD, NGN)" }
        },
        required: ["city", "country", "currency"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return { city: "Dakar", country: "Sénégal", currency: "XOF" };
  }
}
