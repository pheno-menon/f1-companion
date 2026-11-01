import { useEffect, useMemo, useState } from "react";
import {
  getResults,
  getRaceResult,
  type ResultSummary
} from "../services/api";

type SessionType =
  | "qualifying"
  | "race"
  | "sprint"
  | "sprint_qualifying";

type Entry = {
  position: string;
  driver: string;
  constructor: string;
  time?: string;
  points?: string;
  laps?: string;
  grid?: string;
  qualifying_times?: {
    Q1?: string;
    Q2?: string;
    Q3?: string;
  };
};

type ResultData = {
  has_sprint: boolean;
  qualifying_classification?: Entry[];
  race_classification?: Entry[];
  sprint_classification?: Entry[];
  sprint_qualifying_classification?: Entry[];
};

type SessionDataKey =
  | "qualifying_classification"
  | "race_classification"
  | "sprint_classification"
  | "sprint_qualifying_classification";

const sessionKeyMap: Record<SessionType, SessionDataKey> = {
  qualifying: "qualifying_classification",
  race: "race_classification",
  sprint: "sprint_classification",
  sprint_qualifying: "sprint_qualifying_classification"
};

export default function Results() {
  const [races, setRaces] = useState<ResultSummary[]>([]);
  const [selectedRound, setSelectedRound] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] =
    useState<SessionType>("race");

  const [data, setData] = useState<ResultData | null>(null);
  const [loadingRaces, setLoadingRaces] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getResults("2026")
      .then((items) => {
        setRaces(items);

        if (items.length > 0) {
          setSelectedRound(items[0].round);
        }
      })
      .catch(() => setError("Failed to load available results."))
      .finally(() => setLoadingRaces(false));
  }, []);

  useEffect(() => {
    if (selectedRound === null) return;

    let cancelled = false;

    setLoadingResult(true);
    setError("");
    setData(null);

    getRaceResult("2026", selectedRound)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setSelectedSession("race");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load this race's results.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingResult(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedRound]);

  const sessions = useMemo<SessionType[]>(() => {
    if (!data) return [];

    const available: SessionType[] = [];

    if (data.has_sprint) {
      if (data.sprint_qualifying_classification) {
        available.push("sprint_qualifying");
      }

      if (data.sprint_classification) {
        available.push("sprint");
      }
    }

    if (data.qualifying_classification) {
      available.push("qualifying");
    }

    if (data.race_classification) {
      available.push("race");
    }

    return available;
  }, [data]);

  const currentSessionData =
  data && selectedSession
    ? (() => {
        const sessionData = data[sessionKeyMap[selectedSession]];
        return Array.isArray(sessionData) ? sessionData : [];
      })()
    : [];

  const isRace =
    selectedSession === "race" || selectedSession === "sprint";

  const isQualifying =
    selectedSession === "qualifying" ||
    selectedSession === "sprint_qualifying";

  if (loadingRaces) {
    return (
      <p className="text-center text-gray-400 p-8">
        Loading available results...
      </p>
    );
  }

  if (races.length === 0) {
    return (
      <p className="text-center text-gray-400 p-8">
        No race results are available yet.
      </p>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-center gap-4">
        <select
          value={selectedRound ?? ""}
          onChange={(e) => {
            setSelectedRound(Number(e.target.value));
          }}
          className="p-4 bg-black text-white cursor-pointer"
        >
          {races.map((race) => (
            <option key={race.round} value={race.round}>
              {race.raceName}
            </option>
          ))}
        </select>

        <select
          value={selectedSession}
          onChange={(e) => {
            setSelectedSession(e.target.value as SessionType);
          }}
          className="p-4 bg-black text-white cursor-pointer"
          disabled={!data}
        >
          {sessions.map((session) => (
            <option key={session} value={session}>
              {session
                .replaceAll("_", " ")
                .replaceAll(
                  session.charAt(0),
                  session.charAt(0).toUpperCase()
                )}
            </option>
          ))}
        </select>
      </div>

      {loadingResult && (
        <p className="text-center text-gray-400">
          Loading classification...
        </p>
      )}

      {error && (
        <p className="text-center text-red-400">{error}</p>
      )}

      {!loadingResult && data && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm md:text-base">
            <thead>
              <tr className="border-b border-[#4a4a4a] text-xs md:text-lg">
                <th className="px-2 sm:px-6">Pos</th>
                <th className="px-2 sm:px-6">Driver</th>
                <th className="px-2 sm:px-6">Constructor</th>

                {isQualifying && (
                  <>
                    <th className="px-2 sm:px-6">Q1</th>
                    <th className="px-2 sm:px-6">Q2</th>
                    <th className="px-2 sm:px-6">Q3</th>
                    <th className="text-right px-2 sm:px-6">Grid</th>
                  </>
                )}

                {isRace && (
                  <>
                    <th className="px-2 sm:px-6">Laps</th>
                    <th className="px-2 sm:px-6">Time</th>
                    <th className="text-right px-2 sm:px-6">Points</th>
                    <th className="text-right px-2 sm:px-6">Grid</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {currentSessionData.map((entry, i) => (
                <tr
                  key={`${entry.driver}-${i}`}
                  className="border-b border-[#2a2a2a] text-xs md:text-sm"
                >
                  <td className="px-2 sm:px-6">{entry.position}</td>
                  <td className="px-2 sm:px-6">{entry.driver}</td>
                  <td className="px-2 sm:px-6">{entry.constructor}</td>

                  {isQualifying && (
                    <>
                      <td className="px-2 sm:px-6">
                        {entry.qualifying_times?.Q1 || "-"}
                      </td>
                      <td className="px-2 sm:px-6">
                        {entry.qualifying_times?.Q2 || "-"}
                      </td>
                      <td className="px-2 sm:px-6">
                        {entry.qualifying_times?.Q3 || "-"}
                      </td>
                      <td className="text-right px-2 sm:px-6">
                        {entry.grid || "-"}
                      </td>
                    </>
                  )}

                  {isRace && (
                    <>
                      <td className="px-2 sm:px-6">{entry.laps}</td>
                      <td className="px-2 sm:px-6">{entry.time}</td>
                      <td className="text-right px-2 sm:px-6">
                        {entry.points || "-"}
                      </td>
                      <td className="text-right px-2 sm:px-6">
                        {entry.grid || "-"}
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}