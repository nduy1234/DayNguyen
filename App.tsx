import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import Projects from './pages/Projects';
import Experiences from './pages/Experiences';
import ChatWidget from './components/ChatWidget';
import About from './pages/About';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinkClass = (path: string) => `
    block px-4 py-2 mt-2 text-sm font-semibold rounded-lg md:mt-0 md:ml-4 
    hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline
    ${location.pathname === path ? 'text-gray-900 bg-gray-200' : 'text-gray-500 bg-transparent'}
  `;

  return (
    <nav className="fixed w-full z-50 top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-gray-900">
              Day Nguyen
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className={navLinkClass('/')}>About</Link>
              <Link to="/experiences" className={navLinkClass('/experiences')}>Experiences</Link>
              <Link to="/projects" className={navLinkClass('/projects')}>Projects</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
             <a href="https://github.com/nduy1234" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Github size={20} /></a>
             <a href="https://www.linkedin.com/in/daynguyen" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Linkedin size={20} /></a>
             <a href="mailto:nduy1234@gmail.com" className="text-gray-400 hover:text-gray-900 transition-colors"><Mail size={20} /></a>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</Link>
            <Link to="/experiences" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Experiences</Link>
            <Link to="/projects" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Projects</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-100 py-12 mt-20">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's connect!</h3>
              <div className="flex space-x-8">
                <a href="https://github.com/nduy1234" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Github size={24} /></a>
                <a href="https://www.linkedin.com/in/daynguyen" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors"><Linkedin size={24} /></a>
                <a href="mailto:nduy1234@gmail.com" className="text-gray-400 hover:text-gray-900 transition-colors"><Mail size={24} /></a>
              </div>
              <p className="mt-8 text-gray-400 text-sm">© 2025 Day Nguyen. All rights reserved.</p>
           </div>
        </footer>
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;