// productorSlice.js
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import { TEnvaseEnGuia, TGuia, TLoteGuia, TLoteRechazado } from '../../types/TypesRecepcionMP.types'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils'
import { TAuth, TVerificar } from '../../types/TypesRegistros.types'
import { FaSearchMinus } from 'react-icons/fa'
import { object } from 'yup'


export const eliminarLoteRecepcionThunk = createAsyncThunk<{},{token: TAuth | null, id_recepcion: string | undefined, id_lote: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'recepcionmp/eliminarLoteRecepcionThunk',
  async ({token, id_recepcion, id_lote, verificar_token}, {rejectWithValue, dispatch}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithTokenDelete(`api/recepcionmp/${id_recepcion}/lotes/${id_lote}`, token_verificado)
      if (response.ok) {
        toast.success('lote eliminado')
        dispatch(fetchLotesPendientesGuiaRecepcion({ id: parseInt(id_recepcion!), token, verificar_token: verificar_token }))
        return {}
      } else {
        toast.error('error al eliminar el lote')
      }
    } catch (error: any) {
      toast.error('error al eliminar el lote')
      return rejectWithValue(error.response.data)
    }
  }
)

export const crearGuiadeRecepcion = createAsyncThunk('recepcionmp/crear_guia', 
  async (payload: PostOptions, ThunkApi) => {
    const { token, data, verificar_token } = payload

    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithTokenPost(`api/recepcionmp/`, data, token_verificado)
       if (response.ok) {
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        return ThunkApi.rejectWithValue('No se logro crear la guía')
       }
    } catch (error) {
      return ThunkApi.rejectWithValue('No se logro crear la guía')
    }
  })

export const añadirLoteAGuia = createAsyncThunk('recepcionmp/lote_en_guia', 
  async (payload: PostOptions, ThunkApi) => {
    const { id, data, token, verificar_token} = payload

    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithTokenPost(`api/recepcionmp/${id}/lotes/`, data, token_verificado)

       if (response.ok) {
         // toast.success(``)
        const data = await response.json()
        return data
       } else if (response.status === 400) {
        const errorData = await response.json()
        toast.error(`${Object.entries(errorData)}`)
        return ThunkApi.rejectWithValue('No se logro hacer la petición')
       }

    } catch (error) {
      return ThunkApi.rejectWithValue('No se logro hacer la petición')
      
    }

})

export const fetchGuiasdeRecepcion = createAsyncThunk('recepcionmp/fetch_guias', 
  async (payload: FetchOptions, ThunkApi) => {
    const { token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/recepcionmp/`, token_verificado)
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

export const fetchKilosRecepcion = createAsyncThunk('recepcionmp/get_all_kilos_lotes_recepcionados/', 
  async (payload: FetchOptions, ThunkApi) => {
    const { token, verificar_token } = payload
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/recepcionmp/get_all_kilos_lotes_recepcionados`, token_verificado)
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

export const fetchGuiasdeRecepcionByComercializador = createAsyncThunk('recepcionmp/fetch_guias', 
  async (payload: any, ThunkApi) => {
    const { params, token, verificar_token } = payload
    const {search} = params
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

       const response = await fetchWithToken(`api/recepcionmp/get_by_comercializador/${search}`, token_verificado)
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

export const fetchGuiaRecepcion = createAsyncThunk('recepcionmp/fetch_guia', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, token, verificar_token } = payload

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

     const response = await fetchWithToken(`api/recepcionmp/${id}/`, token_verificado)
     if (response.ok){
      const data = await response.json()
      return data
     } else if (response.status === 400) {
      return ThunkApi.rejectWithValue(`No se pudo hacer la peticion`)
     }
  } catch (error) {
    return ThunkApi.rejectWithValue(`No se pudo hacer la peticion`)
  }
})

export const fetchLotesPendientesGuiaRecepcion = createAsyncThunk('recepcionmp/fetch_lotes_pendientes_guia', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/recepcionmp/${id}/lotes/lotes_pendientes/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo hacer la petición')
  }

})

export const fetchEnvasesRecepcionMP = createAsyncThunk('recepcionmp/fetch_envases_lotes_guias_recepcion', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, token, params, verificar_token } = payload
  //@ts-ignore
  const { id_lote, setOpen } = params

  try {
    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/recepcionmp/${id}/lotes/${id_lote}/envases/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo hacer la petición')
  }

})

export const fetchLotesAprobadosGuiaRecepcion = createAsyncThunk('recepcionmp/fetch_lotes_aprobados_guia', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/recepcionmp/${id}/lotes/lotes_aprobados/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo hacer la petición')
  }

})

export const fetchLoteGuiaRecepcionIndividual = createAsyncThunk('recepcionmp/fetch_lote_guia', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, params, token, verificar_token } = payload
  //@ts-ignore
  const { id_lote } = params

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/recepcionmp/${id}/lotes/${id_lote}/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo hacer la petición')
  }

})

