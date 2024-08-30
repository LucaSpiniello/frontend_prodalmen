import { TBinBodega } from "./TypesSeleccion.type";

export interface TPatioTechadoEx {
  id: number;
  envases: TEnvasePatio[];
  fecha_creacion: string;
  fecha_modificacion: string;
  variedad: string
  id_recepcion: number;
  ubicacion: string;
  estado_lote: string;
  procesado: boolean;
  cc_guia: number;
  tipo_recepcion: number;
  registrado_por: number;
  control_calidad: number
  estado_lote_label: string
  ubicacion_label: string
  productor: number
  numero_lote: number
  humedad: number
  cantidad_muestras: number
  rendimiento: string
}


export interface TEnvasePatio {
  id: number;
  kilos_fruta: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  variedad: string;
  estado_envase: string;
  numero_bin: number;
  guia_patio: number;
  estado_envase_label: string
  ubicacion: string
  rendimiento: string
}

export type TPatioExterior = {
  id: number
  id_recepcion: number
  ubicacion: string
  fecha_creacion: string
  fecha_modificacion: string
  estado_lote: string
  procesado: boolean
  cc_guia: number
  tipo_recepcion: number
  registrado_por: number
  estado_lote_label: number
}


export type TBodegaG1 = {
  id: number;
  codigo_tarja: string;
  produccion: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_fruta: number;
  variedad: string;
  calibre: string;
  calle_bodega: string;
  estado_bin: string;
  fumigado: boolean;
  fecha_fumigacion: string | null;
}


export type TBodegaG2 = {
  id: number;
  codigo_tarja: string;
  produccion: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_fruta: number;
  variedad: string;
  calibre: string;
  calle_bodega: string;
  estado_bin: string;
  fumigado: boolean;
  fecha_fumigacion: string | null;
}

export type TBodegaG3 = {
  id: number;
  codigo_tarja: string;
  seleccion: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_fruta: number;
  variedad: string;
  calibre: string;
  calle_bodega: string;
  estado_bin: string;
  fumigado: boolean;
  fecha_fumigacion: string | null;
}

export type TBodegaG4 = {
  id: number;
  codigo_tarja: string;
  seleccion: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_fruta: number;
  variedad: string;
  calibre: string;
  calle_bodega: string;
  estado_bin: string;
  fumigado: boolean;
  fecha_fumigacion: string | null;
}

export type TBodegaNeutro = {
  id: number;
  codigo_tarja: string;
  seleccion?: number;
  produccion?: number
  reproceso?: number
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_fruta: number;
  variedad: string;
  calibre: string;
  calle_bodega: string;
  estado_bin: string;
  fumigado: boolean;
  fecha_fumigacion: string | null;
}


export type TBinResultanteAgrupado = {
  id: number
  kilos_fruta:number
  calle: string
  fecha_creacion: string
  fecha_modificacion: string
  id_tarja: number
  agrupacion: number
  tipo_tarja: number
  codigo_tarja: string
  fecha_registro: string
}






export type TAgrupacion = {
  id: number
  bins_agrupados: TBinResultanteAgrupado[],
  codigo_tarja: string
  registrado_por: number
  registrado_por_nombre: string
  fruta_sobrante: number
  transferir_bodega: string
  kilos_fruta: number
  tipo_patineta: number
  agrupamiento_ok: boolean
  fecha_creacion: string
}



export type TPDFBodegas = {
  codigo_tarja: string
  programa: string
  calibre: string
  variedad: string
  calidad: string
  kilos: number
}


export type PDFResumidoInventario = {
  id: number
  tipo_inventario_label: string
  creado_por_label: string
  cantidad_bins_validados: number
  bins_no_validados: TBinesInventario[] | string
  fecha_creacion: string
  fecha_modificacion: string
  tipo_inventario: string
  bodegas: string
  calles: string
  estado: string
  creado_por: number
  binsbodega: number[]
  kilos_por_variedad_y_calibre: string[]
  kilos_por_calibre: string[]
  kilos_por_variedad: string[]
  total_kilos: string
  kilos_por_calidad: string[]
}

export type PDFDetalladoInventario = {
  id: number
  bins: TBinesInventario[] | string
  total_kilos: string
  tipo_inventario_label: string
  creado_por_label: string
  cantidad_bins_validados: number
  cantidad_bins_no_validados: number
  fecha_creacion: string
  fecha_modificacion: string
  tipo_inventario: string
  bodegas: string
  calles: string
  estado: string
  creado_por: number
  binsbodega: number[]
}

export type TInventarios = {
  id: number
  tipo_inventario_label: string
  creado_por_label: string
  condicion_cierre: boolean
  fecha_creacion: string
  fecha_modificacion: string
  tipo_inventario: string
  bodegas: string
  calles: string
  estado: string
  creado_por: number
  binsbodega: number[]
}

export type TBinesInventario = {
  id: number
  codigo_tarja: string
  variedad: string
  calibre: string
  calle: string
  fecha_creacion: string
  fecha_modificacion: string
  validado: boolean
  inventario: number
  validado_por: number
  binbodega: number
  observaciones: null | string
  validado_por_label: string
  kilos: string
}

export type CodigoScaneados = {
  code: string
}