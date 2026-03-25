import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-red-600 text-white flex justify-center gap-6 p-4">
      <NavLink to="/">Home</NavLink>
      <NavLink to="/races">Races</NavLink>
      <NavLink to="/standings">Standings</NavLink>
      <NavLink to="/results">Results</NavLink>
    </nav>
  );
}