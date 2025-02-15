import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import PageWrapper from '../../components/layouts/PageWrapper/PageWrapper';
import { useAuth } from '../../context/authContext';
import Container from '../../components/layouts/Container/Container';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../components/layouts/Subheader/Subheader';
import Card, { CardBody } from '../../components/ui/Card';
import Button, { IButtonProps } from '../../components/ui/Button';
import { TIcons } from '../../types/icons.type';
import Label from '../../components/form/Label';
import Input from '../../components/form/Input';
import Avatar from '../../components/Avatar';
import useSaveBtn from '../../hooks/useSaveBtn';
import FieldWrap from '../../components/form/FieldWrap';
import Icon from '../../components/icon/Icon';
import Badge from '../../components/ui/Badge';
import Radio, { RadioGroup } from '../../components/form/Radio';
import useDarkMode from '../../hooks/useDarkMode';
import { TDarkMode } from '../../types/darkMode.type';
import SelectReact, { TSelectOptions } from '../../components/form/SelectReact';

const options: TSelectOptions = [
	{ value: '2025', label: '2025' },
	{ value: '2024', label: '2024' },
	{ value: '2023', label: '2023'},
	{ value: '2022', label: '2022'},
	{ value: '2021', label: '2021'}
];

const options_balanza_recepcion: TSelectOptions = [
	{ value: 'Manual', label: 'Manual'},
	{ value: 'Automático', label: 'Automático'}
]

import fotoPerfil from '../../assets/avatar/user6-thumb.png'
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { GUARDAR_USER, actualizarPersonalizacion, actualizarUsuario } from '../../redux/slices/authSlice';
import { fetchWithTokenPost, fetchWithTokenPut, fetchWithTokenPutWithFiles } from '../../utils/peticiones.utils';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

type TTab = {
	text:
		| 'Perfil'
		| 'Personalización'
		| 'Permisos'
	icon: TIcons;
};
type TTabs = {
	[key in
		| 'PERFIL'
		| 'PERSONALIZACION']: TTab;
};

const TAB: TTabs = {
	PERFIL: {
		text: 'Perfil',
		icon: 'HeroPencil',
	},
	PERSONALIZACION: {
		text: 'Personalización',
		icon: 'HeroSwatch',
	},
	// PERMISOS: {
	// 	text: 'Permisos',
	// 	icon: 'HeroShieldExclamation'
	// }
};

