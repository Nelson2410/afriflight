const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface Agency {
  name: string;
  address: string;
  rating?: number;
  phone?: string;
  url?: string;
}

export async function getNearbyAgencies(lat: number, lng: number, radiusKm: number = 2): Promise<Agency[]> {
  const url = new URL(`${API_BASE_URL}/api/agencies/nearby`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lng', String(lng));
  url.searchParams.set('radiusKm', String(radiusKm));

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error('Failed to fetch nearby agencies', response.status);
    throw new Error("Impossible de récupérer les agences à proximité.");
  }

  const data = (await response.json()) as Agency[];
  return Array.isArray(data) ? data : [];
}

export async function getCityAgencies(city: string): Promise<Agency[]> {
  const url = new URL(`${API_BASE_URL}/api/agencies/city`);
  url.searchParams.set('city', city);

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error('Failed to fetch city agencies', response.status);
    throw new Error("Impossible de récupérer les agences pour cette ville.");
  }

  const data = (await response.json()) as Agency[];
  return Array.isArray(data) ? data : [];
}

export async function getUserLocationInfo(lat: number, lng: number): Promise<{ city: string; country: string; currency: string }> {
  const url = new URL(`${API_BASE_URL}/api/location-info`);
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lng', String(lng));

  const response = await fetch(url.toString());
  if (!response.ok) {
    console.error('Failed to fetch user location info', response.status);
    throw new Error("Impossible de récupérer les informations de localisation.");
  }

  const data = (await response.json()) as { city: string; country: string; currency: string };
  return data;
}
