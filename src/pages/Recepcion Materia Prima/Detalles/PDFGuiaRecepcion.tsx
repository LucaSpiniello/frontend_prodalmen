import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { useAuthenticatedFetch } from '../../../hooks/useAuthenticatedFetch';
import { TEnvases, TGuia, TLoteGuia } from '../../../types/TypesRecepcionMP.types';
import { TCamion, TConductor, TProductor } from '../../../types/TypesRegistros.types';
import { variedadFilter } from '../../../utils/options.constantes';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useAuth } from '../../../context/authContext';
import { useEffect } from 'react';
import { fetchGuiaRecepcion } from '../../../redux/slices/recepcionmp';
import { fetchProductor } from '../../../redux/slices/productoresSlice';
import { fetchEnvases } from '../../../redux/slices/envasesSlice';
import { fetchConductor } from '../../../redux/slices/conductoresSlice';
import { fetchCamion } from '../../../redux/slices/camionesSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { sum } from 'lodash';


const styles = StyleSheet.create({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,

  },
  header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 20,
    gap: 2

  },
  header_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10
  },
  header_inferior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    border: '1px solid green',
    borderRadius: 5,
    height: 60

  },
  header_logo_box: {
    width: 100,
    height: 80,
  },
  header_info_box_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12,
  },
  header_info_inferior: {
    width: '100%',
    height: 55,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    borderRadius: 5,
    padding: 5,
    paddingLeft: 10
  },
  input_style: {
    width: '100%',
    height: '70%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    padding: '0 3px'
  },
  label: {
    fontWeight: 'bold',
    width: '100px',
    fontSize: '12px'
  },
  input_text: {
    borderRadius: '2px',
    border: '1px solid #E3E7EA',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    height: '25px',
    width: '70%',
    fontWeight: 'semibold',
    fontSize: 12,
    padding: '0 5px',
    overflow: 'hidden'
  },
  logo: {
    height: '100%',
    width: '100%',
    objectFit: 'contain',
  },
  footer_box: {
    marginTop: '100px',
    border: '0.5px solid #E3E7EA',
    borderRadius: 2,
    height: '100%',
    width: '100%'
  },
  footer_header: {
    height: '30px',
    width: '100%',
    border: '0.5px solid #E3E7EA',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3px 5px'
  },
  items_box: {
    width: '100%',
    border: '0.5px solid #E3E7EA',
    height: '40px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer_box_signatures: {
    height: '100px',
    width: '100%',
    position: 'absolute',
    bottom: 10,
    right: 0,
    left: 10,
    margin: 'auto',
    display: 'flex',
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'space-between'
  },
  signature_box: {
    border: '1px solid #E3E7EA',
    borderRadius: 5,
    width: '300px',
    padding: '2px 5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  signature_pic: {
    width: '60%',
    height: '100%',
    objectFit: 'contain',
  },
  header_date_info_box: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  header_date_info: {
    width: 190,
    height: '100%',
    border: '1px solid green',
    borderRadius: 5,
    padding: 5
  },
  header_date_info_text: {
    fontSize: 10,
    textAlign: 'center'
  },
})

