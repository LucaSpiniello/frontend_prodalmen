import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import Container from "../../../../components/layouts/Container/Container";
import { useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import Button from "../../../../components/ui/Button"
import Badge from "../../../../components/ui/Badge";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import ModalForm from "../../../../components/ModalForm.modal";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ButtonsPlantaHarina, { OPTIONS_PH, TTabsPH } from "./ButtonsProcesoPlantaHarina";
import CardHeaderGeneral from "./CardHeaderGeneral";
import DetalleBinsParaProcesoPlantaHarina from "./Bins Para Proceso Planta Harina/DetalleBinsPlantaHarina";
import DetalleOperarioProcesoPlantaHarina from "./Operarios Planta Harina/DetalleOperarioProcesoPlantaHarina";
import DetalleBinResultanteProcesoPlantaHarina from "./Bins Resultantes Proceso Planta Harina/DetalleBinResultanteProcesoPlantaHarina";
import DetalleRechazosProcesoPlantaHarina from "./Rechazo/DetalleRechazosProcesoPlantaHarina";
import { actualizar_proceso_planta_harina, fetchMensajeCierreProcesoPH, fetchMensajeTerminoProcesoPH, fetchProcesoPlantaHarina } from "../../../../redux/slices/procesoPlantaHarina";
import DetalleVariablesProcesoPlantaHarina from "./Variables/DetalleVariables";
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from 'yup'
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils";
import { GoQuestion } from "react-icons/go";
import FieldWrap from "../../../../components/form/FieldWrap";
import Validation from "../../../../components/form/Validation";
import Modal, { ModalHeader, ModalBody } from "../../../../components/ui/Modal";
import Input from "../../../../components/form/Input";
import Alert from "../../../../components/ui/Alert";


const DashboardPlantaHarina = () => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
	const [activeTab, setActiveTab] = useState<TTabsPH>(OPTIONS_PH.GN);
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const proceso_planta_harina =  useAppSelector((state: RootState) => state.proceso_planta_harina.proceso_planta_harina)
  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const mensajesPrograma = useAppSelector((state: RootState) => state.proceso_planta_harina.mensajeTerminoProcesoPH)
  const mensajeCierre = useAppSelector((state: RootState) => state.proceso_planta_harina.mensajeCierreProcesoPH)

  useEffect(() => {
    if (proceso_planta_harina && ['1','2', '3'].includes(proceso_planta_harina.estado_proceso)) {
      dispatch(fetchMensajeTerminoProcesoPH({ id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [proceso_planta_harina])

  useEffect(() => {
    if (proceso_planta_harina && proceso_planta_harina.estado_proceso === '5') {
      dispatch(fetchMensajeCierreProcesoPH({id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [proceso_planta_harina])

  useEffect(() => {
    if (id){
    dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  const estado = proceso_planta_harina?.estado_proceso

  useEffect(() => {
    if (confirmacion){
      dispatch(actualizar_proceso_planta_harina({
         id: parseInt(id!), 
         params: { 
          estado: '4',
          tipo_boton: 'cierre',
          perfil: perfil,
          detalle: true
         },
         token, 
         verificar_token: verificarToken  
        }))
    }

    return () => {}
  }, [confirmacion])

  const validationSchema = Yup.object().shape({
    fecha_termino_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable()
  })

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
        const response = await fetchWithTokenPatch(`api/procesos/${id}/`, {...values}, token?.access)
        if (response.ok) {
          dispatch(
            actualizar_proceso_planta_harina({
              id: parseInt(id!), 
              params: { 
                estado: '5',
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
			<PageWrapper name='Detalle Programa Selección'>
				<Subheader>
					<SubheaderLeft>
						<ButtonsPlantaHarina activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-2 w-full items-center justify-center'>
              <Badge color='emerald' className='bg-green-700 rounded-lg text-white text-xs font-bold animate-pulse p-2'>
                {proceso_planta_harina?.estado_proceso_label}
              </Badge>


               {
                  estado === '0' && proceso_planta_harina && proceso_planta_harina.condicion_inicio || estado !== '2' && estado! <= '3' && proceso_planta_harina && proceso_planta_harina.condicion_inicio
                    ? (
                        <Button
                          title="Iniciar Programa"
                          variant="solid"
                          color='amber'
                          // onClick={() => actualizaEstadoEmbalaje('2')}
                          onClick={() => 
                            dispatch(
                              actualizar_proceso_planta_harina({
                                id: parseInt(id!),
                                params: {
                                  estado: '2',
                                  tipo_boton: 'inicio',
                                  fecha_registrada: proceso_planta_harina?.fecha_inicio_programa,
                                  perfil: perfil,
                                  detalle: true
                                  },
                                token, 
                                verificar_token: verificarToken  
                            }))} 
                          className='w-16 rounded-md flex items-center justify-center p-2 hover:scale-105'>
                          <FaPlay style={{ fontSize: 25, color: 'white' }}/>
                        </Button>
                      )
                    : null
                }

                {
                  estado === '2'
                    ? (
                        <Button
                          title="Pausar Programa"
                          variant="solid"
                          color="sky"
                          onClick={() => 
                            dispatch(
                              actualizar_proceso_planta_harina({ 
                                id: parseInt(id!),  
                                params: { 
                                  estado: '3',
                                  perfil: perfil,
                                  detalle: true,
                                 },
                                token, 
                                verificar_token: verificarToken  
                              }))} 
                          className='w-16 rounded-md flex items-center justify-center p-2 hover:scale-105'>
                          <FaPause style={{ fontSize: 25, color: 'white' }}/>
                        </Button>
                      )
                    : null
                }

{
                    proceso_planta_harina?.condicion_termino && !['4', '5'].includes(estado!)
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
                            <ModalHeader>¿Estás Seguro de Terminar este Proceso de PH?</ModalHeader>
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
                            <ModalHeader>Ingrese Fecha de Termino del Proceso</ModalHeader>
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
                                  <Button variant="solid" onClick={() => {formik.handleSubmit()}}>Terminar Proceso</Button>
                                  <Button variant="solid" color="red" colorIntensity="600" onClick={() => {setModalFecha(false); formik.resetForm()}}>Cancelar</Button>
                                </div>
                              </div>
                            </ModalBody>
                          </Modal>
                          <Button color="red" colorIntensity="600" className="hover:scale-105" variant="solid" title="Terminar Proceso"
                            onClick={() => {setOpenModal(true); formik.handleSubmit()}}
                          > <FaStop style={{ fontSize: 25, color: 'white' }}/></Button>
                        </>
                        )
                      : null
                  }

{
                    proceso_planta_harina?.condicion_cierre && estado === '5'
                      ? (
                        <ModalForm
                          open={openModalCerrar}
                          setOpen={setOpenModalCerrar}
                          textTool='Cerrar Proceso'
                          variant="solid"
                          color="red"
                          colorIntensity="700"
                          width="hover:scale-105"
                          textButton={`Cerrar Proceso`}
                          title={`¿Estás Seguro de Cerrar este Proceso de PH?`}
                        >
                            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
                              <GoQuestion className='text-9xl text-yellow-500' />
                            </div>
                            <div className='w-full flex items-center justify-between'>
                              <button
                                className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                                onClick={() => {
                                  dispatch(
                                    actualizar_proceso_planta_harina({
                                      id: parseInt(id!), 
                                      params: { 
                                        estado: '4',
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
          </SubheaderRight>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full'>
					<div className='grid grid-cols-12 gap-2'>
            <div className="col-span-12 gap-4">
              {
                mensajesPrograma && proceso_planta_harina && ['1','2', '3'].includes(proceso_planta_harina.estado_proceso) && (
                  <div className="flex gap-4">
                    <Alert
                     variant="solid"
                     isClosable={true}
                     >
                      {mensajesPrograma.estado_lotes}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesPrograma.estado_control_calidad}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesPrograma.estado_operarios}
                    </Alert>
                  </div>
                )
              }
              {
                mensajeCierre && proceso_planta_harina && proceso_planta_harina.estado_proceso === '5' && (
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
                    <div className='col-span-12'>
                      <CardHeaderGeneral />
                    </div>
                    <div className='row-start-2 col-span-12 mt-2'>
                      {/* <TablaPalletProductoTerminado /> */}
                    </div>
                  </>
                  )
                : null
            }
            </div>
					
						<div className='col-span-12 2xl:col-span-12'>
							{
                  activeTab.text === 'Bins Para Procesar'
                    ?  <DetalleBinsParaProcesoPlantaHarina />
                    : activeTab.text === 'Operarios Planta Harina'
                        ? <DetalleOperarioProcesoPlantaHarina />
                        : activeTab.text === 'Variables'
                            ? <DetalleVariablesProcesoPlantaHarina />
                            : activeTab.text === 'Rechazo'
                              ? <DetalleRechazosProcesoPlantaHarina />
                              : activeTab.text === 'Bin Resultante' 
                                ?  <DetalleBinResultanteProcesoPlantaHarina />
                                : null
              }
						</div>
		
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardPlantaHarina;
