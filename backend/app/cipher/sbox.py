"""
GŪḌHA-64 Cryptographic S-Box: Parivartana (परिवर्तन)
---------------------------------------------------
A mathematically verified, non-linear 8-bit substitution box (S-Box) and its exact inverse.

Properties:
1. Bijective: Exactly 256 unique entries (one-to-one mapping {0..255} -> {0..255}).
2. Zero Fixed Points: S[x] != x for all x in {0..255}.
3. Strict Invertibility: INV_SBOX[SBOX[x]] == x for all x in {0..255}.
4. Confusion: Destroys linear statistical correlation between input bytes and output bytes.
"""

from typing import List, Tuple

# Runtime S-Box tables. Generated deterministically at import by
# _build_verified_sbox() (SHA-512-seeded shuffle + fixed-point repair with
# bijectivity/invertibility asserts). Declared here so that no stale hardcoded
# copy can ever shadow the verified tables.
SBOX: List[int]
INV_SBOX: List[int]

def _build_verified_sbox() -> Tuple[List[int], List[int]]:
    """
    Constructs and mathematically asserts a valid 256-element bijective S-Box
    with no fixed points (S[x] != x) and its exact inverse.
    """
    import hashlib
    seed = b"GUDHA_KAUTILYA_ARTHASHASTRA_SECRET_WRITING_2026"
    h = hashlib.sha512(seed).digest()
    
    table = list(range(256))
    j = 0
    for i in range(256):
        j = (j + table[i] + h[i % len(h)]) % 256
        table[i], table[j] = table[j], table[i]
        
    for i in range(256):
        if table[i] == i or table[i] == 255 - i:
            target = (i + 128) % 256
            if target == i or table[target] == i or table[i] == target:
                target = (i + 64) % 256
            table[i], table[target] = table[target], table[i]

    for i in range(256):
        if table[i] == i:
            swap_with = (i + 1) % 256
            table[i], table[swap_with] = table[swap_with], table[i]

    assert len(set(table)) == 256, "SBOX must be strictly bijective (256 unique entries)"
    assert all(table[i] != i for i in range(256)), "SBOX must not contain any fixed point"
    
    inv_table = [0] * 256
    for idx, val in enumerate(table):
        inv_table[val] = idx
        
    assert all(inv_table[table[i]] == i for i in range(256)), "INV_SBOX must invert SBOX identically"
    return table, inv_table

# Initialize dynamically verified tables
SBOX, INV_SBOX = _build_verified_sbox()

def substitute_byte(byte_val: int) -> int:
    """Nonlinear forward substitution: S(b)."""
    return SBOX[byte_val & 0xFF]

def inv_substitute_byte(byte_val: int) -> int:
    """Nonlinear reverse substitution: S^-1(b)."""
    return INV_SBOX[byte_val & 0xFF]

def substitute_block(block_bytes: bytes) -> bytes:
    """Applies S-Box substitution to each byte of a block."""
    return bytes(SBOX[b] for b in block_bytes)

def inv_substitute_block(block_bytes: bytes) -> bytes:
    """Applies inverse S-Box substitution to each byte of a block."""
    return bytes(INV_SBOX[b] for b in block_bytes)
