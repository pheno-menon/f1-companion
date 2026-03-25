import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.tsx";
import Home from "./pages/Home";
import Races from "./pages/Races";
import Standings from "./pages/Standings";
import Results from "./pages/Results";

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/races" element={<Races />} />
          <Route path="/standings" element={<Standings />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </div>
  );
}