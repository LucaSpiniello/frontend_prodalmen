import { useLocation, useParams } from "react-router-dom";
import { format } from "@formkit/tempo";
import { RootState } from "../../../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { useAuth } from "../../../../../context/authContext";
import { useEffect, useState } from "react";
import PageWrapper from "../../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import TablaDetalleSubProductosEnBin from "../Tablas/TablaDetalleSubProductosEnBin";
import { fetchDetalleBinSubproducto, fetchHistoricoBinSubProducto } from "../../../../../redux/slices/seleccionSlice";
import Button from "../../../../../components/ui/Button";
import { useFormik } from "formik";
import Label from "../../../../../components/form/Label";
import Validation from "../../../../../components/form/Validation";
import FieldWrap from "../../../../../components/form/FieldWrap";
import SelectReact from "../../../../../components/form/SelectReact";
import { optionTipoPatineta, optionsCalibres, optionsCalidad, optionsFrutaCalidad, optionsTipoSubProducto, optionsVariedad } from "../../../../../utils/options.constantes";
import { fetchWithTokenPatch, fetchWithTokenPut } from "../../../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import Timeline, { TimelineItem } from "../../../../../components/Timeline";
import Icon from "../../../../../components/icon/Icon";
import Alert from "../../../../../components/ui/Alert";
import priceFormat from "../../../../../utils/priceFormat.util";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { IoMdClose } from "react-icons/io";




