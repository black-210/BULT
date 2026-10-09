# BULT Architecture & Design Specification

## System Overview

**BULT** is an integrated intelligence and multidisciplinary forensics system developed by `black-210`. The architecture unifies digital signal processing, RF intelligence, defensive forensics, security auditing, and scientific computing under a single core engine.

```
                          +-----------------------------+
                          |   BULT Shared Core Engine   |
                          |  (Case, Evidence, Findings) |
                          +-----------------------------+
                                         |
     +-------------------+---------------+-------------------+
     |                   |               |                   |
[RF Intelligence]  [Security Hub]  [Physical Analysis]  [Chemical Engine]
- IQ Ingestion     - Red Audit     - FSPL Attenuation   - IUPAC Mass
- Radix-2 FFT      - Blue Engine   - Error Propagation  - Stoichiometry
- RF-DNA Feature   - Purple Calc   - Skin Depth         - FTIR Spectra
- DF & TDoA        - Fuzzer        - Wave Resonance     - FWHM Detector
```

## Data Flow & Provenance

Every observation in BULT generates a structured `Finding` attached to an immutable `Evidence` record:
1. **Acquisition**: Samples or files are imported and immediately fingerprinted with cryptographic SHA-256 hashes.
2. **Analysis**: Specialized algorithmic engines (FFT, RF-DNA, static analyzers, stoichiometry engines) execute numerical transformations.
3. **Correlation**: Findings are cross-referenced across subsystems (e.g. an RF carrier emission linked to a Red-team fuzzer finding and a Blue-team detection alert).
4. **Export**: Full investigation dossiers are generated in standard Markdown, JSON, or CSV formats.
