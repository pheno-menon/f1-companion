import { useEffect, useState } from "react";
import { getRaces } from "../services/api";
import RaceCard from "../components/RaceCard";

export default function Races() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    getRaces().then(setRaces);
  }, []);

  return (
    <div>
      <div className="text-center m-6 mb-8">
        <h1 className="text-4xl font-bold">2026 F1 Race Calendar</h1>
      </div>
      <div className="grid gap-4">
        {races.map((race: any) => (
          <RaceCard key={race._id} race={race} />
        ))}
      </div>
    </div>
  );
}