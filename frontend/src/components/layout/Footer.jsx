import React from 'react';
import { Github, Twitter, Linkedin, Mail, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const iconClass = "p-2.5 rounded-xl bg-bg-card border border-border text-text-muted hover:text-primary hover:border-primary/30 hover:shadow-lg hover:-translate-y-1.5 hover:scale-110 active:scale-90 transition-all duration-300";

  return (
    <footer className="w-full bg-bg-footer border-t border-border py-16 mt-auto transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start space-y-4">
                <Link to="/" className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105 active:scale-95">
                    <div className="p-1.5 bg-linear-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/10 group-hover:rotate-12 transition-transform duration-300">
                        <Zap size={22} className="text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-text-main">
                        Ushort<span className="text-primary group-hover:text-accent transition-colors duration-300">.link</span>
                    </span>
                </Link>
                <p className="text-base font-medium text-text-muted max-w-xs leading-relaxed">
                    A fast, privacy-friendly URL shortener. <br className="hidden md:block" />
                    Simple, secure, and measured.
                </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6">
                <div className="flex items-center gap-4">
                    <a href="https://github.com/AravindS-26/Ushort-URL-Shortener" target="_blank" rel="noopener noreferrer" className={iconClass} aria-label="GitHub">
                        <Github size={20} />
                    </a>
                    <a href="#" className={iconClass} aria-label="Twitter">
                        <Twitter size={20} />
                    </a>
                    <a href="#" className={iconClass} aria-label="LinkedIn">
                        <Linkedin size={20} />
                    </a>
                    <a href="#" className={iconClass} aria-label="Email">
                        <Mail size={20} />
                    </a>
                </div>
                <div className="flex flex-col items-center md:items-end gap-1">
                    <p className="text-sm font-bold text-text-main">
                        &copy; {new Date().getFullYear()} Ushort.
                    </p>
                    <p className="text-xs text-text-muted opacity-60 font-medium">
                        Crafted with precision for modern sharing.
                    </p>
                </div>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
