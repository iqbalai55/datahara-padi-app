'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GiWheat } from 'react-icons/gi';
import { getPlants } from '@/app/utils/baseline';

export default function Home_Sampling() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    setPlants(getPlants());
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Data Sampling</h1>
        <div>
          {plants.map((plant) => (
            <Link href={`/sampling/${plant.id}`} key={plant.id}>
              <div
                className={`bg-white rounded-lg shadow-md p-6 cursor-pointer transition-all duration-300 mb-[32px] ${
                  hoveredCard === `sampling-${plant.id}` ? 'transform translate-x-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(`sampling-${plant.id}`)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Sampling {plant.name}</h2>
                    <p className="text-gray-600 capitalize mt-1">18 Channel Spektral</p>
                  </div>
                  <GiWheat className="w-10 h-10 text-green-600" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <Link href="/">
          <div
            className={`bg-purple-500 rounded-lg shadow-md p-4 cursor-pointer transition-transform duration-300 mb-8 ${
              hoveredCard === 'main' ? 'transform translate-x-2' : ''
            }`}
            onMouseEnter={() => setHoveredCard('main')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-center">
              <div className="text-center text-white text-xl font-semibold">Main</div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
