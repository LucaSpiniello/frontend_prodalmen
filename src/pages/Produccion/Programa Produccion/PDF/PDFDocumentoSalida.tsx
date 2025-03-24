import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { Bines } from '../../../../types/TypesSeleccion.type';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { PDFSalida, PDFSalidaTarjas } from '../../../../types/TypesProduccion.types';
import { fetchPDFDocumentoSalida } from '../../../../redux/slices/produccionSlice';


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

const PDFDocumentoSalida = () => {
    const { id } = useParams()
    const pdf = useAppSelector((state: RootState) => state.programa_produccion.pdfDocumentoSalida)
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
    const token = useAppSelector((state: RootState) => state.auth.authTokens)
    const { verificarToken } = useAuth()

    useEffect(() => {
        dispatch(fetchPDFDocumentoSalida({ id_programa: parseInt(id!), token, verificar_token: verificarToken }))
    }, [])

    return (
        <PDFViewer style={{ height: '100%'}}>
            <Document title='Documento Salida Producción'>
                <Page size={'LEGAL'} orientation='landscape'>
                    <View style={styles.header}>
                        <View style={styles.header_superior}>
                            <View style={{ position: 'relative', top: -9 }}>
                                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
                            </View>
                            <Text style={{ width: 320, textAlign: 'center', fontSize: 14, position: 'relative', right: 300}}>
                                Documento Salida al Programa de Producción N° {pdf?.produccion}
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
                            padding: 5
                            }}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Kilos En Programa: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.kilos_resultantes}</Text>
                                </View>
                            </View>

                            <View style={{
                            width: '100%',
                            padding: 5
                            }}>
                                <View style={styles.header_date_info_box}>
                                <Text style={styles.header_date_info_text}>Lotes en Programa: </Text>
                                <Text style={styles.header_date_info_text}>
                                    {pdf?.numeros_lote.join(', ')}
                                </Text>
                            </View>
                            </View>
                        </View>
                    
                        <View style={{
                            width: '100%',
                            border: '1px solid black',
                            display: 'flex',
                            flexDirection: 'row'
                        }}>
                            <View style={{
                            width: '100%',
                            padding: 5
                            }}>
                                <View style={styles.header_date_info_box}>
                                    <Text style={styles.header_date_info_text}>Comercializador: </Text>
                                    <Text style={styles.header_date_info_text}>{pdf?.comercializador}</Text>
                                </View>
                            </View>
                        </View>
                    

                        <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Detalle Bins</Text>

                        <View style={{ 
                            width: '100%',
                            height: 30,
                            backgroundColor: 'lightgray',
                            borderRadius: '1px', 
                            display: 'flex',
                            flexDirection: 'row',
                            fontWeight: 'bold',
                            paddingBottom: 2
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
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Trozo</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Picada</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Hongo</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Insecto</Text>
                            </View>
                            
                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Dobles</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>P. Goma</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Basura</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Mezcla</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Color</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Goma</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>V. Deshidratada</Text>
                            </View>

                            <View style={styles.header_info_box_superior}>
                                <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos Netos</Text>
                            </View>
                        </View>

                        {
                            pdf?.tarjas_resultantes.map((cc: PDFSalidaTarjas) => {
                            return (
                                <View style={{ 
                                width: '100%',
                                height: 30,
                                borderRadius: '1px', 
                                display: 'flex',
                                flexDirection: 'row',
                                }}>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.codigo_tarja}</Text>
                                    </View>
                        
                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.variedad}</Text>
                                    </View>
                        
                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.calibre}</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.trozo}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.picada}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.hongo}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.daño_insecto}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.dobles}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.punto_goma}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.basura}%</Text>
                                    </View>
                                    
                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.mezcla_variedad}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.fuera_color}%</Text>
                                    </View>
                        

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.goma}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.cc_info.vana_deshidratada}%</Text>
                                    </View>

                                    <View style={styles.header_info_box_superior}>
                                        <Text style={{ fontSize: 9}}>{cc.kilos_neto} </Text>
                                    </View>
                                </View>
                            )})
                        }
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    )
}

export default PDFDocumentoSalida