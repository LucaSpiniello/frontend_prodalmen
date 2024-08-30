import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppSelector } from "../../../redux/hooks";
import { useAuth } from "../../../context/authContext";
import TablaBodegaG3 from "./TablaBodegaG3";
import { fetchBinBodega } from "../../../redux/slices/bodegaSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { listaBinBodegaFiltroThunk } from "../../../redux/slices/bodegaSlice";

const ListaBodegaG3 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag3 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)

  useEffect(() => {
    // @ts-ignore
    // dispatch(fetchBinBodega({ params: { search: 'g3' }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g3'}))
  }, [refresco]);


  return (
    <div className="w-full h-full">
      <TablaBodegaG3 data={bodegag3} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG3
