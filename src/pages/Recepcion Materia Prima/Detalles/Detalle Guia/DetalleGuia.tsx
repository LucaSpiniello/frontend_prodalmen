import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useDarkMode from "../../../../hooks/useDarkMode";
import { TGuia, TLoteGuia } from "../../../../types/TypesRecepcionMP.types";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import {  fetchGuiaRecepcion } from "../../../../redux/slices/recepcionmp";
import { useAuth } from "../../../../context/authContext";
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch";
import { TControlCalidad } from "../../../../types/TypesControlCalidad.type";
import { useFormik } from "formik";
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils";
import { TConductor } from "../../../../types/TypesRegistros.types";
import SelectReact, { TSelectOptions } from "../../../../components/form/SelectReact";
import Button from "../../../../components/ui/Button";
import Validation from "../../../../components/form/Validation";
import FieldWrap from "../../../../components/form/FieldWrap";
import Radio, { RadioGroup } from "../../../../components/form/Radio";
import Input from "../../../../components/form/Input";
import ModalForm from "../../../../components/ModalForm.modal";
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import { fetchEnvases } from "../../../../redux/slices/envasesSlice";
import Card, { CardBody, CardHeader } from "../../../../components/ui/Card";
import Container from "../../../../components/layouts/Container/Container";
import ButtonsDetailGuia, { OPTIONS_GUIA, TTabsguia } from "./ButtonsFooterDetalleGuia";
import FooterFormularioEdicionGuia from "../../Formularios/Formulario Edicion Guia Recepcion Mp/FooterFormularioEdicionGuiaRecepcion";
import FooterDetalleGuia from "../FooterDetalleGuia";
import FooterDetalleRechazado from "../FooterDetalleRechazado";
import TablaDetalleGuiaFinalizada from "../FooterDetalleGuiaFinalizada2";
import { fetchConductores } from "../../../../redux/slices/conductoresSlice";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchCamiones } from "../../../../redux/slices/camionesSlice";


const optionsRadio = [
  { id: 1, value: true, label: 'Si' },
  { id: 2, value: false, label: 'No' }
];

