"""
GŪḌHA-64 Permutation: Krama (क्रम)
----------------------------------
A bit-level transposition and rotation network operating on 64-bit blocks.

Mathematical Construction:
1. Matrix Transposition (8x8 Bit Matrix):
   Arrange 64 bits as an 8x8 grid where row i is byte i, and column j is bit j.
   Transposing (i, j) -> (j, i) distributes all 8 bits of every byte across
   8 distinct output bytes.
2. Cyclic Bit Diffusion:
   Rotate the entire 64-bit integer left by 11 positions (coprime to 64: gcd(11, 64) = 1)
   to ensure diagonal elements are non-stationary and disperse across positions.

Strict Invertibility:
Inverse Krama performs:
1. Rotate right by 11 positions.
2. 8x8 Bit Matrix Transposition (matrix transpose is self-inverting: (A^T)^T = A).
"""

ROTATION_OFFSET = 11

def _transpose_8x8_bits(val64: int) -> int:
    """
    Transposes an 8x8 bit matrix represented as a 64-bit unsigned integer.
    Bit at (row i, col j) -> (row j, col i).
    Byte i is row i (bits 8*i to 8*i + 7).
    """
    out64 = 0
    for i in range(8):
        for j in range(8):
            # Extract bit at row i, col j
            # In byte i, bit position j is at (i * 8 + j)
            src_bit = (val64 >> (i * 8 + j)) & 1
            # Place at row j, col i (j * 8 + i)
            out64 |= (src_bit << (j * 8 + i))
    return out64

def _rol64(val64: int, shift: int) -> int:
    """Circular 64-bit left shift."""
    shift = shift % 64
    return ((val64 << shift) & 0xFFFFFFFFFFFFFFFF) | (val64 >> (64 - shift))

def _ror64(val64: int, shift: int) -> int:
    """Circular 64-bit right shift."""
    shift = shift % 64
    return (val64 >> shift) | ((val64 << (64 - shift)) & 0xFFFFFFFFFFFFFFFF)

def permute_block(block_bytes: bytes) -> bytes:
    """
    Applies forward Krama permutation to an 8-byte (64-bit) block:
    Transposition (8x8 bit matrix) followed by 11-bit cyclic left rotation.
    """
    assert len(block_bytes) == 8, "Block must be exactly 8 bytes (64 bits)"
    val64 = int.from_bytes(block_bytes, byteorder='big')
    transposed = _transpose_8x8_bits(val64)
    rotated = _rol64(transposed, ROTATION_OFFSET)
    return rotated.to_bytes(8, byteorder='big')

def inv_permute_block(block_bytes: bytes) -> bytes:
    """
    Applies reverse Krama permutation to an 8-byte (64-bit) block:
    11-bit cyclic right rotation followed by 8x8 bit matrix transposition.
    """
    assert len(block_bytes) == 8, "Block must be exactly 8 bytes (64 bits)"
    val64 = int.from_bytes(block_bytes, byteorder='big')
    unrotated = _ror64(val64, ROTATION_OFFSET)
    untransposed = _transpose_8x8_bits(unrotated)
    return untransposed.to_bytes(8, byteorder='big')
