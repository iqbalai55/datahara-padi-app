const STORAGE_KEY = 'datahara_baseline';
const PLANTS_KEY = 'datahara_plants';

const DEFAULT_BASELINE = {
  ndvi: { mean: 0.82, sd: 0.03 },
  ndre: { mean: 0.35, sd: 0.05 },
  gndvi: { mean: 0.65, sd: 0.04 },
  waterIndex: { mean: 1.05, sd: 0.03 }
};

const DEFAULT_PLANTS = [
  { id: '1', name: 'Padi' }
];

// Baseline
export function getBaseline() {
  if (typeof window === 'undefined') return DEFAULT_BASELINE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ndvi: { ...DEFAULT_BASELINE.ndvi, ...parsed.ndvi },
        ndre: { ...DEFAULT_BASELINE.ndre, ...parsed.ndre },
        gndvi: { ...DEFAULT_BASELINE.gndvi, ...parsed.gndvi },
        waterIndex: { ...DEFAULT_BASELINE.waterIndex, ...parsed.waterIndex }
      };
    }
  } catch {}
  return DEFAULT_BASELINE;
}

export function setBaseline(baseline) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(baseline));
}

export function resetBaseline() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export { DEFAULT_BASELINE };

// Plants
export function getPlants() {
  if (typeof window === 'undefined') return DEFAULT_PLANTS;
  try {
    const stored = localStorage.getItem(PLANTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_PLANTS;
}

export function setPlants(plants) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PLANTS_KEY, JSON.stringify(plants));
}

export function addPlant(id, name) {
  const plants = getPlants();
  if (plants.some(p => p.id === id)) return false;
  plants.push({ id, name });
  setPlants(plants);
  return true;
}

export function removePlant(id) {
  const plants = getPlants().filter(p => p.id !== id);
  setPlants(plants);
}

export function updatePlant(id, name) {
  const plants = getPlants().map(p => p.id === id ? { ...p, name } : p);
  setPlants(plants);
}

export { DEFAULT_PLANTS };

// Weights
const WEIGHTS_KEY = 'datahara_weights';

const DEFAULT_WEIGHTS = {
  stress: { ndvi: 0.35, ndre: 0.40, gndvi: 0.25 },
  bwd: { ndvi: 0.40, ndre: 0.35, gndvi: 0.25 }
};

export function getWeights() {
  if (typeof window === 'undefined') return DEFAULT_WEIGHTS;
  try {
    const stored = localStorage.getItem(WEIGHTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        stress: { ...DEFAULT_WEIGHTS.stress, ...parsed.stress },
        bwd: { ...DEFAULT_WEIGHTS.bwd, ...parsed.bwd }
      };
    }
  } catch {}
  return DEFAULT_WEIGHTS;
}

export function setWeights(weights) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
}

export function resetWeights() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(WEIGHTS_KEY);
}

export { DEFAULT_WEIGHTS };
