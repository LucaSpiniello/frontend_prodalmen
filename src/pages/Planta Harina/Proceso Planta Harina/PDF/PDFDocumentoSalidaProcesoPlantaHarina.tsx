import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { DetalleLotesPrograma, TEnvasesPrograma, TLoteProduccion, TProduccion } from '../../../../types/TypesProduccion.types';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { variedadFilter } from '../../../../utils/options.constantes';
import { useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { fetchPDFSalidaPlantaHarina, fetchProgramaPlantaHarina } from '../../../../redux/slices/plantaHarinaSlice';
import { TResultadoEntrada, TResultadosSalida } from '../../../../types/typesPlantaHarina';
import { fetchPDFSalidaProcesoPlantaHarina } from '../../../../redux/slices/procesoPlantaHarina';


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

const PDFDocumentoEntradaSalidaProcesoPlantaHarina = () => {
  const { id } = useParams()
  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  const pdf = useAppSelector((state: RootState) => state.proceso_planta_harina.pdf_documento_salida)

  useEffect(() => {
    dispatch(fetchPDFSalidaProcesoPlantaHarina({ id: parseInt(id!), token, verificar_token: verificarToken }))
  }, [])

  console.log(pdf)


  return (
    <PDFViewer style={{ height: '100%'}}>
      <Document title={`Documento Salida Proceso Planta Harina N° ${id}`}>
        <Page>
        <View style={styles.header}>
        <View style={styles.header_superior}>
              <View style={{ position: 'relative', top: -9 }}>
                <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
              </View>

              <Text style={{ width: 240, textAlign: 'center', fontSize: 14, position: 'relative', left: 10, top: 10}}>
                  Documento de Salida a
                  Proceso Planta Harina N° {id}
              </Text>


              <View style={{ width: 150, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Generado el {format(new Date(), { date: 'medium', time: 'short'}, 'es')}</Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Creado Por: </Text>
                  <Text style={styles.header_date_info_text}>{perfilData?.first_name}</Text>
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
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                padding: 4,
              }}>
              
                <View style={[styles.header_date_info_box, { flexDirection: 'column'}]}>
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Tipo Programa: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa?.tipo_proceso_label} </Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Total Kilos en Programa: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.kilos_totales} </Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Perdida Sugerida: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa?.perdidaproceso} % </Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Rechazo Registrado: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa?.rechazos_registrados} </Text>
                  </View>
                </View>

                <View style={[styles.header_date_info_box, { flexDirection: 'column', width: '80%'}]}>
                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Estado Programa: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa?.estado_proceso_label} </Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Total Kilos Semi-Elab:: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa?.bines_resultantes_kilos} </Text>
                  </View>

                  <View style={styles.header_date_info_box}>
                    <Text style={styles.header_date_info_text}>Valor Referencial: </Text>
                    <Text style={styles.header_date_info_text}>{pdf?.programa.valor_referencial} </Text>
                  </View>

                </View>

                <View style={[styles.header_date_info_box, { flexDirection: 'column', justifyContent: 'flex-end', position: 'relative', width: 300 }]}>
                  <Text style={[styles.header_date_info_text, { position: 'absolute', top: 0, left: 0, right: 0}]}>Firma Gerente Operaciones</Text>
                  <Text style={[styles.header_date_info_text, { borderBottom: '1px solid black'}]}></Text>
                </View> 

          
              </View>
            </View>
            

            <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Detalle Programa Planta Harina N° {id}</Text>

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
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Tarja</Text>
              </View>


              <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Estado</Text>
              </View>

              <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Humedad</Text>
              </View>

              <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Piel Aderida</Text>
              </View>

              <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Calidad</Text>
              </View>
              
              <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Fruta Neta</Text>
              </View>

            </View>

          {
            pdf?.bins_resultantes.map((bin: TResultadosSalida) => {
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  }}>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{bin.bin}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{bin.estado}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{bin?.humedad}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{bin.piel_aderida}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{bin.calidad}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{bin.kilos} kgs</Text>
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

export default PDFDocumentoEntradaSalidaProcesoPlantaHarina