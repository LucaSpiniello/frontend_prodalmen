import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TCCPepaSerializer, TControlCalidad, TControlCalidadTarja, TFotosCC, TMuestraSerializer, TPepaMuestra, TRendimiento, TRendimientoMuestra } from "../../types/TypesControlCalidad.type";
import { FetchOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenPostAction } from "../../utils/peticiones.utils";
import { TTarjaSeleccionadaCalibracion } from "../../types/TypesSeleccion.type";
import { TTarjaResultanteReproceso } from "../../types/TypesReproceso.types";
import { TRendimientoActual } from "../../types/TypesProduccion.types";


export const fetchControlesDeCalidad = createAsyncThunk('control-calidad/fetch_controles', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { token, verificar_token } = payload

    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado) throw new Error('Token no verificado')
      
      const response = await fetchWithToken(`api/control-calidad/recepcionmp/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  }
)

export const fetchControlesDeCalidadVistoBueno = createAsyncThunk('control-calidad/fetch_controles_visto_bueno', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { token, verificar_token } = payload

    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado) throw new Error('Token no verificado')
      
      const response = await fetchWithToken(`api/control-calidad/recepcionmp-vb/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  }
)


export const fetchControlCalidad = createAsyncThunk('control-calidad/fetch_control', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado) throw new Error('Token no verificado')
      
      const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue(`No se pudo hacer la petición`)
    }
  }
)

