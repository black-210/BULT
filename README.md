# BULT — Elite Purple-Team, RF Intelligence & Multidisciplinary Forensics System

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Language: C> (C-Greater)](https://img.shields.io/badge/Language-C%3E%20(C--Greater)-green.svg)](https://github.com/black-210/C-)
[![Architecture: Native](https://img.shields.io/badge/Architecture-Native%20Systems-orange.svg)](#)

> **BULT** is an integrated native intelligence and multidisciplinary scientific analysis platform combining RF spectrum processing, experimental RF-DNA fingerprinting, direction finding & localization, authorized red-team vulnerability assessment, blue-team detection, purple-team correlation, electromagnetic/physical analysis, and chemical spectroscopy forensics.

- **Maintainer**: `black-210` (<https://github.com/black-210>)
- **Repository**: `https://github.com/black-210/BULT`
- **Language Specification**: C> Systems Programming Language ([`black-210/C-`](https://github.com/black-210/C-))
- **License**: GNU Affero General Public License v3.0 (`GNU AGPL-3.0`)

---

## Table of Contents

1. [Language Specification & C> Foundation](#1-language-specification--c-foundation)
2. [Subsystem Architecture](#2-subsystem-architecture)
3. [Core Capabilities](#3-core-capabilities)
   - [RF Intelligence & RF-DNA](#rf-intelligence--rf-dna)
   - [Direction Finding & Localization](#direction-finding--localization)
   - [Red Team Security Assessment](#red-team-security-assessment)
   - [Blue Team Defensive Forensics](#blue-team-defensive-forensics)
   - [Purple Team Correlation & Validation](#purple-team-correlation--validation)
   - [Physical Forensics & Electromagnetic Analysis](#physical-forensics--electromagnetic-analysis)
   - [Chemical Forensics & Spectroscopy](#chemical-forensics--spectroscopy)
   - [Digital Forensics & Case Management](#digital-forensics--case-management)
4. [Building BULT](#4-building-bult)
5. [Interactive Terminal Shell (`BULT >`)](#5-interactive-terminal-shell-bult-)
6. [Native Desktop Workstation](#6-native-desktop-workstation)
7. [Repository Structure](#7-repository-structure)
8. [Legal & Operational Boundaries](#8-legal--operational-boundaries)

---

## 1. Language Specification & C> Foundation

BULT is implemented directly targeting the **C>** (C-Greater) Systems Programming Language specification created by `black-210`:
- **Syntax**: Affine ownership (`own<T>`), explicit moves (`move(x)`), safe references (`&T`, `&mut T`), and context-isolated unsafe blocks (`unsafe { ... }`).
- **Source Files**: Defined in `src/*/*.cgt` (e.g. `src/core/bult_core.cgt`, `src/rf/bult_rf.cgt`, etc.).
- **Native Companion Interop**: For bootstrapping on POSIX systems without an existing `cgt` compiler driver binary, ISO C11 companion implementations (`src/*/*.c`, `include/bult/*.h`) provide 100% binary-compatible execution via standard GCC, Clang, or CMake.

---

## 2. Subsystem Architecture

```
                                  +---------------------------------------+
                                  |         BULT Unified Core             |
                                  |    (Case, Findings, SHA-256 Hashes)   |
                                  +---------------------------------------+
                                        /            |             \
                +----------------------+             |              +----------------------+
                |                                    |                                     |
    [RF Intelligence Engine]               [Security Operations]                [Physical & Chemical]
   - Raw IQ Ingestion (complex64/128)      - Red: Static Code & API Audit       - FSPL Path Loss with Error Prop
   - Radix-2 Cooley-Tukey FFT              - Red: Mutation Parser Fuzzer        - EM Wavelength & Skin Depth
   - PSD, SNR, Bandwidth (3dB/10dB)        - Blue: SHA-256 Manifest Verifier    - Chemical Formula Parser (IUPAC)
   - RF-DNA Statistical Fingerprint        - Blue: Event Rule Alert Engine      - Spectroscopy Peak & FWHM Solver
   - Bearing Triangulation & TDoA          - Purple: Detection Coverage %       - Evidence Custody Chain Tracker
```

---

## 3. Core Capabilities

### RF Intelligence & RF-DNA
- **IQ Ingestion**: Parses `complex64`, `complex128`, and signed 16-bit integer raw captures.
- **Spectral Analysis**: In-place Radix-2 Cooley-Tukey FFT with Rectangular, Hann, Hamming, and Blackman windowing; calculates noise floor, peak frequency, SNR, 3dB/10dB bandwidth, DC offset, and IQ imbalance.
- **RF-DNA Fingerprinting**: Extracts instantaneous amplitude variance, skewness, kurtosis, instantaneous phase variance, spectral entropy, and centroid moments.
- **Transmitter Comparison**: Computes normalized Euclidean similarity metrics between captures. Explicitly reports that statistical waveform similarity is a comparative metric and does not constitute hardware transmitter authentication without lab calibration.

### Direction Finding & Localization
- **Triangulation**: Solves multi-station bearing intersection using weighted least-squares.
- **TDoA**: Solves hyperbolic time-difference-of-arrival positions.
- **Uncertainty Ellipse**: Computes 95% confidence covariance ellipse (Semi-Major, Semi-Minor, Orientation angle).
- **Scientific Validation**: Explicitly rejects queries with fewer than 2 bearings or fewer than 3 TDoA stations, emitting an `INSUFFICIENT DATA` finding rather than fabricating coordinates.

### Red Team Security Assessment
- **Static API Audit**: Identifies banned libc memory functions (`strcpy`, `gets`, `sprintf`, `system`, `strcat`, `vsprintf`).
- **Credential Leak Detection**: Identifies hardcoded secrets and token patterns.
- **Integer Overflow Risk**: Flags unchecked dynamic allocations (`malloc(n * size)`).
- **Mutation Fuzzer**: Deterministic byte-mutation engine for stress-testing local parsers.

### Blue Team Defensive Forensics
- **Integrity Manifests**: Verifies target file integrity against reference SHA-256 manifests; detects configuration drift.
- **Detection Rules Engine**: Evaluates log streams against defensive rule definitions.
- **Timeline Reconstruction**: Reconstructs chronological forensic event logs.

### Purple Team Correlation & Validation
- **Correlation**: Maps Red findings to Blue detection rules.
- **Coverage Metric**: Mathematically calculates true coverage: $C = \frac{\text{covered}}{\text{total}} \times 100\%$.
- **Gap Analysis**: Identifies uncovered vectors and produces remediation reports in Markdown and JSON.

### Physical Forensics & Electromagnetic Analysis
- **Free-Space Path Loss (FSPL)**: $FSPL(dB) = 20\log_{10}(d) + 20\log_{10}(f) + 20\log_{10}\left(\frac{4\pi}{c}\right)$ with Gaussian uncertainty propagation ($\sigma_{\text{FSPL}}$).
- **EM Calculations**: Wavelength $\lambda = c/f$, half-wave dipole resonant length, conductor skin depth $\delta = \sqrt{1 / (\pi f \mu \sigma)}$.

### Chemical Forensics & Spectroscopy
- **Formula Parser**: Tokenizes molecular formulas (e.g. `C8H10N4O2`, `C7H5N3O6`) and calculates high-precision molecular mass using IUPAC atomic weights.
- **Stoichiometry**: Computes percent mass fraction for each constituent element.
- **Spectroscopy**: Identifies absorbance/Raman/FTIR peaks, computes Full Width at Half Maximum (FWHM), estimates baseline noise, and correlates functional groups.

---

## 4. Building BULT

### Requirements
- ISO C11 compiler (`gcc` >= 9.0 or `clang` >= 10.0)
- `cmake` >= 3.16 or GNU `make`
- Standard C math library (`-lm`)

### Build with CMake
```bash
git clone https://github.com/black-210/BULT.git
cd BULT
mkdir build && cd build
cmake ..
cmake --build .
ctest --output-on-failure
```

### Build with Make
```bash
make
make test
```

---

## 5. Interactive Terminal Shell (`BULT >`)

Launch the BULT interactive terminal console:
```bash
./bin/bult
```

Example session:
```text
BULT > intel status
[RF INTEL STATUS]
  Receiver Status: RECEIVE-ONLY (Passive capture mode)
  Sample Rates: Supported up to 56 MSPS (complex64/complex128)

BULT > intel spectrum analyze fixtures/iq_sample.raw
[RF SPECTRUM ANALYSIS]
  Center Freq:     433.920 MHz
  Peak Frequency:  434.070 MHz
  Peak Power:      -14.20 dB
  Noise Floor:     -48.60 dB
  Estimated SNR:   34.40 dB
  3dB Bandwidth:   48.20 kHz

BULT > purple coverage
# BULT Purple-Team Detection Coverage Report
**Total Red Findings**: 4
**Covered by Blue Rules**: 3
**Coverage Metric**: 75.00%

BULT > chemistry analyze C8H10N4O2
[CHEMICAL FORENSICS: C8H10N4O2]
  Molecular Mass: 194.1906 +/- 0.0388 g/mol
  C: 8 atoms (49.48% mass fraction)
  H: 10 atoms (5.19% mass fraction)
  N: 4 atoms (28.85% mass fraction)
  O: 2 atoms (16.48% mass fraction)
```

---

## 6. Native Desktop Workstation

BULT provides a native-styled Desktop Workstation GUI for deep visual analysis:
- **RF Spectrum Analyzer & Live Waterfall**: Real-time canvas-based FFT frequency plot and heat-mapped spectrogram waterfall.
- **Constellation & IQ View**: Scatter plot displaying phase/amplitude modulation states.
- **Radar & RF-DNA Radar**: Comparative feature fingerprint radar chart.
- **Direction Finding Map**: Sensor bearing vectors and 95% error ellipse visualization.
- **Security Correlation Matrix**: Live interactive Purple-team coverage breakdown.
- **Scientific Calculators**: Immediate interactive solvers for FSPL, EM waves, and chemical stoichiometry.
- **Case Evidence Vault**: Cryptographic SHA-256 custody log and export engine (Markdown, JSON).
- **Embedded Console**: Full interactive `BULT >` command-line terminal with command history and execution.

---

## 7. Legal & Operational Boundaries

1. **Receive-Only RF Constraint**: BULT strictly enforces passive listening. Transmission, jamming, signal spoofing, and unauthorized tracking are strictly prohibited and not implemented.
2. **Defensive Assessment Scope**: Security modules evaluate only explicitly supplied files, local configuration postures, or test fixtures. No automated network exploitation, credential brute-forcing, or stealth evasion routines exist.
3. **Evidence Integrity**: All analyses preserve source evidence immutability and record cryptographic hashes.
