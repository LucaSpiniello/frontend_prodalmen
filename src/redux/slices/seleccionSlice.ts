import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FetchOptions, PostOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenPost } from "../../utils/peticiones.utils";
import { TBinBodega, TBinSubProducto, THistoricoBinSubProducto, TOperarioEnSeleccion, TOperarioSeleccion, TPDFEntradaSeleccion, TPDFSalidaSeleccion, TPepaParaSeleccion, TRendimientoSeleccion, TSeleccion, TSubproducto, TTarjaSeleccionada, TSubProductoMetrica } from "../../types/TypesSeleccion.type";
import toast from "react-hot-toast";
import { TMensajeCierreProduccion, TMensajeTerminoProduccion } from "../../types/TypesProduccion.types";
import { TAuth, TVerificar } from "../../types/TypesRegistros.types";

export const fetchProgramasDeSeleccion = createAsyncThunk('seleccion/fetch_seleccion', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload

    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/seleccion/`, token_verificado)
      if(response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400){
        return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  }
)

export const fetchProgramaSeleccion = createAsyncThunk('seleccion/fetch_seleccion_individual', 
async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})

export const fetchTarjasSeleccionadas = createAsyncThunk('seleccion/fetch_tarjas_resultantes', 
async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/tarjaseleccionada/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})

export const fetchBinsPepaCalibrada = createAsyncThunk('seleccion/fetch_bins_calibrados', 
async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/binspepacalibrada/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})

export const fetchSubProductosOperarios = createAsyncThunk('seleccion/fetch_subproductos', 
  async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/subproductooperario/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})


// export const fetchOperariosEnSeleccion = createAsyncThunk('seleccion/fetch_operarios_seleccion', 
//   async (payload: FetchOptions, thunkAPI) => {
//   const { id, token, verificar_token } = payload

//   try {
//     const token_verificado = await verificar_token(token)
  
//     if (!token_verificado) throw new Error('Token no verificado')
//     const response = await fetchWithToken(`api/seleccion/${id}/operarios/lista_filtrada_por_operario_seleccion/`, token_verificado)
//     if(response.ok){
//       const data = await response.json()
//       return data
//     } else if (response.status === 400){
//       return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
//     }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
//   }
// })

export const fetchOperariosEnSeleccion = createAsyncThunk('seleccion/fetch_operarios_seleccion', 
  async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/lista_operarios_dias/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})

export const fetchOperariosPorDiaEnSeleccion = createAsyncThunk('seleccion/fetch_operarios_por_dia_seleccion', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, params, verificar_token } = payload
  //@ts-ignore
  const { rut } = params


  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/seleccion/${id}/operarios/lista_detalle_dias_operario_seleccion/ `, { rut: rut }, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
})

export const fetchRendimientoSeleccion = createAsyncThunk('seleccion/fetch_rendimiento_seleccion', 
async (payload: PostOptions, thunkAPI) => {
const { id, token, verificar_token } = payload
//@ts-ignore


try {
  const token_verificado = await verificar_token(token)

  if (!token_verificado) throw new Error('Token no verificado')
  const response = await fetchWithToken(`api/seleccion/${id}/rendimiento_bin_seleccion/`, token_verificado)
  if(response.ok){
    const data = await response.json()
    return data
  } else if (response.status === 400){
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
} catch (error) {
  return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
}
})

export const fetchPDFEntradaSeleccion = createAsyncThunk('seleccion/fetch_pdf_entrada_seleccion', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload
  //@ts-ignore


  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/pdf_documento_entrada_en_seleccion/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
  })

  export const fetchPDFSalidaSeleccion = createAsyncThunk('seleccion/fetch_pdf_salida_seleccion', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload
  //@ts-ignore


  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/pdf_documento_salida_en_seleccion/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
  })

  export const fetchSubProductoLista = createAsyncThunk('seleccion/fetch_subproductos_seleccion', 
      async (payload: PostOptions, thunkAPI) => {
      const { id, token, verificar_token } = payload
      //@ts-ignore


      try {
        const token_verificado = await verificar_token(token)

        if (!token_verificado) throw new Error('Token no verificado')
        const response = await fetchWithToken(`api/seleccion/subproductos_para_agrupacion/`, token_verificado)
        if(response.ok){
          const data = await response.json()
          return data
        } else if (response.status === 400){
          return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    } 
  })

  export const fetchSubProductoListaSinFiltros = createAsyncThunk('seleccion/fetch_subproductos_seleccion_sin_filtros', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload
  //@ts-ignore


  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/subproductos_lista/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
} 
})

  export const fetchBinSubProductos = createAsyncThunk('seleccion/fetch_bins_subproductos/', 
      async (payload: PostOptions, thunkAPI) => {
      const { id, token, verificar_token } = payload

      try {
        const token_verificado = await verificar_token(token)

        if (!token_verificado) throw new Error('Token no verificado')
        const response = await fetchWithToken(`api/binsubproductoseleccion/`, token_verificado)
        if(response.ok){
          const data = await response.json()
          return data
        } else if (response.status === 400){
          return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
        }
      } catch (error) {
        return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    } 
  })

  export const fetchDetalleBinSubproducto = createAsyncThunk('seleccion/fetch_bin_subproducto_detalle/', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/binsubproductoseleccion/${id}/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
} 
})

