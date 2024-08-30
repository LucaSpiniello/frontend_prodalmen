import { useFormik } from "formik"
import FieldWrap from "../../../components/form/FieldWrap"
import Label from "../../../components/form/Label"
import Textarea from "../../../components/form/Textarea"
import Validation from "../../../components/form/Validation"
import Button from "../../../components/ui/Button"
import Modal, { ModalBody, ModalFooter, ModalFooterChild, ModalHeader } from "../../../components/ui/Modal"
import Tooltip from "../../../components/ui/Tooltip"
import { useState } from "react"
import * as Yup from 'yup'
import { TBinesInventario } from "../../../types/TypesBodega.types"
import { useAuth } from "../../../context/authContext"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { fetchWithTokenPatch, fetchWithTokenPost } from "../../../utils/peticiones.utils"
import { useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { fetchBinInventario, fetchInventario } from "../../../redux/slices/bodegaSlice"

function ModalObservaciones({info} : {info: TBinesInventario}) {
    const { id } = useParams()
    const [openModal, setOpenModal] = useState<boolean>(false)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const {verificarToken} = useAuth()
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)

    const validationSchema = Yup.object().shape({
        observaciones: Yup.string().nonNullable().min(3, 'La observación tiene que tener más de 3 caracteres')
    })

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            observaciones: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            const token_verificado = await verificarToken(token!)
            if (!token_verificado) throw new Error('Token no verificado')
            const res = await fetchWithTokenPatch(`api/inventarios/${id}/bins/${info.id}/`, 
                {
                    inventario: info.inventario,
                    validado_por: perfilData?.id,
                    binbodega: info.binbodega,
                    observaciones: values.observaciones
                },
                token_verificado
            )
            if (res.ok){
                const data = await res.json()
                dispatch(fetchBinInventario({ id: parseInt(id!), token, verificar_token: verificarToken }))
                dispatch(fetchInventario({ id: parseInt(id!), token, verificar_token: verificarToken }))
                setOpenModal(false)
                toast.success("Observacion registrada exitosamente")
            } else {
                console.log("mal hecho")
            }
        }
    })

    return (
        <>
            <Modal 
                isOpen={openModal}
                setIsOpen={setOpenModal}
                isStaticBackdrop={true}>
                <ModalHeader>Registrar Observación de Bin {info.codigo_tarja}</ModalHeader>
                <ModalBody>
                    <Label htmlFor={'observaciones'}>Observaciones</Label>
                    <Validation
                        isValid={formik.isValid}
                        isTouched={formik.touched.observaciones ? true : undefined}
                        invalidFeedback={formik.errors.observaciones ? String(formik.errors.observaciones) : undefined}
                    >
                        <FieldWrap>
                            <Textarea
                                id='observaciones'
                                name='observaciones'
                                onChange={formik.handleChange}
                                // className='py-[13px] mt-0.5 text-black'
                                value={formik.values.observaciones}
                            />
                        </FieldWrap>
                    </Validation>
                </ModalBody>
                <ModalFooter>
                    <ModalFooterChild></ModalFooterChild>
                    <ModalFooterChild>
                        <Button color='blue' variant='solid' onClick={() => {formik.handleSubmit()}}>Guardar</Button>
                    </ModalFooterChild>
                </ModalFooter>
            </Modal>
            <Tooltip text='Registrar Observación'>
                <Button color='blue' variant='solid' icon='HeroPlus' onClick={() => {setOpenModal(true)}}></Button>
            </Tooltip>
        </>
    )
}

export default ModalObservaciones