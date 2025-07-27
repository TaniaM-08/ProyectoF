'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Completa todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirección según rol
      const redirectTo = data.user.role === "ADMIN" ? "/admin/users" : "/";
      router.replace(redirectTo);
    } catch (err) {
      setError("Error al iniciar sesión. Verifica tu conexión.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0f0f0f] to-black px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#181818] p-8 rounded-2xl shadow-2xl w-full max-w-md border border-[#232323] animate-fade-in"
      >
        <h2 className="text-3xl font-extrabold text-[#94C11F] mb-8 text-center tracking-tight">
          Iniciar Sesión
        </h2>

        {error && (
          <div className="text-red-500 mb-6 text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <div className="relative mb-5">
          <label htmlFor="email" className="sr-only">Correo electrónico</label>
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94C11F] w-5 h-5" />
          <input
            id="email"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F] placeholder-gray-500"
          />
        </div>

        <div className="relative mb-8">
          <label htmlFor="password" className="sr-only">Contraseña</label>
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#94C11F] w-5 h-5" />
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F] placeholder-gray-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#94C11F] text-black font-bold py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all duration-300"
        >
          Iniciar Sesión
        </button>

        <div className="text-gray-400 mt-6 text-center text-sm">
          ¿No tienes cuenta?{" "}
          <a
            href="/auth/register"
            className="text-[#94C11F] hover:underline font-medium"
          >
            Regístrate
          </a>
        </div>
      </form>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
          75% { transform: translateX(-5px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
