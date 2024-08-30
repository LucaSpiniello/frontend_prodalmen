import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TProductor } from '../../types/TypesRegistros.types';
import toast from 'react-hot-toast';
import { FetchOptions, PostOptions, PutOptions } from '../../types/fetchTypes.types';
import { fetchWithTokenPatch, fetchWithToken, fetchWithTokenDelete } from '../../utils/peticiones.utils';


export const fetchProductores = createAsyncThunk(
  'productores/fetch',
  async (payload: FetchOptions, thunkAPI) => {
    const { verificar_token, token } = payload;
    try {
      const isTokenValid = await verificar_token(token);
      if (!isTokenValid) throw new Error('El token no es válido');
      const response = await fetchWithToken('api/productores/', isTokenValid!);
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        return thunkAPI.rejectWithValue(`La solicitud falló`);
      }

    } catch (error: any) {
      return thunkAPI.rejectWithValue(`La solicitud falló con el estado ${error.status}`);
    }
  }
);

export const fetchProductor = createAsyncThunk(
  'productor/fetch_productor',
  async (payload: PutOptions, thunkAPI) => {
    const { token, id, verificar_token } = payload;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no valido');

      const res = await fetchWithToken(`api/productores/${id}/`, token_verificado);

      if (res.ok) {
        const data = await res.json()
        return data
      } else {
        const errorData = await res.json();
        toast.error(`${errorData.rut_productor[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.rut_productor[0]}`);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`Error en la solicitud: ${error.message}`);
    }
  }
);

export const editProductor = createAsyncThunk(
  'productor/edit',
  async (payload: PutOptions, thunkAPI) => {
    const { id, data, token, verificar_token, action } = payload;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no valido');

      const response_productor_editado = await fetchWithTokenPatch(`api/productores/${id}/`, data, token_verificado)
      if (response_productor_editado.ok) {
        const data = await response_productor_editado.json()
        toast.success("Productor actualizado correctamente!");
        action!(false);
        return data
      } else if (response_productor_editado.status === 400) {
        const errorData = await response_productor_editado.json()
        toast.error(`${errorData.rut_productor[0]}`);
        return thunkAPI.rejectWithValue(`${errorData.rut_productor[0]}`);
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteProductor = createAsyncThunk(
  'productor/delete',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload;

    try {
      const token_verificado = await verificar_token(token);
      if (!token_verificado) throw new Error('Token no valido');
      const res = await fetchWithTokenDelete(`api/productores/${id}/`, token_verificado) 
      if (res.ok) {
        toast.success('Productor eliminado exitosamente!');
        thunkAPI.dispatch(fetchProductores({ token, verificar_token }))
        return id;
      } else {
        toast.error('Error: Vuelve a interno')
        return thunkAPI.rejectWithValue('Error: Vuelve a interno');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(`Error en la solicitud: ${error.message}`);
    }
  }
);

const initialState = {
  productores: [] as TProductor[],
  productor: null as TProductor | null,
  loading: false,
  error: null as string | null | undefined
};

export const ProductoresSlice = createSlice({
  name: 'productores',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductores.fulfilled, (state, action) => {
        state.loading = false;
        state.productores = action.payload;
      })
      .addCase(fetchProductores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductor.fulfilled, (state, action) => {
        state.loading = false;
        state.productor = action.payload;
      })
      .addCase(fetchProductor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteProductor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductor.fulfilled, (state, action) => {
        state.loading = false;
        state.productores = state.productores.filter(productor => productor.id !== action.payload);
      })
      .addCase(deleteProductor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(editProductor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProductor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productores.findIndex(productor => productor.id === action.payload.id);

        if (index !== -1) {
          state.productores[index] = {
            ...state.productores[index],
            ...action.payload,
          };
        }
      })
      .addCase(editProductor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default ProductoresSlice.reducer;
