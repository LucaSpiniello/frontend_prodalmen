import { useEffect, useState } from "react";
import { RootState } from "../../../redux/store";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useAuth } from "../../../context/authContext";
import { fetchBinBodega, fetchBodegasG4 } from "../../../redux/slices/bodegaSlice";
import TablaBodegaG4 from "./TablaBodegaG4";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { listaBinBodegaFiltroThunk } from "../../../redux/slices/bodegaSlice";

const ListaBodegaG4 = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const bodegag4 = useAppSelector((state: RootState) => state.bodegas.bin_bodega);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const [refresco, setRefresco] = useState<boolean>(false)
  const filteredData : any = bodegag4.filter((tarja : any) => tarja.estado_binbodega !== "Procesado En Embalaje")

  useEffect(() => {
    // @ts-ignore
    // dispatch(fetchBinBodega({ params: { search: 'g4' }, token, verificar_token: verificarToken }));
    dispatch(listaBinBodegaFiltroThunk({token: token, verificar_token: verificarToken, filtro: 'g4'}))
  }, [refresco]);


  return (
    <div className="w-full h-full">
      <TablaBodegaG4 data={filteredData} refresco={refresco} setRefresco={setRefresco} />
    </div>
  )
}

export default ListaBodegaG4
