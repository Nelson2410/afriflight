import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ai, Type } from './_gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.GEMINI_API_KEY) {
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
      return res.status(200).json(data);
    } catch (e) {
      console.error('Erreur de parsing de la réponse de localisation:', e);
      return res.status(200).json({ city: 'Dakar', country: 'Sénégal', currency: 'XOF' });
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des infos de localisation:', error);
    return res.status(500).json({ error: 'Impossible de récupérer les informations de localisation.' });
  }
}
