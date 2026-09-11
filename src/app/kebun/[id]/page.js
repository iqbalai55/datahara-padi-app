'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/utils/firebase';
import { getBaseline, getPlants } from '@/app/utils/baseline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const MODE_KEY = 'datahara_display_mode';

const LABELS = {
  technical: {
    title: 'Tanaman Padi',
    hstPrefix: 'HST',
    hstSuffix: '',
    hstFallback: 'HST tidak tersedia',
    stage: { early: 'Vegetatif Awal', late: 'Vegetatif Akhir', generative: 'Generatif', mature: 'Masak' },
    conditionTitle: 'Kondisi Tanaman',
    stressLabel: 'Skor Stres',
    checkTitle: 'Indeks Spektral',
    ndvi: 'NDVI', ndre: 'NDRE', gndvi: 'GNDVI', water: 'Water Index',
    detailTitle: 'Analisis Stres',
    ndviBar: 'NDVI (Vigor)', ndreBar: 'NDRE (Klorofil / N)', gndviBar: 'GNDVI (Kehijauan)', waterBar: 'Water Index (Stres Air)',
    interpTitle: 'Interpretasi:',
    interpItems: {
      ndvi: 'Vigor tanaman menurun (NDVI rendah)',
      ndre: 'Kemungkinan stres klorofil / kekurangan N (NDRE rendah)',
      gndvi: 'Kehijauan berkurang (GNDVI rendah)',
      water: 'Indikasi stres air (Water Index abnormal)',
      healthy: 'Tanaman dalam kondisi sehat'
    },
    baselineTitle: 'Baseline Padi Sehat',
    baselineLabels: { ndvi: 'NDVI', ndre: 'NDRE', gndvi: 'GNDVI', water: 'Water' },
    baselineNote: 'Threshold = mean - 2×SD (dari data kalibrasi)',
    chartTitles: { ndvi: 'NDVI History', ndre: 'NDRE History', gndvi: 'GNDVI History', water: 'Water Index History', stress: 'Stress Score History' },
    statusGood: 'Normal', statusBad: 'Rendah',
    barGood: 'Normal', barBad: (v) => `${v}% deviasi`,
    minLabel: 'Batas bawah', normalLabel: 'Normal',
    conditions: {
      healthy: 'Sehat', mild: 'Ringan', moderateChlorophyll: 'Stres Klorofil', moderate: 'Sedang', severe: 'Parah'
    }
  },
  awam: {
    title: 'Tanaman Padi',
    hstPrefix: 'Umur',
    hstSuffix: 'hari setelah tanam',
    hstFallback: 'Umur tanaman tidak tersedia',
    stage: { early: 'Tahap Tumbuh Awal', late: 'Tahap Tumbuh Akhir', generative: 'Tahap Berbuah', mature: 'Tahap Matang' },
    conditionTitle: 'Kondisi Tanaman',
    stressLabel: 'Tingkat Masalah',
    checkTitle: 'Hasil Pemeriksaan Daun',
    ndvi: 'Kekuatan Tanaman', ndre: 'Kesuburan Daun', gndvi: 'Warna Hijau', water: 'Kadar Air',
    detailTitle: 'Detail Kondisi',
    ndviBar: 'Kekuatan Tanaman', ndreBar: 'Kesuburan Daun (N)', gndviBar: 'Warna Hijau Daun', waterBar: 'Kadar Air Tanaman',
    interpTitle: 'Artinya Apa?',
    interpItems: {
      ndvi: 'Tanaman mulai lemah, kurang berproduksi',
      ndre: 'Daun mulai pucat, kemungkinan kurang unsur N (nitrogen)',
      gndvi: 'Warna hijau daun berkurang',
      water: 'Tanaman kekurangan air',
      healthy: 'Tanaman sehat, pertumbuhan bagus'
    },
    baselineTitle: 'Batas Normal Padi Sehat',
    baselineLabels: { ndvi: 'Kekuatan', ndre: 'Kesuburan', gndvi: 'Warna Hijau', water: 'Kadar Air' },
    baselineNote: 'Batas minimum = rata-rata - 2×selisih (dari pengukuran normal)',
    chartTitles: { ndvi: 'Riwayat Kekuatan Tanaman', ndre: 'Riwayat Kesuburan Daun', gndvi: 'Riwayat Warna Hijau', water: 'Riwayat Kadar Air', stress: 'Riwayat Tingkat Masalah' },
    statusGood: 'Bagus', statusBad: 'Kurang',
    barGood: 'Bagus', barBad: (v) => `Kurang ${v}%`,
    minLabel: 'Minimum', normalLabel: 'Normal',
    conditions: {
      healthy: 'Sehat', mild: 'Perlu Perhatian', moderateChlorophyll: 'Kurang N', moderate: 'Sedang', severe: 'Parah'
    }
  }
};