export const fetchUltimosProgramasSeleccion = createAsyncThunk('seleccion/fetch_ultimos_programas/', 
async (payload: PostOptions, thunkAPI) => {
const { id, token, verificar_token } = payload

try {
  const token_verificado = await verificar_token(token)

  if (!token_verificado) throw new Error('Token no verificado')
  const response = await fetchWithToken(`api/seleccion/ultimos_programas_seleccion/`, token_verificado)
  if(response.ok){
    const data = await response.json()
    return data
  } else if (response.status === 400){
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  }
} catch (error) {
  return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
} 
})

export const fetchHistoricoBinSubProducto = createAsyncThunk('seleccion/fetch_bin_historico_subproducto/', 
  async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/binsubproductoseleccion/${id}/historico/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  } 
})

export const fetchMetricasSubproducto = createAsyncThunk('seleccion/fetch_metricas_subproducto/', 
  async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/seleccion/${id}/subproducto_metricas/`, token_verificado)
    if(response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  } 
})



// POST ACCIONES
export const registrar_bines_procesados_masivamente = createAsyncThunk('seleccion/registrar_bines_procesados_masivamente/', 
  async (payload: PostOptions, thunkAPI) => {
  const { id, token, data, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/seleccion/${id}/binspepacalibrada/procesado-masivo/`,data, token_verificado)
    if(response.ok){
      const data = await response.json()
      thunkAPI.dispatch(fetchBinsPepaCalibrada({ id, token, verificar_token }))
      thunkAPI.dispatch(fetchProgramaSeleccion({ id, token, verificar_token }))
      return data
    } else if (response.status === 400){
      return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  } catch (error) {
    return thunkAPI.rejectWithValue(`No se pudo hacer la petición`)
  } 
})

export const fetchMensajeTerminoSeleccion = createAsyncThunk<TMensajeTerminoProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeTerminoSeleccion`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/seleccion/${id_programa}/estado_termino_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error obtener mensaje termino seleccion')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMensajeCierreSeleccion = createAsyncThunk<TMensajeCierreProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeCierreSeleccion`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/seleccion/${id_programa}/estado_cierre_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener mensaje cierre seleccion')
      return rejectWithValue(error.response.data)
    }
  }
)




const initialState = {
  programas_seleccion: [] as TSeleccion[],
  programa_seleccion_individual: null as TSeleccion | null,
  tarjas_seleccionadas: [] as TTarjaSeleccionada[],
  tarja_seleccionada_individual: null as TTarjaSeleccionada | null,
  bins_pepas_calibradas: [] as TPepaParaSeleccion[],
  bin_pepa_calibrada_individual: null as TPepaParaSeleccion | null,
  sub_productos_operarios: [] as TSubproducto[],
  sub_producto_operario_individual: null as TSubproducto | null,
  nuevos_bin_seleccion: [] as TBinBodega[],
  loading: false,
  error: null as string | null | undefined,





  pdf_detalle_entrada: [] as TPDFEntradaSeleccion[],
  pdf_detalle_salida: null as TPDFSalidaSeleccion | null,

  detalle_rendimiento: null as TRendimientoSeleccion | null,

  subproducto_list: [] as TSubproducto[],


  lista_subproducto_sin_filtros: [] as TSubproducto[],


  subproductos_para_agrupar: [] as TSubproducto[],
  subproducto_agrupados: [] as TSubproducto[],
  subproducto_metricas: [] as TSubProductoMetrica[],


  lista_bin_subproductos: [] as TBinSubProducto[],
  bin_subproducto_detalle: null as TBinSubProducto | null,

  ultimos_programas_seleccion: [] as TSeleccion[],




  historico_bin_subproducto: [] as THistoricoBinSubProducto[],

  operarios_seleccion: [] as TOperarioEnSeleccion[],
  operario_seleccion_individual: [] as TOperarioSeleccion[],
  mensajeTerminoSeleccion: null as TMensajeTerminoProduccion | null,
  mensajeCierreSeleccion: null as TMensajeCierreProduccion | null
};

