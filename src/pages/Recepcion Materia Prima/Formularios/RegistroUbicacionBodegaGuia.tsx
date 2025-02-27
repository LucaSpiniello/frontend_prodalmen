import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { TGuia, TLoteGuia } from "../../../types/TypesRecepcionMP.types"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { useAuth } from "../../../context/authContext"
import { fetchWithTokenPatch, fetchWithTokenPut } from "../../../utils/peticiones.utils"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import SelectReact from "../../../components/form/SelectReact"
import { optionsUbicaciones } from "../../../utils/options.constantes"
import Button from "../../../components/ui/Button"
import { fetchLotePatioTechadoExterior } from "../../../redux/slices/bodegaSlice"
import { fetchGuiaRecepcion, fetchLotesPendientesGuiaRecepcion } from "../../../redux/slices/recepcionmp"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


interface IFormEnvasesProps {
  setOpen: Dispatch<SetStateAction<boolean>>
  guia?: TGuia | null
  lote: TLoteGuia | null
}

const FormularioEdicionBodega: FC<IFormEnvasesProps> = ({ setOpen, lote }) => {
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const patio_exterior = useAppSelector((state: RootState) => state.bodegas.patio_techado)
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { id } = useParams()

  useEffect(() => {
    dispatch(fetchLotePatioTechadoExterior({ id: lote?.id, token, verificar_token: verificarToken }))
  }, [])


  const updateEstadoLote = async (id: any, id_lote: number, estado: string) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    const res = await fetchWithTokenPatch(`api/recepcionmp/${id}/lotes/${id_lote}/`, 
    { 
      estado_recepcion: estado,
      guiarecepcion: id
     },
    token_verificado)
    if (res.ok) {
      dispatch(fetchLotesPendientesGuiaRecepcion({ id: id, token, verificar_token: verificarToken }))
      setOpen(false)
    } else {
      console.log("Errores sobre errores");
    }
  }

  useEffect(() => {
    let isMounted = true

    if (isMounted && patio_exterior) {
      formik.setValues({
        id_recepcion: patio_exterior?.id_recepcion,
        ubicacion: patio_exterior.ubicacion,
        estado_lote: patio_exterior.estado_lote,
        procesado: patio_exterior.procesado,
        cc_guia: patio_exterior.cc_guia,
        tipo_recepcion: patio_exterior.tipo_recepcion,
        registrado_por: patio_exterior.registrado_por
      })
    }
  }, [patio_exterior])

  const formik = useFormik({
    initialValues: {
      id_recepcion: 0,
      ubicacion: '',
      estado_lote: '',
      procesado: false,
      cc_guia: 0,
      tipo_recepcion: 0,
      registrado_por: 0
    },
    onSubmit: async (values: any) => {
      try {
        if (values.ubicacion === '' || values.ubicacion === '0') {
          toast.error("Asigne una ubicación")
        } else {
          const token_verificado = await verificarToken(token!)
          if (!token_verificado) throw new Error('Token no verificado')
          const res = await fetchWithTokenPatch(`api/patio-exterior/${patio_exterior?.id_recepcion}/`,
            {
              ...values,
              registrado_por: perfil?.id
            },
            token_verificado
          )
  
          if (res.ok) {
            toast.success("fue asignado exitosamente la ubicación!!")
            updateEstadoLote(id, lote?.id!, '5')
            setOpen(false)
            dispatch(fetchGuiaRecepcion({ id: parseInt(id!), token, verificar_token: verificarToken }))
            
          } else {
            toast.error("No se pudo asignar la ubicación, volver a intentar")
          }
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  return (

    <form
      className={`w-full flex flex-col `}
    >
      <div className='md:col-span-6 md:flex-col items-center'>
        <label htmlFor="ubicacion">Ubicación: </label>
        <SelectReact
          options={[{ value: "1", label: "Sector 1" },
          { value: "2", label: "Sector 2" },
          { value: "3", label: "Sector 3" },
          { value: "4", label: "Sector 4" },
        ]}
          id='ubicacion'
          placeholder='Selecciona una ubicación'
          name='ubicacion'
          className='h-12 py-2'
          onChange={(value: any) => {
            formik.setFieldValue('ubicacion', value.value)
          }}
        />
      </div>

      <div className='md:row-start-4 md:col-start-5 md:col-span-2 relative w-full'>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="solid" 
          className='w-full mt-6 px-5  bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
          Registrar Ubicación
        </Button>
      </div>
    </form>
  )
}

export default FormularioEdicionBodega  
