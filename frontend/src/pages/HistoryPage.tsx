import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { BookOpen, Scroll, AlertCircle } from 'lucide-react';
import { getHistoricalContextApi, getArthashastraChaptersApi } from '../api/client';
import type { HistoricalContextResponse, ArthashastraChapter } from '../types';

export const HistoryPage: FC = () => {
  const [contextData, setContextData] = useState<HistoricalContextResponse | null>(null);
  const [chapters, setChapters] = useState<ArthashastraChapter[]>([]);

  useEffect(() => {
    getHistoricalContextApi().then(setContextData).catch(console.error);
    getArthashastraChaptersApi().then(setChapters).catch(console.error);
  }, []);

  return (
    <div className="history-page">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Historical Foundations & IKS Demarcation
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Grounded examination of ancient Indian statecraft texts, compartmentalized intelligence doctrine,
          and transparent demarcation between historical evidence and modern computational models.
        </p>
      </div>

      {/* Explicit Boundary Declaration */}
      <div className="academic-alert" style={{ marginBottom: '2rem' }}>
        <AlertCircle className="academic-alert-icon" size={24} />
        <div className="academic-alert-content">
          <h4>Academic Demarcation Mandate</h4>
          <p>
            <em>
              “GŪḌHA does not claim to reproduce a historical Arthaśāstra cipher. Instead, it translates the
              historical concept of secret communication into a modern computational experiment.”
            </em>
            <br />
            Ancient treatises possessed strategic doctrines of covert writing (<em>gūḍhalekhya</em>) and
            compartmentalized intelligence networks (<em>gūḍhapuruṣa</em>). They did not possess modern
            finite-field algebra, binary logic gates, or Substitution-Permutation Networks.
          </p>
        </div>
      </div>

      {/* 3-Tier Demarcation Cards */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem', textAlign: 'center' }}>
          The Three-Tier Demarcation System
        </h3>

        <div className="grid-3">
          {/* Tier 1 */}
          <div className="card" style={{ borderTop: '3px solid var(--text-gold)' }}>
            <div className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>TIER 1 · HISTORICAL FACT</div>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>What History Actually Records</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Kauṭilya’s <em>Arthaśāstra</em> (Books 1 & 2) explicitly prescribes secret writing (<em>gūḍhalekhya</em>)
              for envoys, double agents, and strategic intelligence couriers crossing hostile frontiers.
            </p>
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Citations:</span>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                <li>Kangle, R.P. (1965) Critical Edition</li>
                <li>Olivelle, Patrick (2013) Oxford Translation</li>
              </ul>
            </div>
          </div>

          {/* Tier 2 */}
          <div className="card" style={{ borderTop: '3px solid var(--accent-cyan)' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>TIER 2 · MODERN CONCEPTS</div>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Cryptographic Theory</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              Shannon’s Mathematical Theory of Secrecy (1949): Confusion, Diffusion, Key Schedules,
              and iterative round transformations over finite algebraic structures ($\mathbb&#123;Z&#125;_&#123;256&#125;$).
            </p>
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Citations:</span>
              <ul style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                <li>C.E. Shannon (1949) Bell Labs</li>
                <li>Daemen & Rijmen (2002) SPN Networks</li>
              </ul>
            </div>
          </div>

          {/* Tier 3 */}
          <div className="card" style={{ borderTop: '3px solid var(--accent-emerald)' }}>
            <div className="badge badge-emerald" style={{ marginBottom: '0.75rem' }}>TIER 3 · OUR DESIGN</div>
            <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>Original Implementation</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.6' }}>
              GŪḌHA-64: Our original 64-bit educational block cipher combining Parivartana (S-Box),
              Krama (8x8 bit transpose), Miśraṇa (modular matrix mixer), and Vistāra (golden-ratio key schedule).
            </p>
            <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scope:</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                Educational & experimental laboratory; verifiable via automated unit tests.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Authentic Textual Citations from the Arthaśāstra */}
      <section className="card" style={{ marginBottom: '2.5rem' }}>
        <div className="card-header">
          <div className="card-title">
            <Scroll className="text-gold" size={20} />
            <span>Documented Arthaśāstra Passages on Covert Writing</span>
          </div>
          <span className="badge badge-gold">PRIMARY SOURCES</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {chapters.map((ch, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="badge badge-cyan">{ch.book} · {ch.chapter}</span>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>
                  {ch.sanskrit_reference}
                </span>
              </div>

              <blockquote style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontSize: '0.95rem', margin: '0.75rem 0', paddingLeft: '1rem', borderLeft: '3px solid var(--accent-gold)' }}>
                "{ch.translation}"
              </blockquote>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                <strong style={{ color: 'var(--text-gold)' }}>Strategic Relevance to Cryptography: </strong>
                {ch.relevance}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sanskrit Cryptographic Glossary */}
      {contextData && (
        <section className="card">
          <div className="card-header">
            <div className="card-title">
              <BookOpen className="text-cyan" size={20} />
              <span>Sanskrit Cryptographic Terminology & Technical Mapping</span>
            </div>
            <span className="badge badge-cyan">8 FORMAL TERMS</span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-gold)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 0.5rem' }}>SANSKRIT TERM</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>ORIGINAL ARTHAŚĀSTRA / IKS MEANING</th>
                <th style={{ padding: '0.75rem 0.5rem' }}>GŪḌHA-64 COMPUTATIONAL CORRESPONDENCE</th>
              </tr>
            </thead>
            <tbody>
              {contextData.sanskrit_glossary.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td className="mono" style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.term}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {item.meaning}
                  </td>
                  <td className="text-cyan mono" style={{ padding: '0.75rem 0.5rem' }}>
                    {item.term.includes('Parivartana')
                      ? 'Invertible 8-bit S-Box (Confusion)'
                      : item.term.includes('Krama')
                      ? '8x8 Bit Matrix Transposition & 11-bit Rotation'
                      : item.term.includes('Miśraṇa')
                      ? 'Modular Circulant Matrix Mixing over Z_256'
                      : item.term.includes('Vistāra')
                      ? '128-bit Key Schedule with Golden-Ratio Constants'
                      : item.term.includes('Yoga')
                      ? 'State ⊕ RoundKey (Bitwise XOR)'
                      : item.term.includes('Gūḍhalekhya')
                      ? 'Block-level Symmetric Ciphertext'
                      : item.term.includes('Gūḍhapuruṣa')
                      ? 'Zero-Knowledge Key Compartmentalization'
                      : 'Cryptographic Core State'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
};
