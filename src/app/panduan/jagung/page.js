import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cornNutrients = [
  { name: 'N %', values: ['4.0-5.0', '3.5-4.5', '3.0-4.0', '2.8-3.5', '2.5-3.5'] },
  { name: 'P %', values: ['.40-.60', '.35-.50', '.30-.45', '.25-.40', '.20-.30'] },
  { name: 'K %', values: ['3.0-5.0', '2.0-3.5', '2.0-3.0', '1.8-2.5', '1.6-2.5'] },
  { name: 'Ca %', values: ['.51-1.6', '.20-.80', '.20-1.0', '.20-1.2', '.20-1.5'] },
  { name: 'Mg %', values: ['.30-.60', '.20-.60', '.20-.80', '.20-.80', '.20-.80'] },
  { name: 'S %', values: ['.18-.40', '.18-.40', '.18-.40', '.18-.35', '.16-.35'] },
  { name: 'B ppm', values: ['6-25', '6-25', '5-25', '5-25', '5-25'] },
  { name: 'Cu ppm', values: ['6-20', '6-20', '5-20', '5-20', '3-20'] },
  { name: 'Fe ppm', values: ['40-500', '25-250', '30-250', '30-250', '30-250'] },
  { name: 'Mn ppm', values: ['40-160', '20-150', '20-150', '20-150', '20-150'] },
  { name: 'Zn ppm', values: ['25-60', '20-60', '20-70', '20-70', '16-50'] },
];

const stages = [
    { stage: 'Whole plant¹', description: 'Seedlings 6 to 16 inches tall; 24 to 45 days after planting.' },
    { stage: '3rd leaf²', description: 'Third leaf from top; plants over 12 inches tall, before silking.' },
    { stage: 'Green silks³', description: '70 to 90 days after planting.' },
    { stage: 'Brown silks⁴', description: 'Grain in developing stage up to "roasting ear."' },
    { stage: 'Mature⁵', description: 'Poor stage-sample; grain in dough stage, beginning to dent.' }
];

const soilPTestData = [
  {
    name: 'Bray P and Mehlich-3 P',
    rows: [
      { level: 'Very Low', low: '0-8', high: '0-5' },
      { level: 'Low', low: '9-15', high: '6-10' },
      { level: 'Optimum', low: '16-20', high: '11-15' },
      { level: 'High', low: '21-30', high: '16-20' },
      { level: 'Very High', low: '31+', high: '21+' }
    ]
  },
  {
    name: 'Olsen P',
    rows: [
      { level: 'Very Low', low: '0-5', high: '0-3' },
      { level: 'Low', low: '6-10', high: '4-7' },
      { level: 'Optimum', low: '11-14', high: '8-11' },
      { level: 'High', low: '15-20', high: '12-15' },
      { level: 'Very High', low: '21+', high: '16+' }
    ]
  },
  {
    name: 'Mehlich-3 ICP (P)',
    rows: [
      { level: 'Very Low', low: '0-15', high: '0-10' },
      { level: 'Low', low: '16-25', high: '11-20' },
      { level: 'Optimum', low: '26-35', high: '21-30' },
      { level: 'High', low: '36-45', high: '31-40' },
      { level: 'Very High', low: '46+', high: '41+' }
    ]
  }
];

const soilKTestData = [
  {
    name: 'Ammonium Acetate and Mehlich-3 K',
    rows: [
      { level: 'Very Low', low: '0-90', high: '0-70' },
      { level: 'Low', low: '91-130', high: '71-110' },
      { level: 'Optimum', low: '131-170', high: '111-150' },
      { level: 'High', low: '171-200', high: '151-180' },
      { level: 'Very High', low: '201+', high: '181+' }
    ]
  }
];

const NutrientTable = ({ data, headers, title }) => (
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
                <td className="p-3 border-b border-gray-200">{row.name}</td>
                {row.values.map((value, cellIndex) => (
                  <td key={cellIndex} className="p-3 border-b border-gray-200">{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>
);

export default function NutrientTables() {
  const flattenedSoilPData = soilPTestData.flatMap(test =>
    (test.rows || []).map(row => ({
      name: `${test.name} (${row.level})`,
      values: [row.low, row.high],
    }))
  );

  const flattenedSoilKData = soilKTestData.flatMap(test =>
    (test.rows || []).map(row => ({
      name: `${test.name} (${row.level})`,
      values: [row.low, row.high],
    }))
  );

  return (
    <div className="p-6 max-w-full bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-green-800 text-center">Nutrient Levels and Soil Test Values</h1>
      
      <p className="mb-4 text-base text-gray-700">
        Informasi ini membantu petani dan ahli agronomi untuk memahami status nutrisi tanaman jagung pada berbagai tahap pertumbuhan, serta tingkat ketersediaan nutrisi fosfor dan kalium dalam tanah. Ini penting untuk menentukan kebutuhan pemupukan dan pengelolaan tanah yang tepat, sehingga dapat mendukung pertumbuhan tanaman jagung yang sehat dan hasil panen yang optimal.
      </p>

      <p className="mb-4 text-base text-gray-700">
        <strong>Tahap Pertumbuhan:</strong> Berikut adalah penjelasan singkat mengenai tahap-tahap pertumbuhan jagung yang relevan:
      </p>

      <ul className="list-disc ml-6 mb-6 text-base text-gray-700">
        <li><strong>Whole plant (Seluruh tanaman):</strong> Mengacu pada konsentrasi nutrisi dalam seluruh bagian tanaman jagung.</li>
        <li><strong>3rd leaf (Daun ketiga):</strong> Mengacu pada konsentrasi nutrisi di daun ketiga tanaman jagung.</li>
        <li><strong>Green silks (Rambut hijau):</strong> Mengacu pada konsentrasi nutrisi di bagian rambut jagung yang masih hijau.</li>
        <li><strong>Brown silks (Rambut cokelat):</strong> Mengacu pada konsentrasi nutrisi di bagian rambut jagung yang telah berubah menjadi cokelat.</li>
        <li><strong>Mature (Masa matang):</strong> Mengacu pada konsentrasi nutrisi di tanaman jagung yang sudah matang.</li>
      </ul>

      <NutrientTable 
        title="Corn Plant Nutrient Levels"
        headers={['Nutrient', ...stages.map(stage => `${stage.stage}`)]}
        data={cornNutrients}
      />

      <p className="mb-6 text-base text-gray-700">
        Pengujian tanah untuk fosfor menggunakan metode Bray P, Mehlich-3 P, Olsen P, dan Mehlich-3 ICP (P). Nilai ini membantu menentukan tingkat ketersediaan fosfor dalam tanah, yang sangat penting untuk pertumbuhan tanaman.
      </p>

      <NutrientTable
        title="Soil Test Values (P - PPM)"
        headers={['Level', 'Low Sub-soil P', 'High Sub-soil P']}
        data={flattenedSoilPData}
      />
      
      <p className="mb-6 text-base text-gray-700">
        Pengujian tanah untuk kalium menggunakan metode Ammonium Acetate dan Mehlich-3 K. Tingkat ketersediaan kalium juga dikategorikan sebagai Sangat Rendah, Rendah, Optimum, Tinggi, dan Sangat Tinggi, tergantung pada tingkat kalium di sub-soil (tanah lapisan bawah).
      </p>

      <NutrientTable
        title="Soil Test Values (K - PPM)"
        headers={['Level', 'Low Sub-soil K', 'High Sub-soil K']}
        data={flattenedSoilKData}
      />
    </div>
  );
}
