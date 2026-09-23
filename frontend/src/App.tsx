import { useState } from 'react';
import { Header } from './components/Header';
import { LabPage } from './pages/LabPage';
import { AnalysisPage } from './pages/AnalysisPage';
import { ResearchPage } from './pages/ResearchPage';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('lab');

  return (
    <div className="gudha-app">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="app-container">
        {activeTab === 'lab' && (
          <LabPage onGoToAnalysis={() => setActiveTab('analysis')} />
        )}

        {activeTab === 'analysis' && (
          <AnalysisPage />
        )}

        {activeTab === 'research' && (
          <ResearchPage />
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          background: 'var(--bg-secondary)',
          color: 'var(--text-muted)',
          fontSize: '0.85rem'
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>GŪḌHA (गूढ) v1.0.0</span>
            <span>·</span>
            <span>Arthaśāstra-Inspired Symmetric Cipher System</span>
            <span>·</span>
            <span>Indian Knowledge Systems (IKS) & Computer Science</span>
          </div>

          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '0.78rem', lineHeight: '1.6' }}>
            This is an educational experimental cipher inspired by the Arthaśāstra's tradition of covert communication (<em>gūḍhalekhya</em>).
            It is not intended as a replacement for professionally standardized cryptographic algorithms (AES-GCM, ChaCha20-Poly1305).
          </p>

          <div style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Designed for Academic Research & University Viva Examination Defense · 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
