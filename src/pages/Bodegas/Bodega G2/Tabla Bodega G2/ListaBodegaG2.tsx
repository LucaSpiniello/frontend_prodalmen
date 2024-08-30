import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/authContext";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { RootState } from "../../../../redux/store";
import { fetchBinBodega, fetchBodegasG2 } from "../../../../redux/slices/bodegaSlice";
import TablaBodegaG2 from "./TablaBodegaG2";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { listaBinBodegaFiltroThunk } from "../../../../redux/slices/bodegaSlice";

const ListaBodegaG2 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag2 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)

  useEffect(() => {
    // @ts-ignore
    // dispatch(fetchBinBodega({ params: { search: 'g2' } ,token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g2'}))
  }, [refresco]);


  return (
    <div className="w-full h-full">
      <TablaBodegaG2 data={bodegag2} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG2
