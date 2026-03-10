import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
// Utiliser un port différent de celui de Vite (qui est souvent 3000 ou 5173)
const port = process.env.PORT || 3001;

// Initialisation du client Gemini côté serveur
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  console.warn(
    '[AfriFlights] Avertissement: GEMINI_API_KEY est manquant. Les routes IA retourneront des erreurs 500.'
  );
}

const ai = new GoogleGenAI({
  apiKey: geminiApiKey || '',
});

app.use(cors());
app.use(express.json());

// --- Types partagés (mirrors frontend) ---

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

interface CurrencyConvertRequest {
  amount: number;
  from: string;
  to: string;
}

interface Agency {
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  url?: string;
}

// --- Routes basiques ---

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Le serveur backend fonctionne correctement !' });
});

// --- Routes IA : vols ---

app.post('/api/flights/search', async (req, res) => {
  if (!geminiApiKey) {
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
      return res.json([]);
    }

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

    res.json(flights);
  } catch (error) {
    console.error('Erreur lors de la recherche de vols:', error);
    res.status(500).json({ error: 'Impossible de récupérer les vols pour le moment.' });
  }
});

// --- Route IA : conversion de devises ---

app.post('/api/currency/convert', async (req, res) => {
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const { amount, from, to } = req.body as CurrencyConvertRequest;

  if (!amount || !from || !to) {
    return res.status(400).json({ error: 'Paramètres de conversion manquants.' });
  }

  const prompt = `What is the current real-time exchange rate from ${from} to ${to}? 
Calculate ${amount} ${from} in ${to}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rate: {
              type: Type.NUMBER,
              description: 'The exchange rate from source to target currency',
            },
            convertedAmount: {
              type: Type.NUMBER,
              description: 'The calculated amount in the target currency',
            },
          },
          required: ['rate', 'convertedAmount'],
        },
      },
    });

    const text = response.text || '{}';
    const data = JSON.parse(text) as { rate?: number; convertedAmount?: number };

    if (typeof data.rate !== 'number' || typeof data.convertedAmount !== 'number') {
      return res.status(500).json({ error: 'Réponse invalide du service de conversion.' });
    }

    res.json({
      amount: data.convertedAmount,
      rate: data.rate,
    });
  } catch (error) {
    console.error('Currency conversion failed:', error);
    res.status(500).json({ error: 'Impossible de convertir la devise pour le moment.' });
  }
});

// --- Routes IA : agences & localisation ---

app.get('/api/agencies/nearby', async (req, res) => {
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);
  const radiusKm = req.query.radiusKm ? Number(req.query.radiusKm) : 2;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'Coordonnées géographiques invalides.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Trouve les agences de voyages situées dans un rayon de ${radiusKm}km autour des coordonnées ${lat}, ${lng}.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) {
      return res.json([]);
    }

    const agencies: Agency[] = chunks.map((chunk: any) => ({
      name: chunk.maps?.title || 'Agence de voyage',
      address: chunk.maps?.uri || '',
      url: chunk.maps?.uri,
    }));

    res.json(agencies);
  } catch (error) {
    console.error('Erreur lors de la récupération des agences à proximité:', error);
    res.status(500).json({ error: 'Impossible de récupérer les agences à proximité.' });
  }
});

app.get('/api/agencies/city', async (req, res) => {
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const city = String(req.query.city || '').trim();

  if (!city) {
    return res.status(400).json({ error: 'Ville manquante.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Liste toutes les agences de voyages à ${city}.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) {
      return res.json([]);
    }

    const agencies: Agency[] = chunks.map((chunk: any) => ({
      name: chunk.maps?.title || 'Agence de voyage',
      address: chunk.maps?.uri || '',
      url: chunk.maps?.uri,
    }));

    res.json(agencies);
  } catch (error) {
    console.error('Erreur lors de la récupération des agences de ville:', error);
    res.status(500).json({ error: 'Impossible de récupérer les agences pour cette ville.' });
  }
});

app.get('/api/location-info', async (req, res) => {
  if (!geminiApiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY non configurée sur le serveur.' });
  }

  const lat = Number(req.query.lat);
  const lng = Number(req.query.lng);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.status(400).json({ error: 'Coordonnées géographiques invalides.' });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Quelle est la ville, le pays et la devise locale pour les coordonnées ${lat}, ${lng}? Réponds au format JSON.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            country: { type: Type.STRING },
            currency: {
              type: Type.STRING,
              description: 'Code de la devise (ex: XOF, EUR, USD, NGN)',
            },
          },
          required: ['city', 'country', 'currency'],
        },
      },
    });

    try {
      const data = JSON.parse(response.text || '{}') as {
        city: string;
        country: string;
        currency: string;
      };
      res.json(data);
    } catch (e) {
      console.error('Erreur de parsing de la réponse de localisation:', e);
      res.json({ city: 'Dakar', country: 'Sénégal', currency: 'XOF' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des infos de localisation:', error);
    res.status(500).json({ error: 'Impossible de récupérer les informations de localisation.' });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré en mode développement sur http://localhost:${port}`);
});
