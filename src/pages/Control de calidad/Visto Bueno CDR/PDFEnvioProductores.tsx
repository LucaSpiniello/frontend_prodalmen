import { Document, Image, PDFViewer, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer"
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../../../redux/hooks"
import { RootState } from "../../../redux/store"
import { TRendimiento } from "../../../types/TypesControlCalidad.type"
import { useEffect, useState, FC } from "react"
import { fetchGuiaRecepcion } from "../../../redux/slices/recepcionmp"
import ChartJsImage from 'chartjs-to-image';
import { format } from "@formkit/tempo"
import { useAuth } from "../../../context/authContext"
import { fetchControlCalidad, fetchRendimientoLotes } from "../../../redux/slices/controlcalidadSlice"
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { set, size } from "lodash"
import { fetchWithTokenPostFile } from "../../../utils/peticiones.utils"
import { IoMailOutline } from "react-icons/io5";
import Button from '../../../components/ui/Button';
import { fetchWithToken, fetchWithTokenPostAction } from "../../../utils/peticiones.utils"
import { fetchControlesDeCalidadPorComercializador, fetchControlesDeCalidad } from '../../../redux/slices/controlcalidadSlice';
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
    width: '100%',
    textAlign: 'center',
  }
})

const PdfCC: FC<{ usuario : any, guia : any, control_calidad : any, rendimientos : any, rendimiento_cc : any, isPacificNut : boolean}> = ({ usuario, guia, control_calidad, rendimientos, rendimiento_cc, isPacificNut }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
    let valores: any
    let labels: any
    let formattedData: any


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
                  size: 20,
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
                size: 30,
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
                size: 20,
                weight: 'bold',
                family: 'Arial',
              },
              bodyFont: {
                size: 18,
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

    let var_cat2_defectos_internos: any = null
    let var_desechos_defectos_sanitarios: any = null
    let var_kilos_descarte_kg_sobre_norma : any = null
    let var_fuera_color_manchadas: any = null
    let var_dobles_mellizas: any = null
    let hongos : any = null
    let vana_deshidratada : any = null
    let precalibre_mas_38 : any = null
    if (isPacificNut){
      var_cat2_defectos_internos = "Defectos Internos"
      var_desechos_defectos_sanitarios = "Defectos Sanitarios"
      var_kilos_descarte_kg_sobre_norma = "Kg Sobre Norma"
      var_fuera_color_manchadas = "Manchadas"
      var_dobles_mellizas = "Mellizas"
      hongos = "Hongos"
      vana_deshidratada = "Deshidratada"
      precalibre_mas_38 = ">38"
    } else {
      var_cat2_defectos_internos = "CAT 2"
      var_desechos_defectos_sanitarios = "Desechos"
      var_kilos_descarte_kg_sobre_norma = "Kilos Desc."
      var_fuera_color_manchadas = "Fuera Color"
      var_dobles_mellizas = "Dobles"
      hongos = "Presencia de Hongo"
      vana_deshidratada = "Vana Deshidratada"
      precalibre_mas_38 = "Precalibre"
    }
  
    return (
          <Document title={`CDR_${control_calidad?.numero_lote}_${format(control_calidad?.fecha_creacion!, { date: 'short' }, 'es')}_${guia?.nombre_productor}`}>
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
                        <Text style={styles.header_date_info_text}>Productor: </Text>

                        <Text style={styles.header_date_info_text}>{guia?.nombre_productor}</Text>
                      </View>

                      <View style={styles.header_date_info_box}>
                        <Text style={styles.header_date_info_text}>N° Lote: </Text>
                        <Text style={styles.header_date_info_text}>{control_calidad?.numero_lote}</Text>
                      </View>

                      <View style={styles.header_date_info_box}>
                        <Text style={styles.header_date_info_text}>Variedad: </Text>

                        <Text style={styles.header_date_info_text}>{control_calidad?.variedad}</Text>
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
                    <View style={{ width: '100%', height: 180, padding: 10 }} >
                      <Image source={`${imageSrc}`} style={{ height: 170 }} />
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
                          <View style={{ width: '100%' , textAlign: 'center'}}>
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
                              <Text style={styles.body_table_info_text}>9</Text>
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
                              <Text style={styles.body_table_info_text}>8</Text>
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
                              <Text style={styles.body_table_info_text}>&lt;8</Text>
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
                              <Text style={styles.body_table_info_text}>&lt;8</Text>
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
                              <Text style={styles.body_table_info_text}>&lt;8</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ width: '100%', textAlign: 'center', borderRight: '1px solid green', paddingVertical: 4, paddingRight: 2, fontSize: 8 }}>{precalibre_mas_38}</Text>
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
                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px' }}>{var_cat2_defectos_internos}</Text>
                    <View style={{ width: '100%', height: 180 }}>
                      <View style={styles.body_table}>


                        <View style={styles.body_table_header}>
                          <View style={{ width: '100%' }}>
                            <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>{var_cat2_defectos_internos}</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>%</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>% Permitido</Text>
                          </View>
                          <View style={styles.boxes_table_row}>
                            <Text style={{ fontSize: 8, textAlign: 'center', paddingVertical: 2 }}>{var_kilos_descarte_kg_sobre_norma}</Text>
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
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{var_fuera_color_manchadas}</Text>
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
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>{var_dobles_mellizas}</Text>
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
                              <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total {var_cat2_defectos_internos}</Text>
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


                    <Text style={{ fontSize: 12, textAlign: 'center', marginBottom: '10px', marginTop: 20 }}>{var_desechos_defectos_sanitarios}</Text>
                    <View style={{ width: '100%', height: '100%' }}>

                      <View style={styles.body_table}>

                        <View style={styles.body_table_header}>
                          <View style={styles.body_table_rows}>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{var_desechos_defectos_sanitarios}</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>%</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>% Permitido</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{var_kilos_descarte_kg_sobre_norma}</Text>
                            </View>
                          </View>
                        </View>
                        <View style={styles.body_table_info}>
                          <View style={styles.body_table_rows}>
                            <View style={{ width: '350px' }}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Daño insecto</Text>
                            </View>
                            <View style={{ width: '350px' }}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{(rendimientos?.cc_pepa[0].insecto)?.toFixed(2)} %</Text>
                            </View>
                            <View style={{ width: '350px' }}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1.5 %</Text>
                            </View>
                            <View style={{ width: '350px' }}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{(rendimientos?.cc_descuentos[0].insecto)?.toFixed(2)} Kgs</Text>
                            </View>
                          </View>

                          <View style={styles.body_table_rows}>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{hongos}</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{(rendimientos?.cc_pepa[0].hongo)?.toFixed(2)} %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1.5 %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{(rendimientos?.cc_descuentos[0].hongo)?.toFixed(2)} Kgs</Text>
                            </View>
                          </View>

                          <View style={styles.body_table_rows}>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{vana_deshidratada}</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{(rendimientos?.cc_pepa[0].vana)?.toFixed(2)} %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>1 %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{(rendimientos?.cc_descuentos[0].vana)?.toFixed(2)} Kgs</Text>
                            </View>
                          </View>

                          <View style={styles.body_table_rows}>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Punto de Goma</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{(rendimientos?.cc_pepa[0].pgoma)?.toFixed(2)} %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>0.5 %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{(rendimientos?.cc_descuentos[0].pgoma)?.toFixed(2)} Kgs</Text>
                            </View>
                          </View>

                          <View style={styles.body_table_rows}>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>Goma</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>{(rendimientos?.cc_pepa[0].goma)?.toFixed(2)} %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', borderBottom: '1px solid green' }}>0.5 %</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center', borderBottom: '1px solid green' }}>{(rendimientos?.cc_descuentos[0].goma)?.toFixed(2)} Kgs</Text>
                            </View>
                          </View>

                          <View style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={styles.boxes_table_row}>
                            <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green' }}>Total {var_desechos_defectos_sanitarios}</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>1</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 5, fontSize: 7, textAlign: 'center', borderRight: '1px solid green', color: 'white' }}>1</Text>
                            </View>
                            <View style={styles.boxes_table_row}>
                              <Text style={{ paddingVertical: 6, fontSize: 7, textAlign: 'center' }}>{(rendimientos?.cc_descuentos[0].desechos)?.toFixed(2)} Kgs</Text>
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

                      { isPacificNut ? 
                                <div>
                                <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5 }}>
                                  <View style={{ width: 150 }}>
                                    <Text style={{ fontSize: 8, fontWeight: 'bold' }}>Fuera de norma: </Text>
                                  </View>
                                  <View style={{ width: '50%' }}>
                                    <Text style={styles.header_date_info_text}>{ ((rendimientos?.cc_descuentos[0]?.cat2 ?? 0) + (rendimientos?.cc_descuentos[0]?.desechos ?? 0)).toFixed(1) } kgs</Text>
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
                                <Text style={styles.header_date_info_text}>{rendimientos?.cc_kilos_des_merma[0].exportable?.toFixed(1)} kgs</Text>
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
                          <Text style={{ fontSize: 8, position: 'relative', left: -50  }}>Final</Text>
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
                              <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.kilos_brutos} kgs</Text>
                            </View>
                            :
                            <View style={{ width: '100%', display: 'flex', alignItems: 'center', flexDirection: 'row', gap: 5, position: 'relative', left: 35 }}>
                              <Text style={{ fontSize: 8 }}>{rendimientos?.cc_calculo_final.final_exp} kgs</Text>
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
                              <Text style={{ fontSize: 8 }}>{var_cat2_defectos_internos}</Text>
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
                              <Text style={{ fontSize: 8 }}>{var_desechos_defectos_sanitarios}</Text>
                              
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
                        ? isPacificNut ? 
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
                      
                        : null

                    }
                  </View>
                </View>


              </View>
            </Page>
          </Document>
      )
    }

