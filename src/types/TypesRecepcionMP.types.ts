export type TGuia = {
  id: number;
  lotesrecepcionmp: TLoteGuia[];
  camion: string;
  camionero: string;
  estado_recepcion: string;
  estado_recepcion_label: string;
  productor: string;
  comercializador: string;
  creado_por: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  mezcla_variedades: boolean;
  cierre_guia: boolean;
  tara_camion_1: number;
  tara_camion_2: number;
  terminar_guia: boolean;
  numero_guia_productor: number;
  nombre_camion: string;
  nombre_camionero: string;
  nombre_productor: string;
  nombre_comercializador: string;
  nombre_creado_por: string
};

export type TLoteGuia = {
  id: number;
  envases: TEnvaseEnGuia[];
  fecha_creacion: string;
  fecha_modificacion: string;
  kilos_brutos_1: number;
  kilos_brutos_2: number;
  kilos_tara_1: number;
  kilos_tara_2: number;
  estado_recepcion: string;
  estado_label: string;
  numero_lote: number;
  guiarecepcion: number;
  creado_por: number;
  kilos_neto_fruta: number
  kilos_envases: number
  tipo_producto: string
  variedad: string
  cantidad_envases: number
  lote_rechazado: TLoteRechazadoEnLista | null
};

export type TLoteRechazadoEnLista = {
  id: number
  resultado_rechazo_label: string
  fecha_rechazo: string
  fecha_modificacion: string
  resultado_rechazo: string
  numero_lote_rechazado: number
  recepcionmp: number
  rechazado_por: number
}

export type TEnvaseEnGuia = {
  id: number;
  variedad: string;
  tipo_producto: string;
  cantidad_envases: number;
  envase: number;
  recepcionmp: number;
  envase_nombre: string
  variedad_label: string
  tipo_producto_label: string
};

export type TLoteRechazado = {
  id: number
  resultado_rechazo: string
  fecha_rechazo: string
  fecha_modificacion: string
  recepcionmp: number
  rechazado_por: boolean
  resultado_rechazo_label: string
  numero_lote_rechazado: number
}


export type TEnvases = {
  id: number;
  nombre: string;
  peso: number;
  descripcion: string;
  fecha_creacion: string;
  fecha_modificacion: string;
};


