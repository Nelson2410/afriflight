import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai } from '../_gemini';

interface Agency {
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  url?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
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

    // @ts-ignore
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (!chunks) {
      return res.status(200).json([]);
    }

    const agencies: Agency[] = chunks.map((chunk: any) => ({
      name: chunk.maps?.title || 'Agence de voyage',
      address: chunk.maps?.uri || '',
      url: chunk.maps?.uri,
    }));

    return res.status(200).json(agencies);
  } catch (error) {
    console.error('Erreur lors de la récupération des agences de ville:', error);
    return res.status(500).json({ error: 'Impossible de récupérer les agences pour cette ville.' });
  }
}