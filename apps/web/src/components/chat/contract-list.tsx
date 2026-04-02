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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground bg-slate-50 border border-slate-100 rounded-lg py-2 px-3">
          <span>
            Mostrando {contracts.length} de {pagination.total.toLocaleString()}{" "}
            resultados (página {pagination.page})
          </span>
          {(pagination.page * pagination.pageSize) < pagination.total && (
             <span className="font-medium text-slate-500 mt-1 sm:mt-0 italic">
               (Pide al chat "Siguiente página" para continuar navegando)
             </span>
          )}
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
