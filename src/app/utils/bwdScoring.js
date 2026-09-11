const BWD_LEVELS = [
  {
    level: 1,
    min: 1,
    max: 2,
    condition: 'Sangat Rendah',
    color: 'text-red-700',
    bg: 'bg-red-100',
    barColor: 'bg-red-600',
    leafColor: 'Kuning Pucat',
    nitrogenStatus: 'Sangat Kekurangan N',
    rekomendasi: 'Pemupukan N segera diperlukan',
    dosis: 'Pupuk N dosis tinggi segera'
  },
  {
    level: 2,
    min: 2,
    max: 3,
    condition: 'Rendah',
    color: 'text-red-600',
    bg: 'bg-red-50',
    barColor: 'bg-red-500',
    leafColor: 'Kuning Hijau',
    nitrogenStatus: 'Kekurangan N',
    rekomendasi: 'Perlu pemupukan N',
    dosis: 'Pupuk N dosis sedang–tinggi'
  },
  {
    level: 3,
    min: 3,
    max: 4,
    condition: 'Cenderung Rendah',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    barColor: 'bg-orange-500',
    leafColor: 'Hijau Muda',
    nitrogenStatus: 'Cenderung Kekurangan N',
    rekomendasi: 'Pertimbangkan pemupukan N',
    dosis: 'Pupuk N dosis sedang'
  },
  {
    level: 4,
    min: 4,
    max: 5,
    condition: 'Cukup',
    color: 'text-green-600',
    bg: 'bg-green-50',
    barColor: 'bg-green-500',
    leafColor: 'Hijau',
    nitrogenStatus: 'N Cukup',
    rekomendasi: 'Pertahankan, tidak perlu menambah N',
    dosis: 'Pemupukan N tidak diperlukan sementara'
  },
  {
    level: 5,
    min: 5,
    max: 6,
    condition: 'Tinggi',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    barColor: 'bg-blue-500',
    leafColor: 'Hijau Tua',
    nitrogenStatus: 'N Berlebih',
    rekomendasi: 'Jangan menambah N',
    dosis: 'Hentikan pemberian pupuk N'
  },
  {
    level: 6,
    min: 6,
    max: 7,
    condition: 'Sangat Tinggi',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    barColor: 'bg-purple-500',
    leafColor: 'Hijau Sangat Tua',
    nitrogenStatus: 'N Sangat Berlebih',
    rekomendasi: 'Hindari tambahan N',
    dosis: 'Hindari pupuk N, risiko toksisitas'
  }
];

function getBwdLevel(value) {
  const rounded = Math.round(value);
  for (const level of BWD_LEVELS) {
    if (rounded >= level.min && rounded < level.max) {
      return level;
    }
  }
  return BWD_LEVELS[BWD_LEVELS.length - 1];
}

function computeBwdScore(ndvi, ndre, gndvi) {
  const ndviNorm = Math.max(0, Math.min(1, ndvi));
  const ndreNorm = Math.max(0, Math.min(1, ndre));
  const gndviNorm = Math.max(0, Math.min(1, gndvi));

  const bwdRaw = (0.4 * ndviNorm + 0.35 * ndreNorm + 0.25 * gndviNorm) * 5;

  return Math.max(1, Math.min(6, bwdRaw));
}

function getBwdBarWidth(score) {
  return Math.min(100, (score / 6) * 100);
}

export { BWD_LEVELS, getBwdLevel, computeBwdScore, getBwdBarWidth };
