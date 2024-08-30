import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { OperarioProgramaSchema } from "../../../../utils/Validator"
import { useParams } from "react-router-dom"
import { TOperarios } from "../../../../types/TypesRegistros.types"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchWithTokenPost } from "../../../../utils/peticiones.utils"
import { fetchOperario, fetchOperariosFiltro } from "../../../../redux/slices/operarioSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Container from "../../../../components/layouts/Container/Container"
import Card, { CardBody } from "../../../../components/ui/Card"
import Button from "../../../../components/ui/Button"
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template"
import { fetchOperariosProcesoPlantaHarina, fetchProcesoPlantaHarina } from "../../../../redux/slices/procesoPlantaHarina"


interface IFormCamiones {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TOperarios>()

const FormularioRegistroOperarioPlantaHarina: FC<IFormCamiones> = ({ setOpen }) => {
  const { id } = useParams()
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')
  const [filtroNombre, setFiltroNombre] = useState<string | undefined>()
  const [filtroApellido, setFiltroApellido] = useState<string | undefined>()
  const [filtroSkill, setFiltroSkill] = useState<string | undefined>()

  useEffect(() => {
    dispatch(fetchOperariosFiltro({token, verificar_token: verificarToken, nombre: filtroNombre, apellido: filtroApellido, skill: filtroSkill ?? '?skill=p_harina'}))
  }, [filtroNombre, filtroApellido, filtroSkill])

  const formik = useFormik({
    initialValues: {
      operario: "",
      skill_operario: 'p_harina',
    },
    validationSchema: OperarioProgramaSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado)throw new Error('Token no verificado')
        const res = await fetchWithTokenPost(`api/procesos/${id}/registrar_operario/`, 
        {
          operario_id: values.operario,
          skill_operario: values.skill_operario
        }, token_verificado)
        
        if (res.ok) {
          toast.success("El Operario fue registrado exitosamente en proceso ph !!")
          dispatch(fetchOperariosProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
          dispatch(fetchProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
          setOpen(false)
        } else if (res.status === 404){
          const errorData = await res.json()
          toast.error(`${Object.entries(errorData)}`)
        } else {
          toast.error(`Error en el registro de operario`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  })

  useEffect(() => {
    if (formik.values.operario){
      dispatch(fetchOperario({ id: parseInt(formik.values.operario), token, verificar_token: verificarToken }))
    }
  }, [formik.values.operario])

  const columns = [
    columnHelper.accessor('nombre', {
      cell: (info) => (
        <div className="font-bold">{info.row.original.nombre} {info.row.original.apellido} {info.row.original.id}</div>
      ),
      header: 'Nombres'
    }),
    columnHelper.accessor('rut', {
      cell: (info) => (
        <div className="font-bold">{info.row.original.rut}</div>
      ),
      header: 'Rut'
    }),
    columnHelper.accessor('skills', {
      cell: (info) => {
        const skill = info.row.original.skills.find(element => element.tipo_operario === 'p_harina')?.tipo_operario_label
        return (
          <div className="font-bold">{skill}</div>
        )
      },
      header: "Skills"
    }),
    columnHelper.display({
      id: 'acciones',
      cell: (info) => {
        return (
          <div className="font-bold">
            {
              formik.values.operario === '' ?
                <Button variant="solid" color="blue" icon="HeroPlus" onClick={() => {formik.setFieldValue('operario', info.row.original.id.toString()); formik.setFieldValue('skill_operario', 'p_harina')}}></Button>
              : formik.values.operario == info.row.original.id.toString() ?
                <Button color="red" variant="solid" icon="HeroMinus" onClick={() => {formik.setFieldValue('operario', ''); formik.setFieldValue('skill_operario', '')}}></Button>
              : formik.values.operario != info.row.original.id.toString() && formik.values.operario != '' && (null)
            }
          </div>
        )
      },
      header: 'Selección'
    })
  ]
  
  const table = useReactTable({
		data: operarios,
    columns,
		state: {
			sorting,
			globalFilter,
		},
    enableRowSelection: true,
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
    <Container className="w-full h-full">
      <Card>
        <CardBody className='overflow-x-auto w-full'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table}/>
        </CardBody>
        <TableCardFooterTemplate table={table} />
        {
          formik.values.operario != '' && formik.values.skill_operario != '' && (
            <Button onClick={() => {formik.handleSubmit()}} variant="solid">Registrar</Button>
          )
        }
      </Card>
    </Container>
  )
}

export default FormularioRegistroOperarioPlantaHarina
