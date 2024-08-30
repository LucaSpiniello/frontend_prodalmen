import { TSelectOptions } from "../components/form/SelectReact"
import { BANCOS, BODEGAS, CALIBRES, CALIDAD, CALIDAD_FRUTA, CALLE_BODEGA, CANTIDAD_MUESTRA_PRODUCCION, CONDICION_PAGO_NOTAPEDIDO, DESPACHO_EMBALAJE, NOMBRE_PRODUCTO, PARAMETRO_HARINA, PERDIDAPROGRAMA, RESULTADO_RECHAZO, TIPOS_BIN, TIPOS_GUIA_SALIDA, TIPOS_OPERARIO, TIPOS_RECHAZOS, TIPO_ACOPLADO, TIPO_CLIENTE, TIPO_CUENTA, TIPO_FLETE, TIPO_INVENTARIO, TIPO_PROCESO, TIPO_PRODUCTOS_RECEPCIONMP, TIPO_PROGRAMA_PLANTA_HARINA, TIPO_RESULTANTE, TIPO_RESULTANTE_SELECCION, TIPO_SUBPRODUCTO, TIPO_VENTA, UBICACION_PATIO_TECHADO_EXT, UBICACION_PRODUCTO, VARIEDADES_MP, Years } from "./constante"

const acoplados = TIPO_ACOPLADO?.map((acoplado) => ({
  value: acoplado.values,
  label: acoplado.label
})) ?? []


export const optionsOperarios = TIPOS_OPERARIO.map((operario) => ({
  value: operario.values,
  label: operario.label
})) ?? []

const resultadosRechazo = RESULTADO_RECHAZO?.map((resultado) => ({
  value: String(resultado.value),
  label: resultado.label
  })) ?? []


export const variedadFilter = VARIEDADES_MP?.map((producto) => ({
  value: String(producto.value),
  label: producto.label
})) ?? []

export const tipoFrutaFilter = TIPO_PRODUCTOS_RECEPCIONMP?.map((producto) => ({
  value: String(producto.value),
  label: producto.label
})) ?? []

export const tipoResultante = TIPO_RESULTANTE?.map((tipo) => ({
  value: String(tipo.value),
  label: tipo.label
}))


export const optionsRadio = [
  { id: 1, value: true, label: 'Si'},
  { id: 2, value: false, label: 'No'}
];



export const optionsAcoplado: TSelectOptions | [] = acoplados
export const optionResultados: TSelectOptions | [] = resultadosRechazo

type OptionType = {
  value: string;
  label: string;
};

export const cargolabels = (perfilData: any) => {
  if (!perfilData) {
    return [];
  }

  const cargoLabels = perfilData.cargos.map((cargo: any) => cargo.cargo_label) || [];

  return cargoLabels;
};

export const optionYear: TSelectOptions | [] = Years?.map((year) => ({
  value: String(year.value),
  label: year.label
})) ?? []

export const optionsUbicaciones: TSelectOptions | []  = UBICACION_PATIO_TECHADO_EXT?.map((ubicacion) => ({
  value: ubicacion.value,
  label: ubicacion.label
})) ?? []

export const optionTipoResultante: TSelectOptions | [] = TIPO_RESULTANTE?.map((tipo) => ({
  value: String(tipo.value),
  label: tipo.label
})) ?? []

export const optionCalleBodega: TSelectOptions | [] = CALLE_BODEGA?.map((calle) => ({
  value: String(calle.value),
  label: calle.label
})) ?? []

export const optionTipoPatineta: TSelectOptions | [] = TIPOS_BIN?.map((patineta) => ({
  value: String(patineta.value),
  label: patineta.label
})) ?? []

export const optionsVariedad: TSelectOptions | [] = VARIEDADES_MP?.map((variedad) => ({
  value: String(variedad.value),
  label: variedad.label
})) ?? []

export const optionsCantidadMuestra: TSelectOptions | [] = CANTIDAD_MUESTRA_PRODUCCION?.map((cantidad) => ({
  value: String(cantidad.value),
  label: cantidad.label
})) ?? []

