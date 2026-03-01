import { UpdateProfileData } from "@/types/perfil";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const perfilService = {
  async getProfile(external_id: string) {
    try {
      const response = await fetch(`${API_URL}/profile?external_id=${external_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return Promise.reject(data);
      }

      return data;
    } catch (err) {
      return Promise.reject({ error: "Error al obtener el perfil" });
    }
  },

  async updateProfile(external_id: string, profileData: UpdateProfileData) {
    try {
      console.log('Service - Enviando:', profileData);
      const response = await fetch(`${API_URL}/perfil/${external_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      console.log('Service - Respuesta:', data);

      if (!response.ok) {
        console.log('Service - Error response:', data);
        return Promise.reject(data);
      }

      return data;
    } catch (err) {
      return Promise.reject({ error: "Error al actualizar el perfil" });
    }
  },
};