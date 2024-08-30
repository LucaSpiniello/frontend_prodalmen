// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PDFEntradaEmbalaje, PDFSalidaEmbalaje, TBinEnEmbalaje, TEmbalaje, TEtiquetado, THistoricoPalletProductoTerminado, TOperarioEmbalajeDiario, TOperarioEnEmbalaje, TPalletProductoTerminado, TPalletProductoTerminadoMIN } from '../../types/TypesEmbalaje.type'
import { FetchOptions, PostOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenPost } from '../../utils/peticiones.utils';
import { TBinBodega, THistoricoBinSubProducto } from '../../types/TypesSeleccion.type';
import toast from 'react-hot-toast';
import { TTipoEmbalaje } from '../../types/TypesPedidos.types';


export const fetchProgramasEmbalaje = createAsyncThunk('embalaje/fetch_programa_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchProgramaEmbalajeIndividual = createAsyncThunk('embalaje/fetch_programa_embalaje_indivual', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchBinEnEmbalaje = createAsyncThunk('embalaje/fetch_bin_en_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/fruta_bodega/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchPalletsProductoTerminados = createAsyncThunk('embalaje/fetch_pallets_productos_terminados_lista', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id ,token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/pallet_producto_terminado/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchPalletProductoTerminado = createAsyncThunk('embalaje/fetch_pallet_producto_terminado  ', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, params ,token, verificar_token } = payload
    //@ts-ignore
    const { id_pallet } = params

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/pallet_producto_terminado/${id_pallet}/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

export const fetchOperariosProgramaEmbalaje = createAsyncThunk('embalaje/fetch_operario_programa_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id ,token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/lista_operarios_dias`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})

export const fetchDetalleOperarioDiario = createAsyncThunk('embalaje/fetch_detalle_operario_diario', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, params, token, verificar_token } = payload
    // @ts-ignore
    const { rut } = params

    try {
        const token_verificado = await verificar_token(token)
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithToken(`api/embalaje/${id}/operarios_en_embalaje/lista_diaria_operario?rut=${rut}`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});



export const fetchTodosPalletsProductoTerminados = createAsyncThunk('embalaje/fetch_todospallet_producto_terminado  ', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/pallets_producto_terminados/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const fetchHistoricoPallet = createAsyncThunk('embalaje/fetch_historico_pallet', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/historico_pallet?id=${id}`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const fetchPDFEntradaEmbalaje = createAsyncThunk('embalaje/fetch_pdf_entrada_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/pdf-entrada-embalaje`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})


export const fetchPDFSalidaEmbalaje = createAsyncThunk('embalaje/fetch_pdf_salida_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/embalaje/${id}/pdf-salida-embalaje`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});

















export const fetchTipoEmbalaje = createAsyncThunk(
  'pedidos/fetch_tipo_embalaje',
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/tipo_embalaje/`, token_validado)

      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        const erroData = await res.json()
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)



// Etiquetas
export const fetchEtiquetasEmbalaje = createAsyncThunk('embalaje/fetch_etiquetas_embalaje', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/etiqueta_embalaje/`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})


export const registroEtiquetas = createAsyncThunk(
  'pedidos/post_etiquetas',
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, verificar_token, action } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/etiqueta_embalaje/`,
        {
          ...data
        },token_validado)

      if (res.ok){
        const data = await res.json()
        toast.success('Etiqueta creada exitosamente')
        action!(false)
        return data
      } else if (res.status === 400) {
        const erroData = await res.json()
        toast.error('No se pudo registrar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

const initialState = {
  programa_embalaje: [] as TEmbalaje[],
  programa_embalaje_individual: null as TEmbalaje | null,
  
  operarios_programa_embalaje: [] as TOperarioEnEmbalaje[],
  operario_detalle_diario: [] as TOperarioEmbalajeDiario[],


  pallets_producto_terminados: [] as TPalletProductoTerminado[],
  pallet_producto_terminado: null as TPalletProductoTerminado | null,
  bin_en_programa: [] as TBinEnEmbalaje[],

  todos_los_pallets_productos_terminados: [] as TPalletProductoTerminadoMIN[],
  historico_pallet_producto_terminado: [] as THistoricoPalletProductoTerminado[],

  tipo_embalaje: [] as TTipoEmbalaje[],


  pdf_entrada_embalaje: null as PDFEntradaEmbalaje | null,
  pdf_salida_embalaje: null as PDFSalidaEmbalaje | null,


  nuevos_bin_para_embalar: [] as TBinBodega[],


  etiquetas: [] as TEtiquetado[],

  loading: false,
  error: null as string | null | undefined,
};


export const EmbalajeSlice = createSlice({
  name: 'embalaje',
  initialState,
  reducers: {
    GUARDAR_BIN_EMBALAJE: (state, action) => {
      state.nuevos_bin_para_embalar.push(action.payload)
    },
    QUITAR_BIN_EMBALAJE: (state, action) => {
      state.nuevos_bin_para_embalar = state.nuevos_bin_para_embalar.filter(bin => bin.id !== action.payload)
    },
    VACIAR_BINS_EMBALAJE: state => {
      state.nuevos_bin_para_embalar = []
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramasEmbalaje.fulfilled, (state, action) => {
        state.programa_embalaje = action.payload
      })

      .addCase(fetchProgramaEmbalajeIndividual.fulfilled, (state, action) => {
        state.programa_embalaje_individual = action.payload
      })

      .addCase(fetchBinEnEmbalaje.fulfilled, (state, action) => {
        state.bin_en_programa = action.payload
      })

      .addCase(fetchPalletsProductoTerminados.fulfilled, (state, action) => {
        state.pallets_producto_terminados = action.payload
      })

      .addCase(fetchOperariosProgramaEmbalaje.fulfilled, (state, action) => {
        state.operarios_programa_embalaje = action.payload
      })

      .addCase(fetchDetalleOperarioDiario.fulfilled, (state, action) => {
        state.operario_detalle_diario = action.payload
      })

      .addCase(fetchPalletProductoTerminado.fulfilled, (state, action) => {
        state.pallet_producto_terminado = action.payload
      })

      .addCase(fetchTodosPalletsProductoTerminados.fulfilled, (state, action) => {
        state.todos_los_pallets_productos_terminados = action.payload
      })

      .addCase(fetchHistoricoPallet.fulfilled, (state, action) => {
        state.historico_pallet_producto_terminado = action.payload
      })

      .addCase(fetchTipoEmbalaje.fulfilled, (state, action) => {
        state.tipo_embalaje = action.payload;
      })

      .addCase(fetchEtiquetasEmbalaje.fulfilled, (state, action) => {
        state.etiquetas = action.payload;
      })

      .addCase(registroEtiquetas.fulfilled, (state, action) => {
        state.etiquetas = action.payload;
      })

      .addCase(fetchPDFEntradaEmbalaje.fulfilled, (state, action) => {
        state.pdf_entrada_embalaje = action.payload;
      })

      .addCase(fetchPDFSalidaEmbalaje.fulfilled, (state, action) => {
        state.pdf_salida_embalaje = action.payload;
      })
  }
});

export const { 
  GUARDAR_BIN_EMBALAJE,
  QUITAR_BIN_EMBALAJE,
  VACIAR_BINS_EMBALAJE,
} = EmbalajeSlice.actions


export default EmbalajeSlice.reducer;
