import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import Experiences from './pages/Experiences';
import Projects from './pages/Projects';
import ChatWidget from './components/ChatWidget';
import About from './pages/About';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = (path: string) => `
    relative px-4 py-2 text-sm font-medium transition-colors duration-300
    ${location.pathname === path ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}
  `;

  return (
    <nav className={`fixed w-full z-50 top-0 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold font-heading tracking-tight text-slate-900">
              Day Nguyen
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-2">
              <Link to="/" className={navLinkClass('/')}>About</Link>
              <Link to="/experiences" className={navLinkClass('/experiences')}>Experiences</Link>
              <Link to="/projects" className={navLinkClass('/projects')}>Projects</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
             <a href="https://www.linkedin.com/in/daynguyen" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-slate-900 transition-colors"><Linkedin size={18} /></a>
             <a href="https://github.com/nduy1234" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-slate-900 transition-colors"><Github size={18} /></a>
             <a href="mailto:nduy1234@gmail.com" aria-label="Email" className="text-slate-400 hover:text-slate-900 transition-colors"><Mail size={18} /></a>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-900 focus:outline-none transition"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 absolute w-full left-0 top-20 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">About</Link>
            <Link to="/experiences" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Experiences</Link>
            <Link to="/projects" onClick={() => setIsOpen(false)} className="block px-3 py-3 rounded-lg text-base font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50">Projects</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-100 py-16 mt-24">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold font-heading text-slate-900">Day Nguyen</h3>
                <p className="text-slate-400 text-sm mt-1">Building digital experiences.</p>
              </div>
              <div className="flex space-x-6">
                <a href="https://www.linkedin.com/in/daynguyen" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"><Linkedin size={20} /></a>
                <a href="https://github.com/nduy1234" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"><Github size={20} /></a>
                <a href="mailto:nduy1234@gmail.com" aria-label="Email" className="text-slate-400 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full"><Mail size={20} /></a>
              </div>
           </div>
           <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-slate-50 text-center text-slate-400 text-xs">
              © {new Date().getFullYear()} Day Nguyen. All rights reserved.
           </div>
        </footer>
        <ChatWidget />
      </div>
    </Router>
  );
};

export default App;