import { TFrutaEnGuiaSalida, TGuiaSalida } from "./TypesGuiaSalida.type";
import { TColors } from "./colors.type"


type PedidoMercadoInternoEstado =
  | 'Pedido Creado'
  | 'Pedido En Preparacion'
  | 'Pedido Completado'
  | 'Pedido Entregado y Finalizado'
  | 'Pedido Devuelto a Bodega';

type PedidoExportacionEstado =
  | 'Creado'
  | 'En Preparacion'
  | 'Completado'
  | 'Pedido Entregado y Finalizado'
  | 'Pedido Cancelado';

export type PedidoTipo = 'pedidomercadointerno' | 'pedidoexportacion';

const pedidoMercadoInternoColors: Record<PedidoMercadoInternoEstado, TColors> = {
  'Pedido Creado': 'sky',
  'Pedido En Preparacion': 'blue',
  'Pedido Completado': 'lime',
  'Pedido Entregado y Finalizado': 'emerald',
  'Pedido Devuelto a Bodega': 'amber',
};

const pedidoExportacionColors: Record<PedidoExportacionEstado, TColors> = {
  'Creado': 'sky',
  'En Preparacion': 'blue',
  'Completado': 'lime',
  'Pedido Entregado y Finalizado': 'emerald',
  'Pedido Cancelado': 'amber',
};

export const getButtonColor = (type: PedidoTipo, state: string): TColors => {
  if (type === 'pedidomercadointerno') {
    return pedidoMercadoInternoColors[state as PedidoMercadoInternoEstado] || 'zinc';
  } else if (type === 'pedidoexportacion') {
    return pedidoExportacionColors[state as PedidoExportacionEstado] || 'zinc';
  }
  return 'zinc';
}



type TTabsText =  'Fruta Solicitada' | 'Fruta En Pedido' | 'Despacho';

export type TTabsPedidos = {
  text: TTabsText;
};

type TTabsKey =  'FS' | 'FEP' | 'D';

export type TTabsKPedido = {
  [key in TTabsKey]: TTabsPedidos;
};

export const OPTIONS_PEDIDO: TTabsKPedido = {
  FS: { text: 'Fruta Solicitada' },
  FEP: { text: 'Fruta En Pedido' },
  D: { text: 'Despacho' }
}

export type TPedidos = {
  id: number,
  frutas_en_pedido: [],
  pedido: string,
  razon_social: string,
  despacho_retiro: boolean,
  fecha_entrega: string,
  estado_pedido: string,
  fecha_creacion: string,
  fecha_modificacion: string,
  id_pedido: number
  cliente?: string
  tipo_guia?: string
  id_guia?: number
}

export type TDespachoProducto = {
  
}


export type TDespacho = {
  id: number
  pedido: number
  fecha_despacho: string
  empresa_transporte: number
  camion: string
  nombre_chofer: string
  rut_chofer: string
  creado_por: string
  estado_despacho: string
  estado_despacho_label: string
  observaciones: string
  despacho_parcial: false
  productos_despacho: []
  direccion: {
    telefono: string
    direccion: string
    correo: string
  }
}

export type TDolar = {
  codigo: string
  nombre: string
  unidad_medida: string
  fecha: string
  valor: number
}

export type TFrutaEnPedido = {
  id: number
  codigo_fruta: string
  tipo_fruta_en_pedido: string
  tipo_fruta: string
  id_fruta: number
  cantidad: number
  calidad?: string
  calibre?: string
  variedad?: string
}

