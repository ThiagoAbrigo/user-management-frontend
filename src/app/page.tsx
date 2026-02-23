
import type { Metadata } from "next";
import SigninWithPassword from "@/components/Auth/SigninWithPassword";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-8 py-10 shadow-xl">

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Ingresa tus credenciales para continuar
            </p>
          </div>
          <SigninWithPassword />
        </div>
      </div>
    </div>
  )
}

