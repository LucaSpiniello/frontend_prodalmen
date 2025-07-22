import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PDFSalida, TDetalleDiaOperario, TEnvasesPrograma, TListaOperarioEnProduccion, TLoteProduccion, TMensajeCierreProduccion, TMensajeTerminoProduccion, TMetricasTiempoRealProduccion, TOperarioEnProduccion, TOperarioProduccion, TPDFDetallEntradaPrograma, TPDFDetalleEnvases, TProduccion, TTarjaResultante } from '../../types/TypesProduccion.types';
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPostAction, fetchWithTokenPut } from '../../utils/peticiones.utils';
import { TEnvasePatio } from '../../types/TypesBodega.types';
import toast from 'react-hot-toast';
import { TAuth, TVerificar } from '../../types/TypesRegistros.types';

const estados = [
	{value: '0',label: 'Pausada' },
  {value: '1', label: 'Registrado, Esperando Inicio'},
	{value: '2',label: 'Proceso'},
  {value: '3', label: 'Reproceso'},
  {value: '4', label: 'Terminado, en Espera Resultados'},
	{value: '5',label: 'Completado y Cerrado'}
]


// peticiones GET
export const fetchProgramasProduccion = createAsyncThunk('produccion/fetch_programas', 
async (payload: FetchOptions) => {
  const { token, verificar_token } = payload;

  try {
    const token_verificado = await verificar_token(token)

    if (!token_verificado){
      throw new Error('Token no valido')
    }

    const response_programas = await fetchWithToken(`api/produccion/`, token_verificado)

    if (response_programas){
      const data = await response_programas.json()
      return data
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
})

export const fetchMensajeTerminoProduccion = createAsyncThunk<TMensajeTerminoProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeTerminoProduccion`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/estado_termino_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error obtener mensaje termino produccion')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMensajeCierreProduccion = createAsyncThunk<TMensajeCierreProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `produccion/fetchMensajeCierreProduccion`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/estado_cierre_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener mensaje cierre produccion')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMetricasTiempoRealProduccion = createAsyncThunk<TMetricasTiempoRealProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchMetricasTiempoRealProduccion',
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/metricas_en_tiempo_real/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al eliminar el lote')
      return rejectWithValue(error.response.data)
    }
  }
)

export const  fetchListaOperariosEnPrograma = createAsyncThunk<TListaOperarioEnProduccion[], {token: TAuth | null, id_programa: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchListaOperariosEnPrograma',
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/lista_operarios_dias/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error(`Error ${await response.json()}`)
      }
    } catch (error: any) {
      toast.error('error obtener los operarios de producción')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchProgramaProduccion = createAsyncThunk('produccion/fetch_programa', 
  async (payload: FetchOptions) => {
    const { id, token, verificar_token } = payload;

  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithToken(`api/produccion/${id}/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log('Pequeño error')
    }

  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchEnvasesProduccion = createAsyncThunk('produccion/fetch_envases', 
  async (payload: FetchOptions) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithToken(`api/produccion/${id}/lotes_en_programa/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Wena")
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchEnvasePrograma = createAsyncThunk('programa/fetch_envase', 
  async (payload: FetchOptions) => {
    const { id, params, token, verificar_token } = payload;
    //@ts-ignore
    const { id_envase } = params 

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/produccion/${id}/lotes_en_programa/${id_envase}/`, token_verificado )

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.log("Pequeño error")
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchTarjasResultantes = createAsyncThunk('produccion/fetch_tarjas', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/produccion/${id}/tarjas_resultantes`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchTarjaResultante = createAsyncThunk('programa/fetch_tarja', 
async (payload: FetchOptions) => {
  const { id, verificar_token , token, params } = payload;
  //@ts-ignore
  const { id_tarja } = params

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
     
     const response_tarja = await fetchWithToken(`api/produccion/${id}/tarjas_resultantes/${id_tarja}`, token_verificado)

    if (response_tarja.ok){
      const data = await response_tarja.json()
      return data
    } else {
      console.log("pequeño error")
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
})

// export const fetchOperariosProduccion = createAsyncThunk('produccion/fetch_operarios', 
//   async (payload: FetchOptions, thunkAPI) => {
//     const { id, token, verificar_token } = payload;

//   try {
//      const token_verificado = await verificar_token(token)
    
//      if (!token_verificado){
//         throw new Error('Token no verificado')
//      }

//     const response = await fetchWithToken(`api/produccion/${id}/lista_operarios_dias/`, token_verificado)

//     if (response.ok) {
//       const data = await response.json();
//       return data;
//     } else {
//       return thunkAPI.rejectWithValue(await response.json());
//     }
//   } catch (error: any) {
//     throw new Error(`Error en la solicitud: ${error.message}`);
//   }
// })

export const fetchOperarioPrograma = createAsyncThunk('programa/fetch_operario_individual', 
  async (payload: FetchOptions) => {
  const { id, verificar_token , token, params } = payload;
  //@ts-ignore
  const { rut } = params
  try {
     const token_verificado = await verificar_token(token)
     if (!token_verificado) throw new Error('Token no verificado')
     const response_operario = await fetchWithTokenPost(`api/produccion/${id}/operarios/lista_detalle_dias_operario/`, { rut: rut}, token_verificado)
    if (response_operario.ok){
      const data = await response_operario.json()
      return data
    } else {
      console.log("pequeño error")
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
})

export const fetchPDFDetalleEnvase = createAsyncThunk('produccion/fetch_detalle_envases', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/produccion/${id}/pdf_documento_envases/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchPDFDetalleEntradaPrograma = createAsyncThunk('produccion/fetch_detalle_lotes_programa', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/produccion/${id}/pdf_documento_entrada/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

// Creaciones - Peticiones POST
export const registrar_programa_produccion = createAsyncThunk('programa/crear_programa_produccion', 
  async (payload: PostOptions, thunkAPI) => {
    const { params, token, verificar_token } = payload
    //@ts-ignore
    const { perfil, navigate } = params

    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
			 const response = await fetchWithTokenPost(`api/produccion/`, { registrado_por: perfil?.id }, token_verificado)
			 if (response.ok) {
				const data: TProduccion = await response.json()
				toast.success(`El programa fue creado exitosamente`)
				navigate(`/pro/produccion/registro-programa/${data.id}`, { state: { pathname: '/produccion/' }})
			} else {
				toast.error(`El programa no se puedo crear`)
				return thunkAPI.rejectWithValue('No se pudo crear')
			}
    } catch (error: any) {
				return thunkAPI.rejectWithValue('No se pudo crear')
    }
  }
)


// Actualizaciones - Peticiones PATCH - PUT
export const actualizar_programa_produccion = createAsyncThunk('programa/actualizar_programa_produccion', 
  async (payload: PutOptions, thunkAPI) => {
    const { id, params, token, verificar_token } = payload
    //@ts-ignore
    const { estado, perfil, detalle } = params

    const requestBody: Record<string, any> = {
      id,
      estado,
      registrado_por: perfil.id,
    };

    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response_estado = await fetchWithTokenPatch(`api/produccion/${id}/`, requestBody, token_verificado)
      if (response_estado.ok){
        const data = await response_estado.json()
        toast.success(`El programa esta en ${estados.find(est => est.value === data.estado)?.label}`)
        if (detalle){
          thunkAPI.dispatch(fetchProgramaProduccion({ id, token, verificar_token }))
          // thunkAPI.dispatch(fetchOperariosProduccion({ id, token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchProgramasProduccion({ token: token, verificar_token: verificar_token }))
        }
      } else {
        toast.error('No se pudo actualizar')
        return thunkAPI.rejectWithValue('No se pudo actualizar')
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue('No se pudo actualizar')
    }
  }
)



// ELIMINACIONES - Peticiones DELETE
export const eliminar_tarja_resultante_produccion = createAsyncThunk('programa/fetch_eliminacion_tarja', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params , token, verificar_token } = payload;
    // @ts-ignore
    const { id_programa,  id_tarja } = params

  try {
     const token_verificado = await verificar_token(token)
     if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenDelete(`api/produccion/${id_programa}/tarjas_resultantes/${id_tarja}/`, token_verificado)
    if (response.ok) {
      return id_tarja;
    } else {
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
})

export const eliminar_envase_produccion = createAsyncThunk('programa/fetch_eliminacion_tarja', 
  async (payload: FetchOptions, thunkAPI) => {
    const { params , token, verificar_token } = payload;
    // @ts-ignore
    const { id_programa,  id_lote } = params

  try {
     const token_verificado = await verificar_token(token)
     if (!token_verificado) throw new Error('Token no verificado')
    const response = await fetchWithTokenDelete(`api/produccion/${id_programa}/lotes_en_programa/${id_lote}/`, token_verificado)
    if (response.ok) {
      thunkAPI.dispatch(fetchEnvasesProduccion({ id: id_programa, token, verificar_token }))
      return id_lote;
    } else {
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
})

export const fetchProduccionHora = createAsyncThunk<{series: number[], categories: string[]}, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchProduccionHora',
  async ({id_programa, token, verificar_token }, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/tasa_produccion_hora/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener datos produccion hora')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchDistribuccionResultante = createAsyncThunk<{series: number[], labels: string[]}, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchDistribuccionResultante',
  async ({id_programa, token, verificar_token }, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/distribucion_kilos_tipos_resultante/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener datos distribuccion resultante')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchRendimientoProduccion = createAsyncThunk<{series: number[], categories: string[]}, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchRendimientoProduccion',
  async ({id_programa, token, verificar_token }, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/rendimiento_produccion/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener datos rendimiento produccion')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchPDFDocumentoSalida = createAsyncThunk<PDFSalida, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  'produccion/fetchPDFDocumentoSalida',
  async ({id_programa, token, verificar_token }, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/produccion/${id_programa}/pdf_salida_produccion`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error PDF')
      }
    } catch (error: any) {
      toast.error('error al obtener datos pdf produccion')
      return rejectWithValue(error.response.data)
    }
  }
)


