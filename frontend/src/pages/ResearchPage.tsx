import { useState } from 'react';
import type { FC } from 'react';
import { BookOpen, Award } from 'lucide-react';
import { HistoryPage } from './HistoryPage';
import { DocsPage } from './DocsPage';

export const ResearchPage: FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'history' | 'thesis'>('history');

  return (
    <div className="research-page">
      {/* Sleek Minimal Subnav Toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="subnav-toggle">
          <button
            className={`subnav-btn ${activeSubTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('history')}
          >
            <BookOpen size={15} />
            <span>Historical Context & Demarcation</span>
          </button>
          <button
            className={`subnav-btn ${activeSubTab === 'thesis' ? 'active' : ''}`}
            onClick={() => setActiveSubTab('thesis')}
          >
            <Award size={15} />
            <span>18-Part Viva Defense Guide</span>
          </button>
        </div>
      </div>

      {/* Render selected section */}
      {activeSubTab === 'history' && <HistoryPage />}
      {activeSubTab === 'thesis' && <DocsPage />}
    </div>
  );
};

export default ResearchPage;
