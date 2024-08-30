// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TClientes, TComuna, TCuentasCorrientes, TCuidadPais, TPaises, TProvincia, TRegion, TRepresentantes, TSucursales } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils'


export const fetchClientes = createAsyncThunk('clientes/fetch_clientes', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { search } = params

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/clientes/unificados/${search}`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          toast.error(`${errorData.patente[0]}`)
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})

export const fetchClienteSeleccionado = createAsyncThunk('clientes/fetch_clientes_seleccionado', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { rut } = params


    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/clientes/detalle_cliente?rut=${rut}`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) { 
          const errorData = await res.json();
          toast.error(`${errorData.patente[0]}`)
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});


export const fetchSucursales = createAsyncThunk('clientes/fetch_sucursales_clientes', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { rut } = params


    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/clientes/sucursales_cliente?rut=${rut}`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          toast.error(`${errorData.patente[0]}`)
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})

export const fetchCuentasCorrientes = createAsyncThunk('clientes/fetch_cuentas_corrientes', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { rut } = params


    try {
        const token_verificado = await verificar_token(token)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithToken(`api/clientes_mercado_interno/${rut}/cuentas_corrientes`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          toast.error(`${errorData.patente[0]}`)
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
})

export const fetchRepresentantes = createAsyncThunk('clientes/fetch_representante', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { rut } = params
    try {
        const token_verificado = await verificar_token(token)
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithToken(`api/clientes_mercado_interno/${rut}/representantes`, token_verificado)
        if (res.ok){
            const data = await res.json()
            return data
        } else if (res.status === 400) {
          const errorData = await res.json();
          toast.error(`${errorData.patente[0]}`)
          return thunkAPI.rejectWithValue(`Error en la petición`)
        }
        
    } catch (error: any) {
        throw new Error(`Error en la solicitud: ${error.message}`);
    }
});



const initialState = {
  clientes: [] as TClientes[],
  cliente_seleccionado: null as TClientes | null,

  sucursales_cliente: [] as TSucursales[],
  
  cuentas_corrientes_cliente: [] as TCuentasCorrientes[],
  representantes_legales_cliente: [] as TRepresentantes[],
  
  
  
  paises: [] as TPaises[],
  ciudades: [] as TCuidadPais[],

  regiones: [] as TRegion[],
  provincias: [] as TProvincia[],
  comunas: [] as TComuna[],


  loading: false,
  error: null as string | null | undefined,
};


export const ClientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.clientes = action.payload
      })
      .addCase(fetchClienteSeleccionado.fulfilled, (state, action) => {
        state.cliente_seleccionado = action.payload
      })

      .addCase(fetchSucursales.fulfilled, (state, action) => {
        state.sucursales_cliente = action.payload
      })

      .addCase(fetchCuentasCorrientes.fulfilled, (state, action) => {
        state.cuentas_corrientes_cliente = action.payload
      })

      .addCase(fetchRepresentantes.fulfilled, (state, action) => {
        state.representantes_legales_cliente = action.payload
      })
      

  }
});


export default ClientesSlice.reducer;
