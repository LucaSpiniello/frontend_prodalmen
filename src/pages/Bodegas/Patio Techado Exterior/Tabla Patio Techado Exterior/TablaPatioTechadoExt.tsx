import { FC, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Link, useLocation } from 'react-router-dom';
import PageWrapper from '../../../../components/layouts/PageWrapper/PageWrapper';
import Container from '../../../../components/layouts/Container/Container';
import Card, {
  CardBody,
  CardHeader,
  CardHeaderChild,
  CardTitle,
} from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Icon from '../../../../components/icon/Icon';
import Input from '../../../../components/form/Input';
import TableTemplate, {
  TableCardFooterTemplate,
  TableColumn,
} from '../../../../templates/common/TableParts.template';
import Badge from '../../../../components/ui/Badge';
import Subheader, {
  SubheaderLeft,
  SubheaderRight,
} from '../../../../components/layouts/Subheader/Subheader';
import FieldWrap from '../../../../components/form/FieldWrap';
import { HeroEye, HeroPencilSquare, HeroXMark } from '../../../../components/icon/heroicons';
import useDarkMode from '../../../../hooks/useDarkMode';
import Tooltip from '../../../../components/ui/Tooltip';
import { TPatioTechadoEx } from '../../../../types/TypesBodega.types';
import { variedadFilter } from '../../../../utils/options.constantes';


const columnHelper = createColumnHelper<TPatioTechadoEx>();


interface IOperarioProps {
  data: TPatioTechadoEx[] | []
}


const TablaPatioTechadoExt: FC<IOperarioProps> = ({ data }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const { pathname } = useLocation()


  const asisteDelete = async (id: number) => {
    const base_url = process.env.VITE_BASE_URL
    const response = await fetch(`${base_url}/api/comercializador/${id}/`, {
      method: 'DELETE',
    })
    if (response.ok) {
    } else {
      console.log("nop no lo logre")
    }
  }



  const columns = [
    columnHelper.accessor('numero_lote', {
      cell: (info) => (
        <div className="font-bold">{info.row.original.numero_lote}</div>
      ),
      header: 'N° Lote'
    }),
    columnHelper.accessor('envases', {
      id: 'envases',
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.envases.length}`}
        </div>
      ),
      header: 'Cantidad Envases'
    }),
    columnHelper.accessor('productor', {
      cell: (info) => {

        return (
          <div className='font-bold '>
            {
              info.row.original.productor
             
            }
          </div>
        )
      },
      header: 'Productor',
    }),
    columnHelper.accessor('variedad', {
      cell: (info) => {

        return (
          <div className='font-bold '>
            {
              info.row.original.variedad
              ? info.row.original.variedad
              : 'Pendiente Ubicacion'
            }
          </div>
        )
      },
      header: 'Variedad',
    }),
    // columnHelper.accessor('estado_lote', {
    //   cell: (info) => (
    //     <div className='font-bold truncate'>
    //       {`${info.row.original.estado_lote_label}`}
    //     </div>
    //   ),
    //   header: 'Estado Lote',
    // }),
    columnHelper.accessor('procesado', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.rendimiento}`}
        </div>
      ),
      header: 'Procesado',
    }),
    columnHelper.accessor('ubicacion', {
      cell: (info) => (
        <div className='font-bold'>
          {`${info.row.original.ubicacion_label}`}
        </div>
      ),
      header: 'Ubicación',
    }),
    columnHelper.display({
      id: 'actions',
      cell: (info) => {
        const id = info.row.original.id;

        return (
          <div className='h-full w-full flex items-center justify-center gap-2'>

            <Tooltip text='Detalle Guía Bodega'>
              <Link to={`/bdg/lotes-mp/${id}`} state={{ id_recepcion: info.row.original.id_recepcion, pathname: pathname }}>
                <Button
                  variant='solid' 
                  className={`w-24 px-1 h-12 dark:bg-blue-800 hover:bg-blue-700 border-none rounded-md flex items-center justify-center hover:scale-105`}>
                  <HeroEye style={{ fontSize: 35 }} />
                </Button>
              </Link>
            </Tooltip>

          </div>
        );
      },
      header: 'Acciones'
    }),

  ];

  const columnas: TableColumn[] = [
    {id: 'envases', header: '', className: 'lg:w-56 text-center'},
    {id: 'productor', header: '', className: 'lg:w-56 text-center'},
    {id: 'variedad', header: '', className: 'lg:w-56 text-center'},
    {id: 'estado_lote', header: '', className: 'lg:w-56 text-center'}, 
    {id: 'procesado', header: '', className: 'lg:w-68 text-center'},
  ]


  const table = useReactTable({
    data,
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
    <PageWrapper name='Lista Guia Patio'>
      <Subheader>
        <SubheaderLeft>
          <FieldWrap
            firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
            lastSuffix={
              globalFilter && (
                <Icon
                  icon='HeroXMark'
                  color='red'
                  className='mx-2 cursor-pointer'
                  onClick={() => {
                    setGlobalFilter('');
                  }}
                />
              )
            }>
            <Input
              id='search'
              name='search'
              placeholder='Busca una guía...'
              value={globalFilter ?? ''}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </FieldWrap>
        </SubheaderLeft>
      </Subheader>
      <Container breakpoint={null} className='w-full'>
        <Card className='h-full'>
          <CardHeader>
            <CardHeaderChild>
              <CardTitle>Guía Patio</CardTitle>
              <Badge
                variant='outline'
                className='border-transparent px-4'
                rounded='rounded-full'>
                {table.getFilteredRowModel().rows.length} registros
              </Badge>
            </CardHeaderChild>
            <CardHeaderChild>
            </CardHeaderChild>
          </CardHeader>
          <CardBody className='overflow-auto'>
            <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} columnas={columnas}/>
          </CardBody>
          <TableCardFooterTemplate table={table} />
        </Card>
      </Container>
    </PageWrapper>
  );
};

export default TablaPatioTechadoExt;
