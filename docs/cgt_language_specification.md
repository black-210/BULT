# C> (C-Greater) Language Integration in BULT

## 1. Background & Language Heritage

**BULT** is architected to target the **C>** (C-Greater) Systems Programming Language specification developed and maintained by `black-210` at [`https://github.com/black-210/C-`](https://github.com/black-210/C-).

C> is a modern systems programming language that provides:
- **Zero-cost abstractions** with affine ownership (`own<T>`) and explicit move semantics (`move(x)`).
- **Safe borrows** (`&T`, `&mut T`) and compile-time rejection of use-after-free without a garbage collector.
- **Hardware sovereignty** with isolated unsafe blocks (`unsafe { ... }`).
- **First-class CPU/GPU compute types** and standard C ABI binary interoperability.

## 2. Source Code Organization

In BULT, core algorithmic logic and data models are defined directly in C> source files (`.cgt`):

| Subsystem | C> Source File | Responsibility |
| --------- | -------------- | -------------- |
| Core | `src/core/bult_core.cgt` | Finding, Evidence, and Case ownership records |
| RF Signal Processing | `src/rf/bult_rf.cgt` | Complex sample layouts, duration, SNR, distance |
| RF Intelligence | `src/intel/bult_intel.cgt` | DF bearing sufficiency & TDoA measurement validation |
| Red Team | `src/red_team/bult_red.cgt` | Unsafe pattern classification & audit models |
| Blue Team | `src/blue_team/bult_blue.cgt` | Detection rule models & manifest drift verification |
| Purple Team | `src/purple_team/bult_purple.cgt` | Mathematical coverage calculations ($C = \frac{\text{cov}}{\text{total}} \times 100$) |
| Physics | `src/physics/bult_physics.cgt` | Wavelength & dipole resonance calculations |
| Chemistry | `src/chemistry/bult_chemistry.cgt` | Elemental stoichiometry & mass fraction |
| Forensics | `src/forensics/bult_forensics.cgt` | Chain of custody records & case sealing |
| CLI Terminal | `src/cli/bult_cli.cgt` | Terminal shell prompt & state handling |

## 3. Companion C11 Native Interoperability Layer

Because systems environments may bootstrap without a pre-compiled `cgt` driver in the host environment, BULT provides an ISO C11 FFI companion implementation (`src/*/*.c` and `include/bult/*.h`). This matches Section 1.4 of the BULT Master Build Directive ("implement only the necessary interoperability layer using the language or toolchain explicitly supported by the repository").

Both the `.cgt` files and the C11 companion files are strictly synchronized and tested.
