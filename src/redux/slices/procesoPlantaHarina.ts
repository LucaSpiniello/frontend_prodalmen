import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TBinParaProcesoPlantaHarina, TBinResultanteProcesoPlantaHarina, TControlCalidadBinResultanteProcesoPlantaHarina, TMetricasRechazoPlantaHarina, TMetricasRechazoProcesoPlantaHarina, TOperarioProcesoPlantaHarina, TOperarioProcesoPlantaHarinaDiario, TPDFDocumentoEntradaPlantaHarina, TPDFDocumentoEntradaProcesoPlantaHarina, TPDFDocumentoSalidaPlantaHarina, TPDFDocumentoSalidaProcesoPlantaHarina, TProcesoPlantaHarina, TRechazosProcesoPlantaHarina, TVariableProcesoPlantaHarina } from "../../types/typesPlantaHarina";
import { FetchOptions, PostOptions } from "../../types/fetchTypes.types";
import { fetchWithToken, fetchWithTokenDelete, fetchWithTokenDeleteAction, fetchWithTokenPatch, fetchWithTokenPost, fetchWithTokenPut } from "../../utils/peticiones.utils";
import { TBinBodega } from "../../types/TypesSeleccion.type";
import toast from "react-hot-toast";
import { TMensajeCierreProduccion, TMensajeTerminoProduccion } from "../../types/TypesProduccion.types";
import { TAuth, TVerificar } from "../../types/TypesRegistros.types";












// CRUD PROGRAMA PLANTA HARINA
export const fetchProcesosPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_procesos_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/`, token_validado)

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

export const fetchProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/`, token_validado)
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

export const fetchBinEnProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_bin_en_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/bines-para-proceso/`, token_validado)
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

export const fetchBinsResultanteProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_bin_resultante_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/bines-resultantes-proceso/`, token_validado)
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

export const fetchOperariosProcesoPlantaHarinaPorDia = createAsyncThunk(
  'proceso_planta_harina/fetch_operarios_proceso_planta_harina_por_dia',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, data } = payload

    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/procesos/${id}/operarios-proceso/lista_detalle_dias_operario/`, data, token_validado)
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

export const fetchOperariosProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_operarios_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/lista_operarios_dias`, token_validado)
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

export const fetchRechazosProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_rechazos_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/rechazos-proceso`, token_validado)
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

export const fetchMetricasRechazosProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_metricas_rechazos_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/rechazos-proceso/metricas`, token_validado)
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

export const fetchVariableProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_variables_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/variables-proceso/${id}/`, token_validado)
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

export const fetchCCBinesResultanteProcesoPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_cc_bin_resultante_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/proceso-planta-harina/cdc-bin-resultante/`, token_validado)
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


export const fetchCCBinResultanteProcesoPlantaHarina = createAsyncThunk(
  'planta_harina/fetch_cc_bin_resultante_proceso_planta_harina',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/proceso-planta-harina/cdc-bin-resultante/${id}/`, token_validado)
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


export const fetchPDFEntradaProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_pdf_entrada',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/pdf-documento-entrada`, token_validado)
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

