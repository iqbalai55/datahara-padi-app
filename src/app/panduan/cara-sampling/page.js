import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const fertilityLevels = [
  { level: 1, condition: 'Sangat Kekurangan N', leafColor: 'Kuning Pucat', nitrogenStatus: 'Sangat Kekurangan N', rekomendasi: 'Pemupukan N segera diperlukan', dosis: 'Pupuk N dosis tinggi segera', action: 'Berikan pupuk N dosis tinggi segera. Tanaman sangat membutuhkan nitrogen.' },
  { level: 2, condition: 'Kekurangan N', leafColor: 'Kuning Hijau', nitrogenStatus: 'Kekurangan N', rekomendasi: 'Perlu pemupukan N', dosis: 'Pupuk N dosis sedang–tinggi', action: 'Lakukan pemupukan N dengan dosis sedang hingga tinggi. Pantau dalam 3-5 hari.' },
  { level: 3, condition: 'Cenderung Kekurangan N', leafColor: 'Hijau Muda', nitrogenStatus: 'Cenderung Kekurangan N', rekomendasi: 'Pertimbangkan pemupukan N', dosis: 'Pupuk N dosis sedang', action: 'Pertimbangkan pemupukan N dosis sedang. Pantau perkembangan sebelum memutuskan.' },
  { level: 4, condition: 'N Cukup', leafColor: 'Hijau', nitrogenStatus: 'N Cukup', rekomendasi: 'Pertahankan, tidak perlu menambah N', dosis: 'Pemupukan N tidak diperlukan sementara', action: 'Kondisi baik. Pertahankan jadwal pemupukan yang ada. Tidak perlu tambahan N.' },
  { level: 5, condition: 'N Berlebih', leafColor: 'Hijau Tua', nitrogenStatus: 'N Berlebih', rekomendasi: 'Jangan menambah N', dosis: 'Hentikan pemberian pupuk N', action: 'Hentikan pemberian pupuk N. Kelebihan N dapat mengundang hama dan menurunkan kualitas.' },
  { level: 6, condition: 'N Sangat Berlebih', leafColor: 'Hijau Sangat Tua', nitrogenStatus: 'N Sangat Berlebih', rekomendasi: 'Hindari tambahan N', dosis: 'Hindari pupuk N, risiko toksisitas', action: 'Hindari pupuk N sepenuhnya. Risiko toksisitas nitrogen. Pertimbangkan irigasi untuk mengurangi konsentrasi N di tanah.' },
];

const measurementSchedule = [
  { phase: 'Pertumbuhan Awal', hst: '0 – 14 HST', frequency: '1–2 kali', description: 'Pengukuran awal untuk memastikan tanaman memiliki nitrogen yang cukup saat fase vegetatif awal.' },
  { phase: 'Pembentukan Anakan Aktif', hst: '21 – 28 HST', frequency: 'Setiap 7–10 hari', description: 'Fase kritis di mana tanaman membutuhkan nitrogen untuk pembentukan anakan. Pantau secara berkala.' },
  { phase: 'Fase Primordial / Pembentukan Malai', hst: '35 – 40 HST', frequency: '1–2 kali', description: 'Pengukuran menjelang fase generatif untuk memastikan nitrogen cukup hingga masa panen.' },
];

const stressLevels = [
  { range: '0 – 20%', condition: 'Sehat', color: 'Hijau', interpretation: 'Tanaman dalam kondisi sehat, semua indeks spektral dalam batas normal.' },
  { range: '20 – 40%', condition: 'Ringan', color: 'Kuning', interpretation: 'Stres ringan mulai terdeteksi. Perlu monitoring lebih sering. Bisa jadi awal kekurangan air atau N.' },
  { range: '40 – 60%', condition: 'Sedang', color: 'Oranye', interpretation: 'Stres sedang. Jika NDRE turun lebih dari NDVI → kemungkinan besar stres klorofil / kekurangan N. Jika Water Index abnormal → stres air.' },
  { range: '60 – 100%', condition: 'Parah', color: 'Merah', interpretation: 'Stres berat. Tindakan segera diperlukan. Periksa kondisi air, hama, dan nutrient tanah.' },
];

