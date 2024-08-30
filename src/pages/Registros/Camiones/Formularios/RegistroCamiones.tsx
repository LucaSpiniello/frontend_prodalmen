
import { useFormik } from 'formik'
import { Dispatch, FC, SetStateAction, useEffect } from 'react'
import Input from '../../../../components/form/Input'
import SelectReact from '../../../../components/form/SelectReact'
import Textarea from '../../../../components/form/Textarea'
import { camionSchema } from '../../../../utils/Validator'
import Label from '../../../../components/form/Label'
import Validation from '../../../../components/form/Validation'
import FieldWrap from '../../../../components/form/FieldWrap'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { crearCamion } from '../../../../redux/slices/camionesSlice'
import { RootState } from '../../../../redux/store'
import { optionsAcoplado } from '../../../../utils/options.constantes'
import { useAuth } from '../../../../context/authContext'
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

interface IFormCamiones {
	setOpen: Dispatch<SetStateAction<boolean>>
}

const FormularioRegistroCamiones: FC<IFormCamiones> = ({ setOpen }) => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const errors = useAppSelector((state: RootState) => state.camiones.error)
	const { verificarToken } = useAuth()

	const formik = useFormik({
		initialValues: {
			patente: '',
			acoplado: false,
			observaciones: '',
		},
		validationSchema: camionSchema,
		onSubmit: async (values) => {
      //@ts-ignore
		dispatch(crearCamion({ token, data: values, action: setOpen, verificar_token: verificarToken }))
    }
	})
	// useEffect(() => {
	// 	if (errors) {
	// 		const js_errors: {patente: string[] | undefined, observaciones: string[] | undefined, acoplado: string[] | undefined} = JSON.parse(errors)
	// 		console.log(js_errors)
	// 		if (js_errors.patente) {
	// 			formik.setFieldError('patente', js_errors.patente[0])
	// 		}
	// 		if (js_errors.acoplado) {
	// 			formik.setFieldError('acoplado', js_errors.acoplado[0])
	// 		}
	// 		if (js_errors.observaciones) {
	// 			formik.setFieldError('observaciones', js_errors.observaciones[0])
	// 		}
	// 	}
	// }, [errors])

	return (
		<form
			onSubmit={formik.handleSubmit}
			className={`mt-10 flex flex-col gap-x-3 gap-y-5
        md:grid md:grid-cols-4 relative rounded-md px-5
        py-6`}>
			<div className='items-center md:col-span-2 md:flex-col'>
				<Label htmlFor='patente'>Patente: </Label>

				<Validation
					isValid={formik.isValid}
					isTouched={formik.touched.patente ? true : undefined}
					invalidFeedback={
						formik.errors.patente
					}
					>
					<FieldWrap>
						<Input
							type='text'
							name='patente'
							onChange={formik.handleChange}
							className='py-3 text-black'
							value={formik.values.patente}
						/>
					</FieldWrap>
				</Validation>
			</div>

			<div className='flex flex-col md:col-span-2 md:col-start-3 '>
				<Label htmlFor='acoplado'>Acoplado: </Label>

				<Validation
					isValid={formik.isValid}
					isTouched={formik.touched.acoplado ? true : undefined}
					invalidFeedback={
						formik.errors.acoplado ? String(formik.errors.acoplado) : undefined
					}
					>
					<FieldWrap>
						<SelectReact
							options={optionsAcoplado}
							id='acoplado'
							placeholder='Selecciona un opción'
							name='acoplado'
							className='h-14 w-full py-2'
							onChange={(value: any) => {
								formik.setFieldValue('acoplado', value.value)
							}}
						/>
					</FieldWrap>
				</Validation>
			</div>

			<div className='items-center md:col-span-4  md:row-start-2 md:flex-col'>
				<Label htmlFor='observaciones'>Observaciones: </Label>

				<Validation
					isValid={formik.isValid}
					isTouched={formik.touched.observaciones ? true : undefined}
					invalidFeedback={
						formik.errors.observaciones
							? String(formik.errors.observaciones)
							: undefined
					}
					>
					<FieldWrap>
						<Textarea
							rows={5}
							cols={9}
							name='observaciones'
							onChange={formik.handleChange}
							value={formik.values.observaciones}
						/>
					</FieldWrap>
				</Validation>
			</div>

			<div className='relative col-span-4 h-20 w-full'>
				<button className='mt-6 w-full rounded-md bg-[#2563EB] py-3 text-white hover:bg-[#2564ebc7]'>
					Registrar Camión
				</button>
			</div>
		</form>
	)
}

export default FormularioRegistroCamiones
