import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { useFormik } from "formik"
import toast from "react-hot-toast"
import { OperarioProgramaSchema } from "../../../../utils/Validator"
import { useParams } from "react-router-dom"
import { TOperarios } from "../../../../types/TypesRegistros.types"
import {  useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchWithTokenPost } from "../../../../utils/peticiones.utils"
import { fetchOperariosFiltro } from "../../../../redux/slices/operarioSlice"
import { fetchOperariosEnSeleccion, fetchProgramaSeleccion } from "../../../../redux/slices/seleccionSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import Container from "../../../../components/layouts/Container/Container"
import Card, { CardBody } from "../../../../components/ui/Card"
import TableTemplate, { TableCardFooterTemplate } from "../../../../templates/common/TableParts.template"
import Button from "../../../../components/ui/Button"


interface IFormCamiones {
  setOpen: Dispatch<SetStateAction<boolean>>
}

const columnHelper = createColumnHelper<TOperarios>()

const FormularioRegistroOperarioSeleccion: FC<IFormCamiones> = ({ setOpen }) => {
  const { id } = useParams()
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const operarios = useAppSelector((state: RootState) => state.operarios.operarios)
  const [filtroNombre, setFiltroNombre] = useState<string | undefined>()
  const [filtroApellido, setFiltroApellido] = useState<string | undefined>()
  const [filtroSkill, setFiltroSkill] = useState<string | undefined>()
  const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>('')

  useEffect(() => {
    dispatch(fetchOperariosFiltro({token, verificar_token: verificarToken, nombre: filtroNombre, apellido: filtroApellido, skill: filtroSkill ?? '?skill=seleccion'}))
  }, [filtroNombre, filtroApellido, filtroSkill])

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
        const skill = info.row.original.skills.find(element => element.tipo_operario === 'seleccion')?.tipo_operario_label
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
                <Button variant="solid" color="blue" icon="HeroPlus" onClick={() => {formik.setFieldValue('operario', info.row.original.id.toString()); formik.setFieldValue('skill_operario', 'seleccion')}}></Button>
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      operario: '',
      skill_operario: '',
    },
    validationSchema: OperarioProgramaSchema,
    onSubmit: async (values) => {
      try {
        const token_verificado = await verificarToken(token!)
        if (!token_verificado)throw new Error('Token no verificado')
        const res = await fetchWithTokenPost(`api/seleccion/${id}/registrar_operario/`, 
        {
          operario_id: values.operario,
          skill_operario: values.skill_operario
        }, token_verificado)
        
        if (res.ok) {
          toast.success("El Operario fue registrado exitosamente en seleccion !!")
          dispatch(fetchOperariosEnSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
          dispatch(fetchProgramaSeleccion({ id: parseInt(id!), token, verificar_token: verificarToken }))
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


  return (
    <Container className="w-full h-full">
      <Card>
        <CardBody className='overflow-x-auto w-full'>
          {/* <div className="grid-cols-12 gap-4 w-full flex">
            <div className="col-span-3">
              <Label htmlFor={"skill"}>Skill</Label>
              <Select
                className="w-full"
                id="skill"
                name="skill"
                placeholder="Filtro Skill"
                options={[
                  {value: 'p_limpia', label: 'Operario Pre Limpia'},
                ]}
                onChange={(e: any) => {
                  if (e === null) {
                    setFiltroSkill('')
                    formik.resetForm()
                  } else {
                    setFiltroSkill(`?skill=${e.value}`)
                    formik.resetForm()
                  }
                }}
              ></Select>
            </div>
          </div> */}
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

export default FormularioRegistroOperarioSeleccion