export const fetchFotosControlCalidad = createAsyncThunk('control-calidad/fetch_fotos-cc', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/fotos-cc/?search=${id}`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchMuestrasControlCalidad = createAsyncThunk('control-calidad/fetch_muestras_rendimientos', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}/muestras/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchMuestraControlDeCalidad = createAsyncThunk('control-calidad/fetch_muestra_rendimiento', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { id_muestra } = params
  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}/muestras/${id_muestra}/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchMuestrasCalibradasControlDeCalidad = createAsyncThunk('control-calidad/fetch_muestras_rendimiento_calibradas', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { id_muestra } = params

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}/muestras/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchMuestrasCalibradasControlDeCalidadDetalle = createAsyncThunk('control-calidad/fetch_muestras_rendimiento_calibradas_detalle', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { id_muestra } = params
  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}/muestras/${id_muestra}/cdcpepa/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchCalibracionTarjasSeleccionadas = createAsyncThunk('control-calidad/fetch_calibracion_tarjas_seleccionadas', 
async (payload: FetchOptions, ThunkAPI) => {
  const { id, token, verificar_token } = payload

try {
    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/seleccion/cdc-tarjaseleccionada/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  } catch (error) {
    return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
  }
}
)

export const fetchCalibracionTarjaSeleccionada = createAsyncThunk('control-calidad/fetch_calibracion_tarja_seleccionada_individual', 
async (payload: FetchOptions, ThunkAPI) => {
  const { id, token, verificar_token } = payload

try {
    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/seleccion/cdc-tarjaseleccionada/${id}/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  } catch (error) {
    return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
  }
}
)

export const fetchRendimientoLotes = createAsyncThunk('control-calidad/fetch_rendimiento_lotes', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, params, token, verificar_token } = payload
    //@ts-ignore
    const { variedad } = params

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithTokenPostAction(`api/control-calidad/recepcionmp/rendimiento_lotes/${id}/?variedad=${variedad}`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchRendimientoLotesTarjas = createAsyncThunk('control-calidad/fetch_rendimiento_tarjas', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/produccion/cdc-tarjaresultante/rendimiento_tarja/${id}/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)




export const fetchCalibracionTarjasResultantesProduccion = createAsyncThunk('control-calidad/fetch_calibracion_tarjas_produccion', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/produccion/cdc-tarjaresultante/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchCalibracionTarjasResultantesProduccionIndividual = createAsyncThunk('control-calidad/fetch_calibracion_tarjas_produccion_individual', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/produccion/cdc-tarjaresultante/${id}/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchCalibracionTarjasReproceso = createAsyncThunk('control-calidad/fetch_calibracion_tarjas_reproceso', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/reproceso/cdc-tarjaresultante/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)

export const fetchCalibracionTarjaReprocesoIndividual = createAsyncThunk('control-calidad/fetch_calibracion_tarja_reproceso_individual', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { id, token, verificar_token } = payload

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/reproceso/cdc-tarjaresultante/${id}/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la peticion')
    }
  }
)






const initialState = {
  controles_calidad: [] as TControlCalidad[],
  control_calidad: null as TControlCalidad | null,
  controles_calidad_visto_bueno: [] as TControlCalidad[],
  fotos_cc: [] as TFotosCC[],
  cc_muestras: [] as TRendimientoMuestra[],
  rendimientos_lotes: null as TRendimiento | null,
  rendimiento_tarjas_actual: null as TRendimientoActual | null,
  cc_muestra_individual: null as TRendimientoMuestra | null,
  cc_calibracion_muestras: [] as TRendimientoMuestra[],
  cc_calibracion_muestra_individual: null as TRendimientoMuestra | null,
  cc_calibracion_muestras_detalle: [] as TPepaMuestra[],
  cc_calibracion_tarjaseleccionada: [] as TTarjaSeleccionadaCalibracion[],
  cc_calibracion_tarja_seleccionada: null as TTarjaSeleccionadaCalibracion | null,
  cc_calibracion_tarjas_produccion: [] as TControlCalidadTarja[],
  cc_calibracion_tarja_produccion_individual: null as TControlCalidadTarja | null,
  cc_calibracion_tarjas_reprocesos: [] as TControlCalidadTarja[],
  cc_calibracion_tarja_reproceso_individual: null as TControlCalidadTarja | null,
  todos_los_rendimientos: [] as TRendimiento[],


  loading: false,
  error: null as string | null | undefined
};


export const ControlCalidad = createSlice({
  name: 'control_calidad',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchControlesDeCalidad.fulfilled, (state, action) => {
        state.controles_calidad = action.payload;
      })
      .addCase(fetchControlesDeCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchControlCalidad.fulfilled, (state, action) => {
        state.control_calidad = action.payload;
      })
      .addCase(fetchControlCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchFotosControlCalidad.fulfilled, (state, action) => {
        state.fotos_cc = action.payload;
      })
      .addCase(fetchFotosControlCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMuestrasControlCalidad.fulfilled, (state, action) => {
        state.cc_muestras = action.payload;
      })
      .addCase(fetchMuestrasControlCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMuestraControlDeCalidad.fulfilled, (state, action) => {
        state.cc_muestra_individual = action.payload;
      })
      .addCase(fetchMuestraControlDeCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMuestrasCalibradasControlDeCalidad.fulfilled, (state, action) => {
        state.cc_calibracion_muestras = action.payload;
      })
      .addCase(fetchMuestrasCalibradasControlDeCalidad.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchMuestrasCalibradasControlDeCalidadDetalle.fulfilled, (state, action) => {
        state.cc_calibracion_muestras_detalle = action.payload;
      })
      .addCase(fetchMuestrasCalibradasControlDeCalidadDetalle.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchControlesDeCalidadVistoBueno.fulfilled, (state, action) => {
        state.controles_calidad_visto_bueno = action.payload;
      })
      .addCase(fetchControlesDeCalidadVistoBueno.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchCalibracionTarjasSeleccionadas.fulfilled, (state, action) => {
        state.cc_calibracion_tarjaseleccionada = action.payload
      })
      .addCase(fetchCalibracionTarjaSeleccionada.fulfilled, (state, action) => {
        state.cc_calibracion_tarja_seleccionada = action.payload
      })
      .addCase(fetchCalibracionTarjasReproceso.fulfilled, (state, action) => {
        state.cc_calibracion_tarjas_reprocesos = action.payload
      })
      .addCase(fetchCalibracionTarjaReprocesoIndividual.fulfilled, (state, action) => {
        state.cc_calibracion_tarja_reproceso_individual = action.payload
      })
      .addCase(fetchRendimientoLotes.fulfilled, (state, action) => {
        state.rendimientos_lotes = action.payload
        if (state.rendimientos_lotes ){
          const information = action.payload
          information.id = action.meta.arg.id
          state.todos_los_rendimientos.push(action.payload)
        }

      })
      .addCase(fetchRendimientoLotesTarjas.fulfilled, (state, action) => {
        state.rendimiento_tarjas_actual = action.payload
      })
      .addCase(fetchCalibracionTarjasResultantesProduccion.fulfilled, (state, action) => {
        state.cc_calibracion_tarjas_produccion = action.payload
      })
      .addCase(fetchCalibracionTarjasResultantesProduccionIndividual.fulfilled, (state, action) => {
        state.cc_calibracion_tarja_produccion_individual = action.payload
      })
      
      
  }
})

export const { } = ControlCalidad.actions

export default ControlCalidad.reducer;