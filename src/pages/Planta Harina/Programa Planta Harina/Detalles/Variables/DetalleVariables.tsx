import React, { useEffect, useState } from 'react'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { useParams } from 'react-router-dom'
import Modal from '../../../../../components/ui/Modal'
import ModalForm from '../../../../../components/ModalForm.modal'
import FormularioVariablesPlantaHarina from '../../Formularios/FormularioVariablesPlantaHarina'
import { RootState } from '../../../../../redux/store'
import { useAppSelector } from '../../../../../redux/hooks'
import { AiFillThunderbolt } from 'react-icons/ai'
import { FaFireAlt } from 'react-icons/fa'
import { useAuth } from '../../../../../context/authContext'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { fetchProgramaPlantaHarina, fetchVariablePlantaHarina } from '../../../../../redux/slices/plantaHarinaSlice'
import { useDispatch } from 'react-redux'

const DetalleVariables = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const programa_planta_harina = useAppSelector((state: RootState) => state.planta_harina.programa_planta_harina)
  const variables_planta_harina = useAppSelector((state: RootState) => state.planta_harina.variable_planta_harina)
  const [openModal, setOpenModal] = useState<boolean>(false)
  const estadoPrograma = programa_planta_harina?.estado_programa;
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
    if (id){
      dispatch(fetchVariablePlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
      dispatch(fetchProgramaPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
    }
  }, [id])


  return (
    <Container breakpoint={null} className='!p-0'>
      <Card>
        <CardHeader>
          <CardTitle>Variables programa planta harina N° {id}</CardTitle>

          {
            // estadoPrograma === '2' && !(variables_planta_harina?.lectura_gas_inicio && variables_planta_harina.lectura_luz_inicio)
            programa_planta_harina && !programa_planta_harina.condicion_inicio
            ? (
              <ModalForm
                open={openModal}
                setOpen={setOpenModal}
                variant='solid'
                color='blue'
                colorIntensity='700'
                textButton={`Registrar Variables de Inicio `}
                title={`Registro Variables De Inicio`}
                >
                  <FormularioVariablesPlantaHarina setOpen={setOpenModal}/>
              </ModalForm>
            )
            : ['4', '5'].includes(programa_planta_harina?.estado_programa!) && !(variables_planta_harina?.lectura_gas_termino && variables_planta_harina.lectura_luz_termino)
              ? (
                <ModalForm
                  open={openModal}
                  setOpen={setOpenModal}
                  variant='solid'
                  color='blue'
                  colorIntensity='700'
                  textButton={`Registrar Variables de Termino`}
                  title={`Registro Variables De Termino`}
                  >
                    <FormularioVariablesPlantaHarina setOpen={setOpenModal}/>
                </ModalForm>
              )
              : null
          }
        </CardHeader>
        <CardBody>
          
            

            
          

          <section className='w-full flex justify-between gap-5 mt-5'>
              {
                variables_planta_harina?.lectura_luz_inicio
                  ? (
                    <article className=' w-full flex px-5 rounded-md h-24 items-center bg-amber-300 dark:bg-amber-900'>
                      <div className='flex flex-col gap-2 text-amber-950 dark:text-amber-400'>
                        <div className='flex gap-5 items-center text-amber-950 dark:text-amber-400 text-xl '>
                          <AiFillThunderbolt className='text-3xl  text-amber-950 dark:text-amber-400'/>
                          <span className='font-bold'>{variables_planta_harina?.lectura_luz_inicio} Kwh</span>
                        </div>
                        <span>Registro Energético al Inicio del Proceso</span>
                      </div>
                    </article>
                    ) 
                  : null
              }

{
              variables_planta_harina?.lectura_gas_inicio
                ? (
                  <article className=' w-full flex px-5 rounded-md h-24 items-center bg-amber-300 dark:bg-amber-900'>
                    <div className='flex flex-col gap-2 text-amber-950 dark:text-amber-400'>
                      <div className='flex gap-5 items-center text-amber-950 dark:text-amber-400 text-xl '>
                        <FaFireAlt className='text-3xl text-amber-950 dark:text-amber-400'/>
                        <span className='font-bold'>{variables_planta_harina?.lectura_gas_inicio} %</span>
                      </div>
                      <span>Registro de GLP al Inicio del Proceso</span>
                    </div>
                  </article>
                  )
                : null
            }

              
          </section>

          <section className='w-full flex justify-between gap-5 mt-5'>
            
            {
                variables_planta_harina?.lectura_luz_termino
                  ? (
                    <article className='w-full flex px-5 rounded-md h-24 items-center bg-red-300 dark:bg-red-900'>
                      <div className='flex flex-col gap-2 text-red-950 dark:text-red-400'>
                        <div className='flex gap-5 items-center text-red-950 dark:text-red-400 text-xl '>
                          <AiFillThunderbolt className='text-3xl text-red-950 dark:text-red-400' />
                          <span className='font-bold'>{variables_planta_harina?.lectura_luz_termino} Kwh</span>
                        </div>
                        <span>Registro Energético al Final del Proceso</span>
                      </div>
                      </article>
                    )
                  : null
              }

            {
              variables_planta_harina?.lectura_gas_termino
                ? (
                  <article className='w-full flex px-5 rounded-md h-24 items-center bg-red-300 dark:bg-red-900'>
                    <div className='flex flex-col gap-2 text-red-950 dark:text-red-400'>
                      <div className='flex gap-5 items-center text-red-950 dark:text-red-400 text-xl '>
                        <FaFireAlt className='text-3xl text-red-950 dark:text-red-400' />
                        <span className='font-bold'>{variables_planta_harina?.lectura_gas_termino} %</span>
                      </div>
                      <span>Registro de GLP al Final del Proceso</span>
                    </div>
                  </article>
                  )
                : null
            }

          </section>

          {
              variables_planta_harina?.lectura_gas_inicio && variables_planta_harina.lectura_luz_inicio &&
              variables_planta_harina.lectura_gas_termino && variables_planta_harina.lectura_luz_termino
                ? (
                  <section className='w-full flex justify-between gap-5 mt-5'>
                    <article className='w-full flex px-5 bg-emerald-300 dark:bg-emerald-900 rounded-md h-24 items-center'>
                      <div className='flex flex-col gap-2 text-emerald-950 dark:text-emerald-400'>
                        <div className='flex gap-5 items-center  text-xl '>
                          <AiFillThunderbolt className='text-3xl  text-emerald-950 dark:text-emerald-400'/>
                          <span className='font-bold'>{variables_planta_harina?.resultado_luz} Kwh</span>
                        </div>
                        <span>Consumo Energético Total del Proceso</span>
                    </div>
                    </article>

                    <article className='w-full flex px-5 bg-emerald-300 dark:bg-emerald-900 rounded-md h-24 items-center'>
                    <div className='flex flex-col gap-2 text-emerald-950 dark:text-emerald-400'>
                      <div className='flex gap-5 items-center text-emerald-950 dark:text-emerald-400 text-xl '>
                        <FaFireAlt className='text-3xl text-emerald-950 dark:text-emerald-400' />
                        <span className='font-bold'>{variables_planta_harina?.resultado_gas} % </span>
                      </div>
                      <span>Consumo de GLP Total del Proceso</span>
                    </div>
                    </article>
                  </section>
                )
                : null
            }
        </CardBody>
      </Card>
    </Container>
  )
}

export default DetalleVariables
