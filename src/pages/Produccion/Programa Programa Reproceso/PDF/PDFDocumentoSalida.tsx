import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { RootState } from '../../../../redux/store';
import { useAuthenticatedFetch } from '../../../../hooks/useAuthenticatedFetch';
import { TEnvasesPrograma, TProduccion } from '../../../../types/TypesProduccion.types';
import { TGuia } from '../../../../types/TypesRecepcionMP.types';
import { TPatioTechadoEx } from '../../../../types/TypesBodega.types';
import { variedadFilter } from '../../../../utils/options.constantes';
import { TTarjaResultanteReproceso } from '../../../../types/TypesReproceso.types';
import { useEffect } from 'react';
import { useAuth } from '../../../../context/authContext';
import { fetchTarjasResultantesReproceso } from '../../../../redux/slices/reprocesoSlice';
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
  const { pathname } = useLocation()
  const { id } = useParams()
  const base_url = process.env.VITE_BASE_URL

  const perfilData = useAppSelector((state: RootState) => state.auth.dataUser)

  const reproceso = useAppSelector((state: RootState) => state.reproceso.programa_reproceso_individual)
  const bins = useAppSelector((state: RootState) => state.reproceso.bins_reproceso)
  const tarjas_resultantes = useAppSelector((state: RootState) => state.reproceso.tarjas_resultantes)

  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const { verificarToken } = useAuth()

  useEffect(() => {
   if (bins.length < 1){
      //@ts-ignore
    dispatch(fetchTarjasResultantesReproceso({ id, token, verificar_token: verificarToken }))
   }
  }, [bins])


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
              Documento Salida N° {id}
            </Text>


            <View style={{ width: 180, border: '1px solid green', height: 40, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {format(new Date(), { date: 'medium', time: 'short'}, 'es')}</Text>
                <Text style={styles.header_date_info_text}>{}</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>

                <Text style={styles.header_date_info_text}>{`${perfilData?.first_name} ${perfilData?.last_name} `} </Text>
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
                <Text style={styles.header_date_info_text}>Kilos En Programa: </Text>
                <Text style={styles.header_date_info_text}>{(bins.reduce((acc, bin) => bin.kilos_bin + acc, 0) ?? 0).toLocaleString() }</Text>
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Kilos Resultantes: </Text>
                <Text style={styles.header_date_info_text}>{(tarjas_resultantes.reduce((acc, tarja) => (tarja.peso - tarja.tipo_patineta) + acc, 0) ?? 0).toLocaleString()}</Text>
              </View>

            </View>

            <View style={{
              width: '100%',
              padding: 5
            }}>
            
              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Fecha inicio reproceso: </Text>
                <Text style={styles.header_date_info_text}>{format(reproceso?.fecha_creacion!, { date: 'short', time: 'short' }, 'es' )} </Text>
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
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Tarja</Text>
            </View>


            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Variedad</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Calibre</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Fecha creación</Text>
            </View>

          </View>

          {
            tarjas_resultantes?.map((tarja: TTarjaResultanteReproceso) => {
              return (
                <View style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: '1px', 
                  display: 'flex',
                  flexDirection: 'row',
                  }}>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{tarja.codigo_tarja}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{tarja.variedad}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{tarja.calibre}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 10}}>{(tarja.peso - tarja.tipo_patineta).toLocaleString()}</Text>
                  </View>
      
                  <View style={styles.header_info_box_superior}>
                   <Text style={{ fontSize: 10}}>{format(tarja.fecha_creacion, { date: 'short', time: 'short' }, 'es' )}</Text>
                  </View>
                </View>
              )
            })
          }

          <View style={{
            marginTop: 40,
            width: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}>

            <View style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12 }}>Autorizaciones Pedido</Text>
            </View>

            <View style={{ 
              width: '100%',
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'row'
            }}>

              <View style={{ width: '50%', padding: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={{ fontSize: 10 }}>Nombre</Text>
                <Text style={{ borderBottom: '1px solid black', width: '100%', position: 'relative', top: 5}}></Text>
              </View>
              <View style={{ width: '50%', padding: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={{ fontSize: 10, position: 'relative', left: -5 }}>Responsable</Text>
                <Text style={{ borderBottom: '1px solid black', width: '100%', position: 'relative', top: 5}}></Text>
              </View>
              <View style={{ width: '50%', padding: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={{ fontSize: 10 }}>Firma</Text>
                <Text style={{ borderBottom: '1px solid black', width: '100%', position: 'relative', top: 5}}></Text>
              </View>
              <View style={{ width: '50%', padding: 10, display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center'}}>
                <Text style={{ fontSize: 10 }}>Autorizado</Text>
                <Text style={{ borderBottom: '1px solid black', width: '100%', position: 'relative', top: 5}}></Text>
              </View>

            </View>

          </View>

        </View> 
        </Page>
      </Document>
    </PDFViewer >
  )
}

export default PDFDocumentoSalida