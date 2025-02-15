import { lazy } from 'react';
import { RouteProps } from 'react-router-dom';
import { authPages, appPages } from '../config/pages.config';
import NotFoundPage from '../pages/NotFound.page';
import LoginPage from '../pages/Auth/Login.page.tsx';
import DetallePedido from '../pages/Pedidos/DetallePedido.tsx';
// import Prueba from '../pages/prueba.tsx';
// import MyComponent from '../pages/prueba.tsx';

const ProfilePage = lazy(() => import('../pages/Auth/Profile.page.tsx'));
const DashboardHome = lazy(() => import('../pages/DashboardHome.tsx'));


// Productores
const ListaProductores = lazy(() => import('../pages/Registros/Productores/Tabla Productores/ListaProductores.tsx'));
// Operarios
const ListaOperarios = lazy(() => import('../pages/Registros/Operarios/Tabla Operarios/ListaOperarios.tsx'));
// Conductores
const ListaConductores = lazy(() => import('../pages/Registros/Conductores/Tabla Conductores/ListaConductores.tsx'));
// Camiones
const ListaCamiones = lazy(() => import('../pages/Registros/Camiones/Tabla Camiones/ListaCamiones.tsx'));
// Comercializadores
const ListaComercializadores = lazy(() => import('../pages/Registros/Comercializadores/Tabla Comercializador/ListaComercializadores.tsx'));
// Clientes
const ListaClientes = lazy(() => import('../pages/Registros/Clientes/TablaClientes.tsx'));



// Guia Recepcion
const ListaGuiaRecepcion = lazy(() => import('../pages/Recepcion Materia Prima/Tabla/ListaGuiaRecepcion.tsx'));
const RegistroGuiaRecepcion = lazy(() => import('../pages/Recepcion Materia Prima/Formularios/Formulario Registro Guia Recepcion MP/FormularioRegistroGuiaRecepcion.tsx'));
const DetalleGuiaRecepcion = lazy(() => import('../pages/Recepcion Materia Prima/Detalles/Detalle Guia/DetalleGuia.tsx'));
const PDFGuiaRecepcion = lazy(() => import('../pages/Recepcion Materia Prima/Detalles/PDFGuiaRecepcion.tsx'));


const ListaEnvases = lazy(() => import('../pages/Bodegas/Envases Materia Prima/Tabla/ListaEnvases.tsx'));
// const EnavasesMP = lazy(() => import('../pages/Recepcion MP/Guia Recepcion/'));




// Control Calidad
const ListaControlCalidad = lazy(() => import('../pages/Control de calidad/Control Calidad Lotes/Tablas/ListaControlCalidad.tsx'));
const DetalleControlCalidad = lazy(() => import('../pages/Control de calidad/Control Calidad Lotes/DetalleControlCalidad.tsx'));
const DetalleVBControlCalidad = lazy(() => import('../pages/Control de calidad/Visto Bueno CDR/DetalleCCRendimiento.tsx'));
const ListaControlCalidadVistoBueno = lazy(() => import('../pages/Control de calidad/Visto Bueno CDR/Tablas/ListaControlRendimiento.tsx'));
const ProyeccionDeFRuta = lazy(() => import('../pages/Control de calidad/Proyeccion Fruta/DetalleProyeccion.tsx'));
const PDFRendimiento = lazy(() => import('../pages/Control de calidad/Visto Bueno CDR/PDFCCRendimiento.tsx'));
const DetalleControlCalidadPepa = lazy(() => import('../pages/Control de calidad/Control Calidad Lotes/DetalleControlCalidadPepa.tsx'));



// Control Calidad Tarja Resultante
const ListaControlCalidadTarjaResultante = lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Resultantes/Tabla Control Calidad Tarja/ListaControlCalidadTarja.tsx'));
const DetalleControlCalidadTarjaResultante = lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Resultantes/DetalleControlCalidadTarja.tsx'));


// Control Calidad Tarja Resultante Reproceso
const ListaControlCalidadTarjaResultanteReproceso = lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Resultante Reproceso/Tabla Control Calidad Tarja Resultante/ListaControlCalidadTarjaReproceso.tsx'));
const DetalleControlCalidadTarjaResultanteReproceso = lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Resultante Reproceso/DetalleControlCalidadTarjaResultante.tsx'));

