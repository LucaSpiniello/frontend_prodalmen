import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useAuth } from "../../../context/authContext";
import Subheader, { SubheaderLeft, SubheaderRight } from "../../../components/layouts/Subheader/Subheader";
import ButtonsDetailOp from "./OperariosButtonsNav";
import Container from "../../../components/layouts/Container/Container";
import Label from "../../../components/form/Label";
import Validation from "../../../components/form/Validation";
import FieldWrap from "../../../components/form/FieldWrap";
import SelectReact, { TSelectOptions } from "../../../components/form/SelectReact";
import { useFormik } from "formik";
import { RootState } from "../../../redux/store";
import { OPTIONS, TTabsOp } from "../../../types/TabsDetalleOperario";
import useDarkMode from "../../../hooks/useDarkMode";
import { ACTIVO, TIPOS_OPERARIO } from "../../../utils/constante";
import Input from "../../../components/form/Input";
import Button from "../../../components/ui/Button";
import { HeroXCircle } from "../../../components/icon/heroicons";
import { TSkill } from "../../../types/TypesRegistros.types";
import { agregarSkills, editOperario, fetchOperario } from "../../../redux/slices/operarioSlice";
import { fetchWithTokenPost } from "../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaSkills from "./TablaSkills";
import Card, { CardBody, CardHeader } from "../../../components/ui/Card";


interface IDetalleOperarioProps {
  id: number
  setOpen: Dispatch<SetStateAction<boolean>>
}

