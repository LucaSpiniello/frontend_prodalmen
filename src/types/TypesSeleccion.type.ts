export type TSeleccion = {
  id: number
  pepa_para_seleccion: TPepaParaSeleccion[]
  tarja_seleccionada: TTarjaSeleccionada[]
  subproductos: TSubproducto[]
  operarios: TOperarioSeleccion[] // ¿Debería ser algún tipo específico?
  fecha_creacion: string
  fecha_modificacion: string
  estado_programa: string
  fecha_inicio_proceso: string
  fecha_cierre_proceso: string | null
  fecha_termino_proceso: string | null
  observaciones: string
  programa_armado: boolean
  programa_cerrado: boolean
  registrado_por: number
  estado_programa_label: string
  registrado_por_label: string
  email_registrador: string
  diferencia_rendimiento: number
  condicion_termino: boolean
  condicion_cierre: boolean
  kilos_porcentaje: {
    bins_sin_procesar: number
    bins_procesados: number
  }
  numero_programa: number
  pepa_para_seleccion_length: number
  produccion: number 
  comercializador?: string
}


export type TPepaParaSeleccion = {
  id: number
  tipo_pepa_calibrada_label: string
  kilos_fruta: number
  codigo_tarja: string
  variedad: string
  fecha_creacion: string
  fecha_modificacion: string
  bin_procesado: boolean
  fecha_procesado: null | string
  seleccion: number
  binbodega: number
}
// {
//   id: number
//   fecha_creacion: string
//   fecha_modificacion: string
//   id_pepa_calibrada: number
//   bin_procesado: boolean
//   fecha_procesado: string | null
//   seleccion: number
//   tipo_pepa_calibrada: number
//   tipo_pepa_calibrada_label: string
//   kilos_fruta: number
//   codigo_tarja: string
//   variedad: string
// }



export type TTarjaSeleccionada = {
  id: number
  fecha_creacion: string
  fecha_modificacion: string
  tipo_resultante: string
  tipo_patineta: number
  peso: number
  cc_tarja: boolean
  fecha_cc_tarja: string | null
  codigo_tarja: string
  calle_bodega: string
  seleccion: number
  registrado_por: number
  calibre: string
  calidad: string
  esta_eliminado: boolean
  variedad: string
}

export type TSubproducto = {
  id: number
  fecha_creacion: string
  fecha_modificacion: string
  peso: number
  en_bin: boolean
  tipo_subproducto: string
  seleccion: number
  operario: number
  registrado_por: number
  operario_nombres: string
  registrado_por_label: string
  tipo_subproducto_label: string
}

export type TSubProductoMetrica = {
  nombre: string
  total_kilos: number
  tipo_subproducto: string
  subproducto_id: number
}


