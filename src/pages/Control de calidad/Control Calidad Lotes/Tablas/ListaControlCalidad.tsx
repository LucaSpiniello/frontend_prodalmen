import { useEffect, useState } from "react"
import { useAuth } from "../../../../context/authContext"
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import TablaControlCalidad from "./TablaControlCalidad"
import { fetchControlesDeCalidadPorComercializador, fetchControlesDeCalidad, fetchControlesDeCalidadPaginados, GUARDAR_ESTADO_TABLA_CC } from "../../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"

const ListaControlCalidad = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const controles_calidad_paginados = useAppSelector((state: RootState) => state.control_calidad.controles_calidad_paginados)
  const pagination_metadata = useAppSelector((state: RootState) => state.control_calidad.pagination_metadata)
  const loading_pagination = useAppSelector((state: RootState) => state.control_calidad.loading_pagination)
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)

  // Leer el estado guardado de Redux
  const tabla_state = useAppSelector((state: RootState) => state.control_calidad.tabla_cc_state)
  const [currentPage, setCurrentPage] = useState(tabla_state.pageIndex)
  const pageSize = 10

  // Efecto principal que se ejecuta al montar y cuando cambia currentPage
  useEffect(() => {
    if (!token) return

    const desde = currentPage * pageSize
    const hasta = (currentPage * pageSize) + pageSize - 1
    console.log('Dispatching paginated fetch for Control Calidad Lotes:', { currentPage, pageSize, desde, hasta, comercializador })

    //@ts-ignore
    dispatch(fetchControlesDeCalidadPaginados({
      token,
      verificar_token: verificarToken,
      params: { desde, hasta, comercializador }
    }))
  }, [currentPage, token, verificarToken, dispatch, pageSize, comercializador])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    // Guardar el estado en Redux
    dispatch(GUARDAR_ESTADO_TABLA_CC({
      pageIndex: newPage,
      pageSize: pageSize,
      globalFilter: tabla_state.globalFilter,
    }))
  }

  console.log('ListaControlCalidad render:', {
    dataLength: controles_calidad_paginados.length,
    pagination_metadata,
    currentPage
  })

  return (
    <div className="h-full">
      <TablaControlCalidad 
        data={controles_calidad_paginados ? controles_calidad_paginados : []}
        paginationMetadata={pagination_metadata}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        pageSize={pageSize}
        loadingPagination={loading_pagination}
      />
    </div>
  )
}

export default ListaControlCalidad
