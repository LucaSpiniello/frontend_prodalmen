import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FetchOptions, PostOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost } from '../../utils/peticiones.utils';
import { TDespacho, TDolar, TFrutaDespacho, TFrutaEnPedido, TFrutaPedido, TPDFGuiaSalida, TPDFPedidoExportacion, TPDFPedidoInterno, TPedido, TPedidoExportacion, TPedidoInterno, TPedidos, TPPTParaPedido, TTipoEmbalaje } from '../../types/TypesPedidos.types';
import { TEtiquetado, TPalletProductoTerminado } from '../../types/TypesEmbalaje.type';
import toast from 'react-hot-toast';
import { fetchGuiaDeSalida } from './guiaSalidaSlice';
import { TAuth, TVerificar } from '../../types/TypesRegistros.types';
import { all } from 'axios';

export const fetchPedidos = createAsyncThunk(
  'pedidos/fetch_pedidos',
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { search } = params

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos/unificados/${search}`, token_validado)

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

export const fetchAllPedidos = createAsyncThunk(
  'pedidos/fetch_all_pedidos',
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const {search} = params
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos/all_pedidos/${search}`, token_validado)

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

export const fetchFrutaEnPedido = createAsyncThunk(
  'pedidos/fetch_fruta_en_pedido',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos/${id}/frutas/`, token_validado)

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

export const fetchPedidoInterno = createAsyncThunk(
  'pedidos/fetch_pedidos_mercado_interno',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos_mercado_interno/${id}/`, token_validado)

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
);

export const fetchPedidoExportacion = createAsyncThunk(
  'pedidos/fetch_pedido_exportacion',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos_exportacion/${id}/`, token_validado)

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






// Despachos
export const fetchDespacho = createAsyncThunk(
  'pedidos/fetch_despacho_pedido',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/despachos/detalle_despacho?pedido=${id}`, token_validado)

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


export const fetchFrutaDespacho = createAsyncThunk(
  'pedidos/fetch_fruta_despacho_pedido',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/despachos/${id}/fruta/`, token_validado)

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

export const registrarFrutaADespacho = createAsyncThunk(
  'pedidos/fetch_registrar_fruta_despacho_pedido',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, action, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_pedido } = params

    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/despachos/${id}/agregar_fruta/`,
         {
          ...data
         }
          ,token_validado)
      if (res.ok){
        toast.success('La Fruta se registro en el despacho exitosamente!')
        const data = await res.json()
        action!(false)
        thunkAPI.dispatch(fetchFrutaDespacho({ id, token, verificar_token}))
        thunkAPI.dispatch(fetchDespacho({ id: id_pedido , token, verificar_token }))

        return data
      } else if (res.status === 400) {
        toast.error('No se pudo registrar, vuelve a intentar')
        const erroData = await res.json()
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const finalizaDespacho = createAsyncThunk(
  'pedidos/fetch_finalizar_despacho',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, params, token, verificar_token } = payload;
    //@ts-ignore
    const { tipo_pedido, id_pedido } = params

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/despachos/${id}/`, 
        {
          estado_despacho: '2'
        }
        ,token_validado)

      if (res.ok){
        const data = await res.json()
        toast.success('Despacho En Curso')
        thunkAPI.dispatch(fetchDespacho({ id, token, verificar_token }))
        if (tipo_pedido === 'interno'){
          thunkAPI.dispatch(fetchPedidoInterno({ id: id_pedido, token, verificar_token}))

        } else if (tipo_pedido === 'exportacion'){
          thunkAPI.dispatch(fetchPedidoExportacion({ id: id_pedido, token, verificar_token}))

        } else if (tipo_pedido == 'guiasalida'){
          thunkAPI.dispatch(fetchGuiaDeSalida({ id: id_pedido, token, verificar_token }))

        }
        return data
      } else {
        toast.error('No se pudo hacer la petición, vuelve a intentarlo')
        const erroData = await res.json()
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)


// Fruta En Pedido Exportacion
export const actualizar_estado_pedido_exportacion = createAsyncThunk(
  'pedidos/actualizar_estado_pedido_exportacion',
  async (payload: PostOptions, thunkAPI) => {
    const { id, data, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/pedidos_exportacion/${id}/`,
        { ...data } ,token_validado)

      if (res.ok){
        const data = await res.json()
        toast.success('Estado actualizado exitosamente!')
        thunkAPI.dispatch(fetchPedidoExportacion({ id, token, verificar_token}))
        return data
      } else if (res.status === 400) {
        const erroData = await res.json()
        toast.error('No se ha podido actualizar')
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)




