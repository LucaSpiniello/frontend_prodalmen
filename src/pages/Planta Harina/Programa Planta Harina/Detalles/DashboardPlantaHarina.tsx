import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import Container from "../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import Button from "../../../../components/ui/Button"
import Badge from "../../../../components/ui/Badge";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import DetalleOperarioEmbalaje from "./Operarios Planta Harina/DetalleOperarioPlantaHarina";
import ModalForm from "../../../../components/ModalForm.modal";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ButtonsPlantaHarina, { OPTIONS_PH, TTabsPH } from "./ButtonsSeleccion";
import { actualizar_planta_harina, fetchBinEnPlantaHarina, fetchBinsResultantePlantaHarina, fetchMensajeCierreProgramaPH, fetchMensajeTerminoProgramaPH, fetchMetricasRechazosPlantaHarina, fetchOperariosPlantaHarina, fetchProgramaPlantaHarina, fetchRechazosPlantaHarina, fetchVariablePlantaHarina } from "../../../../redux/slices/plantaHarinaSlice";
import CardHeaderGeneral from "./CardHeaderGeneral";
import DetalleBinsParaPlantaHarina from "./Bins Para Planta Harina/DetalleBinsPlantaHarina";
import DetalleOperarioPlantaHarina from "./Operarios Planta Harina/DetalleOperarioPlantaHarina";
import DetalleBinResultantePlantaHarina from "./Bins Resultantes Planta Harina/DetalleBinResultantePlantaHarina";
import DetalleRechazosPlantaHarina from "./Rechazo/DetalleRechazosPlantaHarina";
import DetalleVariables from "./Variables/DetalleVariables";
import FormularioRegistroProgramaPlantaHarina from "../Formularios/FormularioRegistroProgramaPlantaHarina";
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import { GoQuestion } from "react-icons/go";
import Validation from "../../../../components/form/Validation";
import FieldWrap from "../../../../components/form/FieldWrap";
import Input from "../../../../components/form/Input";
import { useFormik } from "formik";
import * as Yup from 'yup'
import toast from "react-hot-toast";
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils";
import Alert from "../../../../components/ui/Alert";


const DashboardPlantaHarina = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { pathname } = useLocation()
  const { verificarToken } = useAuth()
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
	const [activeTab, setActiveTab] = useState<TTabsPH>(OPTIONS_PH.GN);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const navigate = useNavigate()
  const programa_planta_harina =  useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const mensajesPrograma = useAppSelector((state: RootState) => state.planta_harina.mensajeTerminoProgramaPH)
  const mensajeCierre = useAppSelector((state: RootState) => state.planta_harina.mensajeCierreProgramaPH)

  useEffect(() => {
    if (id){
    dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])
  
  useEffect(() => {
    if (programa_planta_harina && ['1','2', '3'].includes(programa_planta_harina.estado_programa)) {
      dispatch(fetchMensajeTerminoProgramaPH({ id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_planta_harina])

  useEffect(() => {
    if (programa_planta_harina && programa_planta_harina.estado_programa === '5') {
      dispatch(fetchMensajeCierreProgramaPH({id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_planta_harina])

  useEffect(() => {
    if (confirmacion){
      dispatch(actualizar_planta_harina({
         id: parseInt(id!), 
         params: { 
          estado: '5',
          tipo_boton: 'cierre',
          perfil: perfil,
          detalle: true
         } ,
         token, 
         verificar_token: verificarToken  
        }))
    }

    return () => {}
  }, [confirmacion])

  const estado = programa_planta_harina?.estado_programa

  const validationSchema = Yup.object().shape({
    fecha_termino_programa: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable()
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // fecha_inicio_proceso: "",
      fecha_termino_programa: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
			  if (!token_verificado) throw new Error('Token no valido')
        const response = await fetchWithTokenPatch(`api/programas/${id}/`, {...values}, token?.access)
        if (response.ok) {
          dispatch(
            actualizar_planta_harina({
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
                {programa_planta_harina?.estado_programa_label}
              </Badge>
                
               {
                  estado === '1' && programa_planta_harina && programa_planta_harina.condicion_inicio 
                    ? (
                        <Button
                          title="Iniciar Programa"
                          variant="solid"
                          color='amber'
                          onClick={() => {
                            dispatch(actualizar_planta_harina({
                               id: parseInt(id!),
                               params: {
                                estado: '2',
                                tipo_boton: 'inicio',
                                fecha_registrada: programa_planta_harina?.fecha_inicio_programa,
                                perfil: perfil,
                                detalle: true
                                },
                               token, 
                               verificar_token: verificarToken  }))
                          }} 
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
                              actualizar_planta_harina({ 
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
                
                {/* {
                programa_planta_harina?.condicion_termino && estado! != '5' && estado != '4'
                  ? (
                    <Button
                      title="Terminar Programa"
                      variant="solid"
                      color="red"
                      colorIntensity="700"
                      onClick={() => 
                        dispatch(
                          actualizar_planta_harina({ 
                            id: parseInt(id!),
                            params: { 
                                estado: '5',
                                perfil: perfil,
                                detalle: true
                             },
                            token, 
                            verificar_token: verificarToken  
                          }))} 
                      className='w-16 rounded-md flex items-center justify-center p-2 hover:scale-105'>
                      <FaStop style={{ fontSize: 25, color: 'white' }}/>
                    </Button>
                  )
                  : null
                } */}
                {
                    programa_planta_harina?.condicion_termino && !['4', '5'].includes(estado!)
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
                                <div className="col-span-12 md:col-span-12">
                                  <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.fecha_termino_programa ? true : undefined}
                                    invalidFeedback={formik.errors.fecha_termino_programa}
                                  >
                                    <FieldWrap>
                                      <Input
                                        type='date'
                                        name='fecha_termino_programa'
                                        onChange={formik.handleChange}
                                        className='py-3 text-black'
                                        value={formik.values.fecha_termino_programa}
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
{/* 
                {
                estado === '4' && programa_planta_harina?.condicion_cierre
                  ? (
                    <ModalForm
                      open={openModal}
                      setOpen={setOpenModal}
                      textTool='Cerrar Proceso'
                      variant="solid"
                      color="red"
                      colorIntensity="700"
                      width="hover:scale-105"
                      textButton={`Cerrar Proceso`}
                    >
                      <ModalConfirmacion
                        mensaje='¿Estas Seguro de Cerrar Programa Planta Harina?'
                        confirmacion={confirmacion}
                        setConfirmacion={setConfirmacion}
                        setOpen={setOpenModal} 
                        />
                    </ModalForm>
                  )
                  : null
                } */}
                {
                    programa_planta_harina?.condicion_cierre && estado === '5'
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
                                    actualizar_planta_harina({
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
                mensajesPrograma && programa_planta_harina && ['1','2', '3'].includes(programa_planta_harina.estado_programa) && (
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
                mensajeCierre && programa_planta_harina && programa_planta_harina.estado_programa === '5' && (
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
                    ?  <DetalleBinsParaPlantaHarina />
                    : activeTab.text === 'Operarios Planta Harina'
                        ? <DetalleOperarioPlantaHarina />
                        : activeTab.text === 'Variables'
                            ? <DetalleVariables />
                            : activeTab.text === 'Rechazo'
                              ? <DetalleRechazosPlantaHarina />
                              : activeTab.text === 'Bin Resultante' 
                                ?  <DetalleBinResultantePlantaHarina />
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
