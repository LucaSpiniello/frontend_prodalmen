import { TTipoEmbalaje } from "./TypesPedidos.types";


export type TEmbalaje = {
  id: number;
  fruta_bodega: TBinEnEmbalaje[];
  pallets: TPalletProductoTerminado[];
  tipo_embalaje: TTipoEmbalaje | null;
  etiquetado: TEtiquetado | null;
  configurado_por: string;
  estado_embalaje: string;
  estado_embalaje_label: string;
  fecha_creacion: string
  fecha_modificacion: string
  observaciones: string;
  tipo_producto: string;
  calidad: string;
  calidad_label: string;
  calibre: string;
  calibre_label: string;
  variedad: string;
  variedad_label: string;
  kilos_solicitados: number;
  merma_programa: number;
  solicitado_por: string
  tipo_producto_label: string
  tipo_embalaje_label: string
  kilos_resultantes: number
  kilos_sobrantes: number
  kilos_faltantes: number
  merma_porcentual: number
  condicion_cierre: boolean
  condicion_termino: boolean
  fecha_inicio_embalaje: string
  fecha_termino_embalaje: string
  kilos_ingresados: number
  metricas_embalaje: TMetricasEmbalaje[]
  margen_fruta?: number
  fruta_embalada?: number
}


export type TBinEnEmbalaje = {
  id: number
  codigo_tarja: string
  programa: string
  cc_tarja: string
  kilos_fruta: number
  tipo_binbodega: string
  fecha_creacion: string
  procesado: boolean
}

export type TEtiquetado = {
  id: number
  nombre: string
  archivo_impresora_cajas: string
  archivo_impresora_termica: string
}

export type TFrutaBodega = {
  id: number
  embalaje: number
  bin_bodega: number
  procesado: boolean
}

export type TOperarioEmbalajeDiario = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos: number;
  dia: string;
  produccion: number;
  operario: number;
  nombres: string
  rut_operario: string
  tipo_operario_label: string
  apellido: string
  nombre: string
}

export type TOperarioEnEmbalaje = {
  id: number
  nombres: string
  rut_operario: string
  tipo_operario_label: string
  fecha_creacion: string
  fecha_modificacion: string
  skill_operario: string
  programa: number
  operario: number
}

export type TPalletProductoTerminado = {
  id: number
  embalaje: number
  numero_pallet: number
  calle_bodega: number
  cajas_en_pallet: TCajasEnPalletProductoTerminado[],
  observaciones: string
  registrado_por: string
  registrado_por_label: string
  codigo_pallet: string
  calle_bodega_label: string
  peso_pallet: number
  fecha_creacion: string
  fecha_modificacion: string
  calibre_programa?: string
  calidad_programa?: string
  variedad_programa?: string
}

export type TCajasEnPalletProductoTerminado = {
  id: number
  pallet: number
  tipo_caja: string
  tipo_caja_label: string
  cantidad_cajas: number
  peso_x_caja: number
  registrado_por: number
  registrado_por_label: string
}

export type THistoricoPalletProductoTerminado = {
  codigo_pallet: number
  fecha: string
  cambio: string
  tipo_patineta: string
  registrado_por: string
}

export type TPalletProductoTerminadoMIN = {
  id: number
  codigo_pallet: string
  calidad: string
  variedad: string
  calibre: string
  cantidad_cajas: number
  peso_pallet: number
}


export type PDFEntradaEmbalaje = {
  programa: TEmbalaje
  bines: PDFBinEntradaEmbalaje[]
}

export type PDFBinEntradaEmbalaje = {
  codigo_tarja: string
  programa: string
  variedad: string
  calibre: string
  calidad: string
  kilos_fruta: number
  calle_bodega: string
}

export type PDFSalidaEmbalaje = {
  programa: TEmbalaje
  pallets: PDFPalletSalidaEmbalaje[]
}

export type PDFPalletSalidaEmbalaje = {
  codigo_pallet: string
  programa: string
  variedad: string
  calibre: string
  kilos_fruta: number
  fecha_creacion: string
}



export type TMetricasEmbalaje = {
  dia: string
  kilos: number
}