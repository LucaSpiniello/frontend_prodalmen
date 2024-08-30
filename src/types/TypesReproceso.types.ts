type TTabsText = 'General' | 'Tarjas Resultantes' | 'Envases de Lote Seleccionado' | '' | 'Operarios' 

export type TTabsRP = {
	text: TTabsText;
};

type TTabsKey = 'GR' | 'TR' | 'ELS' | 'OPR'

export type TTabsKReproceso = {
	[key in TTabsKey]: TTabsRP;
};

export const OPTIONS_RP: TTabsKReproceso = {
  GR: { text: 'General'},
  ELS: { text: 'Envases de Lote Seleccionado' },
  OPR: { text: 'Operarios' },
  TR: { text: 'Tarjas Resultantes'},
};


export type TReprocesoProduccion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  estado: string;
  estado_label: string,
  condicion_cierre: boolean
  fecha_inicio_reproceso: string | null;
  fecha_termino_reproceso: string | null;
  fecha_cierre_proceso: string | null;  
  fecha_termino_proceso: string | null;
  fecha_pausa_proceso: string | null;
  fecha_finpausa_proceso: string | null;
  registrado_por: number;
  registrado_por_label: string
  email_registrador: string
  numero_programa: number
  bines_length: number
  bines_por_procesar: string
  bines_procesados: string
  condicion_termino: boolean
}

export type TBinEnReproceso = {
  id: number
  programa_produccion: string
  kilos_bin: number
  identificador_bin_bodega: number
  codigo_tarja: string
  calle_bodega: string
  variedad: string
  calibre: string
  fecha_creacion: string
  fecha_modificacion: string
  bin_ingresado: boolean
  bin_procesado: boolean
  fecha_procesado: null | string
  reproceso: number
  binbodega: number
  procesado_por: null | number
}
// {
//   id: number,
//   fecha_creacion: string,
//   fecha_modificacion: string,
//   id_bin_bodega: number,
//   bin_procesado: boolean,
//   fecha_procesado: string,
//   reproceso: number,
//   tipo_bin_bodega: number,
//   procesado_por: number
//   programa_produccion: number
//   binbodega: string
//   kilos_bin: number
//   identificador_bin_bodega: number
//   bin_ingresado: boolean
//   codigo_tarja: string
//   calle_bodega: string
//   variedad: string
//   calibre: string
// }



export type TOperarioReproceso = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos: number;
  dia: string;
  produccion: number;
  operario: number;
  nombres: string
  rut_operario: string
  tipo_operario: string
  tipo_operario_label: string
}

export type TTarjaResultanteReproceso = {
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
  calibre: string
  variedad: string
}



export type TOperarioEnReproceso = {
  operario__rut: string
  operario__nombre: string
  operario__apellido: string
  skill_operario: string
  total_kilos_producidos: number
  dias_trabajados: number  
}
