
export enum SeverityLevel {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  INFORMATIONAL = 'INFORMATIONAL'
}

export enum MitigationDifficulty {
    EASY = 'EASY',
    MEDIUM = 'MEDIUM',
    HARD = 'HARD'
}

export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: SeverityLevel;
  mitigation_ids?: string[];
}

export interface Mitigation {
  id: string;
  strategy: string;
  description: string;
  difficulty: MitigationDifficulty;
}

export interface ThreatActor {
  id: string;
  name: string;
  motivation: string;
  common_tactics: string[];
}

export interface HeaderKeyValuePair {
  key: string;
  value: string;
}

export interface SecurityBriefing {
  url: string;
  summary: string;
  attackSurface: string;
  technologyStackAssumptions: string[];
  headerAnalysis: HeaderKeyValuePair[];
  potentialVulnerabilities: Vulnerability[];
  mitigationStrategies: Mitigation[];
  relevantThreatActors: ThreatActor[];
}

export interface NetworkScanResult {
  port: number;
  protocol: string;
  service: string;
  status: 'OPEN' | 'CLOSED';
  potentialRisk: string;
}