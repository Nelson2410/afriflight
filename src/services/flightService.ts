import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export interface Flight {
  id: string;
  airline: string;
  domain: string;
  logo: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
  type: 'one-way' | 'round-trip';
  bookingUrl: string;
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  targetCurrency?: string;
}): Promise<Flight[]> {

  // Step 1: Use Google Search grounding to find real flight data (returns plain text)
  const searchPrompt = `Search for available flights for a ${params.tripType} trip from ${params.origin} to ${params.destination} on ${params.departureDate}${params.returnDate ? ` returning on ${params.returnDate}` : ''}.
  
  For each flight found, provide:
  - Airline name and their official website domain (e.g., ethiopianairlines.com)
  - Departure time and arrival time (HH:MM format)
  - Flight duration
  - Number of stops/layovers
  - Price in ${params.targetCurrency || 'USD'}
  - Direct booking URL on the airline's official website
  
  Focus on airlines that operate African routes. Search multiple sources to verify prices.`;

  const searchResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: searchPrompt,
    config: {
      tools: [{ googleSearch: {} }],
    }
  });

  const rawText = searchResponse.text || "";

  if (!rawText || rawText.trim().length < 50) {
    return [];
  }

  // Step 2: Parse the raw text into structured JSON
  const parsePrompt = `Based on this flight search information, extract structured flight data:

${rawText}

Return a JSON array of flights. For each flight include:
- id: a unique string
- airline: full airline name
- domain: official airline website domain only (e.g., "ethiopianairlines.com")
- logo: URL to the airline's logo image (use https://logo.clearbit.com/[domain] format)
- origin: departure city name
- destination: arrival city name
- departureTime: HH:MM format
- arrivalTime: HH:MM format
- duration: e.g., "3h 45m"
- price: numeric price value
- currency: currency code (e.g., "USD", "EUR", "XOF")
- stops: number of stops (0 for direct)
- bookingUrl: the official airline booking URL

If no clear flight data is available, return an empty array [].`;

  const parseResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: parsePrompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            airline: { type: Type.STRING },
            domain: { type: Type.STRING },
            logo: { type: Type.STRING },
            origin: { type: Type.STRING },
            destination: { type: Type.STRING },
            departureTime: { type: Type.STRING },
            arrivalTime: { type: Type.STRING },
            duration: { type: Type.STRING },
            price: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            stops: { type: Type.INTEGER },
            bookingUrl: { type: Type.STRING },
          },
          required: ["id", "airline", "domain", "logo", "origin", "destination", "departureTime", "arrivalTime", "duration", "price", "currency", "stops", "bookingUrl"]
        }
      }
    }
  });

  try {
    const flights = JSON.parse(parseResponse.text || "[]");
    return flights.map((f: any) => ({ ...f, type: params.tripType }));
  } catch (e) {
    console.error("Failed to parse flights JSON", e);
    return [];
  }
}
