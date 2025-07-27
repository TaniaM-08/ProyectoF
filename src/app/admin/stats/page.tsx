'use client';

import React, { useEffect, useState } from 'react';
import {
  Bar,
  Pie,
  Doughnut,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tipoVista, setTipoVista] = useState<'productos' | 'servicios' | 'plagas'>('productos');

  const fetchStats = () => {
    setLoading(true);
    fetch('/api/admin/chatstats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <div className="p-10">Cargando estadísticas...</div>;
  if (!stats) return <div className="p-10">No hay datos.</div>;

  const productosData = {
    labels: stats.productosTop.map((p: any) => p.name),
    datasets: [
      {
        label: 'Productos más buscados',
        data: stats.productosTop.map((p: any) => p.count),
        backgroundColor: ['#94C11F', '#4C6F0E', '#FFB347', '#FF6961', '#6A9C13', '#4B8BBE', '#FFD700', '#FF69B4', '#20B2AA', '#FF6347'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const serviciosData = {
    labels: stats.serviciosTop.map((s: any) => s.name),
    datasets: [
      {
        label: 'Servicios más solicitados',
        data: stats.serviciosTop.map((s: any) => s.count),
        backgroundColor: ['#FFB347', '#94C11F', '#4C6F0E', '#FF6961', '#6A9C13', '#4B8BBE', '#FFD700', '#FF69B4', '#20B2AA', '#FF6347'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const plagasData = {
    labels: stats.plagasTop.map((p: any) => p.name),
    datasets: [
      {
        label: 'Plagas más mencionadas',
        data: stats.plagasTop.map((p: any) => p.count),
        backgroundColor: ['#FF6961', '#94C11F', '#4C6F0E', '#FFB347', '#6A9C13', '#4B8BBE', '#FFD700', '#FF69B4', '#20B2AA', '#FF6347'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen w-full pt-20 px-45 mt-22">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <h2 className="text-4xl font-extrabold text-[#94C11F]">Estadísticas del Chatbot</h2>
        <div className="flex flex-wrap items-center gap-4 bg-white rounded-2xl shadow-md p-6">
          <button onClick={fetchStats} className="bg-[#94C11F] text-black font-semibold px-4 py-2 rounded hover:bg-black hover:text-[#94C11F] transition">
            Actualizar datos
          </button>
          <select value={tipoVista} onChange={e => setTipoVista(e.target.value as any)} className="border px-3 py-2 rounded text-sm text-gray-700">
            <option value="productos">Productos</option>
            <option value="servicios">Servicios</option>
            <option value="plagas">Plagas</option>
          </select>
        </div>
      </div>

      {tipoVista === 'productos' && (
        <div className="flex flex-col md:flex-row items-center justify-between rounded-2xl shadow-md p-6 max-w-5xl mx-auto mt-20">
          <div className="flex-1">
            <h3 className="text-4xl font-bold text-[#94C11F] mb-2 ml-10">Productos más buscados</h3>
            <p className="text-gray-600 text-sm ml-10">Top 10 productos consultados por los usuarios.</p>
          </div>
          <div className="flex-1 flex justify-end">
            <Bar data={productosData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
      )}

      {tipoVista === 'servicios' && (
        <div className="flex flex-col md:flex-row items-center justify-between rounded-2xl shadow-md p-6 max-w-3xl mx-auto mt-5">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#FFB347] mb-2 ml-10">Servicios más solicitados</h3>
            <p className="text-gray-600 text-sm ml-10">Top servicios agendados en el sistema.</p>
          </div>
          <div className="flex-1 flex justify-end">
            <Pie data={serviciosData} options={{ plugins: { legend: { position: 'right' } }, cutout: '70%' }} width={180} height={180} />
          </div>
        </div>
      )}

      {tipoVista === 'plagas' && (
        <div className="flex flex-col md:flex-row items-center justify-between rounded-2xl shadow-md p-6 max-w-3xl mx-auto mt-">
          <div className="flex-1">
            <h3 className="text-2xl ml-10 font-bold text-[#FF6961] mb-2">Plagas más mencionadas</h3>
            <p className="text-gray-600 text-sm ml-10">Plagas detectadas en citas y consultas.</p>
          </div>
          <div className="flex-1 flex justify-end">
            <Doughnut data={plagasData} options={{ plugins: { legend: { position: 'right' } }, cutout: '70%' }} width={180} height={180} />
          </div>
        </div>
      )}
    </div>
  );
}
