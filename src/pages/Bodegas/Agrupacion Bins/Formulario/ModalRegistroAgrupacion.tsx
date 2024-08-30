import { useFormik } from "formik"
import Container from "../../../../components/layouts/Container/Container"
import Card, { CardBody, CardHeader } from "../../../../components/ui/Card"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchWithToken, fetchWithTokenPost } from "../../../../utils/peticiones.utils"
import { fetchBinsAgrupados } from "../../../../redux/slices/bodegaSlice"
import { useNavigate } from "react-router-dom"
import { Dispatch, FC, SetStateAction } from "react"
import toast from "react-hot-toast"
import SelectReact from "../../../../components/form/SelectReact"
import { optionTipoPatineta, optionsBodegas } from "../../../../utils/options.constantes"
import Label from "../../../../components/form/Label"
import Button from "../../../../components/ui/Button"
import { TAgrupacion } from "../../../../types/TypesBodega.types"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"

interface IBodegasAgrupacion {
  setOpen: Dispatch<SetStateAction<boolean>>
}
const ModalRegistroAgrupacion: FC<IBodegasAgrupacion> = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const userData = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      transferir_bodega: '',
      tipo_patineta: '',
    },
    onSubmit: async (values) => {
      const token_verificado = await verificarToken(token!)
    
      if (!token_verificado) throw new Error('Token no verificado')
      
      const res = await fetchWithTokenPost(`api/agrupacion/`, 
      {
        ...values,
        registrado_por: userData?.id
      },
      token_verificado
      )

      if (res.ok){
        const data: TAgrupacion = await res.json()
        dispatch(fetchBinsAgrupados({ token, verificar_token: verificarToken }))
        navigate(`/bdg/acciones/agrupaciones/registro-agrupacion-bin/${data.id}`)
      } else {
        const errorData = await res.json()
        toast.error(`${Object.entries(errorData)}`)
      }

    }
  })

  return (
    <Container breakpoint={null} className='w-full h-full !p-0'>
      <Card>
        <CardBody>
          <article>
            <div className="py-3 flex justify-center flex-col">
              <Label htmlFor="transferir_bodega">Bodega de los bins a juntar</Label>
              <SelectReact
                options={optionsBodegas}
                id='transferir_bodega'
                placeholder='Selecciona un opción'
                name='transferir_bodega'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('transferir_bodega', value.value)
                }}
              />
            </div>
            <div className="py-3 flex justify-center flex-col">
              <Label htmlFor="tipo_patineta">Tipo Patineta</Label>

              <SelectReact
                options={optionTipoPatineta}
                id='tipo_patineta'
                placeholder='Selecciona un opción'
                name='tipo_patineta'
                className='h-14 py-2'
                onChange={(value: any) => {
                  formik.setFieldValue('tipo_patineta', value.value)
                }}
              />
            </div>

            <div className="flex justify-end ">
              <Button
                variant="solid"
                className="bg-blue-800 hover:bg-blue-700 border-none hover:scale-105 py-3"
                onClick={() => formik.handleSubmit()}
                >
                Siguiente
              </Button>
            </div>
          </article>
        </CardBody>
      </Card>
    </Container>
  )
}

export default ModalRegistroAgrupacion 