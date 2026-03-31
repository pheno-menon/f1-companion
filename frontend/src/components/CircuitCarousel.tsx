import { useEffect, useState } from "react";
import circuitsData from "../data/circuitsCurrent.json";
import fallback from "../assets/F1_White.svg";

const circuitImages = import.meta.glob(
  "../assets/circuits/*.svg",
  { eager: true }
);

type Circuit = {
  id: string;
  name: string;
  country: string;
  layoutId: string;
  svgPath: string;
  length: string;
  laps: number;
  fastestLap: {
    time: string;
    driver: string;
  };
};

export default function CircuitCarousel() {
  const [circuits, setCircuits] = useState<Circuit[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const enrichedCircuits = circuitsData.map((circuit: any) => {
      const imagePath = `../assets/circuits/${circuit.layoutId}.svg`;

      return {
        ...circuit,
        svgPath: (circuitImages[imagePath] as any)?.default || "",
      };
    });

    setCircuits(enrichedCircuits);
    setIndex(0);
  }, []);

  const prev = () => {
    if (circuits.length === 0) return;
    setIndex((i) => (i === 0 ? circuits.length - 1 : i - 1));
  };

  const next = () => {
    if (circuits.length === 0) return;
    setIndex((i) => (i === circuits.length - 1 ? 0 : i + 1));
  };

  if (circuits.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-400">
        Loading circuits...
      </div>
    );
  }

  return (
    <div className="mt-8 px-4">
      <div className="flex items-center justify-between mb-8">
      {/* LEFT BUTTON */}
      <button
        onClick={prev}
        className="bg-black/60 p-2 rounded-full"
      >
        ◀
      </button>

      {/* TITLE */}
      <h2 className="text-xl sm:text-2xl uppercase text-center tracking-widest font-bold flex-1">
        2026 F1 Circuit Information
      </h2>

      {/* RIGHT BUTTON */}
      <button
        onClick={next}
        className="bg-black/60 p-2 rounded-full"
      >
        ▶
      </button>
    </div>

      <div className="relative">

        {/* SLIDES */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {circuits.map((circuit) => (
              <div
                key={circuit.id}
                className="min-w-full grid grid-cols-1 md:grid-cols-[40%_60%] items-center px-2 md:px-0"
              >
                {/* LEFT: SVG */}
                <div className="p-4 rounded-2xl shadow-lg flex justify-center">
                  <div className="h-48 md:h-56 flex items-center justify-center">
                    <img
                      src={circuit.svgPath}
                      alt={circuit.name}
                      onError={(e) => {
                        e.currentTarget.src = fallback;
                      }}
                      className="w-full h-full object-contain invert"
                    />
                  </div>
                </div>

                {/* RIGHT: INFO */}
                <div className="space-y-4 mb-10 mt-6 md:mt-0 px-2 md:px-0">
                  <h3 className="text-2xl font-semibold">
                    {circuit.name}
                  </h3>

                  <p className="text-gray-400 capitalize">
                    {circuit.country.replaceAll("-", " ")}
                  </p>

                  {/* CIRCUIT STATS */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-[#1a1a1d] p-3 rounded-xl">
                      <p className="text-gray-400 text-sm">
                        Circuit Length
                      </p>
                      <p className="font-bold">{circuit.length}</p>
                    </div>

                    <div className="bg-[#1a1a1d] p-3 rounded-xl">
                      <p className="text-gray-400 text-sm">Laps</p>
                      <p className="font-bold">{circuit.laps}</p>
                    </div>

                    <div className="bg-[#1a1a1d] p-3 rounded-xl col-span-2">
                      <p className="text-gray-400 text-sm">
                        Fastest Lap
                      </p>
                      <p className="font-bold text-white">
                        {circuit.fastestLap.time}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {circuit.fastestLap.driver}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DOT INDICATORS */}
        <div className="flex justify-center mt-4 gap-2">
          {circuits.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-red-500" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}