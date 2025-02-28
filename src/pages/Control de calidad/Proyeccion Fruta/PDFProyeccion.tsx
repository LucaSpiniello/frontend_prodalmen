import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font, Image, pdf } from '@react-pdf/renderer';
import { TRendimiento } from "../../../types/TypesControlCalidad.type"
import { useEffect, useState } from "react"


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
    padding: 20

  },
  header_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10
  },
  header_inferior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  header_logo_box: {
    width: 30,
    height: 30,
  },
  header_info_box_superior: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 12
  },
  header_info_inferior: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',  // Las filas estarán en columnas
    gap: 5,
    marginBottom: 2,
    border: '1px solid green',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 5,
    overflow: 'hidden',  // Evitar desbordamiento
},
header_date_info_box: {
  width: '100%',
  display: 'flex',
  flexDirection: 'row',  // Mantener las filas
  alignItems: 'center',  // Alinea los textos verticalmente en el centro
  justifyContent: 'flex-start',  // Mantener los textos alineados a la izquierda
  gap: 5,
  flexWrap: 'nowrap',  // No permitir que el texto pase a la siguiente línea
},
  header_date_info: {
    width: 190,
    height: '100%',
    border: '1px solid green',
    borderRadius: 5,
    padding: 5
  },
  header_date_info_text: {
    fontSize: 8,
    whiteSpace: 'nowrap',  // Evita que el texto haga saltos de línea
    overflow: 'hidden',  // Evita que el texto desborde su contenedor
    textOverflow: 'ellipsis',  // Mostrar puntos suspensivos si el texto es muy largo
    flexGrow: 1,  // El texto ocupará el espacio disponible pero no más de lo necesario
},
  body: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 5,
    gap: 2
  },
  body_cc_ren_and_calibre: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    gap: 10,

  },
  body_table: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid green',
    borderRadius: 5
  },
  body_table_header: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: '1px solid green',
    padding: 1
  },
  body_table_info: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  body_table_info_text: {
    fontSize: 8,
    paddingVertical: 4,
    borderRight: '1px solid green',
    paddingRight: 2,
    textAlign: 'center',
    borderBottom: '1px solid green',

  },
  body_table_rows: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  boxes_table_row: {
    margin: 'auto',
    width: '100%'
  }
})

