// productorSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { TAuth, TCamion } from '../../types/TypesRegistros.types'
import toast from 'react-hot-toast'
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types'
import { fetchWithToken, retryRequest } from '../../utils/peticionesAxios'
import { fetchWithTokenDelete, fetchWithTokenPatch, fetchWithTokenPost } from '../../utils/peticiones.utils'


export const crearCamion = createAsyncThunk(
  'camion/crear',
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, action, verificar_token } = payload;
    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no verificado');

      const res = await fetchWithTokenPost(`api/registros/camiones/`, data, token_verificado)
      if (res.ok) {
        toast.success('Camión registrado exitosamente')
        const data = await res.json();
        action!(false);
        return data;
      } else if (res.status === 400) {
        const errorData = await res.json();
        toast.error(`${errorData.patente[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.patente[0]}`);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`ERROR: ${error.message}`);
    }
  }
);

export const fetchCamion = createAsyncThunk(
  'camion/fetch',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_verificado = await verificar_token(token);

      if (!token_verificado) {
        throw new Error('Token no verificado');
      }

      const response_camion = await retryRequest(() => fetchWithToken(`api/registros/camiones/${id}/`, token_verificado));
      if (response_camion.status === 200) {
        return response_camion.data;
      } else if (response_camion.status === 400) {
        const errorData = response_camion.data;
        toast.error(`${errorData.patente[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.patente[0]}`);
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
  }
);

export const deleteCamion = createAsyncThunk(
  'camion/delete',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no verificado');
      const res = await fetchWithTokenDelete(`api/registros/camiones/${id}/`, token_verificado);

      if (res.ok) {
        toast.success("Camión Eliminado exitosamente");
        return id;
      } else if (res.status === 400) {
        const errorData = await res.json();
        toast.error(`${errorData.patente[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.patente[0]}`);
      }
    } catch (error: any) {
      throw new Error(`Error en la solicitud: ${error.message}`);
    }
  }
);

export const editarCamion = createAsyncThunk(
  'camion/edit',
  async (payload: PutOptions, thunkAPI) => {
    const { id, data, token, action, verificar_token } = payload;
    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no verificado');
      const res = await fetchWithTokenPatch(`api/registros/camiones/${id}/`, data, token_verificado)
      if (res.ok) {
        const data = await res.json()
        toast.success("Camión actualizado exitosamente!");
        action!(false);
        return data;
      } else if (res.status === 400) {
        const errorData = await res.json();
        toast.error(`${errorData.patente[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.patente[0]}`);
      }
    } catch (error: any) {
      toast.error("Error al actualizar el camión");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCamiones = createAsyncThunk(
  'camiones/fetch',
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload;
    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado)throw new Error('Token no verificado');
      const response_camiones = await retryRequest(() => fetchWithToken('api/registros/camiones/', token_verificado));

      if ([200, 201, 204].includes(response_camiones.status)) {
        return response_camiones.data;
      } else if (response_camiones.status === 400) {
        const errorData = response_camiones.data;
        toast.error(`${errorData.patente[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.patente[0]}`);
      } else {
        return thunkAPI.rejectWithValue(`Error inesperado: ${response_camiones.status}`);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`Error en la solicitud: ${error.message}`);
    }
  }
);

const initialState = {
  camiones: [] as TCamion[],
  camion: null as TCamion | null,
  loading: false,
  erroresCamion: null as string | null,
  error: null as string | null | undefined,
};


const camionesSlice = createSlice({
  name: 'camiones',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Camiones
      .addCase(fetchCamiones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamiones.fulfilled, (state, action) => {
        state.loading = false;
        state.camiones = action.payload;
      })
      .addCase(fetchCamiones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Crear Camion
      .addCase(crearCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camiones.push(action.payload);
      })
      .addCase(crearCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Camion
      .addCase(fetchCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camion = action.payload;
      })
      .addCase(fetchCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete Camion
      .addCase(deleteCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camiones = state.camiones.filter(camion => camion.id !== action.payload);
      })
      .addCase(deleteCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Editar Camion
      .addCase(editarCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editarCamion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.camiones.findIndex(camion => camion.id === action.payload.id);
        if (index !== -1) {
          state.camiones[index] = {
            ...state.camiones[index],
            ...action.payload,
          };
        }
      })
      .addCase(editarCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});


export default camionesSlice.reducer;
