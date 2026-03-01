// services/auth.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const authService = {
    async login(correoElectronico: string, contrasenia: string) {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correoElectronico, contrasenia }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        // Retornamos directamente el error del backend
        // En vez de usar "new Error", dejamos pasar la info
        return Promise.reject(data);
      }
  
      return data; // Login exitoso
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