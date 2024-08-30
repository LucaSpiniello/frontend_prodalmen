import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TAuth, TPersonalizacion } from '../../types/TypesRegistros.types';
import toast from 'react-hot-toast';
import { FetchOptions, PutOptions } from '../../types/fetchTypes.types';
import { fetchWithToken, fetchWithTokenPost, fetchWithTokenPut, fetchWithTokenPutWithFiles } from '../../utils/peticiones.utils';
import { UserGroups, UserMe, Usuario } from '../../types/coreTypes.type';



export const fetchUsuarioRegistrador = createAsyncThunk(
  'usuario/fetch_registrador',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
      const token_validado = await verificar_token(token!)

      if (!token_validado) {
        throw new Error('El token no es valido')
      }

      const response_usuario = await fetchWithToken(`api/registros/usuarios/${id}/`, token_validado)

      if (response_usuario.ok){
        const data = await response_usuario.json()
        return data
      } else if (response_usuario.status === 400) {
        const erroData = await response_usuario.json()
        toast.error(`${erroData.fecha_nacimiento[0]}`)
        return thunkAPI.rejectWithValue({ error: erroData.fecha_nacimiento[0] });
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
);


export const actualizarUsuario = createAsyncThunk(
  'usuario/update',
  async (payload: PutOptions, thunkAPI) => {
    const { token, data, verificar_token } = payload

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) {
        throw new Error('El token no es valido')
      }

      const response_usuario = await fetchWithTokenPutWithFiles(`auth/users/me/`, data, token_validado)

      if (response_usuario.ok){
        toast.success("Perfil actualizado correctamente")
        const data = await response_usuario.json()
        return data
      } else if (response_usuario.status === 400) {
        const erroData = await response_usuario.json()
        toast.error(`${erroData.fecha_nacimiento[0]}`)
        return thunkAPI.rejectWithValue({ error: erroData.fecha_nacimiento[0] });
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
);

  
export const actualizarPersonalizacion = createAsyncThunk(
  'personalizacion/update',
  async (payload: PutOptions, thunkAPI) => {
    const { id, token, data ,mensaje, verificar_token } = payload

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) {
        throw new Error('El token no es valido')
      }

      const response_personalizacion = await fetchWithTokenPut(`api/registros/personalizacion-perfil/${id}/`, data, token_validado)

      if (response_personalizacion.ok){
        const data = await response_personalizacion.json()
        toast.success(mensaje!)
        return data
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); // Devuelve una acción rechazada con el valor del error
    }
  }
);



const initialState = {
    authTokens: null as TAuth | null,
    dataUser: null as UserMe | null,
    personalizacion: null as TPersonalizacion | null,
    grupos: null as UserGroups | null,
    usuario_registrador: null as Usuario | null,
    loading: false,
    error: null as string | null | undefined
  };


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        GUARDAR_TOKENS: (state, action: PayloadAction<TAuth | null>) => {
            state.authTokens = action.payload
        },
        GUARDAR_USER: (state, action) => {
            state.dataUser = action.payload
        },
        GUARDAR_PERSONALIZACION: (state, action) => {
            state.personalizacion = action.payload
        },
        GUARDAR_GRUPO: (state, action) => {
          state.grupos = action.payload
      }
        // GUARDAR_PERMISOS: (state, action) => {
        //     state.permisos = action.payload.groups
        // }
    },
    extraReducers: (builder) => {
      builder
      .addCase(actualizarUsuario.fulfilled, (state, action: PayloadAction<UserMe>) => {
        state.dataUser = action.payload;
      })
      .addCase(actualizarPersonalizacion.fulfilled, (state, action) => {
        state.personalizacion = action.payload;
      })
      .addCase(fetchUsuarioRegistrador.fulfilled, (state, action) => {
        state.usuario_registrador = action.payload;
      })
    }
    
})

export const { GUARDAR_TOKENS, GUARDAR_USER, GUARDAR_PERSONALIZACION, GUARDAR_GRUPO } = authSlice.actions

export default authSlice.reducer