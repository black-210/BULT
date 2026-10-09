/**
 * BULT — TypeScript System Types
 * Corresponding to C> (C-Greater) Language Structs
 * Copyright (C) 2026 black-210 <https://github.com/black-210>
 * License: GNU AGPL-3.0
 */

export type Severity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Finding {
  id: string;
  subsystem: 'RF' | 'INTEL' | 'RED' | 'BLUE' | 'PURPLE' | 'PHYSICS' | 'CHEMISTRY' | 'FORENSICS';
  severity: Severity;
  confidence: number; // 0.0 to 1.0
  title: string;
  description: string;
  evidenceId: string;
  remediation: string;
  timestamp: number;
}

export interface Evidence {
  id: string;
  filepath: string;
  sha256: string;
  sizeBytes: number;
  acquisitionTimestamp: number;
  instrument: string;
  custodian: string;
  notes: string;
}

export interface Case {
  id: string;
  title: string;
  investigator: string;
  createdTimestamp: number;
  status: 'ACTIVE' | 'SEALED' | 'ARCHIVED';
  evidence: Evidence[];
  findings: Finding[];
}

export interface ComplexSample {
  i: number;
  q: number;
}

export interface IQCapture {
  filepath: string;
  format: 'FLOAT32' | 'INT16' | 'FLOAT64';
  sampleRateHz: number;
  centerFreqHz: number;
  sampleCount: number;
  durationSec: number;
  samples: ComplexSample[];
}

export interface SpectrumResult {
  fftSize: number;
  psdDb: number[];
  frequenciesHz: number[];
  noiseFloorDb: number;
  peakPowerDb: number;
  peakFreqHz: number;
  snrDb: number;
  bandwidth3DbHz: number;
  bandwidth10DbHz: number;
  dcOffsetI: number;
  dcOffsetQ: number;
  ampImbalanceDb: number;
  phaseErrorDeg: number;
}

export interface RfDnaFeatures {
  ampMean: number;
  ampVariance: number;
  ampSkewness: number;
  ampKurtosis: number;
  phaseVariance: number;
  phaseTrajectoryDerivative: number;
  spectralEntropy: number;
  spectralCentroid: number;
  spectralRolloff: number;
  spectralFlatness: number;
}

export interface DfBearing {
  stationId: string;
  latitude: number;
  longitude: number;
  bearingDeg: number;
  weight: number;
}

export interface TdoaStation {
  stationId: string;
  latitude: number;
  longitude: number;
  timestampSec: number;
}

export interface LocalizationResult {
  estLatitude: number;
  estLongitude: number;
  uncertaintySemiMajorM: number;
  uncertaintySemiMinorM: number;
  orientationDeg: number;
  confidenceScore: number;
  stationsUsed: number;
  sufficientData: boolean;
  notes: string;
}

export interface RedCodeFinding {
  ruleId: string;
  targetPath: string;
  unsafeApiName: string;
  lineNumber: number;
  severity: Severity;
  contextSnippet: string;
  remediation: string;
}

export interface RedAuditSummary {
  scannedFiles: number;
  unsafeApiCount: number;
  credentialLeakCount: number;
  integerOverflowRiskCount: number;
  permissionDefectCount: number;
  findings: RedCodeFinding[];
}

export interface FuzzResult {
  targetName: string;
  totalIterations: number;
  crashCount: number;
  hangCount: number;
  uniquePaths: number;
  lastCrashPayload: string;
}

export interface DetectionRule {
  ruleId: string;
  name: string;
  pattern: string;
  severity: Severity;
  description: string;
}

export interface BlueAlert {
  alertId: string;
  ruleId: string;
  timestamp: number;
  sourceEvent: string;
  severity: Severity;
  evidenceRef: string;
}

export interface IntegrityEntry {
  filepath: string;
  expectedSha256: string;
  actualSha256: string;
  matches: boolean;
}

export interface IntegrityReport {
  verifiedFiles: number;
  modifiedFiles: number;
  missingFiles: number;
  entries: IntegrityEntry[];
}

export interface PurpleCorrelation {
  redFindingId: string;
  blueRuleId: string;
  isCovered: boolean;
  detectionConfidence: number;
  gapAnalysis: string;
}

export interface PurpleCoverageReport {
  totalRedFindings: number;
  coveredFindings: number;
  uncoveredFindings: number;
  coveragePercentage: number;
  correlations: PurpleCorrelation[];
}

export interface EmCalcResult {
  frequencyHz: number;
  distanceM: number;
  fsplDb: number;
  fsplUncertaintyDb: number;
  wavelengthM: number;
  dipoleResonantLengthM: number;
  skinDepthCopperM: number;
}

export interface ChemicalAnalysis {
  formula: string;
  molecularWeight: number;
  massUncertainty: number;
  elements: {
    symbol: string;
    count: number;
    massFractionPct: number;
  }[];
}

export interface SpectralPeak {
  position: number;
  intensity: number;
  fwhm: number;
  snr: number;
  assignment: string;
}

export interface SpectroscopyResult {
  totalPeaks: number;
  peaks: SpectralPeak[];
  baselineNoise: number;
  matchedCompound: string;
  confidenceScore: number;
}
