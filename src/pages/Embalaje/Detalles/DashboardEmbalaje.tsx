import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../components/layouts/Subheader/Subheader";
import Container from "../../../components/layouts/Container/Container";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useAuth } from "../../../context/authContext";
import Button from "../../../components/ui/Button"
import Badge from "../../../components/ui/Badge";
import { FaPause, FaPlay, FaStop } from "react-icons/fa";
import { fetchWithTokenPatch } from "../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import { fetchProgramaEmbalajeIndividual } from "../../../redux/slices/embalajeSlice";
import DetalleBinEmbalaje from "./Bins Lotes Seleccionados/DetalleBinesEnEmbalaje";
import CardHeaderGeneral from "./CardHeaderGeneral";
import TablaPalletProductoTerminado from "./TablaPalletProductoTerminado";
import DetalleOperarioEmbalaje from "./Operarios Embalaje/DetalleOperarioEmbalaje";
import ModalForm from "../../../components/ModalForm.modal";
import { useDispatch } from 'react-redux';
import ButtonsEmbalaje, { OPTIONS_EM, TTabsEm } from "./ButtonsEmbalaje";
import ModalConfirmacion from "../../../components/ModalConfirmacion";
import { TEmbalaje } from "../../../types/TypesEmbalaje.type";
import Modal, { ModalBody, ModalHeader } from "../../../components/ui/Modal";
import { GoQuestion } from "react-icons/go";
import FieldWrap from "../../../components/form/FieldWrap";
import Input from "../../../components/form/Input";
import Validation from "../../../components/form/Validation";
import * as Yup from 'yup'
import { useFormik } from "formik";
import { ThunkDispatch } from "@reduxjs/toolkit";


const DashboardEmbalaje = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
	const [activeTab, setActiveTab] = useState<TTabsEm>(OPTIONS_EM.GR);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const programa_embalaje =  useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [confirmacion, setConfirmacion] = useState<boolean>(false)
  const [modalFecha, setModalFecha] = useState<boolean>(false)
  const [openModalCerrar, setOpenModalCerrar] = useState<boolean>(false)


  const actualizarEstadoEmbalaje = async (estado: string) => {

    const requestBody: Record<string, any> = {
      id,
      estado_embalaje: estado,
      registrado_por: perfil?.id,
    };

		try {
			const token_verificado = await verificarToken(token!)
			if (!token_verificado) throw new Error('Token no valido')
			const response_estado = await fetchWithTokenPatch(`api/embalaje/${id}/`, requestBody, token_verificado)
			if (response_estado.ok){
				const data: TEmbalaje = await response_estado.json()
				toast.success(`El programa esta en ${data.estado_embalaje_label}`)
				dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))
			}
		} catch (error) {
      console.log('error')
		}
	}

  useEffect(() => {
    if (id){
    dispatch(fetchProgramaEmbalajeIndividual({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])

  useEffect(() => {
    const actualizarEstado = async () => {
      if (confirmacion) {
        await actualizarEstadoEmbalaje('5');
        setConfirmacion(false);
      }
    };
  
    actualizarEstado();
  
    return () => {
      setConfirmacion(false);
    };
  }, [confirmacion]);

  const estado = programa_embalaje?.estado_embalaje

  const validationSchema = Yup.object().shape({
    // fecha_inicio_proceso: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable(),
    fecha_termino_embalaje: Yup.date().max(new Date().toDateString(), 'Introduzca una Fecha Valida').required('Requerido').nonNullable()
  })

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      // fecha_inicio_proceso: "",
      fecha_termino_embalaje: ""
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
			  if (!token_verificado) throw new Error('Token no valido')
        const response = await fetchWithTokenPatch(`api/embalaje/${id}/`, {...values}, token?.access)
        if (response.ok) {
          actualizarEstadoEmbalaje('4')
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
						<ButtonsEmbalaje activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight>
            <div className='flex flex-col md:flex-row lg:flex-row gap-2 w-full items-center justify-center'>
              <Badge color='emerald' className='bg-green-700 rounded-lg text-white text-xs font-bold animate-pulse p-2'>
                {programa_embalaje?.estado_embalaje_label}
              </Badge>

               {
                  estado === '0' || estado !== '2' && estado! <= '3'
                    ? (
                        <Button
                          title="Iniciar Programa"
                          variant="solid"
                          color='amber'
                          colorIntensity="600"
                          onClick={() => actualizarEstadoEmbalaje('2')}
                          className='hover:scale-105'>
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
                          colorIntensity="600"
                          onClick={() => actualizarEstadoEmbalaje('3')}
                          className='hover:scale-105'>
                          <FaPause style={{ fontSize: 25, color: 'white' }}/>
                        </Button>
                      )
                    : null
                }

                {/* {
                  programa_embalaje?.condicion_termino && !['4', '5'].includes(programa_embalaje.estado_embalaje)
                    ? (
                      <Button
                        variant="solid"
                        color="red"
                        colorIntensity="700"
                        className="hover:scale-105"
                        onClick={() => {
                          actualizarEstadoEmbalaje('4')
                        }}
                        >
                          <FaStop style={{ fontSize: 25, color: 'white' }}/>
                      </Button>
                      )
                    : null
                } */}
                {
                    programa_embalaje?.condicion_termino && !['4', '5'].includes(estado!) && programa_embalaje.kilos_faltantes <= 0
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
                            <ModalHeader>¿Estás Seguro de Terminar este Programa de Embalaje?</ModalHeader>
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
                            <ModalHeader>Ingrese Fecha de Termino del Programa de Embalaje</ModalHeader>
                            <ModalBody>
                              <div className="grid grid-cols-12 w-full gap-4">

                                <div className="col-span-12 md:col-span-12">
                                  <Validation
                                    isValid={formik.isValid}
                                    isTouched={formik.touched.fecha_termino_embalaje ? true : undefined}
                                    invalidFeedback={formik.errors.fecha_termino_embalaje}
                                  >
                                    <FieldWrap>
                                      <Input
                                        type='date'
                                        name='fecha_termino_embalaje'
                                        onChange={formik.handleChange}
                                        className='py-3 text-black'
                                        value={formik.values.fecha_termino_embalaje}
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
                    programa_embalaje?.condicion_cierre && estado === '4'
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
                            <div className='py-10 w-full h-full  flex flex-col justify-center items-center'>
                              <GoQuestion className='text-9xl text-yellow-500' />
                            </div>
                            <div className='w-full flex items-center justify-between'>
                              <button
                                className='w-48 py-3 px-6 rounded-md bg-blue-800 text-white'
                                onClick={() => {
                                  dispatch(
                                    actualizarEstadoEmbalaje('5')
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
            <div className='col-span-12 2xl:col-span-12 gap-2'>
            {
              activeTab.text === 'General'
                ? (
                  <>
                    <div className='col-span-12'>
                      <CardHeaderGeneral />
                    </div>
                  </>
                  )
                : null
            }
            </div>
					
						<div className='col-span-12 2xl:col-span-12'>
							{
                  activeTab.text === 'Bins en Embalaje'
                    ? <DetalleBinEmbalaje />
                    : activeTab.text === 'Operarios Embalaje'
                        ? <DetalleOperarioEmbalaje />
                        : activeTab.text === 'Pallet Producto Terminado' ?
                          <TablaPalletProductoTerminado />
                        : null

              }
						</div>
		
					</div>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DashboardEmbalaje;
