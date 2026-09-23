import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Cpu, Activity, BookOpen, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check saved theme or default to light
    const savedTheme = localStorage.getItem('gudha_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('gudha_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <header className="header-nav">
      <div className="header-inner">
        <div className="brand" onClick={() => setActiveTab('lab')} role="button" tabIndex={0}>
          <div className="brand-symbol">गू</div>
          <div className="brand-text">
            <h1>GŪḌHA</h1>
            <div className="brand-sub">Arthaśāstra Symmetric Cipher</div>
          </div>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-item ${activeTab === 'lab' ? 'active' : ''}`}
            onClick={() => setActiveTab('lab')}
            title="Interactive Cipher Workbench & Derivation Stepper"
          >
            <Cpu size={15} />
            <span>Cipher Lab</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
            title="Avalanche SAC, Entropy, and Cryptanalysis Suite"
          >
            <Activity size={15} />
            <span>Analysis</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => setActiveTab('research')}
            title="Arthaśāstra Historical Context & 18-Part Viva Defense"
          >
            <BookOpen size={15} />
            <span>Research & Thesis</span>
          </button>
        </nav>

        <div className="header-right">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <div className="status-badge">
            <div className="pulse-dot"></div>
            <span>GŪḌHA-64</span>
          </div>
        </div>
      </div>
    </header>
  );
};
