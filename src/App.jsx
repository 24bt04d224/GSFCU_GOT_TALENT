import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
<<<<<<< HEAD
=======
import { AuthProvider } from './context/AuthContext';
>>>>>>> 5d886f7 (Updated Changes)
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
<<<<<<< HEAD
    <>
=======
    <AuthProvider>
>>>>>>> 5d886f7 (Updated Changes)
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
<<<<<<< HEAD
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </>
=======
        <Route path="/portal" element={<AdminPage />} />
        <Route path="/portal/*" element={<AdminPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </AuthProvider>
>>>>>>> 5d886f7 (Updated Changes)
  );
}
