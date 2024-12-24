import React, { useEffect, useState } from 'react';
import Container from '../../../components/layouts/Container/Container';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import CardFrutaCalibradaSeleccion from './Calibres.chart';
import CardFrutaPerdidasSeleccion from './ControlPepa.chart';
import CardMuestraControl from '../../Control de calidad/Proyeccion Fruta/MuestraControl.chart';
import ButtonsTabsResults from './ButtonsTabs';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { OPTIONSPRO, TTabsPro } from '../../../types/TabsDetalleProyeccion.types';
import { useAuth } from '../../../context/authContext';

import {fetchBinsPepaCalibradaPerProgram} from '../../../redux/slices/seleccionSlice';
import {fetchRendimientosLotesPorIds} from '../../../redux/slices/controlcalidadSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Label from '../../../components/form/Label';
import SelectReact from '../../../components/form/SelectReact';
import { optionsVariedad, variedadFilter } from '../../../utils/options.constantes';
import PDFFrutaReal from './PDFFrutaReal';
import PDFComparacion from './PDFComparacion';
import { DateRange, Range } from 'react-date-range';
import { set } from 'lodash';

interface InfoControlesCalidad {
  [key: number]: { 
    productor: string;
    variedad: string;
  };
}


const DetalleProyeccion = () => {

  const programas_seleccion = useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas_per_program)
  const info_lotes = useAppSelector((state: RootState) => state.control_calidad.rendimientos_lotes_por_ids)
	const [activeTab, setActiveTab] = useState<TTabsPro>(OPTIONSPRO.CP);
  
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)

  const [filtroVariedad, setFiltroVariedad] = useState<string>('')
  
  const [filtroVariedadLabel, setFiltroVariedadLabel] = useState<string>('')
  const [selectedProductor, setSelectedProductor] = useState<string>('');
  const [selectedNumeroGuia, setSelectedNumeroGuia] = useState<string>(''); 

  const [showPDF, setShowPDF] = useState(false);
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)

  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const [lotes, setLotes] = useState<any>('');
  const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups);
  const newInfo: InfoControlesCalidad = {};
  
  const [datosAgrupadosPorProductor, setDatosAgrupadosPorProductor] = useState<any>({});

  const [productores, setProductores] = useState<string[]>([]);
  const [seleccionesCombinadas, setSeleccionesCombinadas] = useState<any | null>(null);
  const today = new Date();
  const [fechaInicio, setFechaInicio] = useState<any>(today);
  const [fechaFin, setFechaFin] = useState<any>(today);

  const [filtroFechas, setFiltroFechas] = useState<any>(false);
  const [fechaChange, setfechaChange] = useState<any>(false);

  const [comercializador, setComercializador] = useState<string>('');

  const handleSelect = (ranges: any) => {
    setFechaInicio(ranges.selection.startDate);
    setFechaFin(ranges.selection.endDate);
  };

  const handleFiltrarFechas = () => {
    setfechaChange(!fechaChange);
    setFiltroFechas(true);
    setIsDateRangeVisible(false); 
  };

  const [isDateRangeVisible, setIsDateRangeVisible] = useState(false);

  const handleOpenDateRange = () => {
    setIsDateRangeVisible(true);
  };

  const reestablecerFechas = () => {
    setFechaInicio(today);
    setFechaFin(today);
  }

  const handleReestablecerFiltro = () => {
    reestablecerFechas();
    setIsDateRangeVisible(false); 
    setFiltroFechas(false);
    setfechaChange(!fechaChange);
  };

  useEffect(() => {
    setFiltroVariedad('NN')
  }, [])

  useEffect(() => {
    dispatch(fetchBinsPepaCalibradaPerProgram({ token, verificar_token: verificarToken }))

  }, [])

  useEffect(() => {

    if (programas_seleccion && filtroVariedad && hasGroup(['dnandres'])) {
      filterByComercializador("Prodalmen")
      setComercializador("Prodalmen")
    } else if (programas_seleccion && filtroVariedad && hasGroup(['comercializador'])) {
      filterByComercializador("Pacific Nut")
      setComercializador("Pacific Nut")
    }
  }, [programas_seleccion, filtroVariedad, dispatch, token, verificarToken, filtroVariedad]);

  useEffect(() => {

    if (programas_seleccion.length > 0 ) {
      const resultadoAgrupado = agruparPorProductor();
      setDatosAgrupadosPorProductor(resultadoAgrupado);
      setProductores(Object.keys(resultadoAgrupado));
    }
  }, [programas_seleccion]);

  useEffect(() => {
    let filteredData: any = {...datosAgrupadosPorProductor};

    if (selectedProductor) {
      filteredData = {[selectedProductor]: datosAgrupadosPorProductor[selectedProductor]};
    }

    if (filtroVariedadLabel) {
      Object.keys(filteredData).forEach(productor => {
        filteredData[productor] = filteredData[productor].filter((selecciones : any) => selecciones.variedad === filtroVariedadLabel);
      });
    }
    if (selectedNumeroGuia) {
      Object.keys(filteredData).forEach(productor => {
        filteredData[productor] = filteredData[productor].filter((selecciones : any) => 
          String(selecciones.guia_recepcion) === String(selectedNumeroGuia)
        );
      });
    }

    if (filtroFechas) {
      Object.keys(filteredData).forEach(productor => {
        filteredData[productor] = filteredData[productor].filter((selecciones: any) => {

          const [year, month, day] = selecciones.fecha_termino.split('-');
          const fechaSinHora = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
              
          const fechaInicioSinHora = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
          const fechaFinSinHora = new Date(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate());

          return fechaSinHora >= fechaInicioSinHora && fechaSinHora <= fechaFinSinHora;
        });
      });
    }
    
    
    const combinedSelections : any= Object.values(filteredData).flat();
    if (combinedSelections.length > 0) {
      const combinedData = combinarControles(combinedSelections);
      setSeleccionesCombinadas(combinedData);
      if (combinedData.lotes !== '') {
        dispatch(fetchRendimientosLotesPorIds({token, verificar_token: verificarToken, ids: combinedData.lotes}))
      }
    } else {
      setSeleccionesCombinadas(null);
    } 
  }, [datosAgrupadosPorProductor, selectedProductor, filtroVariedad, selectedNumeroGuia, fechaChange]);


  const filterByComercializador= (name : string ) => {
    return programas_seleccion.filter((programa: any) => programa.comercializador.toLowerCase() === name.toLowerCase());
  }

  const agruparPorProductor = () => {

    return programas_seleccion.reduce((acc : any, programa : any) => {

      const productor = programa.productor;

      if (!acc[productor]) {
        acc[productor] = [];
      }
  
      acc[productor].push(programa);
  
      return acc; 
    }, {}); 
  };
  

	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
        <Subheader className='z-10'>
          <div className='mb-2 inline-block w-full cursor-pointer text-xl content-center'>Informacion resultados comercializador {comercializador} 
          </div>
					<SubheaderLeft className='w-auto'>
						<ButtonsTabsResults activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight className='w-full md:w-4/12'>
              <div className='w-full border-black flex flex-col md:flex-row lg:flex-row gap-2'>
                <div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{seleccionesCombinadas?.fruta_seleccionada!} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-center text-sm'>Total Pepa Seleccionada</label>
                </div>
              </div>
          </SubheaderRight>
				</Subheader>
        <Subheader>
          
          <div className="w-auto lg:w-2/12 flex-col">
            <Label htmlFor="calle">Variedad: </Label>
            <SelectReact
                options={[{ value: 'NN', label: 'Todas las variedades' }, ...optionsVariedad]}
                id='variedad'
                placeholder='Todas las variedades'
                name='variedad'
                className='w-full py-2'
                onChange={(value: any) => {
                  setFiltroVariedad(value.value)
                  if (value.label=="Todas las variedades"){
                    setFiltroVariedadLabel('')
                  } else{
                    setFiltroVariedadLabel(value.label)
                  }
                }}
              />
          </div>
          <div className="w-auto lg:w-2/12 flex-col">

          <Label htmlFor="calle">Productor: </Label>
            <SelectReact
              options={[{ value: '', label: 'Todos los Productores' }, ...productores.map(productor => ({ value: productor, label: productor }))]}
              id='productor'
              placeholder='Todos los Productores'
              name='productor'
              className='w-full py-2'
              onChange={(value: any) => {
                setSelectedProductor(value.value)
                if (value.label=="Todos los Productores"){
                  setSelectedProductor('')
                } else {
                  setSelectedProductor(value.label)
              }
            }
              }
            />

          </div>

          <div className="w-auto lg:w-2/12 flex-col">
              <Label htmlFor="numero_guia">Números de Guía/Produccion: </Label>
              <SelectReact
                options={[{ value: '', label: 'Todos los Números de Guía' }, 
                  ...Array.from(new Set(programas_seleccion.map((programa: any) => programa.guia_recepcion)))
                    .map((numeroGuia: any) => ({ value: String(numeroGuia), label: String(numeroGuia) }))
                ]}
                id='numero_guia'
                placeholder='Todos los Números de Guía'
                name='numero_guia'
                className='w-full py-2'
                onChange={(value: any) => {
                  setSelectedNumeroGuia(value.value);
                  if (value.label === "Todos los Números de Guía") {
                    setSelectedNumeroGuia('');
                  } else {
                    setSelectedNumeroGuia(value.value);
                  }
                }}
              />
          </div>

            <div className="w-auto lg:w-2/12 flex-col">
            <Label htmlFor="filtrar_fecha">Filtrar por Fechas: </Label>
            <button
              onClick={handleOpenDateRange}
              className="bg-emerald-700 text-white py-2 px-4 rounded-md hover:bg-emerald-800 transition"
            >
              Filtrar por Fechas
            </button>
          </div>

        </Subheader>

				<Container breakpoint={null} className='w-full h-full'>
          { seleccionesCombinadas ?
					<div className='border'>
              {
                    activeTab.text === 'Control Pepa'
                    ? <CardFrutaPerdidasSeleccion activeTab={activeTab} rendimiento={seleccionesCombinadas!}/>
                    : activeTab.text === 'Calibres Pepa'
                      ? <CardFrutaCalibradaSeleccion activeTab={activeTab} programa={seleccionesCombinadas!}/>
                      : null
              }
					</div>
           : <div className='flex justify-center items-center h-96'>
              <span className='text-xl font-semibold text-gray-500'>No hay datos para mostrar</span>
              </div>}
              <div>
                {seleccionesCombinadas && 
                  <>
                    {/* Botón del PDF de Fruta Real */}
                    <PDFFrutaReal 
                      controlCombinado={seleccionesCombinadas} 
                      variedad={filtroVariedadLabel} 
                      productor={selectedProductor} 
                      fechaInicio={fechaInicio}
                      fechaFinal={fechaFin}
                    />

                    {/* Nuevo botón para el PDF Comparativo */}
                    <PDFComparacion 
                      informacion_acumulada={info_lotes} 
                      info_seleccion={seleccionesCombinadas}
                      variedad={filtroVariedadLabel} 
                      productor={selectedProductor} 
                      fechaInicio={fechaInicio}
                      fechaFinal={fechaFin}
                    />
                  </>
                }
              </div>

				</Container>
        {isDateRangeVisible && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <DateRange
                    ranges={[{
                      startDate: fechaInicio,
                      endDate: fechaFin,
                      key: 'selection',
                    }]}
                    onChange={handleSelect}
                    moveRangeOnFirstSelection={false}
                    months={1}
                    direction="horizontal"
                    rangeColors={['#10b981']}
                    showDateDisplay={false}
                  />

                  {/* Botones para filtrar y cerrar el modal */}
                  <div className="flex justify-end mt-4 gap-4">
                    <button
                      onClick={handleFiltrarFechas}
                      className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                    >
                      Filtrar
                    </button>
                    <button
                      onClick={handleReestablecerFiltro}
                      className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition"
                    >
                      Reestablecer Filtro
                    </button>
                    <button
                      onClick={() => setIsDateRangeVisible(false)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
			</PageWrapper>
		</>
	);
};

