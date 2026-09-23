"""
GŪḌHA-64 Linear Diffusion: Miśraṇa (मिश्रण)
--------------------------------------------
An invertible modular matrix multiplication network over the integer ring Z_256.

Mathematical Construction:
Operates on the 8-byte state vector [b_0, b_1, b_2, b_3, b_4, b_5, b_6, b_7]^T.
Applies an 8x8 circulant matrix M:
   y_i = sum(M[i][j] * x_j for j in 0..7) mod 256

Properties:
1. Maximal Diffusion: Every output byte y_i is a weighted combination of all 8 input bytes.
   Changing a single byte affects multiple output bytes immediately.
2. Invertible in Z_256: Because det(M) = -5265, which is odd (gcd(-5265, 256) = 1),
   M has an exact integer inverse matrix M_INV mod 256.
3. Pure Arithmetic: Executed with exact 8-bit integer math without floating-point errors.
"""

from typing import List

# Circulant row generator for forward diffusion matrix M
_DIFFUSION_ROW = [1, 2, 1, 4, 1, 2, 1, 1]

# Build 8x8 forward matrix
DIFFUSION_MATRIX: List[List[int]] = [
    [_DIFFUSION_ROW[(j - i) % 8] for j in range(8)]
    for i in range(8)
]

# Verified exact inverse matrix M^-1 mod 256
_INV_DIFFUSION_ROW = [63, 29, 63, 114, 63, 200, 63, 114]

INV_DIFFUSION_MATRIX: List[List[int]] = [
    [_INV_DIFFUSION_ROW[(j - i) % 8] for j in range(8)]
    for i in range(8)
]

def mix_block(block_bytes: bytes) -> bytes:
    """
    Applies linear modular matrix diffusion: Y = (M * X) mod 256.
    Every output byte is a linear combination of all 8 input bytes.
    """
    assert len(block_bytes) == 8, "Block must be exactly 8 bytes"
    out = bytearray(8)
    for i in range(8):
        acc = 0
        for j in range(8):
            acc += DIFFUSION_MATRIX[i][j] * block_bytes[j]
        out[i] = acc % 256
    return bytes(out)

def inv_mix_block(block_bytes: bytes) -> bytes:
    """
    Applies inverse linear modular matrix diffusion: X = (M_INV * Y) mod 256.
    Restores the exact pre-mixing state.
    """
    assert len(block_bytes) == 8, "Block must be exactly 8 bytes"
    out = bytearray(8)
    for i in range(8):
        acc = 0
        for j in range(8):
            acc += INV_DIFFUSION_MATRIX[i][j] * block_bytes[j]
        out[i] = acc % 256
    return bytes(out)
