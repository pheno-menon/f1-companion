import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = "px-4 py-2 transition-colors duration-300 hover:bg-white hover:text-black";

  return (
    <nav className="bg-[#e10600] text-white flex justify-center gap-6">
      <NavLink to="/" className={linkClass}>
        Home
      </NavLink>

      <NavLink to="/races" className={linkClass}>
        Races
      </NavLink>

      <NavLink to="/standings" className={linkClass}>
        Standings
      </NavLink>

      <NavLink to="/results" className={linkClass}>
        Results
      </NavLink>
    </nav>
  );
}