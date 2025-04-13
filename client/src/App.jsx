import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';
import './App.css'; // ✅ Import your CSS file

function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/login', '/register'];

  return (
    <div className="app-container">
      {/* Conditionally render Navbar */}
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
