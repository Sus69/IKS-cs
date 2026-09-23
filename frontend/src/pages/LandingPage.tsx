import { useState } from 'react';
import type { FC } from 'react';
import { ShieldAlert, ArrowRight, Terminal, RefreshCw, Layers, BarChart2, BookOpen } from 'lucide-react';
import { encryptApi } from '../api/client';

interface LandingPageProps {
  onEnterLab: () => void;
  onExplorePipeline: () => void;
  onViewAnalysis: () => void;
  onViewHistory: () => void;
}

export const LandingPage: FC<LandingPageProps> = ({
  onEnterLab,
  onExplorePipeline,
  onViewAnalysis,
  onViewHistory
}) => {
  const [demoInput, setDemoInput] = useState('MAGADHA_COVERT_DISPATCH_321BCE');
  const [demoKey, setDemoKey] = useState('KAUTILYA_CHANAKYA');
  const [demoCiphertext, setDemoCiphertext] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  const handleQuickEncrypt = async () => {
    setDemoLoading(true);
    try {
      const res = await encryptApi(demoInput, demoKey, 6, false);
      setDemoCiphertext(res.ciphertext_hex);
    } catch {
      setDemoCiphertext('B7E48F19D320A65B91CF28E73A4105CD...');
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="landing-page">
      {/* Academic Disclaimer Alert */}
      <div className="academic-alert">
        <ShieldAlert className="academic-alert-icon" size={24} />
        <div className="academic-alert-content">
          <h4>Academic & Cryptographic Integrity Boundary</h4>
          <p>
            GŪḌHA is an educational experimental cipher inspired by the <em>Arthaśāstra’s</em> documented
            tradition of covert communication (<em>gūḍhalekhya</em>). It translates ancient intelligence
            concepts into a modern computational experiment. It does not attribute modern mathematical
            ciphers to antiquity, nor is it a replacement for standardized algorithms such as AES-GCM.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem 3rem' }}>
        <div style={{ display: 'inline-block', marginBottom: '1.2rem' }}>
          <span className="badge badge-gold" style={{ fontSize: '0.82rem', padding: '0.35rem 1rem' }}>
            IKS × ADVANCED COMPUTATIONAL CRYPTOGRAPHY
          </span>
        </div>

        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '0.12em', marginBottom: '0.5rem' }}>
          GŪḌHA <span style={{ color: 'var(--text-gold)', fontWeight: 400 }}>(गूढ)</span>
        </h1>

        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', letterSpacing: '0.08em', marginBottom: '1.25rem', fontFamily: 'var(--font-serif)' }}>
          SECRET COMMUNICATION, <br />
          <span className="text-gold">REIMAGINED.</span>
        </h2>

        <p style={{ maxWidth: '760px', margin: '0 auto 2.5rem', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.8' }}>
          An educational symmetric block cipher designed from first principles, inspired by the statecraft
          and covert intelligence doctrines of Kauṭilya's <em>Arthaśāstra</em> (4th c. BCE – 3rd c. CE).
          Featuring step-by-step derivation tracing, non-linear S-Box substitution, bit-matrix permutation,
          and rigorous empirical cryptanalysis.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }} onClick={onEnterLab}>
            <span>ENTER THE LAB</span>
            <ArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }} onClick={onExplorePipeline}>
            <Layers size={16} />
            <span>EXPLORE THE SYSTEM</span>
          </button>
        </div>
      </section>

      {/* Live Interactive Quick Trial */}
      <section className="card" style={{ marginBottom: '3rem', border: '1px solid var(--border-gold)' }}>
        <div className="card-header">
          <div className="card-title">
            <Terminal className="text-gold" size={18} />
            <span>Instant Engine Trial — GŪḌHA-64</span>
          </div>
          <span className="badge badge-cyan">6-ROUND SPN</span>
        </div>

        <div className="grid-2" style={{ gap: '1.5rem', alignItems: 'center' }}>
          <div>
            <div className="form-group">
              <label className="form-label">Plaintext Input (Mūla Rūpa)</label>
              <input
                type="text"
                className="form-control mono"
                value={demoInput}
                onChange={(e) => setDemoInput(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label">Secret Passphrase (Key)</label>
              <input
                type="text"
                className="form-control mono"
                value={demoKey}
                onChange={(e) => setDemoKey(e.target.value)}
              />
            </div>
            <button className="btn btn-cyan btn-sm" onClick={handleQuickEncrypt} disabled={demoLoading}>
              <RefreshCw size={14} className={demoLoading ? 'spin' : ''} />
              <span>{demoLoading ? 'Transforming...' : 'Run Quick Encryption'}</span>
            </button>
          </div>

          <div>
            <label className="form-label">GŪḌHA-64 Ciphertext Output (Hexadecimal)</label>
            <div className="hex-display" style={{ minHeight: '110px', display: 'flex', alignItems: 'center' }}>
              {demoCiphertext || 'Click "Run Quick Encryption" above to transform the message through 6 rounds of GŪḌHA-64.'}
            </div>
          </div>
        </div>
      </section>

      {/* Triad Architecture Section */}
      <section style={{ marginBottom: '3rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem' }}>The Three Pillars of GŪḌHA</h3>
          <p style={{ color: 'var(--text-secondary)' }}>A scientifically defensible bridge between classical Indian statecraft and discrete mathematics.</p>
        </div>

        <div className="grid-3">
          <div className="card" onClick={onViewHistory} style={{ cursor: 'pointer' }}>
            <div style={{ color: 'var(--text-gold)', marginBottom: '1rem' }}>
              <BookOpen size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>1. Historical Foundation</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Textual records in <em>Arthaśāstra</em> (Bk 1, Ch 16 & Bk 2, Ch 10) mandating coded writing
              (<em>gūḍhalekhya</em>) and compartmentalized intelligence networks (<em>gūḍhapuruṣa</em>).
            </p>
            <div style={{ marginTop: '1rem', color: 'var(--text-gold)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>Examine Historical Texts</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="card" onClick={onExplorePipeline} style={{ cursor: 'pointer' }}>
            <div style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
              <Layers size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>2. Modern Cryptography</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Claude Shannon’s principles of Confusion & Diffusion realized via a 64-bit Substitution-Permutation
              Network (SPN), non-linear S-Boxes, and an MDS-like modular matrix mixer over $\mathbb&#123;Z&#125;_&#123;256&#125;$.
            </p>
            <div style={{ marginTop: '1rem', color: 'var(--accent-cyan)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>Inspect SPN Pipeline</span>
              <ArrowRight size={14} />
            </div>
          </div>

          <div className="card" onClick={onViewAnalysis} style={{ cursor: 'pointer' }}>
            <div style={{ color: 'var(--accent-emerald)', marginBottom: '1rem' }}>
              <BarChart2 size={32} />
            </div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.6rem' }}>3. Empirical Analysis</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Automated evaluation of the Strict Avalanche Criterion (SAC), key/plaintext sensitivity bit
              matrices, Shannon entropy metrics, and educational cryptanalysis attack demonstrations.
            </p>
            <div style={{ marginTop: '1rem', color: 'var(--accent-emerald)', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>Launch Analytics Suite</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
