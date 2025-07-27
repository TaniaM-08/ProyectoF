"use client";

import React, { useEffect, useState } from 'react';
import { Users, BarChart2, ShoppingCart } from 'lucide-react';

export default function AdminUsersPage() {
  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    address?: string;
    phone?: string;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/admin');
      const data = await res.json();
      setUsers(data.users);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 bg-white">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-6xl mx-auto p-8 relative">
        <div className="relative flex mt-15 items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-[#94C11F] flex items-center gap-3">
            <Users className="w-8 h-8 text-[#94C11F]" />
            Usuarios Registrados
          </h1>

          <div className="flex gap-6 justify-end">
            <a
              href="/admin/orders"
              className="flex items-center gap-2 bg-[#94C11F] text-black px-4 py-2 rounded-lg font-semibold border border-[#94C11F] hover:bg-black hover:text-[#94C11F] transition"
            >
              <ShoppingCart className="w-5 h-5" />
              Ver compras
            </a>
            <a
              href="/admin/stats"
              className="flex items-center gap-2 bg-white text-[#94C11F] px-4 py-2 rounded-lg font-semibold border border-[#94C11F] hover:bg-[#94C11F] hover:text-black transition"
            >
              <BarChart2 className="w-5 h-5" />
              Ver estadísticas
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-gray-800 border-separate border-spacing-y-2">
            <thead className="bg-[#f0f9e3] text-[#5d8000] text-left">
              <tr>
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Nombre</th>
                <th className="p-3 font-semibold">Correo</th>
                <th className="p-3 font-semibold">Rol</th>
                <th className="p-3 font-semibold">Dirección</th>
                <th className="p-3 font-semibold">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr
                  key={u.id}
                  className="hover:bg-[#f9fdf4] transition rounded-xl"
                >
                  <td className="p-3">{u.id}</td>
                  <td className="p-3 font-medium">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">{u.address || '-'}</td>
                  <td className="p-3">{u.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center text-gray-500 mt-6">
              No hay usuarios registrados.
            </div>
          )}
        </div>
      </div>
    </main>

  );
}