const GeneratePdfAndSendMail: FC<{ id : any, mailEnviado : any }> = ({ id, mailEnviado}) => {
  const { verificarToken } = useAuth()
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const usuario = useAppSelector((state: RootState) => state.auth.dataUser)
  const guia = useAppSelector((state: RootState) => state.recepcionmp.guia_recepcion)
  const [isSending, setIsSending] = useState(false);
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)
  const isPacificNut = comercializador == "Pacific Nut"


  const handleGenerate = async () => {
    setIsSending(true);
    const token_verificado : any = await verificarToken(token)
    const response = await fetchWithToken(`api/control-calidad/recepcionmp/${id}`, token_verificado)
    const control_calidad = await response.json()
     const response2 = await fetchWithTokenPostAction(`api/control-calidad/recepcionmp/rendimiento_lotes/${id}/?variedad=todas`, token_verificado)
    const rendimientos = await response2.json()
    const rendimiento_cc = rendimientos?.cc_muestra[0] ? rendimientos.cc_muestra[0] : [];
    const response3 = await fetchWithToken(`api/recepcionmp/${control_calidad?.guia_recepcion}/`, token_verificado)
    const guia = await response3.json()
    const doc = <PdfCC  usuario={usuario} guia={guia} control_calidad={control_calidad} rendimientos={rendimientos} rendimiento_cc={rendimiento_cc} isPacificNut={isPacificNut}/>;
    const blob = await pdf(doc).toBlob();
    let email_destinatario : any = ""
    let subject = "PDF Control de Calidad"
    email_destinatario = control_calidad?.email_productor
    const formData = new FormData();
    formData.append('pdf', blob, 'documento.pdf');  // Asegúrate de que el nombre sea 'pdf'
    formData.append('email_to', email_destinatario);  // Asegúrate de que el nombre sea 'email_to'
    formData.append('subject', subject);  // Asegúrate de que el nombre sea 'subject'
    formData.append('id', id)

    const res = await fetchWithTokenPostFile('api/control-calidad/recepcionmp/send_mailer/', formData, token_verificado)
    setIsSending(false);
    if (res.ok) {
      alert('Correo enviado correctamente a ' + email_destinatario)
      if (comercializador == 'Pacific Nut'){
        dispatch(fetchControlesDeCalidadPorComercializador({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }))
      }
      else {
        dispatch(fetchControlesDeCalidad({ token, verificar_token: verificarToken }))
      }
      
    } else {
      alert('Error al enviar el correo')
    }


  };

  return (
    <>
      {mailEnviado ? (
        <Button
          title={isSending ? "Enviando correo..." : "Mandar Email a Proveedor"}
          variant="solid"
          color="red"
          colorIntensity="700"
          className="hover:scale-105"
          onClick={handleGenerate}
        >
          {isSending ? 'Enviando...' : <IoMailOutline style={{ fontSize: 25 }} />} {/* Texto del botón */}
        </Button>
      ) : (
        <Button
          title={isSending ? "Enviando correo..." : "Mandar Email a Proveedor"}
          variant="solid"
          color="blue"
          colorIntensity="700"
          className="hover:scale-105"
          onClick={handleGenerate}
        >
          {isSending ? 'Enviando...' : <IoMailOutline style={{ fontSize: 25 }} />} {/* Texto del botón */}
        </Button>
      )}
    </>
  );
};

export default GeneratePdfAndSendMail;
