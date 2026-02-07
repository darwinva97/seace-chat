"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, ExternalLink, FileText, MapPin } from "lucide-react";

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

function getEstadoVariant(
  estado: string
): "default" | "secondary" | "destructive" | "outline" {
  switch (estado) {
    case "Vigente":
      return "default";
    case "En Evaluación":
      return "secondary";
    case "Culminado":
      return "outline";
    default:
      return "secondary";
  }
}

function getTipoIcon(tipo: string) {
  switch (tipo) {
    case "Servicio":
      return "S";
    case "Bien":
      return "B";
    case "Obra":
      return "O";
    case "Consultoría de Obra":
      return "CO";
    default:
      return "?";
  }
}

export function ContractCard({
  contract,
  onViewDetail,
}: {
  contract: Contract;
  onViewDetail?: (id: number) => void;
}) {
  return (
    <Card className="gap-3 py-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">
              {getTipoIcon(contract.tipo)}
            </div>
            <div>
              <CardTitle className="text-sm">{contract.numero}</CardTitle>
              <CardDescription className="text-xs">
                {contract.tipo}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={getEstadoVariant(contract.estado)}>
              {contract.estado}
            </Badge>
            {contract.puedesCotizar && (
              <Badge
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Cotizable
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pb-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {contract.descripcion}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Building2 className="size-3" />
            {contract.entidad}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {contract.fechaPublicacion}
          </span>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-medium">Cotización:</span>{" "}
          {contract.inicioCotizacion} — {contract.finCotizacion}
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        {onViewDetail && (
          <button
            onClick={() => onViewDetail(contract.id)}
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            <FileText className="size-3" />
            Ver detalle
          </button>
        )}
        {contract.puedesCotizar && (
          <a
            href={`https://prod6.seace.gob.pe/s8uit-public/#/cotizacion/contrato/${contract.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
          >
            <ExternalLink className="size-3" />
            Cotizar
          </a>
        )}
      </CardFooter>
    </Card>
  );
}
