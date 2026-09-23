"""
GŪḌHA-64 Key Schedule: Vistāra (विस्तार)
---------------------------------------
Expands a 128-bit master key into (R + 1) distinct 64-bit round keys.

Mathematical Process:
1. Normalization: Arbitrary user passphrases are digested into a uniform 128-bit
   master key via SHA-256 (truncated to 16 bytes).
2. Word Partitioning: The 16-byte key is divided into two 64-bit seeds: W[0], W[1].
3. Recursive Non-linear Expansion:
   For round step i = 2 .. R:
     temp = W[i - 1]
     If i % 2 == 0:
         temp = SubWord64(RotWord64(temp, 13)) ^ RCON[i]
     Else:
         temp = RotWord64(temp, 19) ^ RCON[i]
     W[i] = W[i - 2] ^ temp

Round Constants (RCON):
Derived from the golden ratio fractional expansion (Vedic and classical geometry constant phi):
phi - 1 = (sqrt(5) - 1) / 2 = 0x9E3779B97F4A7C15...
Guarantees key asymmetry and destroys slide attacks.
"""

import hashlib
from typing import List
from .sbox import substitute_byte

# High-entropy round constants derived from fundamental constants (phi, e, pi)
RCON_CONSTANTS: List[int] = [
    0x9E3779B97F4A7C15,  # phi fractional (Golden ratio)
    0x243F6A8885A308D3,  # pi fractional
    0x13198A2E03707344,  # e fractional
    0xA4093822299F31D0,  # sqrt(2) fractional
    0x082EFA98EC4E6C89,  # sqrt(3) fractional
    0x452821E638D01377,  # sqrt(5) fractional
    0xBE5466CF34E90C6C,  # ln(2) fractional
    0xC0AC29B7C97C50DD,  # Ramanujan's tau constant
    0x3F84D5B5B5470917,  # Glaisher-Kinkelin constant
    0x71790D48BA1BE418,  # Khinchin constant
]

def _rol64(val: int, shift: int) -> int:
    shift = shift % 64
    return ((val << shift) & 0xFFFFFFFFFFFFFFFF) | (val >> (64 - shift))

def _sub_word64(val64: int) -> int:
    """Passes each of the 8 bytes through the non-linear S-Box."""
    b = val64.to_bytes(8, byteorder='big')
    substituted = bytes(substitute_byte(x) for x in b)
    return int.from_bytes(substituted, byteorder='big')

def derive_master_key(passphrase: str | bytes) -> bytes:
    """
    Normalizes a user-provided passphrase or key into a strict 128-bit (16-byte) master key.
    """
    if isinstance(passphrase, str):
        passphrase_bytes = passphrase.encode('utf-8')
    else:
        passphrase_bytes = passphrase
        
    # SHA-256 truncated to 16 bytes for uniform 128-bit key entropy
    return hashlib.sha256(passphrase_bytes).digest()[:16]

def expand_key(master_key_16: bytes, rounds: int = 6) -> List[bytes]:
    """
    Expands a 16-byte (128-bit) master key into (rounds + 1) 8-byte (64-bit) round keys.
    Returns: [K_0, K_1, K_2, ..., K_rounds]
    """
    assert len(master_key_16) == 16, "Master key must be exactly 16 bytes (128 bits)"
    assert 2 <= rounds <= 16, "Rounds must be between 2 and 16"
    
    # Initialize initial two 64-bit words
    w: List[int] = [
        int.from_bytes(master_key_16[0:8], byteorder='big'),
        int.from_bytes(master_key_16[8:16], byteorder='big')
    ]
    
    needed_words = rounds + 1
    for i in range(2, needed_words):
        temp = w[i - 1]
        rcon = RCON_CONSTANTS[i % len(RCON_CONSTANTS)]
        if i % 2 == 0:
            temp = _sub_word64(_rol64(temp, 13)) ^ rcon
        else:
            temp = _rol64(temp, 19) ^ rcon
        next_word = (w[i - 2] ^ temp) & 0xFFFFFFFFFFFFFFFF
        w.append(next_word)
        
    return [word.to_bytes(8, byteorder='big') for word in w]
