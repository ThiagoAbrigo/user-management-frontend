// services/auth.service.ts
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

      const userFromBackend = data.data;

      console.log("Usuario desde backend:", userFromBackend);

      const userData = {
        id: userFromBackend.id,
        external_id: userFromBackend.external_id,
        nombre: userFromBackend.name,
        email: userFromBackend.email,
        cedula: userFromBackend.dni,
        role: userFromBackend.role,
        status: userFromBackend.status,
        edad: userFromBackend.age,
        estate: userFromBackend.estate,
        address: userFromBackend.address,
        nombreResponsable: userFromBackend.nombreResponsable || '',
        dniResponsable: userFromBackend.dniResponsable || '',
        telefonoResponsable: userFromBackend.telefonoResponsable || '',
      };

      console.log("Datos mapeados a guardar:", userData);

      localStorage.setItem("user", JSON.stringify(userData));

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      return userData;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
};