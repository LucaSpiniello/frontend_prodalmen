import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { Skeleton } from "@mui/material";
import Card, { CardBody, CardHeader, CardTitle } from "../../../../../components/ui/Card";
import Container from "../../../../../components/layouts/Container/Container";
import { useAppDispatch, useAppSelector } from "../../../../../redux/hooks";
import { RootState } from "../../../../../redux/store";
import { useAuth } from "../../../../../context/authContext";
import { useParams } from "react-router-dom";
import TablaOperariosSeleccion from "./TablaOperariosPlantaHarina";
import TablaOperarioEmbalaje from "./TablaOperariosPlantaHarina";
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import TablaOperarioPlantaHarina from "./TablaOperariosPlantaHarina";


interface ITablaOperariosProduccionProps {
  loading?: boolean
  refresh?: string
}

const DetalleOperarioPlantaHarina: FC<ITablaOperariosProduccionProps> = ({ loading }) => {
  const { id } = useParams()

  return (
    <Container breakpoint={null} className="w-full h-full !p-0">
      <Card>
        <CardHeader>
          <CardTitle>Operarios en Programa Planta Harina N° {id}</CardTitle> 
        </CardHeader>
        <CardBody>
          <article className={`row-start-4 row-span-4 col-span-3 w-full h-full dark:bg-zinc-900 bg-zinc-50 flex flex-col lg:flex-col  justify-between pb-10`}>
            {
                loading
                  ? <Skeleton variant='rectangular' width='100%' height={370}/>
                  : (
                    <div className='flex flex-col md:flex-col w-full h-full'>
                      <div className={`w-full h-full  flex flex-col lg:flex-row items-center justify-center rounded-md`}>
                        <div className='w-full flex flex-col justify-center  mt-4 lg:mt-0'>
                          <TablaOperarioPlantaHarina />
                        </div>
                      </div>
                    </div>
                        )
            }
          </article>
        </CardBody>
      </Card>
    </Container>

  )
}

export default DetalleOperarioPlantaHarina