const initialState = {
  programas_produccion: [] as TProduccion[],
  programa: null as TProduccion | null,
  lotes: [] as TLoteProduccion[],
  lote: null as TLoteProduccion | null,
  operarios: [] as TOperarioEnProduccion[],
  operario: [] as TOperarioProduccion[],
  listaOperarios: [] as TListaOperarioEnProduccion[],
  tarjas_resultantes: [] as TTarjaResultante[],
  tarja: null as TTarjaResultante | null,
  loading: false,
  error: null as string | null | undefined,
  envases_lotes: [] as TEnvasePatio[],
  envase_lote: null as TEnvasePatio | null,
  produccionHora: null as {series: number[], categories: string[]} | null,
  horarios_operario: [],
  distribuccionResultante: null as {series: number[], labels: string[]} | null,
  lotes_pre: [] as TLoteProduccion[],
  metricasTiempoRealProduccion: null as TMetricasTiempoRealProduccion | null,
  rendimientoProduccion: null as {series: number[], categories: string[]} | null,
  pdf_detalle_envases: null as TPDFDetalleEnvases | null,
  pdf_detalle_entrada_programa: null as TPDFDetallEntradaPrograma | null,
  mensajeTerminoProduccion: null as TMensajeTerminoProduccion | null,
  mensajeCierreProduccion: null as TMensajeCierreProduccion | null,
  pdfDocumentoSalida: null as PDFSalida | null
};


