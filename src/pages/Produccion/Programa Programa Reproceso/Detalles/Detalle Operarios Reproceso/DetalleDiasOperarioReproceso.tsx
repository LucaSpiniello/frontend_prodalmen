import { createColumnHelper, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import Card, { CardBody, CardHeader, CardHeaderChild } from "../../../../../components/ui/Card";
import TableTemplate, { TableCardFooterTemplate } from "../../../../../templates/common/TableParts.template";
import { useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import Button from "../../../../../components/ui/Button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { TDetalleDiaOperario, TListaOperarioEnProduccion, TListaOperarioEnReproceso } from "../../../../../types/TypesProduccion.types";
import { useAuth } from "../../../../../context/authContext";
import { fetchListaDetalleDiasOperarioProduccion, fetchListaDetalleDiasOperarioReproceso } from "../../../../../redux/slices/operarioSlice";
import { fetchWithTokenPost } from "../../../../../utils/peticiones.utils";
import { useParams } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Modal, { ModalBody, ModalHeader } from "../../../../../components/ui/Modal";
import FieldWrap from "../../../../../components/form/FieldWrap";
import Icon from "../../../../../components/icon/Icon";
import Input from "../../../../../components/form/Input";

const columnHelperDias = createColumnHelper<TDetalleDiaOperario>();

function DetalleDiasOperarioReproceso({ datosOperario, open, setOpen } : {datosOperario: TListaOperarioEnReproceso, open: boolean, setOpen: Dispatch<SetStateAction<boolean>>}) {
    const { id } = useParams()
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const diasOperario = useAppSelector((state: RootState) => state.operarios.diasOperario)
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const { verificarToken } = useAuth()
    
    const [sorting, setSorting] = useState<SortingState>([]);
	  const [globalFilter, setGlobalFilter] = useState<string>('')
    
    const columnsDias = [
      columnHelperDias.accessor('dia', {
        cell: (info) => (
          <div className="font-bold">{info.row.original.dia}</div>
        ),
        header: 'Dia'
      }),
      columnHelperDias.accessor('kilos_dia', {
        cell: (info) => (
          <div className="font-bold">{info.row.original.kilos_dia.toFixed(2)}</div>
        ),
        header: 'Kilos X Dia'
      }),
      columnHelperDias.accessor('ausente', {
        cell: (info) => (
          <div className="font-bold">{info.row.original.ausente ? 'Sí' : 'No'}</div>
        ),
        header: 'Ausente'
      }),
      columnHelperDias.display({
        id: 'acciones',
        cell: (props) => (
          <div className="font-bold">
            <Button color={props.row.original.ausente ? 'blue' : 'red'} variant='solid' icon={props.row.original.ausente ? `HeroPlus` : 'HeroMinus'} onClick={ async () => {
              try {
                const token_verificado = await verificarToken(token)
  
                if (!token_verificado){
                  throw new Error('Token no verificado')
                }
                const response = await fetchWithTokenPost(`api/reproceso/${id}/actualizar_ausente/`, {
                  dia_id: props.row.original.id,
                  ausente: !props.row.original.ausente
                }, token_verificado)
                if (response.ok) {
                  dispatch(fetchListaDetalleDiasOperarioReproceso({token, id_operario: datosOperario?.operario, id_programa: datosOperario?.reproceso, verificar_token: verificarToken}))
                  toast.success('Dia Actualizado')
                } else {
                  toast.error(`Error ${await response.json()}`)
                }
              } catch (error: any) {
                console.log(error)
              }
            }}></Button>
          </div>
        )
      })
    ]

    const tableDias = useReactTable({
      data: diasOperario,
      columns: columnsDias,
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

    useEffect(() => {
      if (open) {
        dispatch(fetchListaDetalleDiasOperarioReproceso({token, id_operario: datosOperario.operario, id_programa: datosOperario.reproceso, verificar_token: verificarToken}))
      }
    }, [open])

    return  (
        <>
        <Button icon="HeroEye" color='blue' variant='solid' onClick={() => {
          setOpen(true);
        }}></Button>
        <Modal
            isStaticBackdrop={true}
            isOpen={open}
            setIsOpen={setOpen}
        >
            <ModalHeader>Detalle Operario {datosOperario.nombres}</ModalHeader>
            <ModalBody>
            <Card>
                <CardHeader>
                    <CardHeaderChild>
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
                            placeholder='Buscar Dia...'
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            />
                        </FieldWrap>
                    </CardHeaderChild>
                </CardHeader>
                <CardBody>
                    <TableTemplate className='table-fixed' table={tableDias}/>
                </CardBody>
                <TableCardFooterTemplate table={tableDias} />
            </Card>
            </ModalBody>
        </Modal>
        </>
    )
}

export default DetalleDiasOperarioReproceso

