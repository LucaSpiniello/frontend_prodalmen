import React, { useEffect, useState } from 'react';
import Container from '../../../components/layouts/Container/Container';
import PageWrapper from '../../../components/layouts/PageWrapper/PageWrapper';
import Subheader, {
	SubheaderLeft,
	SubheaderRight,
} from '../../../components/layouts/Subheader/Subheader';
import CardFrutaCalibrada from './Calibres.chart';
import CardPepaControl from './ControlPepa.chart';
import CardMuestraControl from './MuestraControl.chart';
import ButtonsTabsProyeccion from './ButtonsTabs';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import CardTablaInformativa from './TablaInformativa.card';
import { OPTIONSPRO, TTabsPro } from '../../../types/TabsDetalleProyeccion.types';
import { useAuth } from '../../../context/authContext';
import { fetchControlesDeCalidadVistoBueno, fetchRendimientoLotes, } from '../../../redux/slices/controlcalidadSlice';
import { ThunkDispatch } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import Label from '../../../components/form/Label';
import SelectReact from '../../../components/form/SelectReact';
import { optionsVariedad, variedadFilter } from '../../../utils/options.constantes';
import { has, set } from 'lodash';
import { TRendimiento } from "../../../types/TypesControlCalidad.type"
import PDFProyeccion from './PDFProyeccion';
import User from '../../../components/layouts/User/User';

interface InfoControlesCalidad {
  [key: number]: { 
    productor: string;
    variedad: string;
  };
}