// Control Calidad Tarja Seleccionada
const ListaControlCalidadTarjaSeleccionada = lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Seleccionada/TablaControlCalidadTarja.tsx'));
const DetalleControlCalidadTarjaSeleccionada= lazy(() => import('../pages/Control de calidad/Control Calidad Tarja Seleccionada/DetalleControlCalidadTarjaSeleccionada.tsx'));


// BIN RESULTANTE PLANTA HARINA
const ListaControlCalidadTBinResultante = lazy(() => import('../pages/Control de calidad/Control Calidad Bin Resultante Planta Harina/TablaControlCalidadBinResultantePlantaHarina.tsx'));
const DetalleControlCalidadTBinResultante= lazy(() => import('../pages/Control de calidad/Control Calidad Bin Resultante Planta Harina/DetalleControlCalidadBinResultantePlantaHarina.tsx'));

// BIN RESULTANTE PLANTA HARINA
const ListaControlCalidadTBinResultanteProceso  = lazy(() => import('../pages/Control de calidad/Control Calidad Bin Resultante Proceso Planta Harina/TablaControlCalidadBinResultanteProcesoPlantaHarina.tsx'));



// PROGRAMAS DE PRODUCCION
const ListaProgramas = lazy(() => import('../pages/Produccion/Programa Produccion/Tabla/ListaProgramas.tsx'));
const DetallePrograma = lazy(() => import ('../pages/Produccion/Programa Produccion/Detalles/DashboardProduccion.tsx'))
const DetalleControlRendimiento = lazy(() => import ('../pages/Produccion/Programa Produccion/Detalles/Detalle Control Rendimiento/DetalleControlRendimiento.tsx'))
const Resultados = lazy(() => import('../pages/Produccion/Resultados/resultados.tsx'));
const Stocks = lazy(() => import('../pages/Produccion/Stocks/stocks.tsx'));
const FormularioRegistroPrograma = lazy(() => import ('../pages/Produccion/Programa Produccion/Formularios/Formulario Registro Programa/TablaRegistroPrograma.tsx'))
const PDFOperarioXKilo = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFOperarioXKilo.tsx'))
const PDFResumidoOperario = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFResumidoOperario.tsx'))
const PDFPreLimpia = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFPreLimpia.tsx'))
const PDFDescascarado = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFDescascarado.tsx'))
const PDFDocumentoEntrada = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFDocumentoEntrada.tsx'))
const PDFDetalleEnvases = lazy(() => import ('../pages/Produccion/Programa Produccion/PDF/PDFDetalleEnvases.tsx'))
const PDFDocumentoSalidaProduccion = lazy(() => import('../pages/Produccion/Programa Produccion/PDF/PDFDocumentoSalida.tsx'))

// PROGRAMA DE REPROCESO
const ListaProgramasReproceso = lazy(() => import('../pages/Produccion/Programa Programa Reproceso/Tabla Programa Reproceso/ListaProgramasReproceso.tsx'));
const FormularioRegistroProgramaReproceso = lazy(() => import ('../pages/Produccion/Programa Programa Reproceso/Formularios/Formulario Registro Bin Reproceso/RegistroBinAReproceso.tsx'))
const DetalleProgramaReproceso = lazy(() => import('../pages/Produccion/Programa Programa Reproceso/Detalles/DashboardReproceso.tsx'));
const PDFDocumentoEntradaR = lazy(() => import ('../pages/Produccion/Programa Programa Reproceso/PDF/PDFDocumentoEntrada.tsx'))
const PDFDocumentoSalida = lazy(() => import ('../pages/Produccion/Programa Programa Reproceso/PDF/PDFDocumentoSalida.tsx'))
const PDFDetalleOperarioReproceso = lazy(() => import ('../pages/Produccion/Programa Programa Reproceso/PDF/PDFDetalleOperarioResumido.tsx'))
const PDFInformeProgramasReproceso = lazy(() => import ('../pages/Produccion/Programa Programa Reproceso/PDF/PDFInformeReproceso.tsx'))



