import { getWeights } from './baseline';

function computeIndexStress(value, baseline, direction = 'below') {
  const lowerLimit = baseline.mean - 2 * baseline.sd;
  const upperLimit = baseline.mean + 2 * baseline.sd;

  if (direction === 'below') {
    if (value >= lowerLimit) return 0;
    const range = baseline.mean - lowerLimit;
    return Math.min(1, Math.abs(value - lowerLimit) / range);
  } else {
    if (value <= upperLimit && value >= lowerLimit) return 0;
    const range = upperLimit - baseline.mean;
    const dev = value > upperLimit ? value - upperLimit : lowerLimit - value;
    return Math.min(1, dev / range);
  }
}

function computeStressScore(indices, baseline) {
  const weights = getWeights().stress;
  const ndviStress = computeIndexStress(indices.ndvi, baseline.ndvi, 'below');
  const ndreStress = computeIndexStress(indices.ndre, baseline.ndre, 'below');
  const gndviStress = computeIndexStress(indices.gndvi, baseline.gndvi, 'below');
  const waterStress = computeIndexStress(indices.waterIndex, baseline.waterIndex, 'both');

  const score = weights.ndvi * ndviStress + weights.ndre * ndreStress + weights.gndvi * gndviStress;
  return { ndviStress, ndreStress, gndviStress, waterStress, score };
}

function getStressBarColor(value) {
  if (value < 0.20) return 'bg-green-500';
  if (value < 0.40) return 'bg-yellow-500';
  if (value < 0.60) return 'bg-orange-500';
  return 'bg-red-500';
}

export { computeIndexStress, computeStressScore, getStressBarColor };
