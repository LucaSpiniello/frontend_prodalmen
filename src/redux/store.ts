import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import productoresSlice from './slices/productoresSlice';
import operarioSlice from './slices/operarioSlice';
import conductoresSlice from './slices/conductoresSlice';
import camionesSlice from './slices/camionesSlice';
import ComercializadoresSlice from './slices/comercializadores';
import GuiaRecepcion from './slices/recepcionmp';
import EnvasesMpSlice from './slices/envasesSlice';
import ProduccionSlice from './slices/produccionSlice';
import BodegasSlice from './slices/bodegaSlice';
import ControlCalidad from './slices/controlcalidadSlice';
import SeleccionSlice from './slices/seleccionSlice';
import ReprocesoSlice from './slices/reprocesoSlice';
import ClientesSlice from './slices/clientes';
import CoreSlice from './slices/registrosbaseSlice';
import pedidosSlices from './slices/pedidoSlice';
import embalajeSlice from './slices/embalajeSlice';
import guiaSalidaSlice from './slices/guiaSalidaSlice';
import plantaHarinaSlices from './slices/plantaHarinaSlice';
import procesoPlantaHarinaSlice from './slices/procesoPlantaHarina';

const store = configureStore({
  reducer: {
    auth: authSlice,
    core: CoreSlice,
    clientes: ClientesSlice,
    productores: productoresSlice,
    operarios: operarioSlice,
    conductores: conductoresSlice,
    camiones: camionesSlice,
    comercializadores: ComercializadoresSlice,
    recepcionmp: GuiaRecepcion,
    envasesmp: EnvasesMpSlice,
    programa_produccion: ProduccionSlice,
    bodegas: BodegasSlice,
    control_calidad: ControlCalidad,
    seleccion: SeleccionSlice,
    reproceso: ReprocesoSlice,
    pedidos: pedidosSlices,
    embalaje: embalajeSlice,
    guia_salida: guiaSalidaSlice,
    planta_harina: plantaHarinaSlices,
    proceso_planta_harina: procesoPlantaHarinaSlice
  },
  middleware: (getDefaultMiddleware : any) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});

export default store;
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
