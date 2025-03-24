import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../../components/layouts/Subheader/Subheader";
import Tooltip from "../../../../components/ui/Tooltip";
import ModalForm from "../../../../components/ModalForm.modal";
import Container from "../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import { OPTIONS_SL, TSeleccion, TTabsSl } from "../../../../types/TypesSeleccion.type";
import ButtonsSeleccion from "./ButtonsSeleccion";
import { fetchBinsPepaCalibrada, fetchMensajeCierreSeleccion, fetchMensajeTerminoSeleccion, fetchOperariosEnSeleccion, fetchProgramaSeleccion, fetchSubProductosOperarios, fetchTarjasSeleccionadas } from "../../../../redux/slices/seleccionSlice";
import CardDetalleProgramaSeleccion from "./CardFrutaIngresada.chart";
import DetalleTarjaResultanteSeleccion from "./Tarja Resultante/DetalleTarjaResultante";
import DetalleEnvasesLote from "./Bins Lotes Seleccionados/DetalleEnvasesLoteSeleccion";
import DetalleSubProductoOperario from "./Sub Producto Operarios/DetalleSubProductoOperario";
import FormularioRegistroTarjaSeleccion from "../Formularios/RegistroTarjaSeleccion";
import Button from "../../../../components/ui/Button";
import DetalleOperarioSeleccion from "./Operarios Seleccion/DetalleOperarioSeleccion";
import Badge from "../../../../components/ui/Badge";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { fetchWithTokenPatch, fetchWithTokenPut } from "../../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import ModalConfirmacion from "../../../../components/ModalConfirmacion";
import Alert from "../../../../components/ui/Alert";
import { GoQuestion } from "react-icons/go";
import Modal, { ModalBody, ModalHeader } from "../../../../components/ui/Modal";
import Validation from "../../../../components/form/Validation";
import FieldWrap from "../../../../components/form/FieldWrap";
import * as Yup from 'yup';
import Input from "../../../../components/form/Input";
import { useFormik } from "formik";

