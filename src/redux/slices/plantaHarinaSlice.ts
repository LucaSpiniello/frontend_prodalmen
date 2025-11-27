import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TBinParaProgramaPlantaHarina, TBinResultantePlantaHarina, TControlCalidadBinResultantePlantaHarina, TMetricasRechazoPlantaHarina, TOperarioPlantaHarina, TOperarioPlantaHarinaDiario, TPDFDocumentoEntradaPlantaHarina, TPDFDocumentoSalidaPlantaHarina, TProgramaPlantaHarina, TRechazosPlantaHarina, TVariablePlantaHarina } from "../../types/typesPlantaHarina";
import { FetchOptions, PostOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenDeleteAction, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from "../../utils/peticiones.utils";
import { TBinBodega } from "../../types/TypesSeleccion.type";
import toast from "react-hot-toast";
import { fetchProcesoPlantaHarina } from "./procesoPlantaHarina";
import { TMensajeCierreProduccion, TMensajeTerminoProduccion } from "../../types/TypesProduccion.types";
import { TAuth, TVerificar } from "../../types/TypesRegistros.types";

// CRUD PROGRAMA PLANTA HARINA
export const fetchProgramasPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_programas_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/`, token_validado)

      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchProgramaPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_programa_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchBinEnPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_bin_en_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/bines-para-programa/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchBinsResultantePlantaHarina = createAsyncThunk(
  'planta_harina/fetch_bin_resultante_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/bines-resultantes-programa/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchOperariosPlantaHarinaPorDia = createAsyncThunk(
  'planta_harina/fetch_operarios_planta_harina_por_dia',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, data } = payload

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/programas/${id}/operarios-programa/lista_detalle_dias_operario/`, data, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchOperariosPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_operarios_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/lista_operarios_dias`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchRechazosPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_rechazos_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/rechazos-programa`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchMetricasRechazosPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_metricas_rechazos_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/rechazos-programa/metricas`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchVariablePlantaHarina = createAsyncThunk(
  'planta_harina/fetch_variables_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/variables-programa/${id}/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchCCBinesResultantePlantaHarina = createAsyncThunk(
  'planta_harina/fetch_cc_bines_resultante_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/planta-harina/cdc-bin-resultante/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchCCBinResultantePlantaHarina = createAsyncThunk(
  'planta_harina/fetch_cc_bin_resultante_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/planta-harina/cdc-bin-resultante/${id}/`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchPDFEntradaPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_pdf_entrada',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/pdf-documento-entrada`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const fetchPDFSalidaPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_pdf_salida',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/programas/${id}/pdf-documento-salida`, token_validado)
      if (res.ok){
        const data = await res.json()
        return data
      } else if (res.status === 400) {
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)



export const fetchMensajeTerminoProgramaPH = createAsyncThunk<TMensajeTerminoProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `planta_harina/fetchMensajeTerminoProgramaPH`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/programas/${id_programa}/estado_termino_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error obtener mensaje termino programa')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMensajeCierreProgramaPH = createAsyncThunk<TMensajeCierreProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `planta_harina/fetchMensajeCierreProgramaPH`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/programas/${id_programa}/estado_cierre_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener mensaje cierre programa')
      return rejectWithValue(error.response.data)
    }
  }
)

// PLANTA HARINA - AGREGACION DE COSAS

export const procesado_masivo_bin_para_planta_harina = createAsyncThunk(
  'planta_harina/procesado_masivo_bin_para_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/programas/${id}/bines-para-programa/procesado_masivo/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success(`Bines procesados exitosamente`)
        thunkAPI.dispatch(fetchBinEnPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo procesar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const registro_tipo_rechazo_planta_harina = createAsyncThunk(
  'planta_harina/registro_tipo_rechazo_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, action } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/programas/${id}/rechazos-programa/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success(`Rechazo agregado exitosamente`)
        thunkAPI.dispatch(fetchRechazosPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        action!(false)
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo agregar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const registro_programa_planta_harina = createAsyncThunk(
  'planta_harina/registro_programa_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, verificar_token, params } = payload
    //@ts-ignore
    const { navigate, setDisabled } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/programas/`,data, token_validado)
      if (res.ok){
        const data: TProgramaPlantaHarina = await res.json()
        toast.success(`Programa creado exitosamente`)
        navigate(`/ph/ph-prog/registro-programa-planta-harina/${data.id}/`, { replace: true })
        setDisabled(false)
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo agregar, volver a intentar')
        setDisabled(false)
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      setDisabled(false)
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const registrar_bin_resultante_planta_harina = createAsyncThunk(
  'planta_harina/registrar_bin_resultante_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { setOpen, setDisabled } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/programas/${id}/bines-resultantes-programa/`,data, token_validado)
      if (res.ok){
        const data: TBinResultantePlantaHarina = await res.json()
        asignarDiasKilos(id, verificar_token, token)
        toast.success(`Bin Resultante registrado exitosamente`)
        thunkAPI.dispatch(fetchBinsResultantePlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        setOpen(false)
        setDisabled(false)
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo agregar, volver a intentar')
        setDisabled(false)
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      setDisabled(false)
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

const asignarDiasKilos = async (id : any, verificar_token : any, token : any) => {
  try {
    const token_verificado = await verificar_token(token!)
    if (!token_verificado)throw new Error('Token no verificado')
    const response = await fetchWithTokenPost(`api/programas/${id}/asignar-dias-kilos/`, {}, token_verificado)
    if (response.ok) {
      toast.success('Dias Asignados')
    } else {
      toast.error('Error' + `${await response.json()}`)
    }
  } catch {
    console.log('Error dias asignados')
  }
}

export const registro_cc_bin_resultante_planta_harina = createAsyncThunk(
  'planta_harina/registro_cc_bin_resultante_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { setOpen, pathname, id_programa } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/planta-harina/cdc-bin-resultante/${id}/`,data, token_validado)
      if (res.ok){
        const data: TBinResultantePlantaHarina = await res.json()
        toast.success(`Bin Resultante registrado exitosamente`)
        if (pathname.includes('cc_bin_resultante_planta_harina')){
          thunkAPI.dispatch(fetchCCBinesResultantePlantaHarina({ token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchBinsResultantePlantaHarina({ id: id_programa, token, verificar_token }))
          thunkAPI.dispatch(fetchProgramaPlantaHarina({ id: id_programa, token, verificar_token }))
        }
        setOpen(false)
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo agregar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)
















// PLANTA HARINA - ACTUALIZACIONES

export const actualizar_planta_harina = createAsyncThunk(
  'planta_harina/actualizar_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { estado, perfil, tipo_boton, fecha_registrada, detalle } = params

    const requestBody: Record<string, any> = {
      id,
      estado_programa: estado,
      creado_por: perfil.id,
    };

    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/programas/${id}/`, requestBody , token_validado)
      if (res.ok){
        const data: TProgramaPlantaHarina = await res.json()
        toast.success(`Programa se ha ${data.estado_programa_label}`)
        if (detalle){
          thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
          thunkAPI.dispatch(fetchOperariosPlantaHarina({ id, token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchProgramasPlantaHarina({ token, verificar_token }))
        }
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo procesar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const actualizar_estado_bin_para_planta_harina = createAsyncThunk(
  'planta_harina/actualizar_estado_bin_para_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/programas/${id}/bines-para-programa/${id_bin}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Bin procesado exitosamente')
        thunkAPI.dispatch(fetchBinEnPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo procesar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const actualizar_tipo_rechazo_planta_harina = createAsyncThunk(
  'planta_harina/actualizar_tipo_rechazo_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_rechazo } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/programas/${id}/rechazos-programa/${id_rechazo}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Rechazo actualizado exitosamente')
        thunkAPI.dispatch(fetchRechazosPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo procesar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const actualizar_variables_planta_harina = createAsyncThunk(
  'planta_harina/actualizar_variables_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, action } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/programas/${id}/variables-programa/${id}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Variables actualizadas exitosamente')
        thunkAPI.dispatch(fetchVariablePlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        action!(false)
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo actualizar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

















// PLANTA HARINA - ELIMINACIONES 
export const eliminar_bin_para_planta_harina = createAsyncThunk(
  'planta_harina/eliminar_bin_para_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/programas/${id}/bines-para-programa/${id_bin}/`,token_validado)
      if (res.ok){
        toast.success('Bin eliminado exitosamente')
        thunkAPI.dispatch(fetchBinEnPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return id
      } else if (res.status === 400) {
        toast.error('No se pudo eliminar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const eliminar_bin_resultante_planta_harina = createAsyncThunk(
  'planta_harina/eliminar_bin_resultante_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/programas/${id}/bines-resultantes-programa/${id_bin}/`,token_validado)
      if (res.ok){
        toast.success('Bin eliminado exitosamente')
        thunkAPI.dispatch(fetchBinsResultantePlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return id
      } else if (res.status === 400) {
        toast.error('No se pudo eliminar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const eliminar_dia_operario_planta_harina = createAsyncThunk(
  'planta_harina/eliminar_dia_operario_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDeleteAction(`api/programas/${id}/operarios-programa/eliminar_registro_dia_por_rut_y_id/`, data, token_validado)
      if (res.ok){
        toast.success('Operario eliminado exitosamente')
        thunkAPI.dispatch(fetchOperariosPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchOperariosPlantaHarinaPorDia({ id, data: { rut: data.rut }, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return data
      } else if (res.status === 400) {
        toast.error('No se pudo eliminar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)

export const eliminar_rechazo_planta_harina = createAsyncThunk(
  'planta_harina/eliminar_rechazo_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, params,  verificar_token } = payload
    // @ts-ignore
    const { id_rechazo } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/programas/${id}/rechazos-programa/${id_rechazo}`, token_validado)
      if (res.ok){
        toast.success('Rechazo eliminado exitosamente')
        thunkAPI.dispatch(fetchRechazosPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProgramaPlantaHarina({ id, token, verificar_token }))
        return id
      } else if (res.status === 400) {
        toast.error('No se pudo eliminar, volver a intentar')
        return thunkAPI.rejectWithValue('No se pudo');
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message }); 
    }
  }
)











// const actualizarEstadoEmbalaje = async (id: number, estado: string) => {
//   try {
//     const token_verificado = await verificarToken(token!)

//     if (!token_verificado){
//         throw new Error('Token no valido')
//       }

//     const response_estado = await fetchWithTokenPatch(`api/embalaje/${id}/`, { id, estado_embalaje: estado, registrado_por: perfil?.id }, token_verificado)
//     if (response_estado.ok){
//       const data: TEmbalaje = await response_estado.json()
//       toast.success(`El programa esta en ${data.estado_embalaje_label}`)
//       //@ts-ignore
//       dispatch(fetchProgramasEmbalaje({ token, verificar_token: verificarToken }))
//     }
//   } catch (error) {
//     toast.error('Error en la peticion')
//   }
// }

  // const hoy = new Date()

  // const actualizarEstadoEnvase = async (id_lote: number, id_modelo: number, modelo_pepa_calibrada: number) => {
  //   const token_verificado = await verificarToken(token!)
  
  //   if (!token_verificado) throw new Error('Token no verificado')
    
  //   const res = await fetchWithTokenPut(`api/reproceso/${id}/bins_en_reproceso/${id_lote}/`,
  //     {
  //       bin_procesado: true,
  //       id_bin_bodega: id_modelo,
  //       tipo_bin_bodega: modelo_pepa_calibrada,
  //       reproceso: id,
  //       fecha_procesado: hoy
  //     },
  //     token_verificado
  //   )
  //   if (res.ok){
  //     toast.success("Bin Procesado Correctamente")
  //     //@ts-ignore
  //     dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
  //   } else {
  //     toast.error("No se pudo procesar el lote, vuelve a intentarlo")
  //   }
  // }



const initialState = {
  programas_planta_harina: [] as TProgramaPlantaHarina[],
  programa_planta_harina: null as TProgramaPlantaHarina | null,


  bin_en_planta_harina: [] as TBinParaProgramaPlantaHarina[],
  bins_resultantes_planta_harina: [] as TBinResultantePlantaHarina[],

  operarios_planta_harina: [] as TOperarioPlantaHarina[],
  operarios_planta_harina_diario: [] as TOperarioPlantaHarinaDiario[],

  rechazos_planta_harina: [] as TRechazosPlantaHarina[],
  metricas_rechazo_planta_harina: [] as TMetricasRechazoPlantaHarina[],

  bins_para_planta_harina: [] as TBinBodega[],

  variable_planta_harina: null as TVariablePlantaHarina | null,

  pdf_documento_entrada: null as TPDFDocumentoEntradaPlantaHarina | null,
  pdf_documento_salida: null as TPDFDocumentoSalidaPlantaHarina | null,


  mensajeTerminoProgramaPH: null as TMensajeTerminoProduccion | null,
  mensajeCierreProgramaPH: null as TMensajeCierreProduccion | null,

  controles_calidad_bin_resultante_planta_harina: [] as TControlCalidadBinResultantePlantaHarina[],
  control_calidad_resultante_planta_harina: null as TControlCalidadBinResultantePlantaHarina | null,

  loading: false,
  error: null as string | null | undefined,

  // Estado de la tabla para persistencia
  tabla_programas_pharina_state: {
    pageIndex: 0,
    pageSize: 5,
    globalFilter: '',
  }
};


export const plantaHarinaSlices = createSlice({
  name: 'planta_harina',
  initialState,
  reducers: {
    AGREGAR_BIN_PARA_PLANTA_HARINA: (state, action) => {
      state.bins_para_planta_harina.push(action.payload)
    },
    QUITAR_BIN_PARA_PLANTA_HARINA: (state, action) => {
      state.bins_para_planta_harina = state.bins_para_planta_harina.filter(planta => planta.id !== action.payload)
    },
    LIMPIAR_BINS_PARA_PLANTA_HARINA: state => {
      state.bins_para_planta_harina = []
    },

    GUARDAR_ESTADO_TABLA_PROGRAMAS_PHARINA: (state, action: PayloadAction<{ pageIndex: number; pageSize: number; globalFilter: string }>) => {
      state.tabla_programas_pharina_state = action.payload;
    },
    RESETEAR_ESTADO_TABLA_PROGRAMAS_PHARINA: (state) => {
      state.tabla_programas_pharina_state = {
        pageIndex: 0,
        pageSize: 5,
        globalFilter: '',
      };
    }

  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProgramasPlantaHarina.fulfilled, (state, action) => {
      state.programas_planta_harina = action.payload;
    })
    .addCase(fetchProgramaPlantaHarina.fulfilled, (state, action) => {
      state.programa_planta_harina = action.payload;
    })
    .addCase(fetchBinEnPlantaHarina.fulfilled, (state, action) => {
      state.bin_en_planta_harina = action.payload;
    })
    .addCase(fetchBinsResultantePlantaHarina.fulfilled, (state, action) => {
      state.bins_resultantes_planta_harina = action.payload
    })
    .addCase(fetchOperariosPlantaHarina.fulfilled, (state, action) => {
      state.operarios_planta_harina = action.payload
    })
    .addCase(fetchOperariosPlantaHarinaPorDia.fulfilled, (state, action) => {
      state.operarios_planta_harina_diario = action.payload
    })
    .addCase(fetchRechazosPlantaHarina.fulfilled, (state, action) => {
      state.rechazos_planta_harina = action.payload
    })
    .addCase(fetchMetricasRechazosPlantaHarina.fulfilled, (state, action) => {
      state.metricas_rechazo_planta_harina = action.payload
    })
    .addCase(fetchVariablePlantaHarina.fulfilled, (state, action) => {
      state.variable_planta_harina = action.payload
    })
    .addCase(fetchCCBinesResultantePlantaHarina.fulfilled, (state, action) => {
      state.controles_calidad_bin_resultante_planta_harina = action.payload
    })
    .addCase(fetchCCBinResultantePlantaHarina.fulfilled, (state, action) => {
      state.control_calidad_resultante_planta_harina = action.payload
    })
    .addCase(fetchPDFEntradaPlantaHarina.fulfilled, (state, action) => {
      state.pdf_documento_entrada = action.payload
    })
    .addCase(fetchPDFSalidaPlantaHarina.fulfilled, (state, action) => {
      state.pdf_documento_salida = action.payload
    })
    .addCase(fetchMensajeTerminoProgramaPH.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeTerminoProgramaPH.fulfilled, (state, action) => {
      state.mensajeTerminoProgramaPH = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeTerminoProgramaPH.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProgramaPH.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeCierreProgramaPH.fulfilled, (state, action) => {
      state.mensajeCierreProgramaPH = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProgramaPH.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
  }
})

export const {
  AGREGAR_BIN_PARA_PLANTA_HARINA,
  QUITAR_BIN_PARA_PLANTA_HARINA,
  LIMPIAR_BINS_PARA_PLANTA_HARINA,

  GUARDAR_ESTADO_TABLA_PROGRAMAS_PHARINA,
  RESETEAR_ESTADO_TABLA_PROGRAMAS_PHARINA
 } = plantaHarinaSlices.actions

export default plantaHarinaSlices.reducer