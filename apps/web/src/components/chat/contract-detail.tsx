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
  Layers,
  MapPin,
  Package,
  Users,
} from "lucide-react";

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
  return (
    <Card className="gap-4 py-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">{detail.numero}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              {detail.tipo} — {detail.tipoInvitacion}
            </p>
          </div>
          <Badge>{detail.estado}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{detail.descripcion}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2">
            <Building2 className="size-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Entidad</p>
              <p className="font-medium">{detail.entidad}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="size-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Área Usuaria</p>
              <p className="font-medium">{detail.areaUsuaria}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Calendar className="size-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Publicación</p>
              <p className="font-medium">{detail.fechaPublicacion}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Layers className="size-4 mt-0.5 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Año</p>
              <p className="font-medium">{detail.anio}</p>
            </div>
          </div>
        </div>

        {detail.etapas.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Etapas</h4>
            <div className="space-y-2">
              {detail.etapas.map((etapa, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <span className="font-medium">{etapa.nombre}</span>
                  <span className="text-xs text-muted-foreground">
                    {etapa.inicio} — {etapa.fin}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {detail.items.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Ítems</h4>
            <div className="space-y-2">
              {detail.items.map((item, i) => (
                <div key={i} className="rounded-lg border p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{item.nombre}</p>
                    <Badge variant="outline" className="shrink-0">
                      {item.cantidad} {item.unidadMedida}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.descripcion}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {item.ubicacion}
                    </span>
                    <span className="flex items-center gap-1">
                      <Package className="size-3" />
                      {item.codigo}
                    </span>
                  </div>
                  {item.precioTotal && (
                    <p className="text-sm font-semibold">
                      S/ {item.precioTotal.toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
