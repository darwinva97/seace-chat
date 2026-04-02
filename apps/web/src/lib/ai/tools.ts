import { tool } from "ai";
import { z } from "zod";
import { db, or, ilike, eq } from "@repo/db";
import { seaceDrafts } from "@repo/db/schema";
import {
  searchContracts,
  getContractDetail,
  listDepartments,
  listContractTypes,
  listContractStates,
} from "@/lib/seace/client";

export const seaceTools = {
  listSavedDrafts: tool({
    description: "Lista todos los borradores de cotizaciones (guardados pero no enviados) o enviados por el usuario en la base de datos local.",
    parameters: z.object({}),
    execute: async () => {
      try {
        const drafts = await db.select().from(seaceDrafts);
        return {
          contracts: drafts.map((d) => ({
            id: d.contractId,
            idCotizacion: d.idCotizacion,
            numero: d.numero,
            tipo: "Servicio",
            descripcion: d.descripcion,
            entidad: d.entidad,
            estado: d.estado || "BORRADOR",
            fechaPublicacion: "",
          })),
        };
      } catch (e) {
        return { contracts: [] };
      }
    },
  }),
  searchContracts: tool({
    description: `Buscar contrataciones públicas en SEACE (contrataciones menores o iguales a 8 UIT del estado peruano).
Filtros disponibles:
- palabra_clave: parámetro principal y universal. Sirve para buscar por código de contrato, nomenclatura (ej. CM-448), descripción, sigla, entidad o nombre del servicio/bien. Úsalo siempre como tu principal motor de búsqueda.
- objeto_contrato: 1=Bien, 2=Servicio, 3=Obra, 4=Consultoría de Obra
- estado_contrato: 2=Vigente, 3=En Evaluación, 4=Culminado
- solo_cotizables: boolean opcional. Ponlo en true si el usuario PIDE EXPLÍCITAMENTE "solo cotizables", "con cotización activa" o "para cotizar", esto filtrará los que no se puedan cotizar localmente.
- departamento: ID del departamento (1=Amazonas, 2=Ancash, 3=Apurímac, 4=Arequipa, 5=Ayacucho, 6=Cajamarca, 7=Callao, 8=Cusco, 9=Huancavelica, 10=Huánuco, 11=Ica, 12=Junín, 13=La Libertad, 14=Lambayeque, 15=Lima, 16=Loreto, 17=Madre de Dios, 18=Moquegua, 19=Pasco, 20=Piura, 21=Puno, 22=San Martín, 23=Tacna, 24=Tumbes, 25=Ucayali)
- anio: año de la contratación (default: año actual)
- page: número de página (default: 1)
- page_size: resultados por página (default: 10, max: 50)`,
    parameters: z.object({
      palabra_clave: z
        .string()
        .optional()
        .describe("Ej: 'CM-448', 'CM-236-2026-SERVIR'. Motor universal."),
      objeto_contrato: z
        .number()
        .optional()
        .describe("Tipo: 1=Bien, 2=Servicio, 3=Obra, 4=Consultoría de Obra"),
      estado_contrato: z
        .number()
        .optional()
        .describe("Estado: 2=Vigente, 3=En Evaluación, 4=Culminado"),
      solo_cotizables: z
        .boolean()
        .optional()
        .describe("Filtra y elimina registros que no permiten cotización. Úsalo si el usuario quiere 'solo órdenes activas para cotizar'"),
      departamento: z
        .number()
        .optional()
        .describe("ID del departamento (1-25)"),
      anio: z.number().optional().describe("Año de la contratación"),
      page: z.number().optional().describe("Número de página"),
      page_size: z
        .number()
        .optional()
        .describe("Resultados por página (max 50)"),
    }),
    execute: async (params) => {
      // Fuerza bruta: Si la palabra clave contiene el año (ej. CM-236-2026-SERVIR), obligamos a que busque en ese año.
      if (params.palabra_clave) {
        const matchInfo = params.palabra_clave.match(/-(\d{4})-/);
        if (matchInfo && matchInfo[1]) {
          params.anio = parseInt(matchInfo[1], 10);
        }
      }

      console.log("=== [AI TOOL EXECUTING] searchContracts PARAMS: ===", params);
      const result = await searchContracts(params);
      console.log("=== [AI TOOL EXECUTING] RAW RESULTS count: ===", result.data?.length);

      let localFound: any[] = [];

      // Rescate local: Si SEACE oculta el contrato porque ya tiene borrador, lo rescatamos de Postgres
      if (params.palabra_clave) {
        try {
          const locals = await db.select().from(seaceDrafts).where(
            or(
              ilike(seaceDrafts.numero, `%${params.palabra_clave}%`),
              ilike(seaceDrafts.descripcion, `%${params.palabra_clave}%`)
            )
          );
          localFound = locals.map(l => ({
            idContrato: l.contractId,
            idCotizacion: l.idCotizacion,
            desContratacion: l.numero,
            nomObjetoContrato: "Servicio",
            desObjetoContrato: l.descripcion,
            nomEntidad: l.entidad,
            nomEstadoContrato: l.estado || "Borrador Guardado",
            cotizar: true, // Forzar que aparezca como interactuable
          }));
        } catch (e) {
          console.warn("Error rescatando borradores locales:", e);
        }
      }

      // Fusionar evitando duplicados
      const mergedData = [...(result.data || [])];
      for (const lf of localFound) {
        if (!mergedData.find(m => m.idContrato === lf.idContrato)) {
          mergedData.unshift(lf); // Ponemos los locales arriba
        }
      }

      let processedData = mergedData.map((c: any) => ({
        id: c.idContrato,
        idCotizacion: c.idCotizacion,
        idEstadoCotiza: c.idEstadoCotiza,
        nomEstadoCotiza: c.nomEstadoCotiza,
        numero: c.desContratacion,
        tipo: c.nomObjetoContrato,
        descripcion: c.desObjetoContrato,
        entidad: c.nomEntidad,
        nomSigla: c.nomSigla,
        estado: c.nomEstadoContrato,
        fechaPublicacion: c.fecPublica,
        inicioCotizacion: c.fecIniCotizacion,
        finCotizacion: c.fecFinCotizacion,
        puedesCotizar: c.cotizar,
      }));

      // Si pide solo cotizables, descartamos los no vigentes/no cotizables
      if (params.solo_cotizables) {
        processedData = processedData.filter((c: any) => c.puedesCotizar === true);
      }

      return {
        contracts: processedData,
        pagination: result.pageable ? {
          page: result.pageable.pageNumber,
          pageSize: result.pageable.pageSize,
          total: result.pageable.totalElements,
        } : { page: 1, pageSize: 10, total: 0 },
      };
    },
  }),

  getContractDetail: tool({
    description:
      "Obtener el detalle completo de una contratación específica por su ID. Incluye información de etapas, ítems, área usuaria y más.",
    parameters: z.object({
      idContrato: z
        .number()
        .describe("ID del contrato a consultar (obtenido de la búsqueda)"),
    }),
    execute: async ({ idContrato }) => {
      const detail = await getContractDetail(idContrato);
      const c = detail.uitContratoCompletoProjection as any;

      // Rescate local del detalle
      let localDraft: any = null;
      try {
        const drafts = await db.select().from(seaceDrafts).where(eq(seaceDrafts.contractId, idContrato));
        if (drafts.length > 0) localDraft = drafts[0];
      } catch (e) { }

      return {
        id: c.idContrato,
        idCotizacion: c.idCotizacion || localDraft?.idCotizacion || localDraft?.id,
        numero: c.nroDescripcion,
        anio: c.anio,
        tipo: c.nomObjetoContrato,
        tipoInvitacion: c.nomTipoInvitacion,
        descripcion: c.desObjetoContrato,
        entidad: c.nomEntidad,
        estado: localDraft?.estado || c.nomEstadoContrato || "Borrador Guardado",
        areaUsuaria: c.nomAreaUsuaria,
        sigla: c.nomSigla,
        fechaPublicacion: c.fecPublica,
        etapas: detail.uitContratoEtapaProjectionList.map((e: any) => ({
          nombre: e.nomEtapaContrato,
          inicio: e.fecIni,
          fin: e.fecFin,
        })),
        items: detail.uitContratoItemProjectionList.map((i: any) => ({
          codigo: i.codCubso,
          nombre: i.nomCubso,
          descripcion: i.descripcionItem,
          cantidad: i.cantidad,
          unidadMedida: i.nomUnidadMedida,
          ubicacion: i.nomDistritoExt,
          proveedor: i.nomRazonSocial,
          precioTotal: i.precioTotal,
          idCotizacionItem: i.idCotizacionItem,
          estadoCotizacion: i.nomEstadoCotiza,
        })),
      };
    },
  }),

  listDepartments: tool({
    description:
      "Listar todos los departamentos del Perú disponibles para filtrar contrataciones.",
    parameters: z.object({}),
    execute: async () => {
      const departments = await listDepartments();
      return departments.map((d) => ({ id: d.id, nombre: d.nom }));
    },
  }),

  listContractTypes: tool({
    description:
      "Listar los tipos de objeto de contratación disponibles (Bien, Servicio, Obra, Consultoría de Obra).",
    parameters: z.object({}),
    execute: async () => {
      const types = await listContractTypes();
      return types.map((t) => ({ id: t.id, nombre: t.nom }));
    },
  }),

  listContractStates: tool({
    description:
      "Listar los estados posibles de una contratación (Vigente, En Evaluación, Culminado).",
    parameters: z.object({}),
    execute: async () => {
      const states = await listContractStates();
      return states.map((s) => ({ id: s.id, nombre: s.nom }));
    },
  }),
};
