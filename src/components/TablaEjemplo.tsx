// import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
// import React, { useState } from 'react'
// import { TOperarios } from '../types/TypesRegistros.types';
// import PageWrapper from './layouts/PageWrapper/PageWrapper';
// import Subheader from './layouts/Subheader/Subheader';
// import Card, { CardBody, CardHeader, CardTitle } from './ui/Card';
// import TableTemplate, { TableCardFooterTemplate } from '../templates/common/TableParts.template';
// import Container from './layouts/Container/Container';

// const TablaEjemplo = () => {

  
//   const columnHelper = createColumnHelper<TOperarios>();
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [globalFilter, setGlobalFilter] = useState<string>('')

//   const columns = [
//     columnHelper.accessor('rut', {
//       cell: (info) => (
//         <div className='font-bold w-full'>
//           {`${info.row.original.rut}`}
//         </div>
//       ),
//       header: 'Rut '
//     }),
//   ]

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       globalFilter,
//     },
//     onSortingChange: setSorting,
//     enableGlobalFilter: true,
//     onGlobalFilterChange: setGlobalFilter,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: { pageSize: 5 },
//     },
//   });
//   return (
//     <PageWrapper name='Lista Operarios'>
//       <Subheader>
//         hola
//         {/* <SubheaderLeft>
//           <FieldWrap
//             firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
//             lastSuffix={
//               globalFilter && (
//                 <Icon
//                   icon='HeroXMark'
//                   color='red'
//                   className='mx-2 cursor-pointer'
//                   onClick={() => {
//                     setGlobalFilter('');
//                   }}
//                 />
//               )
//             }>
//             <Input
//               id='search'
//               name='search'
//               placeholder='Busca al operario...'
//               value={globalFilter ?? ''}
//               onChange={(e) => setGlobalFilter(e.target.value)}
//             />
//           </FieldWrap>
//         </SubheaderLeft>
//         <SubheaderRight>
//           <ModalForm
//             open={modalStatus}
//             setOpen={setModalStatus}
//             title='Registro Operario'
//             variant='solid'
//             textButton='Agregar Operario'
//             size={900}
//             width={`w-full h-11 md:w-full px-2 ${isDarkTheme ? 'bg-[#3B82F6] hover:bg-[#3b83f6cd]' : 'bg-[#3B82F6] text-white'} hover:scale-105`}
//           >
//             <FormularioRegistroOperario setOpen={setModalStatus} />
//           </ModalForm>
//         </SubheaderRight>*/}
//       </Subheader> 
//       <Container breakpoint={null} className="w-full">
//         <Card className='h-full'>
//           <CardHeader>
//             <CardTitle>Operarios</CardTitle>
//           </CardHeader>
//           <CardBody className='overflow-auto'>
//             <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
//           </CardBody>
//           <TableCardFooterTemplate table={table} />
//         </Card>
//       </Container>
//     </PageWrapper>
//   )
// };


// export default TablaEjemplo
