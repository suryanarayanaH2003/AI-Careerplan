import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from '../src/pages/LandingPage';
import CareerPathResults from '../src/pages/CareerPathResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/career-path" element={<CareerPathResults />} />
      </Routes>
    </Router>
  );
}

export default App;
