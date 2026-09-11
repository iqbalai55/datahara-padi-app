"use client"

import Link from 'next/link';
import { GiWheat } from 'react-icons/gi';
import { useState, useEffect } from 'react';

import { getPlants } from './utils/baseline';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    setPlants(getPlants());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Daftar Lokasi Kebun</h1>
        <div>
          {plants.map((plant) => (
            <Link href={`/kebun/${plant.id}`} key={plant.id}>
              <div
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 mb-[32px] ${
                  hoveredCard === `padi-${plant.id}` ? 'transform translate-x-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(`padi-${plant.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{plant.name}</h2>
                  </div>
                  <GiWheat className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/sampling">
          <div
            className={`bg-purple-500 rounded-lg shadow-md p-4 cursor-pointer transition-transform duration-300 mb-4 ${
              hoveredCard === 'sampling' ? 'transform translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredCard('sampling')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-xl font-semibold">Sampling Page</div>
            </div>
          </div>
        </Link>
        <Link href="/panduan">
          <div
            className={`bg-green-600 rounded-lg shadow-md p-4 cursor-pointer transition-transform duration-300 mb-4 ${
              hoveredCard === 'panduan' ? 'transform translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredCard('panduan')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-xl font-semibold">Panduan</div>
            </div>
          </div>
        </Link>
        <Link href="/settings">
          <div
            className={`bg-gray-600 rounded-lg shadow-md p-4 cursor-pointer transition-transform duration-300 mb-8 ${
              hoveredCard === 'settings' ? 'transform translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredCard('settings')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-xl font-semibold">Pengaturan</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
