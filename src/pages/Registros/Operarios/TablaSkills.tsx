import React, { useState } from 'react'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template'
import { SortingState, createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import { TSkill } from '../../../types/TypesRegistros.types'
import Button from '../../../components/ui/Button'
import { HeroXCircle, HeroXMark } from '../../../components/icon/heroicons'
import { useAuth } from '../../../context/authContext'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../redux/hooks'
import { RootState } from '../../../redux/store'
import { fetchWithTokenPost } from '../../../utils/peticiones.utils'
import toast from 'react-hot-toast'
import { fetchOperario } from '../../../redux/slices/operarioSlice'
import ModalForm from '../../../components/ModalForm.modal'
import FormularioRegistroSkillOperario from './Formularios/FormuarioRegistroSkillOperario'

const TablaSkills = ({ skills, id } : { skills: TSkill[], id: number }) => {
  const columnHelper = createColumnHelper<TSkill>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [addSkills, setAddSkills] = useState<boolean>(false)
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const eliminarSkills = async (id_skill: number) => {
    try {
       const token_verificado = await verificarToken(token!)

       if (!token_verificado){
          throw new Error('Token no verificado')
       }
      const response = await fetchWithTokenPost(`api/registros/operarios/${id}/quitar-skill/`, { id: id_skill},  token_verificado)

      if (response.ok) {
        toast.success("Skill a operario eliminado exitosamente")
        dispatch(fetchOperario({ id, token, verificar_token: verificarToken }))
      } else {
        toast.error("No se ha podido crear el skill exitosamente")
      }
    } catch (error: any) {
      console.log("No se ha podido crear el skill exitosamente")
    }
  }


  const columns = [
    columnHelper.accessor('tipo_operario_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_operario_label}`}
        </div>
      ),
      header: 'Tipo Operario'
    }),
    columnHelper.accessor('pago_x_kilo', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.pago_x_kilo}`}
        </div>
      ),
      header: 'Pago Por Kilo'
    }),
      // columnHelper.accessor('pago_x_kilo', {
      //   cell: (info) => (
      //     <div className='font-bold w-full'>
      //       {`${info.row.original.pago_x_kilo}`}
      //     </div>
      //   ),
      //   header: 'Pago Por Kilo'
      // }),
    columnHelper.display({
      id: 'acciones',
      cell: (info) => (
        <div className='w-full flex items-center justify-center '>
          <Button
            variant="solid"
            color='red'
            colorIntensity='700'
            className="hover:scale-105"
            onClick={() => eliminarSkills(info.row.original.id)}
          >
            <HeroXMark style={{ fontSize: 25 }} />
          </Button>
        </div>
      ),
      header: 'Acciones'
    }),

  ]
  const table = useReactTable({
    data: skills,
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
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Skills Operarios</CardTitle>
          <ModalForm
            open={addSkills}
            setOpen={setAddSkills}
            variant='solid'
            color='blue'
            colorIntensity='700'
            size={700}
            title='Registro Skills Operario'
            textButton={'Registrar Skill Operario'}
            >
              <FormularioRegistroSkillOperario id={id} setOpen={setAddSkills}/>
          </ModalForm>
        </CardHeader>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaSkills
