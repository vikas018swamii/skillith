import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Matches from './pages/Matches';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';
import VerifyEmail from './pages/VerifyEmail'; 
import DeleteAccount from './pages/DeleteAccount';
import DeleteConfirm from './pages/DeleteConfirm';
import 'react-toastify/dist/ReactToastify.css';

import './App.css'; 
import UpdateUserDetails from './pages/UpdateUserDetails';


function App() {
  const location = useLocation();

  const hideNavbarPaths = ['/login', '/register'];

  return (
    <div className="app-container">
      {!hideNavbarPaths.includes(location.pathname) && <Navbar />}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat/:userId" element={<Chat />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/delete-account" element={<DeleteAccount />} />
          <Route path="/delete-confirm/:token" element={<DeleteConfirm />} />
          <Route path="/update-account" element={<UpdateUserDetails />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
