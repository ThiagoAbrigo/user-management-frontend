"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { authService } from "@/services/auth.service";

export default function SigninWithPassword() {
  const router = useRouter();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const user = await authService.login(data.email, data.password);
      
      // Pequeño delay para asegurar que la cookie se estableció
      setTimeout(() => {
        if (user.role === "ADMINISTRADOR") {
          router.push("/pages/participant");
        } else if (user.role === "USUARIO") {
          router.push("/pages/participant/carnet");
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "Credenciales inválidas. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      <InputGroup
        type="email"
        label=""
        className="mb-4 [&_input]:border-gray-300 [&_input]:bg-white [&_input]:py-[15px] [&_input]:text-gray-900 [&_input]:placeholder-gray-400 focus:[&_input]:border-indigo-500 dark:[&_input]:border-gray-700 dark:[&_input]:bg-gray-900 dark:[&_input]:text-white dark:[&_input]:placeholder-gray-500"
        placeholder="Ingrese su email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon />}
      />

      <InputGroup
        type="password"
        label=""
        className="mb-5 [&_input]:border-gray-300 [&_input]:bg-white [&_input]:py-[15px] [&_input]:text-gray-900 [&_input]:placeholder-gray-400 focus:[&_input]:border-indigo-500 dark:[&_input]:border-gray-700 dark:[&_input]:bg-gray-900 dark:[&_input]:text-white dark:[&_input]:placeholder-gray-500"
        placeholder="Ingrese su contraseña"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon />}
      />

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 p-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Iniciando sesión..." : "Ingresar"}
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>
      </div>
    </form>
  );
}