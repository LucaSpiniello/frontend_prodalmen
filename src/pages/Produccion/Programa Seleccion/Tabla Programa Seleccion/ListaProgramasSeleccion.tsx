import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { useAuth } from "../../../../context/authContext"
import { fetchProgramasDeSeleccionPaginados } from "../../../../redux/slices/seleccionSlice"
import TablaProgramasSeleccion from "./TablaProgramasSeleccion"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProgramasSeleccion = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programas_seleccion_paginados = useAppSelector((state: RootState) => state.seleccion.programas_seleccion_paginados)
  const pagination_metadata = useAppSelector((state: RootState) => state.seleccion.pagination_metadata)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [currentPage, setCurrentPage] = useState(0)
  const pageSize = 5

  useEffect(() => {
    const desde = currentPage * pageSize
    const hasta = (currentPage * pageSize) + pageSize - 1
    console.log('Dispatching paginated fetch:', { currentPage, pageSize, desde, hasta })
    
    //@ts-ignore
    dispatch(fetchProgramasDeSeleccionPaginados({ 
      token, 
      verificar_token: verificarToken,
      params: { desde, hasta }
    }))
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
      />
    </div>
  )
}

export default ListaProgramasSeleccion
