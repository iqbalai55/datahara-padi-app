'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, onSnapshot, deleteField, updateDoc } from 'firebase/firestore';
import { db } from '@/app/utils/firebase';
import { getBaseline, getPlants, getWeights } from '@/app/utils/baseline';
import { computeBwdScore, getBwdLevel, BWD_LEVELS } from '@/app/utils/bwdScoring';
import { computeIndexStress, getStressBarColor } from '@/app/utils/stressScoring';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Download, Trash2 } from 'lucide-react';

const SPECTRAL_CHANNELS = {
  channelA: 410, channelB: 435, channelC: 460, channelD: 485,
  channelE: 510, channelF: 535, channelG: 560, channelH: 585,
  channelR: 610, channelI: 645, channelS: 680, channelJ: 705,
  channelT: 730, channelU: 760, channelV: 810, channelW: 860,
  channelK: 900, channelL: 940
};

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

function computeStress(indices, baseline) {
  const weights = getWeights().stress;
  const ndviStress = computeIndexStress(indices.ndvi, baseline.ndvi, 'below');
  const ndreStress = computeIndexStress(indices.ndre, baseline.ndre, 'below');
  const gndviStress = computeIndexStress(indices.gndvi, baseline.gndvi, 'below');

  const score = weights.ndvi * ndviStress + weights.ndre * ndreStress + weights.gndvi * gndviStress;

  let condition = 'Sehat';
  let conditionColor = 'text-green-600';
  if (score >= 0.60) { condition = 'Parah'; conditionColor = 'text-red-600'; }
  else if (score >= 0.40) {
    if (ndreStress > ndviStress) { condition = 'Stres Klorofil'; conditionColor = 'text-orange-600'; }
    else { condition = 'Sedang'; conditionColor = 'text-orange-600'; }
  }
  else if (score >= 0.20) { condition = 'Ringan'; conditionColor = 'text-yellow-600'; }

  return { ndviStress, ndreStress, gndviStress, score, condition, conditionColor };
}

function getStressBarColorLocal(value) {
  return getStressBarColor(value);
}

export default function Sampling() {
  const params = useParams();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formattedData, setFormattedData] = useState([]);
  const [baseline, setBaseline] = useState(null);
  const [plantName, setPlantName] = useState('Padi');

  useEffect(() => {
    setBaseline(getBaseline());
    const lokasi = params?.id;
    if (lokasi) {
      const plants = getPlants();
      const found = plants.find(p => p.id === lokasi);
      if (found) setPlantName(found.name);
    }
  }, [params]);

  useEffect(() => {
    const lokasi = params?.id;
    if (!lokasi) {
      setError('Invalid lokasi');
      setIsLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, "sampling", lokasi),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const formattedData = Object.entries(data)
            .map(([timestamp, channelData]) => ({
              ...channelData,
              time: timestamp,
              location: parseInt(lokasi)
            }))
            .sort((a, b) => parseInt(b.time) - parseInt(a.time));
          setFormattedData(formattedData);
        } else {
          setError('Document does not exist');
        }
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching document:", err);
        setError(err.message);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [params]);

  useEffect(() => {
    const handleStorage = () => setBaseline(getBaseline());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (isLoading || !baseline) return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="relative">
        <div className="w-20 h-20 border-purple-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
      </div>
      <div className="ml-4 text-xl font-semibold text-purple-700 pt-4">Loading...</div>
    </div>
  );

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <DataVisualization dataSamples={formattedData} baseline={baseline} plantName={plantName} />
    </div>
  );
}

