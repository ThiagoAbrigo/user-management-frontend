export interface Participant {
  id: number;
  nombre: string;
  apellido: string;
  numeroIdentificacion: string;
  edad: number;
  estado: string;
  cuenta: {
    correoElectronico: string;
    rol: string;
    estado: boolean; 
  };
  representante?: {
    nombre: string;
  } | null;
  external_id: string;
}