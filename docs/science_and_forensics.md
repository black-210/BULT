# BULT Physical & Chemical Forensics Manual

## 1. Physical Forensics & Electromagnetic Models

### Free-Space Path Loss (FSPL)
Calculated using the Friis transmission formula in free space:
$$FSPL(\text{dB}) = 20\log_{10}(d) + 20\log_{10}(f) + 20\log_{10}\left(\frac{4\pi}{c}\right)$$

### Uncertainty Propagation
Uncertainty is propagated via Gaussian first-order Taylor expansion:
$$\sigma_{\text{FSPL}} = \sqrt{\left(\frac{20}{d \ln 10}\right)^2 \sigma_d^2 + \left(\frac{20}{f \ln 10}\right)^2 \sigma_f^2}$$

### Conductor Skin Depth
For conductors with conductivity $\sigma$ and magnetic permeability $\mu$:
$$\delta = \frac{1}{\sqrt{\pi f \mu \sigma}}$$

## 2. Chemical Forensics & Spectroscopy

### IUPAC Standard Atomic Weights
Molecular mass is computed by summing IUPAC certified atomic weights:
$$M = \sum_{i} n_i \cdot w_i$$
Elemental mass fractions are computed as:
$$\text{Fraction}_i = \frac{n_i \cdot w_i}{M} \times 100\%$$

### Spectroscopy Peak Characterization
Infrared and Raman spectra are processed with automatic local maxima peak picking, baseline noise estimation, and Full Width at Half Maximum (FWHM) characterization.
