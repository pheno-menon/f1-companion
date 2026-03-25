import { useEffect, useState } from "react";
import { getRaces } from "../services/api";
import RaceCard from "../components/RaceCard";

export default function Races() {
  const [races, setRaces] = useState([]);

  useEffect(() => {
    getRaces().then(setRaces);
  }, []);

  return (
    <div className="grid gap-4">
      {races.map((race: any) => (
        <RaceCard key={race._id} race={race} />
      ))}
    </div>
  );
}