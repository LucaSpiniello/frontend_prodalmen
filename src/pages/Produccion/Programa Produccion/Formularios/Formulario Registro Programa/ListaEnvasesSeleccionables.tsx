import { Dispatch, FC, HTMLProps, SetStateAction, useEffect, useRef, useState } from 'react';
import { TEnvasePatio } from '../../../../../types/TypesBodega.types';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../redux/hooks';
import { RootState } from '../../../../../redux/store';
import { GUARDAR_ENVASES_PREVIAMENTE, QUITAR_ENVASES_PREVIAMENTE } from '../../../../../redux/slices/produccionSlice';
import { fetchWithTokenPostAction } from '../../../../../utils/peticiones.utils';
import { useAuth } from '../../../../../context/authContext';
import { fetchLotesParaProduccion } from '../../../../../redux/slices/bodegaSlice';
import Container from '../../../../../components/layouts/Container/Container';
import Card, { CardBody, CardHeader } from '../../../../../components/ui/Card';
import TableTemplate, { TableCardFooterTemplate, TableColumn } from '../../../../../templates/common/TableParts.template';
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import Button from '../../../../../components/ui/Button';
import Checkbox from '../../../../../components/form/Checkbox';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';


interface IEnvasesEnGuiaListProps {
  row: TEnvasePatio[]
}

const EnvasesEnGuiaList: FC<IEnvasesEnGuiaListProps> = ({ row }) => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const { verificarToken } = useAuth()
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const envases_lotes = useAppSelector((state: RootState) => state.programa_produccion.envases_lotes)

  // useEffect(() => {
  //   const selectedKeys = Object.keys(rowSelection);
  //   const selectedIndexes = selectedKeys.map(key => parseInt(key));
  //   const envasesSeleccionados = selectedIndexes.map(index => row[index]); 
    

  //   if (envasesSeleccionados.length > 0) {
  //     const nuevosEnvases = envasesSeleccionados.filter(envaseId => !envases_lotes.includes(envaseId));
  //     if (nuevosEnvases.length > 0) {
  //       dispatch(GUARDAR_ENVASES_PREVIAMENTE(nuevosEnvases));
  //     }
  //   } else {
  //     dispatch(QUITAR_ENVASES_PREVIAMENTE({ selectedIndexes }));
  //   }
  // }, [rowSelection, row]);

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

  const columnHelper = createColumnHelper<TEnvasePatio>();
  const columns = [
    // columnHelper.display({
    //   id: 'checkboxes',
		// 	cell: (info) => (
		// 		<div className="p-2">
    //         <IndeterminateCheckbox
    //           {...{
    //             checked: info.row.getIsSelected(),
    //             disabled: !info.row.getCanSelect(),
    //             indeterminate: info.row.getIsSomeSelected(),
    //             onChange:  info.row.getToggleSelectedHandler()
    //           }}
    //         />
    //       </div>
    //     ),
    //     header: 'ID'
		// }),
		columnHelper.display({
      id: 'envase',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${info.row.original.numero_bin}`}
				</div>
			),
			header: 'N° Envase',
		}),
    columnHelper.display({
      id: 'kilos_fruta',
			cell: (info) => (
				<div className='font-bold text-center'>
					{`${(info.row.original.kilos_fruta ?? 0).toLocaleString()} kgs`}
				</div>
			),
			header: 'Kilos Fruta',
		})
  ]



  const table = useReactTable({
		data: row,
		columns,
		state: {
			sorting,
			globalFilter,
      rowSelection,
		},
    enableRowSelection: true,
		onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
		enableGlobalFilter: true,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		initialState: {
			pagination: { pageSize: 7 },
		},
	});

  const columnas: TableColumn[] = [
    { id: 'checkboxes', header: '', className: 'w-5' },

  ]

  const envases = envases_lotes.flatMap(envase => envase.id).join(',');


  const registrarLoteAProduccion = async () => {
    try {
      const token_verificado = await verificarToken(token!)
       if (!token_verificado) throw new Error('Token no verificado')
       const response = await fetchWithTokenPostAction(`api/produccion/${id}/lotes_en_programa/registrar_lotes/${envases}/`, token_verificado)
       if (response.ok){
        toast.success('Envases agregados exitosamente')
        dispatch(fetchLotesParaProduccion({ token, verificar_token: verificarToken}))
       } else console.log('errores')

      } catch (error) {
        console.log('error paso por el catch')   
    }
  }


  return (
    <div className='w-full h-full flex overflow-hidden overflow-y-auto'>
      <Container>
        <Card>
          <CardHeader>
            <Button
              variant='solid'
              className='bg-blue-700 hover:bg-blue-600 hover:scale-105 py-3'
              onClick={() => registrarLoteAProduccion()}
              >
                Agregar al Programa
            </Button>
          </CardHeader>
          <CardBody className='overflow-x-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
          </CardBody>
					<TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </div>
  )
}


export default EnvasesEnGuiaList