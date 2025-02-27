import { useEffect, useState } from "react";
import useDarkMode from "../../../hooks/useDarkMode";
import { useParams } from "react-router-dom";
import { TLoteGuia } from "../../../types/TypesRecepcionMP.types";
import { tipoFrutaFilter, variedadFilter } from "../../../utils/options.constantes";
import { format } from "@formkit/tempo";
import { Image } from "antd";
import ModalForm from "../../../components/ModalForm.modal";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import ModalConfirmacion from "../../../components/ModalConfirmacion";
import FormularioCCRendimiento from "./Formularios/RegistroControlCalidadRendimiento";
import FormularioCCPepaCalibre from "./Formularios/RegistroControlCalidadCalibracion";
import TablaMuestras from "./Tablas/TablaMuestras";
import { useAuth } from "../../../context/authContext";
import { fetchControlCalidad, fetchFotosControlCalidad, fetchMuestrasControlCalidad } from "../../../redux/slices/controlcalidadSlice";
import { fetchGuiaRecepcion } from "../../../redux/slices/recepcionmp";
import { fetchEnvases } from "../../../redux/slices/envasesSlice";
import Validation from "../../../components/form/Validation";
import FieldWrap from "../../../components/form/FieldWrap";
import Input from "../../../components/form/Input";
import { useFormik } from "formik";
import Button from "../../../components/ui/Button";
import Textarea from "../../../components/form/Textarea";
import { fetchWithTokenPatch } from "../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import Card, { CardBody, CardHeader } from "../../../components/ui/Card";
import Container from "../../../components/layouts/Container/Container";
import { FiLoader } from "react-icons/fi";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import ModalControlCalidad from "../../Recepcion Materia Prima/Modals/ModalControlCalidad";
import { estadoRecepcion } from "../../../utils/generalUtil";
import { FaForward } from "react-icons/fa";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";



