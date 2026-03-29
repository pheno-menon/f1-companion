const BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getRaces = async () => {
  const res = await fetch(`${BASE_URL}/races`);
  return res.json();
};

export const getDrivers = async () => {
  const res = await fetch(`${BASE_URL}/drivers`);
  return res.json();
};

export const getConstructors = async () => {
  const res = await fetch(`${BASE_URL}/constructors`);
  return res.json();
};

export const getDriverStandings = async () => {
  const res = await fetch(`${BASE_URL}/driver-standings`);
  return res.json();
};
 
export const getConstructorStandings = async () => {
  const res = await fetch(`${BASE_URL}/constructor-standings`);
  return res.json();
};
