import { useFormik } from "formik"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { TGuia } from "../../../../types/TypesRecepcionMP.types"
import { TCamion, TComercializador, TConductor, TProductor } from "../../../../types/TypesRegistros.types"
import toast from "react-hot-toast"
import SelectReact, { TSelectOptions } from "../../../../components/form/SelectReact"
import { ACTIVO } from "../../../../utils/constante"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useEffect, useState } from "react"
import Radio, { RadioGroup } from "../../../../components/form/Radio"
import Input from "../../../../components/form/Input"
import FooterFormularioEdicionEnvase from "./FooterFormularioEdicionEnvase"
import { useAuth } from "../../../../context/authContext"
import { fetchCamiones } from "../../../../redux/slices/camionesSlice"
import { fetchProductores } from "../../../../redux/slices/productoresSlice"
import { fetchComercializadores } from "../../../../redux/slices/comercializadores"
import { fetchGuiaRecepcion } from "../../../../redux/slices/recepcionmp"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const optionsRadio = [
  { id: 1, value: true, label: 'Si' },
  { id: 2, value: false, label: 'No' }
];


const FormularioEdicionGuiaRecepcion = () => {
  const { id } = useParams()
  const [guiaGenerada, setGuiaGenerada] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [activo, setActivo] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const base_url = process.env.VITE_BASE_URL
  const { isDarkTheme } = useDarkMode()


  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const productores = useAppSelector((state: RootState) => state.productores.productores)
  const conductores = useAppSelector((state: RootState) => state.conductores.conductores)
  const comercializadores = useAppSelector((state: RootState) => state.conductores.conductores)
  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  
  useEffect(() => {
    if (camiones.length < 1){
      //@ts-ignore
      dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
    }
  }, [camiones])

  useEffect(() => {
    if (productores.length < 1){
      //@ts-ignore
      dispatch(fetchProductores({ token, verificar_token: verificarToken }))
    }
  }, [productores])

  useEffect(() => {
    if (conductores.length < 1){
      //@ts-ignore
      dispatch(fetchConductores({ token, verificar_token: verificarToken }))
    }
  }, [conductores])

  useEffect(() => {
    if (comercializadores.length < 1){
      //@ts-ignore
      dispatch(fetchComercializadores({ token, verificar_token: verificarToken }))
    }
  }, [comercializadores])

  useEffect(() => {
    if (guia_recepcion){
      //@ts-ignore
      dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))
    }
  }, [id, guia_recepcion])



  const formik = useFormik({
    initialValues: {
      estado_recepcion: null,
      mezcla_variedades: false,
      cierre_guia: false,
      tara_camion_1: null,
      tara_camion_2: null,
      terminar_guia: false,
      numero_guia_productor: null,
      creado_por: null,
      comercializador: null,
      productor: null,
      camionero: null,
      camion: null
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}/api/recepcionmp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            estado_recepcion: 1,
            creado_por: perfilData?.id

          })
        })
        if (res.ok) {
          const data = await res.json()
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          setGuiaGenerada(true)

        } else if (res.status === 401) {

          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const optionsCamion: TSelectOptions = camiones?.map((camion: TCamion) => ({
    value: String(camion.id),
    label: (`${camion.patente},  ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`)
  })) ?? []

  const optionsProductor: TSelectOptions = productores?.map((productor: TProductor) => ({
    value: String(productor.id),
    label: productor.nombre
  })) ?? []

  const optionsConductor: TSelectOptions = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre
  })) ?? []

  const optionsComercializador: TSelectOptions = comercializadores?.map((comerciante) => ({
    value: String(comerciante.id),
    label: comerciante.nombre
  })) ?? []

  const optionsMezcla: TSelectOptions = ACTIVO?.map((variedad) => ({
    value: String(variedad.values),
    label: variedad.label
  })) ?? []


  useEffect(() => {
    let isMounted = true
    if (guia_recepcion && isMounted) {
      formik.setValues({
        estado_recepcion: guia_recepcion.estado_recepcion,
        mezcla_variedades: guia_recepcion.mezcla_variedades,
        cierre_guia: guia_recepcion.cierre_guia,
        tara_camion_1: guia_recepcion.tara_camion_1,
        tara_camion_2: guia_recepcion.tara_camion_2,
        terminar_guia: guia_recepcion.terminar_guia,
        numero_guia_productor: guia_recepcion.numero_guia_productor,
        creado_por: guia_recepcion.creado_por,
        comercializador: guia_recepcion.comercializador,
        productor: guia_recepcion.productor,
        camionero: guia_recepcion.camionero,
        camion: guia_recepcion.camion
      })

    }
    return () => {
      isMounted = false
    }
  }, [guia_recepcion])



  return (
    <div className={`dark:bg-zinc-900 bg-zinc-50 h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 dark:bg-zinc-900 bg-zinc-50 relative px-5 py-6 
      rounded-md`}
      >

        <div className='border border-gray-300 rounded-md col-span-6'>
          <h1 className='text-center text-2xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <SelectReact
            options={optionsProductor}
            id='productor'
            name='productor'
            placeholder='Selecciona un productor'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('productor', value.value)
            }}
          />

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <SelectReact
            options={optionsConductor}
            id='camionero'
            name='camionero'
            placeholder='Selecciona un chofer'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('camionero', value.value)
            }}
          />

        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <SelectReact
            options={optionsCamion}
            id='camion'
            name='camion'
            placeholder='Selecciona un camión'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('camion', value.value)
            }}
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <SelectReact
            options={optionsComercializador}
            id='comercializador'
            name='comercializador'
            placeholder='Selecciona una opción'
            className='h-14'
            onChange={(value: any) => {
              formik.setFieldValue('comercializador', value.value)
            }}
          />
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-full h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
            <RadioGroup isInline>
              {optionsRadio.map(({ id, value, label }) => {
                return (
                  <Radio
                    key={id}
                    label={label}
                    name='mezcla_variedades'
                    value={label} 
                    checked={formik.values.mezcla_variedades === value}
                    onChange={(e) => {
                      formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false)
                    }}
                    selectedValue={undefined} />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <Input
            type='text'
            name='numero_guia_productor'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.numero_guia_productor!}
          />
        </div>

      </form>

      <FooterFormularioEdicionEnvase />



    </div>
  )
}

export default FormularioEdicionGuiaRecepcion 
