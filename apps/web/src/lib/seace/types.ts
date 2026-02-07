export interface SeaceContract {
  secuencia: number;
  idContrato: number;
  nroContratacion: number;
  desContratacion: string;
  idObjetoContrato: number;
  nomObjetoContrato: string;
  desObjetoContrato: string;
  fecIniCotizacion: string;
  fecFinCotizacion: string;
  cotizar: boolean;
  idEstadoContrato: number;
  nomEstadoContrato: string;
  fecPublica: string;
  idTipoCotizacion: number;
  nomEntidad: string;
}

export interface SeaceSearchResponse {
  data: SeaceContract[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
  };
}

export interface SeaceContractDetail {
  uitContratoCompletoProjection: {
    idContrato: number;
    idSigla: number;
    nomSigla: string;
    idAreaUsuaria: number;
    nomAreaUsuaria: string;
    idEstadoContrato: number;
    nomEstadoContrato: string;
    idObjetoContrato: number;
    nomObjetoContrato: string;
    idTipoInvitacion: number;
    nomTipoInvitacion: string;
    nroCorrelativo: number;
    nroDescripcion: string;
    anio: number;
    desObjetoContrato: string;
    codTieneProy: number;
    nroCcmn: string;
    desCcmn: string;
    desJustifTipInvit: string | null;
    fecPublica: string;
    idEntidad: number;
    nomEntidad: string;
    activo: number;
    numCcp: string | null;
  };
  uitContratoEtapaProjectionList: Array<{
    idContratoEtapa: number;
    idContrato: number;
    idEtapaContrato: number;
    nomEtapaContrato: string;
    desJustif: string | null;
    nroDniAprobador: string | null;
    nomAprobador: string | null;
    fecIni: string;
    fecFin: string;
  }>;
  uitContratoItemProjectionList: Array<{
    idCubso: number;
    codCubso: string;
    nomCubso: string;
    idUnidadMedida: number;
    nomUnidadMedida: string;
    nomDistritoExt: string;
    descripcionItem: string;
    cantidad: number;
    codRuc: string | null;
    nomRazonSocial: string | null;
    precioTotal: number | null;
    nomEstadoCotiza: string | null;
    docSolicitado: string | null;
  }>;
}

export interface SeaceDepartment {
  id: number;
  nom: string;
  abr: string | null;
  ubigeoInei: string;
}

export interface SeaceMaestra {
  id: number;
  nom: string;
  abr: string;
}

export interface SearchParams {
  anio?: number;
  palabra_clave?: string;
  objeto_contrato?: number;
  estado_contrato?: number;
  departamento?: number;
  orden?: number;
  page?: number;
  page_size?: number;
}
