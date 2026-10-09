# Changelog — BULT

All notable changes to the BULT project will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), adhering to Semantic Versioning.

## [1.0.0] - 2026-10-09

### Added
- **Core Architecture**:
  - Unified finding, evidence reference, and case management engine.
  - Multi-subsystem dataflow with SHA-256 evidence integrity hashing.
  - High-precision numerical analysis and Gaussian uncertainty propagation engine.
- **RF Intelligence Subsystem (`intel`, `rf`)**:
  - Raw IQ ingestion for `complex64`, `complex128`, signed integer formats.
  - Fast Fourier Transform (radix-2 Cooley-Tukey) with Hann, Hamming, and Blackman windowing.
  - Power Spectral Density (PSD), SNR estimation, noise floor estimation, 3dB / 10dB bandwidth metrics.
  - DC offset and IQ amplitude/phase imbalance calculations.
  - Experimental RF-DNA feature extraction: instantaneous amplitude/phase variance, spectral entropy, and spectral moments.
  - Direction-finding triangulation (bearing intersection) and TDoA hyperbolic localization solver with covariance ellipse estimation.
- **Red Team Security Assessment (`red`)**:
  - Local host security posture auditing (permissions, setuid/setgid files, port audit).
  - Static binary & source inspection: unsafe C API detection, hardcoded credential patterns, integer overflow detection.
  - Local parser mutation fuzzer harness with deterministic replay.
  - Offline attack surface and vector modeling.
- **Blue Team Defensive Forensics (`blue`)**:
  - SHA-256 file manifest verification and configuration drift detector.
  - Syslog / audit timeline reconstruction with anomaly tagging.
  - Indicator of Compromise (IoC) signature matching engine.
  - Formal detection rules engine with evidence linking.
- **Purple Team Correlation (`purple`)**:
  - Red finding to Blue detection correlation engine.
  - Mathematical detection coverage metrics ($C = \frac{\text{covered}}{\text{total}} \times 100\%$).
  - Detection gap analysis and remediation tracking.
  - Offline assessment session replay and export (Markdown and JSON).
- **Physical Forensics (`physics`)**:
  - Free-space path loss (FSPL), Friis transmission, wavelength, and antenna resonance solvers.
  - Conductor skin depth and dielectric permittivity modeling.
  - Uncertainty propagation via partial derivative covariance calculus.
- **Chemical Forensics & Spectroscopy (`chemistry`)**:
  - Chemical formula tokenizer and molecular mass calculator using IUPAC atomic weights.
  - Stoichiometric mass fraction calculations.
  - Spectral peak detection (absorbance/Raman/FTIR) with baseline estimation and FWHM calculation.
- **Interfaces**:
  - Advanced interactive command shell (`BULT >`) supporting the full subcommand hierarchy.
  - Native Tactical Intelligence Desktop Workstation with interactive FFT waterfall, constellation visualizer, case management, and correlation views.
- **Language & Toolchain**:
  - Written in C> (C-Greater, specification `black-210/C-`), with companion ISO C11 native interop layer, CMakeLists.txt, Makefile, and GitHub CI workflow.
