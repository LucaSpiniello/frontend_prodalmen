import { Document, Page, PDFViewer, View, Image, Text, StyleSheet } from "@react-pdf/renderer"
import { useParams } from "react-router-dom"
import { useAppSelector } from "../../../../redux/hooks"
import { RootState } from "../../../../redux/store"
import { ThunkDispatch } from "@reduxjs/toolkit"
import { useDispatch } from "react-redux"
import { useAuth } from "../../../../context/authContext"
import { useEffect } from "react"
import { pdfDetalladoInventario } from "../../../../redux/slices/bodegaSlice"

const PDFDetalladoInventario = () => {
    const { id } = useParams()
    const pdf = useAppSelector((state: RootState) => state.bodegas.pdfDetalladoInventario)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const { verificarToken } = useAuth()
  
    useEffect(() => {
        dispatch(pdfDetalladoInventario({ id_inventario: id, token, verificar_token: verificarToken }))
    }, [])  
    // const reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
    // const bins = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)
    // const tarjas_resultantes = useAppSelector((state: RootState) => state.reproceso.tarjas_resultantes)
    // const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    // const token = useAppSelector((state: RootState) => state.auth.authTokens)
    // const { verificarToken } = useAuth()
  
    // useEffect(() => {
    //     //@ts-ignore
    //     dispatch(fetchBinsEnReproceso({ id, token, verificar_token: verificarToken }))
    // }, [])
  
  
    return (
        <PDFViewer style={{ height: '100%'}}>
            <Document title={`pdf_inventario_detallado_n_${pdf?.id}`}>
                <Page size={'LEGAL'} orientation='landscape'>
                    <View style={{width: '95%', alignSelf: 'center'}}>
                        <View style={styles.header_superior}>
                            <View style={{ position: 'relative', top: -9 }}>
                                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
                            </View>
                            <Text style={{ textAlign: 'center', fontSize: 14, alignSelf: 'center', width: '100%'}}>
                                {pdf?.tipo_inventario_label} N°{pdf?.id} Detallado
                            </Text>
                        </View>
                        <View style={{
                            width: '100%',
                            border: '1px solid black',
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                                width: '100%',
                                padding: 5,
                                gap: 4
                            }}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Tipo de Inventario: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.tipo_inventario_label}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Bodegas: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.tipo_inventario === '1' || pdf?.tipo_inventario === '2' || pdf?.tipo_inventario === '4' ? pdf.bodegas.toLocaleUpperCase() : pdf?.tipo_inventario === '3' ? 'Todas las Bodegas' : null}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Cantidad de Bins Validados: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.cantidad_bins_validados}</Text>
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                padding: 5,
                                gap: 4
                            }}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Total Kilos en Inventario: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.total_kilos}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Calles: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.tipo_inventario === '1' || pdf?.tipo_inventario === '3' ? 'Todas las Calles' : pdf?.tipo_inventario === '2' || pdf?.tipo_inventario === '4' ? pdf.calles : null}</Text>
                                </View>

                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Cantidad de Bins No Validados: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.cantidad_bins_no_validados}</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>Detalle de Bins</Text>
                        <View style={{ 
                            width: '100%',
                            height: 30,
                            backgroundColor: 'lightgray',
                            borderRadius: '1px', 
                            display: 'flex',
                            flexDirection: 'row',
                            fontWeight: 'bold',
                            paddingBottom: 2,
                            marginTop: '1%'
                        }}>
                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Cod. Tarja</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Variedad</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Calibre</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos Fruta Netos</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Validado</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Observaciones</Text>
                            </View>
                        </View>
                        {
                            pdf && typeof(pdf.bins) != 'string' && pdf.bins.map(bin => {
                                return (
                                    <View style={{ 
                                            width: '100%',
                                            height: 30,
                                            borderRadius: '1px', 
                                            display: 'flex',
                                            flexDirection: 'row',
                                        }}
                                        wrap={false}
                                    >

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.codigo_tarja}</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.variedad}</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.calibre}</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.kilos}</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.validado ? 'Sí' : 'No'}</Text>
                                        </View>

                                        <View style={styles.header_info_box_superior}>
                                            <Text style={{ fontSize: 9}}>{bin.observaciones}</Text>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {/* <Text style={{ textAlign: 'center', fontSize: 14, fontWeight: 'bold', marginTop: 10 }}>Desglose de Kilos Bins en Inventario</Text>
                        <View style={{width: '100%', fontSize: 10, marginTop: 10, display: 'flex', flexDirection: 'row', gap: 4}}>
                            <View style={{width: '100%', border: '1px solid #0000'}}>
                                <Text style={{fontSize: 14, marginTop: '1%', marginBottom: '1%', textAlign: 'center'}}>Por Variedad y Calibre</Text>
                                { pdf && pdf.kilos_por_variedad_y_calibre.map((kilos, index) => (
                                    <Text style={{marginBottom: '0.5%', paddingLeft: 3}}>{index + 1}.- {kilos}</Text>
                                ))}
                            </View>
                            <View style={{width: '100%', border: '1px solid #0000'}}>
                                <Text style={{fontSize: 14, marginTop: '1%', marginBottom: '1%', textAlign: 'center'}}>Por Calidad</Text>
                                { pdf && pdf.kilos_por_calidad.map((kilos, index) => (
                                    <Text style={{marginBottom: '0.5%', paddingLeft: 3}}>{index + 1}.- {kilos == 'No tengo calidad' ? 'Sin Asignar' : kilos}</Text>
                                ))}
                            </View>
                        </View>

                        <View style={{width: '100%', fontSize: 10, marginTop: 10, display: 'flex', flexDirection: 'row', gap: 4}}>
                            <View style={{width: '100%', border: '1px solid #0000'}}>
                                <Text style={{fontSize: 14, marginTop: '1%', marginBottom: '1%', textAlign: 'center'}}>Por Variedad</Text>
                                { pdf && pdf.kilos_por_variedad.map((kilos, index) => (
                                    <Text style={{marginBottom: '0.5%', paddingLeft: 3}}>{index + 1}.- {kilos}</Text>
                                ))}
                            </View>
                            <View style={{width: '100%', border: '1px solid #0000'}}>
                                <Text style={{fontSize: 14, marginTop: '1%', marginBottom: '1%', textAlign: 'center'}}>Por Calibre</Text>
                                { pdf && pdf.kilos_por_calibre.map((kilos, index) => (
                                    <Text style={{marginBottom: '0.5%', paddingLeft: 3}}>{index + 1}.- {kilos}</Text>
                                ))}
                            </View>
                        </View> */}
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}


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
      flexWrap: 'wrap',
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
  
export default PDFDetalladoInventario