export const optionsTipoResultanteSeleccion: TSelectOptions | [] = TIPO_RESULTANTE_SELECCION?.map((tipo) => ({
  value: tipo.value,
  label: tipo.label
})) ?? []

export const optionsBodegas: TSelectOptions | [] = BODEGAS.map((bodega) => ({
  value: String(bodega.value).toUpperCase(),
  label: bodega.label
})) ?? []

export const optionsBodegasB: TSelectOptions | [] = BODEGAS.map((bodega) => ({
  value: String(bodega.value),
  label: bodega.label
})) ?? []

export const optionsTipoSubProducto: [] | TSelectOptions = TIPO_SUBPRODUCTO.map((tipo) => ({
  value: String(tipo.value),
  label: tipo.label
}))


export const optionsCalidad = CALIDAD.flatMap(category => 
  category.options.map(option => ({
      value: String(option.value),
      label: option.label
  }))
);

export const optionsFrutaCalidad = CALIDAD_FRUTA.map((calidad) => ({
  value: String(calidad.value),
  label: calidad.label
}))

export const optionsCondicionPago = CONDICION_PAGO_NOTAPEDIDO.map((nota) => ({
  value: nota.value,
  label: nota.label
}))

export const optionTipoVenta = TIPO_VENTA.map((tipo) => ({
  value: String(tipo.value),
  label: tipo.label
}))

export const optionsTipoFlete = TIPO_FLETE.map((flete) => ({
  value: flete.value,
  label: flete.label
}))

export const optionstipoDespacho = DESPACHO_EMBALAJE.map((despacho) => ({
  value: despacho.value,
  label: despacho.label
}))

export const optionsNombreProducto = NOMBRE_PRODUCTO.map((producto) => ({
  value: producto.value,
  label: producto.label
}))

export const optionsTipoSalida: TSelectOptions = TIPOS_GUIA_SALIDA.map((tipo) => ({
  value: tipo.value,
  label: tipo.label
}))

export const optionTipoCliente: TSelectOptions = TIPO_CLIENTE.map((tipo) => ({
  value: tipo.value,
  label: tipo.label
}))

export const optionTipoRechazoPlantaHarina: TSelectOptions = TIPOS_RECHAZOS.map((tipo) => ({
  value: tipo.value,
  label: tipo.label
}))

export const optionsTipoPerdidaProgramaPlantaHarina: TSelectOptions = PERDIDAPROGRAMA.map((perdida) => ({
  value: perdida.value,
  label: perdida.label
}))

export const optionsTipoProgramaPlantaHarina: TSelectOptions = TIPO_PROGRAMA_PLANTA_HARINA.map((tipo) => ({
  value: tipo.value,
  label: tipo.label
}))

export const optionsUbicacionProducto: TSelectOptions = UBICACION_PRODUCTO.map((ubicacion) => ({
  value: ubicacion.value,
  label: ubicacion.label
}))

export const optionsTipoProceso: TSelectOptions = TIPO_PROCESO.map((proceso) => ({
  value: proceso.value,
  label: proceso.label
}))

export const optionsParametrosCCProceso: TSelectOptions = PARAMETRO_HARINA.map((parametro) => ({
  value: parametro.value,
  label: parametro.label
}))

// export const optionsBodegas: TSelectOptions = BODEGAS.map((bodega) => ({
//   value: bodega.value,
//   label: bodega.label
// }))

export const optionsBancos: TSelectOptions = BANCOS.map((banco) => ({
  value: banco.value,
  label: banco.label
}))

export const optionsTipoCuenta: TSelectOptions = TIPO_CUENTA.map((cuenta) => ({
  value: cuenta.value,
  label: cuenta.label
}))

export const optionsTipoInventario: TSelectOptions = TIPO_INVENTARIO.map((invento) => ({
  value: invento.value,
  label: invento.label
}))



export const optionsCalibres: OptionType[] = CALIBRES.reduce<OptionType[]>((acc, categoria) => {
  // Itera sobre las categorías y calibres para generar las opciones
  const opcionesCategoria = categoria.calibres.map((calibre) => ({
    value: calibre.id,
    label: calibre.name,
  }));
  // Concatena las opciones de esta categoría con las opciones acumuladas
  return [...acc, ...opcionesCategoria];
}, []);