// Define the interface for FrutaPedido
export type TFrutaPedido = {
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

export type TFrutaDespacho = {
  id: number
  cantidad: number
  codigo_fruta: string
  tipo_fruta: string
  fecha_despacho: string
  despacho: number
}

// Define the interface for the main object



export type TTipoEmbalaje = {
 id: number,
 fecha_creacion: string
 fecha_modificacion: string
 nombre: string
 peso: number,
 archivo_impresora_cajas: null,
 archivo_impresora_termica: null
}


export type TFrutaExportacion = {
  id: number;
  fecha_creacion: string;
  fecha_modificacion: string;
  nombre_producto: string;
  calidad: string;
  variedad: string;
  calibre: string;
  kilos_solicitados: number;
  precio_kilo_neto: number;
  preparado: boolean;
  exportacion: number;
  formato: number;
  nombre_producto_label: string
  calidad_label: string
  variedad_label: string
  calibre_label: string
  formato_label: string
}

// Define the interface for the main object
export type TPedidoExportacion = {
  id: number;
  frutas: TFrutaExportacion[];
  fecha_creacion: string;
  fecha_modificacion: string;
  retira_cliente: boolean;
  tipo_venta: string;
  empresa_naviera: string;
  buque: string;
  puerto_descarga: string;
  fecha_envio: string;
  fecha_entrega: string;
  moneda_venta: string;
  tipo_flete: string;
  estado_pedido: string;
  estado_pedido_label: string;
  observaciones: string;
  empresa_transporte: string;
  camion: string;
  nombre_chofer: string;
  rut_chofer: string;
  numero_factura: string;
  terrestre: boolean;
  archivo_oc: string | null;
  numero_oc: string;
  tipo_despacho: string;
  fecha_facturacion: string;
  valor_dolar: number;
  cliente: number;
  sucursal_destino: string | null;
  solicitado_por_label: string
  creado_por: string | null;
  cliente_info: {
    nombre: string
    email: string
    telefono: string
    movil: string
    rut: string
  }
  moneda_venta_label: string
  tipo_despacho_label: string
  tipo_flete_label: string
  id_pedido_padre: number
}



export type TPDFGuiaSalida = {
  guia: TGuiaSalida
  fruta_en_guia: TFrutaEnGuiaMany[]
}

export type TPDFPedidoInterno = {
  pedido_interno: TPedidoInterno
  fruta_en_pedido: TFrutaEnGuiaMany[]

}

export type TPDFPedidoExportacion = {
  pedido_exportacion: TPedidoExportacion
  fruta_en_pedido: TFrutaEnGuiaMany[]
}

export type TFrutaEnGuiaMany = {
  codigo: string
  programa: string
  producto: string
  calidad: string
  variedad: string
  calibre: string
}

export type TPedido = {
  id: string
  frutas: TFrutaReal[]
  pedido: string
  mercado_interno: TPedidoInterno | false,
  exportacion: TPedidoExportacion | false
  guia_salida: TGuiaSalida | false,
  razon_social: string
  despacho_retiro: boolean
  fecha_entrega: string
  estado_pedido_label: string
  estado_pedido: string
  fecha_creacion: string
  fecha_modificacion: string
  id_pedido: number
  tipo_pedido: number
}

export type TPedidoInterno = {
  id: number
  fruta_pedido: number[]
  condicion_pago_label: string
  estado_pedido_label: string
  tipo_venta_label: string
  solicitado_por_label: string
  cliente_info: TClienteInfo
  // tipo_pedido: null,
  id_pedido_padre: number
  fecha_creacion: string
  fecha_modificacion: string
  retira_cliente: boolean
  fecha_entrega: string
  numero_oc: string
  archivo_oc: null | string
  condicion_pago: string
  estado_pedido: string
  observaciones: string
  quien_retira: string
  fecha_entrega_cliente: null | string
  tipo_venta: string
  fecha_facturacion: null | string
  valor_dolar_fact: number
  numero_factura: string
  cliente: number
  sucursal: number
  solicitado_por: number
  fruta_ficticia: TFrutaFictia[]
}

export type TFrutaFictia = {
  id: number
  fecha_creacion: string
  fecha_modificacion: string
  id_pedido: number
  nombre_producto: string
  calidad: string
  variedad: string
  calibre: string
  kilos_solicitados: number
  precio_kilo_neto: number
  preparado: boolean
  tipo_pedido: number
  formato: number
  nombre_producto_label: string
  calidad_label: string
  variedad_label: string
  calibre_label: string
  formato_label: string
  fruta_en_bin: boolean
}

export type TClienteInfo = {
  nombre: string
  telefono: string
  movil: string | null
  sucursal: string
  rut: string
  email: string
}

export type TFrutaReal = {
  id: number
  tipo_fruta_en_pedido: string
  codigo_fruta: string
  variedad: string
  calibre: string
  calidad: string
  fecha_creacion: string
  fecha_modificacion: string
  id_fruta: number
  cantidad: number
  despachado: boolean
  pedido: number
  tipo_fruta: number
  kilos: number
  peso_caja: number | false
}

export type TPPTParaPedido =   {
  id: number
  total_cajas_ptt: number
  peso_total_ptt: number
  fecha_creacion: string
  fecha_modificacion: string
  numero_pallet: number
  calle_bodega: string
  observaciones: string
  codigo_pallet: string
  estado_pallet: string
  embalaje: number
  registrado_por: number
  calidad: string
  variedad: string
  calibre: string
  tipo_producto: string
  peso_caja: number | false 
}