// PROGRAMA DE SELECCION
const ListaProgramaSeleccion = lazy(() => import('../pages/Produccion/Programa Seleccion/Tabla Programa Seleccion/ListaProgramasSeleccion.tsx'));
const DetalleProgramaSeleccion = lazy(() => import('../pages/Produccion/Programa Seleccion/Detalles/DashboardSeleccion.tsx'));
const RegistroProgramaSeleccion = lazy(() => import('../pages/Produccion/Programa Seleccion/Formularios/Formulario Registro Bin Seleccion/RegistroBinASeleccion.tsx'));
const DetalleControlRendimientoSeleccion = lazy(() => import ('../pages/Produccion/Programa Seleccion/Detalles/Detalle Proyeccion Seleccion/DetalleProyeccionSeleccion.tsx'))
const PDFInformeSeleccion = lazy(() => import ('../pages/Produccion/Programa Seleccion/PDF/PDFInformeSeleccion.tsx'))
const PDFInformeKilosXOperario = lazy(() => import ('../pages/Produccion/Programa Seleccion/PDF/PDFInformeKilosXOperario.tsx'))
const PDFInformeXOperarioResumido = lazy(() => import ('../pages/Produccion/Programa Seleccion/PDF/PDFInformeOperarioResumido.tsx'))

//__ SELECCION AGRUPADOS
const ListaSubProductos = lazy(() => import ('../pages/Produccion/Programa Seleccion/SubProducto Seleccion/Tablas/TablaSubProductos.tsx'))
const ListaBinSubProductos = lazy(() => import ('../pages/Produccion/Programa Seleccion/SubProducto Seleccion/Tablas/TablaBinSubProducto.tsx'))
const RegistroSubProductos = lazy(() => import ('../pages/Produccion/Programa Seleccion/SubProducto Seleccion/Formularios/RegistroBinAgrupacionSeleccion.tsx'))
const DetalleBinSubProducto = lazy(() => import ('../pages/Produccion/Programa Seleccion/SubProducto Seleccion/Detalle/DetalleAgrupacionBinSubProducto.tsx'))


const PDFInformeEntradaSeleccion = lazy(() => import ('../pages/Produccion/Programa Seleccion/PDF/PDFDocumentoEntradaSeleccion.tsx'))
const PDFInformeSalidaSeleccion = lazy(() => import ('../pages/Produccion/Programa Seleccion/PDF/PDFDocumentoSalidaSeleccion.tsx'))

// BODEGAS
const ListaPatioTechadoExterior = lazy(() => import ('../pages/Bodegas/Patio Techado Exterior/Tabla Patio Techado Exterior/ListaPatioTechadoExt.tsx'))
const DetallePatioTechadoExterior = lazy(() => import ('../pages/Bodegas/Patio Techado Exterior/DetallePatioTechadoExterior.tsx'))
const ListaPalletsProductoTerminado = lazy(() => import ('../pages/Bodegas/Pallet Producto Terminado/TablaPalletProductoTerminado.tsx'))

const ListaBodegaG1 = lazy(() => import ('../pages/Bodegas/Bodega G1/Tabla Bodega G1/ListaBodegaG1.tsx'))
const ListaBodegaG2 = lazy(() => import ('../pages/Bodegas/Bodega G2/Tabla Bodega G2/ListaBodegaG2.tsx'))
const ListaBodegaG3 = lazy(() => import ('../pages/Bodegas/Bodega G3/ListaBodegaG3.tsx'))
const ListaBodegaG4 = lazy(() => import ('../pages/Bodegas/Bodega G4/ListaBodegaG4.tsx'))
const ListaBodegaG5 = lazy(() => import ('../pages/Bodegas/Bodega G5/ListaBodegaG5.tsx'))
const ListaBodegaG6 = lazy(() => import ('../pages/Bodegas/Bodega G6/ListaBodegaG6.tsx'))
const ListaBodegaG7 = lazy(() => import ('../pages/Bodegas/Bodega G7/ListaBodegaG7.tsx'))

const PDF_Bodegas = lazy(() => import ('../pages/Bodegas/PDFBodegas.tsx'))

const ListaBinAgrupado = lazy(() => import ('../pages/Bodegas/Agrupacion Bins/Tabla Agrupacion Bins/TablaAgrupaciones.tsx'))
const RegistroBinAgrupacion = lazy(() => import ('../pages/Bodegas/Agrupacion Bins/Formulario/RegistroAgrupacionBins.tsx'))
const DetalleBinsAgrupados = lazy(() => import ('../pages/Bodegas/Agrupacion Bins/Detalle/DetalleAgrupacionBins.tsx'))



const ListaProgramaPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/TablaProgramasPlantaHarina.tsx'))
const RegistroBinPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/Formularios/Formulario Registro Bin Planta Harina/RegistroBinAPlantaHarina.tsx'))
const DetalleProgramaPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/Detalles/DashboardPlantaHarina.tsx'))
const PDFDocumentoEntradaPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/PDF/PDFDocumentoEntradaPlantaHarina.tsx'))
const PDFDocumentoSalidaPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/PDF/PDFDocumentoSalidaPlantaHarina.tsx'))
const PDFInformeKilosXOperarioPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/PDF/PDFInformeKilosXOperario.tsx'))
const PDFInformeOperarioResumidoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/PDF/PDFInformeOperarioResumido.tsx'))
const PDFInformeProgramaPHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/PDF/PDFInformeProgramaPHarina.tsx'))
const ListaProcesoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/TablaProcesoPlantaHarina.tsx'))
const RegistroBinProcesoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/Formularios/Formulario Registro Bin Proceso Planta Harina/RegistroBinAProcesoPlantaHarina.tsx'))
const DetalleProcesoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/Detalles/DashboardProcesoPlantaHarina.tsx'))
const PDFDocumentoEntradaProcesoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/PDF/PDFDocumentoEntradaProcesoPlantaHarina.tsx'))
const PDFDocumentoSalidaProcesoPlantaHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/PDF/PDFDocumentoSalidaProcesoPlantaHarina.tsx'))
const PDFInformeKilosXOperarioProcesoHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/PDF/PDFInformeKilosXOperario.tsx'))
const PDFInformeOperarioResumidoProcesoHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/PDF/PDFInformeOperarioResumido.tsx'))
const PDFInformeProgramaProcesoHarina = lazy(() => import ('../pages/Planta Harina/Proceso Planta Harina/PDF/PDFInformeProcesoPHarina.tsx'))

// const DetalleProgramaPlantaHarina = lazy(() => import ('../pages/Planta Harina/Programa Planta Harina/Detalles/DashboardEmbalaje.tsx'))


const UnderConstructionPage = lazy(() => import('../pages/UnderConstruction.page'));


// PEDIDOS
const ListaPedidos = lazy(() => import('../pages/Pedidos/TablaPedidos.tsx'));

const DetallePedidoMercadoInterno = lazy(() => import('../pages//Pedidos/Pedido Mercado Interno/DetallePedidoMercadoInterno.tsx'));
const PDFPedidoInterno = lazy(() => import('../pages/Pedidos/Pedido Mercado Interno/PDF/PDFPedidoInterno.tsx'));

const DetallePedidoExportacion = lazy(() => import('../pages/Pedidos/Pedido Exportacion/DetallePedidoExportacion.tsx'))
const PDFPedidoExportacion = lazy(() => import('../pages/Pedidos/Pedido Exportacion/PDF/PDFPedidoExportacion.tsx'));


const DetalleGuiaSalida = lazy(() => import('../pages/Pedidos/Guia Salida/DetalleGuiaSalida.tsx'))
const PDFGuiaSalida = lazy(() => import('../pages/Pedidos/Guia Salida/PDF/PDFGuiaSalida.tsx'))


const ListaInventarios = lazy(() => import('../pages/Bodegas/Inventario/TablaInventarios.tsx'))
const DetalleInventario = lazy(() => import('../pages/Bodegas/Inventario/DetalleInventario.tsx'))
const PDFResumidoInventario = lazy(() => import('../pages/Bodegas/Inventario/PDF/PDFResumidoInventario.tsx'))
const PDFDetalladoInventario = lazy(() => import('../pages/Bodegas/Inventario/PDF/PDFDetalladoInventario.tsx'))


