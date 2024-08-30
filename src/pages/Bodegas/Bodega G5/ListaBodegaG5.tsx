import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useAuth } from "../../../context/authContext";
import { fetchBinBodega, fetchBodegasG4, listaBinBodegaFiltroThunk } from "../../../redux/slices/bodegaSlice";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import TablaBodegaG5 from "./TablaBodegaG5";

const ListaBodegaG5 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag5 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)

  useEffect(() => {
    // dispatch(fetchBinBodega({ params: { search: 'g5' }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g5'}))
  }, [refresco]);


  return (
    <div className="w-full h-full">
      <TablaBodegaG5 data={bodegag5} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG5
