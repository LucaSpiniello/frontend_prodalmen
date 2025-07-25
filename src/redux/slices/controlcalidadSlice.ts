import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TCCPepaSerializer, TControlCalidad, TControlCalidadTarja, TFotosCC, TMuestraSerializer, TPepaMuestra, TRendimiento, TRendimientoMuestra } from "../../types/TypesControlCalidad.type";
import { FetchOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenPostAction, fetchWithTokenPostWithBody } from "../../utils/peticiones.utils";
import { TTarjaSeleccionadaCalibracion } from "../../types/TypesSeleccion.type";
import { TTarjaResultanteReproceso } from "../../types/TypesReproceso.types";
import { TRendimientoActual } from "../../types/TypesProduccion.types";
import { add } from "lodash";
import { all } from "axios";


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

export const fetchControlesDeCalidadPorComercializador = createAsyncThunk('control-calidad/fetch_controles', 
  async (payload: any, ThunkAPI) => {
    const { params, token, verificar_token } = payload
    const {search} = params
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado) throw new Error('Token no verificado')
      
      const response = await fetchWithToken(`api/control-calidad/recepcionmp/get_by_comercializador/${search}`, token_verificado)
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

export const fetchTodosRendimientoLotes = createAsyncThunk('control-calidad/fetch_rendimiento_lotes', 
  async (payload: FetchOptions, ThunkAPI) => {
    const { params, token, verificar_token } = payload
    //@ts-ignore
    const { variedad } = params

  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithTokenPostAction(`api/control-calidad/recepcionmp/rendimiento_lotes/?variedad=${variedad}`, token_verificado)
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

export const fetchAllCC = createAsyncThunk('control-calidad/get_all_info_proyecccion', 
  async (payload: any, ThunkAPI) => {
    const { params, token, verificar_token } = payload
    const { search } = params
  try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/control-calidad/recepcionmp/get_all_info_proyecccion${search}`, token_verificado)
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

export const fetchRendimientosLotesPorIds = createAsyncThunk(
  'control-calidad/fetch_rendimiento_lotes_por_ids',
  async (payload: FetchOptions, ThunkAPI) => {
    const { ids, token, verificar_token } = payload;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no verificado');
      const idsArray  = ids?.split(',').map((id : any) => parseInt(id.trim()));

      const response = await fetchWithTokenPostWithBody(
        `api/control-calidad/recepcionmp/calculo_final_lotes/`,
        { ids: idsArray },
        token_verificado,
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else if (response.status === 400) {
        return ThunkAPI.rejectWithValue('No se hizo bien la petición');
      }
    } catch (error) {
      return ThunkAPI.rejectWithValue('No se hizo bien la petición');
    }
  }
);

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

export const fetchControlesDeCalidadPaginados = createAsyncThunk('control-calidad/fetch_controles_paginados', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token, params } = payload
    
    // Ensure we have valid pagination parameters
    if (!params || typeof params.desde !== 'number' || typeof params.hasta !== 'number') {
      return thunkAPI.rejectWithValue('Parámetros de paginación inválidos')
    }
    
    const { desde, hasta } = params

    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')
      console.log('Fetching paginated control data:', { desde, hasta })
      const response = await fetchWithToken(`api/control-calidad/recepcionmp/controles-paginados/?desde=${desde}&hasta=${hasta}`, token_verificado)
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


const initialState = {
  controles_calidad: [] as TControlCalidad[],
  controles_calidad_paginados: [] as TControlCalidad[],
  pagination_metadata: {
    total_count: 0,
    desde: 0,
    hasta: 9,
    has_next: false,
    has_previous: false
  },
  loading_pagination: false,
  control_calidad: null as TControlCalidad | null,
  controles_calidad_visto_bueno: [] as TControlCalidad[],
  fotos_cc: [] as TFotosCC[],
  cc_muestras: [] as TRendimientoMuestra[],
  rendimientos_lotes: null as TRendimiento | null,
  rendimientos_lotes_por_ids: [] as any,
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
  allcc: [],

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
      .addCase(fetchControlesDeCalidadPaginados.pending, (state) => {
        console.log('fetchControlesDeCalidadPaginados.pending')
        state.loading_pagination = true
        state.error = null
      })
      .addCase(fetchControlesDeCalidadPaginados.fulfilled, (state, action) => {
        console.log('fetchControlesDeCalidadPaginados.fulfilled payload:', action.payload)
        state.loading_pagination = false
        
        // Backend returns: { resultados: TControlCalidad[], rango: { desde, hasta, total_controles, controles_en_rango } }
        if (action.payload && action.payload.resultados && action.payload.rango) {
          state.controles_calidad_paginados = action.payload.resultados
          state.pagination_metadata = {
            total_count: action.payload.rango.total_controles || 0,
            desde: action.payload.rango.desde || 0,
            hasta: action.payload.rango.hasta || 9,
            has_next: (action.payload.rango.hasta + 1) < action.payload.rango.total_controles,
            has_previous: action.payload.rango.desde > 0
          }
        } else if (Array.isArray(action.payload)) {
          // Fallback if the API returns just the array
          state.controles_calidad_paginados = action.payload
          // Keep existing pagination metadata or set defaults
        } else {
          console.error('Unexpected payload format:', action.payload)
          state.controles_calidad_paginados = []
        }
        
        console.log('Updated state:', {
          controles_calidad_paginados: state.controles_calidad_paginados.length,
          pagination_metadata: state.pagination_metadata
        })
      })
      .addCase(fetchControlesDeCalidadPaginados.rejected, (state, action) => {
        console.log('fetchControlesDeCalidadPaginados.rejected:', action.payload)
        state.loading_pagination = false
        state.error = action.payload as string
      })
      .addCase(fetchRendimientosLotesPorIds.fulfilled, (state, action) => {
        state.rendimientos_lotes_por_ids = action.payload
      })
      .addCase(fetchRendimientoLotes.fulfilled, (state, action) => {
        state.rendimientos_lotes = action.payload
        if (state.rendimientos_lotes && action.payload ){
          const information = action.payload
          information.id = action.meta.arg.id
          state.todos_los_rendimientos.push(action.payload)
        }
      })
      .addCase(fetchAllCC.fulfilled, (state, action) => {
        state.allcc = action.payload
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