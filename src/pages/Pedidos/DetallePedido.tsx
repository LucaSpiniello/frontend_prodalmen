import { useParams } from "react-router-dom"
import Container from "../../components/layouts/Container/Container"
import PageWrapper from "../../components/layouts/PageWrapper/PageWrapper"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useAuth } from "../../context/authContext"
import { useAppSelector } from "../../redux/hooks"
import Icon from "../../components/icon/Icon"
import EditarPedidoMercadoInterno from "./Formularios/EditarPedidoMercadoInterno"
import ComponerFrutaFicticia from "./ComponerFrutaFicticia"
import { useEffect, useState } from "react"
import { detallePedidoThunk, patchPedidoThunk } from "../../redux/slices/pedidoSlice"
import Subheader, { SubheaderLeft, SubheaderRight } from "../../components/layouts/Subheader/Subheader"
import Button from "../../components/ui/Button"
import Modal, { ModalBody, ModalHeader } from "../../components/ui/Modal"
import { GoQuestion } from "react-icons/go"
import ComponerFrutaReal from "./ComponerFrutaReal"
import EditarGuiaSalida from "./Formularios/EditarGuiaSalida"


function DetallePedido() {
    const { id } = useParams() 
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const { verificarToken } = useAuth()
    const token = useAppSelector((state) => state.auth.authTokens)
    const { pedido, loading } = useAppSelector((state) => state.pedidos)
    const [refrescar, setRefrescar] = useState<boolean>(false)
    const [tabs, setTabs] = useState<string>("1")
    const [modalConfirmarArmado, setModalConfirmarArmado] = useState<boolean>(false)
    const [modalConfirmarComposicion, setModalConfirmarComposicion] = useState<boolean>(false)
    // const userGroup = useAppSelector((state) => state.auth.grupos)
    // const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)

    useEffect(() => {
        if (token) {
            dispatch(detallePedidoThunk({id_pedido: id, token, verificar_token: verificarToken}))
        }
    }, [id, refrescar, token])

    function actualizarEstadoPedido({estado} : {estado: string | undefined | null}) {
        if (estado) {
            dispatch(patchPedidoThunk({id_pedido: id, data: {estado_pedido: estado}, token, verificar_token: verificarToken}))
        }
    }

    return (
        <PageWrapper>
            <Subheader>
                <SubheaderLeft>
                    { tabs != '1' && (
                        <Button
                            variant="solid"
                            color="indigo"
                            onClick={() => {setTabs(String(Number(tabs) - 1))}}>
                            Volver
                        </Button>
                    )}
                </SubheaderLeft>
                <SubheaderRight>
                    { pedido && (
                        <>
                            { (pedido.estado_pedido === '1' || pedido.estado_pedido === '0') && tabs === '2' ? (
                                <>
                                    <Modal
                                        isOpen={modalConfirmarArmado}
                                        setIsOpen={setModalConfirmarArmado}
                                    >
                                        <ModalHeader>¿Seguro que desea terminar el armado del pedido?</ModalHeader>
                                        <ModalBody>
                                            <div className="w-full justify-center items-center py-5 flex">
                                                <GoQuestion className='text-9xl text-yellow-500' />
                                            </div>
                                            <div className="w-full text-2xl text-center">
                                                Al terminar el armado del pedido no podra volver a modificar la información dentro del pedido
                                            </div>
                                            <div className="w-full flex justify-between mt-2">
                                                <Button
                                                    variant="solid"
                                                    color="red"
                                                    onClick={() => {setModalConfirmarArmado(false)}}
                                                >Cancelar</Button>
                                                <Button
                                                    variant="solid"
                                                    color="blue"
                                                    onClick={() => {actualizarEstadoPedido({estado: '2'})}}
                                                >Confirmar</Button>
                                            </div>
                                        </ModalBody>
                                    </Modal>
                                    <Button
                                        variant="solid"
                                        color="red"
                                        onClick={() => {setModalConfirmarArmado(true)}}
                                    >Terminar Armado Pedido</Button>
                                </>
                            ) : pedido.estado_pedido === '2' && tabs === '3' ? (
                                <>
                                    <Modal
                                        isOpen={modalConfirmarComposicion}
                                        setIsOpen={setModalConfirmarComposicion}
                                    >
                                        <ModalHeader>¿Seguro que desea terminar la composición del pedido?</ModalHeader>
                                        <ModalBody>
                                            <div className="w-full justify-center items-center py-5 flex">
                                                <GoQuestion className='text-9xl text-yellow-500' />
                                            </div>
                                            <div className="w-full text-2xl text-center">
                                                Al terminar la composición del pedido no podra volver a modificar la fruta de bodega dentro del pedido
                                            </div>
                                            <div className="w-full flex justify-between mt-2">
                                                <Button
                                                    variant="solid"
                                                    color="red"
                                                    onClick={() => {setModalConfirmarComposicion(false)}}
                                                >Cancelar</Button>
                                                <Button
                                                    variant="solid"
                                                    color="blue"
                                                    onClick={() => {actualizarEstadoPedido({estado: '3'})}}
                                                >Confirmar</Button>
                                            </div>
                                        </ModalBody>
                                    </Modal>
                                    <Button
                                        variant="solid"
                                        color="red"
                                        onClick={() => {setModalConfirmarComposicion(true)}}
                                    >Terminar Composición del Pedido</Button>
                                </>
                            ) : tabs <= '2' && (
                                <Button
                                    variant="solid"
                                    color="indigo"
                                    onClick={() => {setTabs(String(Number(tabs) + 1))}}>
                                    Siguiente
                                </Button>
                            )}
                            { }
                            
                        </>
                    )}
                </SubheaderRight>
            </Subheader>
            <Container className="w-full h-full">
                { !loading && pedido ? (
                    <>
                        { tabs === '1' && (
                            <>
                                { pedido.mercado_interno && (
                                    <EditarPedidoMercadoInterno />
                                )}
                                { pedido.exportacion && (
                                    <div className="text-9xl">EDITAR EXPORTACION</div>
                                )}
                                { pedido.guia_salida && (
                                    <EditarGuiaSalida />
                                )}
                            </>
                        )}
                        { tabs === '2' && (
                            <>
                                <ComponerFrutaFicticia></ComponerFrutaFicticia>
                            </>
                        )}
                        { tabs === '3' && (
                            <>
                                <ComponerFrutaReal></ComponerFrutaReal>
                            </>
                        )}
                    </>
                ) 
                : 
                    <div className="w-full h-full flex items-center justify-center">
                        <Icon icon="DuoLoading" className="animate-[spin_1s_linear_infinite] text-blue-700" size="text-9xl"></Icon>
                    </div>
                }
            </Container>
        </PageWrapper>
    )
}

export default DetallePedido