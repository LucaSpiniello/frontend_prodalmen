import React from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font, Image, pdf } from '@react-pdf/renderer';


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
  },
  table: {
    width: '100%',
    border: '1px solid green',
    borderRadius: 5,
    marginBottom: 10,
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f0f0f0',
    padding: 5,
  },
  tableHeaderCell: {
    width: '25%',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 10,
    padding: 5,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
  },
  tableCell: {
    width: '25%',
    textAlign: 'center',
    fontSize: 9,
    paddingVertical: 5,
  },
  positiveChange: {
    color: 'green',
  },
  negativeChange: {
    color: 'red',
  }
})

const PdfComparationRender: React.FC<{ informacion_acumulada: any, variedad: string, productor: string, info_seleccion : any, fechaInicio : Date, fechaFinal : Date }> = ({ informacion_acumulada, variedad, productor, info_seleccion, fechaInicio, fechaFinal }) => {

  if (!informacion_acumulada ) {
    return <div>No hay datos</div>;
  }

  if (!productor) {
    productor = 'Todos '
  }
  if (!variedad) {
    variedad = 'Todas'
  }
  const formatNumber = (number: number) => 
    new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(number);

  const calculatePercentageChange = (real: number, projected: number) => {
    if (projected === 0) return 'N/A';
    const change = ((real - projected) / projected) * 100;
    return change.toFixed(1);
  };

  const renderChangeColor = (change: string) => {
    const changeNum = parseFloat(change);
    return changeNum >= 0 ? styles.positiveChange : styles.negativeChange;
  };

  const brutoChange = calculatePercentageChange(informacion_acumulada.calculo_final_acumulado.bruto_real, informacion_acumulada.calculo_final_acumulado.kilos_brutos_proyectados);
  const finalExpChange = calculatePercentageChange(info_seleccion.fruta_seleccionada, informacion_acumulada.calculo_final_acumulado.final_exp_proyectados);
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

            <View style={{ textAlign: 'center', fontSize: 14, position: 'relative', top: -20 }}>
            <Text>Informe Comparacion Fruta Seleccionada/Proyectada</Text>
            <Text>{fechaInicio && fechaFinal ? `desde ${fechaInicio.toLocaleDateString()} hasta ${fechaFinal.toLocaleDateString()}` : ''}</Text>
          </View>


          <View style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            position: 'relative',
            top: -20,
            height: 100
          }}>

            <View style={styles.header_info_box_superior}>
              <Text style={{ fontSize: 10, marginBottom: 10}}>Datos Acumulativos </Text>
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
                  <Text style={styles.header_date_info_text}>Produccion: </Text>
                  <Text style={styles.header_date_info_text}>
                  {informacion_acumulada.calculo_final_acumulado.producciones.join(', ')}
                </Text>
                </View>

                <View style={styles.header_date_info_box}>
                  <Text style={styles.header_date_info_text}>Lotes: </Text>
                  <Text style={styles.header_date_info_text}>{info_seleccion.lotes} </Text>
                </View>

              </View>
            </View>

          </View>
        </View>

        <View style={styles.table}>
          {/* Encabezado de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Concepto</Text>
            <Text style={styles.tableHeaderCell}>Proyectado</Text>
            <Text style={styles.tableHeaderCell}>Real</Text>
            <Text style={styles.tableHeaderCell}>Cambio</Text>
            <Text style={styles.tableHeaderCell}>Cambio (%)</Text>
          </View>

          {/* Kilos Brutos Proyectado vs Real */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Kilos Brutos</Text>
            <Text style={styles.tableCell}>{formatNumber(informacion_acumulada.calculo_final_acumulado.kilos_brutos_proyectados)} kgs</Text>
            <Text style={styles.tableCell}>{formatNumber(informacion_acumulada.calculo_final_acumulado.bruto_real)} kgs</Text>
            <Text style={[styles.tableCell, renderChangeColor(formatNumber(informacion_acumulada.calculo_final_acumulado.bruto_real - informacion_acumulada.calculo_final_acumulado.kilos_brutos_proyectados))]}>{formatNumber(informacion_acumulada.calculo_final_acumulado.bruto_real - informacion_acumulada.calculo_final_acumulado.kilos_brutos_proyectados)} kgs</Text>
            <Text style={[styles.tableCell, renderChangeColor(brutoChange)]}>{brutoChange}%</Text>
          </View>

          {/* Kilos Seleccionados Finales Proyectado vs Real */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Kilos Seleccionados Finales</Text>
            <Text style={styles.tableCell}>{formatNumber(informacion_acumulada.calculo_final_acumulado.final_exp_proyectados)} kgs</Text>
            <Text style={styles.tableCell}>{formatNumber(info_seleccion.fruta_seleccionada)} kgs</Text>
            <Text style={[styles.tableCell, renderChangeColor(formatNumber(info_seleccion.fruta_seleccionada - informacion_acumulada.calculo_final_acumulado.final_exp_proyectados))]}>{formatNumber(info_seleccion.fruta_seleccionada - informacion_acumulada.calculo_final_acumulado.final_exp_proyectados)} kgs</Text>
            <Text style={[styles.tableCell, renderChangeColor(finalExpChange)]}>{finalExpChange}%</Text>
          </View>

          {/* Kilos Netos */}
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Kilos Netos</Text>
            <Text style={styles.tableCell}>{formatNumber(informacion_acumulada.calculo_final_acumulado.kilos_netos)} kgs</Text>
            <Text style={styles.tableCell}> {formatNumber(informacion_acumulada.calculo_final_acumulado.kilos_netos)} kgs</Text>
            <Text style={styles.tableCell}>0 kgs</Text>
            <Text style={styles.tableCell}>0%</Text>
          </View>
        </View>

        <View style={{
        width: '100%',
        display: 'flex',
        height: 90,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 5,
        position: 'absolute',  // Posición absoluta para fijarlo al final
        bottom: 0,  // Anclado al final de la página
      }}>
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
  
      </Page>
    </Document>
  );
};


const PDFComparacion: React.FC<{ informacion_acumulada: any, variedad: string, productor: string , info_seleccion : any, fechaInicio : Date, fechaFinal : Date}> = ({ informacion_acumulada, variedad, productor, info_seleccion, fechaInicio, fechaFinal }) => {
  
  const generateAndDownloadPDF = async () => {
    const doc = <PdfComparationRender informacion_acumulada={informacion_acumulada} variedad={variedad} productor={productor} info_seleccion={info_seleccion} fechaInicio={fechaInicio} fechaFinal={fechaFinal} />;
    const blob = await pdf(doc).toBlob();
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'fruta-real-pdf.pdf';
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <button onClick={generateAndDownloadPDF} className="mt-4 ml-10 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700">
      Generar y Descargar PDF Comparativo
    </button>
  );
};

export default PDFComparacion;
