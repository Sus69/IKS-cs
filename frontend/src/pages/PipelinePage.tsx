import { useState, Fragment } from 'react';
import type { FC } from 'react';
import { ArrowDown, Layers, Sparkles } from 'lucide-react';

interface StageDetail {
  id: string;
  name: string;
  sanskrit: string;
  shannonPrinciple: string;
  whatItDoes: string;
  whyItExists: string;
  mathOperation: string;
  example: string;
}

const STAGES: StageDetail[] = [
  {
    id: 'normalize',
    name: '1. Message Normalization & Encoding',
    sanskrit: 'Mūla Saṅkalana (मूल सङ्कलन)',
    shannonPrinciple: 'Pre-processing / Input Conditioning',
    whatItDoes: 'Converts arbitrary user text or UTF-8 characters (including Sanskrit Devanagari) into raw byte streams.',
    whyItExists: 'Ciphers operate on mathematical binary symbols (bits and bytes), not human language characters.',
    mathOperation: 'P = \\text{UTF8Encode}(\\text{text})',
    example: '"HELLO" -> [0x48, 0x45, 0x4C, 0x4C, 0x4F]'
  },
  {
    id: 'padding',
    name: '2. PKCS#7 Block Segmentation',
    sanskrit: 'Khaṇḍa Vibhāga (खण्ड विभाग)',
    shannonPrinciple: 'Fixed-length framing',
    whatItDoes: 'Divides the byte stream into fixed 64-bit (8-byte) blocks. If the final block has fewer than 8 bytes, appends N bytes of value N.',
    whyItExists: 'Block ciphers require uniform input dimensions to apply linear and non-linear algebraic rounds deterministically.',
    mathOperation: '\\text{pad}(P, 8) = P \\,|\\, [k]^k, \\quad k = 8 - (len(P) \\bmod 8)',
    example: '5 bytes data -> padded with 3 bytes of 0x03 -> exactly 8 bytes'
  },
  {
    id: 'key_expansion',
    name: '3. Key Schedule (Expansion)',
    sanskrit: 'Vistāra (विस्तार)',
    shannonPrinciple: 'Key Equivocation & Compartmentalization',
    whatItDoes: 'Derives R + 1 distinct 64-bit subkeys (K_0 to K_R) from the 128-bit master user key using S-Boxes, circular shifts, and Vedic golden-ratio constants (phi).',
    whyItExists: 'Reusing the same key in every round introduces mathematical symmetries that allow slide and symmetry cryptanalysis.',
    mathOperation: 'W_i = W_{i-2} \\oplus \\text{SubWord}(\\text{RotWord}(W_{i-1})) \\oplus RCON_i',
    example: '"KAUTILYA" -> K_0, K_1, K_2, K_3, K_4, K_5, K_6 (all mutually distinct)'
  },
  {
    id: 'whitening',
    name: '4. Pre-Round Whitening',
    sanskrit: 'Prārambhika Yoga (प्रारम्भिक योग)',
    shannonPrinciple: 'Linear Masking',
    whatItDoes: 'XORs the raw 64-bit plaintext block with the initial round key K_0 before entering the first round.',
    whyItExists: 'Prevents an attacker from inspecting raw plaintext inputs to the first non-linear S-Box substitution step.',
    mathOperation: 'S_0 = B \\oplus K_0',
    example: '[0x48, 0x45...] ^ [0xA1, 0x09...] -> [0xE9, 0x4C...]'
  },
  {
    id: 'substitution',
    name: '5. Non-linear Substitution (S-Box)',
    sanskrit: 'Parivartana (परिवर्तन)',
    shannonPrinciple: 'Confusion (Shannon, 1949)',
    whatItDoes: 'Passes each of the 8 bytes through an invertible 256-element non-linear lookup table S[x].',
    whyItExists: 'Confusion destroys linear statistical correlation between input bytes and output bytes, resisting linear cryptanalysis.',
    mathOperation: 'S_A[i] = \\text{SBOX}[S[i]], \\quad \\forall i \\in [0..7], \\quad \\text{where } S[x] \\neq x',
    example: '0x48 -> SBOX[0x48] -> 0x8E (irreversible without knowing S-Box)'
  },
  {
    id: 'permutation',
    name: '6. Bit Permutation & Rotation',
    sanskrit: 'Krama (क्रम)',
    shannonPrinciple: 'Bit-level Diffusion',
    whatItDoes: 'Treats 64 bits as an 8x8 bit matrix, transposes rows and columns (i, j) -> (j, i), and rotates left by 11 bits.',
    whyItExists: 'Distributes all 8 bits of every byte across 8 distinct output bytes, preventing local clustering of changes.',
    mathOperation: '\\text{Perm}(B) = \\text{ROL}_{64}(\\text{BitTranspose}_{8\\times 8}(B), 11)',
    example: 'Bit 0 of Byte 0 disperses to Byte 0, Bit 1 to Byte 1, Bit 2 to Byte 2...'
  },
  {
    id: 'diffusion',
    name: '7. Modular Matrix Diffusion',
    sanskrit: 'Miśraṇa (मिश्रण)',
    shannonPrinciple: 'Linear Inter-Byte Diffusion',
    whatItDoes: 'Multiplies the 8-byte state vector by an invertible 8x8 circulant matrix M modulo 256.',
    whyItExists: 'Guarantees that every single output byte becomes a linear combination of all 8 input bytes within a single round.',
    mathOperation: 'Y = (M \\cdot X) \\bmod 256, \\quad \\det(M) = -5265 \\equiv 1 \\pmod 2',
    example: 'Output byte Y_0 = (1*X_0 + 2*X_1 + 1*X_2 + 4*X_3 + 1*X_4 + 2*X_5 + 1*X_6 + 1*X_7) mod 256'
  },
  {
    id: 'key_addition',
    name: '8. Round Key Addition',
    sanskrit: 'Yoga (योग)',
    shannonPrinciple: 'Key Dependency',
    whatItDoes: 'Bitwise XORs the diffused block state with the designated round subkey K_r.',
    whyItExists: 'Injects fresh secret key entropy into the state at the end of each round, preventing an attacker from traversing the pipeline without the key.',
    mathOperation: 'S_r = S_C \\oplus K_r',
    example: 'Diffused State ^ K_r -> Next Round State'
  },
  {
    id: 'finalization',
    name: '9. Final Block Ciphertext Output',
    sanskrit: 'Gūḍha Rūpa (गूढ रूप)',
    shannonPrinciple: 'Pseudorandom Uniform Output',
    whatItDoes: 'After R rounds, concatenates encrypted blocks into the final hex-encoded ciphertext.',
    whyItExists: 'Produces high-entropy, pseudorandom text ready for covert transmission across insecure channels.',
    mathOperation: 'C = \\text{Concat}(C_0, C_1, \\dots, C_{m-1})',
    example: 'Final Hex: "ED85A02064EA1DB978A186337B1584AB"'
  }
];