function combinarControles(selecciones: any): any {
  if (!selecciones || selecciones.length === 0) return null;

  const resultado: any = {
    fruta_seleccionada: 0,
    calibres: {
      "18/20": { kilos: 0, pct: 0 },
      "20/22": { kilos: 0, pct: 0 },
      "23/25": { kilos: 0, pct: 0 },
      "25/27": { kilos: 0, pct: 0 },
      "27/30": { kilos: 0, pct: 0 },
      "30/32": { kilos: 0, pct: 0 },
      "32/34": { kilos: 0, pct: 0 },
      "34/36": { kilos: 0, pct: 0 },
      "36/40": { kilos: 0, pct: 0 },
      "40/mas": { kilos: 0, pct: 0 },
      "PreCalibre": { kilos: 0, pct: 0 },
      "Sin Calibre": { kilos: 0, pct: 0 },
    },
    perdidas: {
      trozo_kilos: 0,
      picada_kilos: 0,
      hongo_kilos: 0,
      insecto_kilos: 0,
      dobles_kilos: 0,
      p_goma_kilos: 0,
      basura_kilos: 0,
      mezcla_kilos: 0,
      color_kilos: 0,
      goma_kilos: 0,
      kilos_total: 0,
      kilos_total_perdidas: 0,
      trozo_pct: 0,
      picada_pct: 0,
      hongo_pct: 0,
      insecto_pct: 0,
      dobles_pct: 0,
      p_goma_pct: 0,
      basura_pct: 0,
      mezcla_pct: 0,
      color_pct: 0,
      goma_pct: 0,
    },
    seleccion: '',
    variedad: '',
    productor: '',
    comercializador: '',
    lotes: ''
  };
  const lotesSet = new Set<string>();
  // Sumamos los kilos y los kilos de pérdida
  selecciones.forEach((seleccion: any) => {
    // Sumar fruta seleccionada
    resultado.fruta_seleccionada += seleccion.fruta_resultante;
    lotesSet.add(seleccion.guia_recepcion);
    // Sumar calibres
    for (let calibre in resultado.calibres) {
      if (seleccion.calibres[calibre] !== undefined) {
        resultado.calibres[calibre].kilos += seleccion.calibres[calibre];
      }
    }

    resultado.perdidas.trozo_kilos += seleccion.perdidas?.trozo_kilos || 0;
    resultado.perdidas.picada_kilos += seleccion.perdidas?.picada_kilos || 0;
    resultado.perdidas.hongo_kilos += seleccion.perdidas?.hongo_kilos || 0;
    resultado.perdidas.insecto_kilos += seleccion.perdidas?.insecto_kilos || 0;
    resultado.perdidas.dobles_kilos += seleccion.perdidas?.dobles_kilos || 0;
    resultado.perdidas.p_goma_kilos += seleccion.perdidas?.p_goma_kilos || 0;
    resultado.perdidas.basura_kilos += seleccion.perdidas?.basura_kilos || 0;
    resultado.perdidas.mezcla_kilos += seleccion.perdidas?.mezcla_kilos || 0;
    resultado.perdidas.color_kilos += seleccion.perdidas?.color_kilos || 0;
    resultado.perdidas.goma_kilos += seleccion.perdidas?.goma_kilos || 0;

    resultado.perdidas.kilos_total += seleccion.perdidas?.kilos_total || 0;
    resultado.perdidas.kilos_total_perdidas += seleccion.perdidas?.kilos_total_perdidas || 0;
  });

  // Recalcular los porcentajes con base en los kilos totales de las pérdidas
  if (resultado.perdidas.kilos_total > 0) {
    resultado.perdidas.trozo_pct = (resultado.perdidas.trozo_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.picada_pct = (resultado.perdidas.picada_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.hongo_pct = (resultado.perdidas.hongo_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.insecto_pct = (resultado.perdidas.insecto_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.dobles_pct = (resultado.perdidas.dobles_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.p_goma_pct = (resultado.perdidas.p_goma_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.basura_pct = (resultado.perdidas.basura_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.mezcla_pct = (resultado.perdidas.mezcla_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.color_pct = (resultado.perdidas.color_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
    resultado.perdidas.goma_pct = (resultado.perdidas.goma_kilos / resultado.perdidas.kilos_total_perdidas) * 100;
  }
  resultado.lotes = Array.from(lotesSet).join(',');
  // Recalcular los porcentajes para los calibres
  const totalCalibresKilos : any = Object.values(resultado.calibres).reduce((acc : any, calibre : any) => acc + calibre.kilos, 0);
  if (totalCalibresKilos > 0) {
    for (let calibre in resultado.calibres) {
      resultado.calibres[calibre].pct = (resultado.calibres[calibre].kilos / totalCalibresKilos) * 100;
    }
  }

  return resultado;
}

export default DetalleProyeccion;


