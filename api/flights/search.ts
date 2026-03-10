import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai, Type } from '../_gemini';

type TripType = 'one-way' | 'round-trip';

interface Flight {
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
  type: TripType;
  bookingUrl: string;
}

interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: TripType;
  targetCurrency?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const {
    origin,
    destination,
    departureDate,
    returnDate,
    tripType,
    targetCurrency,
  } = req.body as FlightSearchRequest;

  if (!origin || !destination || !departureDate || !tripType) {
    return res.status(400).json({ error: 'Paramètres de recherche manquants.' });
  }

  try {
    const searchPrompt = `Search for available flights for a ${tripType} trip from ${origin} to ${destination} on ${departureDate}${
      returnDate ? ` returning on ${returnDate}` : ''
    }.

For each flight found, provide:
- Airline name and their official website domain (e.g., ethiopianairlines.com)
- Departure time and arrival time (HH:MM format)
- Flight duration
- Number of stops/layovers
- Price in ${targetCurrency || 'USD'}
- Direct booking URL on the airline's official website

Focus on airlines that operate African routes. Search multiple sources to verify prices.`;

    const searchResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = searchResponse.text || '';

    if (!rawText || rawText.trim().length < 50) {
      return res.status(200).json([]);
    }

    const parsePrompt = `Based on this flight search information, extract structured flight data:

${rawText}

Return a JSON array of flights. For each flight include:
- id
- airline
- domain
- logo
- origin
- destination
- departureTime
- arrivalTime
- duration
- price
- currency
- stops
- bookingUrl

If no clear flight data is available, return an empty array [].`;

    const parseResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: parsePrompt,
      config: {
        responseMimeType: 'application/json',
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
            required: [
              'id',
              'airline',
              'domain',
              'logo',
              'origin',
              'destination',
              'departureTime',
              'arrivalTime',
              'duration',
              'price',
              'currency',
              'stops',
              'bookingUrl',
            ],
          },
        },
      },
    });

    let flights: Flight[] = [];
    try {
      const parsed = JSON.parse(parseResponse.text || '[]') as Omit<Flight, 'type'>[];
      flights = parsed.map((f) => ({ ...f, type: tripType }));
    } catch (err) {
      console.error('Failed to parse flights JSON', err);
      flights = [];
    }

    res.status(200).json(flights);
  } catch (error) {
    console.error('Erreur lors de la recherche de vols:', error);
    res.status(500).json({ error: 'Impossible de récupérer les vols pour le moment.' });
  }
}
