"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; password?: string; address?: string; phone?: string } | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setName(u.name || "");
      setEmail(u.email || "");
      setPassword(u.password || "");
      setAddress(u.address || "");
      setPhone(u.phone || "");
    } else {
      router.push("/auth/login");
    }
  }, [router]);

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  // Preparamos solo los campos que se van a actualizar
  const updates: Record<string, string> = {};

if (name && name !== user?.name) updates.name = name;

// Aseguramos que siempre se envíe un email válido
updates.email = email || user?.email || '';

if (password) updates.password = password;
if (address && address !== user?.address) updates.address = address;
if (phone && phone !== user?.phone) updates.phone = phone;


  if (Object.keys(updates).length === 0) {
    setMessage("No hiciste cambios");
    return;
  }

  try {
  const res = await fetch('/api/auth/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });

  const data = await res.json();
  console.log('Respuesta del backend:', data);

  if (!res.ok) {
    setMessage(data.error || 'Error al actualizar el perfil');
    return;
  }

  // Si se cambió la contraseña, cerrar sesión
  if (updates.password) {
    localStorage.removeItem("user");
    setUser(null);
    setMessage("Contraseña actualizada. Debes iniciar sesión nuevamente.");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  } else {
    const updated = data.user ?? { ...user, ...updates }; // Usa data.user si existe, si no mezcla
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
    setMessage("Datos actualizados");
    setTimeout(() => {
      router.push("/");
    }, 1500);
  }
} catch (error) {
  console.error("Error al actualizar perfil:", error);
  setMessage("Error al actualizar el perfil");
}

};


  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleSave} className="bg-[#181818] p-8 rounded-xl shadow-lg w-full max-w-md border border-[#232323]">
        <h2 className="text-2xl font-bold text-[#94C11F] mb-6 text-center">Editar Perfil</h2>
        {message && <div className="text-center mb-4 text-[#94C11F]">{message}</div>}
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="text"
          placeholder="Dirección"
          value={address}
          onChange={e => setAddress(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full mb-6 px-4 py-3 rounded-lg border border-[#232323] bg-black text-white focus:ring-2 focus:ring-[#94C11F] focus:border-[#94C11F]"
        />
        <button
          type="submit"
          className="w-full bg-[#94C11F] text-black font-semibold py-3 rounded-lg hover:bg-black hover:text-[#94C11F] border border-[#94C11F] transition-all"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
