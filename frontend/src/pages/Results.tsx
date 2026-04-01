import { useState } from "react";
import { resultsMap } from "../data/results";

/* ---------- TYPES ---------- */

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
};

/* ---------- COMPONENT ---------- */

export default function Results() {
  const raceNames = Object.keys(resultsMap);

  const [selectedRace, setSelectedRace] = useState<string>(raceNames[0]);
  const [selectedSession, setSelectedSession] =
    useState<SessionType>("race");

  const data = resultsMap[selectedRace];

  /* ---------- BUILD SESSIONS SAFELY ---------- */
  const sessions: SessionType[] = [];

  if (data.has_sprint) {
    sessions.push("sprint_qualifying", "sprint");
  }

  sessions.push("qualifying", "race");

  /* ---------- MAP SESSION TO DATA KEY ---------- */
  const sessionKeyMap: Record<SessionType, keyof typeof data> = {
    qualifying: "qualifying_classification",
    race: "race_classification",
    sprint: "sprint_classification",
    sprint_qualifying: "sprint_qualifying_classification",
  };

  const currentSessionData = (data[sessionKeyMap[selectedSession]] as Entry[]) || [];
  const isRace = selectedSession == "race" || selectedSession == "sprint";
  const isQualifying = selectedSession == "qualifying" || selectedSession == "sprint_qualifying";


  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-center gap-4">
        {/* RACE SELECT */}
        <select
          value={selectedRace}
          onChange={(e) => {
            setSelectedRace(e.target.value);
            setSelectedSession("race");
          }}
          className="p-4 bg-black text-white cursor-pointer"
        >
          {raceNames.map((race) => (
            <option key={race} value={race}>
              {race.split("_")[0].replace(race.charAt(0), race.charAt(0).toUpperCase())}
            </option>
          ))}
        </select>

        {/* SESSION SELECT */}
        <select
          value={selectedSession}
          onChange={(e) =>
            setSelectedSession(e.target.value as SessionType)
          }
          className="p-4 bg-black text-white cursor-pointer"
        >
          {sessions.map((s) => (
            <option key={s} value={s}>
              {s.replaceAll("_", " ").replaceAll(s.charAt(0), s.charAt(0).toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS TABLE */}
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
            {currentSessionData.map((entry: any, i: number) => (
              <tr key={i} className="border-b border-[#2a2a2a] text-xs md:text-sm">
                <td className="px-2 sm:px-6">{entry.position}</td>
                <td className="px-2 sm:px-6">{entry.driver}</td>
                <td className="px-2 sm:px-6">{entry.constructor}</td>

                {isQualifying && (
                  <>
                    <td className="px-2 sm:px-6">{entry.qualifying_times?.Q1 || "-"}</td>
                    <td className="px-2 sm:px-6">{entry.qualifying_times?.Q2 || "-"}</td>
                    <td className="px-2 sm:px-6">{entry.qualifying_times?.Q3 || "-"}</td>
                    <td className="text-right px-2 sm:px-6">{entry.grid}</td>
                  </>
                )}

                {isRace && (
                  <>
                    <td className="px-2 sm:px-6">{entry.laps}</td>
                    <td className="px-2 sm:px-6">{entry.time}</td>
                    <td className="text-right px-2 sm:px-6">{entry.points || "-"}</td>
                    <td className="text-right px-2 sm:px-6">{entry.grid || "-"}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}