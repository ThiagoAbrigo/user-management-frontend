"use client";

import { Column, TableBase } from "@/components/Tables/tablebase";
import { Participant } from "@/types/participant";
import { useState } from "react";

interface ParticipantsTableProps {
  data: Participant[];
}

export function ParticipantsTable({ data }: ParticipantsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.dni.includes(searchTerm)
  );

  const isEmpty = filteredData.length === 0;

  const columns: Column<Participant>[] = [
    { header: "Nombre", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "DNI", accessor: "dni" },
    { header: "Edad", accessor: "age" },
    { header: "Estamento", accessor: "estate" },
    {
      header: "Responsable",
      accessor: (row) => row.responsible_name || "-",
    },
    { header: "Estado", accessor: "status" }, 
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4 rounded-xl border p-2">
        <input
          type="text"
          placeholder="Buscar por nombre o DNI"
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
        <TableBase
          columns={columns}
          data={filteredData}
          rowKey={(p) => p.external_id}
        />
      )}
    </div>
  );
}