"""
Verification Test Suite: Key Expansion (Vistāra)
Ensures key schedule produces distinct, high-entropy round keys with avalanche behavior.
"""

from backend.app.cipher.key_schedule import derive_master_key, expand_key

def test_key_expansion_distinct_subkeys():
    master_key = derive_master_key("KAUTILYA_CHANAKYA_321BCE")
    round_keys = expand_key(master_key, rounds=8)
    
    # Must produce 9 subkeys for 8 rounds
    assert len(round_keys) == 9
    
    # All subkeys must be 8 bytes
    assert all(len(k) == 8 for k in round_keys)
    
    # All round keys must be mutually distinct (no symmetry or trivial cycles)
    unique_subkeys = set(round_keys)
    assert len(unique_subkeys) == len(round_keys)

def test_key_avalanche_in_schedule():
    """Flipping 1 character in the master key should flip at least 30-60% of bits in derived subkeys."""
    key_a = derive_master_key("KAUTILYA")
    key_b = derive_master_key("KAUTILYB")  # 1 char diff
    
    subkeys_a = expand_key(key_a, rounds=6)
    subkeys_b = expand_key(key_b, rounds=6)
    
    total_bits = 7 * 64
    flipped_bits = 0
    for ka, kb in zip(subkeys_a, subkeys_b):
        flipped_bits += sum(bin(x ^ y).count('1') for x, y in zip(ka, kb))
        
    flip_pct = (flipped_bits / total_bits) * 100
    # Good cryptographic key schedule should have ~40-60% bit difference
    assert 35.0 <= flip_pct <= 65.0, f"Key schedule avalanche was {flip_pct:.2f}%"