// Fruta En Pedido Mercado Interno
export const eliminarFrutaEnPedido = createAsyncThunk(
  'pedidos/eliminar_fruta_en_pedido',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, params, token, verificar_token } = payload
    //@ts-ignore
    const { id_fruta, id_despacho } = params

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/pedidos/${id}/frutas/${id_fruta}/`, token_validado)

      if (res.ok){
        toast.success('Elimación realizada exitosamente!')
        thunkAPI.dispatch(fetchFrutaEnPedido({ id, token, verificar_token}))
        thunkAPI.dispatch(fetchFrutaDespacho({ id: id_despacho, token, verificar_token}))
        return id
      } else if (res.status === 400) {
        const erroData = await res.json()
        toast.error('No se ha podido eliminar')
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const actualizar_estado_pedido_interno = createAsyncThunk(
  'pedidos/actualizar_estado_pedido',
  async (payload: PostOptions, thunkAPI) => {
    const { id, data, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/pedidos_mercado_interno/${id}/`,
        { ...data } ,token_validado)

      if (res.ok){
        const data = await res.json()
        toast.success('Estado actualizado exitosamente!')
        thunkAPI.dispatch(fetchPedidoInterno({ id, token, verificar_token}))
        return data
      } else if (res.status === 400) {
        const erroData = await res.json()
        toast.error('No se ha podido actualizar')
        return thunkAPI.rejectWithValue('No se pudo');
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)


export const fetchPDFGuiaSalida = createAsyncThunk(
  'pedidos/fetch_pdf_guia_salida',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/guias-salida/${id}/pdf_guia_salida/`, token_validado)

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

export const fetchPDFPedidoInterno = createAsyncThunk(
  'pedidos/fetch_pdf_pedido_interno',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos_mercado_interno/${id}/pdf_pedido_interno/`, token_validado)

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

export const fetchPDFPedidoExportacion = createAsyncThunk(
  'pedidos/fetch_pdf_pedido_exportacion',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos_exportacion/${id}/pdf_pedido_exportacion/`, token_validado)

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

export const detallePedidoThunk = createAsyncThunk<TPedido, {id_pedido: string | number | undefined, token: TAuth | null, verificar_token: TVerificar }, { rejectValue: string }>(
  'pedidos/detallePedidoThunk',
  async ({id_pedido, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pedidos/${id_pedido}`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return rejectWithValue('Error en el detalle pedido');
      }

    } catch (error: any) {
      return rejectWithValue('error'); 
    }
  }
)

