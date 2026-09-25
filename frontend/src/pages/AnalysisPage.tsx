import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Zap,
  BarChart2,
  Clock,
  Unlock,
  ShieldAlert,
  Play,
  RefreshCw,
  TrendingUp,
  Percent
} from 'lucide-react';
import {
  encryptApi,
  getAvalancheApi,
  getKeySensitivityApi,
  getPlaintextSensitivityApi,
  getFrequencyApi,
  getBenchmarkApi,
  getFrequencyDemoApi,
  getBruteForceDemoApi
} from '../api/client';
import type {
  AvalancheResponse,
  KeySensitivityResponse,
  PlaintextSensitivityResponse,
  FrequencyResponse,
  BenchmarkResponse,
  FrequencyDemoResponse,
  BruteForceDemoResponse
} from '../types';

export const AnalysisPage: FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'avalanche' | 'sensitivity' | 'frequency' | 'benchmark' | 'attacks'>('avalanche');
  
  // Avalanche state
  const [avalancheData, setAvalancheData] = useState<AvalancheResponse | null>(null);
  const [avalancheInput, setAvalancheInput] = useState('KAUTILYA_SECRET_DISPATCH_321BCE');
  const [avalancheKey, setAvalancheKey] = useState('ARTHASHASTRA_KEY');
  const [avalancheLoading, setAvalancheLoading] = useState(false);

  // Sensitivity state
  const [keySensData, setKeySensData] = useState<KeySensitivityResponse | null>(null);
  const [ptSensData, setPtSensData] = useState<PlaintextSensitivityResponse | null>(null);

  // Frequency state
  const [freqData, setFreqData] = useState<FrequencyResponse | null>(null);

  // Benchmark state
  const [benchData, setBenchData] = useState<BenchmarkResponse | null>(null);
  const [benchLoading, setBenchLoading] = useState(false);

  // Attacks demo state
  const [freqDemoData, setFreqDemoData] = useState<FrequencyDemoResponse | null>(null);
  const [bfDemoData, setBfDemoData] = useState<BruteForceDemoResponse | null>(null);
  const [bfPin, setBfPin] = useState(1423);
  const [bfLoading, setBfLoading] = useState(false);

  // Run avalanche test
  const runAvalanche = async () => {
    setAvalancheLoading(true);
    try {
      const data = await getAvalancheApi(avalancheInput, avalancheKey, 6);
      setAvalancheData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setAvalancheLoading(false);
    }
  };

  // Run sensitivity tests
  const runSensitivity = async () => {
    try {
      const [kData, pData] = await Promise.all([
        getKeySensitivityApi('CONFIDENTIAL MAURYAN DISPATCH', 'KAUTILYA_A', 'KAUTILYA_B', 6),
        getPlaintextSensitivityApi('HELLO WORLD', 'HELLO WORLE', 'ARTHASHASTRA_KEY', 6)
      ]);
      setKeySensData(kData);
      setPtSensData(pData);
    } catch (e) {
      console.error(e);
    }
  };

  // Run frequency test: encrypt the sample first so plaintext and
  // ciphertext entropy are measured on a genuine matched pair.
  const runFrequency = async () => {
    try {
      // Natural language test sample with high character repetition
      const sample = 'ARTHASHASTRA EMPHASIZES SYSTEMATIC STATE SECRET INTEGRITY AND INTELLIGENCE DISPATCHES.';
      const enc = await encryptApi(sample, 'ARTHASHASTRA_KEY', 6, false);
      const data = await getFrequencyApi(sample, enc.ciphertext_hex);
      setFreqData(data);
    } catch (e) {
      console.error(e);
    }
  };

  // Run benchmark
  const runBenchmark = async () => {
    setBenchLoading(true);
    try {
      const data = await getBenchmarkApi(6);
      setBenchData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBenchLoading(false);
    }
  };

  // Run attacks demo
  const runAttacksDemo = async () => {
    setBfLoading(true);
    try {
      const [fDemo, bDemo] = await Promise.all([
        getFrequencyDemoApi(),
        getBruteForceDemoApi(bfPin, 12)
      ]);
      setFreqDemoData(fDemo);
      setBfDemoData(bDemo);
    } catch (e) {
      console.error(e);
    } finally {
      setBfLoading(false);
    }
  };

  useEffect(() => {
    runAvalanche();
    runSensitivity();
    runFrequency();
    runBenchmark();
    runAttacksDemo();
  }, []);

  return (
    <div className="analysis-page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Experimental Cryptanalysis & Metrics Suite
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Empirical evaluation of diffusion, confusion, information entropy, and controlled vulnerability demonstrations.
        </p>
      </div>

      {/* Sub-tab Navigation */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeSubTab === 'avalanche' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('avalanche')}
        >
          <Zap size={15} />
          <span>Avalanche Effect (SAC)</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'sensitivity' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('sensitivity')}
        >
          <TrendingUp size={15} />
          <span>Key & Plaintext Sensitivity</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'frequency' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('frequency')}
        >
          <Percent size={15} />
          <span>Entropy & Frequency</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'benchmark' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('benchmark')}
        >
          <Clock size={15} />
          <span>Latency Benchmarks</span>
        </button>
        <button
          className={`btn btn-sm ${activeSubTab === 'attacks' ? 'btn-cyan' : 'btn-secondary'}`}
          onClick={() => setActiveSubTab('attacks')}
        >
          <Unlock size={15} />
          <span>Educational Attack Demos</span>
        </button>
      </div>

      {/* Tab 1: Avalanche Effect */}
      {activeSubTab === 'avalanche' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <div className="card-title">
                <Zap className="text-gold" size={20} />
                <span>Strict Avalanche Criterion (SAC) Verification</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={runAvalanche} disabled={avalancheLoading}>
                <RefreshCw size={14} className={avalancheLoading ? 'spin' : ''} />
                <span>{avalancheLoading ? 'Testing...' : 'Re-run Test'}</span>
              </button>
            </div>

            <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Test Plaintext</label>
                <input
                  type="text"
                  className="form-control mono"
                  value={avalancheInput}
                  onChange={(e) => setAvalancheInput(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Secret Key</label>
                <input
                  type="text"
                  className="form-control mono"
                  value={avalancheKey}
                  onChange={(e) => setAvalancheKey(e.target.value)}
                />
              </div>
            </div>

            {avalancheData && (
              <div>
                <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ background: 'var(--bg-display)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>BLOCK 0 AVALANCHE</div>
                    <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {avalancheData.block_avalanche_percentage}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {avalancheData.perturbed_block_bits_flipped} of 64 bits flipped (Target: ~50%)
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-display)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>INPUT MODIFICATION</div>
                    <div className="mono" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-gold)' }}>
                      1 BIT
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Flipped LSB of byte 0
                    </div>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-gold)', marginBottom: '0.75rem' }}>
                  Round-by-Round Diffusion Progression
                </h4>

                {/* Avalanche Progress Bar Matrix */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {avalancheData.round_progression.map((item) => (
                    <div key={item.round} style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.step_name}</span>
                        <span className="mono text-cyan">{item.bits_different} / {item.total_bits} bits ({item.percentage}%)</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'var(--border-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${Math.min(100, item.percentage * 2)}%`,
                            height: '100%',
                            background: item.round === 0 ? 'var(--accent-ruby)' : 'linear-gradient(90deg, var(--accent-gold), var(--accent-cyan))',
                            transition: 'width 0.5s ease'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {avalancheData.interpretation}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {avalancheData.mode_note}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Sensitivity */}
      {activeSubTab === 'sensitivity' && (
        <div className="grid-2" style={{ gap: '1.5rem' }}>
          {/* Key Sensitivity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp className="text-gold" size={20} />
                <span>Key Sensitivity Analysis</span>
              </div>
              <span className="badge badge-gold">KEY A vs KEY B</span>
            </div>

            {keySensData ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Encrypts identical plaintext under two keys differing by a minimal suffix.
                </p>

                <div style={{ background: 'var(--bg-display)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BIT VARIANCE PRODUCED</div>
                  <div className="mono text-gold" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                    {keySensData.sensitivity_percentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {keySensData.differing_bits} of {keySensData.total_bits} total ciphertext bits differ
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Key A:</strong> <span className="mono">{keySensData.key_a}</span><br />
                  <strong>Key B:</strong> <span className="mono">{keySensData.key_b}</span>
                </div>
              </div>
            ) : (
              <div>Loading sensitivity data...</div>
            )}
          </div>

          {/* Plaintext Sensitivity */}
          <div className="card">
            <div className="card-header">
              <div className="card-title">
                <TrendingUp className="text-cyan" size={20} />
                <span>Plaintext Sensitivity Analysis</span>
              </div>
              <span className="badge badge-cyan">PT A vs PT B</span>
            </div>

            {ptSensData ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                  Encrypts two plaintexts differing by exactly 1 character (e.g. 'D' vs 'E').
                </p>

                <div style={{ background: 'var(--bg-display)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>BLOCK VARIANCE PRODUCED</div>
                  <div className="mono text-cyan" style={{ fontSize: '1.8rem', fontWeight: 700 }}>
                    {ptSensData.perturbed_block_percentage}%
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {ptSensData.perturbed_block_bits_flipped} of 64 bits differ in altered block
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <strong>Plaintext A:</strong> <span className="mono">{ptSensData.plaintext_a}</span><br />
                  <strong>Plaintext B:</strong> <span className="mono">{ptSensData.plaintext_b}</span>
                </div>
              </div>
            ) : (
              <div>Loading sensitivity data...</div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Entropy & Frequency */}
      {activeSubTab === 'frequency' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <div className="card-title">
                <Percent className="text-gold" size={20} />
                <span>Shannon Entropy & Monobit Uniformity</span>
              </div>
              <span className="badge badge-gold">MAX H = 8.0 BITS/BYTE</span>
            </div>

            {freqData && (
              <div>
                <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-display)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PLAINTEXT SHANNON ENTROPY</div>
                    <div className="mono" style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {freqData.plaintext_entropy} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 8.0</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Low entropy characteristic of natural language redundancy.
                    </p>
                  </div>

                  <div style={{ background: 'var(--bg-display)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CIPHERTEXT SHANNON ENTROPY</div>
                    <div className="mono text-cyan" style={{ fontSize: '2rem', fontWeight: 700 }}>
                      {freqData.ciphertext_entropy} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/ 8.0</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      High entropy approaching maximum theoretical random distribution.
                    </p>
                  </div>
                </div>

                <h4 style={{ fontSize: '0.95rem', color: 'var(--text-gold)', marginBottom: '0.75rem' }}>
                  Monobit 0/1 Balance Verification
                </h4>

                <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Plaintext Monobit Ratio</span>
                    <div className="mono" style={{ fontSize: '1.1rem', marginTop: '0.3rem', color: 'var(--text-secondary)' }}>
                      1s: {freqData.plaintext_monobit.one_percentage}% · 0s: {(100 - freqData.plaintext_monobit.one_percentage).toFixed(2)}%
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>Ciphertext Monobit Ratio</span>
                    <div className="mono text-cyan" style={{ fontSize: '1.1rem', marginTop: '0.3rem' }}>
                      1s: {freqData.ciphertext_monobit.one_percentage}% · 0s: {(100 - freqData.ciphertext_monobit.one_percentage).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  {freqData.interpretation}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Benchmarks */}
      {activeSubTab === 'benchmark' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Clock className="text-gold" size={20} />
              <span>Execution Latency & Throughput Benchmark</span>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={runBenchmark} disabled={benchLoading}>
              <RefreshCw size={14} className={benchLoading ? 'spin' : ''} />
              <span>{benchLoading ? 'Benchmarking...' : 'Run Benchmark'}</span>
            </button>
          </div>

          {benchData && (
            <div>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-gold)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>PAYLOAD SIZE</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ENCRYPT LATENCY</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>DECRYPT LATENCY</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>ENCRYPT THROUGHPUT</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>DECRYPT THROUGHPUT</th>
                  </tr>
                </thead>
                <tbody>
                  {benchData.results.map((row) => (
                    <tr key={row.size_bytes} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td className="mono" style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{row.size_label}</td>
                      <td className="mono" style={{ padding: '0.75rem 0.5rem' }}>{row.encrypt_time_ms} ms</td>
                      <td className="mono" style={{ padding: '0.75rem 0.5rem' }}>{row.decrypt_time_ms} ms</td>
                      <td className="mono text-cyan" style={{ padding: '0.75rem 0.5rem' }}>{row.encrypt_throughput_mb_s} MB/s</td>
                      <td className="mono text-cyan" style={{ padding: '0.75rem 0.5rem' }}>{row.decrypt_throughput_mb_s} MB/s</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {benchData.note} (6 Rounds SPN in Python runtime).
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Educational Attacks */}
      {activeSubTab === 'attacks' && (
        <div>
          {/* Disclaimer Banner */}
          <div className="academic-alert" style={{ marginBottom: '1.5rem' }}>
            <ShieldAlert className="academic-alert-icon" size={22} />
            <div className="academic-alert-content">
              <h4>Educational Demonstration Only</h4>
              <p>
                The following attack simulations illustrate why elementary substitution ciphers fail against statistical analysis,
                and demonstrate how key space dimensions govern brute-force feasibility. The restricted 12-bit key demo is an educational
                toy; it does not represent the 128-bit security of the full GŪḌHA-64 cipher.
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Attack Demo 1: Frequency Analysis */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <BarChart2 className="text-gold" size={18} />
                  <span>Attack 1: Frequency Analysis Leakage</span>
                </div>
                <span className="badge badge-ruby" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>VULNERABLE VS DEFENDED</span>
              </div>

              {freqDemoData && (
                <div>
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: '#f87171' }}>Weak Monoalphabetic Mode:</strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {freqDemoData.weak_mode.vulnerability}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {freqDemoData.weak_mode.top_frequencies.map((item, i) => (
                        <span key={i} className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                          '{item.symbol}': {item.count}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--accent-emerald)' }}>GŪḌHA-64 Multi-Round SPN:</strong>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {freqDemoData.gudha_mode.defense}
                    </p>
                    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                      {freqDemoData.gudha_mode.top_frequencies.map((item, i) => (
                        <span key={i} className="badge badge-emerald">
                          {item.symbol}: {item.count}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Attack Demo 2: Controlled Brute-Force */}
            <div className="card">
              <div className="card-header">
                <div className="card-title">
                  <Unlock className="text-cyan" size={18} />
                  <span>Attack 2: Controlled Brute-Force Demo</span>
                </div>
                <span className="badge badge-cyan">12-BIT KEYSPACE</span>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem' }}>
                <input
                  type="number"
                  className="form-control mono"
                  style={{ width: '130px' }}
                  value={bfPin}
                  onChange={(e) => setBfPin(Number(e.target.value))}
                  placeholder="Target PIN..."
                />
                <button className="btn btn-cyan btn-sm" onClick={runAttacksDemo} disabled={bfLoading}>
                  <Play size={14} />
                  <span>{bfLoading ? 'Cracking...' : 'Run Brute Force'}</span>
                </button>
              </div>

              {bfDemoData && (
                <div>
                  <div style={{ background: 'var(--bg-display)', padding: '0.85rem', borderRadius: 'var(--radius-md)', marginBottom: '0.85rem', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>KEY RECOVERED</div>
                    <div className="mono text-emerald" style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      {bfDemoData.recovered_key}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Found in {bfDemoData.attempts_made} attempts ({bfDemoData.elapsed_seconds}s @ {bfDemoData.keys_per_second} keys/sec)
                    </div>
                  </div>

                  <h5 style={{ fontSize: '0.8rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    Keyspace Dimension Scalability
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                    {bfDemoData.keyspace_comparison_table.map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0.5rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                        <span style={{ fontWeight: 600 }}>{row.standard}</span>
                        <span className="mono text-cyan">{row.time_to_crack}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
