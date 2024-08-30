import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { TGuia, TLoteGuia } from "../../../../types/TypesRecepcionMP.types"
import useDarkMode from "../../../../hooks/useDarkMode"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { TPatioExterior } from "../../../../types/TypesBodega.types"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import SelectReact from "../../../../components/form/SelectReact"
import { optionsUbicaciones } from "../../../../utils/options.constantes"
import { fetchLoteGuiaRecepcionIndividual } from "../../../../redux/slices/recepcionmp"
import { useAuth } from "../../../../context/authContext"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"


interface IFormEnvasesProps {
  refresh: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  guia?: TGuia | null
  lote: TLoteGuia | null
  id_lote: number
}

const FormularioEdicionBodega: FC<IFormEnvasesProps> = ({ refresh, setOpen, lote }) => {
  // const { authTokens, validate, userID } = useAuth()
  const base_url = process.env.VITE_BASE_URL
  const { isDarkTheme } = useDarkMode();
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const patio_exterior = useAppSelector((state: RootState) => state.bodegas.patio_techado)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchLoteGuiaRecepcionIndividual({ id, token, verificar_token: verificarToken }))
  }, [])

  // const { data: patio_exterior } = useAuthenticatedFetch<TPatioExterior>(
  //   `api/patio-exterior/${lote?.id}`
  // )


  const updateEstadoLote = async (id: number, estado: string) => {

    const res = await fetch(`${base_url}/api/estado-update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        estado_recepcion: estado
      })
    });

    if (res.ok) {
      setOpen(false)
      refresh(true)
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
        const res = await fetch(`${base_url}/api/patio-exterior/${patio_exterior?.id_recepcion}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            ...values,
            registrado_por: perfil?.id
          })
        })
        if (res.ok) {
          toast.success("fue asignado exitosamente la ubicación!!")
          updateEstadoLote(lote?.id!, '5')
          refresh(true)
          setOpen(false)

        } else {
          toast.error("No se pudo asignar la ubicación, volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })


  return (

    <form
      onSubmit={formik.handleSubmit}
      className={` w-full flex flex-col `}
    >
      <div className='md:col-span-6 md:flex-col items-center'>
        <label htmlFor="ubicacion">Ubicación: </label>
        <SelectReact
          options={optionsUbicaciones}
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
        <button className='w-full mt-6 px-5  bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
          Registrar Ubicación
        </button>
      </div>
    </form>
  )
}

export default FormularioEdicionBodega  
