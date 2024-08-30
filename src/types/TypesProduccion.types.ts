
export type TEnvasesPrograma = {
  id: number;
  numero_lote: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  bin_ingresado: boolean;
  bin_procesado: boolean;
  fecha_procesado: string;
  produccion: number;
  bodega_techado_ext: number;
  procesado_por: number;
  guia_patio: number
  numero_bin: number
  kilos_fruta: number
  variedad: string
  guia_recepcion: number
  control_calidad: number
  esta_eliminado: boolean
}

export type TRendimientoActual = {
  pepa_resultante: number
  cc_pepa_calibre: TCalibreTarja;
}

export type TCalibreTarja = {
  sincalibre: number
  precalibre: number;
  calibre_18_20: number;
  calibre_20_22: number;
  calibre_23_25: number;
  calibre_25_27: number;
  calibre_27_30: number;
  calibre_30_32: number;
  calibre_32_34: number;
  calibre_34_36: number;
  calibre_36_40: number;
  calibre_40_mas: number;
};

export type TProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: string;
  estado_label: string,
  lotes_length: string
  fecha_inicio_proceso: string | null;
  fecha_termino_proceso: string | null;
  lotes_por_procesar: string
  lotes_procesados: string
  registrado_por: number;
  numero_programa: number
  condicion_cierre: boolean
  condicion_termino: boolean
}

export type   TLoteProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  bin_ingresado: boolean;
  bin_procesado: boolean;
  fecha_procesado: string;
  produccion: number;
  bodega_techado_ext: number;
  procesado_por: string;
  envases?: TEnvasesPrograma[]
  numero_lote: number,
  kilos_fruta: number
  ubicacion: string
  total_envases: number
  numero_bin: number
  variedad: string
  control_calidad: number
  guia_patio: number
  guia_recepcion: number
  esta_eliminado: boolean
}

export type TOperarioProduccion = {
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

export type TTarjaResultante = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tipo_resultante: string;
  peso: number;
  tipo_patineta: number;
  cc_tarja: boolean;
  fecha_cc_tarja: string;
  ubicacion: string;
  codigo_tarja: string;
  calle_bodega: string;
  produccion: number;
  registrado_por: string;
  esta_eliminado: boolean
  tipo_patineta_label: string
  tipo_resultante_label: string
  variedad: string
}

export type TListaOperarioEnProduccion = {
  id: number
  nombres: string
  rut_operario: string
  tipo_operario_label: string
  fecha_creacion: string
  fecha_modificacion: string
  skill_operario: string
  produccion: number
  operario: number
}

export type TListaOperarioEnReproceso = {
  id: number
  nombres: string
  rut_operario: string
  tipo_operario_label: string
  fecha_creacion: string
  fecha_modificacion: string
  skill_operario: string
  reproceso: number
  operario: number
}

export type TDetalleDiaOperario = {
  id: number
  dia: string
  kilos_dia: number
  ausente: boolean
}

// Opcionales

export type TOperarioEnProduccion = {
  operario__rut: string
  operario__nombre: string
  operario__apellido: string
  skill_operario: string
  total_kilos_producidos: number
  dias_trabajados: number  
}


export type DetalleEnvase = {
  id: number,
  numero_lote: string
  tipo_envase: string
  numero_envase: string
  ubicacion: string
  colectado: boolean
}

export type TPDFDetalleEnvases = {
  kilos_totales: string
  productor: string[]
  comercializador: string
  variedad: string
  detalle_envase: DetalleEnvase[]
}


export type DetalleLotesPrograma = {
  numero_lote: string
  total_envases: number
  productor: string
  comercializador: string
  variedad: string
  kilos_fruta: number
}


export type TPDFDetallEntradaPrograma = {
  kilos_totales: string
  productor: string[]
  comercializador: string
  detalle_lote: DetalleLotesPrograma[]
}

export type TMetricasTiempoRealProduccion = {
  total_kilos_fruta: number
  kilos_procesados_pre_limpia: number
  kilos_resultantes_despelo: number
  rendimiento_produccion: number
  kilos_por_operario: {
    operario: string
    kilos_dia: number
  }[]
  tasa_produccion_hora: number
  eficiencia_operarios: {
    operario: string
    eficiencia: number
  }[]
}

export type TMensajeTerminoProduccion = {
  estado_control_calidad: string
  estado_operarios: string
  estado_lotes: string
}

export type TMensajeCierreProduccion = {
  estado_dias: {
    nombre_operario: string
    dias_trabajados: number
    total_kilos: number
  }[]
}

export type PDFSalida = {
  produccion: number
  kilos_resultantes: number
  cantidad_bines_resultantes: number
  numeros_lote: number[],
  tarjas_resultantes: PDFSalidaTarjas[]
}

export type PDFSalidaTarjas = {
  codigo_tarja: string
  kilos_neto: number
  cc_info: PDFSalidaTarjasCC
}

export type PDFSalidaTarjasCC = {
  estado_cc: string
  variedad: string
  calibre: string
  cantidad_muestra: number
  trozo: number
  picada: number
  hongo: number
  daño_insecto: number
  dobles: number
  goma: number
  basura: number
  mezcla_variedad: number
  canuto: number
  pepa_sana: number
  fuera_color: number
  punto_goma: number
  vana_deshidratada: number
  cc_registrado_por: string
}