const GuiaRecepcionPDF = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const envases = useAppSelector((state: RootState) => state.envasesmp.envases)
  const camionero = useAppSelector((state: RootState) => state.conductores.conductor)
  const camion = useAppSelector((state: RootState) => state.camiones.camion)

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchEnvases({ token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchConductor({ id: state.guia?.camionero, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    //@ts-ignore
    dispatch(fetchCamion({ id: state.guia?.camion, token, verificar_token: verificarToken }))
  }, [])

  console.log(state)

  return (
    <PDFViewer style={{ height: '100%'}}>
        <Document title={`Guia_N°${id}_productor_${state?.guia.nombre_productor}`}>
            <Page>
                <View style={styles.header}>
                    <View style={styles.header_superior}>
                        <View style={{ position: 'relative', top: -9 }}>
                            <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
                            <Text style={{ fontSize: 5, width: 100}}>
                                Actividades de Apoyo a la agrícultura
                                Dirección: Fundo Challay Alto Lote A-1, Paine
                                Teléfonos: +56 2 228215583 - +56 2 2282 25584
                            </Text>
                        </View>

                        <Text style={{ fontSize: 20, position: 'relative', left: 20, top: 10}}>Guia Recepción MP {state.guia?.id}</Text>

                        <View style={{ width: 180, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -9 }}>
                            <View style={styles.header_date_info_box}>
                                <Text style={styles.header_date_info_text}>Fecha Recepción: </Text>
                                <Text style={styles.header_date_info_text}>{format(state.guia?.fecha_creacion!, { date: 'short'}, 'es')}</Text>
                            </View>

                            <View style={styles.header_date_info_box}>
                                <Text style={styles.header_date_info_text}>Hora Recepción: </Text>
                                <Text style={styles.header_date_info_text}>{format(state.guia?.fecha_creacion!, { time: 'short'}, 'es')}</Text>
                            </View>

                            <View style={styles.header_date_info_box}>
                                <Text style={styles.header_date_info_text}>Registrado Por: </Text>
                                <Text style={styles.header_date_info_text}>{state.guia.nombre_creado_por}</Text>
                            </View>
                        </View>
                    </View>

                    // Top Inferior 

                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginBottom: '1%' }}>Información del Origen</Text>

                    <View style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 10,
                        paddingBottom: 5,
                        border: '1px solid green',
                        borderRadius: 3,
                        height: 55
                    }} >

                        <View style={styles.header_info_box_superior}>
                            <View style={styles.header_info_inferior}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Productor: </Text>
                                    <Text style={styles.header_date_info_text}>{state.guia.nombre_productor}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Correo de Productor: </Text>

                                    <Text style={styles.header_date_info_text}>{state.guia.email_productor}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Camión: </Text>

                                    <Text style={styles.header_date_info_text}>Patente {camion?.patente}, {`${camion?.acoplado ? 'Con acoplado' : 'Sin acoplado' }`}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.header_info_box_superior}>
                            <View style={styles.header_info_inferior}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Rut Conductor: </Text>
                                    <Text style={styles.header_date_info_text}>{camionero?.rut}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>N° Guía Productor: </Text>
                                    <Text style={styles.header_date_info_text}>{state.guia?.numero_guia_productor}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Nombre Conductor: </Text>
                                    <Text style={styles.header_date_info_text}>{state.guia?.nombre_camionero}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {
                        state.guia?.lotesrecepcionmp.map((lote: TLoteGuia) => {
                          if (lote.estado_recepcion != '4' && lote.lote_rechazado === null) {
                            const envase_lote = lote.envases.map((envase: any) => {
                                return envases?.find(envase_b => envase_b.id === envase.envase)
                            })

                            const cantidad = lote.envases.map((lote) => {
                                return lote.cantidad_envases
                            })

                            const variedad = lote.envases.map((lote) => {
                                return lote.variedad
                            })

                            const variedad_lote = variedadFilter.find(variety => variety.value === String(variedad))?.label
                            

                            // const kilo_fruta_neto = (lote.kilos_brutos_1 + lote.kilos_brutos_2) - (lote.kilos_tara_1) + lote.kilos_tara_2
                            const kilos_total_envases = lote.envases.map((envase_lote) => {
                                const envaseTotal = envases?.
                                filter((envase) => envase.id === envase_lote.envase).
                                reduce((acumulador, envase) => acumulador + (envase_lote.cantidad_envases * envase.peso), 0)
                                return envaseTotal;
                            })
                            const kilo_fruta_neta_final = (Number(lote.kilos_brutos_1) + Number(lote.kilos_brutos_2)) - (Number(lote.kilos_tara_1) + Number(lote.kilos_tara_2)) - Number(sum(kilos_total_envases))
                            const kilos_brutos = Number(lote.kilos_brutos_1) + Number(lote.kilos_brutos_2)
                            const kilos_tara = Number(lote.kilos_tara_1) + Number(lote.kilos_tara_2) 
                            
                            return (

                                <View wrap={false}>

                                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginTop: '1%', marginBottom: '1%'}}>Informacion de Lote N°{lote.numero_lote}</Text>

                                    {/* KILOS */}
                                    <View style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: 10,
                                        paddingTop: 5,
                                        border: '1px solid green',
                                        borderRadius: 3,
                                        height: 45 
                                    }}
                                    wrap={false}
                                    >

                                        <View style={styles.header_info_box_superior}>
                                            <View style={styles.header_info_inferior}>
                                                <View style={styles.header_date_info_box}>
                                                    <Text style={styles.header_date_info_text}>Kilos Brutos: </Text>
                                                    <Text style={styles.header_date_info_text}> {kilos_brutos} kgs</Text>
                                                </View>

                                                <View style={styles.header_date_info_box}>
                                                    <Text style={styles.header_date_info_text}>Kilos Tara: </Text>
                                                    <Text style={styles.header_date_info_text}> {kilos_tara} kgs</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <View style={styles.header_info_inferior}>
                                            
                                                <View style={styles.header_date_info_box}>
                                                    <Text style={styles.header_date_info_text}>Kilos Total Envases: </Text>
                                                    <Text style={styles.header_date_info_text}>{kilos_total_envases} kgs</Text>
                                                </View>

                                                <View style={styles.header_date_info_box}>
                                                    <Text style={styles.header_date_info_text}>Kilos Fruta Neta: </Text>
                                                    <Text style={styles.header_date_info_text}>{(kilo_fruta_neta_final ?? 0).toFixed(2)} kgs</Text> 
                                                </View>
                                                
                                            </View>
                                        
                                        </View>
                                    </View>
                                    
                                    {/* PRODUCTOS / VARIEDADES */}
                                    <Text style={{ textAlign: 'center', fontSize: 12, fontWeight: 'bold', marginTop: '1%', marginBottom: '1%' }}>Productos / Variedades</Text>
                                    
                                    {/* THEADER */}
                                    <View style={{ 
                                        width: '100%',
                                        height: 26,
                                        backgroundColor: 'lightgray',
                                        borderRadius: '1px', 
                                        display: 'flex',
                                        flexDirection: 'row',
                                        fontWeight: 'bold',
                                        paddingBottom: 2
                                        }}
                                        wrap={false}>

                                        <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Lote</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Envase</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Cantidad</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Peso X Envase</Text>
                                        </View>


                                        <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Variedad</Text>
                                        </View>
                                    </View>

                                    {/* TBODY - Iteramos sobre cada envase del lote */}

                                      {lote?.envases?.map((envaseItem, envaseIndex) => {
                                          // Calculamos el peso neto para este envase específico
                                          console.log(lote)
                                          console.log(envaseItem)
                                          console.log(envases)
                                          // const pesoNetoEnvase = (envaseItem.cantidad_envases * (envases?.find((e : any) => e.id === envaseItem.envase)?.peso || 0)).toFixed(2);
                                          // get the pesoNetoEnvase from kilos_fruta_neta_final and divide it by the cantidad_envases
                                          const pesoNetoEnvase = (kilo_fruta_neta_final / envaseItem.cantidad_envases).toFixed(2);
                                          
                                          return (
                                              <View key={`envase-${envaseItem.id}`} style={{ 
                                                  width: '100%',
                                                  height: 30,
                                                  borderRadius: '1px', 
                                                  display: 'flex',
                                                  flexDirection: 'row',
                                              }} wrap={false}>
                                                  {/* Mostramos el número de lote solo en la primera fila */}
                                                  <View style={styles.header_info_box_superior}>
                                                      <Text style={{ fontSize: 10}}>{lote.numero_lote}</Text>
                                                  </View>
                                                  
                                                  <View style={styles.header_info_box_superior}>
                                                      <Text style={{ fontSize: 10}}>
                                                          {envase_lote.find((e : any) => e.id === envaseItem.envase)?.nombre || 'N/A'}
                                                      </Text>
                                                  </View>
                                                  
                                                  <View style={styles.header_info_box_superior}>
                                                      <Text style={{ fontSize: 10}}>{envaseItem.cantidad_envases}</Text>
                                                  </View>
                                                  
                                                  <View style={styles.header_info_box_superior}>
                                                      <Text style={{ fontSize: 10}}>
                                                          {envase_lote.find((e: any) => e.id === envaseItem.envase)?.peso || '0'} kgs
                                                      </Text>
                                                  </View>
                                                  

                                                  
                                                  <View style={styles.header_info_box_superior}>
                                                      <Text style={{ fontSize: 10}}>{envaseItem.variedad || variedad_lote}</Text>
                                                  </View>
                                              </View>
                                          );
                                      })}

                                    <View style={{width: '100%', borderTop: '1px #0000 solid', alignSelf: 'center', marginVertical: '1%'}}></View>
                                
                                </View>

                            )
                          } else {
                            return (
                              <>
                                <Text style={{textAlign: 'center'}}>Lote Rechazado N° {lote.lote_rechazado?.numero_lote_rechazado}: {lote.lote_rechazado?.resultado_rechazo_label}</Text>
                                <View style={{width: '100%', borderTop: '1px #0000 solid', alignSelf: 'center', marginVertical: '1%'}}></View>
                              </>
                            )
                          }
                        })
                    }

                </View>
            </Page>
        </Document>
    </PDFViewer >
  )
}

export default GuiaRecepcionPDF