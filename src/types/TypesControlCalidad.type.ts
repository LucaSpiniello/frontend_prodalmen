
export type TControlCalidad = {
  id: number
  estado_aprobacion_cc: number
  estado_cc: string
  estado_cc_label: string
  presencia_insectos: boolean
  presencia_insectos_selected: string
  humedad: string
  observaciones: string
  fecha_modificacion: string
  fecha_creacion: string
  recepcionmp: number
  cc_registrado_por: number
  numero_lote: number
  productor: string
  guia_recepcion: number
  estado_guia: string
  estado_aprobacion_cc_label  : string
  control_rendimiento: TRendimientoMuestra[]
  esta_contramuestra: string
  kilos_totales_recepcion: number
  variedad: string
  registrado_por_label: string
  fotos_cc: [],
  email_registrador: string,
  email_productor? : string,
  comercializador? : string,
  mailEnviado? : boolean,
}

export type TRendimientoMuestra = {
  id: number
  cc_recepcionmp: number
  peso_muestra_calibre:number
  muestra_variedad: number
  basura: number
  pelon:number
  cascara: number
  pepa_huerto: number
  pepa: number
  ciega: number
  fecha_creacion: string
  fecha_modificacion: string
  aprobado_cc: boolean
  es_contramuestra: boolean
  esta_contramuestra: number
  registrado_por: null
  cc_ok: boolean
  cc_calibrespepaok: boolean
  cc_rendimiento: TPepaMuestra
  peso_muestra: number
  email_registrador: string
  registrado_por_label: string
}

export type TPepaMuestra = {
  id: number
  pepa_muestra?: number
  cc_recepcionmp: number
  cc_ok: boolean
  pepa_sana?: number
  fecha_creacion?: string
  fecha_modificacion?: string
  muestra_variedad?: number
  daño_insecto?: number
  hongo?: number
  doble?: number
  fuera_color?: number
  vana_deshidratada?: number
  punto_goma?: number
  goma?: number
  cc_pepaok?: boolean
  cc_calibrespepaok?: boolean
  pre_calibre?: number
  calibre_18_20?: number
  calibre_20_22?: number
  calibre_23_25?: number
  calibre_25_27?: number
  calibre_27_30?: number
  calibre_30_32?: number
  calibre_32_34?: number
  calibre_34_36?: number
  calibre_36_40?: number
  calibre_40_mas?: number
  observaciones?: null
  cc_rendimiento?: number
  peso_muestra_calibre: number
}




export type TMuestraSerializer = {
  cc_lote: number;
  basura: number;
  pelon: number;
  ciega: number;
  cascara: number;
  pepa_huerto: number;
  pepa_bruta: number;
  pelon_adherido? : number;
};

export type TCCPepaSerializer = {
  cc_lote: number;
  mezcla: number;
  insecto: number;
  hongo: number;
  dobles: number;
  color: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TCalibresSerializer = {
  [key: string]: number;
  cc_lote: number;
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

export type TCCPromedioPorcentajeMuestras = {
  [key: string]: number;
  basura: number;
  pelon: number;
  ciega: number;
  cascara: number;
  pepa_huerto: number;
  pepa_bruta: number;
};

export type TPorcentajeCCPepaSerializer = {
  [key: string]: number;
  mezcla: number;
  insecto: number;
  hongo: number;
  dobles: number;
  color: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TPorcentajeCalibresSerializer = {
  [key: string]: number;
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

export type TDescuentosSerializer = {
  [key: string]: number;
  cc_lote: number;
  pepa_exp: number;
  cat2: number;
  desechos: number;
  mezcla: number;
  color: number;
  dobles: number;
  insecto: number;
  hongo: number;
  vana: number;
  pgoma: number;
  goma: number;
};

export type TAportePexSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TPorcentajeLiquidarSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TKilosMermaSerializer = {
  [key: string]: any; 
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TMermaPorcentajeSerializer = {
  cc_lote: number;
  exportable: number;
  cat2: number;
  des: number;
};

export type TCalculoFinalSerializer = {
  [key: string]: any; 
  kilos_netos: number;
  kilos_brutos: number;
  por_brutos: number;
  merma_exp: number;
  final_exp: number;
  merma_cat2: number;
  final_cat2: number;
  merma_des: number;
  final_des: number;
};


export type TRendimiento = {
  [key: string]: any; 
  cc_muestra: TMuestraSerializer[];
  cc_pepa: TCCPepaSerializer[];
  cc_pepa_calibre: TCalibresSerializer[];
  cc_descuentos: TDescuentosSerializer[];
  cc_aportes_pex: TAportePexSerializer[];
  cc_porcentaje_liquidar: TPorcentajeLiquidarSerializer[];
  cc_kilos_des_merma: TKilosMermaSerializer[];
  cc_calculo_final: TCalculoFinalSerializer;

  cc_promedio_porcentaje_muestras: TCCPromedioPorcentajeMuestras
  cc_promedio_porcentaje_cc_pepa: TPorcentajeCCPepaSerializer
  cc_promedio_porcentaje_cc_pepa_calibradas: TPorcentajeCalibresSerializer
  id?: number;
  lotes? : any[];
  numero_lote?: number;
};

export type TFotosCC = {
  id: number
  imagen: string
  ccrecepcionmp: number
}

export type TControlCalidadTarja = {
  id: number;
  estado_cc: string;
  variedad: string;
  calibre: string;
  cantidad_muestra: number | null;
  trozo: number;
  picada: number;
  hongo: number;
  daño_insecto: number;
  dobles: number;
  goma: number;
  basura: number;
  mezcla_variedad: number;
  pepa_sana: number;
  fuera_color: number;
  punto_goma: number;
  vana_deshidratada: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tarja: number;
  cc_registrado_por: string | null;
  estado_cc_label: string
  codigo_tarja: string
  tipo_resultante_label: string
  canuto? : number
}

export type TTarjaResultante = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tipo_resultante: string;
  tipo_resultante_label: string;
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
}