export const PipelinePage: FC = () => {
  const [selectedStage, setSelectedStage] = useState<StageDetail>(STAGES[4]); // default to S-Box

  return (
    <div className="pipeline-page">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '2rem', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>
          Interactive SPN Pipeline Architecture
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto' }}>
          Explore the mathematical mechanics of GŪḌHA-64. Click any stage in the cryptographic
          pipeline to reveal its purpose, Shannon principle, and algebraic formula.
        </p>
      </div>

      <div className="grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Left: Interactive Pipeline Flow */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Layers className="text-gold" size={20} />
              <span>GŪḌHA-64 SPN Sequence</span>
            </div>
            <span className="badge badge-gold">CLICK ANY STEP</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {STAGES.map((stage, idx) => {
              const isSelected = selectedStage.id === stage.id;
              return (
                <Fragment key={stage.id}>
                  <div
                    onClick={() => setSelectedStage(stage)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1.15rem',
                      background: isSelected
                        ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.2), rgba(0, 229, 255, 0.1))'
                        : 'var(--bg-secondary)',
                      border: isSelected
                        ? '1px solid var(--accent-gold)'
                        : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 0 15px rgba(212, 175, 55, 0.25)' : 'none'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.92rem', color: isSelected ? '#fff' : 'var(--text-primary)' }}>
                        {stage.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-gold)', fontStyle: 'italic' }}>
                        {stage.sanskrit}
                      </div>
                    </div>

                    <span className={`badge ${isSelected ? 'badge-gold' : 'badge-cyan'}`} style={{ fontSize: '0.7rem' }}>
                      {stage.shannonPrinciple}
                    </span>
                  </div>

                  {idx < STAGES.length - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '-2px 0' }}>
                      <ArrowDown size={14} color="var(--border-subtle)" />
                    </div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Stage Inspector */}
        <div className="card" style={{ border: '1px solid var(--border-gold)', position: 'sticky', top: '100px' }}>
          <div className="card-header">
            <div className="card-title">
              <Sparkles className="text-gold" size={18} />
              <span>Stage Specification</span>
            </div>
            <span className="badge badge-gold">{selectedStage.sanskrit}</span>
          </div>

          <h3 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            {selectedStage.name}
          </h3>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span className="badge badge-cyan">Principle: {selectedStage.shannonPrinciple}</span>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              What It Does
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {selectedStage.whatItDoes}
            </p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Why It Exists in GŪḌHA
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
              {selectedStage.whyItExists}
            </p>
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Mathematical Definition
            </h4>
            <div
              className="mono"
              style={{
                background: 'var(--bg-display)',
                border: '1px solid var(--border-strong)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--accent-cyan)',
                fontSize: '0.85rem'
              }}
            >
              {selectedStage.mathOperation}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.82rem', color: 'var(--text-gold)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Concrete Example
            </h4>
            <div
              className="mono"
              style={{
                background: 'var(--bg-display)',
                border: '1px solid var(--border-strong)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-gold)',
                fontSize: '0.85rem'
              }}
            >
              {selectedStage.example}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
