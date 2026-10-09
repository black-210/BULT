# BULT RF Intelligence & RF-DNA Manual

## 1. Operational Scope & Legal Boundaries
BULT's RF subsystem is **strictly receive-only by architectural constraint**.
- No transmit routines, RF jamming, spoofing, or covert interception are implemented.
- All hardware SDR interactions are guarded by explicit device selection and require authorized local access.

## 2. Supported Ingestion Formats
- `complex64` (Float32 I + Float32 Q, interleaved)
- `complex128` (Float64 I + Float64 Q)
- `signed 16-bit PCM IQ` (normalized by $32768.0$)

## 3. Signal Processing Algorithms
1. **Radix-2 Cooley-Tukey FFT**:
   - In-place bit-reversal and butterfly decimation-in-time.
   - Windowing: Rectangular, Hann ($w_n = 0.5 - 0.5\cos(2\pi n / N)$), Hamming, Blackman.
2. **Power Spectral Density (PSD)**:
   - $P_{dB}(k) = 10 \log_{10}\left(\frac{|X(k)|^2}{N} + \epsilon\right)$
3. **RF-DNA Feature Vector Extraction**:
   - $\mu_{amp}, \sigma^2_{amp}, \text{Skew}_{amp}, \text{Kurt}_{amp}$
   - Instantaneous Phase Variance $\sigma^2_{\phi}$
   - Spectral Entropy & Centroid
   - *Limitation Warning*: Statistical RF-DNA metrics quantify waveform consistency across captures. They do not constitute absolute transmitter hardware authentication without calibrated physical-layer lab evidence.
4. **Direction Finding & Localization**:
   - Triangulation requires $\ge 2$ valid DF bearings.
   - TDoA hyperbolic solver requires $\ge 3$ synchronized receivers.
   - Returns 2D covariance error ellipse (Semi-Major, Semi-Minor, Orientation, Confidence).
