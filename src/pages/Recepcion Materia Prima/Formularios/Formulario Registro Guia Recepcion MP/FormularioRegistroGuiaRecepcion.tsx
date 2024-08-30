import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import FooterFormularioRegistro from './FooterFormularioRegistroGuiaRecepcion'
import useDarkMode from '../../../../hooks/useDarkMode'
import { TGuia } from '../../../../types/TypesRecepcionMP.types'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { RootState } from '../../../../redux/store'
import { useAuth } from '../../../../context/authContext'
import SelectReact, { TSelectOptions } from '../../../../components/form/SelectReact'
import { TCamion, TComercializador, TConductor, TProductor } from '../../../../types/TypesRegistros.types'
import { ACTIVO } from '../../../../utils/constante'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import Radio, { RadioGroup } from '../../../../components/form/Radio'
import Input from '../../../../components/form/Input'
import { fetchCamiones } from '../../../../redux/slices/camionesSlice'
import { fetchProductores } from '../../../../redux/slices/productoresSlice'
import { fetchConductores } from '../../../../redux/slices/conductoresSlice'
import { fetchComercializadores } from '../../../../redux/slices/comercializadores'
import { fetchEnvases } from '../../../../redux/slices/envasesSlice'
import { fetchWithTokenPost } from '../../../../utils/peticiones.utils'
import { GUARDAR_GUIA_RECEPCION } from '../../../../redux/slices/recepcionmp'
import Button from '../../../../components/ui/Button'
import Container from '../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../components/ui/Card'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';

const optionsRadio = [
  { id: 1, value: true, label: 'Si' },
  { id: 2, value: false, label: 'No' }
];

const headerGuiaRegistroSchema = Yup.object().shape({
  tara_camion_1: Yup.number().required('Requerido').positive('Ingrese un numero positivo'),
  // estado_recepcion: ,
  mezcla_variedades: Yup.boolean().required('Requerido'),
  // cierre_guia: Yup.boolean().required('Requerido'),
  // tara_camion_1: null,
  tara_camion_2: Yup.number().nullable(),
  // terminar_guia: false,
  numero_guia_productor: Yup.string().required('Requerido'),
  // creado_por: Yup,
  comercializador: Yup.string().required('Requerido'),
  productor: Yup.string().required('Requerido'),
  camionero: Yup.string().required(),
  camion: Yup.string().required()
})


