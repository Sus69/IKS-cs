"""
GŪḌHA Analysis: Avalanche Effect & Strict Avalanche Criterion (SAC)
-------------------------------------------------------------------
Evaluates how a minimal 1-bit input perturbation diffuses across rounds.
Ideal theoretical target for strong diffusion: ~50% bit flip ratio.
"""

from typing import Dict, Any, List
from ..cipher.engine import Gudha64Cipher

def _hamming_distance(a: bytes, b: bytes) -> int:
    """Calculates number of differing bits between two byte strings."""
    return sum(bin(x ^ y).count('1') for x, y in zip(a, b))

def analyze_avalanche(
    plaintext: str = "HELLO WORLD, KAUTILYA",
    key: str = "SECRET_ARTHASHASTRA",
    rounds: int = 6
) -> Dict[str, Any]:
    """
    Measures avalanche progression round-by-round by flipping exactly 1 bit
    in the first byte of plaintext and tracking bit differences at each round.
    """
    raw_pt = plaintext.encode('utf-8') if isinstance(plaintext, str) else plaintext
    if len(raw_pt) == 0:
        raw_pt = b"KAUTILYA"
        
    # Create 1-bit perturbed version (flip LSB of first byte)
    perturbed_pt = bytearray(raw_pt)
    perturbed_pt[0] ^= 0x01
    perturbed_pt = bytes(perturbed_pt)

    cipher = Gudha64Cipher(key=key, rounds=rounds)
    
    # Trace both encryptions
    enc_orig = cipher.encrypt(raw_pt, record_trace=True)
    enc_pert = cipher.encrypt(perturbed_pt, record_trace=True)

    # Group traces by round for block 0
    traces_orig = [t for t in enc_orig["derivation_trace"] if t["block_index"] == 0]
    traces_pert = [t for t in enc_pert["derivation_trace"] if t["block_index"] == 0]

    round_progression: List[Dict[str, Any]] = []
    
    # Step 0 (input)
    round_progression.append({
        "round": 0,
        "step_name": "Input Block",
        "orig_hex": traces_orig[0]["state_hex"],
        "perturbed_hex": traces_pert[0]["state_hex"],
        "bits_different": 1,
        "total_bits": 64,
        "percentage": round((1 / 64) * 100, 2)
    })

    # Find the state at the end of each round (after Key Addition)
    for r in range(1, rounds + 1):
        step_orig = next((t for t in traces_orig if t["round"] == r and "Key Addition" in t["step_name"]), None)
        step_pert = next((t for t in traces_pert if t["round"] == r and "Key Addition" in t["step_name"]), None)

        if step_orig and step_pert:
            b_orig = bytes.fromhex(step_orig["state_hex"])
            b_pert = bytes.fromhex(step_pert["state_hex"])
            diff_bits = _hamming_distance(b_orig, b_pert)
            pct = round((diff_bits / 64) * 100, 2)

            round_progression.append({
                "round": r,
                "step_name": f"Round {r} Complete",
                "orig_hex": step_orig["state_hex"],
                "perturbed_hex": step_pert["state_hex"],
                "bits_different": diff_bits,
                "total_bits": 64,
                "percentage": pct
            })

    # Per-block avalanche on the perturbed block (Block 0)
    final_block_diff = round_progression[-1]["bits_different"]
    block_avalanche_pct = round_progression[-1]["percentage"]

    # Final overall ciphertext comparison
    c_orig = bytes.fromhex(enc_orig["ciphertext_hex"])
    c_pert = bytes.fromhex(enc_pert["ciphertext_hex"])
    total_cipher_bits = len(c_orig) * 8
    final_diff_bits = _hamming_distance(c_orig, c_pert)
    overall_pct = round((final_diff_bits / total_cipher_bits) * 100, 2)

    return {
        "plaintext_orig": plaintext,
        "plaintext_perturbed_hex": perturbed_pt.hex().upper(),
        "ciphertext_orig_hex": enc_orig["ciphertext_hex"],
        "ciphertext_perturbed_hex": enc_pert["ciphertext_hex"],
        "perturbed_block_bits_flipped": final_block_diff,
        "perturbed_block_total_bits": 64,
        "block_avalanche_percentage": block_avalanche_pct,
        "overall_bits_flipped": final_diff_bits,
        "total_ciphertext_bits": total_cipher_bits,
        "overall_avalanche_percentage": overall_pct,
        "round_progression": round_progression,
        "interpretation": (
            f"Block 0 achieved {block_avalanche_pct}% bit variance after {rounds} rounds (SAC ideal: 50.0%). "
            "A well-diffused symmetric block cipher exhibits between 45% and 55% "
            "bit variance within the perturbed block, proving resistance to statistical correlation."
        ),
        "mode_note": (
            "Note on Block Modes: Under independent block processing, changing a bit in Block 0 "
            "diffuses completely across Block 0, while subsequent blocks remain unaffected. "
            "To propagate diffusion across multiple blocks, block chaining modes (e.g. CBC) are utilized."
        )
    }
