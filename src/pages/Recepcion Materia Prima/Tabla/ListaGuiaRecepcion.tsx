import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import TablaGuiaRecepcion from "./TablaGuiaRecepcion";
import { fetchGuiasdeRecepcion, fetchGuiasdeRecepcionByComercializador } from "../../../redux/slices/recepcionmp";
import { useAuth } from "../../../context/authContext";
import { useLocation } from "react-router-dom";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaGuiaRecepcion = () => {
  const { pathname } = useLocation() 
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const { verificarToken } = useAuth();
  const guia_recepcion = useAppSelector((state: RootState) => state.recepcionmp.guias_recepcion);
  const error_guia = useAppSelector((state: RootState) => state.recepcionmp.error);
  const token = useAppSelector((state: RootState) => state.auth.authTokens);
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador);
  // Variable de estado para rastrear si el componente está montado
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
      //@ts-ignore
      if (comercializador == 'Pacific Nut' ){
        dispatch(fetchGuiasdeRecepcionByComercializador({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
      } else{
        dispatch(fetchGuiasdeRecepcion({ params: {}, token, verificar_token: verificarToken }));
      }
  }, [error_guia]); // Ejecutar solo cuando isMounted cambia

  return (
    <div className="h-full">
      <TablaGuiaRecepcion data={guia_recepcion ? guia_recepcion : []} refresh={() => {}} />
    </div>
  );
};

export default ListaGuiaRecepcion;
