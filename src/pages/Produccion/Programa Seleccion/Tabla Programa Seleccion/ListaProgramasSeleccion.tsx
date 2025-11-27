import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchProgramasDeSeleccionPaginados, GUARDAR_ESTADO_TABLA_PROGRAMAS_SELECCION } from "../../../../redux/slices/seleccionSlice"
import TablaProgramasSeleccion from "./TablaProgramasSeleccion"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProgramasSeleccion = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programas_seleccion_paginados = useAppSelector((state: RootState) => state.seleccion.programas_seleccion_paginados)
  const pagination_metadata = useAppSelector((state: RootState) => state.seleccion.pagination_metadata)
  const loading_pagination = useAppSelector((state: RootState) => state.seleccion.loading_pagination)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  // Leer el estado guardado de Redux
  const tabla_state = useAppSelector((state: RootState) => state.seleccion.tabla_programas_seleccion_state)

  const [currentPage, setCurrentPage] = useState(tabla_state.pageIndex)
  const pageSize = 5

  useEffect(() => {
    if (!token) return
    
    const desde = currentPage * pageSize
    const hasta = (currentPage * pageSize) + pageSize - 1
    console.log('Dispatching paginated fetch:', { currentPage, pageSize, desde, hasta })
    
    //@ts-ignore
    dispatch(fetchProgramasDeSeleccionPaginados({ 
      token, 
      verificar_token: verificarToken,
      params: { desde, hasta }
    }))
  }, [currentPage, token, verificarToken, dispatch, pageSize])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Guardar el estado en Redux
    dispatch(GUARDAR_ESTADO_TABLA_PROGRAMAS_SELECCION({
      pageIndex: newPage,
      pageSize: pageSize,
      globalFilter: tabla_state.globalFilter,
    }))
  }

  console.log('ListaProgramasSeleccion render:', {
    dataLength: programas_seleccion_paginados.length,
    pagination_metadata,
    currentPage
  })

  return (
    <div className='h-full'>
      <TablaProgramasSeleccion 
        data={programas_seleccion_paginados}
        paginationMetadata={pagination_metadata}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        loadingPagination={loading_pagination}
      />
    </div>
  )
}

export default ListaProgramasSeleccion
