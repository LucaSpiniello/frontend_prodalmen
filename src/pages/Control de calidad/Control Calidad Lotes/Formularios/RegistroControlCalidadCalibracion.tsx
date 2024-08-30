import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { TControlCalidad, TRendimientoMuestra } from "../../../../types/TypesControlCalidad.type"
import { Link, useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import toast from "react-hot-toast"
import { useFormik } from "formik"
import { calibracionSchema } from "../../../../utils/Validator"
import Label from "../../../../components/form/Label"
import Validation from "../../../../components/form/Validation"
import FieldWrap from "../../../../components/form/FieldWrap"
import Input from "../../../../components/form/Input"
import { useAuth } from "../../../../context/authContext"
import { fetchMuestrasCalibradasControlDeCalidad, fetchMuestrasControlCalidad } from "../../../../redux/slices/controlcalidadSlice"
import { fetchWithTokenPatch } from "../../../../utils/peticiones.utils"
import Button from "../../../../components/ui/Button"
import Container from "../../../../components/layouts/Container/Container"
import Card, { CardBody, CardHeader } from "../../../../components/ui/Card"
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper"
import TableTemplate from "../../../../templates/common/TableParts.template"
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { format } from "@formkit/tempo"
import Radio, { RadioGroup } from "../../../../components/form/Radio"
import { IoArrowBackSharp } from "react-icons/io5";
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

interface IFormCC {
  isOpen?: Dispatch<SetStateAction<boolean>>
  id_muestra?: number,
}
  
interface IRendimientoMuestra {
  id_lote: number
  ccLote?: TControlCalidad | null,
  setOpen?: Dispatch<SetStateAction<boolean>>
  setLote?: Dispatch<SetStateAction<TRendimientoMuestra | undefined | null | undefined>>
}



const TablaMuestrasLote : FC<IRendimientoMuestra> = ({ setLote }) => {
  const rendimiento_muestra = useAppSelector((state: RootState) => state.control_calidad.cc_muestras)
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)

  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  const formik = useFormik({
    initialValues: {
      radioOption: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });



  

  const columnHelper = createColumnHelper<TRendimientoMuestra>();
  const columns = [
		columnHelper.accessor('id', {
			cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
        return (
          <div className={`font-bold text-center  ${comprobacion && !info.row.original.es_contramuestra ? 'line-through bg-orange-700 text-white': ''}`}>
            {`${info.row.index + 1}`}
          </div>
        )
      },
			header: 'N° Muestra',
		}),
    columnHelper.display({
      id: 'peso',
      cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
				return (
					<div className={`font-bold text-center  ${comprobacion && !info.row.original.es_contramuestra ? 'line-through bg-orange-700 text-white': ''}`}>
						{`${(info.row.original.cc_rendimiento.peso_muestra_calibre ?? 0).toLocaleString()}`}  
					</div>
				)
			},
			header: 'Peso Muestra',
		}),
		columnHelper.display({
      id: 'fecha_registro',
			cell: (info) => {
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
        return (
          <div className={`font-bold text-center  ${comprobacion && !info.row.original.es_contramuestra ? 'line-through bg-orange-700 text-white': ''}`}>
            {`${format(info.row.original.fecha_creacion, { date: 'short', time: 'short'}, 'es' )}`}
          </div>
        )
      },
			header: 'Fecha Registro',
		}),
		
    columnHelper.display({
      id: 'pepa',
      cell: (info) => {
        const row = info.row.original
        const comprobacion = String(control_calidad?.esta_contramuestra) === '1' || String(control_calidad?.esta_contramuestra) === '5'
  
        return (
          <div className='h-full w-full flex justify-center gap-10'>
            {!comprobacion ? (
              <Radio
                key={row.id}
                name='radioOption'
                value={row.id}
                selectedValue={formik.values.radioOption}
                onChange={() => setLote!(row)}
                dimension='lg'
                className="!border-blue-800 rounded-full h-full"
              />
            ) : comprobacion && row.es_contramuestra 
                ? (
                  <Radio
                  key={row.id}
                  name='radioOption'
                  value={row.id}
                  selectedValue={formik.values.radioOption}
                  onChange={() => setLote!(row)}
                  dimension='lg'
                  className="!border-blue-800 rounded-full h-full"
                  />
                  )
                : null
            }
          </div>
        );
      },
      header: 'Acciones',
    }),
  ]


  const table = useReactTable({
		data: rendimiento_muestra,
		columns,
		state: {
			sorting,
			globalFilter,
		},
		onSortingChange: setSorting,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 5 },
		},
	});



  return (
    <PageWrapper name='Lista Programas Selección'>
      <Container breakpoint={null} className='w-full overflow-auto'>
        <Card className='h-full w-full'>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
}




