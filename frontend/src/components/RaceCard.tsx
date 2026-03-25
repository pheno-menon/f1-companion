import { useRef, useState } from "react";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
};

export default function RaceCard({ race }: any) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border rounded overflow-hidden">
      
      {/* Header */}
      <div
        className="p-4 cursor-pointer bg-202020 hover:bg-gray-200 hover:text-[#202020] transition"
        onClick={() => setOpen(!open)}
      >
        <h2 className="font-bold text-lg">{race.raceName}</h2>
      </div>

      {/* Animated Content */}
      <div
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <p>{race.circuit.name}</p>
        <p>
          {race.circuit.locality}, {race.circuit.country}
        </p>
        <p>Date: {formatDate(race.date)}</p>
      </div>
    </div>
  );
}