import { Document, Image, PDFViewer, Page, StyleSheet, Text, View } from "@react-pdf/renderer"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { TRendimiento } from "../../../types/TypesControlCalidad.type"
import { useEffect, useState } from "react"
import { fetchGuiaRecepcion } from "../../../redux/slices/recepcionmp"
import ChartJsImage from 'chartjs-to-image';
import { format } from "@formkit/tempo"
import { useAuth } from "../../../context/authContext"
import { fetchControlCalidad, fetchRendimientoLotes } from "../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';

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
    width: '100%',
    height: 60,
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
    marginBottom: 2,
    border: '1px solid green',
    borderRadius: 5,
    padding: 5,
    paddingLeft: 5
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
    fontSize: 8,
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

const CCRendimiento = () => {
  const { id } = useParams()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const usuario = useAppSelector((state: RootState) => state.auth.dataUser)
  const guia = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.control_calidad)
  const rendimientos = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes)
  const rendimiento_cc = rendimientos?.cc_muestra[0] ? rendimientos.cc_muestra[0] : [];



  let valores: any
  let labels: any
  let formattedData: any

  // useEffect(() => {
  //   //@ts-ignores
  // }, [])

  useEffect(() => {
    //@ts-ignores
    dispatch(fetchControlCalidad({ id, token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {
    if (control_calidad) {
      //@ts-ignore
      dispatch(fetchGuiaRecepcion({ id: control_calidad?.guia_recepcion, token, verificar_token: verificarToken }))
      dispatch(fetchRendimientoLotes({ id: control_calidad.recepcionmp, params: { variedad: 'todas' }, token, verificar_token: verificarToken }))
    }
  }, [control_calidad])

  const labels_pre = Object.keys(rendimiento_cc || {});
  valores = Object.values(rendimiento_cc || {});

  const entry = Object.entries(rendimiento_cc)
  const filteredEntry = entry.filter(([key]) => key !== 'cc_lote')
  formattedData = filteredEntry.map(([key, value]) => ({
    label: key,
    data: [value]
  }));

  labels = labels_pre.map((label, index) => {
    if (label !== 'cc_lote') {
      return `${label}: ${valores[index].toFixed(1)}%`;
    }
    return null
  }).filter(label => label !== null);






  useEffect(() => {
    if (!formattedData) {
      return
    }

    const myChart = new ChartJsImage();
    myChart.setConfig({
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: formattedData.map((item: any) => item.data[0]),
          backgroundColor: ['#ffcd5c', '#5CEBAF', '#3b82f6', '#F43F5E', '#D885FF', '#0ece6e'],
          borderColor: 'darkgreen',
          borderWidth: 2, // Ancho del borde del gráfico
          hoverBackgroundColor: ['#FFD700', '#00FF7F', '#1E90FF', '#FF69B4', '#EE82EE', '#32CD32'],
          hoverBorderColor: '#000000', // Color del borde al pasar el mouse
          hoverBorderWidth: 3, // Ancho del borde al pasar el mouse
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: 14,
                family: 'Arial',
                style: 'italic',
                weight: 'bold',
              },
              color: 'black', // Color de las etiquetas de la leyenda
            },
          },
          title: {
            display: true,
            text: 'My Pie Chart',
            font: {
              size: 24,
              family: 'Arial',
              style: 'italic',
              weight: 'bold',
            },
            color: 'darkblue',
            padding: {
              top: 10,
              bottom: 30,
            },
          },
          tooltip: {
            enabled: true,
            backgroundColor: 'rgba(0,0,0,0.7)', // Color de fondo del tooltip
            titleFont: {
              size: 16,
              weight: 'bold',
              family: 'Arial',
            },
            bodyFont: {
              size: 14,
              family: 'Arial',
            },
            borderColor: 'darkgreen',
            borderWidth: 1,
          },
        },
      },
    }).setHeight(500).setWidth(650);

    setImageSrc(myChart.getUrl());

    return () => { }
  }, [formattedData]);

  const año = new Date()
  const guia_recepcion = guia?.id
  const n_guia = guia?.numero_guia_productor


  return (
    <PDFViewer style={{ height: '100%' }}>
      <Document title={`CDR_${control_calidad?.numero_lote}_${format(control_calidad?.fecha_creacion!, { date: 'short' }, 'es')}_${guia?.nombre_productor}`}>
        <Page style={styles.page} size='A4'>
          <View style={styles.header}>
            <View style={styles.header_superior}>
              <View style={{ position: 'relative', top: -30 }}>
                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100 }} />
                <Text style={{ fontSize: 5, width: 100 }}>Actividades de Apoyo a la agrícultura
                  Dirección: Fundo Challay Alto Lote A-1, Paine
                  Teléfonos: +56 2 228215583 - +56 2 2282 25584</Text>
              </View>

              <View style={{ width: 190, border: '1px solid green', height: 40, padding: 5, borderRadius: 5, position: 'relative', top: 20 }}>
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Fecha Recepción: </Text>
                  <Text style={styles.header_date_info_text}>{format(guia?.fecha_creacion!, { date: 'short' }, 'es')}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Hora Recepción: </Text>
                  <Text style={styles.header_date_info_text}>{format(guia?.fecha_creacion!, { time: 'short' }, 'es')}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Registrado Por: </Text>

                  <Text style={styles.header_date_info_text}>{usuario?.first_name}</Text>
                </View>
              </View>
            </View>

            <Text style={{ textAlign: 'center', fontSize: 14, position: 'relative', top: -50 }}>Informe Control De Calidad Materia Prima</Text>

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
                <Text style={{ fontSize: 10 }}>Datos Guia Recepcion Materia Prima </Text>
                <View style={styles.header_info_inferior}>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>N° Lote: </Text>
                    <Text style={styles.header_date_info_text}>{control_calidad?.numero_lote}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Variedad: </Text>

                    <Text style={styles.header_date_info_text}>{control_calidad?.variedad}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Productor: </Text>

                    <Text style={styles.header_date_info_text}>{guia?.nombre_productor}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Comercializador: </Text>

                    <Text style={styles.header_date_info_text}>{guia?.nombre_comercializador}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Guia Recepción Interna: </Text>

                    <Text style={styles.header_date_info_text}>MP {guia_recepcion}</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>N° Guia Productor: </Text>

                    <Text style={styles.header_date_info_text}>{n_guia}</Text>
                  </View >

                </View>
              </View>

              <View style={styles.header_info_box_superior}>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Datos Inspección Control De Calidad</Text>
                <View style={styles.header_info_inferior}>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Kilos Totales: </Text>
                    <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_netos} kgs</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Humedad: </Text>

                    <Text style={styles.header_date_info_text}>{control_calidad?.humedad} %</Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Presencia de insectos:</Text>

                    <Text style={styles.header_date_info_text}>{control_calidad?.presencia_insectos ? 'Con presencia de insectos' : 'Sin presencia de insectos'}</Text>
                  </View>

                </View>
              </View>


            </View>


            <Text style={{
              fontSize: 14,
              marginTop: 10,
              textAlign: 'center',
              position: 'relative',
              top: -53
            }}>Observaciones</Text>
            <View style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              height: 45,
              border: '1px solid green',
              borderRadius: 5,
              position: 'relative',
              top: -50,
              padding: 5
            }}>
              <Text style={{ fontSize: 8 }}>
                {control_calidad?.observaciones}
              </Text>
            </View>
          </View>

          <View style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'white',
            justifyContent: 'space-between',
            padding: 20,
            gap: 2,
            position: 'relative',
            top: -55,
            height: 540,
          }}>
            <View style={styles.header_inferior}>
              <View style={{
                width: '100%',
                position: 'relative',
                top: -20
              }}>
                <Text style={{ fontSize: 8 }}>Control Rendimiento</Text>
                <View style={{ width: '100%', height: 170, padding: 20 }} >
                  <Image source={`${imageSrc}`} style={{ height: 150 }} />

                </View>
              </View>
              <View style={{
                width: '100%',
                position: 'relative',
                top: -20
              }}>
                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: 5 }}>Calibres</Text>
                <View style={{ width: '100%', height: '120%' }}>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_18_20! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_18_20}%</Text>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_20_22! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_20_22}%</Text>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_23_25! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_23_25}%</Text>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_25_27! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_25_27}%</Text>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_27_30! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_27_30}%</Text>
                        </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>10</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>30/32</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_30_32! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_30_32}%</Text>
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
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_32_34! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_32_34}%</Text>
                        </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>-10</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>34/36</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_34_36! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_34_36}%</Text>
                        </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>-10</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>36/40</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_36_40! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_36_40}%</Text>
                        </View>
                      </View>

                      0
                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderRight: '1px solid green', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, color: 'white', fontSize: 8 }}>a</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>40/+</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={styles.body_table_info_text}>{(rendimientos?.cc_pepa_calibre[0].calibre_40_mas! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', borderBottom: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8, textAlign: 'center' }}>{rendimientos?.cc_pepa_calibre[0].calibre_40_mas}%</Text>
                        </View>
                      </View>

                      0
                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', textAlign: 'center', borderRight: '1px solid green', paddingVertical: 4, paddingRight: 2, color: 'white', fontSize: 8 }}>a</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', textAlign: 'center', borderRight: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>Pre calibre</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', textAlign: 'center', borderRight: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>{(rendimientos?.cc_pepa_calibre[0].precalibre! * rendimientos?.cc_kilos_des_merma[0].exportable! / 100).toFixed(1)} kgs</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ width: '100%', textAlign: 'center', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>{rendimientos?.cc_pepa_calibre[0].precalibre}%</Text>
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
                top: -50
              }}>
                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px' }}>CAT 2</Text>
                <View style={{ width: '100%', height: 180 }}>
                  <View style={styles.body_table}>


                    <View style={styles.body_table_header}>
                      <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>CAT 2</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>%</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>% Permitido</Text>
                      </View>
                      <View style={styles.boxes_table_row}>
                        <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>Kilos Desc.</Text>
                      </View>
                    </View>


                    <View style={styles.body_table_info}>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Mezcla Variedades</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].mezcla}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>5 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].mezcla} kgs</Text>
                        </View>
                      </View>



                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Fuera Color</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].color}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>5 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].color} kgs</Text>
                        </View>
                      </View>


                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Dobles</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>{rendimientos?.cc_pepa[0].dobles}%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>10 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{rendimientos?.cc_descuentos[0].dobles} kgs</Text>
                        </View>
                      </View>


                      <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', borderTop: '1px solid green' }}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total CAT2</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>a</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>a</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{rendimientos?.cc_descuentos[0].cat2} kgs</Text>
                        </View>
                      </View>


                    </View>
                  </View>
                </View>


                <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px', marginTop: 20 }}>Desechos</Text>
                <View style={{ width: '100%', height: '100%' }}>

                  <View style={styles.body_table}>

                    <View style={styles.body_table_header}>
                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>Desechos</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>%</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>% Permitido</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>Kilos des</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.body_table_info}>
                      <View style={styles.body_table_rows}>
                        <View style={{ width: '350px' }}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Daño insecto</Text>
                        </View>
                        <View style={{ width: '350px' }}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].insecto} %</Text>
                        </View>
                        <View style={{ width: '350px' }}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1.5 %</Text>
                        </View>
                        <View style={{ width: '350px' }}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].insecto} Kgs</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Presencia de Hongo</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].hongo} %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1.5 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].hongo} Kgs</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Vana Deshidratada</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].vana} %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].vana} Kgs</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Punto de Goma</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].pgoma} %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>0.5 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].pgoma} Kgs</Text>
                        </View>
                      </View>

                      <View style={styles.body_table_rows}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Goma</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{rendimientos?.cc_pepa[0].goma} %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>0.5 %</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{rendimientos?.cc_descuentos[0].goma} Kgs</Text>
                        </View>
                      </View>

                      <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total Deshecho</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>1</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>1</Text>
                        </View>
                        <View style={styles.boxes_table_row}>
                          <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{(rendimientos?.cc_descuentos[0].desechos)?.toFixed(1)} Kgs</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>


              <View style={{
                width: '100%',
                height: `${control_calidad?.estado_aprobacion_cc === 1 ? 320 : 160}`,
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
                      <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_netos} kgs</Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Pepa Bruta: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.kilos_brutos} kgs</Text>
                    </View>
                  </View>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Porcentaje Pepa Bruta: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{rendimientos?.cc_calculo_final.por_brutos} %</Text>
                    </View>
                  </View>


                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Kilos Pepa Exportable: </Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{(rendimientos?.cc_kilos_des_merma[0].exportable)?.toFixed(1)} kgs</Text>
                    </View>

                  </View>

                  <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                    <View style={{ width: 150 }}>
                      <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Porcentaje Pepa Exportable: </Text>
                    </View>

                    <View style={{ width: '50%' }}>
                      <Text style={styles.header_date_info_text}>{(rendimientos?.cc_kilos_des_merma[0].exportable! / rendimientos?.cc_calculo_final.kilos_netos! * 100).toFixed(2)} %</Text>
                    </View>
                  </View>

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
                      <Text style={{ fontSize: 8 }}>Merma</Text>
                      <Text style={{ fontSize: 8, position: 'relative', left: -20 }}>Final</Text>
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
                          <Text style={{ fontSize: 8 }}>Almendras Exportables</Text>
                        </View>

                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40 }}>
                          <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.merma_exp} kgs</Text>
                        </View>

                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                          <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.final_exp} kgs</Text>
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
                          <Text style={{ fontSize: 8 }}>CAT 2</Text>
                        </View>
                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40 }}>
                          <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.merma_cat2}</Text>
                        </View>

                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                          <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.final_cat2}</Text>
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
                          <Text style={{ fontSize: 8 }}>Desechos</Text>
                        </View>
                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 40 }}>
                          <Text style={{ fontSize: 8, fontWeight: 'bold' }}>{rendimientos?.cc_calculo_final.merma_des} kgs</Text>
                        </View>

                        <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                          <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.final_des} kgs</Text>
                        </View>

                      </View>
                    </View>
                  </View>
                </View>

                {
                  String(control_calidad?.estado_aprobacion_cc) === '1'
                    ? (
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
                    )
                    : null

                }
              </View>
            </View>


          </View>
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default CCRendimiento