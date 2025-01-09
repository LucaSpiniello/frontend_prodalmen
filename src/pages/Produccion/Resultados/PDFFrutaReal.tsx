import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font, Image, pdf } from '@react-pdf/renderer';
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
    textAlign: 'center'
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

const PdfRenderFruta: React.FC<{ controlCombinado: any, variedad: string, productor: string, fechaInicio : Date, fechaFinal : Date}> = ({ controlCombinado, variedad, productor, fechaInicio, fechaFinal}) => {

  if (!controlCombinado ) {
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
            <View style={{ position: 'relative', top: -30 }}>
              <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100 }} />
              <Text style={{ fontSize: 5, width: 100 }}>Actividades de Apoyo a la agrícultura
                Dirección: Fundo Challay Alto Lote A-1, Paine
                Teléfonos: +56 2 228215583 - +56 2 2282 25584</Text>
            </View>

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

          <Text style={{ textAlign: 'center', fontSize: 13, position: 'relative', top: -40 }}>
            {`Informe Fruta Seleccionada ${fechaInicio && fechaFinal ? `desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFinal.toLocaleDateString()}` : ''}`}
          </Text>

          <View style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            position: 'relative',
            top: -45
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
                            controlCombinado.calibres["18/20"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["18/20"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["20/22"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["20/22"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["23/25"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["23/25"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["25/27"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["25/27"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["27/30"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["27/30"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["30/32"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["30/32"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["32/34"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["32/34"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["34/36"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["34/36"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["36/40"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["36/40"].pct.toFixed(2)}%</Text>
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
                            controlCombinado.calibres["40/mas"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["40/mas"].pct.toFixed(2)}%</Text>
                      </View>
                    </View>

                    0
                    <View style={styles.body_table_rows}>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>&lt;8</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>PreCalibre</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={styles.body_table_info_text}>
                          {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                            controlCombinado.calibres["PreCalibre"].kilos
                          )} kgs
                        </Text>
                      </View>

                      <View style={styles.boxes_table_row}>
                        <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{controlCombinado.calibres["PreCalibre"].pct.toFixed(2)}%</Text>
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

              <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px' }}>Mermas</Text>
              <View style={{ width: '100%', height: 200 }}>
                <View style={styles.body_table}>

                  <View style={styles.body_table_header}>
                    <View style={{ width: '100%' }}>
                      <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>Desechos</Text>
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
                          controlCombinado.perdidas.insecto_kilos
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
                          controlCombinado.perdidas.hongo_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Trozo</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.trozo_kilos
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
                          controlCombinado.perdidas.p_goma_kilos
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
                          controlCombinado.perdidas.goma_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Picada</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.picada_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Dobles</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.dobles_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Basura</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.basura_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Mezcla</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.mezcla_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={styles.body_table_rows}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Color</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
                          controlCombinado.perdidas.color_kilos
                        )} Kgs
                      </Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total Merma</Text>
                    </View>

                    <View style={styles.boxes_table_row}>
                      <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>
                        {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                          controlCombinado.perdidas.kilos_total_perdidas
                        )} Kgs
                      </Text>
                    </View>
                  </View>
                </View>
                </View>
              </View>

            </View>

            
            <View style={{
              flexDirection: 'column',
              width: '100%',
              display: 'flex',
              position: 'relative',
              gap: 2,
            }}>

              <View style={{
                  width: '100%',
                  height: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'space-between',
                  position: 'relative',
                  top: 10,
                }}>

                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px'}}>Detalle Calidad</Text>
                <View style={{ width: '100%', height: 100 }}>
                  <View style={styles.body_table}>

                    <View style={styles.body_table_header}>
                      <View style={{ width: '100%' }}>
                        <Text style={styles.header_date_info_text}>Calidad</Text>
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
                        <View style={{ width: '100%' }}>
                          <Text style={styles.body_table_info_text}>Extra N° 1</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.calidades["Extra N°1"].kilos
                            )} kgs
                          </Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{controlCombinado.calidades["Extra N°1"].pct.toFixed(2)}%</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={{ width: '100%' }}>
                          <Text style={styles.body_table_info_text}>Supreme</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.calidades["Supreme"].kilos
                            )} kgs
                          </Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{controlCombinado.calidades["Supreme"].pct.toFixed(2)}%</Text>
                        </View>
                      </View>

                      
                      <View style={styles.body_table_rows}>
                        <View style={{ width: '100%' }}>
                          <Text style={styles.body_table_info_text}>Whole & Broken</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.calidades["Whole & Broken"].kilos
                            )} kgs
                          </Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{controlCombinado.calidades["Whole & Broken"].pct.toFixed(2)}%</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={{ width: '100%' }}>
                          <Text style={styles.body_table_info_text}>Sin Calidad</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>
                            {new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(
                              controlCombinado.calidades["Sin Calidad"].kilos
                            )} kgs
                          </Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{controlCombinado.calidades["Sin Calidad"].pct.toFixed(2)}%</Text>
                        </View>
                      </View>
                        
                    </View>

                  </View>
              </View>          
              </View>  

              <View style={{
                  width: '100%',
                  height: '60',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  justifyContent: 'space-between',
                  position: 'relative',
                  top: 50,
                }}>
                  <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: '10px'}}>Resumen</Text>
                  <View style={{ width: '100%', height: 50, border: '1px solid green', borderRadius: 4, padding: '5px' }}>

                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Totales Seleccionados: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((controlCombinado.fruta_seleccionada))} kgs</Text>
                      </View>
                    </View>

                    
                    <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                      <View style={{ width: 150 }}>
                        <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Totales Merma: </Text>
                      </View>
                      <View style={{ width: '50%' }}>
                        <Text style={styles.header_date_info_text}>{new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format((controlCombinado.perdidas.kilos_total_perdidas))} kgs</Text>
                      </View>
                    </View>
                  </View>
              </View>
  
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
            </View>


          </View>
        </View>
      </Page>
    </Document>
  );
};


const PDFFrutaReal: React.FC<{ controlCombinado: any, variedad: string, productor: string, fechaInicio : Date, fechaFinal : Date }> = ({ controlCombinado, variedad, productor, fechaInicio, fechaFinal }) => {
  
  const generateAndDownloadPDF = async () => {
    const doc = <PdfRenderFruta controlCombinado={controlCombinado} variedad={variedad} productor={productor} fechaInicio={fechaInicio} fechaFinal ={fechaFinal}/>;
    const blob = await pdf(doc).toBlob();
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fruta-real-pdf.pdf';
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <button onClick={generateAndDownloadPDF} className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
      Generar y Descargar PDF Fruta Seleccionada
    </button>
  );
};

export default PDFFrutaReal;