const DetalleOperario: FC<IDetalleOperarioProps> = ({ id }) => {
	const [activeTab, setActiveTab] = useState<TTabsOp>(OPTIONS.IO);
  const operario = useAppSelector((state: RootState) => state.operarios.operario)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const [editar, setEditar] = useState<boolean>(false)
  const { isDarkTheme } = useDarkMode()
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  useEffect(() => {
    if (activeTab.text === 'Información Operario'){
    } 
  }, [activeTab])

  useEffect(() => {
    dispatch(fetchOperario({ id, token, verificar_token: verificarToken, action: setEditar }))
  }, [])

  useEffect(() => {
		formik.setValues({
      nombre: operario?.nombre!,
      apellido: operario?.apellido!,
      rut: operario?.rut!,
      activo: operario?.activo!
			})

	}, [operario])

  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      rut: '',
      activo: false,
    },
    onSubmit: async (values) => {
      dispatch(editOperario({ id, token, data: values, verificar_token: verificarToken, action: setEditar}));
    }
  })





  const optionsOperario: TSelectOptions = TIPOS_OPERARIO.map((operario) => ({
    value: operario.values,
    label: operario.label
  })) ?? []

  const optionActive: TSelectOptions = ACTIVO?.map((activo) => ({
    value: activo.values,
    label: activo.label
  })) ?? []



	return (
		<>
			<PageWrapper name='Detalle Operarios'>
				<Subheader>
					<SubheaderLeft>
						<ButtonsDetailOp activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
				</Subheader>
				<Container breakpoint={null} className='w-full h-full !p-0'>
          <Card>
            <CardHeader>
            {
              activeTab.text === 'Información Operario'
                ? (
                  <>
                    {
                      !editar
                        ? (
                          <>
                            <Button
                              variant='solid'
                              color="blue"
                              colorIntensity="700"
                              className="w-full sm:w-3/12 md:w-3/12 lg:w-2/12"
                              onClick={() => setEditar(true)}
                            >
                              Editar
                            </Button>
                          </>
                          )
                        : (
                          <>

                            <Button
                              variant='solid'
                              onClick={() => {setEditar(false)}}
                              color="red"
                              colorIntensity="700"
                              className="w-full md:w-3/12 lg:w-2/12"
                              >
                              Cancelar
                            </Button>

                            <Button
                              variant='solid'
                              color="emerald"
                              colorIntensity="700"
                              className="w-full md:w-3/12 lg:w-2/12"
                              onClick={() => {
                                setEditar(false)
                                formik.handleSubmit()
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
            </CardHeader>
            <CardBody>
              {
                activeTab.text === 'Información Operario'
                  ? (
                    <div className="flex flex-col gap-5">  
                      <article className="flex flex-col md:flex-row lg:flex-row gap-5">
                        {
                          editar
                            ? (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="nombre">Nombre: </label>
                
                                <Validation
                                  isValid={formik.isValid}
                                  isTouched={formik.touched.nombre ? true : undefined}
                                  invalidFeedback={formik.errors.nombre ? String(formik.errors.nombre) : undefined}
                                  >
                                  <FieldWrap>
                                  <Input
                                    type='text'
                                    name='nombre'
                                    onChange={formik.handleChange}
                                    className='py-3'
                                    value={formik.values.nombre}
                                  />
                                  </FieldWrap>
                                </Validation>
                              </div>
                
                              )
                            : (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="nombre">Nombre: </label>
                                <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                                  <span>{formik.values.nombre}</span>
                                </div>
                              </div>
                              )
                        }

                        {
                          editar
                            ? (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="apellido">Apellido: </label>
                      
                                <Validation
                                  isValid={formik.isValid}
                                  isTouched={formik.touched.apellido ? true : undefined}
                                  invalidFeedback={formik.errors.apellido ? String(formik.errors.apellido) : undefined}
                                  >
                                  <FieldWrap>
                                  <Input
                                    type='text'
                                    name='apellido'
                                    onChange={formik.handleChange}
                                    className='py-3'
                                    value={formik.values.apellido}
                                  />
                                  </FieldWrap>
                                </Validation>
                      
                              </div>
                
                              )
                            : (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="apellido">Apellido: </label>
                                <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                                  <span>{formik.values.apellido}</span>
                                </div>
                              </div>
                              )
                        }

                      </article>
                      <article className="flex flex-col md:flex-row lg:flex-row gap-5">
                        {
                          editar
                            ? (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="rut">Rut: </label>
                
                                <Validation
                                  isValid={formik.isValid}
                                  isTouched={formik.touched.rut ? true : undefined}
                                  invalidFeedback={formik.errors.rut ? String(formik.errors.rut) : undefined}
                                  >
                                  <FieldWrap>
                                  <Input
                                    type='text'
                                    name='rut'
                                    onChange={formik.handleChange}
                                    className='py-3'
                                    value={formik.values.rut}
                                  />
                                  </FieldWrap>
                                </Validation>
                
                              </div>
                
                              )
                            : (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="rut">Rut: </label>
                                <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                                  <span>{formik.values.rut}</span>
                                </div>
                              </div>
                              )
                        }

                        {
                          editar
                            ? (
                              <div className='w-full md:flex-col items-center'>
                                <Label htmlFor='activo'>Activo: </Label>
                                
                                <Validation
                                  isValid={formik.isValid}
                                  isTouched={formik.touched.activo ? true : undefined}
                                  invalidFeedback={formik.errors.activo ? String(formik.errors.activo) : undefined}
                                  >
                                  <FieldWrap>
                                    <SelectReact
                                      options={optionActive}
                                      id='activo'
                                      placeholder='Selecciona un opción'
                                      name='activo'
                                      className='h-12'
                                      value={optionActive.find(option => (option?.value) === String(formik.values.activo))}
                                      onChange={(value: any) => {
                                        formik.setFieldValue('activo', value.value)
                                      }}
                                    />
                                  </FieldWrap>
                                </Validation>
                
                              </div>
                
                              )
                            : (
                              <div className='w-full md:flex-col items-center'>
                                <label htmlFor="activo">Activo: </label>
                                <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} p-2 flex items-center h-12 rounded-md`}>
                                  <span>{operario?.activo ? 'Si' : 'No'}</span>
                                </div>  
                              </div>
                              )
                        }
                      </article>
                    </div>
                  )
                  : (
                    <div className="flex flex-col">
                        <TablaSkills skills={operario?.skills!} id={id}/>
                    </div>
                  )
              }

              

            </CardBody>
          </Card>
				</Container>
			</PageWrapper>
		</>
	);
};

export default DetalleOperario;
