const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const userService = {

  async getAll() {
    try {
      const res = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async createUser(userData: Record<string, any>) {
    try {
      const response = await fetch(`${API_URL}/save-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            data: data,
            status: response.status
          }
        };
      }

      return data;
    } catch (error) {
      console.error("Error creando usuario:", error);
      throw error;
    }
  },

  async getRoles() {
    try {
      const res = await fetch(`${API_URL}/role`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error("Error al obtener los roles");
      }
  
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async getResponsibleByDni(dni: string) {
    try {
      const res = await fetch(`${API_URL}/responsibles/${dni}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (res.status === 404) {
        return null;
      }

      if (!res.ok) {
        throw new Error("Error al buscar el responsable");
      }

      const data = await res.json();
      return data;
    } catch (error: unknown) {
      console.error("Error en getResponsibleByDni:", error);
      return null;
    }
  },
  async updateUser(externalId: string, data: any) {
    try {
      const response = await fetch(
        `${API_URL}/participants/${externalId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return Promise.reject({
          msg: result.msg || "Error al actualizar usuario",
          errors: result.errors || {}
        });
      }

      return result;

    } catch (error: any) {
      if (error.errors) throw error;
      console.error("Error en updateUser:", error);
      throw { msg: "Error de conexión con el servidor", errors: {} };
    }
  }
};