export const fetchLoteRechazadosGuiaRecepcion = createAsyncThunk('recepcionmp/fetch_lote_rechazados_guia', 
  async (payload: FetchOptions, ThunkApi) => {
  const { id, token, verificar_token } = payload

  try {
    const token_verificado = await verificar_token(token)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/recepcionmp/${id}/lotes/lotes_rechazados/`, token_verificado)
    if (response.ok){
      const data = await response.json()
      return data
    } else if (response.status === 400) {
      return ThunkApi.rejectWithValue('No se pudo hacer la petición')
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo hacer la petición')
  }

})

export const eliminarGuiaRecepcion = createAsyncThunk('recepcionmp/delete_guia', async (payload: FetchOptions, ThunkApi) => {
  const { id, token, verificar_token } = payload;

  try {
    const token_verificado = await verificar_token(token);

    if (!token_verificado) {
      throw new Error('Token no verificado');
    }

    const response = await fetchWithTokenDelete(`api/recepcionmp/${id}/`, token_verificado);
    if (response.ok) {
      toast.success(`Guía N° ${id} eliminada exitosamente`);
      return id;
    } else if (response.status === 400) {
      toast.error(`La Guía N° ${id} No se pudo eliminar`);
      return ThunkApi.rejectWithValue('No se pudo eliminar');
    } else {
      return ThunkApi.rejectWithValue('Error desconocido');
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo eliminar');
  }
})



// ACTUALIZACIONES
export const actualizar_envase = createAsyncThunk(
  'recepcionmp/actualizar_envase', 
  async (payload: PostOptions, ThunkApi) => {
  const { id, token, data, verificar_token, params } = payload
  //@ts-ignore
  const { setOpen, id_lote, id_envase } = params

  try {
    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado');
    const response =  await fetchWithTokenPatch(`api/recepcionmp/${id}/lotes/${id_lote}/envases/${id_envase}/`, data, token_verificado);
    if (response.ok) {
      const data: TLoteGuia = await response.json()
      toast.success("Actualización de envase exitoso")
      setOpen(false)
      ThunkApi.dispatch(fetchEnvasesRecepcionMP({ id, params: { id_lote: id_lote }, token, verificar_token }))
      return data
    } else if (response.status === 400) {
      toast.error(`La Guía N° ${id} No se pudo eliminar`);
      return ThunkApi.rejectWithValue('No se pudo eliminar');
    } else {
      return ThunkApi.rejectWithValue('Error desconocido');
    }
  } catch (error) {
    return ThunkApi.rejectWithValue('No se pudo eliminar');
  }
})

export const registro_envase_lote = createAsyncThunk(
  'recepcionmp/registro_envase_en_lote/', 
  async (payload: PostOptions, ThunkApi) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_lote, setOpen } = params

    const token_verificado = await verificar_token(token)
    if (!token_verificado) throw new Error('Token no verificado');
    const res = await fetchWithTokenPost(`api/recepcionmp/${id}/lotes/${id_lote}/envases/creacion-envases/`, data, token_verificado)
    if (res.ok) {
      const data: TEnvaseEnGuia = await res.json()
      toast.success("Lote actualizado exitosamente")
      ThunkApi.dispatch(fetchEnvasesRecepcionMP({ id: data.recepcionmp, token, verificar_token }))
      setOpen(false)
      return data
    } else if (res.status === 400) {
      toast.error(`La Guía N° ${id} No se pudo eliminar`);
      return ThunkApi.rejectWithValue('No se pudo eliminar');
    } else {
      return ThunkApi.rejectWithValue('Error desconocido');
    }
    
  })



// const actualizarEnvaseEspecifico = async (id_envase: number, data: any) => {
//   const token_verificado = await verificarToken(token!)

//   if (!token_verificado) throw new Error('Token no verificado')
//   const res = await fetchWithTokenPatch(`api/envaseguiamp/${id_envase}/`, {
//     ...data
//   }, token_verificado)

//   if (res.ok){
//     toast.success("Actualización de envase exitoso")
//     dispatch(fetchGuiaRecepcion({ id: parseInt(id_guia_recepcion!), token, verificar_token: verificarToken }))
//   } else {
//     toast.error("Revisa hubo un error")
//   }
// }







const initialState = {
  guias_recepcion: [] as TGuia[],
  guia_recepcion: null as TGuia | null,


  lotes_pendientes: [] as TLoteGuia[],
  lotes_aprobados: [] as TLoteGuia[],
  lotes_rechazados: [] as TLoteRechazado[],


  lote: null as TLoteGuia | null,
  envases: [] as TEnvaseEnGuia[],
  envase: null as TEnvaseEnGuia | null,

  envases_lotes: [] as TEnvaseEnGuia[],
  loading: false,
  error: null as string | null | undefined,
  kilos_recepcion: null as any,
};


export const GuiaRecepcion = createSlice({
  name: 'guias_recepcion',
  initialState,
  reducers: {
    GUARDAR_GUIA_RECEPCION: (state, action) => {
      state.guias_recepcion.push(action.payload)
    },
    GUARDAR_GUIA_ACTUALIZADA: (state, action) => {
      const index = state.guias_recepcion.findIndex(guia => guia.id === action.payload.id);
        
        if (index !== -1) {
          state.guias_recepcion[index] = {
            ...state.guias_recepcion[index], 
            ...action.payload 
          };
        }
    },
    GUARDAR_LOTES_EN_GUIA: (state, action) => {
      state.lotes_pendientes.push(action.payload)
    },



    AGREGAR_FILA_ENVASES_LOTE: (state, action: PayloadAction<TEnvaseEnGuia>) => {
      state.envases_lotes.push(action.payload)
    },
    ELIMINAR_FILA_ENVASES_LOTE: (state, action: PayloadAction<number>) => {
      state.envases_lotes = state.envases_lotes.filter((_envase, index) => index !== action.payload)
    },
    ACTUALIZAR_FILA_ENVASES_LOTE: (state, action: PayloadAction<any>) => {
      const { id, key, value } = action.payload;
      const index = state.envases_lotes.findIndex(envase => envase.id === id);
      if (index !== -1) {
        state.envases_lotes[index] = {
          ...state.envases_lotes[index],
          [key]: value,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(crearGuiadeRecepcion.fulfilled, (state, action) => {
        state.guias_recepcion.push(action.payload);
      })
      .addCase(crearGuiadeRecepcion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(añadirLoteAGuia.fulfilled, (state, action) => {
        state.lotes_pendientes.push(action.payload)
      })
      .addCase(añadirLoteAGuia.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchGuiaRecepcion.fulfilled, (state, action) => {
        state.guia_recepcion = action.payload
      })
      .addCase(fetchGuiaRecepcion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchGuiasdeRecepcion.fulfilled, (state, action) => {
        state.guias_recepcion = action.payload
      })
      .addCase(fetchGuiasdeRecepcion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchKilosRecepcion.fulfilled, (state, action) => {
        state.kilos_recepcion = action.payload
      })
      .addCase(fetchKilosRecepcion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(eliminarGuiaRecepcion.fulfilled, (state, action) => {
        state.guias_recepcion = state.guias_recepcion.filter(guia => guia.id !== action.payload);
      })
      .addCase(eliminarGuiaRecepcion.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchLoteGuiaRecepcionIndividual.fulfilled, (state, action) => {
        state.lote = action.payload
      })
      .addCase(fetchLoteGuiaRecepcionIndividual.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchLotesPendientesGuiaRecepcion.fulfilled, (state, action) => {
        state.lotes_pendientes = action.payload
      })
      .addCase(fetchLotesAprobadosGuiaRecepcion.fulfilled, (state, action) => {
        state.lotes_aprobados = action.payload
      })
      .addCase(fetchLoteRechazadosGuiaRecepcion.fulfilled, (state, action) => {
        state.lotes_rechazados = action.payload
      })
      
      .addCase(fetchEnvasesRecepcionMP.fulfilled, (state, action) => {
        state.envases_lotes = action.payload
      })
      
      // .addCase(fetchGuiaRecepcion.fulfilled, (state, action) => {
      //   state.guia_recepcion = action.payload;
      // })
      // .addCase(fetchGuiaRecepcion.rejected, (state, action) => {
      //   state.error = action.error.message;
      // })
      // .addCase(deleteGuiaRecepcion.fulfilled, (state, action) => {
      //   state.guias_recepcion = state.guias_recepcion.filter(guia => guia.id !== action.payload);
      // })
      // .addCase(deleteGuiaRecepcion.rejected, (state, action) => {
      //   state.error = action.error.message;
      // })
      // .addCase(edicionGuia.fulfilled, (state, action) => {
        // const index = state.guias_recepcion.findIndex(guia => guia.id === action.payload.id);
        
        // if (index !== -1) {
        //   state.guias_recepcion[index] = {
        //     ...state.guias_recepcion[index], 
        //     ...action.payload 
        //   };
        // }
      // })
      // .addCase(edicionGuia.rejected, (state, action) => {
      //   state.error = action.error.message;
      // });
  }
});


export const { 
  GUARDAR_GUIA_RECEPCION, 
  GUARDAR_LOTES_EN_GUIA,
  GUARDAR_GUIA_ACTUALIZADA,






  AGREGAR_FILA_ENVASES_LOTE,
  ELIMINAR_FILA_ENVASES_LOTE,
  ACTUALIZAR_FILA_ENVASES_LOTE
} = GuiaRecepcion.actions

export default GuiaRecepcion.reducer;
