import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch';
import { DetalleEnvase, TEnvasesPrograma, TLoteProduccion, TProduccion } from '../../../../types/TypesProduccion.types';
import { TGuia } from '../../../../types/TypesRecepcionMP.types';
import { TPatioTechadoEx } from '../../../../types/TypesBodega.types';
import { variedadFilter } from '../../../../utils/options.constantes';
import { useAuth } from '../../../../context/authContext';
import { useEffect } from 'react';
import { fetchEnvasesProduccion, fetchPDFDetalleEnvase, fetchProgramaProduccion } from '../../../../redux/slices/produccionSlice';
import { fetchGuiaRecepcion } from '../../../../redux/slices/recepcionmp';
import { fetchLotePatioTechadoExterior } from '../../../../redux/slices/bodegaSlice';
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

const PDFDetalleEnvases = () => {
  const { id } = useParams()
  const { state } = useLocation()

  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)


  const detalle_pdf = useAppSelector((state: RootState) => state.programa_produccion.pdf_detalle_envases)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()




  useEffect(() => {
      //@ts-ignore
      dispatch(fetchPDFDetalleEnvase({ id, token, verificar_token: verificarToken  }))
  }, [])

  // useEffect(() => {
  //   //@ts-ignore
  //   dispatch(fetchEnvasesProduccion({ id, token, verificar_token: verificarToken  }))
  // }, [])


  // useEffect(() => {
  //   if (lotes_en_programa.length < 1){
  //     //@ts-ignore
  //     dispatch(fetchGuiaRecepcion({ id: lotes_en_programa?.[0]?.guia_recepcion, token, verificar_token: verificarToken  }))
  //   }
  // }, [lotes_en_programa])

  // useEffect(() => {
  //   //@ts-ignore
  //   dispatch(fetchLotePatioTechadoExterior({ id: lotes_en_programa?.[0].guia_patio, token, verificar_token: verificarToken  }))
  // }, [])

  // const total_fruta_programa = lotes_en_programa?.reduce((acc, lote) => lote.kilos_fruta + acc, 0)

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
              Lista de Lotes y Envases a Procesar
              En Programa Produccion N° {id}
            </Text>


            <View style={{ width: 150, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {format(new Date(), { date: 'medium', time: 'short'}, 'es')}</Text>
                <Text style={styles.header_date_info_text}>{}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>
                <Text style={styles.header_date_info_text}>{perfilData?.first_name} {perfilData?.last_name}</Text>
              </View>
            </View>
          </View>
          {
            detalle_pdf && detalle_pdf.productor && detalle_pdf.productor.length === 1 ?
            <View style={{
              width: '100%',
              border: '1px solid green',
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
                  <Text style={styles.header_date_info_text}>{detalle_pdf?.comercializador}</Text>
                </View>
  
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Programa Produccion: </Text>
                  <Text style={styles.header_date_info_text}>{id}</Text>
                </View>
  
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Fruta en Programa: </Text>
                  <Text style={styles.header_date_info_text}>{(detalle_pdf?.kilos_totales ?? 0).toLocaleString()} Kgs</Text>
                </View>
              </View>
  
              <View style={{
                width: '100%',
                display: 'flex',
                gap: 5,
                padding: 3
              }}>
              
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Productor: </Text>
                  <Text style={styles.header_date_info_text}>{detalle_pdf?.productor} </Text>
                </View>
  
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Programa Creado el: </Text>
                  <Text style={styles.header_date_info_text}>{format(state?.fecha_creacion!, { date: 'full' }, 'es' )}</Text>
                </View>
  
                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Variedad Fruta Programa : </Text>
                  <Text style={styles.header_date_info_text}>{detalle_pdf?.variedad}</Text>
                </View>
  
              </View>
            </View>
            : detalle_pdf && detalle_pdf.productor && detalle_pdf.productor.length > 1 ?
            <>
              <View style={{
                width: '100%',
                border: '1px solid green',
                display: 'flex',
                flexDirection: 'row'
              }}>
                <View style={{
                  width: '100%',
                  display: 'flex',
                  gap: 5,
                  padding: 3
                }}>
                  <Text style={{fontSize: 10, textAlign: 'left'}}>Productores: { detalle_pdf.productor.map((element, index) => {
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
            border: '1px solid green',
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
                <Text style={styles.header_date_info_text}>{detalle_pdf?.comercializador}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Programa Produccion: </Text>
                <Text style={styles.header_date_info_text}>{id}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fruta en Programa: </Text>
                <Text style={styles.header_date_info_text}>{(detalle_pdf?.kilos_totales ?? 0).toLocaleString()} Kgs</Text>
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
                <Text style={styles.header_date_info_text}>{detalle_pdf?.productor} </Text>
              </View> */}

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Programa Creado el: </Text>
                <Text style={styles.header_date_info_text}>{format(state?.fecha_creacion!, { date: 'full' }, 'es' )}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Variedad Fruta Programa : </Text>
                <Text style={styles.header_date_info_text}>{detalle_pdf?.variedad}</Text>
              </View>

            </View>
          </View>
            </>
            : null
          }
          
          

          <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Lotes y envases del pedido</Text>

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

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Lote</Text>
            </View>


            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Tipo Envase</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>N° Envases</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Ubicación Bodega</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Colectado</Text>
            </View>

          </View>

          {
            detalle_pdf?.detalle_envase?.map((lote: DetalleEnvase) => {
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  // backgroundColor: 
                  }}>
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{lote.numero_lote}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{lote.tipo_envase}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{lote.numero_envase}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{lote.ubicacion}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>
                    {
                      lote.colectado 
                        ? <Image source={`/src/assets/checkedcheckbox.png`}/>
                        : <Image source={`/src/assets/uncheckedcheckbox.png`}/>
                    }
                   </Text>
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

export default PDFDetalleEnvases