const DetalleGuia = () => {
  const { id } = useParams()
  const [nuevoLote, setNuevoLote] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const [confirmacionCierre, setConfirmacionCierre] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const [editar, setEditar] = useState<boolean>(false)

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const conductores = useAppSelector((state: RootState) => state.conductores.conductores)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)

  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)



  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const { verificarToken } = useAuth()

  const [activeTab, setActiveTab] = useState<TTabsguia>(OPTIONS_GUIA.LP);

  useEffect(() => {
    if (activeTab.text === 'Lotes Por Aprobar' && guia_recepcion && guia_recepcion.estado_recepcion === '4'){
        setActiveTab(OPTIONS_GUIA.LA);
    } else if (activeTab.text === 'Lotes Aprobados' && guia_recepcion && guia_recepcion.estado_recepcion !== '4') {
        setActiveTab(OPTIONS_GUIA.LP);
    }
}, [guia_recepcion]);

  useEffect(() => {
    setVariedad(guia_recepcion ? guia_recepcion.mezcla_variedades : false)
  }, [guia_recepcion])

  useEffect(() => {
    dispatch(fetchGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [nuevoLote])

  useEffect(() => {
    if (envases.length < 1) {
      dispatch(fetchEnvases({ token, verificar_token: verificarToken }))
    }
  }, [envases])

  useEffect(() => {
    dispatch(fetchCamiones({ token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (conductores.length < 1) {
      dispatch(fetchConductores({ token, verificar_token: verificarToken }))
    }
  }, [conductores])


  const { data: control_calidad } = useAuthenticatedFetch<TControlCalidad[]>(
    `api/control-calidad/recepcionmp`
  )

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

        const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/`, { ...values }, token_verificado)
        if (res.ok) {
          const data = await res.json()
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
          toast.success("la guia de recepción fue registrado exitosamente!!")
  
          dispatch(fetchGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
        } else {
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const estado_guia_update = async (id: any) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')

    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/`, 
    {
      estado_recepcion: 4
    },
    token_verificado)
    if (res.ok) {
      toast.success('Guia Finalizada')
      dispatch(fetchGuiaRecepcion({ id, token, verificar_token: verificarToken }))
    } else {
      toast.error('No se pudo finalizar la guia')
    }
  }

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

      setDatosGuia(guia_recepcion)

    }
    return () => {
      isMounted = false
    }
  }, [guia_recepcion])

  useEffect(() => {
    if (confirmacionCierre){
      estado_guia_update(guia_recepcion?.id)
    }
  }, [confirmacionCierre])




  const controles = guia_recepcion?.lotesrecepcionmp.some((lote: TLoteGuia) => {
    return control_calidad?.filter(control => control.recepcionmp === lote.id && (control.estado_cc === '1' || control.estado_cc === '0')).length;
  })


  const optionsConductor: TSelectOptions = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre + ' ' + conductor.apellido
  })) ?? []


  return (
    <Container breakpoint={null} className="w-full h-full">
      <Card>
        <CardBody>
          <Card>
            <CardHeader>
              <h1 className='text-center text-2xl p-2'>Guía Recepción Materia Prima</h1>
              <h5 className='text-center text-xl p-2'>Estado: {guia_recepcion?.estado_recepcion_label}</h5>
            </CardHeader>
            <CardBody>

              <article className="flex flex-col md:grid mt-5 md:grid-cols-6 gap-5 dark:bg-inherit bg-zinc-50 px-5 py-2 rounded-md relative">
              {
              hasGroup(['recepcion-mp']) && guia_recepcion?.estado_recepcion !== '4'
                ? (
                  <>
                    {
                      !editar 
                        ? (
                          <Button
                            color='blue'
                            variant='solid'
                            className='absolute -top-5 right-5'
                            onClick={() => setEditar(true)}>
                            Editar
                          </Button>
                        )
                        : (
                          <>
                            <Button
                              variant='solid'
                              className='absolute bg-red-700 hover:bg-red-600 border-red-700 hover:border-red-600 -top-5 right-5'
                              onClick={() => setEditar(false)}
                              >
                              Cancelar
                            </Button>

                            <Button
                              color='blue'
                              variant='solid'
                              className='absolute -top-5 right-36'
                              onClick={() => {
                                formik.handleSubmit()
                                setEditar(false)
                                // setRefresh(true)
                              }}
                              >
                              Guardar
                            </Button>
                          </>

                        )
                    }
                  </>
                )
                : null
            } 
                <div className='md:col-span-2 md:flex-col items-center'>
                  <label htmlFor="productor">Productor: </label>
                  <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                    <span>{guia_recepcion?.nombre_productor}</span>
                  </div>
                </div>

                <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
                  <label htmlFor="camionero">Chofer: </label>

                  {
                    editar
                      ? (
                        <>
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
                                className='h-12'
                                onBlur={formik.handleBlur}
                                value={optionsConductor.find(con => con?.value === String(formik.values.camionero))}
                                onChange={(value: any) => {
                                  formik.setFieldValue('camionero', value.value)
                                }}
                              />
                            </FieldWrap>
                          </Validation>
                        </>
                        )
                      : (
                      <>
                        <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                          <span>{guia_recepcion?.nombre_camionero}</span>
                        </div>
                      </>
                      )
                  }

                </div>

                <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
                  <label htmlFor="camion">Camion: </label>
                  <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                    <span>{guia_recepcion?.nombre_camion}</span>
                  </div>
                </div>

                <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
                  <label htmlFor="comercializador">Comercializador: </label>
                  <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                    <span>{guia_recepcion?.nombre_comercializador}</span>
                  </div>
                </div>

                <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
                  <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

                  <div className={`w-full h-12 dark:bg-[#27272A] bg-gray-100 rounded-md flex items-center justify-center relative py-2 border dark:border-zinc-600`}>
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
                            selectedValue={undefined}
                            disabled={editar ? false : true} />
                        );
                      })}
                    </RadioGroup>
                  </div>
                </div>

                <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
                  <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
                  {
                    editar
                      ? (
                        <>
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
                                className='py-3'
                                value={formik.values.numero_guia_productor!}
                              />
                            </FieldWrap>
                          </Validation>
                        </>
                        )
                      : (
                        <>
                          <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                            <span>{guia_recepcion?.numero_guia_productor}</span>
                          </div>
                        </>
                        )
                  }
                </div>
              </article>

              <div className="flex gap-10 py-2">
                {
                  guia_recepcion?.lotesrecepcionmp.length! < 1 && guia_recepcion?.estado_recepcion != '4' || variedad && guia_recepcion?.estado_recepcion != '4' 
                    ? (
                      <Button
                        variant="solid"
                        onClick={() => setNuevoLote(prev => !prev)}
                        className={`${nuevoLote ? 'bg-red-800 hover:bg-red-700' : 'bg-blue-700 hover:bg-blue-600'} border-none py-2 w-40 flex items-center justify-center rounded-md cursor-pointer hover:scale-105 relative left-5`}>
                        <span className='text-white '>{nuevoLote ? 'Cancelar' : 'Agregar Lote' }</span>
                      </Button>
                    )
                    : null
                }


                {
                  nuevoLote
                    ? null
                    : guia_recepcion?.mezcla_variedades && guia_recepcion?.estado_recepcion !== '4' && ('recepcion-mp' in userGroup?.groups!)
                        ? (
                        <>
                          {
                            guia_recepcion?.lotesrecepcionmp.length >= 1 && guia_recepcion?.lotesrecepcionmp.every((lote: any) => lote.estado_recepcion >= '6' || lote.estado_recepcion === '4')
                              ? (
                                <ModalForm
                                  open={open || false}
                                  setOpen={setOpen}
                                  title={'Finalizar Guía'}
                                  textTool='Detalle'
                                  variant="solid"
                                  size={450}
                                  width={`w-52 h-16 md:h-16 lg:h-11 bg-emerald-700 hover:bg-emerald-600 border border-emerald-700 hover:border-emerald-600 text-white hover:scale-105`}
                                  textButton='Finalizar Guía'
                                  
                                >
                                  <ModalConfirmacion
                                      mensaje='¿Quieres Finalizar La Guia'
                                      confirmacion={confirmacionCierre}
                                      setConfirmacion={setConfirmacionCierre}
                                      setOpen={setOpen} 
                                      />
                                </ModalForm>
                              )
                              : null
                            }
                          </>
                          )
                      : null
                }
              </div>
            </CardBody>
          </Card>

          <Card className="!p-0">    
            <CardHeader className="!p-0">
              {
                nuevoLote
                  ? null
                  : <ButtonsDetailGuia activeTab={activeTab} setActiveTab={setActiveTab} guia_recepcion={guia_recepcion}/>
              }
            </CardHeader>
            <CardBody>
              {  
                  nuevoLote
                  ? <FooterFormularioEdicionGuia variedad={guia_recepcion?.mezcla_variedades!} detalle={setNuevoLote}/>
                  : (
                      (activeTab.text === 'Lotes Por Aprobar' && guia_recepcion?.estado_recepcion !== '4')
                      ? <FooterDetalleGuia data={guia_recepcion!} /> 
                      : (activeTab.text === 'Lotes Aprobados')
                        ? <TablaDetalleGuiaFinalizada />
                        : (activeTab.text === 'Lotes Rechazados')
                          ? <FooterDetalleRechazado setActiveTab={setActiveTab}/>
                          : null
                    )
              }

            </CardBody> 
          </Card>
        </CardBody>
      </Card>
    </Container>

      
  )
}

export default DetalleGuia 