const SPECTRAL_CHANNELS = {
  channelA: 410, channelB: 435, channelC: 460, channelD: 485,
  channelE: 510, channelF: 535, channelG: 560, channelH: 585,
  channelR: 610, channelI: 645, channelS: 680, channelJ: 705,
  channelT: 730, channelU: 760, channelV: 810, channelW: 860,
  channelK: 900, channelL: 940
};

const STRESS_THRESHOLDS = { healthy: 0.20, mild: 0.40, moderate: 0.60 };

function computeSpectralIndices(channels) {
  const R = (name) => parseFloat(channels[name]) || 0;
  const R810 = R('channelV');
  const R645 = R('channelI');
  const R705 = R('channelJ');
  const R560 = R('channelG');
  const R940 = R('channelL');
  const R860 = R('channelW');

  const ndvi = (R810 + R645) !== 0 ? (R810 - R645) / (R810 + R645) : 0;
  const ndre = (R810 + R705) !== 0 ? (R810 - R705) / (R810 + R705) : 0;
  const gndvi = (R810 + R560) !== 0 ? (R810 - R560) / (R810 + R560) : 0;
  const waterIndex = R860 !== 0 ? R940 / R860 : 0;

  return { ndvi, ndre, gndvi, waterIndex };
}

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
  const ndviStress = computeIndexStress(indices.ndvi, baseline.ndvi, 'below');
  const ndreStress = computeIndexStress(indices.ndre, baseline.ndre, 'below');
  const gndviStress = computeIndexStress(indices.gndvi, baseline.gndvi, 'below');
  const waterStress = computeIndexStress(indices.waterIndex, baseline.waterIndex, 'both');

  const score = 0.35 * ndviStress + 0.40 * ndreStress + 0.25 * gndviStress;
  return { ndviStress, ndreStress, gndviStress, waterStress, score };
}

function determineCondition(stress, labels) {
  const { score, ndviStress, ndreStress, gndviStress } = stress;
  const c = labels.conditions;

  if (score < STRESS_THRESHOLDS.healthy) {
    return { label: c.healthy, color: 'text-green-600', bg: 'bg-green-100' };
  }
  if (score < STRESS_THRESHOLDS.mild) {
    return { label: c.mild, color: 'text-yellow-600', bg: 'bg-yellow-100' };
  }
  if (score < STRESS_THRESHOLDS.moderate) {
    if (ndreStress > ndviStress && ndreStress > gndviStress) {
      return { label: c.moderateChlorophyll, color: 'text-orange-600', bg: 'bg-orange-100' };
    }
    return { label: c.moderate, color: 'text-orange-600', bg: 'bg-orange-100' };
  }
  return { label: c.severe, color: 'text-red-600', bg: 'bg-red-100' };
}

function getStatusText(value, baseline, labels) {
  const lowerLimit = baseline.mean - 2 * baseline.sd;
  return value >= lowerLimit ? labels.statusGood : labels.statusBad;
}

function getColorClass(value) {
  if (value < 0.20) return 'text-green-600';
  if (value < 0.40) return 'text-yellow-600';
  if (value < 0.60) return 'text-orange-600';
  return 'text-red-600';
}

