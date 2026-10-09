# BULT Purple-Team Correlation & Validation Manual

## 1. Mathematical Coverage Model

In BULT, Purple-Team detection coverage is never an arbitrary aesthetic percentage. It is derived strictly from empirical evaluation:

$$C = \frac{N_{\text{covered}}}{N_{\text{total}}} \times 100\%$$

Where:
- $N_{\text{total}}$: Total distinct attack vectors identified during Red-Team static and dynamic assessments.
- $N_{\text{covered}}$: Number of Red-Team vectors that trigger a validated Blue-Team alert rule with confidence $\ge 0.80$.
- $N_{\text{uncovered}} = N_{\text{total}} - N_{\text{covered}}$: Remaining detection gaps.

## 2. Correlation Pipeline
1. **Red Vector Ingestion**: Ingests findings from static code analysis (banned C APIs, integer overflows, hardcoded secrets) and parser fuzzing.
2. **Defensive Rule Evaluation**: Evaluates Blue-Team detection signatures (`BLUE-RULE-01` through `BLUE-RULE-05`) against simulated telemetry and system event logs.
3. **Gap Analysis**: Identifies attack vectors that executed without generating defensive alerts, providing tailored remediation advice.
