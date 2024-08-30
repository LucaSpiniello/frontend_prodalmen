import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { DetalleLotesPrograma, TEnvasesPrograma, TLoteProduccion, TProduccion } from '../../../../types/TypesProduccion.types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { variedadFilter } from '../../../../utils/options.constantes';
import { useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { fetchGuiaRecepcion } from '../../../../redux/slices/recepcionmp';
import { fetchEnvasesProduccion, fetchPDFDetalleEntradaPrograma, fetchProgramaProduccion } from '../../../../redux/slices/produccionSlice';
import { fetchLotePatioTechadoExterior, fetchPatioTechadoExterior } from '../../../../redux/slices/bodegaSlice';
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

const PDFDocumentoEntrada = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)

  const programa = useAppSelector((state: RootState) => state.programa_produccion.pdf_detalle_entrada_programa)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()
  const formatNumber = (number: any) => {
    if (number != null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    return '0';
  };



  useEffect(() => {
        //@ts-ignore
        dispatch(fetchPDFDetalleEntradaPrograma({ id, token, verificar_token: verificarToken  }))
  }, [])

  return (
    <PDFViewer style={{ height: '100%'}}>
      <Document>
        <Page>
        <View style={styles.header}>
        <View style={styles.header_superior}>
            <View style={{ position: 'relative', top: -9 }}>
              <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
            </View>

            <Text style={{ width: 240, textAlign: 'center', fontSize: 14, position: 'relative', left: 10, top: 10}}>
              Documento de Entrada a
              Programa Produccion N° {id}
            </Text>


            <View style={{ width: 150, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {format(new Date(), { date: 'medium', time: 'short'}, 'es')}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>
                <Text style={styles.header_date_info_text}>{perfilData?.first_name} {perfilData?.last_name}</Text>
              </View>
            </View>
          </View>

          {
            programa && programa.productor && programa.productor.length === 1 ?
            <View style={{
              width: '100%',
              border: '1px solid black',
              display: 'flex',
              flexDirection: 'row'
            }}>
              <View style={{
                width: '100%',
                display: 'flex',
                gap: 5,
                padding: 3
              }}>
              
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Comercializador: </Text>
                  <Text style={styles.header_date_info_text}>{programa?.comercializador} </Text>
                </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Total Kilos en programa: </Text>
                <Text style={styles.header_date_info_text}>{(programa?.kilos_totales ?? 0).toLocaleString()}</Text>
              </View> 

          
              </View>

            <View style={{
              width: '100%',
              display: 'flex',
              gap: 5,
              padding: 3
            }}>
            
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Productor : </Text>
                <Text style={styles.header_date_info_text}>{programa?.productor} Kgs</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fecha de Inicio Programa Produccion: </Text>
                <Text style={styles.header_date_info_text}>{format(state?.fecha_creacion!, { date: 'short', time: 'short'}, 'es')}</Text>
              </View>

              </View>
            </View>
            : programa && programa.productor && programa.productor.length > 1 ?
            <>
              <View style={{
                width: '100%',
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'row'
              }}>
                <View style={{
                  width: '100%',
                  display: 'flex',
                  gap: 5,
                  padding: 3
                }}>
                  <Text style={{fontSize: 10, textAlign: 'left'}}>Productores: { programa.productor.map((element, index) => {
                    if (index > 0) {
                      return `, ${element}`
                    } else {
                      return `${element}`
                    }
                  })}</Text>
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
                  display: 'flex',
                  gap: 5,
                  padding: 3
                }}>
                
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Comercializador: </Text>
                    <Text style={styles.header_date_info_text}>{programa?.comercializador} </Text>
                  </View>
    
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Total Kilos en programa: </Text>
                    <Text style={styles.header_date_info_text}>{(programa?.kilos_totales ?? 0).toLocaleString()}</Text>
                  </View> 
    
            
                </View>
    
                <View style={{
                  width: '100%',
                  display: 'flex',
                  gap: 5,
                  padding: 3
                }}>
                
                  {/* <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Productor : </Text>
                    <Text style={styles.header_date_info_text}>{programa?.productor} Kgs</Text>
                  </View> */}
    
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Fecha de Inicio Programa Produccion: </Text>
                    <Text style={styles.header_date_info_text}>{format(state?.fecha_creacion!, { date: 'short', time: 'short'}, 'es')}</Text>
                  </View>
    
                </View>
              </View>
            </>
            : null
          }

          

          <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Detalle Lotes en Programa</Text>

          <View style={{ 
            width: '100%',
            height: 26,
            backgroundColor: 'lightgray',
            borderRadius: '1px', 
            display: 'flex',
            flexDirection: 'row',
            fontWeight: 'bold',
            paddingBottom: 2
            }}>

            <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Lote</Text>
            </View>


            <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Envases del Lote</Text>
            </View>

            <View style={{ width: '160%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Productor</Text>
            </View>

            <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Variedad</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos Fruta</Text>
            </View>

          </View>

          {
            programa?.detalle_lote.map((lote: DetalleLotesPrograma) => {
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  }}>
      
                  <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
                    <Text style={{ fontSize: 10}}>{lote.numero_lote}</Text>
                  </View>
      
                  <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
                    <Text style={{ fontSize: 10}}>{lote.total_envases}</Text>
                  </View>

                  <View style={{ width: '160%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
                    <Text style={{ fontSize: 10, textOverflow: 'ellipsis'}}>{lote?.productor}</Text>
                  </View>
      
                  <View style={{ width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 12, }}>
                   <Text style={{ fontSize: 10}}>{lote.variedad}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{(lote.kilos_fruta ?? 0).toLocaleString()}</Text>
                  </View>
                </View>
              )
            })
          }

        </View> 
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default PDFDocumentoEntrada