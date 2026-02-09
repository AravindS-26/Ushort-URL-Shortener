import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { ThemeProvider } from '../../context/ThemeContext';

/**
 * Global Layout wrapper component.
 * Provides the structural foundation for all pages, including:
 * - ThemeProvider context injection.
 * - Sticky Header and MT-auto Footer.
 * - Responsive main content container with consistent max-width.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content to render inside the layout
 */
const Layout = ({ children }) => {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-bg-main font-sans text-text-main transition-colors duration-200">
        <Header />
        <main className="grow pt-24 pb-12 px-4 md:px-6 w-full max-w-6xl mx-auto">
          {children}
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default Layout;

