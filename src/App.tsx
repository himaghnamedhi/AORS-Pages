import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Overview from './pages/Overview';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import DeleteAccount from './pages/DeleteAccount';

export default function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <nav>
          <Link to="/">Overview</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/delete-account">Delete Account</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/delete-account" element={<DeleteAccount />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
