import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TBinEnReproceso, TOperarioEnReproceso, TOperarioReproceso, TReprocesoProduccion, TTarjaResultanteReproceso } from "../../types/TypesReproceso.types";
import { FetchOptions, PostOptions, PutOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPostAction, fetchWithTokenPut } from "../../utils/peticiones.utils";
import { TBinBodega } from "../../types/TypesSeleccion.type";
import toast from "react-hot-toast";
import { TListaOperarioEnProduccion, TListaOperarioEnReproceso, TMensajeCierreProduccion, TMensajeTerminoProduccion } from "../../types/TypesProduccion.types";
import { TAuth, TVerificar } from "../../types/TypesRegistros.types";


export const fetchMensajeTerminoReproceso = createAsyncThunk<TMensajeTerminoProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeTerminoReproceso`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/reproceso/${id_programa}/estado_termino_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error obtener mensaje termino reproceso')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMensajeCierreReproceso = createAsyncThunk<TMensajeCierreProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeCierreReproceso`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/reproceso/${id_programa}/estado_cierre_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener mensaje cierre reproceso')
      return rejectWithValue(error.response.data)
    }
  }
)

export const  fetchListaOperariosEnReproceso = createAsyncThunk<TListaOperarioEnReproceso[], {token: TAuth | null, id_programa: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchListaOperariosEnReproceso',
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/reproceso/${id_programa}/lista_operarios_dias/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error(`Error ${await response.json()}`)
      }
    } catch (error: any) {
      toast.error('error al obtener los operarios de reproceso')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchProgramasReprocesos = createAsyncThunk('reproceso/fetch_programas_reproceso', 
  async (payload: FetchOptions, ThunkApi) => {
    const { token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/reproceso/`, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

export const fetchProgramaReproceso = createAsyncThunk('reproceso/fetch_programa_reproceso_individual', 
  async (payload: FetchOptions, ThunkApi) => {
    const { id, token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/reproceso/${id}/`, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

export const fetchBinsEnReproceso = createAsyncThunk('reproceso/fetch_bins_en_reproceso', 
  async (payload: FetchOptions, ThunkApi) => {
    const { id, token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/reproceso/${id}/bins_en_reproceso/`, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

export const fetchTarjasResultantesReproceso = createAsyncThunk('reproceso/fetch_tarjas_resultantes', 
  async (payload: FetchOptions, ThunkApi) => {
    const { id, token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/reproceso/${id}/tarjas_resultantes/`, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

export const fetchOperariosReproceso = createAsyncThunk('reproceso/fetch_operarios_reproceso', 
  async (payload: FetchOptions, ThunkApi) => {
    const { id, token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
        
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/reproceso/${id}/operarios/lista_filtrada_por_operario/`, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

export const fetchOperarioEnReproceso = createAsyncThunk('reproceso/fetch_operario_en_reproceso', 
  async (payload: PostOptions, ThunkApi) => {
    const { id, token, params, verificar_token } = payload
    //@ts-ignore
    const { rut } = params
    try {
       const token_verificado = await verificar_token(token)
        
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithTokenPost(`api/reproceso/${id}/operarios/lista_detalle_dias_operario/`, { rut: rut }, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})






// REGISTROS


export const registro_programa_reproceso = createAsyncThunk('reproceso/registro_programa_reproceso', 
  async (payload: PostOptions, ThunkApi) => {
    const { token, data, params, verificar_token } = payload
    //@ts-ignore
    const { navigate } = params
    try {
       const token_verificado = await verificar_token(token)
        
       if (!token_verificado) throw new Error('Token no verificado') 
       const response = await fetchWithTokenPost(`api/reproceso/`, data, token_verificado)
       if (response.ok){
        const data = await response.json()
				toast.success(`El programa reproceso fue creado exitosamente`)
				navigate(`/pro/reproceso/registro-programa/${data.id}`, { state: { pathname: '/reproceso/' }})
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})

















// Actualizaciones - Peticiones PATCH - PUT
export const actualizar_programa_reproceso = createAsyncThunk(
  'programa/actualizar_programa_reproceso',
  async (payload: PutOptions, thunkAPI) => {
    const { id, params, token, verificar_token } = payload
    //@ts-ignore
    const { estado, perfil, tipo_boton, fecha_registrada, detalle } = params;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no verificado');

      const hoy = new Date();
      const formatter = new Intl.DateTimeFormat('es-CL', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
        timeZone: 'America/Santiago' // Zona horaria de Chile
      });

      const parts = formatter.formatToParts(hoy);
      const hoyLocal = `${parts.find(part => part.type === 'year')?.value}-${parts.find(part => part.type === 'month')?.value}-${parts.find(part => part.type === 'day')?.value}T${parts.find(part => part.type === 'hour')?.value}:${parts.find(part => part.type === 'minute')?.value}:${parts.find(part => part.type === 'second')?.value}.000Z`;

      const requestBody: Record<string, any> = {
        id,
        estado,
        registrado_por: perfil.id,
      };

      if (tipo_boton === 'inicio') {
        requestBody.fecha_inicio_reproceso = (fecha_registrada === null || fecha_registrada === undefined) ? hoyLocal : fecha_registrada;
      } else if (tipo_boton === 'cierre') {
        requestBody.fecha_termino_reproceso = hoyLocal;
      }

      const response_estado = await fetchWithTokenPatch(`api/reproceso/${id}/`, requestBody, token_verificado);

      if (response_estado.ok) {
        const data: TReprocesoProduccion = await response_estado.json();
        toast.success(`El programa está en ${data.estado_label}`);
        if (detalle) {
          thunkAPI.dispatch(fetchProgramaReproceso({ id, token, verificar_token }));
          thunkAPI.dispatch(fetchOperarioEnReproceso({ id, token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchProgramasReprocesos({ token, verificar_token }));
        }
        return data;
      } else {
        toast.error('No se pudo actualizar');
        return thunkAPI.rejectWithValue('No se pudo actualizar');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue('No se pudo actualizar');
    }
  }
);











// ELIMINACIONES 

export const eliminar_ = createAsyncThunk('reproceso/fetch_operario_en_reproceso', 
  async (payload: PostOptions, ThunkApi) => {
    const { id, token, params, verificar_token } = payload
    //@ts-ignore
    const { rut } = params
    try {
       const token_verificado = await verificar_token(token)
        
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithTokenPost(`api/reproceso/${id}/operarios/lista_detalle_dias_operario/`, { rut: rut }, token_verificado)
       if (response.ok){
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se ha logrado realizar la petición')
    }
})




const initialState = {
  programas_reprocesos: [] as TReprocesoProduccion[],
  programa_reproceso_individual: null as TReprocesoProduccion | null,
  bins_reproceso: [] as TBinEnReproceso[],
  bin_reproceso_individual: null as TBinEnReproceso | null,
  tarjas_resultantes: [] as TTarjaResultanteReproceso[],
  tarja_resultante_individual: null as TTarjaResultanteReproceso | null,
  listaOperariosEnReproceso: [] as TListaOperarioEnReproceso[],
  operarios_reproceso: [] as TOperarioEnReproceso[],
  operario_reproceso_individual: [] as TOperarioReproceso[],
  nuevos_bin_reproceso: [] as TBinBodega[],
  mensajeTerminoReproceso: null as TMensajeTerminoProduccion | null,
  mensajeCierreReproceso: null as TMensajeCierreProduccion | null,

  loading: false,
  error: null as string | null | undefined
};


export const ReprocesoSlice = createSlice({
  name: 'reproceso',
  initialState,
  reducers: {
    GUARDAR_BIN_REPROCESO: (state, action) => {
      state.nuevos_bin_reproceso.push(action.payload) 
    },
    QUITAR_BIN_REPROCESO: (state, action) => {
      state.nuevos_bin_reproceso = state.nuevos_bin_reproceso.filter(bin => bin.id !== action.payload)
    },
    VACIAR_TABLA: state => {
      state.nuevos_bin_reproceso = [];
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProgramasReprocesos.fulfilled, (state, action) => {
      state.programas_reprocesos = action.payload
    })
    .addCase(fetchProgramaReproceso.fulfilled, (state, action) => {
      state.programa_reproceso_individual = action.payload
    })
    .addCase(fetchBinsEnReproceso.fulfilled, (state, action) => {
      state.bins_reproceso = action.payload
    })
    .addCase(fetchTarjasResultantesReproceso.fulfilled, (state, action) => {
      state.tarjas_resultantes = action.payload
    })
    .addCase(fetchOperariosReproceso.fulfilled, (state, action) => {
      state.operarios_reproceso = action.payload
    })
    .addCase(fetchOperarioEnReproceso.fulfilled, (state, action) => {
      state.operario_reproceso_individual = action.payload
    })
    .addCase(fetchListaOperariosEnReproceso.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchListaOperariosEnReproceso.fulfilled, (state, action) => {
      state.loading = false
      state.listaOperariosEnReproceso = action.payload
    })
    .addCase(fetchListaOperariosEnReproceso.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase(fetchMensajeTerminoReproceso.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeTerminoReproceso.fulfilled, (state, action) => {
      state.mensajeTerminoReproceso = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeTerminoReproceso.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreReproceso.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeCierreReproceso.fulfilled, (state, action) => {
      state.mensajeCierreReproceso = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreReproceso.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
  }
})

export const {
  GUARDAR_BIN_REPROCESO,
  QUITAR_BIN_REPROCESO,
  VACIAR_TABLA
} = ReprocesoSlice.actions

export default ReprocesoSlice.reducer;