function getStressBarColor(value) {
  if (value < 0.20) return 'bg-green-500';
  if (value < 0.40) return 'bg-yellow-500';
  if (value < 0.60) return 'bg-orange-500';
  return 'bg-red-500';
}

function determineGrowthStage(hst, labels) {
  if (hst <= 30) return labels.stage.early;
  if (hst <= 60) return labels.stage.late;
  if (hst <= 90) return labels.stage.generative;
  return labels.stage.mature;
}

const InfoBox = ({ label, value, status, color }) => (
  <div className="text-center">
    <div className="text-xs text-gray-500">{label}</div>
    <div className={`text-xl font-bold ${color}`}>{value}</div>
    <div className="text-xs text-gray-600">{status}</div>
  </div>
);

const StressBar = ({ label, value, baseline, direction = 'below', labels }) => {
  const stress = computeIndexStress(value, baseline, direction);
  const barColor = getStressBarColor(stress);
  const lowerLimit = baseline.mean - 2 * baseline.sd;
  const statusText = stress === 0 ? labels.barGood : labels.barBad((stress * 100).toFixed(0));

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-xs text-gray-500">{statusText}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(100, stress * 100)}%` }} />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{labels.minLabel}: {lowerLimit.toFixed(3)}</span>
        <span>{labels.normalLabel}: {baseline.mean.toFixed(3)}</span>
      </div>
    </div>
  );
};

