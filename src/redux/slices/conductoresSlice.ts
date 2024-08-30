// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TConductor, TOperarios, TProductor } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction } from 'react'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils'

export const fetchConductores = createAsyncThunk('conductores/fetch_conductores', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/registros/choferes/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 400) {
      const errorData = await response.json()
      toast.error(`${errorData.telefono[0]}`)
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});



export const crearConductor = createAsyncThunk(
  'conductores/crear', 
  async (payload: PostOptions, thunkAPI) => {
    const { data, token, verificar_token, action } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPost(`api/registros/choferes/`, data, token_verificado)

      if (response.ok) {
        toast.success("Conductor creado exitosamente")
        const data = await response.json();
        action!(false)
        return data;
      } else {
        toast.error("No se ha podido crear el conductor exitosamente")
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchConductor = createAsyncThunk('conductores/fetch', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithToken(`api/registros/choferes/${id}/`, token_verificado)

    if (!response.ok) {
      return thunkAPI.rejectWithValue(await response.json());
    }
      const data = await response.json();
      return data;
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});



export const deleteConductor = createAsyncThunk('conductores/delete', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {

     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithTokenDelete(`api/registros/choferes/${id}/`, token_verificado)

    if (response.ok) {
      toast.success("Conductor Eliminado exitosamente")
      return id
    } else {
      toast.error("No se pudo eliminar el conductor")
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});


export const editarConductor = createAsyncThunk(
  'conductores/edit',
  async (payload: PutOptions, thunkAPI) => {
    const { id, data, token, action, verificar_token } = payload;
    try {

       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPatch(`api/registros/choferes/${id}/`, data, token_verificado)

      if (response.ok) {
        toast.success("Conductor actualizado exitosamente!")
        const data = await response.json();
        action!(false)
        return data;
      } else if (response.status === 400) {
        const errorData = await response.json()
        toast.error(`${errorData.telefono[0]}`)
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  conductores: [] as TConductor[],
  conductor: null as TConductor | null,
  loading: false,
  error: null as string | null | undefined
};


export const OperarioSlice = createSlice({
  name: 'conductores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchConductores.fulfilled, (state, action) => {
        state.conductores = action.payload;
      })
      .addCase(fetchConductores.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(crearConductor.fulfilled, (state, action) => {
        state.conductores.push(action.payload);
      })
      .addCase(crearConductor.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchConductor.fulfilled, (state, action) => {
        state.conductor = action.payload;
      })
      .addCase(fetchConductor.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteConductor.fulfilled, (state, action) => {
        state.conductores = state.conductores.filter(conductor => conductor.id !== action.payload);
      })
      .addCase(deleteConductor.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editarConductor.fulfilled, (state, action) => {
        const index = state.conductores.findIndex(conductor => conductor.id === action.payload.id);
        
        if (index !== -1) {
          state.conductores[index] = {
            ...state.conductores[index], 
            ...action.payload 
          };
        }
      })
      .addCase(editarConductor.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});


export default OperarioSlice.reducer;