const FormularioCCPepaCalibre: FC<IFormCC> = ({ isOpen }) => {
  const { id } = useParams()
  const ccPepa = useAppSelector((state: RootState) => state.control_calidad.cc_calibracion_muestras)
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)


  const [muestraSeleccionada, setMuestraSeleccionada] = useState<TRendimientoMuestra | null | undefined>(null)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchMuestrasCalibradasControlDeCalidad({ id, params: { id_muestra: muestraSeleccionada?.id }, token, verificar_token: verificarToken }))
  }, [])


  const actualizarEstadoContraMuestra = async (estado: string) => {
    const token_verificado = await verificarToken(token!)
  
    if (!token_verificado) throw new Error('Token no verificado')
    await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${control_calidad?.id}/`,
      {
        esta_contramuestra: estado
      },
    token_verificado
    ) 
  }

  const formik = useFormik({
    initialValues: {
      peso_muestra_calibre: 0,
      gramos_x_asignar: 0,
      pre_calibre: 0, 
      calibre_18_20: 0,
      calibre_20_22: 0,
      calibre_23_25: 0,
      calibre_25_27: 0,
      calibre_27_30: 0,
      calibre_30_32: 0,
      calibre_32_34: 0,
      calibre_34_36: 0,
      calibre_36_40: 0,
      calibre_40_mas: 0,

    },
    validationSchema: calibracionSchema,
    onSubmit: async (values: any) => {
      try {
        const token_verificado = await verificarToken(token!)
      
        if (!token_verificado) throw new Error('Token no verificado')
        const res = await fetchWithTokenPatch(`api/control-calidad/recepcionmp/${id}/muestras/${muestraSeleccionada?.id}/cdcpepa/${muestraSeleccionada?.cc_rendimiento.id}/`, 
          {
            pre_calibre: values.pre_calibre,
            calibre_18_20: values.calibre_18_20,
            calibre_20_22: values.calibre_20_22,
            calibre_23_25: values.calibre_23_25,
            calibre_25_27: values.calibre_25_27,
            calibre_27_30: values.calibre_27_30,
            calibre_30_32: values.calibre_30_32,
            calibre_32_34: values.calibre_32_34,
            calibre_34_36: values.calibre_34_36,
            calibre_36_40: values.calibre_36_40,
            calibre_40_mas: values.calibre_40_mas,
            peso_muestra_calibre: values.peso_muestra_calibre,
            cc_rendimiento: muestraSeleccionada?.id,
            cc_calibrespepaok: true,
            desviacion: values.gramos_x_asignar
          },
          token_verificado
        )
        if (res.ok) {
          if (control_calidad?.esta_contramuestra === '1' ){
            actualizarEstadoContraMuestra('5')
          }
          toast.success("la calibración fue registrada exitosamente!!")
          isOpen!(false)
          dispatch(fetchMuestrasControlCalidad({ id: parseInt(id!), token, verificar_token: verificarToken }))
        } else {
          toast.error("No se pudo registrar la calibración, volver a intentar")
          
        }
      } catch (error) {
        console.log("errores ocurren")
      }
    }
  })

  useEffect(() => {
    let isMounted = true;
  
    if (isMounted && ccPepa) {
      const ccPepaCopy = [...ccPepa];
      const primeraMuestra = ccPepaCopy.shift();
      if (primeraMuestra?.es_contramuestra) {
        formik.setFieldValue('peso_muestra_calibre', primeraMuestra?.cc_rendimiento.peso_muestra_calibre)
      }
    }
    return () => {
      isMounted = false;
    };
  }, [ccPepa]);



  const calcularPepaSana = () => {
    const {
      pre_calibre,
      calibre_18_20,
      calibre_20_22,
      calibre_22_24,
      calibre_23_25,
      calibre_25_27,
      calibre_27_30,
      calibre_30_32,
      calibre_32_34,
      calibre_34_36,
      calibre_36_40,
      calibre_40_mas,
      peso_muestra_calibre,
    } = formik.values;
  
    // Función para redondear a dos decimales
    const redondear = (valor: any) => Number(parseFloat(valor).toFixed(2));
  
    // Redondear todos los valores a dos decimales
    const preCalibreRedondeado = redondear(pre_calibre ?? 0);
    const calibre1820Redondeado = redondear(calibre_18_20 ?? 0);
    const calibre2022Redondeado = redondear(calibre_20_22 ?? 0);
    const calibre2224Redondeado = redondear(calibre_22_24 ?? 0);
    const calibre2325Redondeado = redondear(calibre_23_25 ?? 0);
    const calibre2527Redondeado = redondear(calibre_25_27 ?? 0);
    const calibre2730Redondeado = redondear(calibre_27_30 ?? 0);
    const calibre3032Redondeado = redondear(calibre_30_32 ?? 0);
    const calibre3234Redondeado = redondear(calibre_32_34 ?? 0);
    const calibre3436Redondeado = redondear(calibre_34_36 ?? 0);
    const calibre3640Redondeado = redondear(calibre_36_40 ?? 0);
    const calibre40MasRedondeado = redondear(calibre_40_mas ?? 0);
    const pesoMuestraCalibreRedondeado = redondear(peso_muestra_calibre ?? 0);
  
    // Calcular la suma de los otros campos redondeados
    const sumaOtrosCampos =
      preCalibreRedondeado +
      calibre1820Redondeado +
      calibre2022Redondeado +
      calibre2224Redondeado +
      calibre2325Redondeado +
      calibre2527Redondeado +
      calibre2730Redondeado +
      calibre3032Redondeado +
      calibre3234Redondeado +
      calibre3436Redondeado +
      calibre3640Redondeado +
      calibre40MasRedondeado;
  
    // Calcular el resultado final y redondearlo
    const gramos_x_asignar_final = redondear(pesoMuestraCalibreRedondeado - sumaOtrosCampos);
  
    return gramos_x_asignar_final // Asegúrate de que el valor no sea negativo
  };
  

  useEffect(() => {
    const updatedValues = { ...formik.values, gramos_x_asignar: calcularPepaSana() };
    formik.setValues(updatedValues);
  }, [
    formik.values.peso_muestra_calibre,
    formik.values.pre_calibre,
    formik.values.calibre_18_20,
    formik.values.calibre_20_22,
    formik.values.calibre_23_25,
    formik.values.calibre_25_27,
    formik.values.calibre_27_30,
    formik.values.calibre_30_32,
    formik.values.calibre_32_34,
    formik.values.calibre_34_36,
    formik.values.calibre_36_40,
    formik.values.calibre_40_mas
    ]);


  const total = parseFloat(formik.values.pre_calibre ?? 0)
      + parseFloat(formik.values.calibre_18_20 ?? 0)
      + parseFloat(formik.values.calibre_20_22 ?? 0) 
      + parseFloat(formik.values.calibre_22_24 ?? 0) 
      + parseFloat(formik.values.calibre_23_25 ?? 0) 
      + parseFloat(formik.values.calibre_25_27 ?? 0) 
      + parseFloat(formik.values.calibre_27_30 ?? 0) 
      + parseFloat(formik.values.calibre_30_32 ?? 0)
      + parseFloat(formik.values.calibre_32_34 ?? 0)
      + parseFloat(formik.values.calibre_34_36 ?? 0)
      + parseFloat(formik.values.calibre_36_40 ?? 0)
      + parseFloat(formik.values.calibre_40_mas ?? 0)


      
  useEffect(()  => {
    if (muestraSeleccionada) {
      formik.setFieldValue('peso_muestra_calibre', (muestraSeleccionada.cc_rendimiento.peso_muestra_calibre ?? 0).toFixed(2))
    }
  }, [muestraSeleccionada])


  
  return (
    <Container breakpoint={null} className="w-full !mx-0 !p-0">
      {
        muestraSeleccionada
          ? (
            <div className="w-full relative -top-3">
              <Button
                variant="outline"
                className="hover:bg-blue-500 hover:text-white"
                size='xl'
                onClick={() => setMuestraSeleccionada(null)}
                >
                  <IoArrowBackSharp  />
              </Button>
            </div>
          )
          : null
      }
      {
        muestraSeleccionada
        
        ? (
          <Card >
            <CardHeader>
              <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-x-10">
                <div className='p-4 bg-green-500 h-full rounded-md w-full '>
                  
                  <Label className='text-white' htmlFor='peso_muestra_calibre'>Peso Resultante Pepa Sana: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.peso_muestra_calibre ? true : undefined}
                    invalidFeedback={formik.errors.peso_muestra_calibre ? String(formik.errors.peso_muestra_calibre) : undefined}

                    >
                    <FieldWrap>
                      <Input
                        type='number'
                        
                        name='peso_muestra_calibre'
                        onChange={formik.handleChange}
                        className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-100 focus:bg-zinc-200 '
                        value={formik.values.peso_muestra_calibre}
                      />
                    </FieldWrap>
                  </Validation>
                  
                </div>

                <div className='p-4 bg-orange-500 h-full rounded-md w-full'>
                  <Label className='text-white'  htmlFor='gramos_x_asignar'>Pepa Sana Restante Calibración: </Label>
                  <Validation
                    isValid={formik.isValid}
                    isTouched={formik.touched.gramos_x_asignar ? true : undefined}
                    invalidFeedback={formik.errors.gramos_x_asignar ? String(formik.errors.gramos_x_asignar) : undefined}>
                    <FieldWrap>
                      <Input
                      type='number'
                    
                      name='gramos_x_asignar'
                      onChange={formik.handleChange}
                      className='py-2 w-[100%] bg-zinc-100 focus-visible:bg-zinc-200'
                      value={formik.values.gramos_x_asignar}
                    />
                    </FieldWrap>
                  </Validation>
                  
                </div>
              </div>
            </CardHeader> 
            <CardBody className="w-full lg:grid gap-x-5">
              <div className='md:row-start-2 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row w-full'>
                <Label htmlFor='pre_calibre'>Pre Calibre: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.pre_calibre ? true : undefined}
                  invalidFeedback={formik.errors.pre_calibre ? String(formik.errors.pre_calibre) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='pre_calibre'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200 '
                    value={formik.values.pre_calibre}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-2 md:col-span-2 md:col-start-3 h-full md:flex-col flex-col py-3 lg:flex-row w-full '>
                <Label htmlFor='calibre_18_20'>Calibre  18/20: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_18_20 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_18_20 ? String(formik.errors.calibre_18_20) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_18_20'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_18_20}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-2 md:col-span-2 md:col-start-5 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_20_22'>Calibre 20/22: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_20_22 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_20_22 ? String(formik.errors.calibre_20_22) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_20_22'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_20_22}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-2 md:col-span-2 md:col-start-7 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_23_25'>Calibre 23/25: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_23_25 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_23_25 ? String(formik.errors.calibre_23_25) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_23_25'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_23_25}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-3 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_25_27'>Calibre 25/27: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_25_27 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_25_27 ? String(formik.errors.calibre_25_27) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_25_27'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_25_27}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-3 md:col-start-3 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_27_30'>Calibre 27/30: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_27_30 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_27_30 ? String(formik.errors.calibre_27_30) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_27_30'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_27_30}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-3 md:col-start-5 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_30_32'>Calibre 30/32: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_30_32 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_30_32 ? String(formik.errors.calibre_30_32) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_30_32'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_30_32}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-3 md:col-start-7 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_32_34'>Calibre 32/34: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_32_34 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_32_34 ? String(formik.errors.calibre_32_34) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_32_34'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_32_34}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-4 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_34_36'>Calibre 34/36: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_34_36 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_34_36 ? String(formik.errors.calibre_34_36) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_34_36'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_34_36}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-4 md:col-span-2 md:col-start-3 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_36_40'>Calibre 36/40: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_36_40 ? true : undefined}
                  invalidFeedback={formik.errors.calibre_36_40 ? String(formik.errors.calibre_36_40) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    
                    name='calibre_36_40'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_36_40}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='md:row-start-4 md:col-start-5 md:col-span-2 md:flex-col flex-col py-3 lg:flex-row h-full'>
                <Label htmlFor='calibre_40_mas'>Calibre 40/mas: </Label>

                <Validation
                  isValid={formik.isValid}
                  isTouched={formik.touched.calibre_40_mas ? true : undefined}
                  invalidFeedback={formik.errors.calibre_40_mas ? String(formik.errors.calibre_40_mas) : undefined}>
                  <FieldWrap>
                    <Input
                    type='number'
                    name='calibre_40_mas'
                    onChange={formik.handleChange}
                    className='py-2 w-full bg-zinc-100 focus-visible:bg-zinc-200'
                    value={formik.values.calibre_40_mas}
                  />
                  </FieldWrap>
                </Validation>
              </div>

              <div className='row-start-6 col-start-7 relative w-full h-full col-span-2'>
              {
                // formik.values.peso_muestra_calibre !== (total ?? 0).toFixed(2)
                  // ? null
                  // : (
                    <Button
                        variant='solid'
                        onClick={() => formik.handleSubmit()}
                        className='w-full top-10 bg-[#2563EB] hover:bg-[#2564ebc7] rounded-md text-white py-2'>
                        Calibrar Muestra Lote
                      </Button>
                    // ) 
                }
              </div>
            </CardBody>
            
          </Card>
        )
        : (
          <div>
            <TablaMuestrasLote id_lote={22} setLote={setMuestraSeleccionada} />
          </div>  
        )

      }
    </Container>
      
  )
}

export default FormularioCCPepaCalibre





