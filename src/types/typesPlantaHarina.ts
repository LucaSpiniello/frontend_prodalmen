export type TProgramaPlantaHarina = {
  id: number
  tipo_programa: string;
  tipo_programa_label: string
  estado_programa: string;
  estado_programa_label: string
  creado_por: string; 
  kilos_inicio: number; 
  kilos_merma: number; 
  ubicacion_produc: string;
  ubicacion_producto: string 
  perdidaprograma: string;
  fruta_ingresada: number
  condicion_cierre: boolean
  condicion_termino: boolean
  condicion_inicio: boolean
  bins_ingresados_length: number
  creado_por_nombre: string
  fecha_creacion: string
  rechazos_registrados: number
  bines_resultantes_kilos: number
  fecha_modificacion: string
  promedio_humedad: number
  promedio_piel: number
  merma_programa: {
    merma_real: number
    porcentaje_merma: number
  }
  valor_referencial: number
  kilos_iniciales: number
  fecha_inicio_programa: string
  fecha_termino_programa: string
  metrica_bines: {
    ingresados: number
    procesados_porcentaje: number
    cantidad_rechazos: number
    porcentaje_rechazos: number
    detalles_procesamiento: TDetalleProcesamiento[]
  }
}

export type TDetalleProcesamiento = {
  kilos: number
  hora_procesado: string
  segundos_duracion: string
  eficiencia: number
}

export type TBinParaProgramaPlantaHarina = {
  id: number
  codigo_tarja: string
  programa: string
  cc_tarja: string
  kilos_fruta: number
  tipo_binbodega: string
  fecha_creacion: string
  fecha_modificacion: string
  procesado: boolean
  esta_eliminado: boolean
}

export type TBinResultantePlantaHarina = {
  id: number
  programa: string
  estado_bin: string
  peso: number
  tipo_patineta: string
  tipo_patineta_label: string
  codigo_tarja: string
  calle_bodega: string
  calle_bodega_label: string
  esta_eliminado: boolean
  calidad: string
  fecha_creacion: string
  fecha_modificacion: string
  cc_tarja: boolean
}

