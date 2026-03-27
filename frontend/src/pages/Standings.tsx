import { useEffect, useState } from "react";
import { getDriverStandings, getConstructorStandings } from "../services/api";

// F1 2026 team colors
const CONSTRUCTOR_COLORS: Record<string, string> = {
  mclaren: "#FF8000",
  ferrari: "#E8002D",
  mercedes: "#27F4D2",
  red_bull: "#3671C6",
  aston_martin: "#229971",
  williams: "#64C4FF",
  alpine: "#FF87BC",
  rb: "#6692FF",
  haas: "#B6BABD",
  audi: "#B3B4B4",
};

interface DriverStanding {
  _id: string;
  position: number;
  points: number;
  wins: number;
  driver: {
    driverId: string;
    driverNumber: number;
    driverCode: string;
    driverGivenName: string;
    driverFamilyName: string;
    driverNationality: string;
  };
  constructorInfo: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

interface ConstructorStanding {
  _id: string;
  position: number;
  points: number;
  wins: number;
  constructorInfo: {
    constructorId: string;
    name: string;
    nationality: string;
  };
}

function PositionBadge({ position }: { position: number }) {
  const base = "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm shrink-0";
  if (position === 1) return <span className={`${base} bg-yellow-400 text-black`}>1</span>;
  if (position === 2) return <span className={`${base} bg-gray-300 text-black`}>2</span>;
  if (position === 3) return <span className={`${base} bg-amber-600 text-white`}>3</span>;
  return <span className={`${base} bg-[#2a2a2a] text-gray-300`}>{position}</span>;
}

function TeamColorBar({ constructorId }: { constructorId: string }) {
  const color = CONSTRUCTOR_COLORS[constructorId] ?? "#555";
  return <div className="w-1 self-stretch rounded-full shrink-0" style={{ backgroundColor: color }} />;
}

function DriverStandingsTable({ standings }: { standings: DriverStanding[] }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_auto_auto_auto] gap-4 items-center px-4 py-2 text-xs text-gray-400 uppercase tracking-widest">
        <span>Pos</span>
        <span>Driver</span>
        <span className="text-right">Team</span>
        <span className="text-right w-10">Wins</span>
        <span className="text-right w-11">Points</span>
      </div>

      {standings.map((s) => (
        <div
          key={s._id}
          className="grid grid-cols-[2rem_1fr_auto_auto_auto] gap-4 items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 hover:border-[#444] transition-colors"
        >
          <PositionBadge position={s.position} />

          <div className="flex items-center gap-3 min-w-0">
            <TeamColorBar constructorId={s.constructorInfo.constructorId} />
            <div className="min-w-0">
              <p className="font-semibold truncate">
                <span className="text-gray-400 font-normal">{s.driver.driverGivenName} </span>
                {s.driver.driverFamilyName}
              </p>
              <p className="text-xs text-gray-500">{s.driver.driverNationality}</p>
            </div>
          </div>

          <span className="text-sm text-gray-300 text-right whitespace-nowrap">{s.constructorInfo.name}</span>
          <span className="text-sm text-gray-300 text-right w-10">{s.wins}</span>
          <span className="font-bold text-right w-11">{s.points}</span>
        </div>
      ))}
    </div>
  );
}

function ConstructorStandingsTable({ standings }: { standings: ConstructorStanding[] }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-[2rem_1fr_auto_auto] gap-4 items-center px-4 py-2 text-xs text-gray-400 uppercase tracking-widest">
        <span>Pos</span>
        <span>Constructor</span>
        <span className="text-right w-10">Wins</span>
        <span className="text-right w-11">Points</span>
      </div>

      {standings.map((s) => (
        <div
          key={s._id}
          className="grid grid-cols-[2rem_1fr_auto_auto] gap-4 items-center bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-3 hover:border-[#444] transition-colors"
        >
          <PositionBadge position={s.position} />

          <div className="flex items-center gap-3 min-w-0">
            <TeamColorBar constructorId={s.constructorInfo.constructorId} />
            <div>
              <p className="font-semibold">{s.constructorInfo.name}</p>
              <p className="text-xs text-gray-500">{s.constructorInfo.nationality}</p>
            </div>
          </div>

          <span className="text-sm text-gray-300 text-right w-10">{s.wins}</span>
          <span className="font-bold text-right w-11">{s.points}</span>
        </div>
      ))}
    </div>
  );
}

type Tab = "drivers" | "constructors";

export default function Standings() {
  const [tab, setTab] = useState<Tab>("drivers");
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [drivers, constructors] = await Promise.all([
          getDriverStandings(),
          getConstructorStandings(),
        ]);
        setDriverStandings(drivers);
        setConstructorStandings(constructors);
      } catch {
        setError("Failed to load standings. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">2026 F1 Standings</h1>

      {/* Tabs */}
      <div className="flex mb-6 border border-[#2a2a2a] rounded overflow-hidden">
        {(["drivers", "constructors"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 text-sm font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
              tab === t
                ? "bg-[#e10600] text-white"
                : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <p className="text-center text-gray-400 py-12">Loading standings...</p>
      )}

      {error && (
        <p className="text-center text-red-400 py-12">{error}</p>
      )}

      {!loading && !error && tab === "drivers" && (
        <DriverStandingsTable standings={driverStandings} />
      )}

      {!loading && !error && tab === "constructors" && (
        <ConstructorStandingsTable standings={constructorStandings} />
      )}
    </div>
  );
}