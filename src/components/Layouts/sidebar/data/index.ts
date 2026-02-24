import { NavSection } from "@/types/auth";
import * as Icons from "../icons";
export const NAV_DATA: NavSection[] = [
  {
    label: "MENU PRINCIPAL",
    items: [
      {
        title: "Lista de Usuarios",
        icon: Icons.User,
        url: "/pages/participant",
        roles: ["ADMINISTRADOR"],
        items: [],
      },
      {
        title: "Registrar Usuario",
        icon: Icons.User,
        url: "/pages/participant/register",
        roles: ["ADMINISTRADOR"],
        items: [],
      },
      {
        title: "Carnetizacion",
        icon: Icons.User,
        url: "/pages/participant/carnet",
        roles: ["USUARIO"],
        items: [],
      },
    ],
  },
];