const FormularioRegistroGuiaRecepcion = () => {
  // const { authTokens, validate, userID } = useAuth()
  const [guiaGenerada, setGuiaGenerada] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [activo, setActivo] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const { isDarkTheme } = useDarkMode()
  const { verificarToken } = useAuth()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const camiones = useAppSelector((state: RootState) => state.camiones.camiones)
  const productores = useAppSelector((state: RootState) => state.productores.productores)
  const comercializadores = useAppSelector((state: RootState) => state.comercializadores.comercializadores)
  const conductores = useAppSelector((state: RootState) => state.conductores.conductores)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProductores({ token, verificar_token: verificarToken }))
  }, [])


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchComercializadores({ token, verificar_token: verificarToken }))
  }, [])



  useEffect(() => {
    //@ts-ignore
    dispatch(fetchConductores({ token, verificar_token: verificarToken }))
  }, [])


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
         const token_verificado = await verificarToken(token!)
        
         if (!token_verificado){
            throw new Error('Token no verificado')
         }

         const response = await fetchWithTokenPost(`api/recepcionmp/`, 
          { 
            ...values,
            estado_recepcion: '1',
            creado_por: perfilData?.id
          },
          token_verificado
        )

         if (response.ok){
          const data = await response.json()
          dispatch(GUARDAR_GUIA_RECEPCION(data))
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
          setGuiaGenerada(true)
         } else if (response.status === 400) {
          const errorData = await response.json()
          toast.error(`${Object.entries(errorData)}`)
         }
      } catch (error: any) {
        toast.error(`${Object.entries(error)}`)
      }
    }
  })

  const optionsCamion: TSelectOptions = camiones?.map((camion: TCamion) => ({
    value: String(camion.id),
    label: (`Patente ${camion.patente},  ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`)
  })) ?? []

  const optionsProductor: TSelectOptions = productores?.map((productor: TProductor) => ({
    value: String(productor.id),
    label: productor.nombre
  })) ?? []

  const optionsConductor: TSelectOptions = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre + ' ' + conductor.apellido
  })) ?? []

  const optionsComercializador: TSelectOptions = comercializadores?.map((comerciante: TComercializador) => ({
    value: String(comerciante.id),
    label: comerciante.nombre
  })) ?? []

  const optionsMezcla: TSelectOptions = ACTIVO?.map((variedad) => ({
    value: String(variedad.values),
    label: variedad.label
  })) ?? []



  return (
    <Container breakpoint={null} className='w-full h-full'>
      <Card>
        <CardHeader className='flex flex-col'>
            <h1 className='text-center text-2xl'>Guía Recepción Materia Prima</h1>
            <h4>{datosGuia?.estado_recepcion_label}</h4>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={formik.handleSubmit}
            className={`flex flex-col md:grid md:grid-cols-6 gap-5 dark:bg-inherit relative px-5 rounded-md`}
            >

            <div className='md:col-span-2 md:flex-col items-center'>
              <Label htmlFor='productor'>Productor: </Label>

              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.productor ? true : undefined}
                invalidFeedback={formik.errors.productor ? String(formik.errors.productor) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsProductor}
                    id='productor'
                    name='productor'
                    placeholder='Selecciona un productor'
                    className='h-14'
                    onBlur={formik.handleBlur}
                    onChange={(value: any) => {
                      formik.setFieldValue('productor', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
              <Label htmlFor='camionero'>Chofer: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.camionero ? true : undefined}
                invalidFeedback={formik.errors.camionero ? String(formik.errors.camionero) : undefined}

    >
                <FieldWrap>
                  <SelectReact
                    options={optionsConductor}
                    id='camionero'
                    name='camionero'
                    placeholder='Selecciona un chofer'
                    className='h-14'
                    onBlur={formik.handleBlur}
                    onChange={(value: any) => {
                      formik.setFieldValue('camionero', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>
            </div>

            <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
              <Label htmlFor='camion'>Camión: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.camion ? true : undefined}
                invalidFeedback={formik.errors.camionero ? String(formik.errors.camion) : undefined}
                >
                <FieldWrap>
                  <SelectReact
                    options={optionsCamion}
                    id='camion'
                    name='camion'
                    placeholder='Selecciona un camión'
                    className='h-14'
                    onBlur={formik.handleBlur}
                    onChange={(value: any) => {
                      formik.setFieldValue('camion', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>

            </div>

            <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
              <Label htmlFor='comercializador'>Comercializador: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.comercializador ? true : undefined}
                invalidFeedback={formik.errors.comercializador ? String(formik.errors.comercializador) : undefined}
                  >
                <FieldWrap>
                  <SelectReact
                    options={optionsComercializador}
                    id='comercializador'
                    name='comercializador'
                    placeholder='Selecciona una opción'
                    className='h-14'
                    onBlur={formik.handleBlur}

                    onChange={(value: any) => {
                      formik.setFieldValue('comercializador', value.value)
                    }}
                  />
                </FieldWrap>
              </Validation>

            </div>

            <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center justify-center'>
              <Label htmlFor='mezcla_variedades'>Mezcla Variedades: </Label>


              <div className={`w-full h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
                <RadioGroup isInline>
                  {optionsRadio.map(({ id, value, label }) => {
                    return (
                      <Radio
                        key={id}
                        label={label}
                        name='mezcla_variedades'
                        value={label} // Asignar el valor correcto de cada botón de radio
                        checked={formik.values.mezcla_variedades === value} // Comprobar si este botón de radio está seleccionado
                        onChange={(e) => {
                          formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false) // Actualizar el valor de mezcla_variedades en el estado de formik
                        }}
                        selectedValue={undefined} />
                    );
                  })}
                </RadioGroup>
              </div>
            </div>

            <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
              <Label htmlFor='numero_guia_productor'>N° Guía Productor: </Label>
              <Validation
                isValid={formik.isValid}
                isTouched={formik.touched.numero_guia_productor ? true : undefined}
                invalidFeedback={formik.errors.numero_guia_productor ? String(formik.errors.numero_guia_productor) : undefined}

    >
                <FieldWrap>
                  <Input
                    type='text'
                    name='numero_guia_productor'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className='py-[12px]'
                    value={formik.values.numero_guia_productor!}
                  />
                </FieldWrap>
              </Validation>
            </div>



            {
              guiaGenerada
                ? null
                :
                (
                  <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
                    <Button
                      variant='solid'
                      onClick={() => formik.handleSubmit()}
                      className='w-full bg-[#3B82F6] hover:bg-[#3b83f6cd] rounded-md text-white py-3'>
                      Continuar con la guia
                    </Button>
                  </div>
                )
            }
          </form>

          <div className='mt-2'>
            {
              (guiaGenerada && !variedad)
                ? (
                  <FooterFormularioRegistro data={datosGuia!} variedad={variedad} />
                )
                : (guiaGenerada && activo)
                  ? (
                    <FooterFormularioRegistro data={datosGuia!} variedad={variedad} />
                  )
                  : guiaGenerada
                    ? (
                      <Button
                        variant='solid'
                        className={`dark:bg-[#3B82F6] dark:hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white'}
                            ml-10 mt-10 px-6 py-3 rounded-md font-semibold text-md
                            `}
                        onClick={() => {
                          setActivo(prev => !prev)
                        }}>Agregar Lotes</Button>
                    )
                    : null
              }
          </div>
        </CardBody>
      </Card>
    </Container>
  )
}

export default FormularioRegistroGuiaRecepcion 
