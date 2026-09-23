"""
GŪḌHA-64 Core Cryptographic Engine
----------------------------------
Arthaśāstra-Inspired Symmetric Block Cipher System.

Architecture:
- Block Size: 64 bits (8 bytes)
- Master Key: 128 bits (16 bytes)
- Rounds: Configurable (default 6 rounds)
- Architecture: Substitution-Permutation Network (SPN) with Linear Modular Diffusion
- Invariant: Decrypt(Encrypt(P, K), K) == P for all P, K.
"""

from typing import List, Dict, Any, Tuple, Optional
from .sbox import substitute_block, inv_substitute_block
from .permutation import permute_block, inv_permute_block
from .diffusion import mix_block, inv_mix_block
from .key_schedule import derive_master_key, expand_key
from .padding import pad, unpad

def _xor_bytes(a: bytes, b: bytes) -> bytes:
    """Bitwise XOR between two byte sequences of equal length."""
    return bytes(x ^ y for x, y in zip(a, b))

def _count_flipped_bits(a: bytes, b: bytes) -> int:
    """Calculates Hamming distance (number of bit differences) between two byte strings."""
    return sum(bin(x ^ y).count('1') for x, y in zip(a, b))

class Gudha64Cipher:
    """
    Core implementation of the GŪḌHA-64 educational symmetric block cipher.
    """
    def __init__(self, key: str | bytes, rounds: int = 6):
        """
        Initializes cipher with a passphrase or 128-bit key and round count.
        """
        assert 2 <= rounds <= 16, "Supported rounds are between 2 and 16"
        self.rounds = rounds
        self.master_key = derive_master_key(key)
        self.round_keys = expand_key(self.master_key, rounds=rounds)

    def encrypt_block(
        self,
        block_bytes: bytes,
        block_index: int = 0,
        record_trace: bool = False
    ) -> Tuple[bytes, List[Dict[str, Any]]]:
        """
        Encrypts a single 64-bit (8-byte) block through the SPN pipeline.
        Optionally records detailed step-by-step derivation states.
        """
        assert len(block_bytes) == 8, "Block must be exactly 8 bytes (64 bits)"
        trace: List[Dict[str, Any]] = []
        state = block_bytes
        
        if record_trace:
            trace.append({
                "block_index": block_index,
                "round": 0,
                "step_name": "Input Block",
                "sanskrit_term": "Mūla Rūpa (मूल रूप)",
                "description": "Initial 64-bit plaintext block before transformation.",
                "state_hex": state.hex().upper(),
                "state_bytes": list(state),
                "round_key_hex": None,
                "bits_flipped": 0
            })

        # Pre-round Whitening (Key 0)
        prev_state = state
        state = _xor_bytes(state, self.round_keys[0])
        if record_trace:
            trace.append({
                "block_index": block_index,
                "round": 0,
                "step_name": "Pre-Round Whitening (Yoga)",
                "sanskrit_term": "Prārambhika Yoga (प्रारम्भिक योग)",
                "description": "Bitwise XOR with initial whitening key K_0 to prevent raw plaintext exposure.",
                "state_hex": state.hex().upper(),
                "state_bytes": list(state),
                "round_key_hex": self.round_keys[0].hex().upper(),
                "bits_flipped": _count_flipped_bits(prev_state, state)
            })

        # Iterative Transformation Rounds (1 to R)
        for r in range(1, self.rounds + 1):
            round_key = self.round_keys[r]

            # 1. Non-linear Substitution (Parivartana)
            prev_state = state
            state = substitute_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Substitution (Parivartana)",
                    "sanskrit_term": "Parivartana (परिवर्तन)",
                    "description": f"Round {r}: Byte-by-byte non-linear S-Box mapping to introduce confusion.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 2. Bit Permutation (Krama)
            prev_state = state
            state = permute_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Permutation (Krama)",
                    "sanskrit_term": "Krama (क्रम)",
                    "description": f"Round {r}: 8x8 bit-matrix transposition and 11-bit rotation for bitwise diffusion.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 3. Linear Diffusion (Miśraṇa)
            prev_state = state
            state = mix_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Diffusion (Miśraṇa)",
                    "sanskrit_term": "Miśraṇa (मिश्रण)",
                    "description": f"Round {r}: Invertible modular matrix multiplication over Z_256 for inter-byte mixing.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 4. Key Addition (Yoga)
            prev_state = state
            state = _xor_bytes(state, round_key)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Key Addition (Yoga)",
                    "sanskrit_term": "Yoga (योग)",
                    "description": f"Round {r}: Bitwise XOR with round sub-key K_{r}.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": round_key.hex().upper(),
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

        return state, trace

    def decrypt_block(
        self,
        block_bytes: bytes,
        block_index: int = 0,
        record_trace: bool = False
    ) -> Tuple[bytes, List[Dict[str, Any]]]:
        """
        Decrypts a single 64-bit (8-byte) block by inverting the SPN operations in reverse order.
        """
        assert len(block_bytes) == 8, "Block must be exactly 8 bytes (64 bits)"
        trace: List[Dict[str, Any]] = []
        state = block_bytes

        if record_trace:
            trace.append({
                "block_index": block_index,
                "round": self.rounds,
                "step_name": "Ciphertext Block",
                "sanskrit_term": "Gūḍha Rūpa (गूढ रूप)",
                "description": "Ciphertext block entering decryption pipeline.",
                "state_hex": state.hex().upper(),
                "state_bytes": list(state),
                "round_key_hex": None,
                "bits_flipped": 0
            })

        # Reverse rounds from R down to 1
        for r in range(self.rounds, 0, -1):
            round_key = self.round_keys[r]

            # 1. Reverse Key Addition (Yoga is self-inverting with XOR)
            prev_state = state
            state = _xor_bytes(state, round_key)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Inv Key Addition (Yoga)",
                    "sanskrit_term": "Viparīta Yoga (विपरीत योग)",
                    "description": f"Round {r} Decryption: XOR with round sub-key K_{r}.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": round_key.hex().upper(),
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 2. Reverse Linear Diffusion (Inv Miśraṇa)
            prev_state = state
            state = inv_mix_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Inv Diffusion (Miśraṇa)",
                    "sanskrit_term": "Viparīta Miśraṇa (विपरीत मिश्रण)",
                    "description": f"Round {r} Decryption: Inverse matrix multiplication in Z_256.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 3. Reverse Bit Permutation (Inv Krama)
            prev_state = state
            state = inv_permute_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Inv Permutation (Krama)",
                    "sanskrit_term": "Viparīta Krama (विपरीत क्रम)",
                    "description": f"Round {r} Decryption: Reverse rotation and bit matrix transpose.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

            # 4. Reverse Non-linear Substitution (Inv Parivartana)
            prev_state = state
            state = inv_substitute_block(state)
            if record_trace:
                trace.append({
                    "block_index": block_index,
                    "round": r,
                    "step_name": "Inv Substitution (Parivartana)",
                    "sanskrit_term": "Viparīta Parivartana (विपरीत परिवर्तन)",
                    "description": f"Round {r} Decryption: Inverse S-Box lookup table restoration.",
                    "state_hex": state.hex().upper(),
                    "state_bytes": list(state),
                    "round_key_hex": None,
                    "bits_flipped": _count_flipped_bits(prev_state, state)
                })

        # Reverse Pre-Round Whitening (Key 0)
        prev_state = state
        state = _xor_bytes(state, self.round_keys[0])
        if record_trace:
            trace.append({
                "block_index": block_index,
                "round": 0,
                "step_name": "Un-whitened Plaintext",
                "sanskrit_term": "Mūla Prakaṭana (मूल प्रकटन)",
                "description": "Final XOR with K_0 restoring authentic original plaintext block.",
                "state_hex": state.hex().upper(),
                "state_bytes": list(state),
                "round_key_hex": self.round_keys[0].hex().upper(),
                "bits_flipped": _count_flipped_bits(prev_state, state)
            })

        return state, trace

    def encrypt(
        self,
        plaintext: str | bytes,
        record_trace: bool = True
    ) -> Dict[str, Any]:
        """
        Encrypts arbitrary length plaintext string or bytes.
        Applies PKCS#7 padding and processes blocks.
        """
        if isinstance(plaintext, str):
            data_bytes = plaintext.encode('utf-8')
        else:
            data_bytes = plaintext

        padded_data = pad(data_bytes, block_size=8)
        num_blocks = len(padded_data) // 8
        ciphertext_bytes = bytearray()
        all_traces: List[Dict[str, Any]] = []

        for i in range(num_blocks):
            block = padded_data[i * 8 : (i + 1) * 8]
            enc_block, trace = self.encrypt_block(block, block_index=i, record_trace=record_trace)
            ciphertext_bytes.extend(enc_block)
            if record_trace:
                all_traces.extend(trace)

        return {
            "plaintext_hex": data_bytes.hex().upper(),
            "padded_hex": padded_data.hex().upper(),
            "ciphertext_hex": bytes(ciphertext_bytes).hex().upper(),
            "block_count": num_blocks,
            "rounds": self.rounds,
            "master_key_hex": self.master_key.hex().upper(),
            "round_keys_hex": [k.hex().upper() for k in self.round_keys],
            "derivation_trace": all_traces
        }

    def decrypt(
        self,
        ciphertext_hex: str,
        record_trace: bool = False
    ) -> Dict[str, Any]:
        """
        Decrypts a hex-encoded ciphertext, unpads PKCS#7, and returns restored plaintext.
        """
        try:
            cipher_bytes = bytes.fromhex(ciphertext_hex.strip())
        except ValueError:
            raise ValueError("Ciphertext must be a valid hexadecimal string")

        if len(cipher_bytes) % 8 != 0:
            raise ValueError("Ciphertext length must be a multiple of 8 bytes (64 bits)")

        num_blocks = len(cipher_bytes) // 8
        decrypted_padded = bytearray()
        all_traces: List[Dict[str, Any]] = []

        for i in range(num_blocks):
            block = cipher_bytes[i * 8 : (i + 1) * 8]
            dec_block, trace = self.decrypt_block(block, block_index=i, record_trace=record_trace)
            decrypted_padded.extend(dec_block)
            if record_trace:
                all_traces.extend(trace)

        unpadded_bytes = unpad(bytes(decrypted_padded), block_size=8)
        try:
            plaintext_str = unpadded_bytes.decode('utf-8')
        except UnicodeDecodeError:
            plaintext_str = unpadded_bytes.decode('latin1', errors='replace')

        return {
            "ciphertext_hex": ciphertext_hex.upper(),
            "decrypted_padded_hex": bytes(decrypted_padded).hex().upper(),
            "plaintext_hex": unpadded_bytes.hex().upper(),
            "plaintext": plaintext_str,
            "block_count": num_blocks,
            "rounds": self.rounds,
            "derivation_trace": all_traces
        }
