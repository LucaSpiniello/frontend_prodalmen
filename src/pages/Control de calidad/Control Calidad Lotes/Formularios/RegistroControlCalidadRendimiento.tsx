import { Dispatch, FC, SetStateAction, useEffect } from "react"
import { TControlCalidad } from "../../../../types/TypesControlCalidad.type"
import { useFormik } from "formik"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import toast from "react-hot-toast"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import { useAuth } from "../../../../context/authContext"
import { fetchWithTokenPost } from "../../../../utils/peticiones.utils"
import { fetchMuestrasControlCalidad } from "../../../../redux/slices/controlcalidadSlice"
import Button from "../../../../components/ui/Button"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"


interface IFormCC {
  id_lote: number
  isOpen: Dispatch<SetStateAction<boolean>>
  control_calidad: TControlCalidad
}

const FormularioCCRendimiento: FC<IFormCC> = ({ id_lote, isOpen, control_calidad }) => {
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const formik = useFormik({
    initialValues: {
      pepa: 0.0,
      peso_muestra: 0.0,
      basura: 0.0,
      ciega: 0.0,
      pelon: 0.0,
      cascara: 0.0,
      pepa_huerto: 0.0,
      esta_contramuestra: false
    },
    
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')

        const res = await fetchWithTokenPost(`api/control-calidad/recepcionmp/${id_lote}/registra_muestra_lote/`, 
          {
            peso_muestra: values.peso_muestra.toFixed(2),
            basura: values.basura.toFixed(2),
            ciega: values.ciega.toFixed(2),
            pelon: values.pelon.toFixed(2),
            cascara: values.cascara.toFixed(2),
            pepa_huerto: values.pepa_huerto.toFixed(2),
            pepa: values.pepa.toFixed(2),
            registrado_por: perfil?.id,
            es_contramuestra: control_calidad.esta_contramuestra === '1' ? true : false
          },
          token_verificado
        )

        if (res.ok) {
          toast.success("El control de calidad fue registrado exitosamente!!")
          isOpen(false)
          //@ts-ignore
          dispatch(fetchMuestrasControlCalidad({ id: id_lote, token, verificar_token: verificarToken }))
        } else {
          toast.error("No se pudo registrar el control de calidad, volver a intentar")
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  const calcularPepaBruta = () => {
    const { peso_muestra, basura, ciega, pelon, cascara, pepa_huerto } = formik.values;
  
    const redondear = (valor: any) => Number(parseFloat(valor).toFixed(2));
  
    const pesoMuestraRedondeado = redondear(peso_muestra);
    const basuraRedondeado = redondear(basura);
    const ciegaRedondeado = redondear(ciega);
    const pelonRedondeado = redondear(pelon);
    const cascaraRedondeado = redondear(cascara);
    const pepaHuertoRedondeado = redondear(pepa_huerto);
  
    const sumaOtrosCampos = basuraRedondeado + ciegaRedondeado + pelonRedondeado + cascaraRedondeado + pepaHuertoRedondeado;
    const pepa = pesoMuestraRedondeado - sumaOtrosCampos;
    const pepaRedondeada = redondear(pepa);
  
    return pepaRedondeada >= 0 ? pepaRedondeada : 0; // Asegúrate de que el valor no sea negativo
  };
  
  useEffect(() => {
    const updatedValues = { ...formik.values, pepa: calcularPepaBruta() };
    formik.setValues(updatedValues);
  }, [formik.values.peso_muestra, formik.values.basura, formik.values.ciega, formik.values.pelon, formik.values.cascara, formik.values.pepa_huerto])

 
  return (
    <form
        onSubmit={formik.handleSubmit}
        className={`flex flex-col md:grid md:grid-cols-6 gap-x-3
         mt-5 dark:bg-zinc-900 bg-zinc-50 relative px-5 py-6
        rounded-md`}
      >
        <div className='md:col-span-2 md:col-start-3 md:flex-col items-center bg-green-700 p-5 rounded-md'>
          <Label htmlFor='peso_muestra' className="text-white">Peso Muestra: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.peso_muestra ? true : undefined}
            invalidFeedback={formik.errors.peso_muestra ? String(formik.errors.peso_muestra) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='peso_muestra'
              color="zinc"
              onChange={formik.handleChange}
              className='py-4 w-[90%]'
              value={formik.values.peso_muestra}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2  md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='basura'>Basura: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.basura ? true : undefined}
            invalidFeedback={formik.errors.basura ? String(formik.errors.basura) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              name='basura'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.basura}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2 md:col-start-3 md:flex-col p-5 flex-col lg:flex-row '>
          <Label htmlFor='pelon'>Pelón: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pelon ? true : undefined}
            invalidFeedback={formik.errors.pelon ? String(formik.errors.pelon) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='pelon'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.pelon}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-2 md:col-span-2  md:col-start-5 p-5 md:flex-col flex-col lg:flex-row '>
          <Label htmlFor='ciega'>Ciega: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.ciega ? true : undefined}
            invalidFeedback={formik.errors.ciega ? String(formik.errors.ciega) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='ciega'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.ciega}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2  md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='cascara'>Cascara: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.cascara ? true : undefined}
            invalidFeedback={formik.errors.cascara ? String(formik.errors.cascara) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='cascara'
              onChange={formik.handleChange}
              className='py-4 w-[90%] bg-zinc-100 focus-visible:bg-zinc-200'
              value={formik.values.cascara}
            />
            </FieldWrap>
          </Validation>
        </div>

        <div className='md:row-start-3 md:col-span-2 md:col-start-5 md:flex-col flex-col lg:flex-row p-5'>
          <Label htmlFor='pepa_huerto'>Pepa Huerto: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa_huerto ? true : undefined}
            invalidFeedback={formik.errors.pepa_huerto ? String(formik.errors.pepa_huerto) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='pepa_huerto'
              onChange={formik.handleChange}
              className='py-4 w-[90%] '

              value={formik.values.pepa_huerto}
            />
            </FieldWrap>
          </Validation>
        </div>


        <div className='md:row-start-4 md:col-span-2 md:col-start-3 md:flex-col bg-green-700 flex-col lg:flex-row p-5 rounded-md'>
          <Label htmlFor='pepa' className="text-white">Pepa Bruta: </Label>
          <Validation
            isValid={formik.isValid}
            isTouched={formik.touched.pepa ? true : undefined}
            invalidFeedback={formik.errors.pepa ? String(formik.errors.pepa) : undefined}>
            <FieldWrap>
              <Input
              type='number'
              min={0}
              name='pepa'
              onChange={formik.handleChange}
              className='py-4 w-[90% bg-zinc-'
              value={formik.values.pepa}
              disabled
            />
            </FieldWrap>
          </Validation>
        </div>



        <div className='row-start-5 relative w-full h-20 col-span-2 col-start-5'>
          <Button
            variant="solid" 
            onClick={() => formik.handleSubmit()}
            className='w-full mt-6 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-3'>
            Guardar rendimiento de Muestra
          </Button>
        </div>
      </form>
      
  )
}

export default FormularioCCRendimiento





