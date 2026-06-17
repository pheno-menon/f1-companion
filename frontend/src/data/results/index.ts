import races from "../races.json";
import { slugToCircuitId } from "./slugToCircuitId";

const circuitIdToRound = Object.fromEntries(
  races.map((r) => [r.circuit.circuitId, Number(r.round)])
);

const modules = import.meta.glob("./*.json", { eager: true });

export const resultsMap = Object.fromEntries(
  Object.entries(modules)
    .filter(([path]) => !path.includes("races.json"))
    .map(([path, data]: any) => {
      const name = path.split("/").pop().replace(".json", "");
      return [name, data.default];
    })
    .sort(([nameA], [nameB]) => {
      const roundA = circuitIdToRound[slugToCircuitId[nameA]] ?? Infinity;
      const roundB = circuitIdToRound[slugToCircuitId[nameB]] ?? Infinity;
      return roundA - roundB;
    })
);