export const fetchPDFSalidaProcesoPlantaHarina = createAsyncThunk(
  'proceso_planta_harina/fetch_pdf_salida',
  async (payload: FetchOptions, thunkAPI) => {
    const { id, token, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)

      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithToken(`api/procesos/${id}/pdf-documento-salida`, token_validado)
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

















// PLANTA HARINA - AGREGACION DE COSAS

export const procesado_masivo_bin_para_procesoplanta_harina = createAsyncThunk(
  'proceso_planta_harina/procesado_masivo_bin_para_procesoplanta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/procesos/${id}/bines-para-proceso/procesado_masivo/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success(`Bines procesados exitosamente`)
        thunkAPI.dispatch(fetchBinEnProcesoPlantaHarina({ id, token, verificar_token }))
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

export const registro_tipo_rechazo_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/registro_tipo_rechazo_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, action } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/procesos/${id}/rechazos-proceso/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success(`Rechazo agregado exitosamente`)
        thunkAPI.dispatch(fetchRechazosProcesoPlantaHarina({ id, token, verificar_token }))
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

export const registro_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/registro_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { token, data, verificar_token, params } = payload
    //@ts-ignore
    const { navigate, setDisabled } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/procesos/`,data, token_validado)
      if (res.ok){
        const data: TProcesoPlantaHarina = await res.json()
        toast.success(`Proceso creado exitosamente`)
        navigate(`/ph/ph-proc/registro-proceso-planta-harina/${data.id}/`, { replace: true })
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

export const registrar_bin_resultante_proceso_planta_harina = createAsyncThunk(
  'planta_harina/registrar_bin_resultante_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { setOpen, setDisabled } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPost(`api/procesos/${id}/bines-resultantes-proceso/`,data, token_validado)
      if (res.ok){
        const data: TBinResultanteProcesoPlantaHarina = await res.json()
        toast.success(`Bin Resultante registrado exitosamente`)
        thunkAPI.dispatch(fetchBinsResultanteProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))
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

export const registro_cc_bin_resultante_proceso_planta_harina = createAsyncThunk(
  'planta_harina/registro_cc_bin_resultante_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { setOpen, pathname, id_programa } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/proceso-planta-harina/cdc-bin-resultante/${id}/`,data, token_validado)
      if (res.ok){
        const data: TBinResultanteProcesoPlantaHarina = await res.json()
        toast.success(`Bin Resultante registrado exitosamente`)
        if (pathname.includes('cc_bin_resultante_planta_harina')){
          thunkAPI.dispatch(fetchCCBinesResultanteProcesoPlantaHarina({ token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchBinsResultanteProcesoPlantaHarina({ id: id_programa, token, verificar_token }))
          thunkAPI.dispatch(fetchProcesoPlantaHarina({ id: id_programa, token, verificar_token }))

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

export const fetchMensajeTerminoProcesoPH = createAsyncThunk<TMensajeTerminoProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `planta_harina/fetchMensajeTerminoProcesoPH`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/procesos/${id_programa}/estado_termino_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error obtener mensaje termino proceso')
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchMensajeCierreProcesoPH = createAsyncThunk<TMensajeCierreProduccion, {id_programa: string | number | undefined, token: TAuth | null, verificar_token: TVerificar}, {rejectValue: string}>(
  `planta_harina/fetchMensajeCierreProcesoPH`,
  async ({id_programa, token, verificar_token}, {rejectWithValue}) => {
    try {
      const token_verificado = await verificar_token(token)
      if (!token_verificado) throw new Error('Token no verificado')
      const response = await fetchWithToken(`api/procesos/${id_programa}/estado_cierre_programa/`, token_verificado)
      if (response.ok) {
        const data = await response.json()
        return data
      } else {
        toast.error('Error Metricas')
      }
    } catch (error: any) {
      toast.error('error al obtener mensaje cierre proceso')
      return rejectWithValue(error.response.data)
    }
  }
)

// PLANTA HARINA - ACTUALIZACIONES


export const actualizar_proceso_planta_harina = createAsyncThunk(
  'planta_harina/actualizar_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { estado, perfil, tipo_boton, fecha_registrada, detalle } = params

    const requestBody: Record<string, any> = {
      id,
      estado_proceso: estado,
      creado_por: perfil.id,
    };

    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/procesos/${id}/`, requestBody , token_validado)
      if (res.ok){
        const data: TProcesoPlantaHarina = await res.json()
        toast.success(`Proceso se ha ${data.estado_proceso_label}`)
        if (detalle){
          thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))
        } else {
          thunkAPI.dispatch(fetchProcesosPlantaHarina({ token, verificar_token }))
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

export const actualizar_estado_bin_para_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/actualizar_estado_bin_para_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/procesos/${id}/bines-para-proceso/${id_bin}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Bin procesado exitosamente')
        thunkAPI.dispatch(fetchBinEnProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))
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

export const actualizar_tipo_rechazo_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/actualizar_tipo_rechazo_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_rechazo } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/procesos/${id}/rechazos-proceso/${id_rechazo}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Rechazo actualizado exitosamente')
        thunkAPI.dispatch(fetchRechazosProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))

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

export const actualizar_variables_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/actualizar_variables_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, action } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenPatch(`api/procesos/${id}/variables-proceso/${id}/`,data, token_validado)
      if (res.ok){
        const data = await res.json()
        toast.success('Variables actualizadas exitosamente')
        thunkAPI.dispatch(fetchVariableProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))

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
export const eliminar_bin_para_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/eliminar_bin_para_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/procesos/${id}/bines-para-proceso/${id_bin}/`,token_validado)
      if (res.ok){
        toast.success('Bin eliminado exitosamente')
        thunkAPI.dispatch(fetchBinEnProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))

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

export const eliminar_bin_resultante_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/eliminar_bin_resultante_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, verificar_token, params } = payload
    //@ts-ignore
    const { id_bin } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/procesos/${id}/bines-resultantes-proceso/${id_bin}/`,token_validado)
      if (res.ok){
        toast.success('Bin eliminado exitosamente')
        thunkAPI.dispatch(fetchBinsResultanteProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))
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

export const eliminar_dia_operario_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/eliminar_dia_operario_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, data, verificar_token } = payload
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDeleteAction(`api/procesos/${id}/operarios-proceso/eliminar_registro_dia_por_rut_y_id/`, data, token_validado)
      if (res.ok){
        toast.success('Operario eliminado exitosamente')
        thunkAPI.dispatch(fetchOperariosProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchOperariosProcesoPlantaHarinaPorDia({ id, data: { rut: data.rut }, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))

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

export const eliminar_rechazo_proceso_planta_harina = createAsyncThunk(
  'proceso_planta_harina/eliminar_rechazo_proceso_planta_harina',
  async (payload: PostOptions, thunkAPI) => {
    const { id, token, params,  verificar_token } = payload
    // @ts-ignore
    const { id_rechazo } = params
    try {
      const token_validado = await verificar_token(token)
      if (!token_validado) throw new Error('El token no es valido')
        const res = await fetchWithTokenDelete(`api/procesos/${id}/rechazos-proceso/${id_rechazo}`, token_validado)
      if (res.ok){
        toast.success('Rechazo eliminado exitosamente')
        thunkAPI.dispatch(fetchRechazosProcesoPlantaHarina({ id, token, verificar_token }))
        thunkAPI.dispatch(fetchProcesoPlantaHarina({ id, token, verificar_token }))

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
  procesos_planta_harina: [] as TProcesoPlantaHarina[],
  proceso_planta_harina: null as TProcesoPlantaHarina | null,


  bin_en_proceso_planta_harina: [] as TBinParaProcesoPlantaHarina[],
  bins_resultantes_proceso_planta_harina: [] as TBinResultanteProcesoPlantaHarina[],

  operarios_proceso_planta_harina: [] as TOperarioProcesoPlantaHarina[],
  operarios_proceso_planta_harina_diario: [] as TOperarioProcesoPlantaHarinaDiario[],

  rechazos_proceso_planta_harina: [] as TRechazosProcesoPlantaHarina[],
  metricas_proceso_rechazo_planta_harina: [] as TMetricasRechazoProcesoPlantaHarina[],

  bins_para_proceso_planta_harina: [] as TBinBodega[],

  variable_proceso_planta_harina: null as TVariableProcesoPlantaHarina | null,

  
  pdf_documento_entrada: null as TPDFDocumentoEntradaProcesoPlantaHarina | null,
  pdf_documento_salida: null as TPDFDocumentoSalidaProcesoPlantaHarina | null,

  controles_calidad_bin_resultante_proceso_planta_harina: [] as TControlCalidadBinResultanteProcesoPlantaHarina[],
  control_calidad_resultante_proceso_planta_harina: null as TControlCalidadBinResultanteProcesoPlantaHarina | null,

  mensajeTerminoProcesoPH: null as TMensajeTerminoProduccion | null,
  mensajeCierreProcesoPH: null as TMensajeCierreProduccion | null,

  loading: false,
  error: null as string | null | undefined
};


export const procesoPlantaHarinaSlice = createSlice({
  name: 'proceso',
  initialState,
  reducers: {
    AGREGAR_BIN_PARA_PROCESO_PLANTA_HARINA: (state, action) => {
      state.bins_para_proceso_planta_harina.push(action.payload)
      },
    QUITAR_BIN_PARA_PROCESO_PLANTA_HARINA: (state, action) => {
      state.bins_para_proceso_planta_harina = state.bins_para_proceso_planta_harina.filter(planta => planta.id !== action.payload)
    },
    LIMPIAR_BINS_PARA_PROCESO_PLANTA_HARINA: state => {
      state.bins_para_proceso_planta_harina = []
    }

  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchProcesosPlantaHarina.fulfilled, (state, action) => {
      state.procesos_planta_harina = action.payload;
    })
    .addCase(fetchProcesoPlantaHarina.fulfilled, (state, action) => {
      state.proceso_planta_harina = action.payload;
    })
    .addCase(fetchBinEnProcesoPlantaHarina.fulfilled, (state, action) => {
      state.bin_en_proceso_planta_harina = action.payload;
    })
    .addCase(fetchBinsResultanteProcesoPlantaHarina.fulfilled, (state, action) => {
      state.bins_resultantes_proceso_planta_harina = action.payload
    })
    .addCase(fetchOperariosProcesoPlantaHarina.fulfilled, (state, action) => {
      state.operarios_proceso_planta_harina = action.payload
    })
    .addCase(fetchOperariosProcesoPlantaHarinaPorDia.fulfilled, (state, action) => {
      state.operarios_proceso_planta_harina_diario = action.payload
    })
    .addCase(fetchRechazosProcesoPlantaHarina.fulfilled, (state, action) => {
      state.rechazos_proceso_planta_harina = action.payload
    })
    .addCase(fetchMetricasRechazosProcesoPlantaHarina.fulfilled, (state, action) => {
      state.metricas_proceso_rechazo_planta_harina = action.payload
    })
    .addCase(fetchVariableProcesoPlantaHarina.fulfilled, (state, action) => {
      state.variable_proceso_planta_harina = action.payload
    })

    .addCase(fetchCCBinesResultanteProcesoPlantaHarina.fulfilled, (state, action) => {
      state.controles_calidad_bin_resultante_proceso_planta_harina = action.payload
    })

    .addCase(fetchCCBinResultanteProcesoPlantaHarina.fulfilled, (state, action) => {
      state.control_calidad_resultante_proceso_planta_harina = action.payload
    })

    .addCase(fetchPDFEntradaProcesoPlantaHarina.fulfilled, (state, action) => {
      state.pdf_documento_entrada = action.payload
    })
    
    .addCase(fetchPDFSalidaProcesoPlantaHarina.fulfilled, (state, action) => {
      state.pdf_documento_salida = action.payload
    })
    .addCase(fetchMensajeTerminoProcesoPH.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeTerminoProcesoPH.fulfilled, (state, action) => {
      state.mensajeTerminoProcesoPH = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeTerminoProcesoPH.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProcesoPH.pending, (state) => {
      state.loading = true
    })
    .addCase(fetchMensajeCierreProcesoPH.fulfilled, (state, action) => {
      state.mensajeCierreProcesoPH = action.payload
      state.loading = false
    })
    .addCase(fetchMensajeCierreProcesoPH.rejected, (state, action) => {
      state.error = action.payload
      state.loading = false
    })
  }
})

export const {
  AGREGAR_BIN_PARA_PROCESO_PLANTA_HARINA,
  QUITAR_BIN_PARA_PROCESO_PLANTA_HARINA,
  LIMPIAR_BINS_PARA_PROCESO_PLANTA_HARINA
 } = procesoPlantaHarinaSlice.actions

export default procesoPlantaHarinaSlice.reducer