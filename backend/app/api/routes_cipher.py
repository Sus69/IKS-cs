"""
API Endpoints: Core Cipher Operations
"""

from fastapi import APIRouter, HTTPException
from ..cipher.engine import Gudha64Cipher
from ..cipher.sbox import SBOX, INV_SBOX
from ..cipher.diffusion import DIFFUSION_MATRIX, INV_DIFFUSION_MATRIX
from ..models.schemas import EncryptRequest, DecryptRequest, EncryptResponse, DecryptResponse

router = APIRouter(prefix="/cipher", tags=["Cipher"])

@router.post("/encrypt", response_model=EncryptResponse)
def encrypt_message(req: EncryptRequest):
    """
    Encrypts arbitrary plaintext using GŪḌHA-64 with PKCS#7 padding
    and records step-by-step derivation history.
    """
    try:
        cipher = Gudha64Cipher(key=req.key, rounds=req.rounds)
        result = cipher.encrypt(req.plaintext, record_trace=req.record_trace, mode=req.mode, iv_hex=req.iv_hex, authenticate=req.authenticate)
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/decrypt", response_model=DecryptResponse)
def decrypt_message(req: DecryptRequest):
    """
    Decrypts a hex-encoded ciphertext using GŪḌHA-64, inverting all rounds
    and stripping PKCS#7 padding.
    """
    try:
        cipher = Gudha64Cipher(key=req.key, rounds=req.rounds)
        result = cipher.decrypt(req.ciphertext_hex, record_trace=req.record_trace, mode=req.mode, iv_hex=req.iv_hex, expected_tag=req.auth_tag_hex)
        return result
    except Exception as e:
        # Uniform 400 for all decryption failures (bad hex, length, padding,
        # auth mismatch, UTF-8) so status codes don't leak padding state.
        raise HTTPException(status_code=400, detail=f"Decryption failed: {str(e)}")

@router.get("/components")
def get_cipher_components():
    """
    Returns the mathematical tables and parameters of GŪḌHA-64 for laboratory inspection.
    """
    return {
        "cipher_name": "GŪḌHA-64",
        "block_size_bits": 64,
        "block_size_bytes": 8,
        "master_key_size_bits": 128,
        "master_key_size_bytes": 16,
        "default_rounds": 6,
        "min_rounds": 2,
        "max_rounds": 16,
        "sbox_parivartana": {
            "size": len(SBOX),
            "table_hex": [f"0x{b:02X}" for b in SBOX],
            "is_bijective": len(set(SBOX)) == 256,
            "has_fixed_points": any(SBOX[i] == i for i in range(256))
        },
        "inv_sbox": {
            "size": len(INV_SBOX),
            "table_hex": [f"0x{b:02X}" for b in INV_SBOX]
        },
        "diffusion_matrix_misrana": DIFFUSION_MATRIX,
        "inv_diffusion_matrix": INV_DIFFUSION_MATRIX,
        "permutation_krama": {
            "type": "8x8 Bit Matrix Transposition with 11-bit Circular Left Rotation",
            "rotation_offset_bits": 11
        }
    }
