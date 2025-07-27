"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState(null);
  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    address?: string;
    phone?: string;
  };
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Credenciales inválidas");
      return;
    }
    setAdmin(data.admin);
    // Redirigir al admin a la página de usuarios
    router.push("/admin/users");
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="bg-[#181818] p-8 rounded-xl shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold text-[#94C11F] mb-6 text-center">Acceso Administrador</h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <input
            type="email"
            placeholder="Correo administrador"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white"
            required
          />
          <button type="submit" className="w-full bg-[#94C11F] text-black font-semibold py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  // ...no render, redirige a /admin/users
}
