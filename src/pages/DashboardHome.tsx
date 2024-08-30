import { useEffect, useState } from "react"
import Container from "../components/layouts/Container/Container"
import PageWrapper from "../components/layouts/PageWrapper/PageWrapper"
import Subheader, { SubheaderLeft } from "../components/layouts/Subheader/Subheader"
import Card, { CardBody, CardHeader } from "../components/ui/Card"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { RootState } from "../redux/store"
import PERIOD, { TPeriod } from "../constants/periods.constant"
import { useAuth } from "../context/authContext"
import { GUARDAR_NOTIFICACIONES, fetchDashboardProgramas } from "../redux/slices/registrosbaseSlice"
import CardInfoShort from "../components/CardInfoShort"
import { TProgramasInfo } from "../types/coreTypes.type"
import { useDispatch } from "react-redux"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useLocation } from "react-router-dom"


const DashboardHome = () => {
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  return (
    <PageWrapper>
      <Subheader>
        <SubheaderLeft>
          <h1>Bienvenido <span>{perfil?.first_name} {perfil?.last_name}</span></h1>
        </SubheaderLeft>
      </Subheader>
      <Container breakpoint={null} className='w-full h-full'>
        <div className="w-full h-full flex items-center justify-center">
          <h1 className="text-8xl">Próximamente........</h1>
        </div>
      </Container>
    </PageWrapper>
  )
}

export default DashboardHome 