const DetalleAgrupacionBinSubProducto = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState(false)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const bin_subproducto = useAppSelector((state: RootState) => state.seleccion.bin_subproducto_detalle)
  const historico_subproducto = useAppSelector((state: RootState) => state.seleccion.historico_bin_subproducto)


  const formik = useFormik({
    initialValues: {
      tipo_patineta: '',
      variedad: '',
      calidad: '',
      calibre: '',
      calle_bodega: ''
    },
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token!)
      
      if (!token_verificado) throw new Error('Token no verificado')

      const res = await fetchWithTokenPatch(`api/binsubproductoseleccion/${id}/`, { ...values }, token_verificado )

      if (res.ok){
        //@ts-ignore
        dispatch(fetchDetalleBinSubproducto({ id, token, verificar_token: verificarToken }))
        //@ts-ignore
        dispatch(fetchHistoricoBinSubProducto({ id, token, verificar_token: verificarToken }))
        toast.success('Se ha actualizado exitosamente!')
        setEditar(false)
      } else
        toast.error('No se ha podido actualizar')
    }
  })


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchDetalleBinSubproducto({ id, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchHistoricoBinSubProducto({ id, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (bin_subproducto){
      formik.setValues({
        tipo_subproducto: bin_subproducto.tipo_subproducto,
        variedad: bin_subproducto.variedad,
        calidad: bin_subproducto.calidad,
        calibre: bin_subproducto.calibre,
        calle_bodega: bin_subproducto.calle_bodega
      })
    }
  }, [bin_subproducto])

  return (
   <PageWrapper title="Detalle Agrupación">
    <Container breakpoint={null} className="w-full h-full overflow-hidden flex-col gap-2">

      <Card>
        <CardHeader>
          <CardTitle>Detalle Agrupación de Bins SubProducto N° {id}</CardTitle>
          <div className="flex gap-5">
            {
              editar
                ? (
                  <>
                    <Button
                      variant="solid"
                      color="emerald"
                      colorIntensity="600"
                      onClick={() => formik.handleSubmit()}
                      >
                        Guardar
                    </Button>

                    <Button
                      variant="solid"
                      color="red"
                      colorIntensity="600"
                      onClick={() => setEditar(false)}
                      >
                        Cancelar
                    </Button>
                  </>
                ) 
                : (
                  <Button
                    variant="solid"
                    color="blue"
                    colorIntensity="600"
                    onClick={() => setEditar(true)}
                    >
                      Editar
                  </Button>
                )
            }
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-y-5">
          <div className='flex flex-col md:flex-row lg:flex-row w-full gap-5'>
            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Registrado Por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{bin_subproducto?.registrado_por_label}</span>
              </div>
            </div>

            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Código Tarja: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{bin_subproducto?.codigo_tarja}</span>
              </div>
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="rut_productor">Fecha Creación: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{format(bin_subproducto?.fecha_creacion!, { date: 'short', time: 'short' }, 'es' )}</span>
              </div>
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="rut_productor">Kilos Agrupación: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{(bin_subproducto?.subproductos.reduce((acc, bin) => bin.peso + acc, 0) ?? 0).toLocaleString()}</span>
              </div>
            </div>
        </div>

        <div className='flex flex-col md:flex-row lg:flex-row w-full gap-5'>
          <div className='w-full flex-col items-center'>
            <label htmlFor="tipo_subproducto">Tipo SubProducto: </label>
              {
                editar
                  ? (
                      <>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.tipo_subproducto ? true : undefined}
                          invalidFeedback={formik.errors.tipo_subproducto ? String(formik.errors.tipo_subproducto) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                                options={optionsTipoSubProducto}
                                id='tipo_subproducto'
                                placeholder='Selecciona un opción'
                                name='tipo_subproducto'
                                className='h-[35px]'
                                value={optionsTipoSubProducto.find(tipo => tipo?.value === formik.values.tipo_subproducto)}
                                onChange={(value: any) => {
                                  formik.setFieldValue('tipo_subproducto', value.value)
                                  
                                }}
                              />
                          </FieldWrap>
                        </Validation>
                      </>
                    )
                  : (
                    <>
                      
                      <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                        <span>{bin_subproducto?.tipo_subproducto_label}</span>
                      </div>
                    </>
                    )
              }


              
            </div>

            <div className='w-full flex-col items-center'>
              <label htmlFor="variedad">Variedad: </label>
              {
                editar
                  ? (
                      <>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.variedad ? true : undefined}
                          invalidFeedback={formik.errors.variedad ? String(formik.errors.variedad) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                                options={optionsVariedad}
                                id='variedad'
                                placeholder='Selecciona un opción'
                                name='variedad'
                                className='h-[35px]'
                                value={optionsVariedad.find(tipo => tipo?.value === formik.values.variedad)}
                                onChange={(value: any) => {
                                  formik.setFieldValue('variedad', value.value)
                                  
                                }}
                              />
                          </FieldWrap>
                        </Validation>
                      </>
                    )
                  : (
                    <>
                      
                      <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                        <span>{bin_subproducto?.variedad_label}</span>
                      </div>
                    </>
                    )
              }
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="calidad">Calidad: </label>
              {
                editar
                  ? (
                      <>
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.calidad ? true : undefined}
                          invalidFeedback={formik.errors.calidad ? String(formik.errors.calidad) : undefined}
                          >
                          <FieldWrap>
                            <SelectReact
                                options={optionsFrutaCalidad}
                                id='calidad'
                                placeholder='Selecciona un opción'
                                name='calidad'
                                className='h-[35px]'
                                value={optionsFrutaCalidad.find(tipo => tipo?.value === formik.values.calidad)}
                                onChange={(value: any) => {
                                  formik.setFieldValue('calidad', value.value)
                                  
                                }}
                              />
                          </FieldWrap>
                        </Validation>
                      </>
                    )
                  : (
                    <>
                      
                      <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                        <span>{bin_subproducto?.calidad_label}</span>
                      </div>
                    </>
                    )
              }
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="calibre">Calibre: </label>
                      
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{bin_subproducto?.calibre_label}</span>
              </div>

            </div>
          </div>
        </CardBody>
      </Card>

      <div className="flex mt-5 gap-5 lg:flex-row flex-col">
        <Card className="lg:w-8/12 flex flex-row ">
          <CardBody>
            <TablaDetalleSubProductosEnBin subproductos={bin_subproducto?.subproductos}/>
          </CardBody>
        </Card>

        <Card className="lg:w-4/12">
          <CardHeader>
            <CardTitle>Historial del Bin SubProducto</CardTitle>
          </CardHeader>
          <CardBody className='h-96 overflow-scroll'>
            <Timeline>
              {
                historico_subproducto?.map((dato) => (
                  <TimelineItem icon={
                      dato.cambio.includes('creado')
                        ? 'HeroRocketLaunch'
                        : dato.cambio.includes('Operario')
                          ?'HeroPlusCircle'
                          : dato.cambio.includes('cambió')
                            ? 'DuoLoading'
                            : ''
                    }
                    actions={
                      dato.cambio.includes('creado')
                      ? 'animate-bounce'
                      : dato.cambio.includes('Operario')
                        ?'animate-pulse'
                        : dato.cambio.includes('cambió')
                          ? 'animate-spin'
                          : ''
                    }
                    >
                    {
                      dato.cambio.includes('creado')
                        ? (
                          <>
                            <div>
                              {bin_subproducto?.codigo_tarja} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )}
                            </div>
                            <Alert color='emerald' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                          </>
                          )
                        : dato.cambio.includes('Operario')
                          ? (
                            <>
                              <div>
                                {/* {bin_subproducto?.subproductos[0].programa} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )} */}
                              </div>
                              <Alert color='emerald' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                            </>
                            )
                          : dato.cambio.includes('cambió')
                            ? (
                              <>
                                <div>
                                  {/* {bin_subproducto?.subproductos[0].programa} - {format(dato.fecha, { date: 'full', time: 'short'}, 'es' )} */}
                                </div>
                                <Alert color='lime' variant='outline' className='border-transparent'>{dato.cambio}</Alert>
                              </>
                              )
                            : null
                    }

                  </TimelineItem>
                ))
              }
            </Timeline>
          </CardBody>
        </Card>
      </div>
    </Container>
   </PageWrapper>

  )
}

export default DetalleAgrupacionBinSubProducto
