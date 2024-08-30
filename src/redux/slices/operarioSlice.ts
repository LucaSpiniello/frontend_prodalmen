// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TAuth, TOperarios, TProductor, TSkill, TVerificar } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction } from 'react'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils';
import { TDetalleDiaOperario } from '../../types/TypesProduccion.types';


export const fetchOperarios = createAsyncThunk('operarios/fetch', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;
  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/registros/operarios/`, token_verificado)

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

export const fetchListaDetalleDiasOperarioProduccion = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioProduccion',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/produccion/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchListaDetalleDiasOperarioReproceso = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioReproceso',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/reproceso/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchListaDetalleDiasOperarioSeleccion = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioSeleccion',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/seleccion/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchListaDetalleDiasOperarioProgPH = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioProgPH',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/programas/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchListaDetalleDiasOperarioEmbalaje = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioEmbalaje',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/embalaje/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchListaDetalleDiasOperarioProcPH = createAsyncThunk<TDetalleDiaOperario[], {token: TAuth | null, id_programa: string | number | undefined, id_operario: string | number | undefined, verificar_token: TVerificar}, {rejectValue: string}>(
  'operario/fetchListaDetalleDiasOperarioProcPH',
  async ({id_operario, id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado){
        throw new Error('Token no verificado')
      }
      const response = await fetchWithToken(`api/procesos/${id_programa}/dias_trabajados_operario/?operario_id=${id_operario}`, token_verificado)
      if (response.ok) {
        return await response.json()
      } else {
        return await response.json()
      }
    } catch (error: any) {
      return rejectWithValue(error)
    }
  }
)

export const fetchOperariosFiltro = createAsyncThunk<TOperarios[], {token: TAuth | null, verificar_token: TVerificar, nombre?: string, apellido?: string, skill?: string}, {rejectValue: string}>('operarios/fetchOperariosFiltro', 
    async ({token, apellido, nombre, skill, verificar_token}, {rejectWithValue}) => {
        try {
            const token_verificado = await verificar_token(token)
            if (!token_verificado){
                throw new Error('Token no verificado')
            }
            const response = await fetchWithToken(`api/registros/operarios/${skill ?? ''}${nombre ?? ''}${apellido ?? ''}`, token_verificado)
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                return rejectWithValue(await response.json());
            }
        } catch (error: any) {
            throw new Error(`Error en la solicitud: ${error.message}`);
        }
});

export const fetchOperariosWithSearch = createAsyncThunk('operarios/fetch_with_search', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token, params } = payload;
    //@ts-ignore
    const { search } = params
    try {
      const token_verificado = await verificar_token(token)
      
      if (!token_verificado){
        throw new Error('Token no verificado')
      }

      const response = await fetchWithToken(`api/registros/operarios/?search=${search}`, token_verificado)

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
  }
);


export const agregarSkills = createAsyncThunk(
  'opererarios/skills', 
  async (payload: PostOptions, thunkAPI) => {
    const { id, data, token, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPost(`api/registros/operarios/${id}/agregar-skill/`, data, token_verificado)

      if (response.ok) {
        toast.success("Skill a operario creado exitosamente")
        return { id: id, data: data }
      } else {
        toast.error("No se ha podido crear el skill exitosamente")
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchOperario = createAsyncThunk('operario/fetch', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/registros/operarios/${id}/`, token_verificado)

    if (!response.ok) {
      return thunkAPI.rejectWithValue(await response.json());
    }
      const data = await response.json();
      return data;
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});



export const deleteOperario = createAsyncThunk('operarios/delete', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithTokenDelete(`api/registros/operarios/${id}`, token_verificado)

    if (response.ok) {
      toast.success("Operario Eliminado exitosamente")
      return id;
    } else {
      toast.error("No se pudo eliminar el operario")
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});


export const editOperario = createAsyncThunk(
  'operarios/editable',
  async (payload: PutOptions, thunkAPI) => {
    const { id, data, verificar_token, token, action } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPut(`api/registros/operarios/${id}/`, data, token_verificado)

      if (response.ok) {
        toast.success("Operario actualizado exitosamente!")
        const data = await response.json();
        action!(false)
        return data;
      } else {
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      toast.error("Error al actualizar el operario")
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  operarios: [] as TOperarios[],
  operario: null as TOperarios | null,
  loading: false,
  error: null as string | null | undefined,
  diasOperario: [] as TDetalleDiaOperario[] 
};


export const OperarioSlice = createSlice({
  name: 'operarios',
  initialState,
  reducers: {
    GUARDAR_OPERARIO: (state, action) => {
      state.operarios.push(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOperarios.fulfilled, (state, action) => {
        state.operarios = action.payload;
      })
      .addCase(fetchOperariosWithSearch.fulfilled, (state, action) => {
        state.operarios = action.payload;
      })
      .addCase(fetchOperarios.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchOperario.fulfilled, (state, action) => {
        state.operario = action.payload;
      })
      .addCase(fetchOperario.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteOperario.fulfilled, (state, action) => {
        state.operarios = state.operarios.filter(operario => operario.id !== action.payload);
      })
      .addCase(deleteOperario.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editOperario.fulfilled, (state, action) => {
        const index = state.operarios.findIndex(productor => productor.id === action.payload.id);
        
        if (index !== -1) {
          state.operarios[index] = {
            ...state.operarios[index], 
            ...action.payload 
          };
        }
      })
      .addCase(editOperario.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(agregarSkills.fulfilled, (state, action) => {

        const operario = state.operarios.find(operario => operario.id === action.payload.id);

        // if (operario) {
        //   operario.skills.push(action.payload.operario_skill);
        // }
      })
      .addCase(agregarSkills.rejected, (state, action) => {
        // Manejar el error al agregar el skill
        state.error = action.error.message;
      })
      .addCase(fetchOperariosFiltro.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOperariosFiltro.fulfilled, (state, action) => {
        state.operarios = action.payload
        state.loading = false
      })
      .addCase(fetchOperariosFiltro.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioProduccion.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioProduccion.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioProduccion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioSeleccion.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioSeleccion.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioSeleccion.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioReproceso.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioReproceso.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioReproceso.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioProgPH.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioProgPH.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioProgPH.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioProcPH.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioProcPH.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioProcPH.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioEmbalaje.pending, (state) => {
        state.loading = false
      })
      .addCase(fetchListaDetalleDiasOperarioEmbalaje.fulfilled, (state, action) => {
        state.loading = false
        state.diasOperario = action.payload
      })
      .addCase(fetchListaDetalleDiasOperarioEmbalaje.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
});

export const { 
  GUARDAR_OPERARIO
} = OperarioSlice.actions


export default OperarioSlice.reducer;
