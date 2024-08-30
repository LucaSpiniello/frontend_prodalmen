import { TFrutaFictia } from "./TypesPedidos.types";

export type TGuiaSalida = {
  id: number;
  id_pedido_padre: number;
  tipo_salida_label: string;
  estado_guia_salida_label: string;
  fecha_creacion: string;
  fecha_modificacion: string;
  id_cliente: number;
  fecha_entrega: string;
  retira_cliente: boolean;
  observaciones: string;
  fruta_pedido: number[ ]
  quien_retira: string;
  tipo_salida: string;
  estado_guia_salida: string;
  guia_autorizada: boolean;
  tipo_cliente: number;
  solicitado_por: number;
  tipo_cliente_label: string
  nombre_cliente: string
  cliente_info: {
    nombre: string
    email: string
    rut: string
  }
  solicitado_por_label: string
  sucursal: number
  fruta_ficticia: TFrutaFictia[]
}


export type TFrutaSolicitadaGuia = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  nombre_producto: string;
  nombre_producto_label: string
  calidad: string;
  calidad_label: string
  variedad: string;
  variedad_label: string
  calibre: string;
  calibre_label: string
  kilos_solicitados: number;
  precio_kilo_neto: number;
  preparado: boolean;
  formato: number;
  formato_label: string
}

export type TFrutaEnGuiaSalida = {
  id: number
  codigo_fruta: string
  tipo_fruta_en_pedido: string
  tipo_fruta: string
  id_fruta: number
  cantidad: number
}

export type TClienteParaGuia = {
  nombre: string,
  id_cliente: number,
  content_type_id: number
}