const DataVisualization = ({ dataSamples, baseline, plantName }) => {
  const params = useParams();

  const formatTimestamp = (timestamp) => {
    const year = timestamp.substring(0, 4);
    const month = timestamp.substring(4, 6);
    const day = timestamp.substring(6, 8);
    const hour = timestamp.substring(8, 10);
    const minute = timestamp.substring(10, 12);
    const second = timestamp.substring(12, 14);
    return `${month}-${day}-${year}, ${hour}:${minute}:${second}`;
  };

  const downloadCSV = (data, timestamp) => {
    const csvContent = [
      ['Channel', 'Wavelength (nm)', 'Value'],
      ...Object.entries(SPECTRAL_CHANNELS).map(([channel, wavelength]) => [
        channel, wavelength, data[channel] || 0
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sampling_padi_${timestamp}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const deleteDataPoint = async (timestamp) => {
    const lokasi = params?.id;
    if (!lokasi) return;
    try {
      const docRef = doc(db, "sampling", lokasi);
      await updateDoc(docRef, { [timestamp.toString()]: deleteField() });
    } catch (error) {
      console.error("Error removing data point: ", error);
    }
  };

  return (
    <div className="p-4 sm:p-8 bg-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl sm:text-4xl font-bold mb-2 text-gray-800 text-center">Sampling {plantName}</h1>
      <p className="text-sm text-gray-500 mb-6">18 Channel Spektral (AS7265x)</p>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 w-full max-w-4xl sm:max-w-6xl">
        {dataSamples.map((data, index) => {
          const channelData = Object.entries(SPECTRAL_CHANNELS).map(([channel, value]) => ({
            name: value,
            value: data[channel] || 0
          }));

          const indices = computeSpectralIndices(data);
          const stress = computeStress(indices, baseline);

          return (
            <div key={index} className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">{formatTimestamp(data.time)}</h2>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
                  <button onClick={() => downloadCSV(data, data.time)} className="flex items-center justify-center px-2 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto sm:px-3 sm:py-2 sm:text-base">
                    <Download size={16} className="mr-1 sm:mr-2" />CSV
                  </button>
                  <button onClick={() => deleteDataPoint(data.time)} className="flex items-center justify-center px-2 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors w-full sm:w-auto sm:px-3 sm:py-2 sm:text-base">
                    <Trash2 size={16} className="mr-1 sm:mr-2" />Delete
                  </button>
                </div>
              </div>

              {/* Spectral Indices Summary */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-sm">
                  <div>
                    <div className="text-gray-500 text-xs">NDVI</div>
                    <div className={`font-bold ${indices.ndvi >= baseline.ndvi.mean - 2 * baseline.ndvi.sd ? 'text-green-600' : 'text-red-600'}`}>{indices.ndvi.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">NDRE</div>
                    <div className={`font-bold ${indices.ndre >= baseline.ndre.mean - 2 * baseline.ndre.sd ? 'text-green-600' : 'text-red-600'}`}>{indices.ndre.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">GNDVI</div>
                    <div className={`font-bold ${indices.gndvi >= baseline.gndvi.mean - 2 * baseline.gndvi.sd ? 'text-green-600' : 'text-red-600'}`}>{indices.gndvi.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Water Idx</div>
                    <div className="font-bold text-blue-600">{indices.waterIndex.toFixed(3)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs">Kondisi</div>
                    <div className={`font-bold ${stress.conditionColor}`}>{stress.condition}</div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-0.5">
                    <span>Skor Stres</span>
                    <span>{(stress.score * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${getStressBarColor(stress.score)}`} style={{ width: `${Math.min(100, stress.score * 100)}%` }} />
                  </div>
                </div>
              </div>

              {/* Spectral Chart */}
              <ResponsiveContainer width="100%" height={300} minHeight={200}>
                <LineChart data={channelData}>
                  <XAxis dataKey="name" stroke="#9CA3AF" label={{ value: 'λ (nm)', position: 'bottom', offset: -5 }} />
                  <YAxis stroke="#9CA3AF" label={{ value: 'Intensity', angle: -90, position: 'insideLeft' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={3} activeDot={{ r: 8, fill: "#6366F1" }} name="Intensity" />
                </LineChart>
              </ResponsiveContainer>

              {/* Channel Table */}
              <details className="mt-3">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">Lihat Data Channel</summary>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-2 py-1 text-left">Channel</th>
                        <th className="px-2 py-1 text-left">λ (nm)</th>
                        <th className="px-2 py-1 text-right">Nilai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(SPECTRAL_CHANNELS).map(([channel, wavelength]) => (
                        <tr key={channel} className="border-b border-gray-50">
                          <td className="px-2 py-1 font-mono">{channel}</td>
                          <td className="px-2 py-1">{wavelength}</td>
                          <td className="px-2 py-1 text-right">{(data[channel] || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
};
