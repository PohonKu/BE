// src/types/adoption.types.ts

export enum GrowthPhase {
  SEEDLING = 'SEEDLING',  // 0-50 cm
  SAPLING = 'SAPLING',    // 50-200 cm
  POLE = 'POLE',          // 200-500 cm
  TREE = 'TREE',          // >500 cm
}

export enum HealthStatus {
  HEALTHY = 'HEALTHY',      // >90% expected
  ADAPTING = 'ADAPTING',    // 70-90% expected
  CRITICAL = 'CRITICAL',    // <70% expected
}

export interface TreeStatistics {
  totalCO2Absorbed: number;
  growthPhaseDistribution: {
    seedling: number;
    sapling: number;
    pole: number;
    tree: number;
  };
  healthStatusDistribution: {
    healthy: number;
    adapting: number;
    critical: number;
  };
  nextUpdateEstimate: string | null;
  remainingAdoptionDays: number;
}