"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  Clock,
  Package,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContractDetailData {
  id: number;
  numero: string;
  anio: number;
  tipo: string;
  tipoInvitacion: string;
  descripcion: string;
  entidad: string;
  estado: string;
  areaUsuaria: string;
  sigla: string;
  fechaPublicacion: string;
  etapas: Array<{
    nombre: string;
    inicio: string;
    fin: string;
  }>;
  items: Array<{
    codigo: string;
    nombre: string;
    descripcion: string;
    cantidad: number;
    unidadMedida: string;
    ubicacion: string;
    proveedor: string | null;
    precioTotal: number | null;
    estadoCotizacion: string | null;
  }>;
}

export function ContractDetail({
  detail,
}: {
  detail: ContractDetailData;
}) {
  const cotizacionEtapa = detail.etapas.find(
    (e) => e.nombre.toLowerCase().includes("cotiza")
  );

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{detail.numero}</CardTitle>
          <Badge>{detail.estado}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {detail.tipo} — {detail.tipoInvitacion}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Entidad */}
        <div className="flex items-center gap-2 text-sm">
          <Building2 className="size-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{detail.entidad}</span>
        </div>

        {/* Vigencia de cotización */}
        {cotizacionEtapa && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950 p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-700 dark:text-green-400 mb-1">
              <Clock className="size-4" />
              Vigencia de cotización
            </div>
            <p className="text-sm">
              {cotizacionEtapa.inicio} — {cotizacionEtapa.fin}
            </p>
          </div>
        )}

        {/* Items - lo esencial */}
        {detail.items.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-1">
              <Package className="size-4" />
              Productos / Servicios requeridos
            </h4>
            <div className="space-y-2">
              {detail.items.map((item, i) => (
                <div key={i} className="rounded-lg border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.nombre}</p>
                    <Badge variant="outline" className="shrink-0">
                      {item.cantidad} {item.unidadMedida}
                    </Badge>
                  </div>
                  {item.descripcion && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.descripcion}
                    </p>
                  )}
                  {item.precioTotal != null && (
                    <p className="text-sm font-semibold mt-1">
                      S/ {item.precioTotal.toLocaleString("es-PE")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Botón cotizar */}
        <Button asChild className="w-full" size="lg">
          <a
            href={`https://prod6.seace.gob.pe/s8uit-public/#/cotizacion/contrato/${detail.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-4 mr-2" />
            Ir a cotizar en SEACE
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
