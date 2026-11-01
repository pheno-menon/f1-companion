import { useEffect, useState } from "react";
import { getRaces } from "../services/api";
import RaceCard from "../components/RaceCard";

export default function Races() {
  const [races, setRaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getRaces("2026")
      .then(setRaces)
      .catch(() => setError("Failed to load the race calendar."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="text-center m-6 mb-8">
        <h1 className="mt-8 text-4xl font-semi-bold uppercase tracking-widest">
          2026 F1 Race Calendar
        </h1>
      </div>

      {loading && (
        <p className="text-center text-gray-400">Loading races...</p>
      )}

      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {!loading && !error && (
        <div className="flex flex-col items-center gap-4">
          {races.map((race) => (
            <div key={race._id} className="w-full sm:w-1/2 lg:w-1/3">
              <RaceCard race={race} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}