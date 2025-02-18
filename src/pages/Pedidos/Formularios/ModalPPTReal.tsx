import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import FieldWrap from "../../../components/form/FieldWrap";
import Input from "../../../components/form/Input";
import Icon from "../../../components/icon/Icon";
import Modal, { ModalBody, ModalHeader } from "../../../components/ui/Modal";
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../../templates/common/TableParts.template";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useFormik } from "formik";
import { TPPTParaPedido } from "../../../types/TypesPedidos.types";
import { useParams } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Validation from "../../../components/form/Validation";
import { useAppSelector } from "../../../redux/hooks";
import { HeroPlus } from "../../../components/icon/heroicons";
import { useAuth } from "../../../context/authContext";
import { fetchWithTokenPost } from "../../../utils/peticiones.utils";
import toast from "react-hot-toast";
import * as Yup from 'yup';
import { detallePedidoThunk } from "../../../redux/slices/pedidoSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import Label from "../../../components/form/Label";

const columnHelperPPT = createColumnHelper<TPPTParaPedido>();

const validationSchema = Yup.object().shape({
    cantidad: Yup.number()
    .min(0, 'El número debe ser mayor o igual a 0')
    .required('Este campo es requerido'),
})

function ModalPPTReal({ctPPT, modalRegistrarPPT, setModalRegistrarPPT}: {ctPPT: number, modalRegistrarPPT: boolean, setModalRegistrarPPT: Dispatch<SetStateAction<boolean>>}) {
    const { id } = useParams()
    const [sortingPPT, setSortingPPT] = useState<SortingState>([]);
    const [globalFilterPPT, setGlobalFilterPPT] = useState<string>('')
    const { pallet_para_pedido } = useAppSelector((state) => state.pedidos)
    const { verificarToken } = useAuth()
    const token = useAppSelector((state) => state.auth.authTokens)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id_fruta: 0,
            cantidad: 0,
            pedido: id,
            tipo_fruta: ctPPT
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const token_validado = await verificarToken(token)
                if (!token_validado) throw new Error('El token no es valido')
                    const res = await fetchWithTokenPost(`api/pedidos/${id}/frutas/`, {...values}, token_validado)
                if (res.ok){
                    const data = await res.json()
                    dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
                } else if (res.status === 400) {
                    toast.error('Error al ingresar PPT')
                }
            } catch (error: any) {
                toast.error('Error al ingresar PPT') 
            }
        }
    })

    const columnsPPT = useMemo(() => [
        columnHelperPPT.accessor('codigo_pallet', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.codigo_pallet}</div>
            ),
            header: 'Codigo'
        }),
        columnHelperPPT.accessor('calidad', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.calidad}</div>
            ),
            header: 'Calidad'
        }),
        columnHelperPPT.accessor('variedad', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.variedad}</div>
            ),
            header: 'Variedad'
        }),
        columnHelperPPT.accessor('calibre', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.calibre}</div>
            ),
            header: 'Calibre'
        }),
        columnHelperPPT.accessor('total_cajas_ptt', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.total_cajas_ptt}</div>
            ),
            header: 'Cajas Disponibles'
        }),
        columnHelperPPT.accessor('peso_total_ptt', {
            cell: (info) => (
                <div className="font-bold">{info.row.original.peso_total_ptt} Kgs</div>
            ),
            header: 'Kilos'
        }),
        columnHelperPPT.display({
            id: 'acciones',
            cell: (info) => {
                const [peso, setPeso] = useState<number>()
                const [cantidadCajas, setCantidadCajas] = useState<number>()
                return (
                    <div className="font-bold">
                        {
                            formik.values.id_fruta === 0 ?
                                <>
                                    <Button variant="solid" color="blue" onClick={() => {formik.setFieldValue('id_fruta', info.row.original.id)}}><HeroPlus style={{fontSize: 25}}/></Button>
                                </>
                            : formik.values.id_fruta === info.row.original.id ?
                                <>
                                    <div className="gap-2 flex">
                                        <Button className="w-full" variant="solid" color="red" onClick={() => {formik.setFieldValue('id_fruta', 0); formik.resetForm()}}>Cancelar</Button>
                                        <Button className="w-full" variant="solid" color="emerald" onClick={() => {formik.setFieldValue('cantidad', peso); formik.handleSubmit()}}>Agregar</Button>
                                    </div>
                                    <Label htmlFor="cantidad">Cantidad de Cajas</Label>
                                    <Validation
                                        isValid={formik.isValid}
                                        isTouched={formik.touched.cantidad ? true : undefined}
                                        invalidFeedback={formik.errors.cantidad ? String(formik.errors.cantidad) : undefined}
                                    >
                                        <FieldWrap>
                                            <Input
                                                type="number"
                                                id="cantidad"
                                                name="cantidad"
                                                value={cantidadCajas}
                                                className="mt-1"
                                                onChange={(e) => {setPeso((Number(e.target.value) * (info.row.original.peso_caja ? info.row.original.peso_caja : -1))); setCantidadCajas(Number(e.target.value))}}
                                            />
                                        </FieldWrap>
                                    </Validation>
                                </>
                            : formik.values.id_fruta != 0 && formik.values.id_fruta != info.row.original.id && (null)
                        }
                    </div>
                )
            }
        })
    ], [formik.values])

    const tablePPT = useReactTable({
        data: pallet_para_pedido,
        columns: columnsPPT,
        state: {
            sorting: sortingPPT,
            globalFilter: globalFilterPPT,
        },
        onSortingChange: setSortingPPT,
        enableGlobalFilter: true,
        onGlobalFilterChange: setGlobalFilterPPT,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 10 },
        },
    })

    const columnas: TableColumn[] = [
		{ id: 'codigo_pallet', className: 'w-2/12'},
		{ id: 'calidad', className: 'w-1/12'},
		{ id: 'variedad', className: 'w-1/12'},
		{ id: 'calibre', className: 'w-1/12'},
		{ id: 'total_cajas_ptt', className: 'w-2/12 text-center'},
		{ id: 'peso_total_ptt', className: 'w-2/12'},
		{ id: 'acciones', className: 'w-auto'},
	]

    return (
        <>
            <Modal
                isOpen={modalRegistrarPPT}
                setIsOpen={setModalRegistrarPPT}
                size="xl"
            >
                <ModalHeader>Registrar PPT al Pedido N° {id}</ModalHeader>
                <ModalBody>
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 justify-end flex gap-4">
                            <FieldWrap
                                firstSuffix={<Icon className='mx-2' icon='HeroMagnifyingGlass' />}
                                lastSuffix={
                                    globalFilterPPT && (
                                        <Icon
                                            icon='HeroXMark'
                                            color='red'
                                            className='mx-2 cursor-pointer'
                                            onClick={() => {
                                                setGlobalFilterPPT('');
                                            }}
                                        />
                                    )
                                }>
                                <Input
                                    id='search'
                                    name='search'
                                    placeholder='Buscar'
                                    value={globalFilterPPT ?? ''}
                                    onChange={(e) => setGlobalFilterPPT(e.target.value)}
                                />
                            </FieldWrap>
                        </div>
                        <div className="col-span-12 mt-2">
                            <div className="w-full overflow-x-auto">
                                <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={tablePPT} columnas={columnas}></TableTemplate>
                                <TableCardFooterTemplate table={tablePPT} className="mt-2" />
                            </div>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default ModalPPTReal