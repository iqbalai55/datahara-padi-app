'use client'

import { useState } from 'react';
import Link from 'next/link';
import { GiWheat } from 'react-icons/gi';

const guides = [
  { link: 'padi', name: 'Panduan Padi', description: 'Indeks Spektral & Analisis Stres' },
  { link: 'cara-sampling', name: 'Cara Sampling & Interpretasi Level', description: 'Tata Cara Pengambilan Sample & Penjelasan Level' }
];

export default function Home_Panduan() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Panduan</h1>
        <div>
          {guides.map((guide) => (
            <Link href={`/panduan/${guide.link}`} key={guide.link}>
              <div
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 mb-[32px] ${
                  hoveredCard === guide.link ? 'transform translate-x-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(guide.link)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{guide.name}</h2>
                    <p className="text-gray-600 capitalize mt-1">{guide.description}</p>
                  </div>
                  <GiWheat className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/">
          <div
            className={`bg-purple-500 rounded-lg shadow-md p-6 cursor-pointer transition-transform duration-300 mb-8 ${
              hoveredCard === 'main' ? 'transform translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredCard('main')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-xl font-semibold">
                Main
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
