import { tool } from "ai";
import { z } from "zod";
import {
  searchContracts,
  getContractDetail,
  listDepartments,
  listContractTypes,
  listContractStates,
} from "@/lib/seace/client";

export const seaceTools = {
  searchContracts: tool({
    description: `Buscar contrataciones públicas en SEACE (contrataciones menores o iguales a 8 UIT del estado peruano).
Filtros disponibles:
- palabra_clave: texto libre para buscar en la descripción
- objeto_contrato: 1=Bien, 2=Servicio, 3=Obra, 4=Consultoría de Obra
- estado_contrato: 2=Vigente, 3=En Evaluación, 4=Culminado
- departamento: ID del departamento (1=Amazonas, 2=Ancash, 3=Apurímac, 4=Arequipa, 5=Ayacucho, 6=Cajamarca, 7=Callao, 8=Cusco, 9=Huancavelica, 10=Huánuco, 11=Ica, 12=Junín, 13=La Libertad, 14=Lambayeque, 15=Lima, 16=Loreto, 17=Madre de Dios, 18=Moquegua, 19=Pasco, 20=Piura, 21=Puno, 22=San Martín, 23=Tacna, 24=Tumbes, 25=Ucayali)
- anio: año de la contratación (default: año actual)
- page: número de página (default: 1)
- page_size: resultados por página (default: 10, max: 50)`,
    parameters: z.object({
      palabra_clave: z
        .string()
        .optional()
        .describe("Texto para buscar en la descripción de la contratación"),
      objeto_contrato: z
        .number()
        .optional()
        .describe("Tipo: 1=Bien, 2=Servicio, 3=Obra, 4=Consultoría de Obra"),
      estado_contrato: z
        .number()
        .optional()
        .describe("Estado: 2=Vigente, 3=En Evaluación, 4=Culminado"),
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
      const result = await searchContracts(params);
      return {
        contracts: result.data.map((c) => ({
          id: c.idContrato,
          numero: c.desContratacion,
          tipo: c.nomObjetoContrato,
          descripcion: c.desObjetoContrato,
          entidad: c.nomEntidad,
          estado: c.nomEstadoContrato,
          fechaPublicacion: c.fecPublica,
          inicioCotizacion: c.fecIniCotizacion,
          finCotizacion: c.fecFinCotizacion,
          puedesCotizar: c.cotizar,
        })),
        pagination: {
          page: result.pageable.pageNumber,
          pageSize: result.pageable.pageSize,
          total: result.pageable.totalElements,
        },
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
      const c = detail.uitContratoCompletoProjection;
      return {
        id: c.idContrato,
        numero: c.nroDescripcion,
        anio: c.anio,
        tipo: c.nomObjetoContrato,
        tipoInvitacion: c.nomTipoInvitacion,
        descripcion: c.desObjetoContrato,
        entidad: c.nomEntidad,
        estado: c.nomEstadoContrato,
        areaUsuaria: c.nomAreaUsuaria,
        sigla: c.nomSigla,
        fechaPublicacion: c.fecPublica,
        etapas: detail.uitContratoEtapaProjectionList.map((e) => ({
          nombre: e.nomEtapaContrato,
          inicio: e.fecIni,
          fin: e.fecFin,
        })),
        items: detail.uitContratoItemProjectionList.map((i) => ({
          codigo: i.codCubso,
          nombre: i.nomCubso,
          descripcion: i.descripcionItem,
          cantidad: i.cantidad,
          unidadMedida: i.nomUnidadMedida,
          ubicacion: i.nomDistritoExt,
          proveedor: i.nomRazonSocial,
          precioTotal: i.precioTotal,
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
