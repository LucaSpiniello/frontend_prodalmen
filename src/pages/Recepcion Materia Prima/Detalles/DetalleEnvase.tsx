import { FC, useState } from "react"
import { useParams } from "react-router-dom"
import { TGuia, TLoteGuia } from "../../../types/TypesRecepcionMP.types"
import useDarkMode from "../../../hooks/useDarkMode"
import { useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { useAuthenticatedFetch } from "../../../hooks/useAuthenticatedFetch"
import { TCamion, TComercializador, TConductor, TProductor } from "../../../types/TypesRegistros.types"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import SelectReact, { TSelectOptions } from "../../../components/form/SelectReact"
import Radio, { RadioGroup } from "../../../components/form/Radio"
import Input from "../../../components/form/Input"
import FooterDetalleGuia from "./FooterDetalleGuia"

interface IDetalleProps {
  id_lote: number
}

const DetalleEnvase: FC<IDetalleProps> = ({ id_lote }) => {
  const { id: id_url } = useParams()
  const [guiaGenerada, setGuiaGenerada] = useState<boolean>(false)
  const [guiaID, setGuiaID] = useState<number | null>(null)
  const [variedad, setVariedad] = useState<boolean>(false)
  const [activo, setActivo] = useState<boolean>(false)
  const [datosGuia, setDatosGuia] = useState<TGuia | null>(null)
  const base_url = process.env.VITE_BASE_URL
  const { isDarkTheme } = useDarkMode()

  const token = useAppSelector((state: RootState) => state.auth.authTokens?.access)
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)



  const { data: camiones } = useAuthenticatedFetch<TCamion[]>(
    'api/registros/camiones/'
  )

  const { data: productores } = useAuthenticatedFetch<TProductor[]>(
    'api/productores/'
  )

  const { data: conductores } = useAuthenticatedFetch<TConductor[]>(
    'api/registros/choferes'
  )

  const { data: comercializadores } = useAuthenticatedFetch<TComercializador[]>(
    'api/comercializador/'
  )

  const optionsRadio = [
    { id: 1, value: true, label: 'Si' },
    { id: 2, value: false, label: 'No' }
  ];

  const { data: lotes } = useAuthenticatedFetch<TLoteGuia>(
    `api/recepcionmp/${id_url}/lotes/${id_lote}`
  )

  const formik = useFormik({
    initialValues: {
      estado_recepcion: null,
      mezcla_variedades: false,
      cierre_guia: false,
      tara_camion_1: null,
      tara_camion_2: null,
      terminar_guia: false,
      numero_guia_productor: null,
      creado_por: null,
      comercializador: null,
      productor: null,
      camionero: null,
      camion: null
    },
    onSubmit: async (values: any) => {
      try {
        const res = await fetch(`${base_url}api/recepcionmp/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            estado_recepcion: 1,
            creado_por: perfilData?.id

          })
        })
        if (res.ok) {
          const data = await res.json()
          setGuiaID(data.id)
          setVariedad(data.mezcla_variedades)
          setDatosGuia(data)
          toast.success("la guia de recepción fue registrado exitosamente!!")
          setGuiaGenerada(true)

        } else {
          
          toast.error("No se pudo registrar la guia de recepción volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })



  const camionFilter = camiones?.map((camion: TCamion) => ({
    value: String(camion.id),
    label: (`${camion.patente},  ${camion.acoplado ? 'Con Acoplado' : 'Sin Acoplado'}`)
  })) ?? []

  const productoresFilter = productores?.map((productor: TProductor) => ({
    value: String(productor.id),
    label: productor.nombre
  })) ?? []

  const conductoresFilter = conductores?.map((conductor: TConductor) => ({
    value: String(conductor.id),
    label: conductor.nombre
  })) ?? []

  const comercializadoresFilter = comercializadores?.map((comerciante: TComercializador) => ({
    value: String(comerciante.id),
    label: comerciante.nombre
  })) ?? []


  const optionsCamion: TSelectOptions | [] = camionFilter
  const optionsProductor: TSelectOptions | [] = productoresFilter
  const optionsConductor: TSelectOptions | [] = conductoresFilter
  const optionsComercializador: TSelectOptions | [] = comercializadoresFilter
  
  return (
    <div className={`dark:bg-zinc-900 bg-zinc-50 h-full`}>
      <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
      gap-y-10 mt-10 dark:bg-zinc-900 bg-zinc-50 relative px-5 py-6 
      rounded-md`}
      >

        <div className='border border-gray-300 rounded-md col-span-6'>
          <h1 className='text-center text-2xl p-4'>Registro Guía Recepción Para Materias Primas Origen</h1>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="productor">Productor: </label>
          <SelectReact
            options={optionsProductor}
            id='productor'
            name='productor'
            placeholder='Selecciona un productor'
            className='h-14'
            value={optionsProductor.find(productor => productor?.value === String(formik.values.productor))}
            onChange={(value: any) => {
              formik.setFieldValue('productor', value.value)
            }}
            disabled
          />

        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col items-center'>
          <label htmlFor="camionero">Chofer: </label>
          <SelectReact
            options={optionsConductor}
            id='camionero'
            name='camionero'
            placeholder='Selecciona un chofer'
            className='h-14'
            value={optionsConductor.find(conductor => conductor?.value === String(formik.values.camionero))}
            onChange={(value: any) => {
              formik.setFieldValue('camionero', value.value)
            }}
            disabled
          />

        </div>

        <div className='md:row.start-2 md:col-span-2 md:col-start-5 md:flex-col items-center'>
          <label htmlFor="camion">Camion: </label>
          <SelectReact
            options={optionsCamion}
            id='camion'
            name='camion'
            placeholder='Selecciona un camión'
            className='h-14'
            value={optionsCamion.find(camion => camion?.value === String(formik.values.camion))}
            onChange={(value: any) => {
              formik.setFieldValue('camion', value.value)
            }}
            disabled
          />
        </div>

        <div className='md:row-start-3 md:col-span-2 md:flex-col items-center'>
          <label htmlFor="comercializador">Comercializador: </label>
          <SelectReact
            options={optionsComercializador}
            id='comercializador'
            name='comercializador'
            placeholder='Selecciona una opción'
            className='h-14'
            value={optionsComercializador.find(comercializador => comercializador?.value === String(formik.values.comercializador))}
            onChange={(value: any) => {
              formik.setFieldValue('comercializador', value.value)
            }}
            disabled
          />
        </div>

        <div className='md:col-span-2  2 md:col-start-3 md:flex-col items-center justify-center'>
          <label htmlFor="mezcla_variedades">Mezcla Variedades: </label>

          <div className={`w-full h-14  ${isDarkTheme ? 'bg-[#27272A]' : 'bg-gray-100'} rounded-md flex items-center justify-center relative`}>
            <RadioGroup isInline>
              {optionsRadio.map(({ id, value, label }) => {
                return (
                  <Radio
                    key={id}
                    label={label}
                    name='mezcla_variedades'
                    value={label} 
                    checked={formik.values.mezcla_variedades === value} 
                    onChange={(e) => {
                      formik.setFieldValue('mezcla_variedades', e.target.value === 'Si' ? true : false) 
                    }}
                    selectedValue={undefined}
                    disabled />
                );
              })}
            </RadioGroup>
          </div>
        </div>

        <div className='md:col-span-2  md:col-start-5 md:flex-col items-center'>
          <label htmlFor="numero_guia_productor">N° Guia Productor: </label>
          <Input
            type='text'
            name='numero_guia_productor'
            onChange={formik.handleChange}
            className='py-3'
            value={formik.values.numero_guia_productor!}
            disabled
          />
        </div>
      </form>

      <FooterDetalleGuia 
        // @ts-ignore
        data={lotes?.envases!} refresh={() => {}}/>
    </div>
  )
}

export default DetalleEnvase 
