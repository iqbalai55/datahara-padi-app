'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBaseline, setBaseline, resetBaseline, DEFAULT_BASELINE, getPlants, setPlants, addPlant, removePlant, getWeights, setWeights, resetWeights, DEFAULT_WEIGHTS } from '@/app/utils/baseline';
import { Plus, Trash2 } from 'lucide-react';

const INDEX_META = [
  { key: 'ndvi', label: 'NDVI', formula: '(R810 - R645) / (R810 + R645)', description: 'Vigor umum tanaman' },
  { key: 'ndre', label: 'NDRE', formula: '(R810 - R705) / (R810 + R705)', description: 'Klorofil / N-related stress' },
  { key: 'gndvi', label: 'GNDVI', formula: '(R810 - R560) / (R810 + R560)', description: 'Kehijauan' },
  { key: 'waterIndex', label: 'Water Index', formula: 'R940 / R860', description: 'Indikasi stres air' }
];

export default function Settings() {
  const [baseline, setBaselineState] = useState(null);
  const [plants, setPlantsState] = useState([]);
  const [weights, setWeightsState] = useState(null);
  const [saved, setSaved] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');

  useEffect(() => {
    setBaselineState(getBaseline());
    setPlantsState(getPlants());
    setWeightsState(getWeights());
  }, []);

  const handleChange = (indexKey, field, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setBaselineState(prev => ({ ...prev, [indexKey]: { ...prev[indexKey], [field]: num } }));
    setSaved(false);
  };

  const handleWeightChange = (type, indexKey, value) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    setWeightsState(prev => ({ ...prev, [type]: { ...prev[type], [indexKey]: num } }));
    setSaved(false);
  };

  const handleSave = () => {
    setBaseline(baseline);
    setWeights(weights);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetBaseline();
    resetWeights();
    setBaselineState(getBaseline());
    setPlantsState(getPlants());
    setWeightsState(getWeights());
    setResetConfirm(false);
    setSaved(false);
  };

  const handleAddPlant = () => {
    setAddError('');
    const id = newId.trim();
    const name = newName.trim();
    if (!id) { setAddError('ID harus diisi'); return; }
    if (!name) { setAddError('Nama harus diisi'); return; }
    if (plants.some(p => p.id === id)) { setAddError('ID sudah ada'); return; }
    addPlant(id, name);
    setPlantsState(getPlants());
    setNewId('');
    setNewName('');
  };

  const handleRemovePlant = (id) => {
    if (plants.length <= 1) return;
    removePlant(id);
    setPlantsState(getPlants());
  };

  if (!baseline || !weights) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-20 h-20 border-purple-700 border-t-2 animate-spin rounded-full"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Pengaturan</h1>
        <p className="text-sm text-gray-500 text-center mb-8">Kelola daftar tanaman dan baseline analisis</p>

        {/* Daftar Tanaman */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Daftar Tanaman Padi</h2>
          <p className="text-xs text-gray-500 mb-3">ID berhubungan dengan document ID di Firestore (status_tanaman & sampling)</p>

          <div className="space-y-2 mb-4">
            {plants.map((plant) => (
              <div key={plant.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                <div>
                  <span className="font-semibold text-gray-800">{plant.name}</span>
                  <span className="text-xs text-gray-400 ml-2">ID: {plant.id}</span>
                </div>
                <button
                  onClick={() => handleRemovePlant(plant.id)}
                  disabled={plants.length <= 1}
                  className={`p-1.5 rounded-lg transition-colors ${plants.length <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:bg-red-50'}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-3">
            <p className="text-xs font-medium text-gray-600 mb-2">Tambah Tanaman Baru</p>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="ID (angka)"
                value={newId}
                onChange={(e) => { setNewId(e.target.value); setAddError(''); }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
              <input
                type="text"
                placeholder="Nama (contoh: Padi X)"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setAddError(''); }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none col-span-2"
              />
            </div>
            {addError && <p className="text-xs text-red-500 mb-2">{addError}</p>}
            <button
              onClick={handleAddPlant}
              className="w-full flex items-center justify-center gap-2 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
            >
              <Plus size={16} /> Tambah
            </button>
          </div>
        </div>

        {/* Baseline */}
        {INDEX_META.map((meta) => {
          const bl = baseline[meta.key];
          const lowerLimit = bl.mean - 2 * bl.sd;
          return (
            <div key={meta.key} className="bg-white rounded-xl shadow-md p-5 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{meta.label}</h2>
                  <p className="text-xs text-gray-500">{meta.description}</p>
                </div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{meta.formula}</code>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Mean</label>
                  <input type="number" step="0.01" value={bl.mean} onChange={(e) => handleChange(meta.key, 'mean', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">SD (Standard Deviation)</label>
                  <input type="number" step="0.01" value={bl.sd} onChange={(e) => handleChange(meta.key, 'sd', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 flex justify-between">
                <span>Batas Bawah: <strong className="text-gray-800">{lowerLimit.toFixed(4)}</strong></span>
                <span>Batas Atas: <strong className="text-gray-800">{(bl.mean + 2 * bl.sd).toFixed(4)}</strong></span>
              </div>
            </div>
          );
        })}

        {/* Stress Weights */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Bobot Stress Score</h2>
          <p className="text-xs text-gray-500 mb-3">Total bobot harus = 1.0</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">NDVI (Vigor)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.stress.ndvi}
                onChange={(e) => handleWeightChange('stress', 'ndvi', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">NDRE (Klorofil / N)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.stress.ndre}
                onChange={(e) => handleWeightChange('stress', 'ndre', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">GNDVI (Kehijauan)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.stress.gndvi}
                onChange={(e) => handleWeightChange('stress', 'gndvi', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
          </div>
          <div className="mt-3 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 flex justify-between">
            <span>Total:</span>
            <span className={`font-mono font-bold ${(weights.stress.ndvi + weights.stress.ndre + weights.stress.gndvi).toFixed(2) === '1.00' ? 'text-green-600' : 'text-red-600'}`}>
              {(weights.stress.ndvi + weights.stress.ndre + weights.stress.gndvi).toFixed(2)}
            </span>
          </div>
        </div>

        {/* BWD Weights */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Bobot Skor Kesuburan</h2>
          <p className="text-xs text-gray-500 mb-3">Bobot untuk menghitung skor kesuburan tanaman</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">NDVI (Vigor)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.bwd.ndvi}
                onChange={(e) => handleWeightChange('bwd', 'ndvi', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">NDRE (Klorofil / N)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.bwd.ndre}
                onChange={(e) => handleWeightChange('bwd', 'ndre', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 flex-1">GNDVI (Kehijauan)</span>
              <input type="number" step="0.01" min="0" max="1" value={weights.bwd.gndvi}
                onChange={(e) => handleWeightChange('bwd', 'gndvi', e.target.value)}
                className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-right font-mono focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" />
            </div>
          </div>
          <div className="mt-3 bg-cyan-50 rounded-lg p-3 text-xs text-gray-600">
            <p className="font-medium mb-1">Formula:</p>
            <code className="font-mono">Skor Kesuburan = ({weights.bwd.ndvi} × NDVI + {weights.bwd.ndre} × NDRE + {weights.bwd.gndvi} × GNDVI) × 5</code>
          </div>
          <div className="mt-2 bg-gray-50 rounded-lg p-3 text-xs text-gray-600 flex justify-between">
            <span>Total:</span>
            <span className={`font-mono font-bold ${(weights.bwd.ndvi + weights.bwd.ndre + weights.bwd.gndvi).toFixed(2) === '1.00' ? 'text-green-600' : 'text-red-600'}`}>
              {(weights.bwd.ndvi + weights.bwd.ndre + weights.bwd.gndvi).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Default Reference */}
        <div className="bg-blue-50 rounded-xl shadow-md p-5 mb-4">
          <h2 className="text-lg font-bold text-blue-800 mb-3">Referensi Default</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {INDEX_META.map((meta) => {
              const def = DEFAULT_BASELINE[meta.key];
              return (
                <div key={meta.key} className="bg-white p-2 rounded-lg">
                  <span className="font-medium">{meta.label}:</span> {def.mean} ± {def.sd}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button onClick={handleSave}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition-colors ${saved ? 'bg-green-500' : 'bg-green-600 hover:bg-green-700'}`}>
            {saved ? 'Tersimpan!' : 'Simpan'}
          </button>
          {!resetConfirm ? (
            <button onClick={() => setResetConfirm(true)}
              className="px-6 py-3 rounded-xl font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
              Reset
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleReset}
                className="px-4 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors">
                Ya, Reset
              </button>
              <button onClick={() => setResetConfirm(false)}
                className="px-4 py-3 rounded-xl font-semibold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-colors">
                Batal
              </button>
            </div>
          )}
        </div>

        <Link href="/">
          <div className="bg-purple-500 rounded-xl shadow-md p-4 cursor-pointer transition-transform duration-300 hover:translate-x-2 mb-8">
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-lg font-semibold">Kembali</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
