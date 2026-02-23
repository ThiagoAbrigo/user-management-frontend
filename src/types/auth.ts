export interface AuthUser {
  external: string;
  stament: string;
  first_name: string;
  last_name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  photo?: string;
  token: string;
  phone?: string;
  address?: string;
}
export type Role = "USUARIO" | "ADMINISTRADOR";

export interface NavSubItem {
  title: string;
  url: string;
  roles?: Role[];
}

export interface NavItem {
  title: string;
  icon: any;
  url?: string;
  roles?: Role[];
  items: NavSubItem[];
}

export interface NavSection {
  label: string;
  items: NavItem[];
}
