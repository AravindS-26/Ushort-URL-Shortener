import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Github, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) => 
    `text-sm font-bold transition-all duration-300 relative group py-2 ${
      isActive ? 'text-primary' : 'text-text-muted hover:text-primary hover:scale-110'
    }`;

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-200 flex items-center justify-center ${
      isScrolled 
      ? 'bg-bg-header backdrop-blur-xl shadow-lg border-b border-primary/10' 
      : 'bg-bg-header/50 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="w-full max-w-6xl px-4 md:px-6 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105 active:scale-95">
            <div className="p-1.5 bg-linear-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-text-main">
                Ushort<span className="text-primary transition-colors duration-300 group-hover:text-accent">.link</span>
            </span>
        </NavLink>
        
        <nav className="flex items-center gap-4 md:gap-8">
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/" className={navLinkClass}>
                    Home
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </NavLink>
                <NavLink to="/analytics" className={navLinkClass}>
                    Analytics
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full"></span>
                </NavLink>
                <a 
                    href="https://github.com/AravindS-26/Ushort-URL-Shortener" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-text-muted hover:text-primary transition-all duration-300 hover:scale-125"
                >
                    <Github size={22} />
                </a>
            </div>
            
            <button 
                onClick={toggleTheme}
                className="p-2.5 rounded-2xl bg-bg-card border border-border text-text-muted hover:text-primary transition-all duration-500 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 active:scale-90"
                aria-label="Toggle theme"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
