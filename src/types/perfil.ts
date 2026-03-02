// types/perfil.types.ts
export interface UpdateProfileData {
    cuenta?: {
      correoElectronico?: string;
    };
    usuario?: {
      nombre?: string;
      apellido?: string;
      numeroIdentificacion?: string;
      fechaNacimiento?: string;
    };
    perfil?: {
      celular?: string;
      portafolio?: string[];
      redesSociales?: string[];
      habilidades?: string[];
      descripcion?: string;
      direccion?: string;
    };
    representante?: {
      nombre?: string;
      apellido?: string;
      celular?: string;
      numeroIdentificacion?: string;
    };
  }