import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import Tooltip from "../../../../components/ui/Tooltip";
import ModalForm from "../../../../components/ModalForm.modal";
import Container from "../../../../components/layouts/Container/Container";
import { useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import CardDetalleProgramaSeleccion from "./CardFrutaIngresada.chart";
import Button from "../../../../components/ui/Button";
import { actualizar_programa_reproceso, fetchBinsEnReproceso, fetchMensajeCierreReproceso, fetchMensajeTerminoReproceso, fetchProgramaReproceso, fetchTarjasResultantesReproceso } from "../../../../redux/slices/reprocesoSlice";
import CardFrutaCalibrada from "./CardFrutaCalibrada.chart";
import ButtonsReproceso from "./ButtonsReproceso";
import { OPTIONS_RP, TTabsRP } from "../../../../types/TypesReproceso.types";
import DetalleTarjaResultanteReproceso from "./Tarja Resultante/DetalleTarjaResultante";
import DetalleEnvasesLote from "./Bin en Reproceso/DetalleEnvasesLoteSeleccion";
import DetalleOperarioReproceso from "./Detalle Operarios Reproceso/DetalleOperarioReproceso";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import Badge from "../../../../components/ui/Badge";
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import { GoQuestion } from "react-icons/go";
import Validation from "../../../../components/form/Validation";
import FieldWrap from "../../../../components/form/FieldWrap";
import Input from "../../../../components/form/Input";
import * as Yup from 'yup';
import toast from "react-hot-toast";
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils";
import { useFormik } from "formik";
import Alert from "../../../../components/ui/Alert";


const DashboardSeleccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
	const [activeTab, setActiveTab] = useState<TTabsRP>(OPTIONS_RP.GR);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const programa_reproceso =  useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const mensajeTerminoReproceso = useAppSelector((state: RootState) => state.reproceso.mensajeTerminoReproceso)
  const mensajeCierreReproceso = useAppSelector((state: RootState) => state.reproceso.mensajeCierreReproceso)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const estado = programa_reproceso?.estado
  
  const validationSchema = Yup.object().shape({
    // fecha_inicio_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable(),
    fecha_termino_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable()
  })

  useEffect(() => {
    if (confirmacion){
      dispatch(
        actualizar_programa_reproceso({
          id: parseInt(id!), 
          params: {   
            estado: '4',
            tipo_boton: 'cierre',
            perfil: perfil,
            detalle: true,
            },
          token, 
          verificar_token: verificarToken 
          })
      )
    }

    return () => {}
  }, [confirmacion])


  useEffect(() => {
    //@ts-ignore
    dispatch(fetchProgramaReproceso({ id, token, verificar_token: verificarToken }))
    dispatch(fetchTarjasResultantesReproceso({ id, token, verificar_token: verificarToken }))
    dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
  }, [])


  useEffect(() => {
    if (programa_reproceso && ['0', '1','2'].includes(programa_reproceso.estado)) {
      dispatch(fetchMensajeTerminoReproceso({ id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_reproceso])

  useEffect(() => {
    if (programa_reproceso && programa_reproceso.estado === '3') {
      dispatch(fetchMensajeCierreReproceso({id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_reproceso])

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
        const response = await fetchWithTokenPatch(`api/reproceso/${id}/`, {...values}, token?.access)
        if (response.ok) {
          dispatch(
            actualizar_programa_reproceso({
              id: parseInt(id!), 
              params: { 
                estado: '3',
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
			<PageWrapper name='Detalle Programa Reproceso'>
        <Subheader className="flex flex-col md:flex-row lg:flex-row">
          <SubheaderLeft className="w-full lg:w-auto mx-auto md:mx-0 lg:mx-0">
						<ButtonsReproceso activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>  
          <SubheaderRight>
              <div className='flex gap-2 w-full items-center justify-center'>
                <Badge color="emerald" colorIntensity="900" className='bg-emerald-400 rounded-lg text-xs font-bold animate-pulse'>
                  {programa_reproceso?.estado_label}
                </Badge>
                {
                  estado === '0' || estado === '1' && estado <= '2' && programa_reproceso?.estado_label
                    ? (
                      <Button
                        title='Iniciar Programa'
                        variant='solid'
                        color='amber'
                        onClick={() => dispatch(
                          actualizar_programa_reproceso({
                            id: parseInt(id!), 
                            params: { 
                              estado: '2',
                              tipo_boton: 'inicio',
                              perfil: perfil,
                              detalle: true
                              },
                            token, 
                            verificar_token: verificarToken 
                            })
                        )}
                        className='justify-center p-2 hover:scale-105'>
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
                          actualizar_programa_reproceso({
                            id: parseInt(id!), 
                            params: { 
                              estado: '1',
                              perfil: perfil,
                              detalle: true,
                              },
                            token, 
                            verificar_token: verificarToken 
                            })
                        )}
                        className=' hover:scale-105'>
                          <FaPause style={{ fontSize: 25, color: 'white' }}/>
                        </Button>
                      )
                    : null
                }

                {
                  programa_reproceso?.condicion_termino && !['3', '4'].includes(estado!)
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
                          <ModalHeader>¿Estás Seguro de Terminar este Programa de Reproceso?</ModalHeader>
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
                          <ModalHeader>Ingrese Fecha de Termino del Reproceso</ModalHeader>
                          <ModalBody>
                            <div className="grid grid-cols-12 w-full gap-4">
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
                        <Button color="red" colorIntensity="600" className="hover:scale-105" variant="solid" title="Terminar Reproceso"
                          onClick={() => {setOpenModal(true); formik.handleSubmit()}}
                        > <FaStop style={{ fontSize: 25, color: 'white' }}/></Button>
                      </>
                      )
                    : null
                }

                {
                  programa_reproceso?.condicion_cierre && estado === '3'
                    ? (
                      <ModalForm
                          open={openModal}
                          setOpen={setOpenModal}
                          textTool='Terminar Reproceso'
                          variant="solid"
                          color="red"
                          colorIntensity="700"
                          width="hover:scale-105"
                          textButton={`Cerrar Reproceso`}
                        >
                          <ModalConfirmacion
                            mensaje='¿Estas seguro de Cerrar Programa Reproceso?'
                            confirmacion={confirmacion}
                            setConfirmacion={setConfirmacion}
                            setOpen={setOpenModal} 
                            />
                        </ModalForm>
                      )
                    : null
                }
              </div>

                    
          </SubheaderRight>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full'>
					<div className='grid grid-cols-12 gap-2'>
            <div className="col-span-12 gap-4">
            {
                mensajeTerminoReproceso && programa_reproceso && ['0', '1', '2'].includes(programa_reproceso.estado) && (
                  <div className="flex gap-4">
                    <Alert
                     variant="solid"
                     isClosable={true}
                     >
                      {mensajeTerminoReproceso.estado_lotes}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajeTerminoReproceso.estado_control_calidad}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajeTerminoReproceso.estado_operarios}
                    </Alert>
                  </div>
                )
              }
              {
                mensajeCierreReproceso && programa_reproceso && programa_reproceso.estado === '3' && (
                  <div className="flex gap-4">
                    {
                      mensajeCierreReproceso.estado_dias.map(element => (
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
                    <div className='col-span-12 '>
                      <CardDetalleProgramaSeleccion />
                    </div>
                    <div className='row-start-2 col-span-12 mt-2'>
                      <CardFrutaCalibrada />
                    </div>
                  </>
                  )
                : null
            }
            </div>
						

						<div className='col-span-12 2xl:col-span-12'>
							{
                activeTab.text === 'Tarjas Resultantes'
                ? <DetalleTarjaResultanteReproceso />
                  : activeTab.text === 'Envases de Lote Seleccionado'
                    ? <DetalleEnvasesLote />
                    : activeTab.text === 'Operarios'
                      ? <DetalleOperarioReproceso />
                  //     // ? <div>Hola 3</div>
                      : null
              }
						</div>
		
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardSeleccion;
