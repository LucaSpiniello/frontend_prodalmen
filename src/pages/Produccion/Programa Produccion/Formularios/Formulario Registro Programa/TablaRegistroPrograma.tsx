import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { HTMLProps, useEffect, useRef, useState } from 'react'
import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from '../../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { TEnvasePatio, TPatioTechadoEx } from '../../../../../types/TypesBodega.types';
import { useAuth } from '../../../../../context/authContext';
import { fetchLotesParaProduccion, fetchPatioTechadoExterior } from '../../../../../redux/slices/bodegaSlice';
import ModalForm from '../../../../../components/ModalForm.modal';
import EnvasesEnGuiaList from './ListaEnvasesSeleccionables';
import { fetchWithTokenPost, fetchWithTokenPostAction } from '../../../../../utils/peticiones.utils';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { HeroEye } from '../../../../../components/icon/heroicons';
import Tooltip from '../../../../../components/ui/Tooltip';
import Button from '../../../../../components/ui/Button';
import { MdIndeterminateCheckBox } from 'react-icons/md';
import Checkbox from '../../../../../components/form/Checkbox';
// import { GUARDAR_LOTES_PREVIAMENTE, QUITAR_LOTES_PREVIAMENTE } from '../../../../../redux/slices/produccionSlice';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import Label from '../../../../../components/form/Label';
import SelectReact, { TSelectOptions } from '../../../../../components/form/SelectReact';
import { fetchProductores } from '../../../../../redux/slices/productoresSlice';
import { optionsVariedad } from '../../../../../utils/options.constantes';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';

