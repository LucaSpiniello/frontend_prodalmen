
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TComercializador } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction } from 'react'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenPost, fetchWithTokenPut } from '../../utils/peticiones.utils'

type CreateComercializadorPayload = {
  id?: number
  comercializador?: TComercializador
  token: string
  isOpen: Dispatch<SetStateAction<boolean>>

}

interface IComercializadorPayload {
  id: number,
  token: string
  isOpen: Dispatch<SetStateAction<boolean>>
}

export const fetchComercializadores = createAsyncThunk('comercializador/fetch_comercializadores', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }
    const response = await fetchWithToken(`api/comercializador/`, token_verificado)

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



export const crearComercializador = createAsyncThunk(
  'comercializador/crear', 
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, action, verificar_token } = payload;
    
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPost(`api/comercializador/`, data, token_verificado)

      if (response.ok) {
        toast.success("Comercializador creado exitosamente")
        const data = await response.json();
        action!(false)
        return data;
      } else {
        toast.error("No se ha podido crear el comercializador exitosamente")
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


export const fetchComercializador = createAsyncThunk('comercializador/fetch', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithToken(`api/comercializador/${id}/`, token_verificado)

    if (!response.ok) {
      return thunkAPI.rejectWithValue(await response.json());
    }
      const data = await response.json();
      return data;
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});



export const deleteComercializador = createAsyncThunk('comercializador/delete', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
    
     if (!token_verificado){
        throw new Error('Token no verificado')
     }

    const response = await fetchWithTokenDelete(`api/comercializador/${id}/`, token_verificado)

    if (response.ok) {
      toast.success("Comercializador Eliminado exitosamente")
      return id;
    } else {
      toast.error("No se pudo eliminar el comercializador")
      return thunkAPI.rejectWithValue(await response.json());
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});


export const editarComercializador = createAsyncThunk(
  'comercializador/edit',
  async (payload: PutOptions, thunkAPI) => {
    const { id, verificar_token, token, action, data } = payload;
    
    try {
       const token_verificado = await verificar_token(token)
      
       if (!token_verificado){
          throw new Error('Token no verificado')
       }

      const response = await fetchWithTokenPut(`api/comercializador/${id}/`, data, token_verificado)

      if (response.ok) {
        toast.success("Comercializador actualizado exitosamente!")
        const data = await response.json();
        action!(false)
        return data;
      } else if (response.status === 400) {
        const errorData = await response.json()
        toast.error(`${errorData.email[0]}`)
        return thunkAPI.rejectWithValue(await response.json());
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  comercializadores: [] as TComercializador[],
  comercializador: null as TComercializador | null,
  loading: false,
  error: null as string | null | undefined
};


export const ComercializadoresSlice = createSlice({
  name: 'comercializadores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComercializadores.fulfilled, (state, action) => {
        state.comercializadores = action.payload;
      })
      .addCase(fetchComercializadores.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(crearComercializador.fulfilled, (state, action) => {
        state.comercializadores.push(action.payload);
      })
      .addCase(crearComercializador.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchComercializador.fulfilled, (state, action) => {
        state.comercializador = action.payload;
      })
      .addCase(fetchComercializador.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(deleteComercializador.fulfilled, (state, action) => {
        state.comercializadores = state.comercializadores.filter(comercializador => comercializador.id !== action.payload);
      })
      .addCase(deleteComercializador.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(editarComercializador.fulfilled, (state, action) => {
        const index = state.comercializadores.findIndex(comercializador => comercializador.id === action.payload.id);
        
        if (index !== -1) {
          state.comercializadores[index] = {
            ...state.comercializadores[index], 
            ...action.payload 
          };
        }
      })
      .addCase(editarComercializador.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});


export default ComercializadoresSlice.reducer;
