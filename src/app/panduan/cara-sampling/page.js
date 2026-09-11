import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fertilityLevels = [
  { level: 1, condition: 'Sangat Kekurangan N', leafColor: 'Kuning Pucat', rekomendasi: 'Pemupukan N segera diperlukan', action: 'Berikan pupuk N dosis tinggi segera.' },
  { level: 2, condition: 'Kekurangan N', leafColor: 'Kuning Hijau', rekomendasi: 'Perlu pemupukan N', action: 'Lakukan pemupukan N dengan dosis sedang hingga tinggi.' },
  { level: 3, condition: 'Cenderung Kekurangan N', leafColor: 'Hijau Muda', rekomendasi: 'Pertimbangkan pemupukan N', action: 'Pertimbangkan pemupukan N dosis sedang.' },
  { level: 4, condition: 'N Cukup', leafColor: 'Hijau', rekomendasi: 'Tidak perlu menambah N', action: 'Pertahankan jadwal pemupukan yang ada.' },
  { level: 5, condition: 'N Berlebih', leafColor: 'Hijau Tua', rekomendasi: 'Jangan menambah N', action: 'Hentikan pemberian pupuk N.' },
  { level: 6, condition: 'N Sangat Berlebih', leafColor: 'Hijau Sangat Tua', rekomendasi: 'Hindari tambahan N', action: 'Hindari pupuk N, risiko toksisitas.' },
];

const measurementSchedule = [
  { phase: 'Pengukuran Berkala', hst: '21 – 28 HST mulai', frequency: 'Setiap 7–10 hari', description: 'Lakukan pengukuran warna daun secara berkala. Apabila hasil pengukuran berada di bawah skala 4, tanaman segera diberi pupuk N.' },
];

const stressLevels = [
  { range: '0 – 20%', condition: 'Sehat', color: 'Hijau', interpretation: 'Tanaman dalam kondisi sehat.' },
  { range: '20 – 40%', condition: 'Ringan', color: 'Kuning', interpretation: 'Stres ringan, perlu monitoring lebih sering.' },
  { range: '40 – 60%', condition: 'Sedang', color: 'Oranye', interpretation: 'Stres sedang, kemungkinan kekurangan air atau N.' },
  { range: '60 – 100%', condition: 'Parah', color: 'Merah', interpretation: 'Stres berat, tindakan segera diperlukan.' },
];

