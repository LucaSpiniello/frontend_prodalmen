import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useAuth } from "../../../context/authContext";
import { fetchBinBodega, fetchBodegasG4, listaBinBodegaFiltroThunk } from "../../../redux/slices/bodegaSlice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import TablaBodegaG6 from "./TablaBodegaG6";

const ListaBodegaG6 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag6 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)

  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: 'g6' }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g6'}))
  }, [refresco]);


  return (
    <div className="w-full h-full">
      <TablaBodegaG6 data={bodegag6} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG6
