import React, { FC, useEffect, useState } from 'react'
import { TCajasEnPalletProductoTerminado } from '../../../types/TypesEmbalaje.type'
import Container from '../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../components/ui/Card'
import TableTemplate, { TableCardFooterTemplate } from '../../../templates/common/TableParts.template'
import { SortingState, createColumnHelper, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table'
import Button from '../../../components/ui/Button'
import ModalForm from '../../../components/ModalForm.modal'
import FormularioCajasPalletProductoTerminado from '../Formularios/FormularioRegistroCajasProductoTerminado'
import { useAppSelector } from '../../../redux/hooks'
import { HeroPencilSquare, HeroXMark } from '../../../components/icon/heroicons';

import { RootState } from '../../../redux/store'
import Tooltip from '../../../components/ui/Tooltip'
import Table, { TBody, Td, Th, THead, Tr } from '../../../components/ui/Table'
import Icon from '../../../components/icon/Icon'
import Modal, { ModalBody, ModalHeader } from '../../../components/ui/Modal'
import { Formik } from 'formik'
import * as Yup from 'yup'
import Validation from '../../../components/form/Validation'
import FieldWrap from '../../../components/form/FieldWrap'
import Input from '../../../components/form/Input'
import Label from '../../../components/form/Label'
import toast from 'react-hot-toast'
import { useAuth } from '../../../context/authContext'
import { fetchWithTokenDelete, fetchWithTokenPatch } from '../../../utils/peticiones.utils'
import { useParams } from 'react-router-dom'
import { fetchPalletsProductoTerminados, fetchTipoEmbalaje } from '../../../redux/slices/embalajeSlice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

interface ICajasPalletProps {
  cajas_pallet: TCajasEnPalletProductoTerminado[] | undefined
  id_pallet: number
}



const TablaCajasPalletProductoTerminado: FC<ICajasPalletProps> = ({ cajas_pallet, id_pallet }) => {
  const columnHelper = createColumnHelper<TCajasEnPalletProductoTerminado>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [openRegistroCajas, setOpenRegistroCajas] = useState<boolean>(false)
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const tipo_embalaje = useAppSelector((state: RootState) => state.embalaje.tipo_embalaje)
  const programa = useAppSelector((state: RootState) => state.embalaje.programa_embalaje_individual)

  useEffect(() => {
    dispatch(fetchTipoEmbalaje({ token, verificar_token: verificarToken }))
  }, [])

  const columns = [
    columnHelper.accessor('tipo_caja_label', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {`${info.row.original.tipo_caja_label}`}
        </div>
      ),
      header: 'Tipo Caja'
    }),
    columnHelper.accessor('cantidad_cajas', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {(info.row.original.cantidad_cajas ?? 0).toLocaleString()}
        </div>
      ),
      header: 'Cantidad Cajas'
    }),
    columnHelper.accessor('peso_x_caja', {
      cell: (info) => (
        <div className='font-bold w-full'>
          {(info.row.original.peso_x_caja ?? 0).toLocaleString()} kgs
        </div>
      ),
      header: 'Peso Por Caja'
    }),
    columnHelper.display({
      id: 'acciones',
      cell: (info) => {
        const [modal, setModal] = useState<boolean>(false)
        const validationSchema = Yup.object().shape({
          cantidad_cajas: Yup.number().min(0, 'Ingrese un numero mayor a 0').required('Ingrese la cantidad de cajas').positive('Ingrese un numero mayor a 0'),
          peso_x_caja: Yup.number().max(tipo_embalaje.find(element => element.id == Number(info.row.original.tipo_caja))?.peso ?? 0, `No puede sobrepasar los ${tipo_embalaje.find(element => element.id == Number(info.row.original.tipo_caja))?.peso ?? 0} kilos de la caja`).min(0, 'Ingrese un numero mayor a 0').positive('Ingrese un numero mayor a 0').required('Ingrese un peso para la caja'),
        });
        return (
          
          <div className="font-bold">
            { programa && !!(programa.estado_embalaje <= '3') && 
              <>
                <Modal
                  isOpen={modal}
                  setIsOpen={setModal}
                >
                  <ModalHeader>Editar Caja {info.row.original.tipo_caja_label}</ModalHeader>
                  <ModalBody>
                    <Formik
                      initialValues={{
                        cantidad_cajas: info.row.original.cantidad_cajas,
                        peso_x_caja: info.row.original.peso_x_caja
                      }}
                      onSubmit={ async (values, formikHelpers) => {
                        try {
                          const token_validado = await verificarToken(token)
                          if (!token_validado) {
                            throw new Error('El token no es valido')
                          }
                          const response = await fetchWithTokenPatch(`api/embalaje/${id}/pallet_producto_terminado/${id_pallet}/cajas_en_pallet_producto_terminado/${info.row.original.id}/`, values, token_validado)
                          if (response.ok){
                            const data = await response.json()
                            toast.success("Caja Editada Exitosamente")
                            dispatch(fetchPalletsProductoTerminados({ id: parseInt(id!), token, verificar_token: verificarToken }))
                            setModal(false)
                          }
                        } catch (error: any) {
                          formikHelpers.setSubmitting(false)
                          toast.error(`${error}`)
                        }
                      }}
                      validationSchema={validationSchema}
                    >
                      {({values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid, }) => (
                        <>
                          <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-12 gap-4">
                              <div className="md:col-span-6 col-span-full">
                                <Label htmlFor='cantidad_cajas'>Cantidad Cajas</Label>
                                <Validation
                                  isValid={isValid}
                                  isTouched={touched.cantidad_cajas ? true : undefined}
                                  invalidFeedback={errors.cantidad_cajas ? String(errors.cantidad_cajas) : undefined}
                                  >
                                  <FieldWrap>
                                    <Input
                                      type='number'
                                      name='cantidad_cajas'
                                      onChange={handleChange}
                                      className='py-[10px]'
                                      disabled={isSubmitting}
                                      value={values.cantidad_cajas}
                                    />
                                  </FieldWrap>
                                </Validation>
                              </div>
                              <div className="md:col-span-6 col-span-full">
                                <Label htmlFor='peso_x_caja'>Peso</Label>
                                <Validation
                                  isValid={isValid}
                                  isTouched={touched.peso_x_caja ? true : undefined}
                                  invalidFeedback={errors.peso_x_caja ? String(errors.peso_x_caja) : undefined}
                                  >
                                  <FieldWrap>
                                    <Input
                                      type='number'
                                      name='peso_x_caja'
                                      onChange={handleChange}
                                      className='py-[10px]'
                                      disabled={isSubmitting}
                                      value={values.peso_x_caja}
                                    />
                                  </FieldWrap>
                                </Validation>
                              </div>
                              <div className="col-span-full justify-between flex">
                                <button disabled={isSubmitting} data-component-name='Button' type='submit' className='bg-blue-600 inline-flex items-center justify-center px-5 py-1.5 rounded-md text-white'>Guardar</button>
                                <Button variant='solid' color='red' onClick={() => setModal(false)}>Cancelar</Button>
                              </div>
                            </div>
                          </form>
                        </>
                      )}
                    </Formik>
                  </ModalBody>
                </Modal>
                <Tooltip text='Editar Caja'>
                  <Button
                    variant='solid'
                    color='blue'
                    className='m-2'
                    onClick={() => {setModal(true)}}
                  ><HeroPencilSquare style={{fontSize: 25}}/></Button>
                </Tooltip>
                <Tooltip text='Eliminar Caja'>
                  <Button variant='solid' color='red' className='m-2' onClick={async () => {
                    try {
                      const token_validado = await verificarToken(token)
                      if (!token_validado) {
                        throw new Error('El token no es valido')
                      }
                      const response = await fetchWithTokenDelete(`api/embalaje/${id}/pallet_producto_terminado/${id_pallet}/cajas_en_pallet_producto_terminado/${info.row.original.id}/`, token_validado)
                      if (response.ok){
                        toast.success("Caja Eliminada Exitosamente")
                        dispatch(fetchPalletsProductoTerminados({ id: parseInt(id!), token, verificar_token: verificarToken }))
                      }
                    } catch (error: any) {
                      toast.error(`${error}`)
                    }
                  }}><HeroXMark style={{ fontSize: 25 }} /></Button>
                </Tooltip>
              </>
            }
          </div>
        )
      }
    })
  ]

  const table = useReactTable({
    data: cajas_pallet ? cajas_pallet : [],
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
  })

  return (
    <Container breakpoint={null} className="w-full">
      <Card className='h-full'>
        <CardHeader>
          <CardTitle>Detalle Cajas Pallet Producto Terminado</CardTitle>
          <ModalForm 
            variant='solid'
            open={openRegistroCajas}
            setOpen={setOpenRegistroCajas}
            title={'Registro Cajas En Pallet Producto Terminado'}
            textButton={`Registrar Cajas En Pallet`}
            size={800}
            
            >
              <FormularioCajasPalletProductoTerminado id_pallet={id_pallet}  setOpen={setOpenRegistroCajas}/>
          </ModalForm>
        </CardHeader>
        <CardBody className='overflow-auto'>
          <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={table} />
          {/* <Table>
            <THead>
              {table.getHeaderGroups().map((headerGroup) => (
                <Tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <Th
                    key={header.id}
                    isColumnBorder={false}
                    hidden={header.id === 'hidden' ? true : false}
                    className={'text-center'}>
                    {header.isPlaceholder ? null : (
                      <div
                        key={header.id}
                        aria-hidden='true'
                        {...{
                          className: header.column.getCanSort()
                            ? 'cursor-pointer select-none flex items-center'
                            : '',
                          onClick: header.column.getToggleSortingHandler(),
                        }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <Icon
                              icon='HeroChevronUp'
                              className='ltr:ml-1.5 rtl:mr-1.5'
                            />
                          ),
                          desc: (
                            <Icon
                              icon='HeroChevronDown'
                              className='ltr:ml-1.5 rtl:mr-1.5'
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </Th>
                  ))}
                </Tr>
              ))}
            </THead>
            <TBody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Td>
                  ))}
                </Tr>
              ))}
            </TBody>
          </Table> */}
        </CardBody>
        <TableCardFooterTemplate table={table} />
      </Card>
    </Container>
  )
}

export default TablaCajasPalletProductoTerminado