// EMBALAJE
const ListaEmbalaje = lazy(() => import('../pages/Embalaje/TablaProgramasEmbalaje.tsx'));
const RegistroProgramaEmbalaje = lazy(() => import('../pages/Embalaje/Formularios/Formulario Registro Bin Embalaje/RegistroBinAEmbalaje.tsx'));
const DetalleEmbalaje = lazy(() => import('../pages/Embalaje/Detalles/DashboardEmbalaje.tsx'));
const ListaTiposEmbalaje = lazy(() => import('../pages/Embalaje/TablaTiposEmbajales.tsx'));
const ListaEtiquetas = lazy(() => import('../pages/Embalaje/TablaEtiquetados.tsx'));
const PDFEntradaEmbalaje = lazy(() => import('../pages/Embalaje/PDF/PDFDocumentoEntradaEmbalaje.tsx'));
const PDFInformeEmbalaje = lazy(() => import('../pages/Embalaje/PDF/PDFInformeEmbalaje.tsx'));
const PDFSalidaEmbalaje = lazy(() => import('../pages/Embalaje/PDF/PDFDocumentoSalidaEmbalaje.tsx'));
const PDFInformeKilosXOperarioEmbalaje = lazy(() => import('../pages/Embalaje/PDF/PDFInformeKilosXOperario.tsx'));
const PDFInformeOperarioResumidoEmbalaje = lazy(() => import('../pages/Embalaje/PDF/PDFInformeOperarioResumido.tsx'));