export const patchPedidoThunk = createAsyncThunk<TPedido, {id_pedido: string | number | undefined, token: TAuth | null, verificar_token: TVerificar, data: any }, { rejectValue: string }>(
  'pedidos/patchPedidoThunk',
  async ({id_pedido, token, verificar_token, data}, {rejectWithValue}) => {
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/pedidos/${id_pedido}/`, data, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return rejectWithValue('Error en el actualizar pedido');
      }
    } catch (error: any) {
      return rejectWithValue('error'); 
    }
  }
)

export const listaPPTParaPedido = createAsyncThunk<TPPTParaPedido[], {token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `pedidos/listaPPTParaPedido`,
  async ({token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/pallets_pedido/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return rejectWithValue('Error lista pallet');
      }
    } catch (error: any) {
      return rejectWithValue('Error lista pallet'); 
    }
  }
)


const initialState = {
    pedidos: [] as TPedidos[],
    pedido_interno: null as TPedidoInterno | null,
    pedido_exportacion: null as TPedidoExportacion | null,
    allpedidos: [],
    pdf_guia_salida: null as TPDFGuiaSalida | null,
    pdf_pedido_interno: null as TPDFPedidoInterno | null,
    pdf_pedido_exportacion: null as TPDFPedidoExportacion | null,

    pedido: null as TPedido | null,
    fruta_en_pedido: [] as TFrutaEnPedido[],

    despacho: null as TDespacho | null,
    fruta_en_despacho: [] as TFrutaDespacho[],
    fruta_en_despacho_parcial: [] as TFrutaDespacho[],

    pallet_en_fruta_pedido: [] as TPalletProductoTerminado[],
    pallet_para_pedido: [] as TPPTParaPedido[],

    dolar: null as TDolar | null,
    loading: false,
    error: null as string | null | undefined
  };


export const pedidosSlices = createSlice({
    name: 'pedidos',
    initialState,
    reducers: {
      GUARDAR_FRUTA_DESPACHO_PARCIAL: (state, action) => {
        state.fruta_en_despacho_parcial.push(action.payload)
      },
      ELIMINAR_FRUTA_DESPACHO_PARCIAL: (state, action) => {
        state.fruta_en_despacho_parcial = state.fruta_en_despacho_parcial.filter(fruta => fruta.id !== action.payload)
      },
      LIMPIAR_FRUTA_DESPACHO_PARCIAL: state => {
        state.fruta_en_despacho_parcial = []
      },
      DESCUENTO_FICTICIO_FRUTA_PEDIDO: (state, action) => {
        state.fruta_en_pedido = state.fruta_en_pedido.filter(fruta => fruta.id !== action.payload)
      },
      AÑADIR_FICTICIO_FRUTA_PEDIDO: (state, action) => {
        state.fruta_en_pedido.push(action.payload)
      },
      AÑADADIR_PALLET_FRUTA_EN_PEDIDO: (state, action) => {
        state.pallet_en_fruta_pedido.push(action.payload)
      },
      QUITAR_PALLE_FRUTA_EN_PEDIDO: (state, action) => {
        state.pallet_en_fruta_pedido = state.pallet_en_fruta_pedido.filter(pallet => pallet.id !== action.payload)
      },
      LIMPIAR_PALLET_FRUTA_EN_PEDIDO: state => {
        state.pallet_en_fruta_pedido = []
      },
      DETALLE_PEDIDO: (state, action) => {
        state.pedido = action.payload
      }
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchPedidos.fulfilled, (state, action) => {
        state.pedidos = action.payload;
      })
      .addCase(fetchAllPedidos.fulfilled, (state, action) => {
        state.allpedidos = action.payload;
      })

      .addCase(fetchPedidoInterno.fulfilled, (state, action) => {
        state.pedido_interno = action.payload;
      })

      .addCase(fetchPedidoExportacion.fulfilled, (state, action) => {
        state.pedido_exportacion = action.payload;
      })


      .addCase(fetchDespacho.fulfilled, (state, action) => {
        state.despacho = action.payload;
      })

      .addCase(fetchFrutaEnPedido.fulfilled, (state, action) => {
        state.fruta_en_pedido = action.payload;
      })

      .addCase(fetchFrutaDespacho.fulfilled, (state, action) => {
        state.fruta_en_despacho = action.payload;
      })

      .addCase(fetchPDFGuiaSalida.fulfilled, (state, action) => {
        state.pdf_guia_salida = action.payload;
      })

      .addCase(fetchPDFPedidoInterno.fulfilled, (state, action) => {
        state.pdf_pedido_interno = action.payload;
      })

      .addCase(fetchPDFPedidoExportacion.fulfilled, (state, action) => {
        state.pdf_pedido_exportacion = action.payload;
      })
      .addCase(detallePedidoThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(detallePedidoThunk.fulfilled, (state, action) => {
        state.pedido = action.payload
        state.loading = false
      })
      // .addCase(detallePedidoThunk.rejected, (state, action) => {
      //   state.error = action.payload
      //   state.loading = false
      // })
      .addCase(patchPedidoThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(patchPedidoThunk.fulfilled, (state, action) => {
        state.loading = false
        state.pedido = action.payload
      })
      // .addCase(listaPPTParaPedido.pending, (state) => {
      //   state.loading = true
      // })
      .addCase(listaPPTParaPedido.fulfilled, (state, action) => {
        state.loading = false
        state.pallet_para_pedido = action.payload
      })
    }
    
})

export const {
  GUARDAR_FRUTA_DESPACHO_PARCIAL,
  ELIMINAR_FRUTA_DESPACHO_PARCIAL,
  LIMPIAR_FRUTA_DESPACHO_PARCIAL,
  DESCUENTO_FICTICIO_FRUTA_PEDIDO,
  AÑADIR_FICTICIO_FRUTA_PEDIDO,


  AÑADADIR_PALLET_FRUTA_EN_PEDIDO,
  QUITAR_PALLE_FRUTA_EN_PEDIDO,
  LIMPIAR_PALLET_FRUTA_EN_PEDIDO,
  DETALLE_PEDIDO
 } = pedidosSlices.actions

export default pedidosSlices.reducer