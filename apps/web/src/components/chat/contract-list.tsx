"use client";

import { ContractCard } from "./contract-card";

interface Contract {
  id: number;
  numero: string;
  tipo: string;
  descripcion: string;
  entidad: string;
  estado: string;
  fechaPublicacion: string;
  inicioCotizacion: string;
  finCotizacion: string;
  puedesCotizar: boolean;
}

interface ContractListProps {
  contracts: Contract[];
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
  };
  onViewDetail?: (id: number) => void;
}

export function ContractList({
  contracts,
  pagination,
  onViewDetail,
}: ContractListProps) {
  return (
    <div className="space-y-3">
      {pagination && (
        <div className="text-xs text-muted-foreground">
          Mostrando {contracts.length} de {pagination.total.toLocaleString()}{" "}
          resultados (página {pagination.page})
        </div>
      )}
      <div className="grid gap-3">
        {contracts.map((contract) => (
          <ContractCard
            key={contract.id}
            contract={contract}
            onViewDetail={onViewDetail}
          />
        ))}
      </div>
    </div>
  );
}
