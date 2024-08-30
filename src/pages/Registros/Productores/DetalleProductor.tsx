import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { editProductor, fetchProductor, fetchProductores } from '../../../redux/slices/productoresSlice';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../components/layouts/Container/Container';
import Card, { CardBody } from '../../../components/ui/Card';
import useDarkMode from '../../../hooks/useDarkMode';
import { RootState } from '../../../redux/store';
import { useParams } from 'react-router-dom'; 
import Tooltip from '../../../components/ui/Tooltip';
import { useAuth } from '../../../context/authContext';
import Button from '../../../components/ui/Button';
import Validation from '../../../components/form/Validation';
import { useFormik } from 'formik';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch';
import FieldWrap from '../../../components/form/FieldWrap';
import Input from '../../../components/form/Input';
import SelectReact, { TSelectOptions } from '../../../components/form/SelectReact';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchComunas, fetchProvincias, fetchRegiones } from '../../../redux/slices/registrosbaseSlice';
import { fetchWithTokenPatch } from '../../../utils/peticiones.utils';
import toast from 'react-hot-toast';

interface IDetalleProductorProps {
  id: number,
  setOpen: Dispatch<SetStateAction<boolean>>
}


const DetalleProductor: FC<IDetalleProductorProps> = ({ id, setOpen }) => {
  const { isDarkTheme } = useDarkMode();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const productor = useAppSelector((state: RootState) => state.productores.productor);
  const token = useAppSelector((state: RootState) => state.auth.authTokens);
  const { verificarToken } = useAuth()
  const [editar, setEditar] = useState<boolean>(false)
  const { regiones, provincias, comunas } = useAppSelector((state: RootState) => state.core)

  useEffect(() => {
    dispatch(fetchProductor({ id, token, verificar_token: verificarToken }));
  }, [id]);


  const formik = useFormik({
    initialValues: {
      rut_productor: "",
      nombre: "",
      telefono: "",
      region: null,
      provincia: null,
      comuna: null,
      direccion: "",
      movil: "",
      pagina_web: "",
      email: "",
      numero_contrato: "0"
    },
    // validationSchema: ProductorSchema,
    onSubmit: async (values: any) => {
      const token_verificado = await verificarToken(token)
      if (!token_verificado) throw new Error('Token no verificado')
      console.log(values.numero_contrato)
      const res = await fetchWithTokenPatch(`api/productores/${id}/`, {
        rut_productor: values.rut_productor,
        nombre: values.nombre,
        telefono: values.telefono,
        region: values.region,
        provincia: values.provincia,
        comuna: values.comuna,
        direccion: values.direccion,
        movil: values.movil,
        pagina_web: values.pagina_web,
        email: values.email,
        numero_contrato: values.numero_contrato === "" || values.numero_contrato === null || values.numero_contrato === undefined ? "0" : values.numero_contrato
      }, token_verificado)
      if (res.ok){
        toast.success('Actualización realizada correctamente')
        dispatch(fetchProductor({ id, token, verificar_token: verificarToken }))
        setOpen(false)
      } else {
        toast.error('Error: Vuelva a intentarlo')
      }
  }})

  
  useEffect(() => {
    formik.setFieldValue('rut_productor', productor?.rut_productor)
    formik.setFieldValue('nombre', productor?.nombre)
    formik.setFieldValue('telefono', productor?.telefono)
    formik.setFieldValue('region', productor?.region)
    formik.setFieldValue('provincia', productor?.provincia)
    formik.setFieldValue('comuna', productor?.comuna)
    formik.setFieldValue('direccion', productor?.direccion)
    formik.setFieldValue('movil', productor?.movil)
    formik.setFieldValue('pagina_web', productor?.pagina_web)
    formik.setFieldValue('email', productor?.email)
    formik.setFieldValue('numero_contrato', productor?.numero_contrato)

	}, [id, productor])


  const optionsRegion: TSelectOptions = regiones.map((region) => ({
    value: String(region.region_id),
    label: region.region_nombre
  })) ?? []

  const optionsProvincia: TSelectOptions = provincias.map((provincias) => ({
    value: String(provincias.provincia_id),
    label: provincias.provincia_nombre
  }))

  const optionsComunas: TSelectOptions = comunas.map((comuna) => ({
    value: String(comuna.comuna_id),
    label: comuna.comuna_nombre
  }))

  useEffect(() => {
      dispatch(fetchRegiones({ token, verificar_token: verificarToken }));
  }, []);

  useEffect(() => {
    if (formik.values.region) {
      dispatch(fetchProvincias({ params: { id_region: formik.values.region }, token, verificar_token: verificarToken }));
    }
  }, [formik.values.region]);

  useEffect(() => {
    if (formik.values.provincia) {
      dispatch(fetchComunas({ params: { id_provincia: formik.values.provincia }, token, verificar_token: verificarToken }));
    }
  }, [formik.values.provincia]);


  return (
    <PageWrapper>
      <Container breakpoint={null} className='w-full bg-inherit flex flex-col gap-5'>
        <div className='w-full h-full py-3 flex justify-between'>
          {
            editar
              ? (
                <>
                  <Button
                  variant='solid'
                  color='red'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => setEditar(false)}
                  >
                    Cancelar
                </Button>
                    

                  <Button
                  variant='solid'
                  color='emerald'
                  className='hover:scale-105'
                  onClick={() => formik.handleSubmit()}
                  >
                    Guardar
                </Button>                  
                </>
                
                )
              : (
                <Button
                  variant='solid'
                  color='blue'
                  colorIntensity='700'
                  className='hover:scale-105'
                  onClick={() => setEditar(true)}
                  >
                    Editar
                </Button>
              )
          }
        </div>
        <Card>
          <CardBody>
          <div
              className='flex flex-col dark:bg-inherit
            md:grid md:grid-cols-6 gap-x-6 gap-y-8
            relative p-2 rounded-md h-full'
            >
              <div className='md:col-span-2 md:flex-col items-center overflow-hidden'>
                <label htmlFor="rut_productor">Rut Productor: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.rut_productor ? true : undefined}
                        invalidFeedback={formik.errors.rut_productor ? String(formik.errors.rut_productor) : undefined}
                        >
                        <FieldWrap>
                        <Input
                            type='text'
                            name='rut_productor'
                            onChange={formik.handleChange}
                            className='py-2.5'
                            value={formik.values.rut_productor}
                          />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.rut_productor}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:col-start-3 md:flex-col items-center overflow-hidden'>
                <label htmlFor="nombre">Nombre: </label>
                {
                  editar
                    ? (
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
                            className='py-2.5'
                            value={formik.values.nombre}
                          />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.nombre}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:col-start-5 md:flex-col items-center overflow-hidden'>
                <label htmlFor="email">Correo: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.email ? true : undefined}
                        invalidFeedback={formik.errors.email ? String(formik.errors.email) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='email'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.email}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.email}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
                <label htmlFor="region">Región: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.region ? true : undefined}
                        invalidFeedback={formik.errors.region ? String(formik.errors.region) : undefined}
                        >
                        <FieldWrap>
                        <SelectReact
                            options={optionsRegion}
                            id='region'
                            name='region'
                            placeholder='Selecciona una región'
                            className='py-2.5'
                            value={optionsRegion.find(option => Number(option?.value) === formik.values.region)}
                            onChange={(value: any) => {
                              formik.setFieldValue('region', value.value)
                            }}
                          />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.region_nombre}</span>
                      </div>
                      )
                }
                
              </div>

              <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
                <label htmlFor="provincia">Provincia: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.provincia ? true : undefined}
                        invalidFeedback={formik.errors.provincia ? String(formik.errors.provincia) : undefined}
                        >
                        <FieldWrap>
                        <SelectReact
                          options={optionsProvincia}
                          id='provincia'
                          name='provincia'
                          placeholder='Selecciona una provincia'
                          className='py-2.5'
                          value={optionsProvincia.find(option => Number(option?.value) === formik.values.provincia)}
                          onChange={(value: any) => {
                            formik.setFieldValue('provincia', value.value)
                          }}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.provincia_nombre}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
                <label htmlFor="comuna">Comuna: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.comuna ? true : undefined}
                        invalidFeedback={formik.errors.comuna ? String(formik.errors.comuna) : undefined}
                        >
                        <FieldWrap>
                        <SelectReact
                          options={optionsComunas}
                          id='comuna'
                          name='comuna'
                          placeholder='Selecciona una comuna'
                          className='py-2.5'
                          value={optionsComunas.find(option => Number(option?.value) === formik.values.comuna)}
                          onChange={(value: any) => {
                            formik.setFieldValue('comuna', value.value)
                          }}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.comuna_nombre}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:row-start-3  md:flex-col items-center overflow-hidden'>
                <label htmlFor="direccion">Dirección: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.direccion ? true : undefined}
                        invalidFeedback={formik.errors.direccion ? String(formik.errors.direccion) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='direccion'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.direccion}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.direccion}</span>
                      </div>
                      )
                }
              </div>


              <div className='md:col-span-2 md:row-start-3 md:col-start-3 md:flex-col items-center overflow-hidden'>
                <label htmlFor="telefono">Telefono Fijo: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.telefono ? true : undefined}
                        invalidFeedback={formik.errors.telefono ? String(formik.errors.telefono) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='telefono'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.telefono}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.telefono}</span>
                      </div>
                      )
                }
              </div>



              <div className='md:col-span-2 md:row-start-3 md:col-start-5 md:flex-col items-center overflow-hidden'>
                <label htmlFor="movil">Telefono Celular: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.movil ? true : undefined}
                        invalidFeedback={formik.errors.movil ? String(formik.errors.movil) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='movil'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.movil}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.telefono}</span>
                      </div>
                      )
                }
              </div>

              <div className='md:col-span-2 md:row-start-4 md:flex-col items-center overflow-hidden'>
                <label htmlFor="pagina_web">Página Web: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.pagina_web ? true : undefined}
                        invalidFeedback={formik.errors.pagina_web ? String(formik.errors.pagina_web) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='pagina_web'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.pagina_web}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <Tooltip text={`${productor?.pagina_web}`}>
                        <div className={`${isDarkTheme ? 'bg-[#27272A] border border-gray-600 ' : 'bg-[#F4F4F5] border border-blue-100 '} px-2 py-4 flex items-center h-12 rounded-md`}>
                          <span className='pl-1'>{productor?.pagina_web}</span>
                        </div>
                      </Tooltip>
                      )
                      
                }
              </div>

              <div className='md:col-span-2 md:row-start-4 md:col-start-3 md:flex-col items-center overflow-hidden'>
                <label htmlFor="numero_contrato">N° Contrato: </label>
                {
                  editar
                    ? (
                      <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.numero_contrato ? true : undefined}
                        invalidFeedback={formik.errors.numero_contrato ? String(formik.errors.numero_contrato) : undefined}
                        >
                        <FieldWrap>
                        <Input
                          type='text'
                          name='numero_contrato'
                          onChange={formik.handleChange}
                          className='py-2.5'
                          value={formik.values.numero_contrato!}
                        />
                        </FieldWrap>
                      </Validation>
                      )
                    : (
                      <div className={`dark:bg-[#27272A] dark:border dark:border-gray-600 bg-[#F4F4F5] border border-blue-100 p-2 flex items-center h-12 rounded-md`}>
                        <span>{productor?.numero_contrato}</span>
                      </div>
                      )
                }
              </div>
            </div>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default DetalleProductor;