const ProfilePage = () => {
	const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
	const personalizacion = useAppSelector((state: RootState) => state.auth.personalizacion)
	const token = useAppSelector((state: RootState) => state.auth.authTokens)
	const [cambiarPassword, setCambiarPassword] = useState(false)
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
	const { verificarToken } = useAuth()

	const { setDarkModeStatus } = useDarkMode();
	const [activeTab, setActiveTab] = useState<TTab>(TAB.PERFIL);

	const defaultProps: IButtonProps = {
		color: 'zinc',
	};
	const activeProps: IButtonProps = {
		...defaultProps,
		isActive: true,
		color: 'blue',
		colorIntensity: '500',
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isSaving, setIsSaving] = useState<boolean>(false);

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			email: perfil?.email,
			first_name: perfil?.first_name,
			second_name: perfil?.second_name,
			last_name: perfil?.last_name,
			second_last_name: perfil?.second_last_name,
			fecha_nacimiento: perfil?.fecha_nacimiento,
			rut: perfil?.rut,
			genero: perfil?.genero,
			image: perfil?.image,
			comercializador: perfil?.comercializador,
		},
		onSubmit: async (values: any) => {
			const formData = new FormData()
			formData.append('email', values.email)
			formData.append('first_name', values.first_name)
			formData.append('second_name', values.second_name)
			formData.append('last_name', values.last_name)
			formData.append('second_last_name', values.second_last_name)
			formData.append('fecha_nacimiento', values.fecha_nacimiento)
			formData.append('rut', values.rut)
			formData.append('genero', values.genero)
			if (values.image instanceof File){
				formData.append('image', values.image)
			}
			dispatch(actualizarUsuario({ token, verificar_token: verificarToken, data: formData }))
	}})

	const formik_personalizacion = useFormik({
		enableReinitialize: true,
		initialValues: {
			estilo: personalizacion?.estilo,
			cabecera: personalizacion?.cabecera,
			anio: personalizacion?.anio,
			iot_balanza_recepcionmp: personalizacion?.iot_balanza_recepcionmp
		},	
		onSubmit: (values) => {
			// @ts-ignore
			dispatch(actualizarPersonalizacion({ data: {usuario: perfil?.id, ...values }, token, id: perfil.id , mensaje: 'Perfil actualizado', verificar_token: verificarToken }))
		}
	})


	const formik_contraseña = useFormik({
		initialValues: {
			new_password: '',
			re_new_password: '',
			current_password: '',
		},
		onSubmit: async (values) => {
			const token_verificado = await verificarToken(token!)
	
			if (!token_verificado) throw new Error('Token no verificado')
			
			const res = await fetchWithTokenPost(`auth/users/set_password/`,{ ...values }, token_verificado)
			if (res.ok){
				toast.success('Contraseña actualizada!')
			} else {
				toast.error('No se pudo cambiar la contraseña')
			}
		}
	})



	useEffect(() => {
		setDarkModeStatus(formik_personalizacion.values.estilo as TDarkMode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [formik_personalizacion.values.estilo]);

	const { saveBtnText, saveBtnColor, saveBtnDisable } = useSaveBtn({
		isNewItem: false,
		isSaving,
		isDirty: formik.dirty || formik_personalizacion.dirty,
	});
	return (
		<PageWrapper name='Perfil'>
			<Subheader>
				<SubheaderLeft>
					<Badge
						color='blue'
						variant='outline'
						rounded='rounded-full'
						className='border-transparent'>
						{`${perfil?.first_name} ${perfil?.last_name}`}{' '}
					</Badge>
				</SubheaderLeft>
				<SubheaderRight>
					<Button
						icon='HeroServer'
						variant='solid'
						color={saveBtnColor}
						isDisable={saveBtnDisable}
						onClick={() => {
								if (activeTab.text === 'Perfil') {
										formik.handleSubmit();
								} else if (activeTab.text === 'Personalización') {
										formik_personalizacion.handleSubmit();
								} else if (activeTab.text === 'Permisos') {
										// Aquí puedes manejar la lógica para enviar la petición correspondiente a los permisos
										// Por ejemplo, puedes llamar a una función que maneje esta petición
										// handlePermissionsRequest();
								}
						}}
						>
						{saveBtnText}
					</Button>
				</SubheaderRight>
			</Subheader>
			<Container breakpoint={null} className='w-full h-full'>
				<Card className='h-full'>
					<CardBody>
						<div className='grid grid-cols-12 gap-4'>
							<div className='col-span-12 flex gap-4 max-sm:flex-wrap sm:col-span-4 sm:flex-col md:col-span-2'>
								{Object.values(TAB).map((i) => (
									<div key={i.text}>
										<Button
											icon={i.icon}
											// eslint-disable-next-line react/jsx-props-no-spreading
											{...(activeTab.text === i.text
												? {
														...activeProps,
												  }
												: {
														...defaultProps,
												  })}
											onClick={() => {
												setActiveTab(i);
											}}>
											{i.text}
										</Button>
									</div>
								))}

							</div>
							<div className='col-span-12 flex flex-col gap-4 sm:col-span-8 md:col-span-10'>
								{activeTab === TAB.PERFIL && (
									<>
										<div className='text-4xl font-semibold'>Perfil</div>
										<div className='flex w-full gap-4'>
											<div className='flex-shrink-0 items-center justify-center'>
												<Avatar
													src={formik.values.image && formik.values.image instanceof File
														? URL.createObjectURL(formik.values.image) 
														: perfil?.image
															? perfil.image
															: fotoPerfil
													}
													className='!w-32'
													name={`${perfil?.first_name} ${perfil?.last_name}`}
												/>
											</div>
											<div className='w-full flex flex-col md:flex-row lg:flex-row items-center justify-between'>
												<div className='w-full lg:w-64'>
													<div className="flex items-center justify-center w-full">
														<label htmlFor="fileUpload" className="flex flex-col items-center justify-center w-full h-64  lg:h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:hover:border-gray-500">
																<div className="flex flex-col items-center justify-center pt-5 pb-6">
																		<svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
																				<path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
																		</svg>
																		<p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
																		<p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
																</div>
																<input 
																	id="fileUpload" 
																	type="file" 
																	className="hidden" 
																	onChange={async (e) => {
																		if (e.target.files) {
																			// @ts-ignore
																			formik.setFieldValue('image', e.currentTarget.files[0])
																		}
																	}}
																	
																	/>
														</label>
													</div>
												</div>
												
											{
												cambiarPassword
													? (
														<div className='col-span-12 lg:col-span-6'>
															<Button
																variant='solid'
																className='bg-red-700 hover:bg-red-600 border-red-700 hover:border-red-600'
																onClick={() => {
																	setCambiarPassword(false)
																}}
																>
																Cancelar
															</Button>
														</div>
														)
													: (
														<div className='col-span-12 lg:col-span-6'>
															<Button
																variant='solid'
																color= 'blue'
																onClick={() => {
																	setCambiarPassword(true)
																}}
																>
																Cambiar Contraseña
															</Button>
														</div>
														)
											}
											</div>
										</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='email'>E-mail</Label>
												<FieldWrap
													firstSuffix={
														<Icon
															icon='HeroEnvelope'
															className='mx-2'
														/>
													}>
													<Input
														id='email'
														name='email'
														onChange={formik.handleChange}
														value={formik.values.email}
														autoComplete='email'
													/>
												</FieldWrap>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='first_name'>Nombre</Label>
												<Input
													id='first_name'
													name='first_name'
													onChange={formik.handleChange}
													value={formik.values.first_name}
													autoComplete='given-name'
													autoCapitalize='words'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='last_name'>Apellido</Label>
												<Input
													id='last_name'
													name='last_name'
													onChange={formik.handleChange}
													value={formik.values.last_name}
													autoComplete='family-name'
													autoCapitalize='words'
												/>
											</div>
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='fecha_nacimiento'>Fecha de Nacimiento</Label>
												<Input
													type='date'
													id='fecha_nacimiento'
													name='fecha_nacimiento'
													onChange={formik.handleChange}
													value={formik.values.fecha_nacimiento}
													autoComplete='bday'
												/>
											</div>
											{
												perfil?.rut === null
													? (
														<div className='col-span-12 lg:col-span-12'>
															<Label htmlFor='rut'>Rut</Label>
															<Input
																id='rut'
																name='rut'
																onChange={formik.handleChange}
																value={formik.values.rut}
																autoComplete='rut'
															/>
														</div>
													)
													: null
											}

											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='celular'>Celular</Label>
												<Input
													id='celular'
													name='celular'
													onChange={formik.handleChange}
													value={formik.values.celular}
													autoComplete='celular'
												/>
											</div>
											
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='genero'>Género</Label>
												<RadioGroup isInline >
													<Radio
														label='Femenino'
														name='genero'
														value='2'
														selectedValue={formik.values?.genero == '2' ? formik.values?.genero : ''}
														onChange={formik.handleChange}
													/>
													<Radio
														label='Masculino'
														name='genero'
														value='1'
														selectedValue={formik.values?.genero == '1' ? formik.values?.genero : ''}
														onChange={formik.handleChange}
													/>
													<Radio
														label='No Especificado'
														name='genero'
														value='0'
														selectedValue={formik.values?.genero == '0' ? formik.values?.genero : ''}
														onChange={formik.handleChange}
													/>
												</RadioGroup>
												
											</div>

											

											{
												cambiarPassword
													? (
														<div className='col-span-12 lg:col-span-6'>
																<Label htmlFor='currrent_password'>Contraseña Actual</Label>
																<Input
																	id='current_password'
																	name='current_password'
																	onChange={formik_contraseña.handleChange}
																	value={formik_contraseña.values.current_password}
																/>
															</div>
													)
													: null
											}

											{
												formik.values.current_password
													? (
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='new_password'>Nueva Contraseña</Label>
															<Input
																id='new_password'
																name='new_password'
																onChange={formik_contraseña.handleChange}
																value={formik_contraseña.values.new_password}
															/>
														</div>
														)
													: null
											}

											{
												formik.values.new_password
													? (
														<div className='col-span-12 lg:col-span-6'>
															<Label htmlFor='re_new_password'>Contraseña Actual</Label>
															<Input
																id='re_new_password'
																name='re_new_password'
																onChange={formik_contraseña.handleChange}
																value={formik_contraseña.values.re_new_password}
															/>
														</div>
														)
													: null
											}

											{
												formik.values.new_password && formik.values.re_new_password && formik.values.current_password
													? (
														<div className='col-span-12 lg:col-span-6 relative top-8'>
															<Button
																variant='solid'
																color= 'blue'
																onClick={() => {
																	formik_contraseña.handleSubmit()
																	setCambiarPassword(false)
																}}
																>
																Guardar Nueva Contraseña
															</Button>
														</div>
														)
													: null
											}
											
											{/* 
											<div className='col-span-12 lg:col-span-6'>
												<Label htmlFor='comuna'>Comuna</Label>
												<Input
													id='comuna'
													name='comuna'
													onChange={formik.handleChange}
													value={formik.values.comuna}
													autoComplete='comuna'
												/>
											</div>
											
											 */}
										</div>
									</>
								)}
								{activeTab === TAB.PERSONALIZACION && (
									<>
										<div className='text-4xl font-semibold'>Personalización</div>
										<div className='grid grid-cols-12 gap-4'>
											<div className='col-span-12'>
												<Label htmlFor='estilo'>Tema</Label>
												<RadioGroup isInline>
													<Radio
														name='estilo'
														value='dark'
														selectedValue={formik_personalizacion.values.estilo}
														onChange={formik_personalizacion.handleChange}
													>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-950'>
																<div className='h-full w-1/4 border-e border-zinc-800/50 bg-zinc-900/75' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-800/50 bg-zinc-900/75' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
													<Radio
														name='estilo'
														value='light'
														selectedValue={formik_personalizacion.values.estilo}
														onChange={formik_personalizacion.handleChange}
														>
														<div className='relative'>
															<div className='flex h-2 w-full items-center gap-1 bg-zinc-500 p-1'>
																<div className='h-1 w-1 rounded-full bg-red-500' />
																<div className='h-1 w-1 rounded-full bg-amber-500' />
																<div className='h-1 w-1 rounded-full bg-emerald-500' />
															</div>
															<div className='flex aspect-video w-56 bg-zinc-100'>
																<div className='h-full w-1/4 border-e border-zinc-300/25 bg-white' />
																<div className='h-full w-3/4'>
																	<div className='h-4 w-full border-b border-zinc-300/25 bg-white' />
																	<div />
																</div>
															</div>
														</div>
													</Radio>
												</RadioGroup>
											</div>
											<div className="col-span-12">
												<Label htmlFor='anio'>Año</Label>
												<SelectReact
													placeholder="Seleccione un año"
													options={options}
													id='anio'
													name='anio'
													value={options.find(option => option?.value === formik_personalizacion.values.anio)}
													onChange={(value: any) => formik_personalizacion.setFieldValue('anio', value.value)}
												/>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</CardBody>
				</Card>
			</Container>
		</PageWrapper>
	);
};

export default ProfilePage;
