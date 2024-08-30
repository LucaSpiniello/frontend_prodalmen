import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useLocation, useParams } from 'react-router-dom'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { TGuia, TLoteGuia } from '../../../../types/TypesRecepcionMP.types'
import useDarkMode from '../../../../hooks/useDarkMode'
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch'
import { TCamion } from '../../../../types/TypesRegistros.types'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import Radio, { RadioGroup } from '../../../../components/form/Radio'
import Input from '../../../../components/form/Input'
import { GUARDAR_GUIA_RECEPCION, fetchGuiaRecepcion, fetchLoteGuiaRecepcionIndividual, fetchLotesPendientesGuiaRecepcion } from '../../../../redux/slices/recepcionmp'
import { useAuth } from '../../../../context/authContext'
import { fetchWithTokenPatch, fetchWithTokenPut } from '../../../../utils/peticiones.utils'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IFormularioEditable {
  isOpen: Dispatch<SetStateAction<boolean>>
  guia: TGuia | null
  lote: TLoteGuia | null
}

const optionsRadio = [
  { id: 1, value: true, label: 'Si' },
  { id: 2, value: false, label: 'No' }
];

const FormularioRegistroTara : FC<IFormularioEditable> = ({isOpen, lote }) => {
  const { id } = useParams()
  const { isDarkTheme } = useDarkMode()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()

  const guia = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const loteGuia = useAppSelector((state: RootState) => state.recepcionmp.lote)

  useEffect(() => {
    dispatch(fetchLoteGuiaRecepcionIndividual({ id: parseInt(id!), params: { id_lote: lote?.id }, verificar_token: verificarToken, token }))
  }, [guia?.id])

  const updateGuiaRecepcion = async () => {
     const token_verificado = await verificarToken(token!)
    
     if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/`, { estado_recepcion: 4 }, token_verificado)
    if (res.ok){
      const data = await res.json()
      dispatch(GUARDAR_GUIA_RECEPCION(data))
      isOpen(false)
    } else {
      console.log("Todo mal")
    }
  }

  const formik = useFormik({
    initialValues: {
      kilos_brutos_1: 0,
      kilos_brutos_2: 0,
      kilos_tara_1: 0,
      kilos_tara_2: 0,
      estado_recepcion: null,
      guiarecepcion: null,
      creado_por: null,
    },
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPatch(`api/recepcionmp/${guia?.id}/lotes/${lote?.id}/`,
          {
            ...values,
            creado_por: perfilData?.id,
            estado_recepcion: 7
          },
          token_verificado
        )

        if (res.ok) {
          if (!guia?.mezcla_variedades){
            updateGuiaRecepcion()
          }
          toast.success("la guia de recepción fue registrado exitosamente!!")
          //@ts-ignore
          dispatch(fetchLotesPendientesGuiaRecepcion({ id, token, verificar_token: verificarToken }))
          //@ts-ignore
          dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))
          isOpen(false)
          

        } else {

          
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })




  useEffect(() => {
    let isMounted = true
    if (loteGuia && isMounted) {
      formik.setValues({
        kilos_brutos_1: loteGuia.kilos_brutos_1,
        kilos_brutos_2: loteGuia.kilos_brutos_2,
        estado_recepcion: loteGuia.estado_recepcion,
        guiarecepcion: loteGuia.guiarecepcion,
        creado_por: loteGuia.creado_por,
      })

    }
    return () => {
      isMounted = false
    }
  }, [loteGuia])

  useEffect(() => {
    let isMounted = true
    if (guia && isMounted){
      formik
    }
  }, [guia])


  const camionAcoplado = camiones?.find(camion => camion.id === Number(guia?.camion))?.acoplado



  return (
    <div className={`${isDarkTheme ? oneDark : 'bg-white'} w-full  h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-5
          gap-y-10  relative px-5 py-6 w-full
          rounded-md`}
          >

        <div className='rounded-md col-span-6'>
          <h1 className='text-center text-xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <div className={`rounded-md px-3 h-14 w-full flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_productor}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camionero}</span>
          </div>

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_camion}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center ${isDarkTheme ? 'bg-zinc-800' : 'bg-zinc-300'}`}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.nombre_comercializador}</span>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-fullrounded-md h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
          <RadioGroup isInline>
              {optionsRadio.map(({ id, value, label }) => {
                return (
                  <Radio
                    key={id}
                    label={label}
                    name='mezcla_variedades'
                    //@ts-ignore
                    value={value}
                    checked={guia?.mezcla_variedades === value} 
                    disabled
                  />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <div className={`rounded-md h-14 w-full px-3 flex items-center justify-center dark:bg-zinc-800 bg-zinc-300 `}>
            <span className={`text-lg ${isDarkTheme ? 'text-white' : 'text-black'}`}>{guia?.numero_guia_productor}</span>
          </div>
        </div>

        <div className={`md:row-start-4 ${!camionAcoplado ? 'md:col-start-2 md:col-span-4': 'md:col-start-1 md:col-span-3 '} md:flex-col items-center`}>
          <label htmlFor="kilos_tara_1">Tara Camión: </label>
          <Input
            type='text'
            name='kilos_tara_1'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.kilos_tara_1!}
          />
        </div>


        {
          camionAcoplado
            ? (
              <div className='md:row-start-4 md:col-span-3 md:col-start-4 md:flex-col items-center'>
                <label htmlFor="kilos_tara_2">Tara Camión Acoplado: </label>
                <Input
                  type='text'
                  name='kilos_tara_2'
                  onChange={formik.handleChange}
                  className='py-3'
                  value={formik.values.kilos_tara_2!}
                  
                />
              </div>
            )
            : null
        }

        <div className='md:row-start-5 md:col-start-5 md:col-span-2 relative w-full'>
          <button className='w-full mt-6 bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3'>Añadir Tara</button>
        </div>
      </form>
    </div>
  )
}

export default FormularioRegistroTara 
