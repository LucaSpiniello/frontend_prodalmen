import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import TablaBodegaG1 from "./TablaBodegaG1";
import { fetchBinBodega, fetchBodegasG1 } from "../../../../redux/slices/bodegaSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { listaBinBodegaFiltroThunk } from "../../../../redux/slices/bodegaSlice";

const ListaBodegaG1 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag1 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)

  useEffect(() => {
    // @ts-ignore
    // dispatch(fetchBinBodega({ params: { search: 'g1' }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g1'}))
  }, [refresco]);

  return (
    <div className="w-full h-full">
      <TablaBodegaG1 data={bodegag1} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG1