const TablaRegistroPrograma = () => {
  const { id } = useParams()
  const { pathname } = useLocation()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const navigate = useNavigate()
  
  const lotes_patio = useAppSelector((state: RootState) => state.bodegas.lotes_para_produccion)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const productores = useAppSelector((state: RootState) => state.productores.productores)

  const lotes_previamente = useAppSelector((state) => state.programa_produccion.lotes_pre);
  const [rowSelection, setRowSelection] = React.useState({});
  const [envases, setEnvases] = useState('')
  const [pksGuias, setPksGuias] = useState<number[]>([])
  const [disable, setDisable] = useState<boolean>(false)


  // useEffect(() => {
  //   if (lotes_previamente && Object.keys(rowSelection).length > 0) {
  //     //@ts-ignore
  //     const envasesCalculados = [];
  //     Object.keys(rowSelection).forEach(index => {
  //       const loteIndex = parseInt(index);
  //       console.log(loteIndex, lotes_previamente)
  //       if (lotes_previamente[loteIndex] && lotes_previamente[loteIndex].envases) { 
  //         //@ts-ignore
  //         lotes_previamente[loteIndex].envases.forEach(envase => {
  //           envasesCalculados.push(envase.id)
  //         });
  //       }
  //     });
  //     //@ts-ignore
  //     setEnvases(envasesCalculados.join(','));
  //   } else {
  //     setEnvases('')
  //   }
  // }, [lotes_previamente, rowSelection])

  useEffect(() => {
    if (productores.length < 1){
      //@ts-ignore
      dispatch(fetchProductores({ token, verificar_token: verificarToken }))
    }
  }, [productores])

  // useEffect(() => {
  //   const selectedKeys = Object.keys(rowSelection);
  //   const selectedIndexes = selectedKeys.map(key => parseInt(key));
  //   // const lotes_encontrados = lotes_patio.filter((_item, index) => selectedIndexes.includes(index));
  //   console.log(selectedIndexes)
  //   console.log(table.getRowModel())
  //   // table.getRowModel()
  //   // if (lotes_encontrados.length > 0) {
  //   //   dispatch(GUARDAR_LOTES_PREVIAMENTE(lotes_encontrados));
  //   // } else {
  //   //   dispatch(QUITAR_LOTES_PREVIAMENTE({ selectedIndexes }));
  //   // }


  // }, [rowSelection]);
  
  useEffect(() => {
    //@ts-ignore
    dispatch(fetchLotesParaProduccion({ token, verificar_token: verificarToken }))
  }, [])

  const registrarLoteAProduccion = async () => {
    try {
      const token_verificado = await verificarToken(token!)
       if (!token_verificado) throw new Error('Token no verificado')
       const response = await fetchWithTokenPost(`api/produccion/${id}/lotes_en_programa/registrar_lotes/`, {pks_guias: pksGuias},token_verificado)
       if (response.ok){
        setDisable(false)
        toast.success('Envases agregados exitosamente')
        dispatch(fetchPatioTechadoExterior({ token, verificar_token: verificarToken}))
        navigate(`/pro/produccion/programa/${id}`, { replace: true })
       } else {
        console.log('errores')
        setDisable(false)
       }

      } catch (error) {
        setDisable(false)
        console.log('error paso por el catch')
    }
  }

  // function IndeterminateCheckbox({
  //   indeterminate,
  //   className = '',
  //   ...rest
  // }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  //   const ref = useRef<HTMLInputElement>(null);
  
  //   useEffect(() => {
  //     if (ref.current && typeof indeterminate === 'boolean') {
  //       ref.current.indeterminate = indeterminate;
  //     }
  //   }, [ref, indeterminate]);
  
  //   const handleChange = (e: CheckboxChangeEvent) => {
  //     const { checked } = e.target;
  //     if (rest.onChange) {
  //       rest.onChange({
  //         target: {
  //           ...rest,
  //           checked,
  //         },
  //       } as unknown as React.ChangeEvent<HTMLInputElement>);
  //     }
  //   };
  
  //   return (
  //     <Checkbox
  //       {...rest}
  //       ref={ref}
  //       indeterminate={indeterminate}
  //       className={className + 'w-40  cursor-pointer'}
  //       //@ts-ignore
  //       onChange={handleChange}
  //     />
  //   );
  // }

  const columnHelper = createColumnHelper<TPatioTechadoEx>();
  const columns = [
    columnHelper.display({
      id: 'checkboxes',
			cell: (info) => (
          <Checkbox
            id={`${info.row.original.id}`}
            onChange={(e) => {
              const { id, checked } = e.target;
              if (checked) {
                setPksGuias([...pksGuias, Number(id)]);
              } else {
                setPksGuias(pksGuias.filter(pk => pk !== Number(id)));
              }
            }}
            checked={pksGuias.includes(info.row.original.id)}
          />
      ),
      header: ''
		}),
		columnHelper.display({
      id: 'guia_patio',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.id}`}
				</div>
			),
			header: 'Guía Patio',
		}),
    columnHelper.display({
      id: 'numero_lote',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_lote}`}
				</div>
			),
			header: 'N° Lote',
		}),
    columnHelper.accessor('productor', {
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.productor}`}
				</div>
			),
			header: 'Productor',
		}),
    columnHelper.accessor('variedad', {
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.variedad}`}
				</div>
			),
			header: 'Variedad',
		}),
    columnHelper.display({
      id: 'modal_envases',
			cell: (info) => {
        const row = info.row.original.envases
        const [open, setOpen] = useState(false)

        return (
          <div className='font-bold text-center'>
            <ModalForm
              title='Envases en Lote'
              open={open}
              setOpen={setOpen}
              variant='solid'
              width={`w-[80%] py-1 h-14 mx-auto flex items-center justify-center bg-blue-700 hover:bg-blue-600 rounded-md`}
              textButton={`${row.filter(envase => envase.estado_envase !== '2' && envase.estado_envase !== '3').length} Envases en Guía`}
              >
              <EnvasesEnGuiaList row={row.filter(envase => envase.estado_envase !== '2' && envase.estado_envase !== '3')} />
            </ModalForm>
          </div>
        )
      },
			header: 'Envases',
		}),
		columnHelper.display({
      id: 'info_cc',
			cell: (info) => {
        const row = info.row.original
        return  (
          <div className='font-bold text-center'>
            <div className={`dark:bg-zinc-800 bg-zinc-100 rounded-md w-full flex items-center justify-between py-1 px-4`}>
              <div className='flex flex-col items-center gap-y-2'>
                <label className='text-md font-semibold'>Humedad</label>
                <span className='text-lg'>{row?.humedad} %</span>
              </div>
              <div className='flex flex-col items-center gap-y-2'>
                <label className='text-md font-semibold'>Muestras CC</label>
                <span className='text-lg'>{row.cantidad_muestras}</span>
              </div>
              <div className='flex flex-col items-center gap-y-2'>
                <label className='text-md font-semibold'>CDR</label>
                <Tooltip text='Detalle Control de Rendimiento'>
                  <Link to={`/cdc/crmp/control-calidad/${row.control_calidad}`} state={{ pathname: pathname }}>
                    <Button
                      variant='solid'
                      className='bg-blue-700 hover:bg-blue-600 hover:scale-105 p-1 px-5 rounded-md border-none'>
                      <HeroEye style={{ fontSize: 25, color: 'white'}} />
                    </Button>
                  </Link>
                </Tooltip>
              </div>
            </div>
          </div>
        )
      },
			header: 'Información Control Calidad',
		}),
  ]

  const table = useReactTable({
		data: lotes_patio,
		columns,
		state: {
			sorting,
			globalFilter,
      rowSelection,
		},
    enableRowSelection: true,
		onSortingChange: setSorting,
		enableGlobalFilter: true,
    onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
    enableColumnResizing: true,
		initialState: {
			pagination: { pageSize: 5 },
		},
	});


  const columnas: TableColumn[] = [
    { id: 'checkboxes', header: '', className: 'w-16' },
    { id: 'guia_patio', header: '', className: 'w-16 lg:w-24 text-center' },
    { id: 'numero_lote', header: '', className: 'w-16 lg:w-24 text-center' },
    { id: 'productor', header: '', className: 'w-24 lg:w-24 text-center' },
    { id: 'variedad', header: '', className: 'w-24 lg:w-36 text-center' },
    { id: 'modal_envases', header: '', className: 'w-auto lg:w-80 text-center' },
    { id: 'info_cc', header: '', className: 'w-auto lg:w-96 text-center' },
  ]

  const optionsProductores: TSelectOptions = productores.map(productor => ({
    value: String(productor.id),
    label: productor.nombre
  }))

  return (
    <PageWrapper name='Lista Programas Selección'>
      <Container breakpoint={null} className='w-full overflow-auto'>
        <Card className='h-full w-full'>
          <CardHeader>
            <CardTitle className='text-3xl'>Lotes disponibles para ingreso a programa de producción</CardTitle>
          </CardHeader>
          <CardHeader>
            <CardHeaderChild className='w-full flex justify-between items-center'>
              <div className='w-6/12 flex gap-5'>
                
                <div className="w-full flex-col">
                  <Label htmlFor="calle">Productor: </Label>
                  <SelectReact
                      options={[{ value: '', label: 'Selecciona un productor' }, ...optionsProductores]}
                      id='productor'
                      placeholder='Productor'
                      name='productor'
                      className='w-full h-14 py-2'
                      onChange={(selectedOption: any) => {
                        if (selectedOption && selectedOption.value === '') {
                          setGlobalFilter('')
                        } else {
                          setGlobalFilter(selectedOption.label);
                        }
                      }}
                    />
                </div>

                <div className="w-full flex-col">
                  <Label htmlFor="calle">Variedad: </Label>
                  <SelectReact
                    options={[{ value: '', label: 'Selecciona una variedad' }, ...optionsVariedad]}
                    id='variedad'
                    placeholder='Variedad'
                    name='Variedad'
                    className='w-full h-14 py-2'
                    onChange={(selectedOption: any) => {
                      if (selectedOption && selectedOption.value === '') {
                        setGlobalFilter('')
                      } else {
                        setGlobalFilter(selectedOption.label);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='flex'>
                {
                  pksGuias.length >= 1
                    ? (
                      <Button
                        variant='solid'
                        isDisable={disable}
                        className='bg-blue-700 hover:bg-blue-600 hover:scale-105 py-3'
                        onClick={() => {setDisable(true); registrarLoteAProduccion()}}
                        >
                          Agregar al Programa
                      </Button>
                      )
                    : null
                }
              {/* <Button variant='solid' onClick={() => {
                const response = fetchWithTokenPostAction(`api/produccion/${id}/lotes_en_programa/registrar_lotes/3/`, token?.access)
              }}>Prueba</Button> */}
              </div>
            </CardHeaderChild>
          </CardHeader>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
            { table.getRowCount() === 0 && (
              <div className="text-5xl mt-2 text-center ">No hay Lotes Disponibles</div>
            )}
          </CardBody>
					<TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default TablaRegistroPrograma
