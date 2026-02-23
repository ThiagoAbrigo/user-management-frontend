// auth.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authService = {
  async login(email: string, password: string) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Error al iniciar sesión");
      }
      localStorage.setItem("user", JSON.stringify(data.data));

      return data.data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },
};

// export function getCurrentUser() {
//   if (typeof window === "undefined") return null;
//   const user = localStorage.getItem("user");
//   return user ? JSON.parse(user) : null;
// }

// export function getUserRole(): "USUARIO" | "ADMINISTRADOR" | null {
//   const user = getCurrentUser();
//   return user?.role || null;
// }