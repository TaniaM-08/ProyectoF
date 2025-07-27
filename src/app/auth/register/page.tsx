"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error en el registro');
        return;
      }
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    } catch (err) {
      setError('Error en el registro');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleRegister} className="bg-[#181818] p-8 rounded-xl shadow-lg w-full max-w-md border border-[#232323]">
        <h2 className="text-2xl font-bold text-[#94C11F] mb-6 text-center">Crear Cuenta</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <input
          type="text"
          name="name"
          placeholder="Nombre completo*"
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico*"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña*"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="text"
          name="phone"
          placeholder="Teléfono"
          value={form.phone}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="text"
          name="address"
          placeholder="Dirección"
          value={form.address}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <button
          type="submit"
          className="w-full bg-[#94C11F] text-black font-semibold py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all"
        >
          Registrarse
        </button>
        <div className="text-gray-400 mt-4 text-center">
          ¿Ya tienes cuenta? <a href="/auth/login" className="text-[#94C11F] hover:underline">Inicia sesión</a>
        </div>
      </form>
    </div>
  );
}
