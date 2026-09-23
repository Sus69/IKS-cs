import { useState, useEffect } from 'react';
import type { FC } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  ArrowRight,
  Cpu,
  Info
} from 'lucide-react';
import { encryptApi, decryptApi } from '../api/client';
import type { EncryptResponse, DecryptResponse, StepTraceItem } from '../types';
import { PipelinePage } from './PipelinePage';

interface LabPageProps {
  onGoToAnalysis?: () => void;
}

export const LabPage: FC<LabPageProps> = ({ onGoToAnalysis }) => {
  const [view, setView] = useState<'workbench' | 'pipeline'>('workbench');
  const [showBoundary, setShowBoundary] = useState(false);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [plaintext, setPlaintext] = useState('ARTHASHASTRA_SECRET_DISPATCH_321BCE');
  const [ciphertextHex, setCiphertextHex] = useState('');
  const [key, setKey] = useState('KAUTILYA_CHANAKYA');
  const [rounds, setRounds] = useState(6);
  
  const [encryptResult, setEncryptResult] = useState<EncryptResponse | null>(null);
  const [decryptResult, setDecryptResult] = useState<DecryptResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Derivation Stepper State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const playbackSpeed = 1200; // ms per step

  const activeTrace: StepTraceItem[] =
    mode === 'encrypt'
      ? encryptResult?.derivation_trace || []
      : decryptResult?.derivation_trace || [];

  const handleEncrypt = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await encryptApi(plaintext, key, rounds, true);
      setEncryptResult(res);
      setCiphertextHex(res.ciphertext_hex);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Encryption error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async () => {
    setErrorMsg('');
    setIsLoading(true);
    try {
      const res = await decryptApi(ciphertextHex, key, rounds, true);
      setDecryptResult(res);
      setPlaintext(res.plaintext);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Decryption error');
    } finally {
      setIsLoading(false);
    }
  };

  // Run initial encryption on mount
  useEffect(() => {
    handleEncrypt();
  }, []);

  // Playback timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying && activeTrace.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= activeTrace.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, activeTrace.length, playbackSpeed]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentStep = activeTrace[currentStepIndex];

  // Helper to load presets
  const applyPreset = (presetName: string) => {
    if (presetName === 'arthashastra') {
      setPlaintext('ARTHASHASTRA: THE ROVING SPY SHALL DISPATCH CODED LETTERS (1.16.29)');
      setKey('KAUTILYA_CHANAKYA');
      setRounds(6);
    } else if (presetName === 'sanskrit') {
      setPlaintext('गूढलेख्यं वा प्रेषयेत् । शासनप्रमाणं हि सर्वम् ॥');
      setKey('मगधसाम्राज्यम्');
      setRounds(6);
    } else if (presetName === 'minimal') {
      setPlaintext('HELLO WORLD');
      setKey('ARTHASHASTRA_KEY');
      setRounds(4);
    }
  };

  return (
    <div className="lab-page">
      {/* Sleek Minimal Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2.1rem', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
          GŪḌHA <span style={{ color: 'var(--text-gold)', fontWeight: 400 }}>(गूढ)</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '650px', margin: '0 auto 0.6rem' }}>
          Arthaśāstra-Inspired Symmetric Cipher Lab · 64-bit SPN Educational Block Cipher
        </p>
        <button
          onClick={() => setShowBoundary(!showBoundary)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Info size={13} className="text-gold" />
          <span>{showBoundary ? 'Hide Academic Demarcation Note' : 'Academic Demarcation Note'}</span>
        </button>

        {showBoundary && (
          <div className="academic-alert" style={{ marginTop: '0.85rem', textAlign: 'left', maxWidth: '850px', margin: '0.85rem auto 0' }}>
            <div className="academic-alert-content" style={{ fontSize: '0.84rem' }}>
              <strong>Academic Boundary:</strong> GŪḌHA is an educational experimental cipher inspired by the Arthaśāstra's covert writing doctrines (<em>gūḍhalekhya</em>). The cipher algorithm itself is an original educational computational construction (SPN with Parivartana, Krama, and Miśraṇa) and does not attribute modern algebra to antiquity.
            </div>
          </div>
        )}
      </div>

      {/* Sub-View Switcher: Workbench vs 9-Stage SPN Architecture */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <div className="subnav-toggle">
          <button
            className={`subnav-btn ${view === 'workbench' ? 'active' : ''}`}
            onClick={() => setView('workbench')}
          >
            <Cpu size={15} />
            <span>Workbench & Derivation Stepper</span>
          </button>
          <button
            className={`subnav-btn ${view === 'pipeline' ? 'active' : ''}`}
            onClick={() => setView('pipeline')}
          >
            <Layers size={15} />
            <span>9-Stage SPN Architecture</span>
          </button>
        </div>
      </div>

      {view === 'pipeline' ? (
        <PipelinePage />
      ) : (
        <>
          {/* Workbench Header & Mode Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', letterSpacing: '0.04em' }}>Cryptographic Workbench</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Encrypt or decrypt data with live round tracking and mathematical state inspection.
              </p>
            </div>

            {/* Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <button
                className={`btn btn-sm ${mode === 'encrypt' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMode('encrypt')}
              >
                <Lock size={14} />
                <span>ENCRYPT</span>
              </button>
              <button
                className={`btn btn-sm ${mode === 'decrypt' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMode('decrypt')}
              >
                <Unlock size={14} />
                <span>DECRYPT</span>
              </button>
            </div>
          </div>

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-ruby)', color: '#fca5a5', padding: '0.8rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          <strong>Error:</strong> {errorMsg}
        </div>
      )}

      {/* Main Workbench Grid */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        {/* Left Column: Input Form */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="text-gold mono" style={{ fontSize: '1.1rem' }}>01</span>
              <span>{mode === 'encrypt' ? 'Plaintext & Key Configuration' : 'Ciphertext & Key Configuration'}</span>
            </div>
            
            {/* Presets */}
            {mode === 'encrypt' && (
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('arthashastra')}>
                  Arthaśāstra
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('sanskrit')}>
                  Sanskrit
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => applyPreset('minimal')}>
                  Minimal
                </button>
              </div>
            )}
          </div>

          {mode === 'encrypt' ? (
            <div className="form-group">
              <label className="form-label">Plaintext Input (Mūla Rūpa)</label>
              <textarea
                className="form-control mono"
                rows={3}
                value={plaintext}
                onChange={(e) => setPlaintext(e.target.value)}
                placeholder="Enter confidential message to encrypt..."
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {new TextEncoder().encode(plaintext).length} bytes · PKCS#7 padded to {Math.ceil((new TextEncoder().encode(plaintext).length + 1) / 8) * 8} bytes
              </span>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Ciphertext Input (Hexadecimal)</label>
              <textarea
                className="form-control mono"
                rows={3}
                value={ciphertextHex}
                onChange={(e) => setCiphertextHex(e.target.value)}
                placeholder="Enter 16-hex-char aligned ciphertext string..."
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Hex length: {ciphertextHex.trim().length} chars ({ciphertextHex.trim().length / 2} bytes)
              </span>
            </div>
          )}

          <div className="grid-2" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Secret Passphrase / Key (Bīja)</label>
              <input
                type="text"
                className="form-control mono"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Secret key..."
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Transformation Rounds (R)</label>
              <select
                className="form-control mono"
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
              >
                <option value={2}>2 Rounds (Demonstration only)</option>
                <option value={4}>4 Rounds (Fast Diffusion)</option>
                <option value={6}>6 Rounds (Default GŪḌHA-64)</option>
                <option value={8}>8 Rounds (Heavy SPN Dispersion)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.8rem' }}>
            {mode === 'encrypt' ? (
              <button className="btn btn-primary" onClick={handleEncrypt} disabled={isLoading} style={{ flex: 1 }}>
                <Lock size={16} />
                <span>{isLoading ? 'Encrypting...' : 'ENCRYPT MESSAGE'}</span>
              </button>
            ) : (
              <button className="btn btn-primary" onClick={handleDecrypt} disabled={isLoading} style={{ flex: 1 }}>
                <Unlock size={16} />
                <span>{isLoading ? 'Decrypting...' : 'DECRYPT CIPHERTEXT'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Output Results */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <span className="text-cyan mono" style={{ fontSize: '1.1rem' }}>02</span>
              <span>{mode === 'encrypt' ? 'Generated Ciphertext (Gūḍha Rūpa)' : 'Restored Plaintext (Mūla Rūpa)'}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handleCopy(mode === 'encrypt' ? ciphertextHex : plaintext)}
              >
                {copied ? <Check size={14} className="text-emerald" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {mode === 'encrypt' ? (
            <div>
              <label className="form-label">Ciphertext Hex Dump</label>
              <div className="hex-display" style={{ minHeight: '110px' }}>
                {ciphertextHex || 'Execute encryption to generate ciphertext output...'}
              </div>

              {encryptResult && (
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <div className="badge badge-gold">Blocks: {encryptResult.block_count}</div>
                  <div className="badge badge-cyan">Rounds: {encryptResult.rounds}</div>
                  <div className="badge badge-emerald">Key Schedule: {encryptResult.round_keys_hex.length} Subkeys</div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="form-label">Restored UTF-8 Plaintext</label>
              <div
                style={{
                  background: 'var(--bg-display)',
                  border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1rem',
                  color: 'var(--text-primary)',
                  minHeight: '110px'
                }}
              >
                {plaintext || 'Execute decryption to restore message...'}
              </div>

              {decryptResult && (
                <div style={{ marginTop: '1rem' }}>
                  <span className="badge badge-emerald">PKCS#7 Padding Successfully Verified & Stripped</span>
                </div>
              )}
            </div>
          )}

          {/* Quick CTA to Analysis */}
          {onGoToAnalysis && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-cyan btn-sm" onClick={onGoToAnalysis}>
                <span>Analyze Cryptographic Metrics</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Visual Derivation Stepper & Player */}
      <section className="card" style={{ border: '1px solid var(--border-cyan)' }}>
        <div className="card-header">
          <div className="card-title">
            <Layers className="text-cyan" size={20} />
            <span>Mathematical Derivation Studio (Anukramaṇa)</span>
          </div>

          {/* Playback Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentStepIndex((p) => Math.max(0, p - 1))}
              disabled={currentStepIndex === 0}
            >
              <SkipBack size={14} />
            </button>

            <button
              className="btn btn-cyan btn-sm"
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={activeTrace.length === 0}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentStepIndex((p) => Math.min(activeTrace.length - 1, p + 1))}
              disabled={currentStepIndex >= activeTrace.length - 1}
            >
              <SkipForward size={14} />
            </button>

            <span className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>
              Step {currentStepIndex + 1} of {activeTrace.length}
            </span>
          </div>
        </div>

        {activeTrace.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            Encrypt or decrypt a message above to inspect step-by-step mathematical transformations.
          </div>
        ) : (
          <div>
            {/* Step Header Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.85rem 1.25rem',
                background: 'var(--badge-cyan-bg)',
                border: '1px solid var(--badge-cyan-border)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem'
              }}
            >
              <div>
                <span className="badge badge-gold" style={{ marginRight: '0.6rem' }}>
                  {currentStep.round === 0 ? 'INITIALIZATION' : `ROUND ${currentStep.round}`}
                </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {currentStep.step_name}
                </strong>
                <span style={{ marginLeft: '0.6rem', color: 'var(--text-gold)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                  [{currentStep.sanskrit_term}]
                </span>
              </div>

              <div className="mono text-cyan" style={{ fontSize: '0.85rem' }}>
                Block #{currentStep.block_index} · {currentStep.bits_flipped} bits flipped
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              {currentStep.description}
            </p>

            {/* 8-Byte Block State Matrix Grid */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span className="form-label" style={{ marginBottom: 0 }}>64-Bit State Vector [8 Bytes]</span>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-gold)' }}>
                  State: 0x{currentStep.state_hex}
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(8, 1fr)',
                  gap: '0.6rem',
                  background: 'var(--bg-display)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)'
                }}
              >
                {currentStep.state_bytes.map((byteVal, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.65rem 0.4rem',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                      B{idx}
                    </div>
                    <div className="mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {byteVal.toString(16).padStart(2, '0').toUpperCase()}
                    </div>
                    <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {byteVal}
                    </div>
                    <div className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {byteVal.toString(2).padStart(8, '0')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subkey info if applicable */}
            {currentStep.round_key_hex && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.65rem 1rem', background: 'var(--badge-gold-bg)', borderRadius: 'var(--radius-md)', border: '1px solid var(--badge-gold-border)' }}>
                <span className="badge badge-gold">Active Subkey (Yoga)</span>
                <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--badge-gold-text)' }}>
                  0x{currentStep.round_key_hex}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                  XOR applied: State ⊕ RoundKey
                </span>
              </div>
            )}
          </div>
        )}
      </section>
      </>
    )}
  </div>
);
};
