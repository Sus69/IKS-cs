export interface StepTraceItem {
  block_index: number;
  round: number;
  step_name: string;
  sanskrit_term: string;
  description: string;
  state_hex: string;
  state_bytes: number[];
  round_key_hex?: string | null;
  bits_flipped: number;
}

export interface EncryptResponse {
  plaintext_hex: string;
  padded_hex: string;
  ciphertext_hex: string;
  block_count: number;
  rounds: number;
  mode: string;
  iv_hex?: string | null;
  auth_tag_hex?: string | null;
  master_key_hex: string;
  round_keys_hex: string[];
  derivation_trace: StepTraceItem[];
}

export interface DecryptResponse {
  ciphertext_hex: string;
  decrypted_padded_hex: string;
  plaintext_hex: string;
  plaintext: string;
  block_count: number;
  rounds: number;
  mode: string;
  derivation_trace: StepTraceItem[];
}

export interface RoundProgressionItem {
  round: number;
  step_name: string;
  orig_hex: string;
  perturbed_hex: string;
  bits_different: number;
  total_bits: number;
  percentage: number;
}

export interface AvalancheResponse {
  plaintext_orig: string;
  plaintext_perturbed_hex: string;
  ciphertext_orig_hex: string;
  ciphertext_perturbed_hex: string;
  perturbed_block_bits_flipped: number;
  perturbed_block_total_bits: number;
  block_avalanche_percentage: number;
  overall_bits_flipped: number;
  total_ciphertext_bits: number;
  overall_avalanche_percentage: number;
  round_progression: RoundProgressionItem[];
  interpretation: string;
  mode_note: string;
}

export interface KeySensitivityResponse {
  key_a: string;
  key_b: string;
  plaintext: string;
  ciphertext_a_hex: string;
  ciphertext_b_hex: string;
  total_bits: number;
  differing_bits: number;
  sensitivity_percentage: number;
  byte_deltas: Array<{
    byte_index: number;
    byte_a_hex: string;
    byte_b_hex: string;
    xor_diff_hex: string;
    bits_flipped: number;
  }>;
  summary: string;
}

export interface PlaintextSensitivityResponse {
  plaintext_a: string;
  plaintext_b: string;
  key: string;
  ciphertext_a_hex: string;
  ciphertext_b_hex: string;
  perturbed_block_index: number;
  perturbed_block_bits_flipped: number;
  perturbed_block_percentage: number;
  total_bits: number;
  overall_differing_bits: number;
  overall_sensitivity_percentage: number;
  summary: string;
}

export interface FrequencyResponse {
  plaintext_length_bytes: number;
  ciphertext_length_bytes: number;
  plaintext_entropy: number;
  ciphertext_entropy: number;
  max_theoretical_entropy: number;
  plaintext_monobit: {
    ones: number;
    zeros: number;
    total_bits: number;
    one_percentage: number;
    deviation_from_ideal: number;
  };
  ciphertext_monobit: {
    ones: number;
    zeros: number;
    total_bits: number;
    one_percentage: number;
    deviation_from_ideal: number;
  };
  plaintext_top_bytes: Array<{ byte: string; char: string; count: number }>;
  ciphertext_top_bytes: Array<{ byte: string; char: string; count: number }>;
  interpretation: string;
}

export interface BenchmarkResponse {
  rounds: number;
  results: Array<{
    size_bytes: number;
    size_label: string;
    encrypt_time_ms: number;
    decrypt_time_ms: number;
    encrypt_throughput_mb_s: number;
    decrypt_throughput_mb_s: number;
  }>;
  note: string;
}

export interface FrequencyDemoResponse {
  disclaimer: string;
  sample_plaintext: string;
  weak_mode: {
    name: string;
    ciphertext_preview: string;
    vulnerability: string;
    top_frequencies: Array<{ symbol: string; count: number }>;
  };
  gudha_mode: {
    name: string;
    ciphertext_hex_preview: string;
    defense: string;
    top_frequencies: Array<{ symbol: string; count: number }>;
  };
}

export interface BruteForceDemoResponse {
  disclaimer: string;
  keyspace_bits: number;
  total_possible_keys: number;
  target_key: string;
  known_plaintext: string;
  target_ciphertext_hex: string;
  recovered_key: string;
  attempts_made: number;
  elapsed_seconds: number;
  keys_per_second: number;
  tested_samples: Array<{
    attempt: number;
    candidate_key: string;
    output_hex: string;
    match: boolean;
  }>;
  keyspace_comparison_table: Array<{
    standard: string;
    keyspace: string;
    time_to_crack: string;
    security_status: string;
  }>;
}

export interface HistoricalContextResponse {
  project_name: string;
  project_title: string;
  academic_disclaimer: string;
  three_tier_demarcation: {
    tier_1_historical_fact: {
      title: string;
      description: string;
      citations: string[];
    };
    tier_2_modern_concepts: {
      title: string;
      description: string;
      citations: string[];
    };
    tier_3_computational_design: {
      title: string;
      description: string;
    };
  };
  sanskrit_glossary: Array<{
    term: string;
    meaning: string;
  }>;
}

export interface ArthashastraChapter {
  book: string;
  chapter: string;
  sanskrit_reference: string;
  translation: string;
  relevance: string;
}
