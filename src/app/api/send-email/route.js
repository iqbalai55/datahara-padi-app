import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const QUICKCHART_URL = 'https://quickchart.io/chart';

async function fetchChartPng(chartConfig) {
  const resp = await fetch(QUICKCHART_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ width: 600, height: 300, format: 'png', chart: chartConfig }),
  });
  if (!resp.ok) throw new Error(`QuickChart error: ${resp.status}`);
  const buffer = await resp.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

function computeSpectralIndices(channels) {
  const R = (name) => parseFloat(channels[name]) || 0;
  const R810 = R('channelV'), R645 = R('channelI'), R705 = R('channelJ');
  const R560 = R('channelG'), R940 = R('channelL'), R860 = R('channelW');
  const ndvi = (R810 + R645) !== 0 ? (R810 - R645) / (R810 + R645) : 0;
  const ndre = (R810 + R705) !== 0 ? (R810 - R705) / (R810 + R705) : 0;
  const gndvi = (R810 + R560) !== 0 ? (R810 - R560) / (R810 + R560) : 0;
  const waterIndex = R860 !== 0 ? R940 / R860 : 0;
  return { ndvi, ndre, gndvi, waterIndex };
}

const SPECTRAL_CHANNELS = [
  { name: 'channelA', wavelength: 410 },
  { name: 'channelB', wavelength: 435 },
  { name: 'channelC', wavelength: 460 },
  { name: 'channelD', wavelength: 485 },
  { name: 'channelE', wavelength: 510 },
  { name: 'channelF', wavelength: 535 },
  { name: 'channelG', wavelength: 560 },
  { name: 'channelH', wavelength: 585 },
  { name: 'channelI', wavelength: 645 },
  { name: 'channelR', wavelength: 680 },
  { name: 'channelS', wavelength: 680 },
  { name: 'channelJ', wavelength: 705 },
  { name: 'channelT', wavelength: 730 },
  { name: 'channelU', wavelength: 760 },
  { name: 'channelV', wavelength: 810 },
  { name: 'channelW', wavelength: 860 },
  { name: 'channelK', wavelength: 900 },
  { name: 'channelL', wavelength: 940 },
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { to, plantName, condition, bwdLevel, indices, samplingData } = body;

    if (!to) {
      return NextResponse.json({ error: 'Email tujuan wajib diisi' }, { status: 400 });
    }

    const now = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
    const safeIndices = indices || { ndvi: 0, ndre: 0, gndvi: 0, waterIndex: 0 };
    const safeCondition = condition || { label: '-' };
    const safeBwd = bwdLevel || { level: '-', condition: '-', nitrogenStatus: '-', dosis: '-', rekomendasi: '-' };

    // Prepare data (oldest first, max 5)
    const sorted = [...samplingData].sort((a, b) => parseInt(a.time) - parseInt(b.time)).slice(0, 5);

    // Build spectral channel table rows
    const spectralTableRows = SPECTRAL_CHANNELS.map(ch => {
      const values = sorted.map(s => parseFloat(s[ch.name]) || 0);
      const cells = values.map(v => `<td style="padding:6px 8px;border:1px solid #e5e7eb;text-align:right;font-size:12px">${v.toFixed(1)}</td>`).join('');
      return `<tr>
        <td style="padding:6px 8px;border:1px solid #e5e7eb;font-weight:500">${ch.wavelength} nm</td>
        ${cells}
      </tr>`;
    }).join('');

    const spectralTableHeaders = sorted.map((s, i) => {
      const ts = s.time;
      return `<th style="padding:6px 8px;border:1px solid #e5e7eb;font-size:11px;background:#f3f4f6">${ts.slice(6,8)}/${ts.slice(4,6)}<br/>${ts.slice(8,10)}:${ts.slice(10,12)}</th>`;
    }).join('');

    // Build email HTML
    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;max-width:620px;margin:0 auto;padding:20px">
  <div style="background:linear-gradient(135deg,#16a34a,#15803d);color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="margin:0;font-size:22px">🌱 Laporan Kondisi Tanaman</h1>
    <p style="margin:8px 0 0;opacity:0.9">${plantName || 'Tanaman Padi'}</p>
  </div>

  <div style="background:#f9fafb;padding:20px;border:1px solid #e5e7eb;border-top:none">
    <p style="color:#6b7280;font-size:13px;margin:0 0 16px">📅 ${now}</p>

    <div style="background:white;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #e5e7eb">
      <h2 style="margin:0 0 12px;font-size:16px;color:#374151">📊 Kondisi Tanaman</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="padding:4px 0;color:#6b7280">Status</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeCondition.label}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Level</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeBwd.level} — ${safeBwd.condition}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Status N</td><td style="padding:4px 0;text-align:right">${safeBwd.nitrogenStatus}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Rekomendasi</td><td style="padding:4px 0;text-align:right">${safeBwd.dosis}</td></tr>
      </table>
    </div>

    <div style="background:white;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #e5e7eb">
      <h2 style="margin:0 0 12px;font-size:16px;color:#374151">🔬 Indeks Spektral Terkini</h2>
      <table style="width:100%;font-size:14px">
        <tr><td style="padding:4px 0;color:#6b7280">NDVI</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeIndices.ndvi.toFixed(4)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">NDRE</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeIndices.ndre.toFixed(4)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">GNDVI</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeIndices.gndvi.toFixed(4)}</td></tr>
        <tr><td style="padding:4px 0;color:#6b7280">Water Index</td><td style="padding:4px 0;font-weight:bold;text-align:right">${safeIndices.waterIndex.toFixed(4)}</td></tr>
      </table>
    </div>

    <div style="background:white;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #e5e7eb">
      <h2 style="margin:0 0 4px;font-size:16px;color:#374151">💡 Rekomendasi</h2>
      <p style="margin:0;font-size:14px;color:#4b5563">${safeBwd.rekomendasi}</p>
    </div>

    <div style="background:white;border-radius:8px;padding:16px;margin-bottom:16px;border:1px solid #e5e7eb">
      <h2 style="margin:0 0 12px;font-size:16px;color:#374151">📋 Tabel Raw Sampling</h2>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#f3f4f6">
              <th style="padding:6px 8px;border:1px solid #e5e7eb;text-align:left">Channel</th>
              ${spectralTableHeaders}
            </tr>
          </thead>
          <tbody>
            ${spectralTableRows}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div style="background:#f3f4f6;padding:16px;border-radius:0 0 12px 12px;text-align:center;border:1px solid #e5e7eb;border-top:none">
    <p style="margin:0;font-size:12px;color:#9ca3af">Dikirim dari Aplikasi Datahara</p>
  </div>
