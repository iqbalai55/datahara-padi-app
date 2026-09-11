import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const spectralChannels = [
  { channel: 'channelA', wavelength: 410, color: 'Ungu' },
  { channel: 'channelB', wavelength: 435, color: 'Ungu' },
  { channel: 'channelC', wavelength: 460, color: 'Biru' },
  { channel: 'channelD', wavelength: 485, color: 'Biru' },
  { channel: 'channelE', wavelength: 510, color: 'Hijau' },
  { channel: 'channelF', wavelength: 535, color: 'Hijau' },
  { channel: 'channelG', wavelength: 560, color: 'Hijau' },
  { channel: 'channelH', wavelength: 585, color: 'Kuning' },
  { channel: 'channelR', wavelength: 610, color: 'Oranye' },
  { channel: 'channelI', wavelength: 645, color: 'Merah' },
  { channel: 'channelS', wavelength: 680, color: 'Merah' },
  { channel: 'channelJ', wavelength: 705, color: 'Red Edge' },
  { channel: 'channelT', wavelength: 730, color: 'Red Edge' },
  { channel: 'channelU', wavelength: 760, color: 'NIR' },
  { channel: 'channelV', wavelength: 810, color: 'NIR' },
  { channel: 'channelW', wavelength: 860, color: 'NIR' },
  { channel: 'channelK', wavelength: 900, color: 'NIR' },
  { channel: 'channelL', wavelength: 940, color: 'NIR (Water)' },
];

const indices = [
  {
    name: 'NDVI',
    formula: '(R810 - R645) / (R810 + R645)',
    channels: 'channelV (810nm) & channelI (645nm)',
    description: 'Normalized Difference Vegetation Index. Mengukur vigor umum tanaman. Nilai tinggi = tanaman sehat.',
    baseline: 'Mean: 0.82 ± 0.03',
    interpretation: 'NDVI rendah menunjukkan vigor turun, tapi belum tentu kekurangan N. Bisa karena air, penyakit, atau daun tua.'
  },
  {
    name: 'NDRE',
    formula: '(R810 - R705) / (R810 + R705)',
    channels: 'channelV (810nm) & channelJ (705nm)',
    description: 'Normalized Difference Red Edge. Sangat sensitif terhadap perubahan klorofil. Lebih penting dari NDVI untuk deteksi stres N.',
    baseline: 'Mean: 0.35 ± 0.05',
    interpretation: 'NDRE turun = kemungkinan stres klorofil / kekurangan N-related. Red edge 705nm sangat sensitif.'
  },
  {
    name: 'GNDVI',
    formula: '(R810 - R560) / (R810 + R560)',
    channels: 'channelV (810nm) & channelG (560nm)',
    description: 'Green NDVI. Indikator kehijauan/chlorophyll tambahan. Melengkapi NDVI dan NDRE.',
    baseline: 'Mean: 0.65 ± 0.04',
    interpretation: 'GNDVI turun = perubahan kehijauan. Digunakan sebagai indikator tambahan.'
  },
  {
    name: 'Water Index',
    formula: 'R940 / R860',
    channels: 'channelL (940nm) & channelW (860nm)',
    description: 'Rasio penyerapan air. 940nm adalah band penyerapan air, 860nm adalah referensi NIR.',
    baseline: 'Mean: 1.05 ± 0.03',
    interpretation: 'Water Index abnormal = indikasi stres air.'
  }
];

const stressScoring = [
  { range: '0 - 20%', condition: 'Sehat', color: 'Hijau', description: 'Tanaman dalam kondisi sehat' },
  { range: '20 - 40%', condition: 'Ringan', color: 'Kuning', description: 'Stres ringan, perlu monitoring' },
  { range: '40 - 60%', condition: 'Sedang / Stres Klorofil', color: 'Oranye', description: 'Stres sedang. Jika NDRE turun lebih dari NDVI → kemungkinan stres klorofil/N' },
  { range: '60 - 100%', condition: 'Parah', color: 'Merah', description: 'Stres berat, perlu tindakan segera' },
];

const bwdScoring = [
  { score: '1', condition: 'Sangat Kekurangan N', color: 'Kuning Pucat', description: 'Pemupukan N segera', rekomendasi: 'Dosis Tinggi' },
  { score: '2', condition: 'Kekurangan N', color: 'Kuning Hijau', description: 'Perlu pemupukan N', rekomendasi: 'Dosis Sedang-Tinggi' },
  { score: '3', condition: 'Cenderung Kekurangan N', color: 'Hijau Muda', description: 'Pertimbangkan pemupukan N', rekomendasi: 'Dosis Sedang' },
  { score: '4', condition: 'N Cukup', color: 'Hijau', description: 'Pertahankan', rekomendasi: 'Dosis Rendah' },
  { score: '5', condition: 'N Berlebih', color: 'Hijau Tua', description: 'Jangan tambah N', rekomendasi: 'Tidak Perlu' },
  { score: '6', condition: 'N Sangat Berlebih', color: 'Hijau Sangat Tua', description: 'Hindari tambahan N', rekomendasi: 'Hindari' },
];

