import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './pages/Accueil';
import Heberger from './pages/Heberger';
import Rejoindre from './pages/Rejoindre';
import Attribution from './pages/Attribution';
import Jeu from './pages/Jeu';
import FinPartie from './pages/FinPartie';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/heberger" element={<Heberger />} />
        <Route path="/rejoindre" element={<Rejoindre />} />
        <Route path="/attribution/:code/:nom" element={<Attribution />} />
        <Route path="/jeu/:code/:nom" element={<Jeu />} />
        <Route path="/fin-partie" element={<FinPartie />} />
      </Routes>
    </Router>
  );
}
