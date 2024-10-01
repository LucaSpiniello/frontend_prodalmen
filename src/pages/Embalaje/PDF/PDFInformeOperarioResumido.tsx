import { format } from '@formkit/tempo';
import { Document, StyleSheet, View, Text, Page, Image, PDFViewer } from '@react-pdf/renderer';
import { useLocation, useParams } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { TPDFInformeKilosXOperario, TPDFInformeOperarioResumido, TPDFInformeSeleccion } from '../../../types/TypesSeleccion.type';

const styles = StyleSheet.create({
  page: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 5

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

const PDFInformeXOperarioResumido = () => {
  const { pathname, state } = useLocation()
  const userData = useAppSelector((state: RootState) => state.auth.dataUser)
  const today = new Date()
  const suma_kilos = state?.operarios.reduce((acc: number, curr: TPDFInformeOperarioResumido) => acc + curr.kilos, 0)
  const suma_neto = state?.operarios.reduce((acc: number, curr: TPDFInformeOperarioResumido) => acc + curr.neto, 0)

  return (
    <PDFViewer style={{ height: '100%'}}>
      <Document>
        <Page>
        <View style={[styles.header, { paddingVertical: 10}]}>
          <View style={styles.header_superior}>
            <View style={{ position: 'relative', top: -9 }}>
              <Image source="/src/assets/prodalmen_foto.png" style={{ height: 100, width: 100}}/>
            </View>

            <Text style={{ width: 250, textAlign: 'center', fontSize: 14, position: 'relative', left: 0, top: 10}}>
              Informe de Operarios Embalaje 
              Resumido 
              del día {format(state.desde)} de Marzo del 2024 Hasta el {format(state.hasta)}
            </Text>


            <View style={{ width: 150, border: '1px solid green', height: 35, padding: 5, borderRadius: 2, position: 'relative', top: -10 }}>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Generado el {format(today, { date: 'short', time: 'short'}, 'es')}</Text>
                
              </View>

              <View style={styles.header_date_info_box}>
                <Text style={styles.header_date_info_text}>Creado Por: </Text>
                <Text style={styles.header_date_info_text}>{userData?.first_name || userData?.username}</Text>
              </View>
            </View>
          </View>

          <View style={{
            width: '100%',
            border: '1px solid green',
            height: 40,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10
          }}>
            <View style={{  
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 20
            }}>
              <Text style={styles.header_date_info_text}>Total Kilos: </Text>
              <Text style={[styles.header_date_info_text, { fontWeight: 'bold' }]}>{(suma_kilos ?? 0).toLocaleString()} Kgs</Text>
            </View>

            <View style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={styles.header_date_info_text}>Total Neto: </Text>
              <Text style={[styles.header_date_info_text, { fontWeight: 'bold' }]}>${(suma_neto ?? 0).toLocaleString()}</Text>
            </View>
          </View>


          

          <Text style={{ textAlign: 'center', fontSize: 10, fontWeight: 'bold', marginTop: 10 }}>Detalle Embalaje</Text>

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
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Operario</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Kilos</Text>
            </View>

            <View style={styles.header_info_box_superior}>
             <Text style={{ fontSize: 10, position: 'relative', top: -5}}>Neto</Text>
            </View>

          </View>

          {
            state?.operarios.map((programa: TPDFInformeOperarioResumido) => {
              return (
                <View key={programa.operario} style={{ 
                  width: '100%',
                  height: 30,
                  borderRadius: 1, 
                  display: 'flex',
                  flexDirection: 'row',
                }}>

                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 9, position: 'relative', top: -5, left: 0}}>{programa.operario}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 9, position: 'relative', top: -5, left: 0}}>{(programa.kilos ?? 0).toLocaleString()}</Text>
                  </View>

                  <View style={styles.header_info_box_superior}>
                    <Text style={{ fontSize: 9, position: 'relative', top: -5, left: 0}}>$ {(programa.neto ?? 0).toLocaleString()}</Text>
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

export default PDFInformeXOperarioResumido