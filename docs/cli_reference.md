# BULT CLI Command Reference

This document provides the complete command line and interactive REPL syntax for BULT.

## General
- `bult info`: Display architecture, version, C> compiler configuration, and maintainer information.
- `bult status`: Query health of RF receiver, defensive core, and active case.
- `bult config show`: Display operational parameters (sample rates, window types, physical constants).
- `bult selftest`: Execute automated self-tests across all 6 core subsystems.

## Security (Red, Blue, Purple)
- `bult red audit <file|--system>`: Perform static unsafe C API, integer overflow, and permission inspection.
- `bult red binary <path>`: Inspect binary headers, security mitigation flags (NX, PIE, Canary), and unsafe imports.
- `bult red fuzz <target> [iters]`: Run mutation fuzzer against local parsers.
- `bult blue integrity [manifest]`: Compare target files against baseline SHA-256 manifests.
- `bult blue detect <event_line>`: Test defensive rules engine against log events.
- `bult blue timeline <log_path>`: Parse events and generate chronological timeline.
- `bult purple correlate`: Correlate Red findings with Blue detection rules.
- `bult purple coverage`: Calculate real mathematical coverage ($C = \frac{\text{covered}}{\text{total}} \times 100\%$).
- `bult purple report [--json]`: Output Purple-team correlation and remediation matrix.

## RF & Intelligence (`intel`, `rf`)
- `bult intel status`: Display RF receiver status (receive-only operational boundary).
- `bult intel capture inspect <file>`: Inspect IQ sample count, duration, format.
- `bult intel spectrum analyze <file>`: Compute FFT, PSD, noise floor, SNR, 3dB bandwidth.
- `bult intel fingerprint extract <file>`: Extract statistical RF-DNA feature vector.
- `bult intel fingerprint compare <f1> <f2>`: Calculate normalized Euclidean similarity.
- `bult intel direction analyze`: Triangulate emitter coordinates from DF bearings.
- `bult intel locate estimate`: Solve TDoA hyperbolic positioning with uncertainty ellipse.

## Scientific Forensics (`physics`, `chemistry`)
- `bult physics calculate <freq_hz> <dist_m>`: Free-Space Path Loss (FSPL) with Gaussian uncertainty, wavelength, dipole size, and skin depth.
- `bult physics uncertainty`: Demonstration of covariance error propagation.
- `bult chemistry analyze <formula>`: Tokenize chemical formula, compute molecular weight and stoichiometry.
- `bult chemistry spectroscopy [file]`: Detect spectral peaks, baseline noise, and match compound.

## Digital Forensics & Cases (`forensic`, `report`)
- `bult forensic case create <id>`: Initialize new active case container.
- `bult forensic evidence hash <file>`: Calculate SHA-256 hash and append to custody chain.
- `bult forensic report [--markdown]`: Export comprehensive case investigation report.
- `bult report export <json|md>`: Export machine-readable findings.
