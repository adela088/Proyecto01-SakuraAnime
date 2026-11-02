import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';

import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Detail } from './pages/Detail';
import { Favorites } from './pages/Favorites';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FavoritesProvider>
          <ToastProvider>
            <BrowserRouter>
              <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0f0915] text-slate-900 dark:text-slate-100 transition-colors duration-200">
                <Navbar />

                <div className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />

                    <Route path="/explorar" element={<Explore />} />

                    <Route path="/anime/:id" element={<Detail />} />
                    <Route path="/manga/:id" element={<Detail />} />
                    <Route path="/personaje/:id" element={<Detail />} />

                    <Route path="/favoritos" element={<Favorites />} />

                    <Route path="/contacto" element={<Contact />} />

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>

                <Footer />

                <ToastContainer />
              </div>
            </BrowserRouter>
          </ToastProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
