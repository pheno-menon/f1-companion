const BASE_URL = "/api";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const getRaces = (season = "2026") =>
  fetchJson<any[]>(`${BASE_URL}/races?season=${season}`);

export const getDrivers = () =>
  fetchJson<any[]>(`${BASE_URL}/drivers`);

export const getConstructors = () =>
  fetchJson<any[]>(`${BASE_URL}/constructors`);

export const getDriverStandings = (season = "2026") =>
  fetchJson<any[]>(`${BASE_URL}/driver-standings?season=${season}`);

export const getConstructorStandings = (season = "2026") =>
  fetchJson<any[]>(`${BASE_URL}/constructor-standings?season=${season}`);

export const getCircuits = () =>
  fetchJson<any[]>(`${BASE_URL}/circuits/current`);

export interface ResultSummary {
  season: string;
  round: number;
  resultKey: string;
  raceName: string;
  has_sprint: boolean;
}

export const getResults = (season = "2026") =>
  fetchJson<ResultSummary[]>(`${BASE_URL}/results?season=${season}`);

export const getRaceResult = (season: string, round: number) =>
  fetchJson<any>(`${BASE_URL}/results/${season}/${round}`);