const DetalleProyeccion = () => {
  const control_calidad = useAppSelector((state: RootState) => state.control_calidad.controles_calidad_visto_bueno)
	const [activeTab, setActiveTab] = useState<TTabsPro>(OPTIONSPRO.MC);
  
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const { verificarToken } = useAuth()
  const token = useAppSelector((state: RootState) => state.auth.authTokens)
  const lista_controles = control_calidad?.map(lote => lote.recepcionmp)
  const controles_calidad = lista_controles ? lista_controles.join(",") : ""
  const [filtroVariedad, setFiltroVariedad] = useState<string>('')
  const todos_los_rendimientos = useAppSelector((state: RootState) => state.control_calidad.todos_los_rendimientos);
  const [filtroVariedadLabel, setFiltroVariedadLabel] = useState<string>('')
  const [selectedProductor, setSelectedProductor] = useState<string>('');
  const perfil = useAppSelector((state: RootState) => state.auth.dataUser)
  const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador)
  const userGroup = useAppSelector((state: RootState) => state.auth.grupos)
  const isPacificNut = comercializador === 'Pacific Nut';
  const newInfo: InfoControlesCalidad = {};
  
  const [datosAgrupadosPorProductor, setDatosAgrupadosPorProductor] = useState<any>({});
  const [infoControlesCalidad, setInfoControlesCalidad] = useState<InfoControlesCalidad>({});
  const [productores, setProductores] = useState<string[]>([]);
  const [rendimientosCombinados, setRendimientosCombinados] = useState<TRendimiento | null>(null);
  const [selectedNumeroGuia, setSelectedNumeroGuia] = useState<string>(''); 

  useEffect(() => {
    setFiltroVariedad('NN')
  }, [])

  useEffect(() => {
    dispatch(fetchControlesDeCalidadVistoBueno({ token, verificar_token: verificarToken }))
  }, [])

  useEffect(() => {

    if (control_calidad && filtroVariedad && !isPacificNut ) {
      const ids = filterByComercializador("Prodalmen").map((lote: any) => lote.id)
      ids.forEach((id : any) => {
        dispatch(fetchRendimientoLotes({ id,  params: { variedad: filtroVariedad }, token, verificar_token: verificarToken }));
      });
    } else if (control_calidad && filtroVariedad && isPacificNut) {
      const ids = filterByComercializador("Pacific Nut").map((lote: any) => lote.id)
      ids.forEach((id : any) => {
        dispatch(fetchRendimientoLotes({ id,  params: { variedad: filtroVariedad }, token, verificar_token: verificarToken }));
      });
    }
  }, [control_calidad, filtroVariedad]);

  useEffect(() => {
    if (control_calidad) {
      control_calidad.forEach((lote: any) => {
        newInfo[lote.id] = { productor: lote.productor, variedad: lote.variedad };
      });
      setInfoControlesCalidad(newInfo);
    }
  }, [control_calidad]);

  useEffect(() => {

    if (todos_los_rendimientos.length > 0 && Object.keys(infoControlesCalidad).length > 0 ) {
      const resultadoAgrupado = agruparPorProductor();
      setDatosAgrupadosPorProductor(resultadoAgrupado);
      setProductores(Object.keys(resultadoAgrupado));
    }
  }, [todos_los_rendimientos, infoControlesCalidad]);

  const agruparPorProductor = () => {
    const resultadoPorProductor : any = {};
  
    todos_los_rendimientos.forEach(rendimiento => {
      const id = rendimiento.id; 
  
      if (typeof id !== 'undefined') {
        const info = infoControlesCalidad[id];
  
        if (info && info.productor) {
 
          if (!resultadoPorProductor[info.productor]) {
            resultadoPorProductor[info.productor] = [];
          }
          const control = resultadoPorProductor[info.productor].find((control: any) => control.id === id);
          if (!control) {
            resultadoPorProductor[info.productor].push({
            ...rendimiento,
            variedad: info.variedad 
          });
          }
        }
      }
    });
  
    return resultadoPorProductor;
  };


  useEffect(() => {
    let filteredData: any = {...datosAgrupadosPorProductor};

    if (selectedProductor) {
      filteredData = {[selectedProductor]: datosAgrupadosPorProductor[selectedProductor]};
    }

    if (filtroVariedadLabel) {
      Object.keys(filteredData).forEach(productor => {
        filteredData[productor] = filteredData[productor].filter((control : any) => control.variedad === filtroVariedadLabel);
      });
    }

    if (selectedNumeroGuia) {
      Object.keys(filteredData).forEach(productor => {
        filteredData[productor] = filteredData[productor].filter((control : any) => 
          String(control.numero_lote) === String(selectedNumeroGuia)
        );
      });
    }

    const combinedControls : any= Object.values(filteredData).flat();
    if (combinedControls.length > 0) {
      const combinedData = combinarControles(combinedControls);
      setRendimientosCombinados(combinedData);
    } else {
      setRendimientosCombinados(null);
    } 
  }, [datosAgrupadosPorProductor, selectedProductor, filtroVariedad, selectedNumeroGuia]);

  // const filterByComercializador = () => {
  //   return control_calidad.filter((control: any) => checkComercializadorIsInControl(control.comercializador, perfil));
  // }

  // const checkComercializadorIsInControl = (controlCom : string, user : any) => {
  //   const lastName = user.last_name.toLowerCase();
  //   const firstName = user.first_name.toLowerCase();
  //   const fullName = firstName + " " + lastName;
  //   if (controlCom.toLowerCase() === fullName) {
  //     return true;
  //   }
  //   if (controlCom.toLowerCase() === lastName) {
  //     return true;
  //   }
  //   if (controlCom.toLowerCase() === firstName) {
  //     return true;
  //   }
  //   return false;
  // }

  const filterByComercializador= (name : string ) => {
    return control_calidad.filter((control: any) => control.comercializador.toLowerCase() === name.toLowerCase());
  }

	return (
		<>
			<PageWrapper name='Detalle Programa Producción'>
        <Subheader className='z-10'>
        <div className='mb-2 inline-block w-full cursor-pointer text-xl content-center'>Informacion de proyeccion comercializador {comercializador} 
        </div>
					<SubheaderLeft className='w-auto'>
						<ButtonsTabsProyeccion activeTab={activeTab} setActiveTab={setActiveTab} />
					</SubheaderLeft>
          <SubheaderRight className='w-full md:w-4/12'>
              <div className='w-full border-black flex flex-col md:flex-row lg:flex-row gap-2'>
                <div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{rendimientosCombinados?.cc_calculo_final.kilos_netos.toFixed(1)} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-center text-sm'>Total Recepcionados</label>
                </div>

                <div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{rendimientosCombinados?.cc_calculo_final.kilos_brutos.toFixed(1)} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-sm text-center'>Total Pepa Bruta</label>
                </div>

                <div className='w-full lg:w-auto flex flex-col items-center rounded-md bg-emerald-700'>
                  <span className='text-lg text-center font-semibold text-white'>{rendimientosCombinados?.cc_calculo_final.final_exp.toFixed(1)} kgs</span>
                  <label htmlFor="" className='font-semibold text-white text-center text-sm'>Total Pepa Exportable</label>
                </div>
              </div>
          </SubheaderRight>
				</Subheader>
        <Subheader>
          <div className="w-auto lg:w-3/12 flex-col">
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
          <div className="w-auto lg:w-3/12 flex-col">

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

          <div className="w-auto lg:w-3/12 flex-col">
            <Label htmlFor="numero_guia">Número de Guía: </Label>
            <SelectReact
              options={[{ value: '', label: 'Todos los Números de Guía' }, 
                ...Array.from(new Set(control_calidad.map((programa: any) => programa.guia_recepcion)))
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
        </Subheader>
				<Container breakpoint={null} className='w-full h-full'>
          { rendimientosCombinados ?
					<div className='border'>
              {
                activeTab.text === 'Muestra Control'
                ? <CardMuestraControl activeTab={activeTab} rendimiento={rendimientosCombinados!} />
                  : activeTab.text === 'Control Pepa'
                    ? <CardPepaControl activeTab={activeTab} rendimiento={rendimientosCombinados!}/>
                    : activeTab.text === 'Calibres Pepa'
                      ? <CardFrutaCalibrada activeTab={activeTab} rendimiento={rendimientosCombinados!}/>
                      : activeTab.text === 'Tabla Informativa'
                        ? <CardTablaInformativa activeTab={activeTab} filtroVariedad={filtroVariedadLabel} filtroProductor={selectedProductor} />
                        : null
              }
					</div>
           : <div className='flex justify-center items-center h-96'>
              <span className='text-xl font-semibold text-gray-500'>No hay datos para mostrar</span>
              </div>}
                {rendimientosCombinados && 
                  <PDFProyeccion controlCombinado={rendimientosCombinados} variedad={filtroVariedadLabel} productor={selectedProductor} isPacificNut={isPacificNut} />
                }

				</Container>
        
			</PageWrapper>
		</>
	);
};

function combinarControles(controles: TRendimiento[]): TRendimiento {
  const controlCombinado: TRendimiento = {
    cc_aportes_pex: [],
    cc_calculo_final: {
        kilos_netos: 0,
        kilos_brutos: 0,
        por_brutos: 0,
        merma_exp: 0,
        final_exp: 0,
        merma_cat2: 0,
        final_cat2: 0,
        merma_des: 0,
        final_des: 0,
    },
    cc_descuentos: [
      {
        cc_lote: 0,
        pepa_exp: 0,
        cat2: 0,
        desechos: 0,
        mezcla: 0,
        color: 0,
        dobles: 0,
        insecto: 0,
        hongo: 0,
        vana: 0,
        pgoma: 0,
        goma: 0,
      }
    ],
    cc_kilos_des_merma: [
      {
        cc_lote: 0,
        exportable: 0,
        cat2: 0,
        des: 0,
      }
    ],
    cc_muestra: [],
    cc_pepa: [],
    cc_pepa_calibre: [{
      cc_lote: 0,
      precalibre: 0,
      calibre_18_20: 0,
      calibre_20_22: 0,
      calibre_23_25: 0,
      calibre_25_27: 0,
      calibre_27_30: 0,
      calibre_30_32: 0,
      calibre_32_34: 0,
      calibre_34_36: 0,
      calibre_36_40: 0,
      calibre_40_mas: 0,
    }],
    cc_porcentaje_liquidar: [],
    cc_promedio_porcentaje_cc_pepa: {
      mezcla: 0,
      insecto: 0,
      hongo: 0,
      dobles: 0,
      color: 0,
      vana: 0,
      pgoma: 0,
      goma: 0,
    },
    cc_promedio_porcentaje_cc_pepa_calibradas: {
      precalibre: 0,
      calibre_18_20: 0,
      calibre_20_22: 0,
      calibre_23_25: 0,
      calibre_25_27: 0,
      calibre_27_30: 0,
      calibre_30_32: 0,
      calibre_32_34: 0,
      calibre_34_36: 0,
      calibre_36_40: 0,
      calibre_40_mas: 0,
    },
    cc_promedio_porcentaje_muestras: {
      basura: 0,
      pelon: 0,
      ciega: 0,
      cascara: 0,
      pepa_huerto: 0,
      pepa_bruta: 0,
    },
    lotes: []
  };
  
  controles.forEach((control, index) => {
    // sumar field aportes_pex
    control.cc_aportes_pex.forEach((aporte, index) => {
      if (!controlCombinado.cc_aportes_pex[index]) {
        controlCombinado.cc_aportes_pex[index] = { ...aporte };
      } else {
        controlCombinado.cc_aportes_pex[index].cat2 = (controlCombinado.cc_aportes_pex[index].cat2 || 0) + aporte.cat2;
        controlCombinado.cc_aportes_pex[index].des = (controlCombinado.cc_aportes_pex[index].des || 0) + aporte.des;
        controlCombinado.cc_aportes_pex[index].exportable = (controlCombinado.cc_aportes_pex[index].exportable || 0) + aporte.exportable;
      }
    });
    // Sumar field cc_calculo_final
    Object.keys(controlCombinado.cc_calculo_final).forEach((key : any) => {
      controlCombinado.cc_calculo_final[key] += control.cc_calculo_final[key];
    })

    // filed cc_promedio_porcentaje_muestras

    Object.keys(controlCombinado.cc_promedio_porcentaje_muestras).forEach((key : any) => {
      controlCombinado.cc_promedio_porcentaje_muestras[key] += control.cc_promedio_porcentaje_muestras[key] * control.cc_calculo_final.kilos_netos;
    })
    // field cc_pepa_calibre sumar todos los calibres
    Object.keys(controlCombinado.cc_pepa_calibre[0]).forEach((key : any) => {
      controlCombinado.cc_pepa_calibre[0][key] += (control.cc_pepa_calibre[0][key]/ 100) * control.cc_calculo_final.final_exp;
    });

    Object.keys(controlCombinado.cc_promedio_porcentaje_cc_pepa).forEach((key : any) => {
      controlCombinado.cc_promedio_porcentaje_cc_pepa[key] += (control.cc_promedio_porcentaje_cc_pepa[key] / 100) * control.cc_calculo_final.kilos_brutos;
    })

    // sum cc_kilos_des_merma
    Object.keys(controlCombinado.cc_kilos_des_merma[0]).forEach((key : any) => {
      controlCombinado.cc_kilos_des_merma[0][key] += control.cc_kilos_des_merma[0][key];

    })

    // sum cc_descuentos
    Object.keys(controlCombinado.cc_descuentos[0]).forEach((key : any) => {
      controlCombinado.cc_descuentos[0][key] += control.cc_descuentos[0][key];

    })
  
    if (index != controles.length - 1) {
      controlCombinado.lotes?.push(control.numero_lote?.toString() + ", ");
    } else{
      controlCombinado.lotes?.push(control.numero_lote?.toString());
    }
    
  });

  console.log("el control combinado es", controlCombinado)
  Object.keys(controlCombinado.cc_promedio_porcentaje_muestras).forEach(key => {
    controlCombinado.cc_promedio_porcentaje_muestras[key] = (controlCombinado.cc_promedio_porcentaje_muestras[key] / controlCombinado.cc_calculo_final.kilos_netos );
  });
  

  Object.keys(controlCombinado.cc_promedio_porcentaje_cc_pepa_calibradas).forEach((key : any) => {
    controlCombinado.cc_promedio_porcentaje_cc_pepa_calibradas[key] = (100 * controlCombinado.cc_pepa_calibre[0][key] / controlCombinado.cc_calculo_final.final_exp * 100) / 100;
  });

  Object.keys(controlCombinado.cc_promedio_porcentaje_cc_pepa).forEach((key : any) => {
    controlCombinado.cc_promedio_porcentaje_cc_pepa[key] = (controlCombinado.cc_promedio_porcentaje_cc_pepa[key] / controlCombinado.cc_calculo_final.kilos_brutos * 100) / 100;
  });

  Object.keys(controlCombinado.cc_pepa_calibre[0]).forEach((key : any) => {
    controlCombinado.cc_pepa_calibre[0][key] = parseFloat((controlCombinado.cc_pepa_calibre[0][key] * 100 / controlCombinado.cc_calculo_final.final_exp ).toFixed(3) );
  }
  )




  return controlCombinado;
}


export default DetalleProyeccion;