const contentRoutes: RouteProps[] = [
	{ path: authPages.loginPage.to, element: <LoginPage /> },

	// Productores
	{ path: appPages.registroAppPages.subPages.productores.to, element: <ListaProductores /> },
	// Operarios
	{ path: appPages.registroAppPages.subPages.operarios.to, element: <ListaOperarios /> },
	// Conductores
	{ path: appPages.registroAppPages.subPages.conductores.to, element: <ListaConductores />},
	// Camiones
	{ path: appPages.registroAppPages.subPages.camiones.to, element: <ListaCamiones />},
	// Comercializadores
	{ path: appPages.registroAppPages.subPages.comercializadores.to, element: <ListaComercializadores />},
	// Clientes
	{ path: appPages.registroAppPages.subPages.clientes.to, element: <ListaClientes />},



	// RecepcionMp
	// Guia Recepcion
	{ path: appPages.recepcionAppPages.subPages.recepcionMp.to, element: <ListaGuiaRecepcion />},
	{ path: appPages.recepcionAppPages.subPages.detalle_recepcionMp.to, element: <DetalleGuiaRecepcion />},
	{ path: appPages.recepcionAppPages.subPages.registro_recepcionMp.to, element: <RegistroGuiaRecepcion />},
	{ path: appPages.recepcionAppPages.subPages.recepcionMp.to, element: <ListaGuiaRecepcion />},
	{ path: appPages.recepcionAppPages.subPages.envases.to, element: <ListaEnvases /> },
	{ path: appPages.recepcionAppPages.subPages.pdf_guia_recepcionMp.to, element: <PDFGuiaRecepcion /> },
	// { path: '/app/registro-guia-recepcion', element: <RegistroGuiaRecepcion /> },
	// { path: '/app/edicion-guia-recepcion/:id', element: <EdicionGuiaRecepcion /> },
	// { path: '/app/pdf-guia-recepcion/:id', element: <PDFGuiaRecepcion /> },
	// { path: '/app/recepcionmp/:id', element: <DetalleGuiaRecepcion /> },


	// Registro Guia Recepcion

	// Detalle Guia Recepcion



	// Control Calidad
	// Lista Control Calidad
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.controlCalidad.to, element: <ListaControlCalidad />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.detalle_control_calidad.to, element: <DetalleControlCalidad />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.control_calidad_vb.to, element: <ListaControlCalidadVistoBueno />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.detalle_control_calidad_vb.to, element: <DetalleVBControlCalidad />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.proyeccion.to, element: <ProyeccionDeFRuta />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.pdf_control_calidad_vb.to, element: <PDFRendimiento />},
	{ path: appPages.controles_calidad.subPages.recepcion.subPages.detalle_muestra_controlCalidad.to, element: <DetalleControlCalidadPepa />},
	// Lista Control Calidad Tarja Resultante
	{ path: appPages.controles_calidad.subPages.produccion.subPages.cc_tarja_produccion.to, element: <ListaControlCalidadTarjaResultante />},
	{ path: appPages.controles_calidad.subPages.produccion.subPages.detalle_cc_tarja_produccion.to, element: <DetalleControlCalidadTarjaResultante />},
	// Lista Control Calidad Tarja Resultante Reproceso
	{ path: appPages.controles_calidad.subPages.produccion.subPages.cc_tarja_reproceso.to, element: <ListaControlCalidadTarjaResultanteReproceso />},
	{ path: appPages.controles_calidad.subPages.produccion.subPages.detalle_tarja_reproceso.to, element: <DetalleControlCalidadTarjaResultanteReproceso />},
	// Lista Control Calidad Tarja Seleccionada
	{ path: appPages.controles_calidad.subPages.seleccion.subPages.cc_tarja_seleccion.to, element: <ListaControlCalidadTarjaSeleccionada />},
	{ path: appPages.controles_calidad.subPages.seleccion.subPages.detalle_cc_tarja_seleccion.to, element: <DetalleControlCalidadTarjaSeleccionada	 />},
	// Lista Control Calidad Tarja Seleccionada
	{ path: appPages.controles_calidad.subPages.planta_harina.subPages.cc_planta_harina.to, element: <ListaControlCalidadTBinResultante />},
	// { path: appPages.controles_calidad.subPages.planta_harina.subPages.cc_detalle_planta_harina.to, element: <DetalleControlCalidadTBinResultante	 />},
	// Lista Control Calidad Tarja Seleccionada
	{ path: appPages.controles_calidad.subPages.planta_harina.subPages.cc_proceso_planta_harina.to, element: <ListaControlCalidadTBinResultanteProceso />},
	// { path: appPages.controles_calidad.subPages.planta_harina.subPages.cc_detalle_proceso_planta_harina.to, element: <DetalleControlCalidadTBinResultanteProceso	 />},


	// PRODUCCION
	{ path: appPages.produccion.subPages.p_produccion.to, element:  <ListaProgramas /> },
	{ path: appPages.produccion.subPages.p_produccion.subPages.registro_p_produccion.to, element:  <FormularioRegistroPrograma /> },
	{ path: appPages.produccion.subPages.p_produccion.subPages.detalle_p_produccion.to, element: <DetallePrograma />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.control_rendimiento_p_produccion.to, element: <DetalleControlRendimiento />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_pre_limpia_p_produccion.to, element: <PDFPreLimpia />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_despelonada_p_produccion.to, element: <PDFDescascarado />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_informe_kilos_operario_produccion.to, element: <PDFOperarioXKilo />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_informe_kilos_operario_resumido_p_produccion.to, element: <PDFResumidoOperario />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_detalle_envase_p_produccion.to, element: <PDFDetalleEnvases />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdf_doc_entrada_p_produccion.to, element: <PDFDocumentoEntrada />},
	{ path: appPages.produccion.subPages.p_produccion.subPages.pdfDocumentoSalida.to, element: <PDFDocumentoSalidaProduccion />},


	// REPROCESO
	{ path: appPages.produccion.subPages.reproceso.to, element:  <ListaProgramasReproceso /> },
	{ path: appPages.produccion.subPages.registro_reproceso.to, element:  <FormularioRegistroProgramaReproceso /> },
	{ path: appPages.produccion.subPages.detalle_reproceso.to, element:  <DetalleProgramaReproceso /> },
	{ path: appPages.produccion.subPages.pdf_documento_entrada_reproceso.to, element: <PDFDocumentoEntradaR />},
	{ path: appPages.produccion.subPages.pdf_documento_salida_reproceso.to, element: <PDFDocumentoSalida />},
	{ path: appPages.produccion.subPages.pdf_detalle_operarios.to, element: <PDFDetalleOperarioReproceso />},
	{ path: appPages.produccion.subPages.pdf_informe_reprocesos.to, element: <PDFInformeProgramasReproceso />},

	// SELECCION
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.to, element: <ListaProgramaSeleccion />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.registro_seleccion.to, element: <RegistroProgramaSeleccion />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.detalle_seleccion.to, element: <DetalleProgramaSeleccion />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.detalle_proyeccion_seleccion.to, element: <DetalleControlRendimientoSeleccion />},


	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.pdf_informe_detalle_envases.to, element: <PDFInformeEntradaSeleccion />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.pdf_informe_detalle_salida.to, element: <PDFInformeSalidaSeleccion />},

	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.pdf_informe_seleccion.to, element: <PDFInformeSeleccion />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.pdf_informe_kilos_x_operario.to, element: <PDFInformeKilosXOperario />},
	{ path: appPages.produccion.subPages.seleccion.subPages.programa_seleccion.subPages.pdf_informe_operario_resumido.to, element: <PDFInformeXOperarioResumido />},

				// Subproductos
	{ path: appPages.produccion.subPages.seleccion.subPages.bins_subproducto.to, element: <ListaSubProductos />},
	{ path: appPages.produccion.subPages.seleccion.subPages.bins_subproducto.subPages.registro_subproducto.to, element: <RegistroSubProductos />},

	{ path: appPages.produccion.subPages.seleccion.subPages.bins_subproducto_lista.to, element: <ListaBinSubProductos />},
	{ path: appPages.produccion.subPages.seleccion.subPages.bins_subproducto.subPages.detalle_bin_subproducto.to, element:  <DetalleBinSubProducto /> },
	// Resultados


	// PEDIDOS
	{ path: appPages.ventas.subPages.pedidos.to, element:  <ListaPedidos /> },
	{ path: appPages.ventas.subPages.pedidos.subPages.detalle_pedido_interno.to, element:  <DetallePedidoMercadoInterno /> },
	{ path: appPages.ventas.subPages.pedidos.subPages.pdf_pedido_interno.to, element:  <PDFPedidoInterno /> },



	{ path: appPages.ventas.subPages.pedidos.subPages.detalle_pedido_exportacion.to, element:  <DetallePedidoExportacion /> },
	{ path: appPages.ventas.subPages.pedidos.subPages.pdf_pedido_exportacion.to, element:  <PDFPedidoExportacion /> },

	
	{ path: appPages.ventas.subPages.pedidos.subPages.guia_salida.subPages.detalle_guia_salida.to, element:  <DetalleGuiaSalida /> },
	{ path: appPages.ventas.subPages.pedidos.subPages.guia_salida.subPages.pdf_guia.to, element:  <PDFGuiaSalida /> },
	{ path: appPages.ventas.subPages.pedidos.subPages.detalle_pedido.to, element: <DetallePedido />},


	






	// EMBALAJE
	{ path: appPages.embalaje.subPages.programas_embalaje.to, element:  <ListaEmbalaje /> },
	{ path: appPages.embalaje.subPages.registro_programa_embalaje.to, element: <RegistroProgramaEmbalaje />},
	{ path: appPages.embalaje.subPages.detalle_programa_embalaje.to, element: <DetalleEmbalaje />},
	{ path: appPages.embalaje.subPages.tipo_embalajes.to, element: <ListaTiposEmbalaje />},
	{ path: appPages.embalaje.subPages.etiquetados.to, element: <ListaEtiquetas />},
	{ path: appPages.embalaje.subPages.pdf_entrada_embalaje.to, element: <PDFEntradaEmbalaje />},
	{ path: appPages.embalaje.subPages.pdf_salida_embalaje.to, element: <PDFSalidaEmbalaje />},
	{path: appPages.embalaje.subPages.pdf_informe_embalaje.to, element: <PDFInformeEmbalaje />},
	{path: appPages.embalaje.subPages.pdf_informe_kilos_x_operario.to, element: <PDFInformeKilosXOperarioEmbalaje />},
	{path: appPages.embalaje.subPages.pdf_informe_operario_resumido.to, element: <PDFInformeOperarioResumidoEmbalaje />},





	// PLANTA HARINA
	{ path: appPages.planta_harina.subPages.programas_planta_harina.to, element: <ListaProgramaPlantaHarina />},
	{ path: appPages.planta_harina.subPages.programas_planta_harina.subPages.registro_planta_harina.to, element: <RegistroBinPlantaHarina />},
	{ path: appPages.planta_harina.subPages.programas_planta_harina.subPages.programa_planta_harina.to, element: <DetalleProgramaPlantaHarina />},
	{ path: appPages.planta_harina.subPages.programas_planta_harina.subPages.pdf_documento_entrada.to, element: <PDFDocumentoEntradaPlantaHarina />},
	{ path: appPages.planta_harina.subPages.programas_planta_harina.subPages.pdf_documento_salida.to, element: <PDFDocumentoSalidaPlantaHarina />},
	{ path: appPages.planta_harina.subPages.programas_planta_harina.subPages.pdf_informe_kilos_x_operario.to, element: <PDFInformeKilosXOperarioPlantaHarina />},
	{path : appPages.planta_harina.subPages.programas_planta_harina.subPages.pdf_informe_operario_resumido.to, element: <PDFInformeOperarioResumidoPlantaHarina/>},
	{path : appPages.planta_harina.subPages.programas_planta_harina.subPages.pdf_informe_programa.to, element: <PDFInformeProgramaPHarina/>},
	{ path: appPages.planta_harina.subPages.procesos_planta_harina.to, element: <ListaProcesoPlantaHarina />},
	{ path: appPages.planta_harina.subPages.procesos_planta_harina.subPages.registro_planta_harina.to, element: <RegistroBinProcesoPlantaHarina />},
	{ path: appPages.planta_harina.subPages.procesos_planta_harina.subPages.proceso_planta_harina.to, element: <DetalleProcesoPlantaHarina />},
	{ path: appPages.planta_harina.subPages.procesos_planta_harina.subPages.pdf_documento_entrada.to, element: <PDFDocumentoEntradaProcesoPlantaHarina />},
	{ path: appPages.planta_harina.subPages.procesos_planta_harina.subPages.pdf_documento_salida.to, element: <PDFDocumentoSalidaProcesoPlantaHarina />},	
	{path: appPages.planta_harina.subPages.procesos_planta_harina.subPages.pdf_informe_kilos_x_operario.to, element: <PDFInformeKilosXOperarioProcesoHarina />},
	{path : appPages.planta_harina.subPages.procesos_planta_harina.subPages.pdf_informe_operario_resumido.to, element: <PDFInformeOperarioResumidoProcesoHarina/>},
	{path : appPages.planta_harina.subPages.procesos_planta_harina.subPages.pdf_informe_proceso.to, element: <PDFInformeProgramaProcesoHarina/>},





	// { path: '/prueba-calendario/', element: <MyComponent />},


	// BODEGAS
	{ path: appPages.bodega.subPages.lotes.to, element:  <ListaPatioTechadoExterior /> },
	{ path: appPages.bodega.subPages.detalle_lotes.to, element:  <DetallePatioTechadoExterior /> },
	{ path: appPages.produccion.subPages.p_produccion.subPages.control_rendimiento_p_produccion.to, element: <DetalleControlRendimientoSeleccion />},
	{ path: appPages.bodega.subPages.pallets_producto_terminado.to, element: <ListaPalletsProductoTerminado />},

	
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g1.to, element:  <ListaBodegaG1 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.pdf_bodegas.to, element:  <PDF_Bodegas /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g2.to, element:  <ListaBodegaG2 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g3.to, element:  <ListaBodegaG3 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g4.to, element:  <ListaBodegaG4 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g5.to, element:  <ListaBodegaG5 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g6.to, element:  <ListaBodegaG6 /> },
	{ path: appPages.bodega.subPages.bodegas.subPages.bodega_g7.to, element:  <ListaBodegaG7 /> },

	

		//Agrupacion de bines
	{ path: appPages.bodega.subPages.acciones.subPages.agrupacion_bin.to, element:  <ListaBinAgrupado /> },
	{ path: appPages.bodega.subPages.acciones.subPages.agrupacion_bin.subPages.registro_agrupacion.to, element:  <RegistroBinAgrupacion /> },
	{ path: appPages.bodega.subPages.acciones.subPages.agrupacion_bin.subPages.detalle_agrupacion.to, element:  <DetalleBinsAgrupados /> },

	
	{ path: appPages.bodega.subPages.acciones.subPages.inventario_bodega.to, element:  <ListaInventarios /> },
	{ path: appPages.bodega.subPages.acciones.subPages.inventario_bodega.subPages.detalle_inventario.to ,element:  <DetalleInventario /> },
	{ path: appPages.bodega.subPages.acciones.subPages.inventario_bodega.subPages.PDFResumidoInventario.to, element: <PDFResumidoInventario />},
	{ path: appPages.bodega.subPages.acciones.subPages.inventario_bodega.subPages.PDFDetalladoInventario.to, element: <PDFDetalladoInventario />},

	// add routs for comercializadores
	{path: appPages.comercializadores.subPages.proyeccion.to, element: <ProyeccionDeFRuta />},
	{path: appPages.comercializadores.subPages.resultados.to, element: <Resultados />},
	{path : appPages.comercializadores.subPages.stocks.to, element: <Stocks />},
	

	// {path: '/pruebas', element: <Prueba />},

	{ path: authPages.profilePage.to, element: <ProfilePage /> },
	{ path: appPages.mainAppPages.to, element: <DashboardHome /> },
	{ path: '*', element: <NotFoundPage /> },
];

export default contentRoutes;