const MyDocument: React.FC<{ controlCombinado: TRendimiento, variedad: string, productor: string , isPacificNut : boolean}> = ({ controlCombinado, variedad, productor, isPacificNut }) => {

  if (!controlCombinado || !controlCombinado.cc_calculo_final) {
    return <div>No hay datos</div>;
  }

  if (!productor) {
    productor = 'Todos '
  }
  if (!variedad) {
    variedad = 'Todas'
  }
  const fecha = new Date();
  const horaActual = fecha.getHours() + ':' + fecha.getMinutes();
  const fechaFormat = fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();


  return (
    <Document title={`Proyeccion Fruta Productores: ${productor}`}>
      <Page style={styles.page} size='A4'>
        <View style={styles.header}>
          <View style={styles.header_superior}>
          { isPacificNut ?
              <View style={{ position: 'relative', top: -30 }}>
              <Image source="/src/assets/logoPacific.jpg" style={{ height: 100, width: 100 }} />
              <Text style={{ fontSize: 5, width: 100 }}>Pacific Nut Company Chile S.A.
                Dirección: Cam. Padre Hurtado 19956, San Bernardo, Región Metropolitana
                Teléfonos: +56978460481 </Text>
              </View>
            :
              <View style={{ position: 'relative', top: -30 }}>
                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100 }} />
                <Text style={{ fontSize: 5, width: 100 }}>Actividades de Apoyo a la agrícultura
                  Dirección: Fundo Challay Alto Lote A-1, Paine
                  Teléfonos: +56 2 228215583 - +56 2 2282 25584</Text>
              </View>  
            }

            <View style={{ width: 190, border: '1px solid green', height: 30, padding: 5, borderRadius: 5, position: 'relative', top: 20 }}>
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fecha : </Text>
                <Text style={styles.header_date_info_text}>{fechaFormat}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Hora : </Text>
                <Text style={styles.header_date_info_text}>{horaActual}</Text>
              </View>

            </View>
          </View>

          <Text style={{ textAlign: 'center', fontSize: 14, position: 'relative', top: -50 }}>Informe Proyeccion Fruta Productor {productor}</Text>

          <View style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            position: 'relative',
            top: -50
          }}>


            <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10 }}>Datos Acumulativos </Text>
              <View style={styles.header_info_inferior}>


                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Variedad: </Text>

                  <Text style={styles.header_date_info_text}>{variedad}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Productor: </Text>

                  <Text style={styles.header_date_info_text}>{productor}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Kilos Totales: </Text>
                  <Text style={styles.header_date_info_text}>{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(controlCombinado.cc_calculo_final.kilos_netos)} kgs</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Lotes: </Text>
                  <Text style={styles.header_date_info_text}>{controlCombinado.lotes} </Text>
                </View>

              </View>
            </View>

          </View>
        </View>

        <View style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white',
          justifyContent: 'flex-start',
          padding: 10,
          gap: 2,
          position: 'relative',
          top: -55,
          height: 550,
        }}>
          <View style={styles.header_inferior}>

            <View style={{
              width: '100%',
              height: 220,
              position: 'relative',
              top: 0
            }}>
              <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 2 }}>Calibres</Text>
              <View style={{ width: '100%', height: '100%' }}>
                <View style={styles.body_table}>

                  <View style={styles.body_table_header}>
                    <View style={{ width: '100%' }}>
                      <Text style={styles.header_date_info_text}>MM</Text>
                    </View>
                    <View style={styles.boxes_table_row}>
                      <Text style={styles.header_date_info_text}>U/oz</Text>
                    </View>
                    <View style={styles.boxes_table_row}>
                      <Text style={styles.header_date_info_text}>Kilos</Text>
                    </View>
                    <View style={styles.boxes_table_row}>
                      <Text style={styles.header_date_info_text}>%</Text>
                    </View>
                  </View>


                  <View style={styles.body_table_info}>

                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>16</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>18/20</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_18_20! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_18_20.toFixed(1)}%</Text>
                      </View>
                    </View>



                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>15</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>20/22</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_20_22! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_20_22.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>14</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>23/25</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_23_25! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_23_25.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>13</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>25/27</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_25_27! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_25_27.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>12</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>27/30</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_27_30! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_27_30.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>11</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>30/32</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_30_32! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_30_32.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>10</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>32/34</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_32_34! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_32_34.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>9</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>34/36</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_34_36! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_34_36.toFixed(1)}%</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>8</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>36/40</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_36_40! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_36_40.toFixed(1)}%</Text>
                      </View>
                    </View>

                    0
                    <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>&lt;8</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>40/+</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].calibre_40_mas! * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.cc_pepa_calibre[0].calibre_40_mas.toFixed(1)}%</Text>
                      </View>
                    </View>

                    0
                    <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>&lt;8</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', textAlign: 'center', borderRight: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>Pre calibre</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            Math.round((controlCombinado.cc_pepa_calibre[0].precalibre * controlCombinado.cc_kilos_des_merma[0].exportable! / 100) * 10) / 10
                          )} kgs
                        </Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', textAlign: 'center', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>{controlCombinado.cc_pepa_calibre[0].precalibre.toFixed(1)}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.header_inferior}>
              <View style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                top: 0
              }}>

                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px' }}>Rendimientos</Text>
                <View style={{ width: '100%', height: 145 }}>
                  <View style={styles.body_table}>

                    <View style={styles.body_table_header}>
                      <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>Detalle</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>%</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>Kilos Desc.</Text>
                      </View>
                    </View>

                    <View style={styles.body_table_info}>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Basura</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.basura}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                              {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                                controlCombinado.cc_promedio_porcentaje_muestras.basura * controlCombinado.cc_calculo_final.kilos_netos / 100
                              )} kgs
                            </Text>
                          </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Cascara</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.cascara}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                        <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            controlCombinado.cc_promedio_porcentaje_muestras.cascara * controlCombinado.cc_calculo_final.kilos_netos / 100
                          )} kgs
                        </Text>
                      </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Ciega</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.ciega}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                        <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            controlCombinado.cc_promedio_porcentaje_muestras.ciega * controlCombinado.cc_calculo_final.kilos_netos / 100
                          )} kgs
                        </Text>
                      </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Pelon</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.pelon}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.cc_promedio_porcentaje_muestras.pelon * controlCombinado.cc_calculo_final.kilos_netos / 100
                            )} kgs
                          </Text>
                        </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Huerto</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.pepa_huerto}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.cc_promedio_porcentaje_muestras.pepa_huerto * controlCombinado.cc_calculo_final.kilos_netos / 100
                            )} kgs
                          </Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Pepa Bruta</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{controlCombinado.cc_promedio_porcentaje_muestras.pepa_bruta}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.cc_promedio_porcentaje_muestras.pepa_bruta * controlCombinado.cc_calculo_final.kilos_netos / 100
                            )} kgs
                          </Text>
                        </View>
                      </View>

                    </View>

                  </View>
                </View>

              </View>
            </View>
          </View>

          <View style={styles.header_inferior}>


            <View style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              top: 10
            }}>

            {isPacificNut ? <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px', marginTop: 20 }}>Defectos Internos</Text>  : <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px', marginTop: 20 }}>Desechos</Text>}
              <View style={{ width: '100%', height: 143 }}>
                <View style={styles.body_table}>

                  <View style={styles.body_table_header}>
                    <View style={{ width: '100%' }}>
                    {isPacificNut ? <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>Defectos</Text> : <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>Desechos</Text>}
                    </View>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>Kilos Desc.</Text>
                    </View>
                  </View>
                  <View style={styles.body_table_info}>
                  <View style={styles.body_table_rows}>
                    <View style={{ width: '350px' }}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Daño insecto</Text>
                    </View>

                    <View style={{ width: '350px' }}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                          controlCombinado.cc_descuentos[0].insecto
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Presencia de Hongo</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.cc_descuentos[0].hongo
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Vana Deshidratada</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.cc_descuentos[0].vana
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Punto de Goma</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.cc_descuentos[0].pgoma
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Goma</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.cc_descuentos[0].goma
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.boxes_table_row}>
                    {isPacificNut ? <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total Defectos</Text> : <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total Deshecho</Text>}
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                          controlCombinado.cc_descuentos[0].desechos
                        )} Kgs
                      </Text>
                    </View>
                  </View>
                </View>
                </View>
              </View>

            </View>

            <View style={{
                width: '100%',
                height: '160',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                justifyContent: 'space-between',
                position: 'relative',
                top: 0,
              }}>
                <Text style={{ fontSize: 14, textAlign: 'center' }}>Resumen</Text>
                <View style={{ width: '100%', height: 58, border: '1px solid green', borderRadius: 4, padding: '5px' }}>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Totales Recepcionados: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((controlCombinado.cc_calculo_final.kilos_netos))} kgs</Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Pepa Bruta: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                          controlCombinado.cc_calculo_final.kilos_brutos
                        )} kgs
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Porcentaje Pepa Bruta: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{(controlCombinado.cc_calculo_final.kilos_brutos * 100 / controlCombinado.cc_calculo_final.kilos_netos ).toFixed(1) } %</Text>
                    </View>
                  </View>
                    
                    { isPacificNut ? 
                                <div>
                                <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                                  <View style={{ width: 150 }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Fuera de norma: </Text>
                                  </View>
                                  <View style={{ width: '50%' }}>
                                    <Text style={styles.header_date_info_text}>{ ((controlCombinado?.cc_descuentos[0]?.cat2 ?? 0) + (controlCombinado?.cc_descuentos[0]?.desechos ?? 0)).toFixed(1) } kgs</Text>
                                  </View>

                                </View>
                                </div>   
                        : 
                              <div>   
                              <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                              <View style={{ width: 150 }}>
                                <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Pepa Exportable: </Text>
                              </View>
                              <View style={{ width: '50%' }}>
                                <Text style={styles.header_date_info_text}>{controlCombinado?.cc_kilos_des_merma[0].exportable?.toFixed(1)} kgs</Text>
                              </View>

                            </View>

                            <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                              <View style={{ width: 150 }}>
                                <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Porcentaje Pepa Exportable: </Text>
                              </View>

                              <View style={{ width: '50%' }}>
                                <Text style={styles.header_date_info_text}>{(controlCombinado?.cc_kilos_des_merma[0].exportable! / controlCombinado?.cc_calculo_final.kilos_netos! * 100).toFixed(2)} %</Text>
                              </View>
                            </View>
                            </div> 




                      }



                </View>

                <View style={{
                  width: '100%',
                  height: 47,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  border: '1px solid green',
                  borderRadius: 5,
                  padding: 5,
                  paddingLeft: 10,
                }}>

                  <View style={{
                    width: '100%',
                    height: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 2
                  }}>
                    <View style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 1,
                      marginBottom: 3
                    }}>
                      <Text style={{ fontSize: 8 }}></Text>
                      <Text style={{ fontSize: 8 }}></Text>
                      <Text style={{ fontSize: 8, position: 'relative', left: -50 }}>Final</Text>
                    </View>

                    <View style={{
                      width: '100%',
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 20
                    }}>
                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                            { isPacificNut ?
                            <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                              <Text style={{ fontSize: 8 }}>Pepa Bruta</Text>
                            </View>
                            :
                              <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                                <Text style={{ fontSize: 8 }}>Almendras Exportables</Text>
                              </View>
                            }

                            { isPacificNut ?
                            <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                              <Text style={{ fontSize: 8 }}>{controlCombinado?.cc_calculo_final.kilos_brutos} kgs</Text>
                            </View>
                            :
                            <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                              <Text style={{ fontSize: 8 }}>{controlCombinado?.cc_calculo_final.final_exp} kgs</Text>
                            </View>
                            } 
                      </View>
                    </View>

                    <View style={{
                      width: '100%',
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 20
                    }}>
                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                        <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                          <Text style={{ fontSize: 8 }}>CAT 2</Text>
                        </View>
                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                          <Text style={{ fontSize: 8 }}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.cc_calculo_final.final_cat2
                            )}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={{
                      width: '100%',
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 20
                    }}>
                      <View style={{
                        width: '100%',
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}>
                        <View style={{ width: '300px', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                        {isPacificNut ? <Text style={{ fontSize: 8 }}>Defectos</Text> : <Text style={{ fontSize: 8 }}>Desechos</Text>}
                        </View>

                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                          <Text style={{ fontSize: 8 }}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.cc_calculo_final.final_des
                            )} kgs
                          </Text>
                        </View>

                      </View>
                    </View>
                  </View>
                </View>
  
                {isPacificNut ? 
                            <View style={{ width: '100%', display: 'flex', height: 90, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, position: 'absolute', top: 220 }}>
                            <Image source='/src/assets/firmaTrini.png' style={{ width: 90, height: 50 }} />
                            <Text style={{
                              borderBottom: '1px solid green',
                              height: 15,
                              width: '100%',
                              fontSize: 8,
                              textAlign: 'center'
                            }}>
                              CC Aprobado por Trinidad Milnes
                              </Text>
                              <Text style={{ fontSize: 9 }}>Jefa Programa Almendras</Text>
                            </View>
                        : 
                          <View style={{ width: '100%', display: 'flex', height: 90, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 5, position: 'absolute', top: 220 }}>
                            <Image source='/src/assets/firma_donandres.png' style={{ width: 90, height: 50 }} />
                            <Text style={{
                              borderBottom: '1px solid green',
                              height: 15,
                              width: '100%',
                              fontSize: 8,
                              textAlign: 'center'
                            }}>
                              CC Aprobado por Andres Hasbun
                            </Text>
                            <Text style={{ fontSize: 9 }}>Gerente de Operaciones</Text>
                          </View>
                  }
              </View>


          </View>
        </View>
      </Page>
    </Document>
  );
};


const PDFProyeccion: React.FC<{ controlCombinado: TRendimiento, variedad: string, productor: string, isPacificNut : boolean }> = ({ controlCombinado, variedad, productor, isPacificNut }) => {
  
  const generateAndDownloadPDF = async () => {
    const doc = <MyDocument controlCombinado={controlCombinado} variedad={variedad} productor={productor} isPacificNut = {isPacificNut}/>;
    const blob = await pdf(doc).toBlob();
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'control-calidad-proyeccion.pdf';
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <button onClick={generateAndDownloadPDF} className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
      Generar y Descargar PDF
    </button>
  );
};

export default PDFProyeccion;