export const ProduccionSlice = createSlice({
  name: 'produccion',
  initialState,
  reducers: {
    GUARDAR_PROGRAMAS: (state, action) => {
      state.programas_produccion = action.payload
    },
    GUARDAR_PROGRAMA: (state, action: PayloadAction<TProduccion>) => {
      const index = state.programas_produccion.findIndex(progra => progra.id === action.payload.id);

      if (index !== -1){
        state.programas_produccion[index] = {
          ...state.programas_produccion[index],
          ...action.payload
        }
      }
    },
    GUARDAR_LOTES: (state, action) => {
      state.lotes.push(action.payload)
    },
    GUARDAR_LOTES_MASIVO: (state, action) => {
      state.lotes.push(...action.payload);
    },

    GUARDAR_OPERARIO: (state, action) => {
      state.operarios.push(action.payload)
    },
    GUARDAR_LOTE: (state, action) => {
      const index = state.lotes.findIndex(lote => lote.id === action.payload.id)
      if (index !== 1){
        state.lotes[index] = {
          ...state.lotes[index],
          ...action.payload
        }
      }
    },
    GUARDAR_TARJA_NUEVA: (state, action) => {
      state.tarjas_resultantes.push(action.payload)
    },
    GUARDAR_TARJA: (state, action) => {
      const index = state.tarjas_resultantes.findIndex(tarja => tarja.id === action.payload.id)
      if (index !== 1){
        state.tarjas_resultantes[index] = {
          ...state.tarjas_resultantes[index],
          ...action.payload
        }
      }
    },


    ELIMINAR_LOTE: (state, action) => {
      state.lotes = state.lotes.filter(guia => guia.id !== action.payload);
    },
    ELIMINAR_LOTE_MASIVO: (state, action) => {
      // Filtra los lotes que no están en el array de IDs que se van a eliminar
      state.lotes = state.lotes.filter(lote => !action.payload.includes(lote.id));
    },

    // GUARDAR_LOTES_PREVIAMENTE: (state, action) => {
    //   state.lotes_pre = [...state.lotes_pre, ...action.payload];
    // },
    
    // QUITAR_LOTES_PREVIAMENTE: (state, action) => {
    //   // Obtenemos los índices de los lotes previamente seleccionados del payload
    //   const selectedIndexes = action.payload.selectedIndexes;
    
    //   // Mantenemos solo los lotes que están seleccionados
    //   state.lotes_pre = state.lotes_pre.filter((_dato, index) => !selectedIndexes.includes(index));
    // },
    GUARDAR_ENVASES_PREVIAMENTE: (state, action) => {
      state.envases_lotes = [...state.envases_lotes, ...action.payload];
    },
    
    QUITAR_ENVASES_PREVIAMENTE: (state, action) => {
      // Obtenemos los índices de los lotes previamente seleccionados del payload
      const selectedIndexes = action.payload.selectedIndexes;
    
      // Filtramos los lotes previamente seleccionados para mantener solo los que aún están seleccionados
      state.envases_lotes = state.envases_lotes.filter(dato => selectedIndexes.includes(state.envases_lotes.findIndex(item => item === dato)));
    },



    CARGAR_HORARIO: (state: any, action) => {
      
      state.horarios_operario.push(action.payload);
    },
    ELIMINAR_HORARIO: (state: any, action) => {
      state.horarios_operario = state.horarios_operario.filter(
        (horario: any) => horario.id !== action.payload.id
      );
    },
    GUARDAR_MENSAJE_TERMINO: (state, action) => {
      state.mensajeTerminoProduccion = action.payload
    },
    GUARDAR_MENSAJE_CIERRE: (state, action) => {
      state.mensajeCierreProduccion = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProgramasProduccion.pending, (state) => {
      console.log('fetchProgramasProduccion.pending')
      state.loading = true
    })
    .addCase(fetchProgramasProduccion.fulfilled, (state, action) => {
      console.log('fetchProgramasProduccion.fulfilled:', action.payload)
      state.programas_produccion = action.payload
      state.loading = false
    })
    .addCase(fetchProgramasProduccion.rejected, (state, action) => {
      console.log('fetchProgramasProduccion.rejected:', action.error)
      state.loading = false
      state.error = action.error.message
    })
    .addCase(fetchProgramaProduccion.fulfilled, (state, action) => {
      state.programa = action.payload
    })
    .addCase(fetchEnvasesProduccion.fulfilled, (state, action) => {
      state.lotes = action.payload
    })
    .addCase(fetchEnvasePrograma.fulfilled, (state, action) => {
      state.lote = action.payload
    })
    .addCase(fetchTarjasResultantes.fulfilled, (state, action) => {
      state.tarjas_resultantes = action.payload
    })
    .addCase(fetchTarjaResultante.fulfilled, (state, action) => {
      state.tarja = action.payload
    })
    // .addCase(fetchOperariosProduccion.fulfilled, (state, action) => {
    //   state.operarios = action.payload
    // })
    .addCase(fetchOperarioPrograma.fulfilled, (state, action) => {
      state.operario = action.payload
    })
    .addCase(fetchPDFDetalleEnvase.fulfilled, (state, action) => {
      state.pdf_detalle_envases = action.payload
    })
    .addCase(fetchPDFDetalleEntradaPrograma.fulfilled, (state, action) => {
      state.pdf_detalle_entrada_programa = action.payload
    })
    .addCase(fetchListaOperariosEnPrograma.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchListaOperariosEnPrograma.fulfilled, (state, action) => {
      state.listaOperarios = action.payload
      state.loading = false
    })
    .addCase(fetchListaOperariosEnPrograma.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchMetricasTiempoRealProduccion.fulfilled, (state, action) => {
      state.metricasTiempoRealProduccion = action.payload
    })
    .addCase(fetchProduccionHora.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchProduccionHora.fulfilled, (state, action) => {
      state.produccionHora = action.payload
      state.loading = false
    })
    .addCase(fetchProduccionHora.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchDistribuccionResultante.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchDistribuccionResultante.fulfilled, (state, action) => {
      state.distribuccionResultante = action.payload
      state.loading = false
    })
    .addCase(fetchDistribuccionResultante.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchRendimientoProduccion.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchRendimientoProduccion.fulfilled, (state, action) => {
      state.loading = false
      state.rendimientoProduccion = action.payload
    })
    .addCase(fetchRendimientoProduccion.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload
    })
    .addCase(fetchMensajeTerminoProduccion.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeTerminoProduccion.fulfilled, (state, action) => {
      state.mensajeTerminoProduccion = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeTerminoProduccion.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProduccion.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeCierreProduccion.fulfilled, (state, action) => {
      state.mensajeCierreProduccion = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProduccion.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchPDFDocumentoSalida.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchPDFDocumentoSalida.fulfilled, (state, action) => {
      state.pdfDocumentoSalida = action.payload
      state.loading = false
    })
    .addCase(fetchPDFDocumentoSalida.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
  }
});

export const { 
    GUARDAR_PROGRAMAS,
    GUARDAR_PROGRAMA,
    GUARDAR_LOTE,
    GUARDAR_TARJA,
    GUARDAR_TARJA_NUEVA,
    GUARDAR_LOTES,
    GUARDAR_LOTES_MASIVO,
    ELIMINAR_LOTE,
    GUARDAR_OPERARIO,
    ELIMINAR_LOTE_MASIVO,
    // GUARDAR_LOTES_PREVIAMENTE,
    // QUITAR_LOTES_PREVIAMENTE,
    GUARDAR_ENVASES_PREVIAMENTE,
    QUITAR_ENVASES_PREVIAMENTE,
    GUARDAR_MENSAJE_TERMINO,
    GUARDAR_MENSAJE_CIERRE,



    CARGAR_HORARIO,
    ELIMINAR_HORARIO
  } = ProduccionSlice.actions

export default ProduccionSlice.reducer