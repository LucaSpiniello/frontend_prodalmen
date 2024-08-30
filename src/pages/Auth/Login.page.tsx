import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import DarkModeSwitcherPart from '../../templates/layouts/Asides/_parts/DarkModeSwitcher.part';
import Validation from '../../components/form/Validation';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Input from '../../components/form/Input';
import Button from '../../components/ui/Button';
import ModalForm from '../../components/ModalForm.modal';
import RecoveryPage from './Recuperacion.page';
import { useKeyPress } from 'react-use'


type TValues = {
	email: string;
	password: string;
};

const LoginPage = () => {
	// const { onLogin } = useAuth();
	const { onLogin } = useAuth();
	const [touched, setTouched] = useState<boolean>()
	const [passwordShowStatus, setPasswordShowStatus] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false)
	const key = useKeyPress('Enter')



	useEffect(() => {
		if (key[0]){
			formik.handleSubmit()
		}

		return () => {}
	}, [key])


	const formik = useFormik({
		initialValues: {
			email: '',
			password: '',
		},
		validate: (values: TValues) => {
			const errors: Partial<TValues> = {};

			if (!values.email) {
				errors.email = 'Requerido';
			}

			if (!values.password) {
				errors.password = 'Requerido';
			}

			return errors;
		},
		onSubmit: (values: TValues) => {
			onLogin(values.email, values.password)
		},
	});

	return (
		<PageWrapper isProtectedRoute={false} className='bg-white dark:bg-inherit' name='Sign In'>
			<div className='container mx-auto flex h-full items-center justify-center'>
				<div className='flex max-w-sm flex-col gap-8'>
					<div className='h-full flex flex-col items-center gap-y-5'>
						<img src="/src/assets/prodalmen_foto.png" alt="" className='h-56 w-full object-cover rounded-md'/>
						<span className='text-2xl font-semibold text-center'>Iniciar Sesión para continuar</span>
					</div>
					<div className='border border-zinc-500/25 dark:border-zinc-500/50' />
					<div>
						<DarkModeSwitcherPart />
					</div>


					<form className='flex flex-col gap-4' noValidate>
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.email}
								invalidFeedback={formik.errors.email}
								>
								<FieldWrap
									firstSuffix={<Icon icon='HeroEnvelope' className='mx-2' />}>
									<Input
										dimension='lg'
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
						<div
							className={classNames({
								'mb-2': !formik.isValid,
							})}>
							<Validation
								isValid={formik.isValid}
								isTouched={formik.touched.password}
								invalidFeedback={formik.errors.password}
								>
								<FieldWrap
									firstSuffix={<Icon icon='HeroKey' className='mx-2' />}
									lastSuffix={
										<Icon
											className='mx-2 cursor-pointer'
											icon={passwordShowStatus ? 'HeroEyeSlash' : 'HeroEye'}
											onClick={() => {
												setPasswordShowStatus(!passwordShowStatus);
											}}
										/>
									}>
									<Input
										dimension='lg'
										type={passwordShowStatus ? 'text' : 'password'}
										autoComplete='current-password'
										id='password'
										name='password'
										placeholder='Contraseña'
										value={formik.values.password}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
									/>
								</FieldWrap>
							</Validation>
						</div>
						<div>
							<Button
								size='lg'
								variant='solid'
								className='w-full font-semibold'
								onClick={() => {
									formik.handleSubmit()
									setTouched(true)
								}}>
								Ingresar
							</Button>
						</div>
					</form>

					<div>
						<span className='flex w-full gap-2 text-sm'>
							<span className='text-zinc-400 dark:text-zinc-600 text-md'>
								¿Olvido su contraseña?
							</span>
							<ModalForm
								title='Restablecimiento de Contraseña'
								open={open}
								setOpen={setOpen}
								size={500}
								variant='outline'
								width='dark:!text-white !text-black w-full h-10'
								textButton='Restablecer contraseña'>
								<RecoveryPage setOpen={setOpen}/>
							</ModalForm>
						</span>
					</div>

				</div>
			</div>
		</PageWrapper>
	);
};

export default LoginPage;
