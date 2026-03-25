const BASE_URL = "http://localhost:5000/api";

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