const spectralIndices = [
  { name: 'NDVI', formula: '(R810 − R645) ÷ (R810 + R645)', baseline: '0.82 ± 0.03', interpretation: 'Mengukur vigor umum tanaman. Nilai tinggi = tanaman sehat & aktif berfotosintesis. Rendah bisa karena stres air, penyakit, atau daun tua.' },
  { name: 'NDRE', formula: '(R810 − R705) ÷ (R810 + R705)', baseline: '0.35 ± 0.05', interpretation: 'Indikator klorofil & nitrogen paling sensitif. Red edge 705nm sangat peka terhadap perubahan kandungan klorofil daun.' },
  { name: 'GNDVI', formula: '(R810 − R560) ÷ (R810 + R560)', baseline: '0.65 ± 0.04', interpretation: 'Indikator kehijauan daun. Melengkapi NDVI dan NDRE untuk gambaran lebih lengkap.' },
  { name: 'Water Index', formula: 'R940 ÷ R860', baseline: '1.05 ± 0.03', interpretation: 'Rasio penyerapan air. 940nm adalah band penyerapan air, 860nm referensi NIR. Abnormal = indikasi stres air.' },
];

export default function PanduanCaraSampling() {
  return (
    <div className="p-6 max-w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">Panduan Sampling & Interpretasi Level</h1>

      {/* PENDAHULUAN */}
      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Tentang Sistem Ini</h2>
      <p className="mb-4 text-base text-gray-700">
        Aplikasi ini menggunakan <strong>sensor spektral AS7265x</strong> (18 channel, 410–940nm) untuk menganalisis kondisi tanaman padi melalui indeks spektral. 
        Berbeda dengan Bagan Warna Daun (BWD) tradisional yang mengandalkan perbandingan warna visual, sistem ini mengukur refleksi cahaya secara objektif dan konsisten.
      </p>

      {/* TATA CARA SAMPLING */}
      <h2 className="text-2xl font-bold text-green-700 mt-8 mb-4">Tata Cara Pengambilan Sample</h2>

      <p className="mb-4 text-base text-gray-700">
        Pengambilan sample menggunakan sensor spektral <strong>AS7265x</strong> (18 channel, 410–940nm) yang terpasang pada perangkat portable. Berikut langkah-langkahnya:
      </p>

      <div className="bg-white p-5 rounded-lg shadow mb-6 text-sm text-gray-700 space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</span>
          <div>
            <p className="font-semibold">Nyalakan perangkat sensor</p>
            <p className="text-gray-600">Tunggu hingga sensor siap (indikator LED stabil). Pastikan baterai cukup untuk sesi sampling.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</span>
          <div>
            <p className="font-semibold">Posisikan sensor menghadap daun</p>
            <p className="text-gray-600">Dekatkan sensor sekitar <strong>5–10 cm</strong> dari permukaan daun atas. Pastikan sensor tegak lurus (90°) terhadap permukaan daun. Hindari bayangan pada area yang diukur.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</span>
          <div>
            <p className="font-semibold">Ambil pembacaan</p>
            <p className="text-gray-600">Tekan tombol sampling pada perangkat. Data 18 channel akan otomatis dikirim ke aplikasi via <strong>Firebase</strong>. Pastikan koneksi internet aktif.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">4</span>
          <div>
            <p className="font-semibold">Ulangi untuk titik berbeda</p>
            <p className="text-gray-600">Untuk satu tanaman, ambil minimal <strong>3–5 titik</strong> sampel dari daun yang berbeda (atas, tengah, bawah). Ini membantu merata-ratakan hasil analisis.</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <span className="flex-shrink-0 w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">5</span>
          <div>
            <p className="font-semibold">Cek hasil di aplikasi</p>
            <p className="text-gray-600">Buka halaman kebun atau sampling untuk melihat hasil analisis otomatis: indeks spektral, skor stres, skor kesuburan, dan rekomendasi pemupukan.</p>
          </div>
        </div>
      </div>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-amber-700">Tips Pengambilan Sample</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-700 space-y-2 list-disc ml-4">
            <li>Waktu terbaik: <strong>pukul 09.00 – 11.00</strong> saat cahaya matahari cukup tapi belum terlalu panas. Hindari pengukuran saat matahari terik langsung karena pantulan cahaya dapat mempengaruhi pembacaan.</li>
            <li>Hindari sampling setelah hujan — daun basah bisa mempengaruhi pembacaan Water Index.</li>
            <li>Pilih daun yang <strong>sehat secara fisik</strong> (tidak robek, tidak ada hama) untuk representasi kondisi sebenarnya.</li>
            <li>Hindari pengukuran pada daun yang terkena bayangan langsung dari objek lain.</li>
            <li>Catat kondisi lapangan (cuaca, kelembapan, kondisi tanah) sebagai konteks tambahan.</li>
            <li>Lakukan kalibrasi sensor secara berkala sesuai panduan pabrikan.</li>
            <li>Pengukuran dilakukan pada <strong>waktu dan orang yang sama</strong> untuk menjaga konsistensi data.</li>
          </ul>
        </CardContent>
      </Card>

      {/* JADWAL PENGUKURAN */}
      <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Kapan Melakukan Pengukuran?</h2>
      <p className="mb-4 text-sm text-gray-700">
        Pengukuran spektral dilakukan berdasarkan fase pertumbuhan tanaman padi. Berikut jadwal yang direkomendasikan:
      </p>
      <StreakTable
        title="Jadwal Pengukuran Berdasarkan Fase Pertumbuhan"
        headers={['Fase', 'Umur (HST)', 'Frekuensi', 'Keterangan']}
        data={measurementSchedule}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.phase}</td>
            <td className="p-3 border-b border-gray-200 font-mono text-xs">{row.hst}</td>
            <td className="p-3 border-b border-gray-200">{row.frequency}</td>
            <td className="p-3 border-b border-gray-200 text-xs">{row.description}</td>
          </>
        )}
      />

      {/* PERBANDINGAN DENGAN BWD TRADISIONAL */}
      <h2 className="text-2xl font-bold text-green-700 mt-10 mb-4">Perbandingan dengan BWD Tradisional</h2>
      <p className="mb-4 text-sm text-gray-700">
        Sistem sensor spektral ini memiliki keunggulan dibanding Bagan Warna Daun (BWD) tradisional:
      </p>
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-700">Keunggulan Sensor Spektral</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-sm text-gray-700 space-y-2 list-disc ml-4">
            <li><strong>Objektif</strong> — Mengukur refleksi cahaya secara kuantitatif, tidak bergantung pada persepsi warna mata manusia.</li>
            <li><strong>Konsisten</strong> — Hasil pengukuran tidak berubah meskipun dilakukan oleh orang berbeda atau pada kondisi pencahayaan berbeda.</li>
            <li><strong>Multi-parameter</strong> — Tidak hanya mengukur status N, tetapi juga vigor (NDVI), klorofil (NDRE), kehijauan (GNDVI), dan status air (Water Index).</li>
            <li><strong>Real-time</strong> — Hasil analisis langsung tersedia di aplikasi tanpa perlu perbandingan visual manual.</li>
            <li><strong>Terukur</strong> — Setiap pengukuran menghasilkan data numerik yang bisa dipantau trennya dari waktu ke waktu.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-amber-700">Referensi: Metode BWD Tradisional</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-3">
            Bagan Warna Daun (BWD) tradisional menggunakan perbandingan warna visual daun dengan skala warna baku. Berikut ringkasan metodenya:
          </p>
          <ol className="text-sm text-gray-700 space-y-2 list-decimal ml-4">
            <li>Pilih 10 rumpun tanaman padi sehat secara acak dari areal yang akan diukur.</li>
            <li>Ukur daun teratas yang sudah terbuka penuh pada satu rumpun.</li>
            <li>Bandingkan warna daun dengan skala warna pada BWD. Jika di antara dua skala, ambil nilai rata-rata.</li>
            <li>Hitung rata-rata dari 10 rumpun. Jika nilai &lt; 4 → tanaman perlu pupuk N. Jika nilai ≥ 4 → tidak perlu pupuk N tambahan.</li>
          </ol>
          <p className="text-xs text-gray-500 mt-3">
            <strong>Catatan:</strong> Sistem sensor spektral kami mengintegrasikan prinsip yang sama namun dengan pengukuran yang lebih presisi dan konsisten.
          </p>
        </CardContent>
      </Card>

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
        Aplikasi ini menampilkan dua jenis skor utama untuk menilai kondisi tanaman: <strong>Skor Stres</strong> dan <strong>Skor Kesuburan</strong>. Berikut penjelasan masing-masing level.
      </p>

      {/* Indeks Spektral */}
      <h3 className="text-xl font-bold text-green-600 mt-6 mb-3">Indeks Spektral yang Digunakan</h3>
      <p className="mb-4 text-sm text-gray-700">
        Keempat indeks ini dihitung langsung dari data 18 channel sensor AS7265x. Nilai indeks dibandingkan dengan baseline padi sehat untuk menentukan kondisi tanaman.
      </p>
      <StreakTable
        title="Indeks Spektral & Baseline Padi Sehat"
        headers={['Indeks', 'Formula', 'Baseline', 'Interpretasi']}
        data={spectralIndices}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.name}</td>
            <td className="p-3 border-b border-gray-200 font-mono text-xs">{row.formula}</td>
            <td className="p-3 border-b border-gray-200 font-mono text-xs">{row.baseline}</td>
            <td className="p-3 border-b border-gray-200 text-xs">{row.interpretasi}</td>
          </>
        )}
      />

      {/* Skor Stres */}
      <h3 className="text-xl font-bold text-green-600 mt-8 mb-3">Skor Stres Tanaman</h3>
      <p className="mb-2 text-sm text-gray-700">
        Skor stres menggambarkan seberapa jauh kondisi tanaman menyimpang dari baseline sehat. Semakin tinggi skor, semakin besar stres yang dialami tanaman.
      </p>
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-sm font-mono text-gray-700">
        Stress Score = 0.35 × NDVI_stress + 0.40 × NDRE_stress + 0.25 × GNDVI_stress
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Setiap komponen stres dihitung sebagai deviasi dari baseline (mean − 2×SD). NDRE diberi bobot tertinggi karena paling sensitif terhadap kekurangan N.
      </p>
      <StreakTable
        title="Kategori Skor Stres"
        headers={['Skor Stres', 'Kondisi', 'Warna', 'Interpretasi']}
        data={stressLevels}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold">{row.range}</td>
            <td className="p-3 border-b border-gray-200 font-medium">{row.condition}</td>
            <td className="p-3 border-b border-gray-200">{row.color}</td>
            <td className="p-3 border-b border-gray-200 text-xs">{row.interpretation}</td>
          </>
        )}
      />

      {/* Skor Kesuburan */}
      <h3 className="text-xl font-bold text-green-600 mt-8 mb-3">Skor Kesuburan</h3>
      <p className="mb-2 text-sm text-gray-700">
        Skor kesuburan menunjukkan status nitrogen tanaman berdasarkan kombinasi indeks spektral. Digunakan untuk menentukan kapan dan berapa banyak pupuk nitrogen yang diperlukan.
      </p>
      <div className="bg-white p-4 rounded-lg shadow mb-4 text-sm font-mono text-gray-700">
        Skor Kesuburan = (0.4 × NDVI + 0.35 × NDRE + 0.25 × GNDVI) × 5
      </div>
      <p className="mb-4 text-xs text-gray-500">
        Skor berkisar dari 1 (sangat kekurangan N) hingga 6 (sangat berlebih N). Level 4 adalah kondisi ideal di mana N cukup tanpa perlu penambahan.
      </p>
      <StreakTable
        title="Level Skor Kesuburan & Rekomendasi Pemupukan"
        headers={['Level', 'Warna Daun', 'Status N', 'Rekomendasi', 'Aksi']}
        data={fertilityLevels}
        renderRow={(row, i) => (
          <>
            <td className="p-3 border-b border-gray-200 font-bold text-center">{row.level}</td>
            <td className="p-3 border-b border-gray-200">{row.leafColor}</td>
            <td className="p-3 border-b border-gray-200 font-medium">{row.nitrogenStatus}</td>
            <td className="p-3 border-b border-gray-200 text-xs">{row.rekomendasi}</td>
            <td className="p-3 border-b border-gray-200 text-xs">{row.action}</td>
          </>
        )}
      />

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
