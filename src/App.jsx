import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Connect from "./pages/Connect";
import Sync from "./pages/Sync";
import Ask from "./pages/Ask";
import Onboarding from "./pages/Onboarding";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/sync" element={<Sync />} />
        <Route path="/ask" element={<Ask />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    </BrowserRouter>
  );
}
