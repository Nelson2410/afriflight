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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  tripType: 'one-way' | 'round-trip';
  targetCurrency?: string;
}): Promise<Flight[]> {
  const response = await fetch(`${API_BASE_URL}/api/flights/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    console.error('Flight search failed with status', response.status);
    throw new Error('La recherche de vols a échoué. Veuillez réessayer plus tard.');
  }

  const data = (await response.json()) as Flight[];
  return Array.isArray(data) ? data : [];
}