const DashboardSeleccion = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
	const [activeTab, setActiveTab] = useState<TTabsSl>(OPTIONS_SL.GR);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const programa_seleccion =  useAppSelector((state: RootState) => state.seleccion.programa_seleccion_individual)
  const mensajesSeleccion = useAppSelector((state: RootState) => state.seleccion.mensajeTerminoSeleccion)
  const mensajeCierre = useAppSelector((state: RootState) => state.seleccion.mensajeCierreSeleccion)

  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const estado = programa_seleccion?.estado_programa

  const actualizarEstadoProduccion = async (estado: string) => {
    const requestBody: Record<string, any> = {
      id,
      estado_programa: estado,
      registrado_por: perfil?.id,
    };

		try {
			const token_verificado = await verificarToken(token!)
			if (!token_verificado) throw new Error('Token no valido')
			const response_estado = await fetchWithTokenPatch(`api/seleccion/${id}/`, requestBody, token_verificado)
			if (response_estado.ok){
				const data: TSeleccion = await response_estado.json()
				toast.success(`El programa esta en ${data.estado_programa_label}`)
				dispatch(fetchProgramaSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
			}
		} catch (error) {
      console.log('')
		}
	}

  useEffect(() => {
    dispatch(fetchProgramaSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchTarjasSeleccionadas({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchSubProductosOperarios({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchOperariosEnSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
    dispatch(fetchBinsPepaCalibrada({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    const actualizarEstado = async () => {
      if (confirmacion) {
        await actualizarEstadoProduccion('5');
        setConfirmacion(false);
      }
    };
  
    actualizarEstado();
  
    // Cleanup function to reset confirmacion if the component unmounts
    return () => {
      setConfirmacion(false);
    };
  }, [confirmacion]);

  useEffect(() => {
    if (programa_seleccion && ['0', '1','2', '3 '].includes(programa_seleccion.estado_programa)) {
      dispatch(fetchMensajeTerminoSeleccion({ id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_seleccion])

  useEffect(() => {
    if (programa_seleccion && programa_seleccion.estado_programa === '4') {
      dispatch(fetchMensajeCierreSeleccion({id_programa: id, token, verificar_token: verificarToken}))
    }
  }, [programa_seleccion])

  const validationSchema = Yup.object().shape({
    // fecha_inicio_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable(),
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
        const response = await fetchWithTokenPatch(`api/seleccion/${id}/`, {...values}, token_verificado)
        if (response.ok) {
          actualizarEstadoProduccion('4')
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
				<Subheader className="flex flex-col md:flex-row lg:flex-row">
					<SubheaderLeft className="w-full lg:w-auto mx-auto md:mx-0 lg:mx-0">
						<ButtonsSeleccion activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex gap-2 w-full items-center justify-center'>
              <Badge color='emerald' variant='solid' className='rounded-lg text-white text-xs font-bold animate-pulse'>
                {programa_seleccion?.estado_programa_label}
              </Badge>

               {
                  estado !== '2' && estado! <= '3'
                    ? (
                      <Button
                        variant="solid"
                        color="amber"
                        colorIntensity="600"
                        className="hover:scale-105"
                        onClick={() => actualizarEstadoProduccion('2')}  
                        >
                          <FaPlay style={{ fontSize: 25, color: 'white' }}/>
                      </Button>
                      )
                    : null
                }

                {
                  estado === '2'
                    ? (
                      <Button
                        variant="solid"
                        color="blue"
                        colorIntensity="700"
                        className="hover:scale-105"
                        onClick={() => actualizarEstadoProduccion('3')}  
                        >
                          <FaPause style={{ fontSize: 25, color: 'white' }}/>
                      </Button>
                      )
                    : null
                }

                  {
                    programa_seleccion?.condicion_termino && !['4', '5'].includes(estado!)
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
                            <ModalHeader>¿Estás Seguro de Terminar este Programa de Seleccion?</ModalHeader>
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
                            <ModalHeader>Ingrese Fecha de Termino del Programa de Seleccion</ModalHeader>
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
                          <Button color="red" colorIntensity="600" className="hover:scale-105" variant="solid" title="Terminar Programa"
                            onClick={() => {setOpenModal(true); formik.handleSubmit()}}
                          > <FaStop style={{ fontSize: 25, color: 'white' }}/></Button>
                        </>
                        )
                      : null
                  }

{/* {
                    programa_seleccion?.condicion_cierre && estado === '4'
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
                          title={`¿Estás Seguro de Cerrar este Programa de Selección?`}
                        >
                            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
                              <GoQuestion className='text-9xl text-yellow-500' />
                            </div>
                            <div className='w-full flex items-center justify-between'>
                              <button
                                className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                                onClick={() => {
                                  dispatch(
                                    actualizarEstadoProduccion('5')
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
                  } */}
              </div>
          </SubheaderRight>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full'>
					<div className='grid grid-cols-12 gap-2'>
            <div className="col-span-12 gap-4">
              {
                mensajesSeleccion && programa_seleccion && ['0', '1','2', '3'].includes(programa_seleccion.estado_programa) && (
                  <div className="flex gap-4">
                    <Alert
                     variant="solid"
                     isClosable={true}
                     >
                      {mensajesSeleccion.estado_lotes}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesSeleccion.estado_control_calidad}
                    </Alert>
                    <Alert
                     variant="solid"
                     isClosable={true}>
                      {mensajesSeleccion.estado_operarios}
                    </Alert>
                  </div>
                )
              }
              {
                mensajeCierre && programa_seleccion && programa_seleccion.estado_programa === '4' && (
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
                    <div className='col-span-12 '>
                      <CardDetalleProgramaSeleccion />
                    </div>
                    <div className='row-start-2 col-span-12 mt-2'>
                      {/* <CardFrutaCalibrada 
                        activeTab={activeTab} 
                        programa={programa_seleccion!}
                        //@ts-ignore
                        tarjas_resultantes={tarjas_resultantes!}/> */}
                    </div>
                  </>
                  )
                : null
            }
            </div>
						

						<div className='col-span-12 2xl:col-span-12'>
							{
                activeTab.text === 'Tarjas Resultantes'
                ? <DetalleTarjaResultanteSeleccion />
                  : activeTab.text === 'Envases de Lote Seleccionado'
                    ? <DetalleEnvasesLote />
                    : activeTab.text === 'SubProducto Registrado'
                      ? <DetalleSubProductoOperario />
                      : activeTab.text === 'Operarios Selección'
                        ? <DetalleOperarioSeleccion />
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
