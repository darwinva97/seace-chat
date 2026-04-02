"use client";

import { useState, useEffect } from "react";
import {
  X,
  FileText,
  Calendar,
  Building2,
  Clock,
  Package,
  FileDown,
  ArrowLeft,
  Printer,
  ChevronRight,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ContractDetailModalProps {
  contractId: number;
  contractNumero: string;
  onClose: () => void;
}

export function ContractDetailModal({
  contractId,
  contractNumero,
  onClose
}: ContractDetailModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/seace-contract?action=get-detail&id_contrato=${contractId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) {
          setError(json.error);
        } else {
          setData(json);
        }
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [contractId]);

  const contrato = data?.completo?.contrato || {};
  const etapas = data?.completo?.lsEtapaCronograma || [];
  const cuis = data?.completo?.lsInvierte || [];
  const items = data?.completo?.lsContratoItem || [];
  const archivos = data?.archivos || [];

  const getEtapa = (nom: string) =>
    etapas.find((e: any) => e.desEtapa?.toLowerCase().includes(nom.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">

        {/* ── Header ── */}
        <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Detalle de la contratación
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-tight mt-1">
              {contrato.nomEntidad || "CARGANDO ENTIDAD..."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-slate-100 text-slate-500 size-8 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto bg-slate-50/30 p-6 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-3 text-blue-600 animate-pulse">
              <Info className="size-12" />
              <div className="text-sm font-semibold">Consultando repositorio técnico de SEACE...</div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm font-medium">
              {error}
            </div>
          ) : (
            <>
              {/* Información General */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Info className="size-4 text-blue-600" /> Información General
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Nro. Contratación</label>
                    <p className="text-sm font-bold text-slate-700">{contrato.desNroContratacion || contractNumero}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Objeto</label>
                    <p className="text-sm font-semibold text-slate-700">{contrato.descBien || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Área Usuaria</label>
                    <p className="text-sm text-slate-600">{contrato.nomUnidadEjecutora || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha de Publicación</label>
                    <p className="text-sm text-slate-600">{contrato.fecPublicacion || "-"}</p>
                  </div>
                </div>
              </section>

              {/* Cronograma */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Calendar className="size-4 text-blue-600" /> Cronograma
                </div>
                <div className="p-4">
                  <div className="border rounded-lg overflow-hidden bg-slate-50/50">
                    <div className="grid grid-cols-3 text-[10px] font-bold text-slate-500 bg-white border-b px-4 py-2 uppercase tracking-wide">
                      <div className="col-span-1">Etapa</div>
                      <div>Fecha y hora Inicio</div>
                      <div>Fecha y hora Fin</div>
                    </div>
                    <div className="flex flex-col divide-y divide-slate-100">
                      {[
                        { label: "Consulta", stage: getEtapa("Consulta") },
                        { label: "Cotización", stage: getEtapa("Cotiza") }
                      ].map((item, idx) => (
                        <div key={idx} className="grid grid-cols-3 px-4 py-3 text-sm items-center hover:bg-white transition-colors">
                          <div className="font-bold text-slate-700">{item.label}</div>
                          <div className="text-slate-600">{item.stage?.fecEtapaInicio || "-"}</div>
                          <div className="text-slate-600">{item.stage?.fecEtapaFin || "-"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* CUI */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Building2 className="size-4 text-blue-600" /> Listado de código único de inversión
                </div>
                <div className="min-h-[100px]">
                  <div className="w-full text-xs overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#005CAD] text-white">
                        <tr>
                          <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">N°</th>
                          <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">CUI</th>
                          <th className="px-4 py-2 text-left font-semibold">Descripción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {cuis.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-400 italic bg-white">
                              <div className="flex flex-col items-center gap-2">
                                <div className="size-8 rounded-full bg-slate-50 flex items-center justify-center">🔍</div>
                                No se encontraron datos
                              </div>
                            </td>
                          </tr>
                        ) : (
                          cuis.map((c: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-4 py-2 text-slate-600 border-r">{i + 1}</td>
                              <td className="px-4 py-2 font-mono text-blue-700 border-r">{c.codUnicoInversion}</td>
                              <td className="px-4 py-2 text-slate-700">{c.desInversion || "-"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Requerimientos (Archivos) */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <FileText className="size-4 text-blue-600" /> Requerimientos
                </div>
                <div className="p-4 space-y-2">
                  {archivos.length === 0 ? (
                    <p className="text-sm text-slate-400 italic">No hay archivos vinculados.</p>
                  ) : (
                    archivos.map((file: any, i: number) => {
                      const fileName = file.nombre || file.nomArchivo || "Archivo";
                      const idArchivo = file.idContratoArchivo || file.idArchivo;
                      const sizeStr = file.tamanio ? `(${(parseInt(file.tamanio) / (1024 * 1024)).toFixed(2)} MB)` : "";
                      
                      return (
                        <a 
                          key={i}
                          href={`/api/seace-contract?action=download-file&id_archivo=${idArchivo}&id_contrato=${contractId}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-all bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded bg-red-50 flex items-center justify-center text-red-500 border border-red-100 group-hover:scale-110 transition-transform">
                              <FileText className="size-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">
                                {sizeStr} {fileName}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {file.nombreTipoArchivo || file.desDescripcion || "TDR / Especificaciones Técnicas"}
                              </p>
                            </div>
                          </div>
                          <FileDown className="size-4 text-slate-300 group-hover:text-blue-500" />
                        </a>
                      );
                    })
                  )}
                </div>
              </section>

              {/* Items registrados */}
              <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                <div className="px-4 py-2 border-b bg-slate-50/50 flex items-center gap-2 text-slate-700 font-bold text-sm">
                  <Package className="size-4 text-blue-600" /> Ítems registrados
                </div>
                <div className="w-full text-xs overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#005CAD] text-white">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">N°</th>
                        <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">CUBSO</th>
                        <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">Descripción del CUBSO</th>
                        <th className="px-4 py-2 text-center font-semibold">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-slate-400 bg-white italic">
                            No se encontraron ítems registrados.
                          </td>
                        </tr>
                      ) : (
                        items.map((it: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50">
                            <td className="px-4 py-2 text-slate-600 border-r">{i + 1}</td>
                            <td className="px-4 py-2 border-r font-mono text-slate-700">{it.codCubso || "-"}</td>
                            <td className="px-4 py-2 border-r text-slate-700">{it.descripcionItem || it.descBien || "-"}</td>
                            <td className="px-4 py-2 text-center text-slate-700 font-bold bg-slate-50/50">{it.cantidad || "-"}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="size-4" /> Atrás
          </button>
          <button
            onClick={() => window.print()}
            className="px-5 py-2 rounded-lg bg-[#005CAD] text-white font-bold text-sm hover:bg-[#004a8d] flex items-center gap-2 shadow-lg shadow-blue-200 transition-all"
          >
            <Printer className="size-4" /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
}
