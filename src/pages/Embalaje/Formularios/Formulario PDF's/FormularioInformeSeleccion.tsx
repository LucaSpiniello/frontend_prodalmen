// import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
// import { useLocation, useNavigate } from "react-router-dom"
// import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks"
// import { RootState } from "../../../../../redux/store"
// import dayjs from 'dayjs'
// import { Range } from 'react-date-range';
// import { useAuth } from "../../../../../context/authContext"
// import { useFormik } from "formik"
// import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils"
// import DateRangePicker from "../../../../../components/DateRange"
// import Button from "../../../../../components/ui/Button"
// import Container from "../../../../../components/layouts/Container/Container"
// import Card, { CardBody, CardHeader } from "../../../../../components/ui/Card"

// interface IInformeProduccion {
//   setOpen: Dispatch<SetStateAction<boolean>>
// }

// const FormularioInformeSeleccion: FC<IInformeProduccion> = ({ setOpen }) => {
//   const navigate = useNavigate()
//   const { pathname } = useLocation()

//   const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

//   const [state, setState] = useState<Range[]>([
// 		{
// 			startDate: dayjs().toDate(),
// 			endDate: undefined,
// 			key: 'selection',
// 		},
// 	]);


//   const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
//   const token = useAppSelector((state: RootState) => state.auth.authTokens)
//   const { verificarToken } = useAuth()

//   const formik = useFormik({
//     initialValues: {
//       desde: '',
//       hasta: ''
//     },
//     onSubmit: async (values: any) => {
//       try {
//         const token_verificado = await verificarToken(token!)
      
//         if (!token_verificado) throw new Error('Token no verificado')

//         const res = await fetchWithTokenPost(`api/seleccion/pdf_informe_seleccion/`,
//           {
//             ...values,
//             desde: state[0].startDate,
//             hasta: state[0].endDate
//           },
//           token_verificado
//         )
//         if (res.ok){
//           const data = await res.json()
//           
//           navigate('/pdf-informe-seleccion/', { state: { programas_seleccion: data, desde: state[0].startDate, hasta: state[0].endDate, pathname: pathname  }})

//         }
//       } catch (error) {
//         console.log("Algo ocurrio")
//       }
//     }
//   })

//   useEffect(() => {
//     if (state){
//       formik.setValues({
//         desde: state[0].startDate,
//         hasta: state[0].endDate
//       })
//     }
//   }, [state])


//   console.log(formik.values)

  
//   return (
//     <Container>
//       <Card>
//         <CardHeader className="text-2xl">Selecciona rango de fecha</CardHeader>
//         <CardBody>
//           <div className='flex flex-col md:flex-row lg:flex-row'>
//             <div className='w-full h-full flex flex-col'>
//               <DateRangePicker setState={setState} state={state}/>
//             </div> 
//           </div>

//           <div className='w-full  flex items-center justify-center gap-x-10'>
//             <Button
//               variant="solid"
//               color="blue"
//               size="xl"
//               onClick={() => formik.handleSubmit()}
//               className='py-3 rounded-md bg-[#198754] hover:bg-[#1da566] hover:scale-105 font-semibold text-md'
//               >
//                 Generar Informe
//             </Button>
//             <Button
//               variant="solid"
//               size="xl"
//               className='py-3 rounded-md bg-red-700 hover:bg-red-600 border-red-700 hover:border-red-600 hover:scale-105 font-semibold text-md'
//               onClick={() => setOpen(false)}
//               >
//                 Volver
//             </Button>
//           </div>
//         </CardBody>
//       </Card>

//     </Container>
//   )
// }

// export default FormularioInformeSeleccion
