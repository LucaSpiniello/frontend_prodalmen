import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TClienteParaGuia, TFrutaSolicitadaGuia, TGuiaSalida } from "../../types/TypesGuiaSalida.type"
import { FetchOptions, PostOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenPatch } from "../../utils/peticiones.utils";
import toast from "react-hot-toast";
import { TAuth, TVerificar } from "../../types/TypesRegistros.types";

export const fetchGuiaDeSalida = createAsyncThunk(
  'guias_salida/fetch_guiadesalida',
  async (payload: FetchOptions, thunkAPI) => {
    const { id ,token, verificar_token } = payload;
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/guias-salida/${id}/`, token_validado)
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

// export const fetchFrutasFicticiaGuia = createAsyncThunk(
//   'guias_salida/fetch_fruta_ficticia_guia',
//   async (payload: FetchOptions, thunkAPI) => {
//     const { id ,token, verificar_token } = payload;
//     try {
//       const token_validado = await verificar_token(token)

//       if (!token_validado) throw new Error('El token no es valido')
//         const res = await fetchWithToken(`api/guias-salida/${id}/frutas/`, token_validado)
//       if (res.ok){
//         const data = await res.json()
//         return data
//       } else if (res.status === 400) {
//         const erroData = await res.json()
//         return thunkAPI.rejectWithValue('No se pudo');
//       }
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue({ error: error.message }); 
//     }
//   }
// )

export const fetchTipoClientes = createAsyncThunk(
  'guias_salida/fetch_tipo_clientes',
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload
    //@ts-ignore
    const { tipo_cliente } = params
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/guias-salida/tipo_cliente?tipo_cliente=${tipo_cliente}`, token_validado)
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

export const actualizar_guia_salida = createAsyncThunk(
  'guias_salida/actualizar_guia_salida',
  async (payload: PostOptions, thunkAPI) => {
    const { id, data, token, verificar_token, action } = payload;
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/guias-salida/${id}/`, data,token_validado)
      if (res.ok){
        toast.success('Actualización realizada exitosamente')
        thunkAPI.dispatch(fetchGuiaDeSalida({ id, token, verificar_token }))
        action!(false)
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo realizar, vuelve a intentarlo')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const listaClientesParaGuiaThunk = createAsyncThunk<TClienteParaGuia[], {token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `guias_salida/listaClientesParaGuiaThunk`,
  async ({token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/guias-salida/lista_clientes`,token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo realizar, vuelve a intentarlo')
        return rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
)



const initialState = {
  guia_de_salida: null as TGuiaSalida | null,
  frutas_solicitadas: [] as TFrutaSolicitadaGuia[],
  tipo_cliente: [],
  loading: false as boolean,
  lista_clientes: [] as TClienteParaGuia[],
  error: null as string | null | undefined
}

export const guiaSalidaSlice = createSlice({
  name: 'guiaSalida',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchGuiaDeSalida.fulfilled, (state, action) => {
      state.guia_de_salida = action.payload;
    })
    .addCase(fetchTipoClientes.fulfilled, (state, action) => {
      state.tipo_cliente = action.payload;
    })
    .addCase(listaClientesParaGuiaThunk.pending, (state) => {
      state.loading = true
    })
    .addCase(listaClientesParaGuiaThunk.fulfilled, (state, action) => {
      state.lista_clientes = action.payload
      state.loading = false
    })
    .addCase(listaClientesParaGuiaThunk.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
  }
})

export const {

 } = guiaSalidaSlice.actions

export default guiaSalidaSlice.reducer