export type TOperarioSeleccion = {
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


type TTabsText = 'General' | 'Tarjas Resultantes' | 'Envases de Lote Seleccionado' | 'SubProducto Registrado' | 'Operarios Selección'

export type TTabsSl = {
	text: TTabsText;
};

type TTabsKey = 'GR' | 'TR' | 'ELS' | 'SPR' | 'OP'

export type TTabsKSeleccion = {
	[key in TTabsKey]: TTabsSl;
};

export const OPTIONS_SL: TTabsKSeleccion = {
  GR: { text: 'General'},
  ELS: { text: 'Envases de Lote Seleccionado' },
  SPR: { text: 'SubProducto Registrado' },
  OP: { text: 'Operarios Selección'},
  TR: { text: 'Tarjas Resultantes'},
};


// export type TBinBodega = {
//   id: number;
//   tipo_binbodega_id: number;
//   tipo_binbodega: string;
//   binbodega: string;
//   estado_binbodega: string;
//   kilos_bin: number;
//   programa: string;
//   fecha_creacion: string;
//   fecha_modificacion: string;
//   id_binbodega: number;
//   procesado: boolean;
//   procesado_por: string | null
//   variedad: string
//   calibre: string
//   calibrado: string
//   fumigado: string
//   calle: string
//   calidad: string
//   tipo_bodega: string
// }

export type TBinBodega = {
  id: number
  tipo_binbodega_id: number
  tipo_binbodega: string
  binbodega: string
  programa: string
  calibrado: string
  calle: string
  fumigado: string
  estado_binbodega: string
  kilos_bin: number
  variedad: string
  calibre: string
  calidad: string
  fecha_creacion: string
  fecha_modificacion: string
  id_binbodega: number
  procesado: boolean
  ingresado: boolean
  agrupado: boolean
  procesado_por: null | number
  tipo_producto: string
  programa_produccion?: string
  productor?: string
  comercializador?: string
}


export type TTarjaSeleccionadaCalibracion = {
  id: number
  fecha_creacion: string
  fecha_modificacion: string
  estado_cc: string
  variedad: string
  calibre: string
  calidad_fruta: string
  cantidad_muestra: number
  numero_pepa: number
  trozo: number
  picada: number
  hongo: number
  daño_insecto: number
  dobles: number
  goma: number
  mezcla_variedad: number
  pepa_sana: number
  fuera_color: number
  punto_goma: number
  vana_deshidratada: number
  basura: number
  tarja_seleccionada: number
  cc_registrado_por: any
  codigo_tarja: string
  estado_cc_label: string
}


export type TOperarioEnSeleccion =   {
  id: number
  tipo_operario_label: string
  nombres: string
  rut_operario: string
  fecha_creacion: string
  fecha_modificacion: string
  skill_operario: string
  seleccion: number
  operario: number
}

export type TControlCalidadSeleccion = {
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
}


export type TDatosRendimiento = {
  fruta_resultante: number
  pepa_sana_proyectada: number
}


export type TRendimientoSeleccion = {
  cc_rendimiento_entrantes: TControlCalidadSeleccion
  cc_rendimiento_salientes: TControlCalidadSeleccion
  bin_fruta_calibrada_rendimiento: TDatosRendimiento
  bin_fruta_resultante_rendimiento: TDatosRendimiento
  porcentaje_proyeccion_entrante: number,
  porcentaje_proyeccion_saliente: number,
  diferencia: number
  kilos_entrantes: TControlCalidadSeleccion
  kilos_salientes: TControlCalidadSeleccion
}



export type TPDFInformeSeleccion = {
  tarja: string
  programa: string
  producto: string
  variedad: string
  calibre: string
  calidad: string
  kilos: string
}

export type TPDFInformeKilosXOperario = {
  tarja: string
  programa: string
  tipo_resultante: string
  fecha_registro: string
  kilos: number
  neto: number
}

export type TPDFInformeOperarioResumido = {
  operario: string
  kilos: number
  neto: number
  detalle?: string
}

export type TPDFEntradaSeleccion = {
  numero_programa: string
  codigo_tarja: string
  variedad: string
  calibre: string
  trozo: number
  picada: number
  hongo: number
  insecto: number
  dobles: number
  p_goma: number
  basura: number
  mezcla: number
  color: number
  goma: number
  pepa: number
  kilos: number
  colectado: boolean
  programa_produccion?: string
}

export type TPDFSalidaSeleccion = {
  bines: Bines[],
  subproductos: Productos[]
}

export type Bines = {
  codigo_tarja: string
  variedad: string
  calibre: string
  trozo: number
  picada: number
  hongo: number
  insecto: number
  dobles: number
  p_goma: number
  basura: number
  mezcla: number
  color: number
  goma: number
  pepa: number
  kilos: number
  calidad?:string
  tipo?:string
}

export type Productos = {
  operario: string
  tipo_producto: string
  peso: number
}








export type TBinSubProducto = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  tipo_patineta: number;
  tipo_patineta_label: string
  peso: number;
  cc_subproducto: boolean;
  fecha_cc_subproducto: string | null;
  codigo_tarja: string | null;
  ubicacion_label: string;
  calle_bodega_label: string;
  tipo_subproducto_label: string;
  agrupado: boolean;
  registrado_por: number;
  subproductos: TSubProductoEnBin[];
  calidad_label: string
  variedad_label: string
  calibre_label: string
  estado_bin_label: string
  registrado_por_label: string
  variedad: string
  calidad: string
  calibre: string
  tipo_subproducto: string
  calle_bodega: string
}


export type TSubProductoEnBin = {
  id: number
  programa: string
  operario: string
  tipo_subproducto: string
  registrado_por: string
  fecha_creacion: string
  peso: number
  subproducto_operario: number
  bin_subproducto: number
}




export type THistoricoBinSubProducto = {
  fecha: string
  cambio: string
  tipo_patineta: string
  registrado_por: string
}