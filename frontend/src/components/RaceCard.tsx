import { useState } from "react";

export default function RaceCard({ race }: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border p-4 rounded" onClick={() => setOpen(!open)}>
      <h2 className="font-bold text-lg">{race.raceName}</h2>

      {open && (
        <div className="mt-2">
          <p>{race.circuit.name}</p>
          <p>{race.circuit.locality}, {race.circuit.country}</p>
          <p>Date: {race.date}</p>
        </div>
      )}
    </div>
  );
}