export const SeleccionSlice = createSlice({
  name: 'seleccion',
  initialState,
  reducers: {
    GUARDAR_BIN_SELECCION: (state, action) => {
      state.nuevos_bin_seleccion.push(action.payload) 
    },
    QUITAR_BIN_SELECCION: (state, action) => {
      state.nuevos_bin_seleccion = state.nuevos_bin_seleccion.filter(bin => bin.id !== action.payload)
    },
    VACIAR_TABLA: state => {
      state.nuevos_bin_seleccion = [];
    },


    QUITAR_SUBPRODUCTO_EN_LISTA: (state, action) => {
      state.subproducto_list = state.subproducto_list.filter(sub => sub.id !== action.payload)
    },
    GUARDAR_SUBPRODUCTO_EN_LISTA: (state, action) => {
      state.subproducto_list.push(action.payload)
    },



    GUARDAR_SUBPRODUCTO_A_AGRUPAR: (state, action) => {
      state.subproductos_para_agrupar.push(action.payload)
    },
    QUITAR_SUBPRODUCTO_EN_AGRUPACION: (state, action) => {
      state.subproductos_para_agrupar = state.subproductos_para_agrupar.filter(sub => sub.id !== action.payload)
    },
    VACIAR_AGRUPACION: state => {
      state.subproductos_para_agrupar = []
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramasDeSeleccion.fulfilled, (state, action) => {
        state.programas_seleccion = action.payload
      })
      .addCase(fetchProgramaSeleccion.fulfilled, (state, action) => {
        state.programa_seleccion_individual = action.payload
      })
      .addCase(fetchTarjasSeleccionadas.fulfilled, (state, action) => {
        state.tarjas_seleccionadas = action.payload
      })
      .addCase(fetchBinsPepaCalibrada.fulfilled, (state, action) => {
        state.bins_pepas_calibradas = action.payload
      })
      .addCase(fetchSubProductosOperarios.fulfilled, (state, action) => {
        state.sub_productos_operarios = action.payload
      })
      .addCase(fetchOperariosEnSeleccion.fulfilled, (state, action) => {
        state.operarios_seleccion = action.payload
      })
      .addCase(fetchOperariosPorDiaEnSeleccion.fulfilled, (state, action) => {
        state.operario_seleccion_individual = action.payload
      })
      .addCase(fetchRendimientoSeleccion.fulfilled, (state, action) => {
        state.detalle_rendimiento = action.payload
      })
      .addCase(fetchPDFEntradaSeleccion.fulfilled, (state, action) => {
        state.pdf_detalle_entrada = action.payload
      })
      .addCase(fetchPDFSalidaSeleccion.fulfilled, (state, action) => {
        state.pdf_detalle_salida = action.payload
      })
      .addCase(fetchSubProductoLista.fulfilled, (state, action) => {
        state.subproducto_list = action.payload
      })
      .addCase(fetchBinSubProductos.fulfilled, (state, action) => {
        state.lista_bin_subproductos = action.payload
      })
      .addCase(fetchDetalleBinSubproducto.fulfilled, (state, action) => {
        state.bin_subproducto_detalle = action.payload
      })
      .addCase(fetchSubProductoListaSinFiltros.fulfilled, (state, action) => {
        state.lista_subproducto_sin_filtros = action.payload
      })

      .addCase(fetchHistoricoBinSubProducto.fulfilled, (state, action) => {
        state.historico_bin_subproducto = action.payload
      })

      .addCase(fetchMetricasSubproducto.fulfilled, (state, action) => {
        state.subproducto_metricas = action.payload
      })
      .addCase(fetchMensajeTerminoSeleccion.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMensajeTerminoSeleccion.fulfilled, (state, action) => {
        state.mensajeTerminoSeleccion = action.payload
        state.loading = false
      })
      .addCase(fetchMensajeTerminoSeleccion.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(fetchMensajeCierreSeleccion.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMensajeCierreSeleccion.fulfilled, (state, action) => {
        state.mensajeCierreSeleccion = action.payload
        state.loading = false
      })
      .addCase(fetchMensajeCierreSeleccion.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      
      
    
  }
});

export const { 
  GUARDAR_BIN_SELECCION,
  QUITAR_BIN_SELECCION,
  VACIAR_TABLA,

  GUARDAR_SUBPRODUCTO_A_AGRUPAR,
  QUITAR_SUBPRODUCTO_EN_AGRUPACION,
  QUITAR_SUBPRODUCTO_EN_LISTA,
  GUARDAR_SUBPRODUCTO_EN_LISTA,
  VACIAR_AGRUPACION
} = SeleccionSlice.actions

export default SeleccionSlice.reducer