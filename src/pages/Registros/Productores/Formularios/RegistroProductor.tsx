import { useFormik } from "formik"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import SelectReact, { TSelectOptions } from "../../../../components/form/SelectReact"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import useAxiosFunction from "../../../../hooks/useAxiosFunction"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { ProductorSchema } from "../../../../utils/Validator"
import toast from "react-hot-toast"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchWithTokenPost } from "../../../../utils/peticiones.utils"
import { fetchProductores } from "../../../../redux/slices/productoresSlice"
import Button from "../../../../components/ui/Button"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';




interface IRegion {
  region_id: number
  region_nombre: string
}

interface IProvincia {
  provincia_id: number
  provincia_nombre: string
}

interface IComuna {
  comuna_id: number
  comuna_nombre: string
}

interface IFormProductor {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroProductores: FC<IFormProductor> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

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
    validationSchema: ProductorSchema,
    onSubmit: async (values) => {
      // @ts-ignore

      const token_verificado = await verificarToken(token)
    
      if (!token_verificado) throw new Error('Token no verificado')

      const res = await fetchWithTokenPost(`api/productores/`, {
        ...values, numero_contrato: values.numero_contrato === null || values.numero_contrato === "" || values.numero_contrato === undefined ? "0" : values.numero_contrato
      },
      token_verificado
      )

      if (res.ok){
        toast.success('Productor creado exitosamente')
        //@ts-ignore
        dispatch(fetchProductores({ token, verificar_token: verificarToken }))
        setOpen(false)
      } else if (res.status === 404){
        toast.error('No se pudo crear el productor')
      }
    }
  });

  const { data: regiones } = useAuthenticatedFetch<IRegion[]>('api/regiones')
  const { data: provincias } = useAuthenticatedFetch<IProvincia[]>(`api/region/${formik.values.region}/provincias/`)
  const { data: comunas } = useAuthenticatedFetch<IComuna[]>(`api/provincias/${formik.values.provincia}/comunas/`)

  const region = regiones?.map((region: IRegion) => ({
    value: String(region.region_id),
    label: region.region_nombre
  })) ?? []

  const provincia = provincias?.map((provincia: IProvincia) => ({
    value: String(provincia.provincia_id),
    label: provincia.provincia_nombre
  })) ?? []

  const comuna = comunas?.map((comuna: IComuna) => ({
    value: String(comuna.comuna_id),
    label: comuna.comuna_nombre
  })) ?? []

  const optionsRegion: TSelectOptions | [] = region
  const optionsProvincia: TSelectOptions | [] = provincia
  const optionsComuna: TSelectOptions | [] = comuna


  return (
    <form
      onSubmit={formik.handleSubmit}
      className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 dark:bg-inherit bg-zinc-50 relative px-5 py-6
      rounded-md`}
    >
      <div className='md:col-span-2 md:flex-col items-center'>
        <Label htmlFor='rut_productor'>Rut Productor: </Label>

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
              className='py-3'
              value={formik.values.rut_productor}
            />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='nombre'>Nombre: </Label>

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

      <div className='md:col-span-2 md:col-start-5 md:flex-col items-center'>
        <Label htmlFor='email'>Email: </Label>

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
            className='py-3'
            value={formik.values.email}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:row-start-2 md:flex-col items-center'>
        <Label htmlFor='region'>Región: </Label>

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
              className='h-14'
              onChange={(value: any) => {
                formik.setFieldValue('region', value.value)
              }}
            />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2  md:row-start-2 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='provincia'>Provincia: </Label>

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
              className='h-14'
              onChange={(value: any) => {
                formik.setFieldValue('provincia', value.value)
              }}
            />
          </FieldWrap>
        </Validation>
  
      </div>

      <div className='md:col-span-2 md:row-start-2 md:col-start-5 md:flex-col items-center'>
        <Label htmlFor='comuna'>Comuna: </Label>

        <Validation
          isValid={formik.isValid}
          isTouched={formik.touched.comuna ? true : undefined}
          invalidFeedback={formik.errors.comuna ? String(formik.errors.comuna) : undefined}
          >
          <FieldWrap>
            <SelectReact
              options={optionsComuna}
              id='comuna'
              name='comuna'
              placeholder='Selecciona una comuna'
              className='h-14'
              onChange={(value: any) => {
                formik.setFieldValue('comuna', value.value)
              }}
            />

          </FieldWrap>
        </Validation>

      </div>

      <div className='md:col-span-2 md:row-start-3  md:flex-col items-center'>
        <Label htmlFor='direccion'>Dirección: </Label>

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
            className='py-3'
            value={formik.values.direccion}
          />
          </FieldWrap>
        </Validation>
        
      </div>


      <div className='md:col-span-2 md:row-start-3 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='telefono'>Telefono: </Label>

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
            className='py-3'
            value={formik.values.telefono}
          />
          </FieldWrap>
        </Validation>

      </div>



      <div className='md:col-span-2 md:row-start-3 md:col-start-5 md:flex-col items-center'>
        <Label htmlFor='movil'>Movil: </Label>

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
            className='py-3'
            value={formik.values.movil}
          />
          </FieldWrap>
        </Validation>

      </div>

      <div className='md:col-span-2 md:row-start-4 md:flex-col items-center'>
        <Label htmlFor='pagina_web'>Página Web: </Label>

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
            className='py-3'
            value={formik.values.pagina_web}
          />
          </FieldWrap>
        </Validation>
      </div>

      <div className='md:col-span-2 md:row-start-4 md:col-start-3 md:flex-col items-center'>
        <Label htmlFor='numero_contrato'>Número Contrato: </Label>

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
            className='py-3'
            value={formik.values.numero_contrato!}
          />
          </FieldWrap>
        </Validation>
      </div>


      <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full top-2'>
        <Button 
          variant="solid"
          onClick={() => formik.handleSubmit()}
          className='w-full mt-6 bg-blue-700 hover:bg-blue-600 border-none rounded-md text-white py-3.5'
          >
            Registrar Productor
        </Button>
      </div>
    </form>
  )
}

export default FormularioRegistroProductores  