export type TOperarioPlantaHarinaDiario = {
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

export type TOperarioPlantaHarina = {
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

export type TOperarioProcesoPlantaHarina = {
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

export type TRechazosPlantaHarina = {
  id: number,
  fecha_creacion: string
  fecha_modificacion: string,
  kilos_rechazo: number,
  observaciones: string,
  tipo_rechazo_label: string
  tipo_rechazo: string,
  registrado_por_nombre: string
  programa: number,
  registrado_por: number
}

export type TMetricasRechazoPlantaHarina = {
  tipo_rechazo_display: string,
  total_kilos_rechazo: number
}

export type TVariablePlantaHarina = {
  id: number,
  fecha_creacion: string,
  fecha_modificacion: string,
  lectura_gas_inicio: number,
  lectura_luz_inicio: number,
  lectura_gas_termino:number,
  lectura_luz_termino: number,
  resultado_gas: number
  resultado_luz: number
  estado: string,
  programa: number,
  creado_por: number
}




export type TProcesoPlantaHarina = {
  id: number
  tipo_proceso: string;
  tipo_proceso_label: string
  estado_proceso: string;
  estado_proceso_label: string
  creado_por: string; 
  kilos_inicio: number; 
  kilos_merma: number; 
  ubicacion_produc: string;
  ubicacion_producto: string 
  perdidaproceso: string;
  fruta_ingresada: number
  condicion_cierre: boolean
  condicion_termino: boolean
  condicion_inicio: boolean
  bins_ingresados_length: number
  creado_por_nombre: string
  fecha_creacion: string
  rechazos_registrados: number
  bines_resultantes_kilos: number
  fecha_modificacion: string
  promedio_humedad: number
  promedio_piel: number
  merma_programa: {
    merma_real: number
    porcentaje_merma: number
  }
  valor_referencial: number
  kilos_iniciales: number
  fecha_inicio_programa: string
  fecha_termino_programa: string
}

export type TBinParaProcesoPlantaHarina = {
  id: number
  codigo_tarja: string
  programa: string
  cc_tarja: string
  kilos_fruta: number
  tipo_binbodega: string
  fecha_creacion: string
  fecha_modificacion: string
  procesado: boolean
  esta_eliminado: boolean
}

export type TBinResultanteProcesoPlantaHarina = {
  id: number
  programa: string
  estado_bin: string
  peso: number
  tipo_patineta: string
  tipo_patineta_label: string
  codigo_tarja: string
  calle_bodega: string
  calle_bodega_label: string
  esta_eliminado: boolean
  calidad: string
  fecha_creacion: string
  fecha_modificacion: string
  cc_tarja: boolean
}

export type TOperarioProcesoPlantaHarinaDiario = {
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

// export type TOperarioProcesoPlantaHarina = {
//   operario__id: number
//   operario__rut: string
//   operario__nombre: string
//   operario__apellido: string
//   skill_operario: string
//   total_kilos_producidos: number
//   dias_trabajados: number 
// }

export type TRechazosProcesoPlantaHarina = {
  id: number,
  fecha_creacion: string
  fecha_modificacion: string,
  kilos_fruta: number,
  observaciones: string,
  tipo_rechazo_label: string
  tipo_rechazo: string,
  registrado_por_nombre: string
  programa: number,
  registrado_por: number
}

export type TMetricasRechazoProcesoPlantaHarina = {
  tipo_rechazo_display: string,
  total_kilos_fruta: number
}

export type TVariableProcesoPlantaHarina = {
  id: number,
  fecha_creacion: string,
  fecha_modificacion: string,
  lectura_gas_inicio: number,
  lectura_luz_inicio: number,
  lectura_gas_termino:number,
  lectura_luz_termino: number,
  resultado_gas: number
  resultado_luz: number
  estado: string,
  programa: number,
  creado_por: number
}

export type TControlCalidadBinResultantePlantaHarina = {
  id            : number
  numero_bin    : number
  codigo_tarja  : string
  bin_resultante: number
  estado_cc     : string
  humedad       : number
  piel_aderida  : number
  calidad       : string
  observaciones : string
  realizado_por : number
  estado_cc_label: string
  calidad_label: string
  fecha_creacion: string
  fecha_modificacion: string
}

export type TControlCalidadBinResultanteProcesoPlantaHarina = {
  id            : number
  numero_bin    : number
  codigo_tarja  : number
  bin_resultante: number
  estado_control: string
  humedad       : string
  piel_aderida  : string
  granulometria : string
  parametro     : string
  observaciones : string
  realizado_por : string
  calidad       : string
  estado_cc_label: string
  calidad_label: string
  parametro_label: string
  fecha_creacion: string
  fecha_modificacion: string
}

export type TPDFDocumentoSalidaPlantaHarina = {
  programa: TProgramaPlantaHarina
  kilos_totales: number
  bins_resultantes: TResultadosSalida[]
}

export type TPDFDocumentoEntradaPlantaHarina = {
  programa: TProgramaPlantaHarina
  kilos_totales: number
  bins_resultantes: TResultadoEntrada[]

}

export type TPDFDocumentoSalidaProcesoPlantaHarina = {
  programa: TProcesoPlantaHarina
  kilos_totales: number
  bins_resultantes: TResultadosSalida[]
}

export type TPDFDocumentoEntradaProcesoPlantaHarina = {
  programa: TProcesoPlantaHarina
  kilos_totales: number
  bins_resultantes: TResultadoEntrada[]

}

export type TResultadoEntrada = {
  bin: string
  programa: string
  cc_tarja: string
  kilos: string
  procesado: boolean
}

export type TResultadosSalida = {
  bin: string
  estado: string
  humedad: string
  piel_aderida: string
  calidad: string
  kilos: string
}