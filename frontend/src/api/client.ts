import type {
  EncryptResponse,
  DecryptResponse,
  AvalancheResponse,
  KeySensitivityResponse,
  PlaintextSensitivityResponse,
  FrequencyResponse,
  BenchmarkResponse,
  FrequencyDemoResponse,
  BruteForceDemoResponse,
  HistoricalContextResponse,
  ArthashastraChapter
} from '../types';

const API_BASE = '/api';

export async function encryptApi(
  plaintext: string,
  key: string,
  rounds: number = 6,
  recordTrace: boolean = true,
  mode: string = 'ecb',
  ivHex?: string,
  authenticate: boolean = false
): Promise<EncryptResponse> {
  const res = await fetch(`${API_BASE}/cipher/encrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plaintext, key, rounds, record_trace: recordTrace, mode, iv_hex: ivHex ?? null, authenticate })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Encryption request failed' }));
    throw new Error(err.detail || 'Encryption failed');
  }
  return res.json();
}

export async function decryptApi(
  ciphertextHex: string,
  key: string,
  rounds: number = 6,
  recordTrace: boolean = false,
  mode: string = 'ecb',
  ivHex?: string,
  authTagHex?: string
): Promise<DecryptResponse> {
  const res = await fetch(`${API_BASE}/cipher/decrypt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ciphertext_hex: ciphertextHex, key, rounds, record_trace: recordTrace, mode, iv_hex: ivHex ?? null, auth_tag_hex: authTagHex ?? null })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Decryption request failed' }));
    throw new Error(err.detail || 'Decryption failed');
  }
  return res.json();
}

export async function getAvalancheApi(
  plaintext: string,
  key: string,
  rounds: number = 6
): Promise<AvalancheResponse> {
  const res = await fetch(`${API_BASE}/analysis/avalanche`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plaintext, key, rounds })
  });
  if (!res.ok) throw new Error('Avalanche analysis failed');
  return res.json();
}

export async function getKeySensitivityApi(
  plaintext: string,
  keyA: string,
  keyB: string,
  rounds: number = 6
): Promise<KeySensitivityResponse> {
  const res = await fetch(`${API_BASE}/analysis/key-sensitivity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plaintext, key_a: keyA, key_b: keyB, rounds })
  });
  if (!res.ok) throw new Error('Key sensitivity analysis failed');
  return res.json();
}

export async function getPlaintextSensitivityApi(
  plaintextA: string,
  plaintextB: string,
  key: string,
  rounds: number = 6
): Promise<PlaintextSensitivityResponse> {
  const res = await fetch(`${API_BASE}/analysis/plaintext-sensitivity`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plaintext_a: plaintextA, plaintext_b: plaintextB, key, rounds })
  });
  if (!res.ok) throw new Error('Plaintext sensitivity analysis failed');
  return res.json();
}

export async function getFrequencyApi(
  plaintext: string,
  ciphertextHex: string
): Promise<FrequencyResponse> {
  const res = await fetch(`${API_BASE}/analysis/frequency`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plaintext, ciphertext_hex: ciphertextHex })
  });
  if (!res.ok) throw new Error('Frequency analysis failed');
  return res.json();
}

export async function getBenchmarkApi(rounds: number = 6): Promise<BenchmarkResponse> {
  const res = await fetch(`${API_BASE}/analysis/benchmark?rounds=${rounds}`);
  if (!res.ok) throw new Error('Benchmark request failed');
  return res.json();
}

export async function getFrequencyDemoApi(): Promise<FrequencyDemoResponse> {
  const res = await fetch(`${API_BASE}/analysis/demo/frequency`, { method: 'POST' });
  if (!res.ok) throw new Error('Frequency attack demo failed');
  return res.json();
}

export async function getBruteForceDemoApi(
  targetPin: number = 1423,
  keyspaceBits: number = 12
): Promise<BruteForceDemoResponse> {
  const res = await fetch(`${API_BASE}/analysis/demo/brute-force`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ target_pin: targetPin, keyspace_bits: keyspaceBits })
  });
  if (!res.ok) throw new Error('Brute force demo failed');
  return res.json();
}

export async function getHistoricalContextApi(): Promise<HistoricalContextResponse> {
  const res = await fetch(`${API_BASE}/history/context`);
  if (!res.ok) throw new Error('Historical context request failed');
  return res.json();
}

export async function getArthashastraChaptersApi(): Promise<ArthashastraChapter[]> {
  const res = await fetch(`${API_BASE}/history/arthashastra-chapters`);
  if (!res.ok) throw new Error('Arthashastra chapters request failed');
  return res.json();
}
