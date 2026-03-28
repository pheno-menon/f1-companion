import { useRef, useState } from "react";

const formatWeekend = (fpDate: string, raceDate: string) => {
  const startDate = fpDate.slice(8, 10);
  const endDate = raceDate.slice(8, 10);
  const startMonth = fpDate.slice(5, 7);
  const endMonth = raceDate.slice(5, 7);
  const cleanFpDate = fpDate.split("T")[0];
  const cleanRaceDate = raceDate.split("T")[0];
  const startDateObj = new Date(cleanFpDate);
  const endDateObj = new Date(cleanRaceDate);
  
  if (startMonth == endMonth) {
    return `${startDate} - ${endDate} ` + startDateObj.toLocaleString("en-US", {
    "month": "long",
  });
  } else {
    return `${startDate} ` + startDateObj.toLocaleString("en-US", { "month": "long" })
    + ` - ${endDate} ` + endDateObj.toLocaleString("en-US", { "month": "long" });
  }
}

const formatDateTime = (date: string, time: string, isUTC: boolean) => {
  const cleanDate = date.split("T")[0];
  const dateObj = new Date(`${cleanDate}T${time}`);

  if (isUTC) {
    const utcDateTime = dateObj.toUTCString().slice(5, 22);
    const utcDate = utcDateTime.slice(0, 6);
    const utcTime = utcDateTime.slice(12, 17);
    return `${utcDate}, ${utcTime}`;
  }

  // IST conversion
  return dateObj.toLocaleTimeString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kolkata",
  });
};

export default function RaceCard({ race }: any) {
  const [open, setOpen] = useState(false);
  const [isUTC, setIsUTC] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border border-[#2a2a2a] hover:border-[#444] rounded overflow-hidden">
      
      {/* Header */}
      <div
        className={`p-4 cursor-pointer uppercase tracking-widest hover:bg-[#e10600] hover:text-white transition
        ${open ? "bg-[#e10600] text-white" : "bg-[#1a1a1a] text-[#555]"}`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex justify-between items-center">
          
          <h2 className="font-bold text-md md:text-lg text-left">
            {race.raceName}
          </h2>

          <p className="text-sm md:text-base text-right normal-case">
            {formatWeekend(race.sessions.fp1.date, race.date)}
          </p>

        </div>
      </div>

      {/* Animated Content */}
      <div
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "max-h-96 opacity-100 p-4" : "max-h-0 opacity-0 p-0"
        }`}
      >
        <div className="flex justify-between gap-6">
          
          <div className="text-left">
            <p className="font-semibold">{race.circuit.name}</p>
            <p>
              {race.circuit.locality}, {race.circuit.country}
            </p>
            <p>{formatWeekend(race.sessions.fp1.date, race.date)}</p>
          </div>

          <div>
            <div className="flex justify-end text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="mb-1">Display UTC Time</span>
                <input className="mb-1 cursor-pointer"
                  type="checkbox"
                  checked={isUTC}
                  onChange={() => setIsUTC(!isUTC)}
                />
              </label>
            </div>
            <div className="text-right space-y-1 text-sm">
              {race.sessions?.fp1 && (
                <p>
                  <span className="font-semibold">FP1:</span>{" "}
                  {formatDateTime(race.sessions.fp1.date, race.sessions.fp1.time, isUTC)}
                </p>
              )}
              {race.sessions?.fp2 && (
                <p>
                  <span className="font-semibold">FP2:</span>{" "}
                  {formatDateTime(race.sessions.fp2.date, race.sessions.fp2.time, isUTC)}
                </p>
              )}
              {race.sessions?.fp3 && (
                <p>
                  <span className="font-semibold">FP3:</span>{" "}
                  {formatDateTime(race.sessions.fp3.date, race.sessions.fp3.time, isUTC)}
                </p>
              )}
              {race.sessions?.sprintQualifying && (
                <p>
                  <span className="font-semibold">Sprint Qualifying:</span>{" "}
                  {formatDateTime(race.sessions.sprintQualifying.date, race.sessions.sprintQualifying.time, isUTC)}
                </p>
              )}
              {race.sessions?.sprint && (
                <p>
                  <span className="font-semibold">Sprint:</span>{" "}
                  {formatDateTime(race.sessions.sprint.date, race.sessions.sprint.time, isUTC)}
                </p>
              )}
              {race.sessions?.qualifying && (
                <p>
                  <span className="font-semibold">Qualifying:</span>{" "}
                  {formatDateTime(race.sessions.qualifying.date, race.sessions.qualifying.time, isUTC)}
                </p>
              )}
              <p>
                <span className="font-semibold">Race:</span>{" "}
                {formatDateTime(race.date, race.time, isUTC)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}