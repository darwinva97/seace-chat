import type {
  SeaceSearchResponse,
  SeaceContractDetail,
  SeaceDepartment,
  SeaceMaestra,
  SearchParams,
} from "./types";

const BASE_URL =
  "https://prod6.seace.gob.pe/v1/s8uit-services/buscadorpublico";

async function fetchSeace<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`SEACE API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export async function searchContracts(
  params: SearchParams = {}
): Promise<SeaceSearchResponse> {
  const searchParams = new URLSearchParams();

  const currentYear = new Date().getFullYear();
  searchParams.set("anio", String(params.anio ?? currentYear));
  searchParams.set("orden", String(params.orden ?? 2));
  searchParams.set("page", String(params.page ?? 1));
  searchParams.set("page_size", String(params.page_size ?? 10));

  if (params.palabra_clave) {
    searchParams.set("palabra_clave", params.palabra_clave);
  }
  if (params.objeto_contrato) {
    searchParams.set("objeto_contrato", String(params.objeto_contrato));
  }
  if (params.estado_contrato) {
    searchParams.set("estado_contrato", String(params.estado_contrato));
  }
  if (params.departamento) {
    searchParams.set("departamento", String(params.departamento));
  }

  return fetchSeace<SeaceSearchResponse>(
    `/contrataciones/buscador?${searchParams.toString()}`
  );
}

export async function getContractDetail(
  idContrato: number
): Promise<SeaceContractDetail> {
  return fetchSeace<SeaceContractDetail>(
    `/contrataciones/listar-completo?id_contrato=${idContrato}`
  );
}

export async function listDepartments(): Promise<SeaceDepartment[]> {
  return fetchSeace<SeaceDepartment[]>("/maestras/listar-departamento");
}

export async function listContractTypes(): Promise<SeaceMaestra[]> {
  return fetchSeace<SeaceMaestra[]>("/maestras/listar-objeto-contratacion");
}

export async function listContractStates(): Promise<SeaceMaestra[]> {
  return fetchSeace<SeaceMaestra[]>(
    "/maestras/listar-estados-contrato-cotizacion"
  );
}
