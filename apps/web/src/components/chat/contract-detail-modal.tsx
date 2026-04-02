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
  Info,
  CheckCircle2,
  History,
  TrendingUp,
  AlertCircle
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

  const contrato = data?.completo?.uitContratoCompletoProjection || data?.completo?.contrato || {};
  const etapas = data?.completo?.uitContratoEtapaProjectionList || data?.completo?.lsEtapaCronograma || [];
  const cuis = data?.completo?.uitContratoInvierteProjectionList || data?.completo?.lsInvierte || [];
  const items = data?.completo?.uitContratoItemProjectionList || data?.completo?.lsContratoItem || [];
  const archivos = data?.archivos || [];

  const getEtapa = (nom: string) =>
    etapas.find((e: any) => 
      (e.desEtapa || e.nomEtapaContrato || "").toLowerCase().includes(nom.toLowerCase())
    );

  // Helper para mapear fechas de etapas que cambian entre servicios
  const getEtapaDates = (stage: any) => {
    if (!stage) return { inicio: "-", fin: "-" };
    return {
      inicio: stage.fecEtapaInicio || stage.fecIni || "-",
      fin: stage.fecEtapaFin || stage.fecFin || "-"
    };
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200">

        {/* ── Header ── */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex justify-between items-center bg-white">
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
                    <p className="text-sm font-bold text-slate-700">{contrato.desNroContratacion || contrato.nroDescripcion || contractNumero}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Objeto / Descripción</label>
                    <p className="text-sm font-semibold text-slate-700 leading-tight">
                        {contrato.desContratacion || contrato.desObjetoContrato || contrato.descBien || "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Área Usuaria / Sigla</label>
                    <p className="text-sm text-slate-600 leading-tight">{contrato.nomAreaUsuaria || contrato.nomSigla || contrato.nomUnidadEjecutora || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Fecha de Publicación</label>
                    <p className="text-sm text-slate-600">{contrato.fecPublicacion || contrato.fecPublica || "-"}</p>
                  </div>
                  <div className="button-group flex flex-row gap-2 mt-2">
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Sistema de Contratación</label>
                      <p className="text-[11px] text-slate-500">{contrato.nomSistemaContratacion || "-"}</p>
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Modalidad</label>
                      <p className="text-[11px] text-slate-500">{contrato.nomModalidad || "-"}</p>
                    </div>
                    <div className="space-y-1 flex-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Tipo de Selección</label>
                      <p className="text-[11px] text-slate-500">{contrato.nomTipoSeleccion || "-"}</p>
                    </div>
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
                        { label: "Consulta de Requerimiento", stage: getEtapa("Consulta"), icon: History },
                        { label: "Etapa de Cotización", stage: getEtapa("Cotiza"), icon: TrendingUp },
                        { label: "Selección de Proveedor", stage: getEtapa("Selección"), icon: CheckCircle2 }
                      ].map((item, idx) => {
                        const isCurrent = item.stage?.nomEstadoEtapa === 'VIGENTE';
                        const dates = getEtapaDates(item.stage);
                        return (
                          <div key={idx} className={`grid grid-cols-1 sm:grid-cols-3 px-4 py-3 text-sm items-center transition-colors ${isCurrent ? 'bg-blue-50/50' : 'hover:bg-white'}`}>
                            <div className="flex items-center gap-2">
                               <item.icon className={`size-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`} />
                               <span className={`font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-700'}`}>{item.label}</span>
                            </div>
                            <div className="text-slate-600 flex items-center gap-1">
                               <span className="sm:hidden text-[10px] font-bold text-slate-400">INICIO:</span>
                               {dates.inicio}
                            </div>
                            <div className="text-slate-600 flex items-center gap-1">
                               <span className="sm:hidden text-[10px] font-bold text-slate-400">FIN:</span>
                               {dates.fin}
                            </div>
                          </div>
                        );
                      })}
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
                  <div className="w-full text-[10px] sm:text-xs overflow-x-auto">
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
                     <div className="flex flex-col items-center py-6 text-slate-400">
                        <AlertCircle className="size-8 opacity-20 mb-2" />
                        <p className="text-sm italic">No hay archivos vinculados en esta etapa.</p>
                     </div>
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

               {/* Requerimientos Técnicos Mínimos (RTM) */}
               <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                 <div className="px-4 py-2 border-b bg-amber-50/50 flex items-center gap-2 text-amber-800 font-bold text-sm">
                   <Package className="size-4 text-amber-600" /> Requerimientos Técnicos (RTM)
                 </div>
                 <div className="w-full text-[10px] sm:text-xs overflow-x-auto">
                    {(data?.completo?.lsContratoRtm?.length || 0) === 0 ? (
                       <div className="p-8 text-center text-slate-400 italic">No se detallan RTMs específicos en formato de tabla. Verifique los documentos adjuntos.</div>
                    ) : (
                      <table className="w-full">
                        <thead className="bg-[#005CAD] text-white">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">N°</th>
                            <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">Descripción del Requerimiento</th>
                            <th className="px-4 py-2 text-center font-semibold">Valor Referencial</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {data.completo.lsContratoRtm.map((rtm: any, i: number) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="px-4 py-2 text-slate-600 border-r">{i + 1}</td>
                              <td className="px-4 py-2 border-r text-slate-700">{rtm.desRtm || rtm.nomRtm || "-"}</td>
                              <td className="px-4 py-2 text-center text-slate-500">{rtm.valor || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
                        <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">Descripción</th>
                        <th className="px-4 py-2 text-center font-semibold border-r border-blue-400/30">Cant.</th>
                        <th className="px-4 py-2 text-center font-semibold border-r border-blue-400/30">Unidad</th>
                        <th className="px-4 py-2 text-center font-semibold border-r border-blue-400/30">Moneda</th>
                        <th className="px-4 py-2 text-center font-semibold border-r border-blue-400/30">Lugar</th>
                        <th className="px-4 py-2 text-center font-semibold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-4 py-8 text-center text-slate-400 bg-white italic">
                            No se encontraron ítems registrados.
                          </td>
                        </tr>
                      ) : (
                        items.map((it: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2 text-slate-600 border-r text-center">{i + 1}</td>
                            <td className="px-4 py-2 border-r font-mono text-slate-700">{it.codCubso || "-"}</td>
                            <td className="px-4 py-2 border-r text-slate-700 leading-tight">{it.descripcionItem || it.nomCubso || it.descBien || "-"}</td>
                            <td className="px-4 py-2 border-r text-center text-slate-700 font-bold bg-slate-50/30">{it.cantidad || "-"}</td>
                            <td className="px-4 py-2 border-r text-center text-slate-500 uppercase">{it.nomUnidadMedida || it.siglaUM || it.unidadMedida || "-"}</td>
                            <td className="px-4 py-2 border-r text-center text-slate-500">{it.siglaMoneda || it.moneda || "SOLES"}</td>
                            <td className="px-4 py-2 border-r text-[10px] text-slate-500 max-w-[120px] leading-none uppercase">
                              {it.nomDistritoExt || (it.nomDepartamento ? `${it.nomDepartamento}/${it.nomProvincia}/${it.nomDistrito}` : "-")}
                            </td>
                            <td className="px-4 py-2 text-center">
                               <Badge variant="outline" className={`text-[9px] uppercase ${it.nomEstadoItem === 'DESIERTO' ? 'text-red-500 border-red-200' : 'text-slate-500'}`}>
                                  {it.nomEstadoItem || it.nomEstadoContrato || "VIGENTE"}
                               </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Resultado de la contratación (Si existe) */}
              {(contrato.nomEstadoContrato === 'ADJUDICADO' || items.some((it: any) => it.nomEstadoItem === 'DESIERTO' || it.nomEstadoItem === 'ADJUDICADO')) && (
                 <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4 animate-in fade-in slide-in-from-bottom-4">
                   <div className="px-4 py-2 border-b bg-green-50/50 flex items-center gap-2 text-green-800 font-bold text-sm">
                     <CheckCircle2 className="size-4 text-green-600" /> Resultado de la contratación
                   </div>
                   <div className="w-full text-[10px] sm:text-xs overflow-x-auto">
                     <table className="w-full">
                       <thead className="bg-[#005CAD] text-white">
                         <tr>
                           <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">N°</th>
                           <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">CUBSO</th>
                           <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">RUC</th>
                           <th className="px-4 py-2 text-left font-semibold border-r border-blue-400/30">Proveedor</th>
                           <th className="px-4 py-2 text-right font-semibold border-r border-blue-400/30">Oferta Total</th>
                           <th className="px-4 py-2 text-center font-semibold">Estado</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-200">
                         {items.map((it: any, i: number) => (
                           <tr key={i} className="hover:bg-slate-50">
                             <td className="px-4 py-2 text-slate-600 border-r">{i + 1}</td>
                             <td className="px-4 py-2 border-r font-mono text-slate-700">{it.codCubso || "-"}</td>
                             <td className="px-4 py-2 border-r text-slate-700 font-mono tracking-tighter">
                                {it.rucAdjudicado || it.numRuc || "-"}
                             </td>
                             <td className="px-4 py-2 border-r text-slate-700 uppercase leading-none">
                                {it.proveedorAdjudicado || it.nomRazonSocial || (it.nomEstadoItem === 'DESIERTO' ? 'SIN ADJUDICAR' : '-')}
                             </td>
                             <td className="px-4 py-2 border-r text-right font-bold text-slate-700">
                                {it.montoAdjudicado ? `${it.siglaMoneda || 'S/'} ${it.montoAdjudicado.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : "-"}
                             </td>
                             <td className="px-4 py-2 text-center">
                                <Badge className={it.nomEstadoItem === 'DESIERTO' ? 'bg-red-500' : 'bg-green-600'}>
                                   {it.nomEstadoItem || "-"}
                                </Badge>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                 </section>
              )}

              {/* Consultas y Observaciones (lsPreguntaConsulta) */}
              {(data.completo?.lsPreguntaConsulta?.length || 0) > 0 && (
                 <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-4">
                   <div className="px-4 py-2 border-b bg-slate-50 flex items-center gap-2 text-slate-800 font-bold text-sm">
                     <Clock className="size-4 text-slate-600" /> Consultas y Observaciones Recibidas
                   </div>
                   <div className="p-4 space-y-4">
                      {data.completo.lsPreguntaConsulta.map((p: any, i: number) => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-slate-50/50 rounded-r-lg">
                           <div className="flex justify-between items-start">
                              <span className="text-[10px] font-bold text-blue-600 uppercase">Respuesta {p.numPregunta}</span>
                              <Badge variant="outline" className="text-[9px]">{p.nomEstadoPregunta}</Badge>
                           </div>
                           <p className="text-xs text-slate-700 mt-1 font-medium">{p.desContraste || p.desRespuesta || "Sin respuesta detallada pública."}</p>
                        </div>
                      ))}
                   </div>
                 </section>
              )}
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
