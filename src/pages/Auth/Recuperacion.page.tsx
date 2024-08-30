import React, { Dispatch, FC, SetStateAction,  } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import Validation from '../../components/form/Validation';
import FieldWrap from '../../components/form/FieldWrap';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';


type TValues = {
	email: string;
};

interface IRecoveryPageProps {
	setOpen: Dispatch<SetStateAction<boolean>>
}

const RecoveryPage: FC<IRecoveryPageProps> = ({ setOpen }) => {
	const base_url = process.env.VITE_BASE_URL

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validate: (values: TValues) => {
			const errors: Partial<TValues> = {};

			if (!values.email) {
				errors.email = 'Requerido';
			}

			return errors;
		},
		onSubmit: async (values: TValues) => {
			try {
				const res = await fetch(`${base_url}/auth/users/reset_password/`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						...values
					})
				})

				if (res.ok){
					toast.success("Email de reestablecimiento enviado con exito")
					setOpen(false)
				}
			} catch (error) {
			}	
		},
	});

	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Sign In'>
			<div className='container mx-auto flex h-full items-center justify-center mt-10'>
				<div className='flex max-w-sm flex-col gap-8'>
					<div className='flex items-center justify-center'>
						<span className='text-4xl font-semibold text-center'>Prodalmen</span>
					</div>
					<div>
						<span>Enviaremos un enlace de recuperación</span>
					</div>
					<form className='flex flex-col gap-4' noValidate onSubmit={formik.handleSubmit}>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Label htmlFor='email'>Email: </Label>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.email}
								invalidFeedback={formik.errors.email}
								>
								<FieldWrap>
									<Input
										className='p-2'
										id='email'
										autoComplete='email'
										name='email'
										placeholder='Email'
										value={formik.values.email}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
					
						<div className='flex p-2'>
							<Button
								variant='solid'
								onClick={() => formik.handleSubmit()}>
								Enviar Enlace de Recuperación
							</Button>
						</div>
					</form>
					<div>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
};

export default RecoveryPage;