const ModeSwitch = ({ mode, onToggle }) => (
  <div className="flex items-center justify-center gap-3 mb-6">
    <span className={`text-sm font-medium ${mode === 'technical' ? 'text-blue-600' : 'text-gray-400'}`}>Teknis</span>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${mode === 'awam' ? 'bg-green-500' : 'bg-blue-500'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${mode === 'awam' ? 'translate-x-6' : 'translate-x-0.5'}`} />
    </button>
    <span className={`text-sm font-medium ${mode === 'awam' ? 'text-green-600' : 'text-gray-400'}`}>Awam</span>
  </div>
);

const CustomChart = ({ data, color, title, dataKey }) => {
  const formattedData = Object.keys(data)
    .map(key => ({
      time: moment(key, "YYYYMMDDHHmmss").format("YYYY-MM-DD"),
      value: data[key][dataKey],
      momentObj: moment(key, "YYYYMMDDHHmmss")
    }))
    .sort((a, b) => a.momentObj.valueOf() - b.momentObj.valueOf())
    .map(({ time, value }) => ({ time, value }));

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-center text-lg font-semibold mb-4" style={{ color }}>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={{ fill: '#555', fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#555' }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function Lokasi() {
  const params = useParams();
  const [status, setStatus] = useState(null);
  const [samplingData, setSamplingData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [baseline, setBaseline] = useState(null);
  const [mode, setMode] = useState('awam');
  const [plantName, setPlantName] = useState('');

  useEffect(() => {
    setBaseline(getBaseline());
    try {
      const saved = localStorage.getItem(MODE_KEY);
      if (saved === 'technical' || saved === 'awam') setMode(saved);
    } catch {}
    const lokasi = params?.id;
    if (lokasi) {
      const plants = getPlants();
      const found = plants.find(p => p.id === lokasi);
      if (found) setPlantName(found.name);
    }
  }, [params]);

  const toggleMode = () => {
    const next = mode === 'awam' ? 'technical' : 'awam';
    setMode(next);
    try { localStorage.setItem(MODE_KEY, next); } catch {}
  };

  useEffect(() => {
    const lokasi = params?.id;
    if (!lokasi) { setError('Invalid lokasi'); setIsLoading(false); return; }

    const unsubStatus = onSnapshot(doc(db, "status_tanaman", lokasi), (snap) => {
      if (snap.exists()) setStatus(snap.data());
      else setError('Document does not exist');
      setIsLoading(false);
    }, (err) => { setError(err.message); setIsLoading(false); });

    const unsubSampling = onSnapshot(doc(db, "sampling", lokasi), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const formatted = Object.entries(data)
          .map(([ts, ch]) => ({ ...ch, time: ts }))
          .sort((a, b) => parseInt(b.time) - parseInt(a.time));
        setSamplingData(formatted);
      }
    }, (err) => console.error("Error fetching sampling:", err));

    return () => { unsubStatus(); unsubSampling(); };
  }, [params]);

  useEffect(() => {
    const h = () => setBaseline(getBaseline());
    window.addEventListener('storage', h);
    return () => window.removeEventListener('storage', h);
  }, []);

  if (isLoading || !baseline) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="relative">
          <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
          <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        </div>
        <div className="ml-4 text-xl font-semibold text-purple-700 pt-4">Loading...</div>
      </div>
    );
  }

  if (error) return <div className="text-red-600 text-center mt-4">{error}</div>;

  const L = LABELS[mode];
  const latestSampling = samplingData[0];
  const indices = latestSampling ? computeSpectralIndices(latestSampling) : { ndvi: 0, ndre: 0, gndvi: 0, waterIndex: 0 };
  const stress = computeStressScore(indices, baseline);
  const condition = determineCondition(stress, L);

  const historyForCharts = {};
  samplingData.forEach((sample) => {
    const idx = computeSpectralIndices(sample);
    const s = computeStressScore(idx, baseline);
    historyForCharts[sample.time] = { ndvi: idx.ndvi, ndre: idx.ndre, gndvi: idx.gndvi, waterIndex: idx.waterIndex, stressScore: s.score };
  });

  const hstText = status?.hst
    ? mode === 'awam'
      ? `${L.hstPrefix} ${status.hst} ${L.hstSuffix}`
      : `${status.hst} ${L.hstPrefix}`
    : L.hstFallback;

  return (
    <div className="min-h-screen bg-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <ModeSwitch mode={mode} onToggle={toggleMode} />
        <h1 className="text-2xl font-bold mb-2 pb-2 border-b border-gray-300">{plantName || L.title}</h1>
        <p className="text-sm text-gray-500 mb-6">{hstText}</p>

        {/* Kondisi Tanaman */}
        <div className={`${condition.bg} mb-4 p-4 rounded-2xl`}>
          <h2 className="text-lg font-semibold inline-block px-3 py-1 rounded-full mb-4">{L.conditionTitle}</h2>
          <div className="text-center mb-4">
            <span className={`text-3xl font-bold ${condition.color}`}>{condition.label}</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{L.stressLabel}:</span>
              <span className={`font-bold ${getColorClass(stress.score)}`}>{(stress.score * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-500 ${getStressBarColor(stress.score)}`} style={{ width: `${Math.min(100, stress.score * 100)}%` }} />
            </div>
          </div>
        </div>

        {/* Hasil Pemeriksaan */}
        <div className="bg-blue-50 mb-4 p-4 rounded-2xl">
          <h2 className="text-lg font-semibold bg-blue-200 inline-block px-3 py-1 rounded-full mb-4">{L.checkTitle}</h2>
          <div className="grid grid-cols-2 gap-4 font-bold text-xl">
            <div className="bg-white rounded-2xl p-4">
              <InfoBox label={L.ndvi} value={indices.ndvi.toFixed(3)} status={getStatusText(indices.ndvi, baseline.ndvi, L)} color={indices.ndvi >= baseline.ndvi.mean - 2 * baseline.ndvi.sd ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div className="bg-white rounded-2xl p-4">
              <InfoBox label={L.ndre} value={indices.ndre.toFixed(3)} status={getStatusText(indices.ndre, baseline.ndre, L)} color={indices.ndre >= baseline.ndre.mean - 2 * baseline.ndre.sd ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div className="bg-white rounded-2xl p-4">
              <InfoBox label={L.gndvi} value={indices.gndvi.toFixed(3)} status={getStatusText(indices.gndvi, baseline.gndvi, L)} color={indices.gndvi >= baseline.gndvi.mean - 2 * baseline.gndvi.sd ? 'text-green-600' : 'text-red-600'} />
            </div>
            <div className="bg-white rounded-2xl p-4">
              <InfoBox label={L.water} value={indices.waterIndex.toFixed(3)} status={getStatusText(indices.waterIndex, baseline.waterIndex, L)} color={indices.waterIndex >= baseline.waterIndex.mean - 2 * baseline.waterIndex.sd ? 'text-green-600' : 'text-red-600'} />
            </div>
          </div>
        </div>

        {/* Detail Kondisi */}
        <div className="bg-amber-50 mb-4 p-4 rounded-2xl">
          <h2 className="text-lg font-semibold bg-amber-200 inline-block px-3 py-1 rounded-full mb-4">{L.detailTitle}</h2>
          <StressBar label={L.ndviBar} value={indices.ndvi} baseline={baseline.ndvi} direction="below" labels={L} />
          <StressBar label={L.ndreBar} value={indices.ndre} baseline={baseline.ndre} direction="below" labels={L} />
          <StressBar label={L.gndviBar} value={indices.gndvi} baseline={baseline.gndvi} direction="below" labels={L} />
          <StressBar label={L.waterBar} value={indices.waterIndex} baseline={baseline.waterIndex} direction="both" labels={L} />

          <div className="mt-4 p-3 bg-white rounded-xl">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{L.interpTitle}</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {stress.ndviStress > 0.3 && <li>• {L.interpItems.ndvi}</li>}
              {stress.ndreStress > 0.3 && <li>• {L.interpItems.ndre}</li>}
              {stress.gndviStress > 0.3 && <li>• {L.interpItems.gndvi}</li>}
              {stress.waterStress > 0.3 && <li>• {L.interpItems.water}</li>}
              {stress.score < STRESS_THRESHOLDS.healthy && <li className="text-green-600 font-medium">• {L.interpItems.healthy}</li>}
            </ul>
          </div>
        </div>

        {/* Batas Normal */}
        <div className="bg-gray-50 mb-4 p-4 rounded-2xl">
          <h2 className="text-lg font-semibold bg-gray-200 inline-block px-3 py-1 rounded-full mb-3">{L.baselineTitle}</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-white p-2 rounded-lg"><span className="font-medium">{L.baselineLabels.ndvi}:</span> {baseline.ndvi.mean} ± {baseline.ndvi.sd}</div>
            <div className="bg-white p-2 rounded-lg"><span className="font-medium">{L.baselineLabels.ndre}:</span> {baseline.ndre.mean} ± {baseline.ndre.sd}</div>
            <div className="bg-white p-2 rounded-lg"><span className="font-medium">{L.baselineLabels.gndvi}:</span> {baseline.gndvi.mean} ± {baseline.gndvi.sd}</div>
            <div className="bg-white p-2 rounded-lg"><span className="font-medium">{L.baselineLabels.water}:</span> {baseline.waterIndex.mean} ± {baseline.waterIndex.sd}</div>
          </div>
          <p className="text-xs text-gray-400 mt-2">{L.baselineNote}</p>
        </div>

        {/* Grafik */}
        <div className="grid grid-cols-1 gap-4">
          <CustomChart data={historyForCharts} color="#22c55e" title={L.chartTitles.ndvi} dataKey="ndvi" />
          <CustomChart data={historyForCharts} color="#6366f1" title={L.chartTitles.ndre} dataKey="ndre" />
          <CustomChart data={historyForCharts} color="#10b981" title={L.chartTitles.gndvi} dataKey="gndvi" />
          <CustomChart data={historyForCharts} color="#3b82f6" title={L.chartTitles.water} dataKey="waterIndex" />
          <CustomChart data={historyForCharts} color="#f59e0b" title={L.chartTitles.stress} dataKey="stressScore" />
        </div>
      </div>
    </div>
  );
}
