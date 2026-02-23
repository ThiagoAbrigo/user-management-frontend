export interface Participant {
  external_id: string;
  name: string;
  email: string;
  dni: string;
  age: number;
  estate: string;
  status: string;
  responsible_name?: string | null;
}