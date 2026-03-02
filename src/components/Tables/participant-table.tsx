"use client";

import { Column, TableBase } from "@/components/Tables/tablebase";
import { Participant } from "@/types/participant";
import { useState } from "react";
import { UserProfileModal } from "@/components/UserProfileModal";

interface ParticipantsTableProps {
  data: Participant[];
}

export function ParticipantsTable({ data }: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (participant: Participant) => {
    setSelectedUserId(participant.external_id || participant.id);
    setIsModalOpen(true);
  };

  const filteredData = data.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.numeroIdentificacion.includes(searchTerm)
  );

  const isEmpty = filteredData.length === 0;

  const columns: Column<Participant>[] = [
    { header: "Número de identificación", accessor: "numeroIdentificacion" },
    { header: "Nombres", accessor: "nombre" },
    { header: "Apellidos", accessor: "apellido" },
    { 
      header: "Edad", 
      accessor: (row) => (
        <span className="font-medium">{row.edad} años</span>
      )
    },
    { header: "Rol", accessor: (row) => row.cuenta.rol },
    { 
      header: "Responsable", 
      accessor: (row) => {
        const rep = row.representante;
        if (!rep) return "-";
        return `${rep.nombre}${rep.apellido ? ' ' + rep.apellido : ''}`;
      } 
    },
    { 
      header: "Estado", 
      accessor: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          row.estado === "activo" 
            ? "bg-green-100 text-green-700" 
            : "bg-red-100 text-red-700"
        }`}>
          {row.estado === "activo" ? "Activo" : "Inactivo"}
        </span>
      )
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 rounded-xl border p-2">
        <input
          type="text"
          placeholder="Buscar por nombres, apellidos o número de identificación"
          className="w-full py-2 pl-3 text-sm outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-16 text-center">
          <p>No hay registros para mostrar</p>
        </div>
      ) : (
        <>
          <TableBase
            columns={columns}
            data={filteredData}
            rowKey={(p) => p.external_id}
            onRowClick={handleRowClick}
          />
          <UserProfileModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            userId={selectedUserId || ""}
          />
        </>
      )}
    </div>
  );
}