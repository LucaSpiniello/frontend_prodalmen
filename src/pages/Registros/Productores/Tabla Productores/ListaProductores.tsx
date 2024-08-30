import TablaProductor from "./TablaProductor"
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from "../../../../redux/store";
import { useEffect } from "react";
import { fetchProductores } from "../../../../redux/slices/productoresSlice";
import PageWrapper from "../../../../components/layouts/PageWrapper/PageWrapper";
import { useAuth } from "../../../../context/authContext";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

const ListaProductores = () => {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const productores = useAppSelector((state: RootState) => state.productores.productores);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchProductores({ token, verificar_token: verificarToken }));
  }, []);

  return (
    <div className="w-full h-full">
      <TablaProductor data={productores} />
    </div>
  )
}

export default ListaProductores
