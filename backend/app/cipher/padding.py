"""
GŪḌHA-64 Block Padding: PKCS#7 Compatible
-------------------------------------------
Symmetric block ciphers operate on fixed-size blocks (8 bytes / 64 bits).
This module ensures arbitrary length plaintexts are padded to a multiple
of 8 bytes and unpadded securely upon decryption.

Padding rule:
If N bytes are needed to reach a multiple of 8, append N bytes each having the value N.
If the input is already an exact multiple of 8 bytes, append 8 bytes of value 8.
Valid padding byte values: 1 through 8.
"""

def pad(data: bytes, block_size: int = 8) -> bytes:
    """
    Applies standard PKCS#7 padding for block_size (default 8 bytes).
    """
    assert 1 <= block_size <= 255, "Block size must be between 1 and 255"
    pad_len = block_size - (len(data) % block_size)
    padding = bytes([pad_len] * pad_len)
    return data + padding

def unpad(padded_data: bytes, block_size: int = 8) -> bytes:
    """
    Removes PKCS#7 padding. Raises ValueError if padding is malformed.
    """
    if len(padded_data) == 0:
        raise ValueError("Cannot unpad empty payload")
    if len(padded_data) % block_size != 0:
        raise ValueError(f"Payload length ({len(padded_data)}) is not a multiple of block size ({block_size})")
        
    pad_len = padded_data[-1]
    if pad_len < 1 or pad_len > block_size:
        raise ValueError(f"Invalid padding byte value: {pad_len}")
        
    padding = padded_data[-pad_len:]
    if padding != bytes([pad_len] * pad_len):
        raise ValueError("Corrupted or invalid PKCS#7 padding sequence")
        
    return padded_data[:-pad_len]