const DetalleCC = () => {
  const { id } = useParams()
  const [openModalRegistro, setOpenModalRegistro] = useState<boolean>(false)
  const [openModalCPepaCalibre, setOpenModalCPepaCalibre] = useState<boolean>(false)
  const [openConfirmacion, setOpenConfirmacion] = useState<boolean>(false)
  // const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const [editar, setEditar] = useState<boolean>(false)
  const [registroCC, setRegistroCC] = useState<boolean>(false)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)
  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const fotoscc = useAppSelector((state: RootState) => state.control_calidad.fotos_cc)
  const cc_rendimiento = useAppSelector((state: RootState) => state.control_calidad.cc_muestras)
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)
  const [openModalConfirmacion, setOpenModalConfirmacion] = useState(false)
  const [estadoActivo, setEstadoActivo] = useState<string | null>(null)
  const estadoActivoCoincide = estadoRecepcion.find((estado) => estado.value === (guia_recepcion?.estado_recepcion! ? guia_recepcion.estado_recepcion! : '1'))
  const [lote, setLote] = useState<TLoteGuia | undefined>()
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)

  useEffect(() => {
    if (!openModalConfirmacion) {
      dispatch(fetchControlCalidad({ id, token, verificar_token: verificarToken }))
    }
  }, [openModalConfirmacion])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchControlCalidad({ id, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (control_calidad){
      //@ts-ignore
      dispatch(fetchGuiaRecepcion({ id: control_calidad?.guia_recepcion, token, verificar_token: verificarToken }))
    }
  }, [control_calidad])

  useEffect(() => {
    if (envases.length < 1){
      //@ts-ignore
      dispatch(fetchEnvases({ token, verificar_token: verificarToken }))
    }
  }, [envases])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchFotosControlCalidad({ id, token, verificar_token: verificarToken }))
  }, [guia_recepcion])

  // useEffect(() => {
  //   //@ts-ignore
  //   dispatch(fetchFotosControlCalidad({ id, token, verificar_token: verificarToken }))
  // }, [])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchMuestrasControlCalidad({ id, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (control_calidad && guia_recepcion) {
      setLote(guia_recepcion.lotesrecepcionmp.find(element => element.id === control_calidad.recepcionmp))
    }
  }, [control_calidad, guia_recepcion])


  const kilos_fruta = guia_recepcion?.lotesrecepcionmp.map((row: TLoteGuia) => {
    const kilos_total_envases = 
      row.envases.map((envase_lote) => {
      const envaseTotal = envases?.
      filter(envase => envase.id === envase_lote.envase).
      reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0)
      return envaseTotal;
      }).reduce((acumulador, pesoTotal) => acumulador! + pesoTotal!, 0)
    return row.kilos_brutos_1 + row.kilos_brutos_2 - row?.kilos_tara_1 - row?.kilos_tara_2 - kilos_total_envases!;
  })?.shift()


  const variedad = guia_recepcion?.lotesrecepcionmp.flatMap((row: TLoteGuia) => {
    const variedad_row = row.envases.map((envase) => {
        const variedd = variedadFilter.find(variedad => variedad.value === envase.variedad);
        return variedd?.label
        });
        return variedad_row;
    })

  const variedadSinRepetir = [...new Set(variedad)].join(', ');


  const tipo_producto = guia_recepcion?.lotesrecepcionmp.flatMap((row: TLoteGuia) => {
    const variedad_row = row.envases.map((envase) => {
        const producto = tipoFrutaFilter.find(producto => producto.value === envase.tipo_producto);
        return producto?.label;
        });
        return variedad_row;
    })?.shift()


  const muestra = [...(cc_rendimiento || [])];
  const contra_muestras_limit = cc_rendimiento?.filter((cc: any) => cc.es_contramuestra === true).length
  const contra_muestra_ok = cc_rendimiento?.some((cc: any) => cc.cc_ok === true && cc.es_contramuestra === true)
  const contra_muestra_calibre_ok = cc_rendimiento?.some((cc: any) => cc.cc_calibrespepaok === true && cc.es_contramuestra === true)

  const muestra_calibre_ok = muestra?.some((cc: any) => cc.cc_calibrespepaok === true)
  const muestra_ok = muestra?.some((cc: any) => cc.cc_ok === true)

  const formik = useFormik({
    initialValues: {
      humedad: '',
      observaciones: ''
    },
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

        const response = await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${id}/`,
          { ...values },
          token_verificado
        )

        if (response.ok){
          toast.success('Se ha actualizador correctamente')
          const data = await response.json()
          //@ts-ignore
          dispatch(fetchControlCalidad({ id: data?.id, token, verificar_token: verificarToken }))
          setEditar(false)
        } else if (response.status === 400) {
          toast.error(`No se pudo actualizar el control de calidad N° ${id}`)
        }
      } catch (error) {
        
      }
    }
  })

  useEffect(() => {
    formik.setValues({
      humedad: control_calidad?.humedad!,
      observaciones: control_calidad?.observaciones!
    })
  }, [control_calidad])


  

  return (
    <Container breakpoint={null} className="w-full h-full">
      <Card>
        <CardHeader>
          <div className={`w-full flex items-center justify-center rounded-md py-5`}>
            <h1 className='text-3xl'>Detalle Control De Calidad Materia Prima Lote N° {control_calidad?.numero_lote}</h1>
          </div>
        </CardHeader>
        <CardBody className="flex flex-col gap-y-2">
          <article className={`w-full h-[80%] py-2 px-4 flex flex-col md:flex-row lg:flex-row justify-between gap-20 row-span-2`}>
            <div className='sm:w-full md:5/12 lg:5/12 h-full flex flex-col rounded-md'>
              <div className={`border dark:border-zinc-700 rounded-md py-3 flex items-center px-2`}>
                <span className='font-semibold text-lg'><span className='mr-4'>Productor:</span> {control_calidad?.productor} </span>
              </div>
              <div className={`border dark:border-zinc-700 rounded-md py-3 flex items-center px-2`}>
                <span className='font-semibold text-lg'><span className='mr-4'>Estado CDC:</span> {control_calidad?.estado_cc_label}</span>
              </div>
              <div className='rounded-md h-full flex items-center px-2'>
                {/* <span className='font-semibold text-lg'><span className='mr-4'>Estado Actual:</span> {control_calidad?.estado_cc_label}</span> */}
              </div>
            </div>

            <div className='sm:w-full md:5/12 lg:5/12 h-full flex flex-col rounded-md'>
              <div className={`border dark:border-zinc-700 rounded-md h-full py-3 flex items-center px-2`}>
                <span className='font-semibold text-lg' ><span>Fecha Creación: </span> {format(control_calidad?.fecha_creacion!, {date: 'long', time: 'short'}, 'es')}</span>
              </div>
              <div className={`border dark:border-zinc-700 rounded-md h-full py-3 flex items-center px-2`}>
                <span className='font-semibold text-lg' ><span>Última modificación: </span> {format(control_calidad?.fecha_modificacion!, {date: 'long', time: 'short'}, 'es')}</span>
                
              </div>
              <div className={`border dark:border-zinc-700 rounded-md h-full py-3 flex items-center px-2`}>
                <span className='font-semibold text-lg'><span className='mr-4'>Registrado Por:</span>{control_calidad?.registrado_por_label}</span> 
              </div>
            </div>
          </article>

          <article className={`w-full h-full  flex flex-col justify-between gap-5 px-4 py-2 row-span-3`}>
            <div className='flex lg:flex-row md:flex-row flex-col gap-5'>

              <div className={`w-full h-full border dark:border-zinc-700 p-2 flex flex-col gap-5 rounded-md`}>

                <span className='text-xl h-12'>Información lote</span>
                <div className='h-full'>
                  <label htmlFor="rut_productor">Kilos Fruta: </label>
                  <div className={`dark:bg-zinc-700 bg-zinc-100  p-2 flex items-center h-12 rounded-md`}>
                    <span className='text-xl'>{control_calidad?.estado_guia === '4' ? `${kilos_fruta} kgs` : 'Falta terminar la recepcion'}</span>
                  </div>
                </div>
                
                <div className='h-full'>
                  <label htmlFor="rut_productor">Variedades: </label>
                  <div className={`dark:bg-zinc-700 bg-[#F4F4F5]  p-2 flex items-center h-12 rounded-md`}>
                    <span className='text-xl'>{variedadSinRepetir}</span>
                  </div>
                </div>

                <div className='h-full'>
                  <label htmlFor="rut_productor">Tipo Producto: </label>
                  <div className={`dark:bg-zinc-700 bg-[#F4F4F5]  p-2 flex items-center h-12 rounded-md`}>
                    <span className='text-xl'>{tipo_producto}</span>
                  </div>
                </div>

              </div>

              <div className={`w-full h-full py-3 border dark:border-zinc-700 px-2 flex flex-col gap-5 rounded-md `}>
                <span className='text-lg h-10'>Información Inspección Visual por Control de Calidad</span>
                <div className='w-full flex justify-between py-2'>
                  <div className='w-full h-10 flex'>
                    {/* {
                      guia_recepcion && guia_recepcion.estado_recepcion == '2' && id && control_calidad?.estado_cc === '2' ? (
                        <>
                          { hasGroup(['controlcalidad']) ?
                            <ModalForm
                              open={openModalConfirmacion}
                              setOpen={setOpenModalConfirmacion}
                              title={'Registrar Control de Calidad'}
                              textTool='Accion'
                              variant='solid'
                              color='emerald'
                              colorIntensity='600'
                              size={450}
                              width={`w-20 h-16 md:h-16 lg:h-11 text-white hover:scale-105`}
                              icon={
                                <div>Registrar CC</div>
                              }
                            >
                              <ModalControlCalidad
                                id={Number(id)}
                                estadoActivo={setEstadoActivo!}
                                setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} lote={guia_recepcion.lotesrecepcionmp.find(element => element.id === Number(id))} guia_id={guia_recepcion.id} id_lote={0} usuario={undefined} />
                            </ModalForm>
                          : null }
                        </>
                      ) : null
                    } */}
                    { guia_recepcion && guia_recepcion.estado_recepcion <= '3' && hasGroup(['controlcalidad']) && id && control_calidad && control_calidad.estado_cc === '2'
                    ? (
                      <>
                        {
                          <ModalForm
                            open={openModalConfirmacion}
                            setOpen={setOpenModalConfirmacion}
                            title={'Registrar Control de Calidad'}
                            textTool='Accion'
                            variant='solid'
                            color='emerald'
                            colorIntensity='600'
                            size={450}
                            width={`w-20 h-16 md:h-16 lg:h-11 text-white hover:scale-105`}
                            icon={<>
                              {
                                guia_recepcion.estado_recepcion === '1'
                                  ? <FaForward className='text-3xl'/>
                                  : guia_recepcion.estado_recepcion === '2'
                                    ? <HiOutlineClipboardDocumentList className='text-3xl' />
                                    : null
                              }
                            </>}
                          >
                            {
                              hasGroup(['controlcalidad'])
                                ?
                                  <>
                                    {
                                      guia_recepcion?.estado_recepcion! <= '3'
                                        ? <ModalControlCalidad 
                                            id={guia_recepcion?.id!}
                                            estadoActivo={setEstadoActivo!}
                                
                                            // @ts-ignores
                                            setOpen={setOpenModalConfirmacion!} numero_estado={`${estadoActivoCoincide?.value}`} lote={guia_recepcion.lotesrecepcionmp.find(element => element.id === Number(id))} guia_id={guia_recepcion.id} id_lote={0} usuario={undefined} />
                                        : null

                                    }
                                  </> 
                                : null
                            }
                          </ModalForm>
                        }
                      </>
                      ) : null
                    }
                  </div>
                </div>
                
                <div className='h-full'>
                  <label htmlFor="humedad">Humedad: </label>
                
                  <div className={`dark:bg-zinc-700 bg-[#F4F4F5] p-2 flex items-center justify-center h-12 rounded-md`}>
                    <span className='text-xl'>{control_calidad?.humedad} %</span>
                  </div>
                  
                </div>
                <div className='h-full'>
                  <label htmlFor="observaciones">Observaciones: </label>
                  {
                    editar
                      ? (
                        <Validation
                          isValid={formik.isValid}
                          isTouched={formik.touched.observaciones ? true : undefined}
                          invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                          >
                          <FieldWrap>
                            <Textarea 
                              name='observaciones'
                              onChange={formik.handleChange}
                              value={formik.values.observaciones}
                              className='py- dark:!bg-zinc-700'
                              rows={2}
                            />
                          </FieldWrap>
                        </Validation>
                        )
                      : (
                        <div className={`dark:bg-zinc-700 bg-[#F4F4F5]  p-2 flex h-16 rounded-md`}>
                          <span className='text-lg'>{control_calidad?.observaciones}</span>
                        </div>
                        )
                  }
                </div>
                <div className='w-full h-10 flex justify-end gap-4'>
                    {
                      editar
                        ? (
                          <>
                            <Button
                              variant='solid'
                              size='lg'
                              className='px-14'
                              color="emerald"
                              colorIntensity="700"
                              onClick={() => {
                                formik.handleSubmit()
                              }}
                              >
                                Guardar
                            </Button>
                            <Button
                              variant='solid'
                              size='lg'
                              color="red"
                              colorIntensity="700"
                              onClick={() => setEditar(false)}
                              >
                                Cancelar
                            </Button>
                          </>
                          )
                        : null
                    }
                    {
                      !editar && guia_recepcion && guia_recepcion.estado_recepcion != '2'
                        ? (
                          <Button
                            variant='solid'
                            size='lg'
                            color="blue"
                            colorIntensity="700"
                            onClick={() => setEditar(true)}
                            >
                              Editar Observación
                          </Button>
                        )
                        : null
                    }
                  </div>
              </div>
              <div className={`w-full h-full border dark:border-zinc-700 p-3 flex flex-col gap-5 rounded-md`}>
                <span className='text-lg h-full'>Imagenes</span>
        
                <div className='h-full flex flex-col gap-y-12'>
                  <div className='flex justify-between items-center'>
                    <label htmlFor="rut_productor">Fotos Control Calidad: </label>
                    <span>Fotos registradas {fotoscc?.length}</span>
                  </div>
                  <div className='flex items-center justify-center h-full'>
                    <Image.PreviewGroup
                        items={
                          fotoscc?.flatMap(fotos => fotos.imagen)
                        }
                      >
                        <Image
                            width={200}
                            height={170}
                            src={fotoscc?.flatMap(fotos => fotos.imagen)[0]}
                          />
                      </Image.PreviewGroup>
                  </div>
                </div>

              </div>
              
            </div>
          </article>

          <article className={`w-full h-full  dark:border-zinc-700 flex flex-col gap-2 `}>
            <div className='flex items-center justify-between px-8'>
              <div className='w-72'>
                {
                  cc_rendimiento?.length! >= 0 && control_calidad?.esta_contramuestra === '0' && ('controlcalidad' in userGroup?.groups!) && !cc_rendimiento?.some(muestra => muestra?.cc_calibrespepaok === true) && control_calidad.estado_cc != '2' && lote && (lote.estado_recepcion === '5' || lote.estado_recepcion === '6') && comercializador == "Prodalmen"
                    ? (
                        <ModalForm
                          open={openModalRegistro}
                          setOpen={setOpenModalRegistro}
                          title={`Muestra Control de Rendimiento del Lote N° ${control_calidad?.numero_lote}`}
                          textTool='Agregar Muestra'
                          size={900}
                          variant="solid"
                          width={`w-full px-1 h-12 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd]bg-[#3B82F6] text-white'} hover:scale-105`}
                          textButton='Agregar Muestra'
                        >
                          <FormularioCCRendimiento id_lote={control_calidad?.id!} isOpen={setOpenModalRegistro} control_calidad={control_calidad!}/>
                        </ModalForm>
                      )
                    : control_calidad?.esta_contramuestra === '1' &&  contra_muestras_limit! < 1 && comercializador == "Prodalmen"
                        ? (
                          <ModalForm
                            open={openModalRegistro}
                            setOpen={setOpenModalRegistro}
                            title={`Contra Muestra Control de Rendimiento del Lote N° ${control_calidad?.numero_lote} `}
                            textTool='Contra Muestra'
                            size={900}
                            variant="solid"
                            width={`w-full px-1 h-12 dark:bg-orange-700 hover:bg-orange-600 bg-orange-700 text-white hover:scale-105 border-none`}
                            textButton='Agregar Contra Muestra'
                          >
                            <FormularioCCRendimiento id_lote={control_calidad?.id!} isOpen={setOpenModalRegistro} control_calidad={control_calidad!}/>
                          </ModalForm>
                          )
                        : null
                }
                
              </div>


              {
                cc_rendimiento?.length! >= 2 &&  control_calidad?.esta_contramuestra === '0'  && cc_rendimiento?.every(cc => cc.cc_ok === true) && !cc_rendimiento.some(cc => cc.cc_calibrespepaok === true)
                  ? (
                    <div className='w-72'>
                      <ModalForm
                        open={openModalCPepaCalibre}
                        setOpen={setOpenModalCPepaCalibre}
                        title={`Calibración de muestras del Lote N° ${control_calidad?.numero_lote}`}
                        textTool='CC Pepas Muestras'
                        size={800}
                        variant="solid"
                        width={`w-full px-1 h-12 dark:bg-[#3B82F6] hover:bg-[#3b83f6cd] bg-[#3B82F6] text-white hover:scale-105 border-none`}
                        textButton='Calibrar Muestras'
                      >
                        <ModalConfirmacion 
                          formulario={<FormularioCCPepaCalibre  
                            isOpen={setOpenModalCPepaCalibre}
                            //@ts-ignore 
                            control_calidad={control_calidad!}/>}
                          mensaje='¿Estas seguro de querer calibrar las muestras?'
                          confirmacion={openConfirmacion}
                          setConfirmacion={setOpenConfirmacion}
                          setOpen={setOpenModalCPepaCalibre} 
                          />
                      </ModalForm>
                    </div>
                  )
                  : null
              }

              {
                control_calidad?.esta_contramuestra === '1' && contra_muestras_limit! > 0 && contra_muestra_ok && !contra_muestra_calibre_ok
                ?  (
                  <div className='w-72 h-12'>
                    <ModalForm
                      open={openModalCPepaCalibre}
                      setOpen={setOpenModalCPepaCalibre}
                      title={`Muestra Control de Rendimiento`}
                      textTool='CC Pepas Muestras'
                      size={800}
                      variant="solid"
                      width={`w-full px-1 h-12 dark:bg-orange-600 hover:bg-orange-500bg-orange-600 text-white'} hover:scale-105 border-none`}
                      textButton='Calibrar Contra Muestra'
                    >
                      <ModalConfirmacion 
                        formulario={<FormularioCCPepaCalibre  isOpen={setOpenModalCPepaCalibre}/>}
                        mensaje='¿Estas seguro de querer calibrar las muestras?'
                        confirmacion={openConfirmacion}
                        setConfirmacion={setOpenConfirmacion}
                        setOpen={setOpenModalCPepaCalibre}
                        />
                    </ModalForm>
                  </div>
                )
                : null
              }
            </div>

            <div className='flex items-center justify-center gap-2'>
              {
                !muestra_ok || !muestra_calibre_ok
                  ? (
                    <div className='flex items-center gap-2 border border-red-500 bg-red-100 text-red-800 p-2 rounded-md'>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22c5.421 0 10-4.579 10-10S17.421 2 12 2 2 6.579 2 12s4.579 10 10 10zm0-18c4.411 0 8 3.589 8 8s-3.589 8-8 8-8-3.589-8-8 3.589-8 8-8zm-.5 5v6h1v-6h-1zm0 8v1h1v-1h-1z"/>
                      </svg>
                      <span>El muestreo no se ha completado</span>
                    </div>
                  )
                  : null
              }
            </div>

              { control_calidad && control_calidad.estado_cc != '2' &&
                <TablaMuestras id_lote={control_calidad?.id!}/>
              }
          </article>
        </CardBody>
      </Card>
    </Container>

  )
}

export default DetalleCC
