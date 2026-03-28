import { NavLink } from "react-router-dom";
import F1_White from "../assets/F1_White.svg";

export default function Navbar() {
  const linkClass = "px-4 py-2 transition-colors duration-300 hover:bg-white hover:text-black";

  return (
    <nav className="flex items-center justify-between bg-[#e10600] text-white flex justify-center uppercase tracking-wide font-bold">
      <div className="flex items-center gap-2">
        <a href="https://www.formula1.com/">
          <img src={F1_White}
          alt="F1 Logo White"
          className="h-8 w-26 ml-4" />
        </a>
      </div>
      <div className="flex gap-6">
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
      </div>
    </nav>
  );
}