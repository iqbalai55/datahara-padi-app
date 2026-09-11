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