export default function PanduanCaraSampling() {
  return (
    <div className="p-6 max-w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">Cara Sampling & Interpretasi Level</h1>

      {/* TATA CARA SAMPLING */}
      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Tata Cara Pengambilan Sample</h2>

      <div className="bg-white p-5 rounded-lg shadow mb-6 text-sm text-gray-700 space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
          <div>
            <p className="font-semibold">Hidupkan perangkat sensor</p>
            <p className="text-gray-600">Nyalakan sensor dan tunggu hingga siap digunakan. Pastikan baterai cukup.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
          <div>
            <p className="font-semibold">Jepit daun ke sensor</p>
            <p className="text-gray-600">Jepit daun teratas yang sudah terbuka penuh ke sensor. Pastikan daun menutupi area pembacaan sensor dengan baik.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
          <div>
            <p className="font-semibold">Tekan tombol sampling</p>
            <p className="text-gray-600">Sensor akan membaca 18 channel spektral dan data otomatis tersimpan di aplikasi. Ulangi untuk beberapa titik daun berbeda pada rumpun yang sama.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
          <div>
            <p className="font-semibold">Ulangi pada rumpun lain</p>
            <p className="text-gray-600">Lakukan pengukuran yang sama pada rumpun lain di areal yang sama. Aplikasi akan otomatis menghitung rata-rata dan menentukan kondisi tanaman.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
          <div>
            <p className="font-semibold">Cek hasil di aplikasi</p>
            <p className="text-gray-600">Buka halaman kebun atau sampling untuk melihat hasil analisis otomatis: kondisi tanaman, skor stres, skor kesuburan, dan rekomendasi pemupukan.</p>
          </div>
        </div>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-amber-700">Tips Pengambilan Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-700 space-y-2 list-disc ml-4">
            <li>Pengukuran dilakukan pada <strong>waktu dan orang yang sama</strong> untuk menjaga konsistensi data.</li>
            <li>Sebaiknya pengukuran dilakukan pada <strong>pagi atau sore hari</strong>, saat cahaya matahari tidak terlalu terik.</li>
            <li>Hindari pengukuran setelah hujan — daun basah bisa mempengaruhi hasil pembacaan.</li>
            <li>Pilih daun yang <strong>sehat secara fisik</strong> (tidak robek, tidak ada hama) untuk representasi kondisi sebenarnya.</li>
            <li>Catat kondisi lapangan (cuaca, kelembapan, kondisi tanah) sebagai konteks tambahan.</li>
          </ul>
        </CardContent>
      </Card>

      {/* JADWAL PENGUKURAN */}
      <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Kapan Melakukan Pengukuran?</h2>
      <p className="mb-4 text-sm text-gray-700">
        Pengukuran berdasarkan warna daun dilakukan sesuai fase pertumbuhan tanaman padi:
      </p>
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Fase</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Umur (HST)</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Frekuensi</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {measurementSchedule.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 border-b border-gray-200 font-bold">{row.phase}</td>
                    <td className="p-3 border-b border-gray-200 font-mono text-xs">{row.hst}</td>
                    <td className="p-3 border-b border-gray-200">{row.frequency}</td>
                    <td className="p-3 border-b border-gray-200 text-xs">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FAKTOR PENGARUH */}
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-amber-700">Faktor yang Mempengaruhi Hasil Pengukuran</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-700 space-y-2 list-disc ml-4">
            <li><strong>Kerapatan tanaman</strong> — tanaman terlalu rapat atau renggang mempengaruhi warna daun.</li>
            <li><strong>Varietas padi</strong> — setiap varietas memiliki karakteristik warna daun yang berbeda.</li>
            <li><strong>Radiasi cahaya matahari</strong> — kondisi cahaya saat musim hujan vs musim kemarau.</li>
            <li><strong>Kadar unsur hara lain</strong> — defisiensi P, K, atau mikronutrien dapat mempengaruhi warna daun.</li>
            <li><strong>Hama dan penyakit</strong> — serangan hama atau penyakit dapat menyebabkan perubahan warna daun yang tidak terkait dengan status N.</li>
          </ul>
          <p className="text-xs text-gray-500 mt-3">
            Oleh karena itu, petani sebaiknya memberikan pemupukan secara berimbang sesuai dengan fase pertumbuhan tanaman padi agar hasil panen dapat maksimal.
          </p>
        </CardContent>
      </Card>

      {/* PENJELASAN LEVEL */}
      <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Penjelasan Level</h2>

      <p className="mb-4 text-base text-gray-700">
        Aplikasi ini menampilkan dua jenis skor utama untuk menilai kondisi tanaman: <strong>Skor Stres</strong> dan <strong>Skor Kesuburan</strong>.
      </p>

      {/* Skor Stres */}
      <h3 className="text-xl font-bold text-green-600 mt-6 mb-3">Skor Stres Tanaman</h3>
      <p className="mb-4 text-sm text-gray-700">
        Skor stres menggambarkan seberapa jauh kondisi tanaman menyimpang dari kondisi sehat. Semakin tinggi skor, semakin besar stres yang dialami tanaman.
      </p>
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Skor Stres</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Kondisi</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Warna</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Interpretasi</th>
                </tr>
              </thead>
              <tbody>
                {stressLevels.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 border-b border-gray-200 font-bold">{row.range}</td>
                    <td className="p-3 border-b border-gray-200 font-medium">{row.condition}</td>
                    <td className="p-3 border-b border-gray-200">{row.color}</td>
                    <td className="p-3 border-b border-gray-200 text-xs">{row.interpretation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Skor Kesuburan */}
      <h3 className="text-xl font-bold text-green-600 mt-6 mb-3">Skor Kesuburan</h3>
      <p className="mb-4 text-sm text-gray-700">
        Skor kesuburan menunjukkan status nitrogen tanaman. Digunakan untuk menentukan kapan dan berapa banyak pupuk nitrogen yang diperlukan. 
        Skor berkisar dari 1 (sangat kekurangan N) hingga 6 (sangat berlebih N). Level 4 adalah kondisi ideal.
      </p>
      <Card className="mb-6 shadow-lg">
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Level</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Warna Daun</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Kondisi</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Rekomendasi</th>
                  <th className="p-3 text-left bg-green-100 text-green-800 border-b border-green-200">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {fertilityLevels.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 border-b border-gray-200 font-bold text-center">{row.level}</td>
                    <td className="p-3 border-b border-gray-200">{row.leafColor}</td>
                    <td className="p-3 border-b border-gray-200 font-medium">{row.condition}</td>
                    <td className="p-3 border-b border-gray-200 text-xs">{row.rekomendasi}</td>
                    <td className="p-3 border-b border-gray-200 text-xs">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Cara Membaca Hasil */}
      <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Cara Membaca Hasil di Aplikasi</h2>
      <div className="bg-white p-5 rounded-lg shadow mb-6 text-sm text-gray-700 space-y-3">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">✓</span>
          <p><strong>Tanaman Sehat</strong> — Skor stres rendah (hijau), skor kesuburan level 4. Tidak perlu tindakan khusus.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xs">!</span>
          <p><strong>Perlu Perhatian</strong> — Skor stres ringan/sedang, atau skor kesuburan level 2–3. Pantau lebih sering, pertimbangkan pemupukan N.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs">!</span>
          <p><strong>Tindakan Segera</strong> — Skor stres parah, atau skor kesuburan level 1. Berikan pupuk N dosis tinggi segera dan periksa kondisi air tanah.</p>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">!</span>
          <p><strong>Kelebihan N</strong> — Skor kesuburan level 5–6. Hentikan pemupukan N. Kelebihan nitrogen dapat mengundang hama dan menurunkan kualitas gabah.</p>
        </div>
      </div>

      {/* Catatan */}
      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Catatan Penting</h2>
      <ul className="list-disc ml-6 mb-6 text-sm text-gray-700 space-y-2">
        <li>Baseline padi sehat bersifat <strong>default eksperimen</strong>, bukan universal. Harus dikalibrasi dari 50–100 pengukuran tanaman sehat di lokasi Anda.</li>
        <li>NDVI rendah <strong>tidak otomatis</strong> berarti kekurangan N. Bisa karena air, penyakit, atau daun tua.</li>
        <li>NDRE lebih sensitif terhadap perubahan klorofil daripada NDVI — ini mengapa NDRE diberi bobot tertinggi dalam skor stres.</li>
        <li>Gunakan mode <strong>Teknis</strong> atau <strong>Awam</strong> di halaman kebun untuk melihat interpretasi sesuai pemahaman Anda.</li>
        <li>Semua indeks dihitung dari <strong>reflectance relatif</strong>, bukan ADC/count sensor mentah.</li>
        <li>Lakukan sampling secara berkala (1–2 minggu sekali) untuk memantau tren perubahan kondisi tanaman dari waktu ke waktu.</li>
      </ul>
    </div>
  );
}
