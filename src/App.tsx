import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AboutChinese from './pages/AboutChinese';
import Courses from './pages/Courses';
import Contact from './pages/Contact';
import logo from './assets/Logo.png';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="bg-black shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <img src={logo} alt="Logo" className="h-32 w-auto" />
                </Link>
              </div>
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-white hover:text-gray-300 font-calligraphy">Home</Link>
                <Link to="/about-chinese" className="text-white hover:text-gray-300 font-calligraphy">About Chinese</Link>
                <Link to="/courses" className="text-white hover:text-gray-300 font-calligraphy">Courses</Link>
                <Link to="/contact" className="text-white hover:text-gray-300 font-calligraphy">Contact</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-chinese" element={<AboutChinese />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;