"""
API Endpoints: Cryptographic Property Analysis & Educational Attacks
"""

from fastapi import APIRouter, HTTPException
from ..analysis.avalanche import analyze_avalanche
from ..analysis.sensitivity import analyze_key_sensitivity, analyze_plaintext_sensitivity
from ..analysis.frequency import analyze_frequency_distribution
from ..analysis.benchmark import benchmark_cipher_performance
from ..analysis.cryptanalysis import demo_weak_vs_strong_frequency, demo_controlled_brute_force
from ..models.schemas import (
    AvalancheRequest,
    KeySensitivityRequest,
    PlaintextSensitivityRequest,
    FrequencyRequest,
    BruteForceDemoRequest
)

router = APIRouter(prefix="/analysis", tags=["Analysis"])

@router.post("/avalanche")
def get_avalanche_analysis(req: AvalancheRequest):
    try:
        return analyze_avalanche(plaintext=req.plaintext, key=req.key, rounds=req.rounds)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/key-sensitivity")
def get_key_sensitivity(req: KeySensitivityRequest):
    try:
        return analyze_key_sensitivity(
            plaintext=req.plaintext,
            key_a=req.key_a,
            key_b=req.key_b,
            rounds=req.rounds
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/plaintext-sensitivity")
def get_plaintext_sensitivity(req: PlaintextSensitivityRequest):
    try:
        return analyze_plaintext_sensitivity(
            plaintext_a=req.plaintext_a,
            plaintext_b=req.plaintext_b,
            key=req.key,
            rounds=req.rounds
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/frequency")
def get_frequency_analysis(req: FrequencyRequest):
    try:
        return analyze_frequency_distribution(
            plaintext=req.plaintext,
            ciphertext_hex=req.ciphertext_hex
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/benchmark")
def get_benchmark(rounds: int = 6, full: bool = False):
    try:
        return benchmark_cipher_performance(rounds=rounds, full=full)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/demo/frequency")
def get_frequency_demo(sample_text: str = "SECRET DISPATCH FOR ARTHASHASTRA CHANCELLERY: ATTACK AT DAWN."):
    try:
        return demo_weak_vs_strong_frequency(sample_text=sample_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/demo/brute-force")
def get_brute_force_demo(req: BruteForceDemoRequest):
    try:
        return demo_controlled_brute_force(
            target_pin=req.target_pin,
            keyspace_bits=req.keyspace_bits
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
