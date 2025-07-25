import { useEffect, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAuthenticatedFetch } from "../../../../hooks/useAuthenticatedFetch"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { TControlCalidad } from "../../../../types/TypesControlCalidad.type"
import TablaControlRendimiento from "./TablaControlRendimiento"
import { fetchControlesDeCalidad, fetchControlesDeCalidadPorComercializador, fetchControlesDeCalidadPaginados } from "../../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';


const ListaControlRendimiento = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const controles_calidad_paginados = useAppSelector((state: RootState) => state.control_calidad.controles_calidad_paginados)
  const pagination_metadata = useAppSelector((state: RootState) => state.control_calidad.pagination_metadata)
  const loading_pagination = useAppSelector((state: RootState) => state.control_calidad.loading_pagination)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 10

  useEffect(() => {
    if (!token) return
    
    const desde = currentPage * pageSize
    const hasta = (currentPage * pageSize) + pageSize - 1
    console.log('Dispatching paginated fetch:', { currentPage, pageSize, desde, hasta, comercializador })
    
    //@ts-ignore
    dispatch(fetchControlesDeCalidadPaginados({ 
      token, 
      verificar_token: verificarToken,
      params: { desde, hasta, comercializador }
    }))
  }, [currentPage, token, verificarToken, dispatch, pageSize, comercializador])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  console.log('ListaControlRendimiento render:', {
    dataLength: controles_calidad_paginados.length,
    pagination_metadata,
    currentPage
  })

  return (
    <div className='h-full'>
      <TablaControlRendimiento 
        data={controles_calidad_paginados}
        paginationMetadata={pagination_metadata}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        loadingPagination={loading_pagination}
      />
    </div>
  )
}

export default ListaControlRendimiento
