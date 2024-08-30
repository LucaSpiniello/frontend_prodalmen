// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TComuna, TCuidadPais, TNotificaciones, TPaises, TProvincia, TRegion } from '../../types/TypesRegistros.types'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils'
import { TContentTypes, TProgramasInfo } from '../../types/coreTypes.type'


export const fetchPaises = createAsyncThunk('core/fetch_paises', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/countries/`, token_verificado)
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

export const fetchCiudades = createAsyncThunk('core/fetch_ciudades', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { id_pais } = params

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/countries/${id_pais}/cities`, token_verificado)
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

export const fetchRegiones = createAsyncThunk('core/fetch_region', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/regiones`, token_verificado)
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

export const fetchProvincias = createAsyncThunk('core/fetch_provincias', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { id_region } = params

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/region/${id_region}/provincias/`, token_verificado)
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

export const fetchComunas = createAsyncThunk('core/fetch_comunas', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload;
    //@ts-ignore
    const { id_provincia } = params

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/provincias/${id_provincia}/comunas`, token_verificado)
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

export const fetchDashboardProgramas = createAsyncThunk('core/fetch_dashboard_programas', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/home/dashboard/`, token_verificado)
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

export const fetchContentTypes = createAsyncThunk('core/fetch_contenttypes', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

    try {
        const token_verificado = await verificar_token(token)
    
        if (!token_verificado){
            throw new Error('Token no verificado')
        }

        const res = await fetchWithToken(`api/contenttypes`, token_verificado)
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





const initialState = {
  paises: [] as TPaises[],
  ciudades: [] as TCuidadPais[],

  regiones: [] as TRegion[],
  provincias: [] as TProvincia[],
  comunas: [] as TComuna[],


  dashboard_header: [] as TProgramasInfo[],

  contenttypes: [] as TContentTypes[],



  notificaciones: [] as TNotificaciones[],


  loading: false,
  error: null as string | null | undefined,
};


export const CoreSlice = createSlice({
  name: 'core',
  initialState,
  reducers: {
    GUARDAR_NOTIFICACIONES: (state, action) => {
      state.notificaciones.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPaises.fulfilled, (state, action) => {
        state.paises = action.payload
      })
      .addCase(fetchCiudades.fulfilled, (state, action) => {
        state.ciudades = action.payload
      })
      .addCase(fetchRegiones.fulfilled, (state, action) => {
        state.regiones = action.payload
      })
      .addCase(fetchProvincias.fulfilled, (state, action) => {
        state.provincias = action.payload
      })
      .addCase(fetchComunas.fulfilled, (state, action) => {
        state.comunas = action.payload
      })

      .addCase(fetchDashboardProgramas.fulfilled, (state, action) => {
        state.dashboard_header = action.payload
      })

      .addCase(fetchContentTypes.fulfilled, (state, action) => {
        state.contenttypes= action.payload
      })
  }
});


export const {
  GUARDAR_NOTIFICACIONES
} = CoreSlice.actions

export default CoreSlice.reducer;
