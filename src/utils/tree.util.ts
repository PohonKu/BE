// src/utils/tree.util.ts


export const getGrowthPhase = (heightCm: number): string => {
  if (heightCm <= 50) return 'SEEDLING';
  if (heightCm <= 200) return 'SAPLING';
  if (heightCm <= 500) return 'POLE';
  return 'TREE';
};

export const getHealthStatus = (
  actualHeight: number,
  expectedHeight: number
): string => {
  const percentage = (actualHeight / expectedHeight) * 100;
  
  if (percentage >= 90) return 'HEALTHY';
  if (percentage >= 70) return 'ADAPTING';
  return 'CRITICAL';
};

export const calculateExpectedHeight = (
  carbonRate: number,
  monthsOld: number
): number => {
  // Estimasi: 1 kg CO2/tahun ≈ 2.5 cm pertumbuhan/tahun
  // Ini formula simplified, bisa disesuaikan
  const growthRatePerMonth = (carbonRate * 2.5) / 12;
  return growthRatePerMonth * monthsOld;
};

export const getMonthsSinceAdoption = (adoptedAt: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - adoptedAt.getTime();
  const diffMonths = diffMs / (1000 * 60 * 60 * 24 * 30.44); // avg days per month
  return Math.floor(diffMonths);
};

export const getDaysSinceAdoption = (adoptedAt: Date): number => {
  const now = new Date();
  const diffMs = now.getTime() - adoptedAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
};

export const predictNextUpdate = (updates: Date[]): Date | null => {
  if (updates.length < 2) return null;
  
  // Hitung rata-rata interval antar update
  let totalDays = 0;
  for (let i = 1; i < updates.length; i++) {
    const diff = updates[i].getTime() - updates[i - 1].getTime();
    totalDays += diff / (1000 * 60 * 60 * 24);
  }
  
  const avgInterval = totalDays / (updates.length - 1);
  const lastUpdate = updates[updates.length - 1];
  
  const nextUpdate = new Date(lastUpdate);
  nextUpdate.setDate(nextUpdate.getDate() + avgInterval);
  
  return nextUpdate;
};