import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { OPTIONS, TTabs } from "../../../../types/TabsDashboardPrograma.types"
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import CardFrutaIngresada from "./CardFrutaIngresada.chart";
import CardFrutaCalibrada from "./CardFrutaCalibrada.chart";
import DetalleEnvasesLote from "./Detalle Envases Programa/DetalleEnvasesLote";
import Container from "../../../../components/layouts/Container/Container";
import { useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import ButtonsProduccion from "./ButtonsProduccion";
import Badge from "../../../../components/ui/Badge";
import DetalleTarjaResultante from "./Detalle Tarja Resultante/DetalleTarjaResultante";
import { actualizar_programa_produccion, fetchEnvasesProduccion, fetchListaOperariosEnPrograma, fetchMensajeCierreProduccion, fetchMensajeTerminoProduccion, fetchProgramaProduccion, fetchTarjasResultantes, GUARDAR_MENSAJE_CIERRE, GUARDAR_MENSAJE_TERMINO } from "../../../../redux/slices/produccionSlice";
import DetalleOperarioPrograma from "./Detalle Operarios Programa/DetalleOperarioPrograma";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Button from "../../../../components/ui/Button";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import { GoQuestion } from "react-icons/go";
import Input from "../../../../components/form/Input";
import { useFormik } from "formik";
import Validation from "../../../../components/form/Validation";
import FieldWrap from "../../../../components/form/FieldWrap";
import * as Yup from 'yup';
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import ModalForm from "../../../../components/ModalForm.modal";
import TabGeneralProduccion from "./TabGeneralProduccion";
import Alert from "../../../../components/ui/Alert";


const DashboardProduccion = () => {
  const { id } = useParams()
	const [activeTab, setActiveTab] = useState<TTabs>(OPTIONS.GN);
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const programa_produccion =  useAppSelector((state: RootState) => state.programa_produccion.programa)
  const mensajesProduccion = useAppSelector((state: RootState) => state.programa_produccion.mensajeTerminoProduccion)
  const mensajeCierre = useAppSelector((state: RootState) => state.programa_produccion.mensajeCierreProduccion)
  const { verificarToken } = useAuth()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const estado = programa_produccion?.estado

  const validationSchema = Yup.object().shape({
    // fecha_inicio_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable(),
    fecha_termino_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable()
  })

  useEffect(() => {
    if (id) {
      dispatch(fetchProgramaProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
      dispatch(fetchEnvasesProduccion({ id: parseInt(id), token, verificar_token: verificarToken }))
      dispatch(fetchTarjasResultantes({ id: parseInt(id), token, verificar_token: verificarToken }))
      dispatch(fetchListaOperariosEnPrograma({ id_programa: parseInt(id), token, verificar_token: verificarToken }))
      dispatch(GUARDAR_MENSAJE_TERMINO(null))
      dispatch(GUARDAR_MENSAJE_CIERRE(null))
    }
  }, [id])

  useEffect(() => {
    if (programa_produccion && ['0', '1','2', '3'].includes(programa_produccion.estado)) {
      dispatch(fetchMensajeTerminoProduccion({ id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_produccion])

  useEffect(() => {
    if (programa_produccion && programa_produccion.estado === '4') {
      dispatch(fetchMensajeCierreProduccion({id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_produccion])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // fecha_inicio_proceso: "",
      fecha_termino_proceso: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
			  if (!token_verificado) throw new Error('Token no valido')
        const response = await fetchWithTokenPatch(`api/produccion/${id}/`, {...values}, token?.access)
        if (response.ok) {
          dispatch(
            actualizar_programa_produccion({
              id: parseInt(id!), 
              params: { 
                estado: '4',
                perfil: perfil,
                detalle: true,
                },
              token, 
              verificar_token: verificarToken 
              })
          )
        } else {
          toast.error('Fallo el guardado de fechas')
        }
      } catch {
        toast.error('Fallo el guardado de fechas')
      }
    }
  })

	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
        <Subheader className="flex flex-col md:flex-row lg:flex-row">
          <SubheaderLeft className="w-full lg:w-auto mx-auto md:mx-0 lg:mx-0">
						<ButtonsProduccion activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-2 w-full items-center justify-center'>
              <Badge  className='bg-blue-200 rounded-lg text-xs font-bold animate-pulse p-2'>
                {programa_produccion?.estado_label}
              </Badge>
              
                
                <div className='h-full w-auto flex mb-2 justify-center gap-5 flex-wrap md:flex-wrap'>
                  {
                    estado === '0' || estado === '1' && estado <= '2' && programa_produccion?.estado_label
                      ? (
                        <Button
                          title='Iniciar Producción'
                          variant='solid'
                          color='amber'
                          onClick={() => dispatch(
                            actualizar_programa_produccion({
                              id: parseInt(id!), 
                              params: { 
                                estado: '2',
                                tipo_boton: 'inicio',
                                fecha_registrada: programa_produccion?.fecha_inicio_proceso,
                                perfil: perfil,
                                detalle: true
                                },
                              token, 
                              verificar_token: verificarToken 
                              })
                          )}
                          className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
                          <FaPlay style={{ fontSize: 25, color: 'white' }}/>
                        </Button>
                        )
                      : null
                  }

                  {
                    estado === '2'
                      ? (
                        <Button
                          title='Pausar Producción'
                          variant='solid'
                          color='blue'
                          onClick={() => dispatch(
                            actualizar_programa_produccion({
                              id: parseInt(id!), 
                              params: { 
                                estado: '0',
                                perfil: perfil,
                                detalle: true,
                                },
                              token, 
                              verificar_token: verificarToken 
                              })
                          )}
                          className='w-16 rounded-md h-12 flex items-center justify-center p-2 hover:scale-105'>
                            <FaPause style={{ fontSize: 25, color: 'white' }}/>
                          </Button>
                        )
                      : null
                  }

                  {
                    programa_produccion?.condicion_termino && !['4', '5'].includes(estado!)
                      ? (
                        <>
                          <Modal
                            isStaticBackdrop={true}
                            // size={size}
                            isAnimation={true} 
                            isCentered={true} 
                            isScrollable={true} 
                            isOpen={openModal}
                            setIsOpen={setOpenModal}
                          >
                            <ModalHeader>¿Estás Seguro de Terminar este Programa de Producción?</ModalHeader>
                            <ModalBody>
                              <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
                                <GoQuestion className='text-9xl text-yellow-500' />
                              </div>
                              <div className='w-full flex items-center justify-between'>
                                <button
                                  className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                                  onClick={() => {setModalFecha(true) ;setOpenModal(false)}}
                                > Sí </button>
                                <button
                                  className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
                                  onClick={() => {setOpenModal(false)}}
                                > No </button>
                              </div>
                            </ModalBody>
                          </Modal>
                          <Modal
                            isOpen={modalFecha}
                            setIsOpen={setModalFecha}
                            isCentered={true}
                            isStaticBackdrop={true}
                          >
                            <ModalHeader>Ingrese Fecha de Termino del Programa</ModalHeader>
                            <ModalBody>
                              <div className="grid grid-cols-12 w-full gap-4">
                                {/* <div className="col-span-12 md:col-span-6">
                                  <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.fecha_inicio_proceso ? true : undefined}
                                    invalidFeedback={formik.errors.fecha_inicio_proceso}
                                  >
                                    <FieldWrap>
                                      <Input
                                        type='date'
                                        name='fecha_inicio_proceso'
                                        onChange={formik.handleChange}
                                        className='py-3 text-black'
                                        value={formik.values.fecha_inicio_proceso}
                                      />
                                    </FieldWrap>
                                  </Validation>
                                </div> */}
                                <div className="col-span-12 md:col-span-12">
                                  <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.fecha_termino_proceso ? true : undefined}
                                    invalidFeedback={formik.errors.fecha_termino_proceso}
                                  >
                                    <FieldWrap>
                                      <Input
                                        type='date'
                                        name='fecha_termino_proceso'
                                        onChange={formik.handleChange}
                                        className='py-3 text-black'
                                        value={formik.values.fecha_termino_proceso}
                                      />
                                    </FieldWrap>
                                  </Validation>
                                </div>
                                <div className="col-span-12 justify-between flex">
                                  <Button variant="solid" onClick={() => {formik.handleSubmit()}}>Terminar Programa</Button>
                                  <Button variant="solid" color="red" colorIntensity="600" onClick={() => {setModalFecha(false); formik.resetForm()}}>Cancelar</Button>
                                </div>
                              </div>
                            </ModalBody>
                          </Modal>
                          <Button color="red" colorIntensity="600" className="hover:scale-105" variant="solid" title="Terminar Programa"
                            onClick={() => {setOpenModal(true); formik.handleSubmit()}}
                          > <FaStop style={{ fontSize: 25, color: 'white' }}/></Button>
                        </>
                        )
                      : null
                  }
                  {
                    programa_produccion?.condicion_cierre && estado === '4'
                      ? (
                        <ModalForm
                          open={openModalCerrar}
                          setOpen={setOpenModalCerrar}
                          textTool='Cerrar Programa'
                          variant="solid"
                          color="red"
                          colorIntensity="700"
                          width="hover:scale-105"
                          textButton={`Cerrar Programa`}
                          title={`¿Estás Seguro de Cerrar este Programa de Producción?`}
                        >
                          {/* <ModalConfirmacion
                            mensaje='¿Estas seguro de Cerrar Programa Producción?'
                            confirmacion={confirmacion}
                            setConfirmacion={setConfirmacion}
                            setOpen={setOpenModal} 
                            /> */}
                            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
                              <GoQuestion className='text-9xl text-yellow-500' />
                            </div>
                            <div className='w-full flex items-center justify-between'>
                              <button
                                className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                                onClick={() => {
                                  dispatch(
                                    actualizar_programa_produccion({
                                      id: parseInt(id!), 
                                      params: { 
                                        estado: '5',
                                        tipo_boton: 'cierre',
                                        perfil: perfil,
                                        detalle: true
                                        },
                                      token, 
                                      verificar_token: verificarToken 
                                      })
                                  ) ;setOpenModal(false)}}
                              > Sí </button>
                              <button
                                className='w-48 py-3 px-6 rounded-md bg-red-600 text-white'
                                onClick={() => {setOpenModal(false)}}
                              > No </button>
                            </div>
                        </ModalForm>
                        )
                      : null
                  }
                </div>
            </div>
          </SubheaderRight>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full'>
					<div className='grid grid-cols-12 gap-2'>
            <div className="col-span-12 gap-4">
              {
                mensajesProduccion && programa_produccion && ['0', '1','2', '3'].includes(programa_produccion.estado) && (
                  <div className="flex gap-4">
                    <Alert
                     variant="solid"
                     isClosable={true}
                     >
                      {mensajesProduccion.estado_lotes}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesProduccion.estado_control_calidad}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesProduccion.estado_operarios}
                    </Alert>
                  </div>
                )
              }
              {
                mensajeCierre && programa_produccion && programa_produccion.estado === '4' && (
                  <div className="flex gap-4">
                    {
                      mensajeCierre.estado_dias.map(element => (
                        <Alert
                          variant="solid"
                          isClosable={true}
                          >
                          {element.nombre_operario} tiene {element.dias_trabajados} dias trabajados con {element.total_kilos} kilos
                        </Alert>
                      ))
                    }
                  </div>
                )
              }
            </div>
            <div className='col-span-12 2xl:col-span-12 gap-2'>
            {
              activeTab.text === 'General'
                ? (
                  <>
                    {/* <div className='col-span-12 '>
                      <CardFrutaIngresada />
                    </div>
                    <div className='row-start-2 col-span-12 mt-2'>
                      <CardFrutaCalibrada 
                        activeTab={activeTab} 
                        programa={programa_produccion!}
                        tarjas_resultantes={tarjas_resultantes!}/>
                    </div> */}
                    <TabGeneralProduccion></TabGeneralProduccion>
                  </>
                  )
                : null
            }
            </div>
						

						<div className='col-span-12 2xl:col-span-12'>
							{
                 activeTab.text === 'Envases de Lotes Seleccionados'
                    ? <DetalleEnvasesLote />
                      : activeTab.text === 'Operarios en Programa'
                        ? <DetalleOperarioPrograma />
                        : activeTab.text === 'Tarja Resultante'
                          ? <DetalleTarjaResultante />
                            : null
              }
						</div>
		
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardProduccion;
