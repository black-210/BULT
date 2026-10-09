# Contributing to BULT

Thank you for your interest in contributing to **BULT** (Purple-Team, RF Intelligence & Multidisciplinary Forensics System).

## Language & Compiler Standards

BULT is written in the **C>** (C-Greater) Systems Programming Language (`.cgt`):
- Specification: https://github.com/black-210/C-
- Standard: ISO C11 interoperable runtime, strict affine ownership (`own<T>`), explicit borrow checking (`&T`, `&mut T`), and memory safety isolation (`unsafe { ... }`).
- Companion builds: For POSIX environments bootstrapping without a pre-installed `cgt` binary, native ISO C11 equivalents are maintained in tandem and verified with `-Wall -Wextra -Werror -pedantic`.

## Operational Security Guidelines

1. **Defensive & Authorized Focus Only**:
   - Red-team capabilities must strictly adhere to authorized assessment, audit of explicit inputs, static heuristics, and reproducible fuzzer harnesses.
   - Do not submit functional exploit chains, privilege escalation payloads, unauthorized network scanners, or malicious payloads.
2. **Receive-Only RF Operation**:
   - RF subsystem is strictly receive-only by design. Transmit or jamming features are forbidden.
3. **Evidence Integrity**:
   - All forensic evidence modifications must record cryptographic hashes (SHA-256) and append chain-of-custody entries.

## Development Workflow

1. Fork `https://github.com/black-210/BULT`
2. Create a feature branch: `git checkout -b feature/subsystem-improvement`
3. Run unit tests and self-tests: `make test` or `ctest`
4. Submit a Pull Request targeting `main`.