</body>
</html>`;

    // Generate chart attachments (not inline)
    const metricLabels = sorted.map(s => {
      const t = s.time;
      return `${t.slice(6,8)}/${t.slice(4,6)}`;
    });
    const metricSeries = sorted.map(s => computeSpectralIndices(s));

    const spectralChartPng = await fetchChartPng({
      type: 'line',
      data: {
        labels: SPECTRAL_CHANNELS.map(ch => `${ch.wavelength}nm`),
        datasets: sorted.map((sample, i) => ({
          label: `Sampel ${i + 1}`,
          data: SPECTRAL_CHANNELS.map(ch => parseFloat(sample[ch.name]) || 0),
          borderColor: ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6'][i % 5],
          tension: 0.3, pointRadius: 3, borderWidth: 2,
        })),
      },
      options: {
        plugins: { title: { display: true, text: 'Spektral Raw — Intensitas vs Wavelength' }, legend: { display: true, position: 'bottom' } },
        scales: { x: { title: { display: true, text: 'Wavelength (nm)' } }, y: { title: { display: true, text: 'Intensitas' }, beginAtZero: false } },
      },
    });

    const metricDefs = [
      { key: 'ndvi', label: 'NDVI History', color: '#16a34a' },
      { key: 'ndre', label: 'NDRE History', color: '#2563eb' },
      { key: 'gndvi', label: 'GNDVI History', color: '#9333ea' },
      { key: 'waterIndex', label: 'Water Index History', color: '#0891b2' },
    ];

    const metricPngs = await Promise.all(
      metricDefs.map(c => fetchChartPng({
        type: 'line',
        data: {
          labels: metricLabels,
          datasets: [{ label: c.label, data: metricSeries.map(s => +s[c.key].toFixed(4)), borderColor: c.color, backgroundColor: c.color + '20', fill: true, tension: 0.3, pointRadius: 4 }],
        },
        options: {
          plugins: { title: { display: true, text: c.label }, legend: { display: false } },
          scales: { y: { beginAtZero: false } },
        },
      }))
    );

    const attachments = [
      { filename: 'grafik_spektal_raw.png', content: spectralChartPng },
      ...metricPngs.map((b64, i) => ({ filename: `${metricDefs[i].label.replace(/\s+/g, '_')}.png`, content: b64 })),
    ];

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Datahara <onboarding@resend.dev>',
      to: [to],
      subject: `[Datahara] Laporan ${plantName || 'Tanaman Padi'}`,
      html,
      attachments,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
