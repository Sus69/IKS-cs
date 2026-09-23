"""
Pydantic Schemas for GŪḌHA API
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class EncryptRequest(BaseModel):
    plaintext: str = Field(..., description="Message string to encrypt", min_length=0)
    key: str = Field(..., description="Passphrase or secret key", min_length=1)
    rounds: int = Field(6, ge=2, le=16, description="Number of transformation rounds (2-16)")
    record_trace: bool = Field(True, description="Whether to capture step-by-step derivation history")

class DecryptRequest(BaseModel):
    ciphertext_hex: str = Field(..., description="Hexadecimal-encoded ciphertext", min_length=2)
    key: str = Field(..., description="Passphrase or secret key used for encryption", min_length=1)
    rounds: int = Field(6, ge=2, le=16, description="Number of transformation rounds used during encryption")
    record_trace: bool = Field(False, description="Whether to capture step-by-step reverse derivation history")

class StepTraceItem(BaseModel):
    block_index: int
    round: int
    step_name: str
    sanskrit_term: str
    description: str
    state_hex: str
    state_bytes: List[int]
    round_key_hex: Optional[str] = None
    bits_flipped: int

class EncryptResponse(BaseModel):
    plaintext_hex: str
    padded_hex: str
    ciphertext_hex: str
    block_count: int
    rounds: int
    master_key_hex: str
    round_keys_hex: List[str]
    derivation_trace: List[StepTraceItem]

class DecryptResponse(BaseModel):
    ciphertext_hex: str
    decrypted_padded_hex: str
    plaintext_hex: str
    plaintext: str
    block_count: int
    rounds: int
    derivation_trace: List[StepTraceItem]

class AvalancheRequest(BaseModel):
    plaintext: str = Field("HELLO WORLD, KAUTILYA", description="Base plaintext message")
    key: str = Field("SECRET_ARTHASHASTRA", description="Secret key")
    rounds: int = Field(6, ge=2, le=16)

class KeySensitivityRequest(BaseModel):
    plaintext: str = Field("CONFIDENTIAL DISPATCH FOR THE MAURYAN CHANCELLERY", description="Plaintext message")
    key_a: str = Field("KAUTILYA_SECRET_A", description="First key")
    key_b: str = Field("KAUTILYA_SECRET_B", description="Second key differing minimally")
    rounds: int = Field(6, ge=2, le=16)

class PlaintextSensitivityRequest(BaseModel):
    plaintext_a: str = Field("HELLO WORLD", description="First plaintext message")
    plaintext_b: str = Field("HELLO WORLE", description="Second plaintext message differing by 1 character")
    key: str = Field("KAUTILYA_DEFAULT_KEY", description="Common secret key")
    rounds: int = Field(6, ge=2, le=16)

class FrequencyRequest(BaseModel):
    plaintext: str = Field(..., description="Original plaintext")
    ciphertext_hex: str = Field(..., description="Hex ciphertext")

class BruteForceDemoRequest(BaseModel):
    target_pin: int = Field(1423, description="Target integer key within keyspace")
    keyspace_bits: int = Field(12, ge=4, le=14, description="Restricted demo keyspace (4 to 14 bits)")