const StreakTable = ({ title, headers, data, renderRow }) => (
  <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-green-700">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {renderRow(row, rowIndex)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default function PanduanPadi() {
  return (
    <div className="p-6 max-w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">Panduan Analisis Spektral Padi</h1>

      <p className="mb-4 text-base text-gray-700">
        Sistem ini menggunakan sensor spektral <strong>AS7265x</strong> (18 channel, 410-940nm) untuk menganalisis kondisi tanaman padi 
        melalui indeks spektral. Pendekatan <strong>rule-based scoring</strong> digunakan karena belum tersedia data kalibrasi yang cukup untuk ML.
      </p>

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Alur Analisis</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-6 text-sm text-gray-700 font-mono">
        AS7265x → 18 channel reading → Calibration → Reflectance → Hitung Indeks → Bandingkan Baseline → Rule-based Scoring → Kondisi
      </div>

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Channel Spektral AS7265x</h2>
      <StreakTable
        title="18 Channel Spektral"
        headers={['Channel', 'λ (nm)', 'Warna']}
        data={spectralChannels}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-mono">{row.channel}</td>
            <td className="p-3 border-b border-gray-200">{row.wavelength}</td>
            <td className="p-3 border-b border-gray-200">{row.color}</td>
          </>
        )}
      />

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Indeks Spektral</h2>
      {indices.map((idx, i) => (
        <Card key={i} className="mb-4 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-green-700">{idx.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><span className="font-bold">Formula:</span> <code className="bg-gray-100 px-2 py-0.5 rounded">{idx.formula}</code></div>
              <div><span className="font-bold">Channel:</span> {idx.channels}</div>
              <div><span className="font-bold">Deskripsi:</span> {idx.description}</div>
              <div><span className="font-bold">Baseline:</span> {idx.baseline}</div>
              <div className="bg-amber-50 p-2 rounded"><span className="font-bold">Interpretasi:</span> {idx.interpretation}</div>
            </div>
          </CardContent>
        </Card>
      ))}

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Stress Score</h2>
      <p className="mb-4 text-base text-gray-700">
        Skor stres dihitung dari kombinasi berat setiap indeks:
      </p>
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-sm font-mono text-gray-700">
        Stress Score = 0.35 × NDVI_stress + 0.40 × NDRE_stress + 0.25 × GNDVI_stress
      </div>

      <StreakTable
        title="Kategori Kondisi"
        headers={['Skor Stres', 'Kondisi', 'Warna', 'Keterangan']}
        data={stressScoring}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.range}</td>
            <td className="p-3 border-b border-gray-200">{row.condition}</td>
            <td className="p-3 border-b border-gray-200">{row.color}</td>
            <td className="p-3 border-b border-gray-200">{row.description}</td>
          </>
        )}
      />

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Skor Kesuburan Tanaman</h2>
      <p className="mb-4 text-base text-gray-700">
        Skor kesuburan menunjukkan status nitrogen tanaman berdasarkan analisis spektral. 
        Skor ini membantu menentukan kapan tanaman perlu diberi pupuk N dan berapa takarannya.
      </p>
      <p className="mb-4 text-base text-gray-700">
        Dalam aplikasi ini, skor kesuburan diestimasi dari indeks spektral:
      </p>
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-sm font-mono text-gray-700">
        Skor Kesuburan = (0.4 × NDVI + 0.35 × NDRE + 0.25 × GNDVI) × 5
      </div>

      <StreakTable
        title="Level Skor Kesuburan dan Rekomendasi Pupuk N"
        headers={['Level', 'Warna Daun', 'Status N', 'Dosis Pupuk', 'Rekomendasi']}
        data={bwdScoring}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.score}</td>
            <td className="p-3 border-b border-gray-200">{row.color}</td>
            <td className="p-3 border-b border-gray-200">{row.condition}</td>
            <td className="p-3 border-b border-gray-200">{row.rekomendasi}</td>
            <td className="p-3 border-b border-gray-200 font-medium">{row.rekomendasi}</td>
          </>
        )}
      />

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Baseline Padi Sehat (Default)</h2>
      <p className="mb-4 text-base text-gray-700">
        Threshold = mean - 2×SD. Angka ini adalah <strong>default eksperimen</strong>, bukan universal. 
        Harus dikalibrasi dari 50-100 pengukuran tanaman sehat.
      </p>
      <StreakTable
        title="Baseline Default"
        headers={['Indeks', 'Mean', 'SD', 'Batas Bawah (mean - 2×SD)']}
        data={[
          { name: 'NDVI', mean: '0.82', sd: '0.03', limit: '0.76' },
          { name: 'NDRE', mean: '0.35', sd: '0.05', limit: '0.25' },
          { name: 'GNDVI', mean: '0.65', sd: '0.04', limit: '0.57' },
          { name: 'Water Index', mean: '1.05', sd: '0.03', limit: '0.99' },
        ]}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.name}</td>
            <td className="p-3 border-b border-gray-200">{row.mean}</td>
            <td className="p-3 border-b border-gray-200">{row.sd}</td>
            <td className="p-3 border-b border-gray-200 font-mono">{row.limit}</td>
          </>
        )}
      />

      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Catatan Penting</h2>
      <ul className="list-disc ml-6 mb-6 text-base text-gray-700 space-y-2">
        <li>NDVI rendah <strong>tidak otomatis</strong> berarti kekurangan N. Bisa karena air, penyakit, daun tua.</li>
        <li>NDRE lebih sensitif terhadap perubahan klorofil daripada NDVI.</li>
        <li>Rule-based scoring adalah pendekatan awal. Setelah ada 500-1000 pengukuran, ML bisa ditambahkan.</li>
        <li>Baseline harus dikalibrasi dari data pengukuran aktual, bukan dianggap universal.</li>
        <li>Semua indeks dihitung dari reflectance relatif, bukan ADC/count sensor mentah.</li>
      </ul>
    </div>
  );
}
