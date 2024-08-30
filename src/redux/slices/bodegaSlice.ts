import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CodigoScaneados, PDFDetalladoInventario, PDFResumidoInventario, TAgrupacion, TBinesInventario, TBodegaG1, TBodegaG2, TBodegaG3, TBodegaG4, TBodegaNeutro, TInventarios, TPDFBodegas, TPatioTechadoEx } from '../../types/TypesBodega.types';
import { FetchOptions, PostOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenPatch, fetchWithTokenPost } from '../../utils/peticiones.utils';
import { TBinBodega } from '../../types/TypesSeleccion.type';
import { TAuth, TVerificar } from '../../types/TypesRegistros.types';
import toast from 'react-hot-toast';



export const fetchPatioTechadoExterior = createAsyncThunk('patio-exterior/fetch_lotes_patio', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/patio-exterior`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const fetchLotePatioTechadoExterior = createAsyncThunk('patio-exterior/fetch', 
  async (payload: FetchOptions, ThunkApi) => {
    const { id, token, verificar_token } = payload

    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/patio-exterior/${id}/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se pudo hacer la petición')
      }
    } catch (error) {
        return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  }
)





export const fetchBodegasG1 = createAsyncThunk('bodegag1/fetch_bodegag1', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/bodega-g1`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBodegasG2 = createAsyncThunk('bodegag1/fetch_bodegag2', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/bodega-g2`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBodegasG3 = createAsyncThunk('bodegag1/fetch_bodegag3', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/bodega-g3`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBodegasG4 = createAsyncThunk('bodegag1/fetch_bodegag4', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/bodega-g4`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBinBodega = createAsyncThunk('seleccion/fetch_bin_bodega', 
  async (payload: FetchOptions, thunkAPI) => {
  const { params, token, verificar_token } = payload
  //@ts-ignore
  const { search } = params

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/bin-bodega/bodegas/${search}`, token_verificado)
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

// export const fetchBinBodegaG1G2 = createAsyncThunk('seleccion/fetch_bin_bodega_g1_g2', 
//   async (payload: FetchOptions, thunkAPI) => {
//   const { token, verificar_token } = payload

//   try {
//     const token_verificado = await verificar_token(token)
  
//     if (!token_verificado) throw new Error('Token no verificado')
//     const response = await fetchWithToken(`api/bin-bodega/bodegas_g1_g2/`, token_verificado)
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


export const fetchBinBodegaAgrupado = createAsyncThunk('seleccion/fetch_bin_bodega_agrupado', 
  async (payload: PostOptions, thunkAPI) => {
  const { params, token, verificar_token } = payload
  //@ts-ignore
  const { modelo } = params


  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/bin-bodega/bodegas_en_agrupacion/`, 
    {
      modelo: modelo
    },
    token_verificado)
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


export const fetchBinsAgrupados = createAsyncThunk('seleccion/fetch_bins_agrupados', 
  async (payload: FetchOptions, thunkAPI) => {
  const { token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/agrupacion/`, token_verificado)
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

export const fetchBinAgrupado = createAsyncThunk('seleccion/fetch_bin_agrupado', 
  async (payload: FetchOptions, thunkAPI) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithToken(`api/agrupacion/${id}/`, token_verificado)
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


export const fetchLotesParaProduccion = createAsyncThunk('patio-exterior/fetch_lotes_patio_para_produccion', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/patio-exterior/lotes_para_produccion/`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchPDFBodegas = createAsyncThunk('patio-exterior/fetch_pdf_bodegas', 
  async (payload: FetchOptions) => {
    const { token, verificar_token, params } = payload;
    // @ts-ignore
    const { search } = params

    

    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithToken(`api/bin-bodega/pdf_bodegas/${search}`,  token_verificado);
  
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
  
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const fetchInventarios = createAsyncThunk('patio-exterior/fetch_inventario', 
  async (payload: FetchOptions) => {
    const { token, verificar_token } = payload;
    try {
       const token_verificado = await verificar_token(token)
       if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/inventarios`, token_verificado);
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchInventario = createAsyncThunk('patio-exterior/fetch_inventario_individual', 
  async (payload: FetchOptions) => {
    const { id, token, verificar_token } = payload;
    try {
       const token_verificado = await verificar_token(token)
       if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/inventarios/${id}/`, token_verificado);
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBinInventario = createAsyncThunk('patio-exterior/fetch_bin_inventario', 
  async (payload: FetchOptions) => {
    const { id, token, verificar_token } = payload;
    try {
       const token_verificado = await verificar_token(token)
       if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/inventarios/${id}/bins`, token_verificado);
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        console.log('pequeño error')
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const listaBinBodegaFiltroThunk = createAsyncThunk<TBinBodega[], {token: TAuth | null, filtro: string | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
    'patio_exterior/listaBinBodegaFiltroThunk',
    async ({token, filtro, verificar_token}, {rejectWithValue}) => {
        try {
            const token_verificado = await verificar_token(token)
            if (!token_verificado) throw new Error('Token no verificado')
            const response = await fetchWithToken(`api/bin-bodega/?bodegas=${filtro}`, token_verificado);
            const data = await response.json()
            if (response.ok) {
                return data
            } else {
                toast.error('Error en la lista bodega')
                return rejectWithValue(data)
            }
        } catch (error: any) {
            toast.error('Error en la lista bodega')
            return rejectWithValue(error.response.data)
        }
    }
)

export const pdfResumidoInventario = createAsyncThunk<PDFResumidoInventario, {token: TAuth | null, verificar_token: TVerificar, id_inventario?: string | number}, {rejectValue: string}>(
  'patio_exterior/pdfResumidoInventario',
  async ({token, verificar_token, id_inventario}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/inventarios/${id_inventario}/pdf_resumido`, token_verificado);
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        toast.error('Error en el pdf inventario')
        return rejectWithValue(data)
      }
    } catch (error: any) {
      toast.error('Error en el pdf inventario')
      return rejectWithValue(error.response.data)
    }
  }
)

export const pdfDetalladoInventario = createAsyncThunk<PDFDetalladoInventario, {token: TAuth | null, verificar_token: TVerificar, id_inventario?: string | number}, {rejectValue: string}>(
  'patio_exterior/pdfDetalladoInventario',
  async ({token, verificar_token, id_inventario}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/inventarios/${id_inventario}/pdf_detallado`, token_verificado);
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        toast.error('Error en el pdf inventario')
        return rejectWithValue(data)
      }
    } catch (error: any) {
      toast.error('Error en el pdf inventario')
      return rejectWithValue(error.response.data)
    }
  }
)

export const cerrarInventario = createAsyncThunk<TInventarios, {token: TAuth | null, verificar_token: TVerificar, id_inventario?: string | number}, {rejectValue: string}>(
  'patio_exterior/cerrarInventario',
  async ({token, verificar_token, id_inventario}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenPatch(`api/inventarios/${id_inventario}/`, {estado: '1'}, token_verificado);
      const data = await response.json()
      if (response.ok) {
        return data
      } else {
        toast.error('Error en el pdf inventario')
        return rejectWithValue(data)
      }
    } catch (error: any) {
      toast.error('Error en el pdf inventario')
      return rejectWithValue(error.response.data)
    }
  }
)


const initialState = {

  inventarios: [] as TInventarios[],
  inventario: null as TInventarios | null,
  bin_inventario: [] as TBinesInventario[],

  codigo_scaneados_qr: [] as string[],


  patio_techado_ext: [] as TPatioTechadoEx[],
  patio_techado: null as TPatioTechadoEx | null,

  lotes_para_produccion: [] as TPatioTechadoEx[],



  bodega_g1: [] as TBodegaG1[],
  bodega_g1_individual: null as TBodegaG2 | null,
  bodega_g2: [] as TBodegaG2[],
  bodega_g2_individual: null as TBodegaG2 | null,
  bodega_g3: [] as TBodegaG3[],
  bodega_g3_individual: null as TBodegaG4 | null,
  bodega_g4: [] as TBodegaG3[],
  bodega_g4_individual: null as TBodegaG4 | null,
  bin_bodega: [] as TBinBodega[],



  bin_bodega_agrupacion: [] as TBinBodega[],



  bins_agrupados: [] as TAgrupacion[],
  bin_agrupado: null as TAgrupacion | null,
  bines_en_agrupacion: [] as TBinBodega[],


  bins_para_fruta_en_pedido: [] as TBinBodega[],
  bins_seleccionados_en_fruta_pedido: [] as TBinBodega[],
 

  pdf_bodegas: [] as TPDFBodegas[],
  pdfResumidoInventario: null as PDFResumidoInventario | null,
  pdfDetalladoInventario: null as PDFDetalladoInventario | null,

  loading: false,
  error: null as string | null | undefined
};

export const BodegasSlice = createSlice({
  name: 'patio_exterior',
  initialState,
  reducers: {
    GUARDAR_LOTE: (state, action) => {
      state.patio_techado_ext = action.payload
    },
    AGREGAR_BIN_BODEGA: (state, action) => {
      state.bin_bodega.push(action.payload)
    },
    QUITAR_BIN_BODEGA: (state, action) => {
      state.bin_bodega = state.bin_bodega.filter(bin => bin.id !== action.payload)
      state.bin_bodega_agrupacion = state.bin_bodega_agrupacion.filter(bin => bin.id !== action.payload)
    },


    GUARDAR_BIN_AGRUPADO: (state, action) => {
      state.bines_en_agrupacion.push(action.payload)
    },
    QUITAR_BIN_AGRUPADO: (state, action) => {
      state.bines_en_agrupacion = state.bines_en_agrupacion.filter(bin => bin.id !== action.payload)
    },
    VACIAR_TABLA_BIN_AGRUPADO: (state) => {
      state.bines_en_agrupacion = []
    },


    
    GUARDAR_BIN_SELECCIONADO_PARA_PEDIDO: (state, action) => {
      state.bins_seleccionados_en_fruta_pedido.push(action.payload)
    },
    QUITAR_BIN_DE_FRUTA_PARA_PEDIDO: (state, action) => {
      state.bins_seleccionados_en_fruta_pedido = state.bins_seleccionados_en_fruta_pedido.filter(fruta => fruta.id != action.payload)
    },
    LIMPIAR_BIN_SELECCIONADO_PARA_PEDIDO: state => {
      state.bins_seleccionados_en_fruta_pedido = []
    },




    AGREGAR_CODIGO_SCANEADO: (state, action) => {
      state.codigo_scaneados_qr.push(action.payload)
    },

    LIMPIAR_CODIGO_SCANEADO: state => {
      state.codigo_scaneados_qr = []
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchPatioTechadoExterior.fulfilled, (state, action) => {
      state.patio_techado_ext = action.payload
    })
    .addCase(fetchLotePatioTechadoExterior.fulfilled, (state, action) => {
      state.patio_techado = action.payload
    })
    .addCase(fetchBodegasG1.fulfilled, (state, action) => {
      state.bodega_g1 = action.payload
    })
    .addCase(fetchBodegasG2.fulfilled, (state, action) => {
      state.bodega_g2 = action.payload
    })
    .addCase(fetchBodegasG3.fulfilled, (state, action) => {
      state.bodega_g3 = action.payload
    })
    .addCase(fetchBodegasG4.fulfilled, (state, action) => {
      state.bodega_g4 = action.payload
    })
    .addCase(fetchBinBodega.fulfilled, (state, action) => {
      state.bin_bodega = action.payload
      state.bins_para_fruta_en_pedido = action.payload
    })
    // .addCase(fetchBinBodegaG1G2.fulfilled, (state, action) => {
    //   state.bin_bodega = action.payload
    // })
    .addCase(fetchBinsAgrupados.fulfilled, (state, action) => {
      state.bins_agrupados = action.payload
    })
    .addCase(fetchBinAgrupado.fulfilled, (state, action) => {
      state.bin_agrupado = action.payload
    })
    .addCase(fetchBinBodegaAgrupado.fulfilled, (state, action) => {
      state.bin_bodega_agrupacion = action.payload
    })
    .addCase(fetchLotesParaProduccion.fulfilled, (state, action) => {
      state.lotes_para_produccion = action.payload
    })

    .addCase(fetchPDFBodegas.fulfilled, (state, action) => {
      state.pdf_bodegas = action.payload
    })

    .addCase(fetchInventarios.fulfilled, (state, action) => {
      state.inventarios = action.payload
    })

    .addCase(fetchInventario.fulfilled, (state, action) => {
      state.inventario = action.payload
    })

    .addCase(fetchBinInventario.fulfilled, (state, action) => {
      state.bin_inventario = action.payload
    })
    .addCase(listaBinBodegaFiltroThunk.pending, (state) => {
        state.loading = true
    })
    .addCase(listaBinBodegaFiltroThunk.fulfilled, (state, action) => {
        state.loading = false
        state.bin_bodega = action.payload
        state.error = null
    })
    .addCase(listaBinBodegaFiltroThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(pdfResumidoInventario.pending, (state) => {
        state.loading = true
    })
    .addCase(pdfResumidoInventario.fulfilled, (state, action) => {
        state.loading = false
        state.pdfResumidoInventario = action.payload
        state.error = null
    })
    .addCase(pdfResumidoInventario.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(pdfDetalladoInventario.pending, (state) => {
      state.loading = true
    })
    .addCase(pdfDetalladoInventario.fulfilled, (state, action) => {
        state.loading = false
        state.pdfDetalladoInventario = action.payload
        state.error = null
    })
    .addCase(pdfDetalladoInventario.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
    })
    .addCase(cerrarInventario.pending, (state) => {
      state.loading = true
    })
    .addCase(cerrarInventario.fulfilled, (state, action) => {
        state.loading = false
        state.inventario = action.payload
        state.error = null
    })
    .addCase(cerrarInventario.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
    })
  }
});

export const { 
  GUARDAR_LOTE,
  QUITAR_BIN_BODEGA,
  AGREGAR_BIN_BODEGA,
  GUARDAR_BIN_AGRUPADO,
  QUITAR_BIN_AGRUPADO,
  VACIAR_TABLA_BIN_AGRUPADO,
  QUITAR_BIN_DE_FRUTA_PARA_PEDIDO,
  GUARDAR_BIN_SELECCIONADO_PARA_PEDIDO,
  LIMPIAR_BIN_SELECCIONADO_PARA_PEDIDO,




  AGREGAR_CODIGO_SCANEADO,
  LIMPIAR_CODIGO_SCANEADO
 } = BodegasSlice.actions

export default BodegasSlice.reducer

