import { useLocation, useParams } from "react-router-dom";
import useDarkMode from "../../../../hooks/useDarkMode";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { useAuth } from "../../../../context/authContext";
import { useEffect } from "react";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import Container from "../../../../components/layouts/Container/Container";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../components/ui/Card";
import TablaDetalleAgrupaciones from "../Tabla Agrupacion Bins/TablaDetalleAgrupaciones";
import { fetchBinAgrupado } from "../../../../redux/slices/bodegaSlice";
import { format } from "@formkit/tempo";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";




const DetalleAgrupacionBins = () => {
  const bin_agrupacion = useAppSelector((state: RootState) => state.bodegas.bin_agrupado)
  const dispatch  = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const { id } = useParams()

  useEffect(() => {
    if (id){
      dispatch(fetchBinAgrupado({ id: parseInt(id), token, verificar_token: verificarToken }))
    }
  }, [id])

  return (
   <PageWrapper title="Detalle Agrupación">
    <Container breakpoint={null} className="w-full h-full overflow-hidden">

      <Card>
        <CardHeader>
          <CardTitle>Detalle Agrupación de Bins N° {id}</CardTitle>
        </CardHeader>
        <CardBody>
          <div className='flex flex-col md:flex-row lg:flex-row w-full gap-5'>
            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Registrado Por: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{bin_agrupacion?.registrado_por_nombre}</span>
              </div>
            </div>

            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Código Tarja: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex items-center rounded-md`}>
                <span>{bin_agrupacion?.codigo_tarja}</span>
              </div>
            </div>

            <div className='w-full flex-col items-center'>
              <label htmlFor="rut_productor">Bodega: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>Bodega {bin_agrupacion?.transferir_bodega}</span>
              </div>
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="rut_productor">Fecha Creación: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{format(bin_agrupacion?.fecha_creacion!, { date: 'short', time: 'short' }, 'es' )}</span>
              </div>
            </div>

            <div className='w-full h-full flex-col items-center'>
              <label htmlFor="rut_productor">Kilos Agrupación: </label>
              <div className={`dark:bg-[#27272A] border dark:border-gray-600 bg-[#F4F4F5] border-blue-100 p-2 flex rounded-md`}>
                <span>{(bin_agrupacion?.bins_agrupados.reduce((acc, bin) => bin.kilos_fruta + acc, 0) ?? 0).toLocaleString()}</span>
              </div>
            </div>

        </div>
        </CardBody>
    
        <TablaDetalleAgrupaciones />

        <div className="border w-full h-40 mt-5" >

        </div>

      </Card>
    </Container>
   </PageWrapper>

  )
}

export default DetalleAgrupacionBins
