import { NavLink } from "react-router-dom";
import { useState } from "react";
import F1_White from "../assets/F1_White.svg";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = "block rounded px-4 py-2 text-right transition-colors duration-300 hover:bg-white hover:text-black";

  return (
    <nav className="bg-[#e10600] text-white uppercase tracking-wide font-bold">
      
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-2">
        
        {/* Logo */}
        <a href="https://www.formula1.com/">
          <img src={F1_White} alt="F1 Logo White" className="h-8" />
        </a>

        {/* Hamburger */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-6">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/races" className={linkClass}>Races</NavLink>
          <NavLink to="/standings" className={linkClass}>Standings</NavLink>
          <NavLink to="/results" className={linkClass}>Results</NavLink>
        </div>
      </div>

      {/* Animated Mobile Menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-end bg-[#e10600] border-t border-white/20 pr-4 pb-2">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/races" className={linkClass}>Races</NavLink>
          <NavLink to="/standings" className={linkClass}>Standings</NavLink>
          <NavLink to="/results" className={linkClass}>Results</NavLink>
        </div>
      </div>
    </nav>
  );
}