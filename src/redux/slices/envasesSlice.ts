// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TOperarios, TProductor } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { Dispatch, SetStateAction } from 'react'
import { TEnvases } from '../../types/TypesRecepcionMP.types'
import { FetchOptions, PostOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, fetchWithTokenPost } from '../../utils/peticiones.utils'

export const fetchEnvases = createAsyncThunk('envases/fetch', 
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;

  try {
     const token_verificado = await verificar_token(token)
  
     if (!token_verificado) throw new Error('Token no verificado')

    const response = await fetchWithToken(`api/envasesmp/`, token_verificado)

    if (response.ok) {
      const data = await response.json();
      return data;
    } else if (response.status === 400) {
      const errorData = await response.json()
      return thunkAPI.rejectWithValue(Object.entries(errorData));
    }
  } catch (error: any) {
    throw new Error(`Error en la solicitud: ${error.message}`);
  }
});

export const fetchEnvaseMateriaPrima = createAsyncThunk('envases/fetch_envase', 
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload

    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithToken(`api/envasesmp/${id}/`, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        return thunkAPI.rejectWithValue(`No se pudo hacer la peticion`)
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(`No se pudo hacer la peticion`)
    }
  }
)


export const crearEnvases = createAsyncThunk('envases/crear_envase' , 
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, verificar_token } = payload

    try {
      const token_verificado = await verificar_token(token)
    
      if (!token_verificado) throw new Error('Token no verificado')

      const response = await fetchWithTokenPost(`api/envasesmp/`, data, token_verificado)
      if (response.ok){
        const data = await response.json()
        return data
      } else if (response.status === 400) {
        const errorData = await response.json()
        toast.error(`${Object.entries(errorData)}`)
        return thunkAPI.rejectWithValue('No se pudo hacer la petición')
      }

    } catch (error) {
      return thunkAPI.rejectWithValue('No se pudo hacer la petición')
    }
})


// export const crearOperario = createAsyncThunk(
//   'productores/crear', 
//   async (payload: CreateEnvasesPayload, thunkAPI) => {
//     try {
//       const { envases, token, isOpen } = payload;

//       const response = await fetch(`http://127.0.0.1:8000/api/registros/operarios/`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(envases)
//       });

//       if (response.ok) {
//         toast.success("Operario creado exitosamente")
//         const data = await response.json();
//         isOpen(false)
//         return data;
//       } else {
//         toast.error("No se ha podido crear el operario exitosamente")
//         return thunkAPI.rejectWithValue(await response.json());
//       }
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );


// export const fetchOperario = createAsyncThunk('productor/fetch', 
//   async (payload: IOperarioPayload, thunkAPI) => {
//     const { id, token, isOpen } = payload;

//   try {
//     const response = await fetch(`http://127.0.0.1:8000/api/registros/operarios/${id}/`, {
//       method: 'GET',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (!response.ok) {
//       return thunkAPI.rejectWithValue(await response.json());
//     }
//       const data = await response.json();
//       return data;
//   } catch (error: any) {
//     throw new Error(`Error en la solicitud: ${error.message}`);
//   }
// });



// export const deleteOperario = createAsyncThunk('productor/delete', 
//   async (payload: IOperarioPayload, thunkAPI) => {
//     const { id, token } = payload;

//   try {
//     const response = await fetch(`http://127.0.0.1:8000/api/registros/operarios/${id}/`, {
//       method: 'DELETE',
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     if (response.ok) {
//       toast.success("Operario Eliminado exitosamente")
//       return id;
//     } else {
//       toast.error("No se pudo eliminar el operario")
//       return thunkAPI.rejectWithValue(await response.json());
//     }
//   } catch (error: any) {
//     throw new Error(`Error en la solicitud: ${error.message}`);
//   }
// });


// export const editOperario = createAsyncThunk(
//   'productor/edit',
//   async (payload: CreateEnvasesPayload, thunkAPI) => {
//     const { id, envases, token, isOpen } = payload;
//     try {
//       const response = await fetch(`http://127.0.0.1:8000/api/registros/operarios/${id}/`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(envases)
//       });

//       if (response.ok) {
//         toast.success("Operario actualizado exitosamente!")
//         const data = await response.json();
//         isOpen(false)
//         return data;
//       } else {
//         return thunkAPI.rejectWithValue(await response.json());
//       }
//     } catch (error: any) {
//       toast.error("Error al actualizar el operario")
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

const initialState = {
  envases: [] as TEnvases[],
  envase: null as TEnvases | null,
  loading: false,
  error: null as string | null | undefined
};


export const EnvasesMpSlice = createSlice({
  name: 'envases',
  initialState,
  reducers: {
    GUARDAR_ENVASE: (state, action) => {
      state.envases.push(action.payload)
    },
    ELIMINAR_ENVASE: (state, action) => {
      state.envases = state.envases.filter(envase => envase.id !== action.payload)
    }
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnvases.fulfilled, (state, action) => {
        state.envases = action.payload;
      })
      .addCase(fetchEnvases.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(crearEnvases.fulfilled, (state, action) => {
        state.envases.push(action.payload)
      })
      .addCase(crearEnvases.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(fetchEnvaseMateriaPrima.fulfilled, (state, action) => {
        state.envase = action.payload;
      })
      .addCase(fetchEnvaseMateriaPrima.rejected, (state, action) => {
        state.error = action.error.message;
      })
  }
});


export const { 
  ELIMINAR_ENVASE,
  GUARDAR_ENVASE,
 } = EnvasesMpSlice.actions

export default EnvasesMpSlice.reducer;
