import PageWrapper from '../../../../../components/layouts/PageWrapper/PageWrapper'
import Container from '../../../../../components/layouts/Container/Container'
import Card, { CardBody, CardHeader, CardTitle } from '../../../../../components/ui/Card'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import useDarkMode from '../../../../../hooks/useDarkMode'
import { useAppSelector } from '../../../../../redux/hooks'
import { RootState } from '../../../../../redux/store'
import { useEffect } from 'react'

const  TablaBinFrutaCalibrada = () => {
  const { isDarkTheme } = useDarkMode()
  const detalle_rendimiento = useAppSelector((state: RootState) => state.seleccion.detalle_rendimiento)

  return (
    <PageWrapper className='h-full'>
      <Container breakpoint={null} className='w-full h-full'>
        <Card className='h-full'>
          <CardHeader>
            <CardTitle>Calibres Bins Fruta Calibrada</CardTitle>
          </CardHeader> 
          <CardBody className='h-full'>
            <TableContainer sx={{borderRadius: 3 }}>
            <Table className='table' aria-label="simple table">
              <TableHead className='table-header'>
                <TableRow className='table-row' sx={{ borderRadius: 5, backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                  <TableCell className='table-cell-4' align='center' style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>u/oz</TableCell>
                  <TableCell className='table-cell-5' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Kilos</TableCell>
                  <TableCell className='table-cell-2' align="center" style={{ color: `${isDarkTheme ? 'white' : 'black'}`}}>Porcentaje</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className='table-body' >
                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>

                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>Sin Calibre</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.sincalibre ?? 0)?.toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.sincalibre ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>

                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>Pre Calibre</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.precalibre ?? 0)?.toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.precalibre ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>18/20</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_18_20 ?? 0)?.toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_18_20 ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>20/22</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_20_22 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_20_22 ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>23/25</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes.calibre_23_25 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                     <span className={`text-xl dark:text-white text-black'}`}>{((detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_23_25 ?? 0))?.toFixed(1)} %</span> 

                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>25/27</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_25_27 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{((detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_25_27 ?? 0))?.toFixed(1)} %</span>

                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>27/30</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_27_30 ?? 0).toFixed(1)} kgs</span>
  
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{((detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_27_30 ?? 0))?.toFixed(1)} %</span>

                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>30/32</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_30_32 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_30_32 ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>32/34</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_32_34 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_32_34 ?? 0)?.toFixed(1)} %</span>

                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>34/36</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_34_36 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_34_36 ?? 0)?.toFixed(1)} %</span>

                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>36/40</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_36_40 ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_36_40 ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow className='table-row-body' style={{ overflowX: 'auto', height: 40}}>
                  <TableCell className='table-cell-row-1' component="th" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>40/+</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.kilos_entrantes?.calibre_40_mas ?? 0).toFixed(1)} kgs</span>
                    </div>
                  </TableCell>

                  <TableCell className='table-cell-row-2' component="th" scope="row" sx={{ backgroundColor: `${isDarkTheme ? '#18181B' : 'white'}` }}>
                    <div className=' h-full w-full flex items-center justify-center gap-5'>
                      <span className={`text-xl dark:text-white text-black'}`}>{(detalle_rendimiento?.cc_rendimiento_entrantes?.calibre_40_mas ?? 0)?.toFixed(1)} %</span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  )
}

export default  TablaBinFrutaCalibrada 


