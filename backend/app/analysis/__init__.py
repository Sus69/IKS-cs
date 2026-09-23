"""
GŪḌHA Analysis Package
"""

from .avalanche import analyze_avalanche
from .sensitivity import analyze_key_sensitivity, analyze_plaintext_sensitivity
from .frequency import analyze_frequency_distribution, calculate_shannon_entropy, calculate_monobit_balance
from .benchmark import benchmark_cipher_performance
from .cryptanalysis import demo_weak_vs_strong_frequency, demo_controlled_brute_force

__all__ = [
    "analyze_avalanche",
    "analyze_key_sensitivity",
    "analyze_plaintext_sensitivity",
    "analyze_frequency_distribution",
    "calculate_shannon_entropy",
    "calculate_monobit_balance",
    "benchmark_cipher_performance",
    "demo_weak_vs_strong_frequency",
    "demo_controlled_brute_force"
]
