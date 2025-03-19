import React, { useEffect, useState, useMemo } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    ColumnDef,
} from "@tanstack/react-table";
import Container from "../../../components/layouts/Container/Container";
import PageWrapper from "../../../components/layouts/PageWrapper/PageWrapper";
import Subheader, {
    SubheaderLeft,
} from "../../../components/layouts/Subheader/Subheader";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { useAuth } from "../../../context/authContext";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { fetchAllPedidos } from "../../../redux/slices/pedidoSlice";
import { fetchSeleccionesByComercializador } from "../../../redux/slices/seleccionSlice";
import { fetchAllCC } from "../../../redux/slices/controlcalidadSlice";
import Card, { CardBody, CardHeader, CardHeaderChild, CardTitle } from "../../../components/ui/Card";
import TableTemplate, { TableCardFooterTemplate, TableColumn } from "../../../templates/common/TableParts.template";
import SelectReact from "../../../components/form/SelectReact";
// Definir tipos para los datos
type Proyeccion = {
    variedad: string;
    calibre: string;
    kilos_exportables: number;
};

type Seleccion = {
    variedad: string;
    calibre: string;
    calidad: string;
    fruta_resultante: number;
};

type FilaTabla = {
    [key: string]: string | number; // Las claves dinámicas pueden ser calibres o "variedad"
};

const DetalleProyeccion = () => {
    const proyecciones = useAppSelector((state: RootState) => state.control_calidad.allcc as Proyeccion[]);
    const allpedidos = useAppSelector((state: RootState) => state.pedidos.allpedidos);
    const seleccion = useAppSelector((state: RootState) => state.seleccion.bins_pepas_calibradas_per_comercializador);

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const { verificarToken } = useAuth();
    const token = useAppSelector((state: RootState) => state.auth.authTokens);
    const comercializador = useAppSelector((state: RootState) => state.auth.dataUser?.comercializador);

    // Estados para los filtros
    const [calidadSeleccionada, setCalidadSeleccionada] = useState<string>("");

    // Datos para las tablas
    const [datosProyectados, setDatosProyectados] = useState<FilaTabla[]>([]);
    const [datosSeleccionados, setDatosSeleccionados] = useState<FilaTabla[]>([]);

    // Listas de opciones
    const variedades = [
        "Solano", "Mono", "Carmel", "Ruby", "Price", "Wood Colony", "Tokio", "Merced",
        "Tuca", "Nonpareil", "Sin Especificar", "Padre", "Texas", "Marcona", "Guara",
        "Desmayo", "Ixl", "Thompson", "Drake", "Vesta", "Neplus", "Fritz", "Butte",
        "Mission", "Neplus", "Tipo California", "Mezcla", "Independence", "Avijar",
        "Isabelona", "Soleta", "Vialfas", "Suma"
    ];

    const calibres = [
        "18/20", "20/22", "23/25", "25/27", "27/30", "30/32", "32/34", "34/36", "36/40", "40/mas", "Suma"
    ];

    const calidades = [
        "Sin Calidad", "Extra N°1", "Supreme", "Whole & Broken"
    ];

    // Efecto para cargar los datos iniciales
    useEffect(() => {
        if (comercializador) {
            dispatch(fetchAllCC({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
            dispatch(fetchSeleccionesByComercializador({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
            dispatch(fetchAllPedidos({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
        }
    }, [comercializador]);

    useEffect(() => {
        if (comercializador) {
            dispatch(fetchAllCC({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
            dispatch(fetchSeleccionesByComercializador({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
            dispatch(fetchAllPedidos({ params: { search: `?comercializador=${comercializador}` }, token, verificar_token: verificarToken }));
        }
    }, [comercializador]);

    // Procesar datos proyectados
    useEffect(() => {
        if (proyecciones && seleccion) {
            const datos = variedades.map((variedad) => {
                const fila: FilaTabla = { variedad };
                calibres.forEach((calibre) => {
                    const proyeccion = proyecciones.find((p) => p.variedad === variedad && p.calibre === calibre);
                    const seleccionado = seleccion.find((s : any) => s.variedad === variedad && s.calibre === calibre);
                    const kilosProyectados = proyeccion ? proyeccion.kilos_exportables : 0;
                    const kilosSeleccionados = seleccionado ? seleccionado.fruta_resultante : 0;
                    fila[calibre] = (kilosProyectados - kilosSeleccionados).toFixed(2); // Restar seleccionada a proyectada
                });

                // Calcular la suma de los kilos proyectados por fila y aproximar al primer decimal
                fila["Suma"] = calibres.reduce((acc, calibre) => acc + Number(fila[calibre]), 0).toFixed(2);
                return fila;
            });
            // Calcular la suma de los kilos proyectados por columna y aproximar al primer decimal
            const sumas: FilaTabla = { variedad: "Suma" };
            calibres.forEach((calibre) => {
                sumas[calibre] = datos.reduce((acc, fila) => acc + Number(fila[calibre]), 0).toFixed(2);
            });
            datos.push(sumas);
            // iterar sobre la lista y hacer separacion de miles en cada dato
            datos.forEach((dato) => {
                for (const key in dato) {
                    if (key !== "variedad") {
                        dato[key] = dato[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    }
                }
            });
            setDatosProyectados(datos);
        }
    }, [proyecciones, seleccion]);

    // Procesar datos seleccionados
    useEffect(() => {
        if (seleccion && calidadSeleccionada && allpedidos) {
            const datos = variedades.map((variedad) => {
                const fila: FilaTabla = { variedad };
                calibres.forEach((calibre : any) => {
                    const seleccionado = seleccion.find((s : any) => s.variedad === variedad && s.calibre === calibre && s.calidad === calidadSeleccionada);
                    const pedido : any = allpedidos.find((p : any) => p.variedad === variedad && p.calibre === calibre && p.calidad === calidadSeleccionada);
                    const kilosSeleccionados = seleccionado ? seleccionado.fruta_resultante : 0;
                    const kilosVendidos = pedido ? pedido?.kilos_solicitados : 0;
                    fila[calibre] = (kilosSeleccionados - kilosVendidos).toFixed(2); // Restar vendida a seleccionada
                    // Calcular la suma de los kilos seleccionados por fila y aproximar al primer decimal
                    fila["Suma"] = calibres.reduce((acc, calibre) => acc + Number(fila[calibre]), 0).toFixed(2);
                });
                return fila;
            });
            const sumas: FilaTabla = { variedad: "Suma" };
            calibres.forEach((calibre) => {
                sumas[calibre] = datos.reduce((acc, fila) => acc + Number(fila[calibre]), 0).toFixed(2);
            });
            datos.push(sumas);
            datos.forEach((dato) => {
                for (const key in dato) {
                    if (key !== "variedad") {
                        dato[key] = dato[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    }
                }
            });

            setDatosSeleccionados(datos);
        }
    }, [seleccion, calidadSeleccionada, allpedidos]);

    // Configuración de las columnas para fruta proyectada
    const columnasProyectadas = useMemo<ColumnDef<FilaTabla>[]>(
        () => [
            {
                header: "Variedad",
                accessorKey: "variedad",
            },
            ...calibres.map((calibre) => ({
                header: calibre,
                accessorKey: calibre,
            })),
        ],
        [calibres]
    );

    // Configuración de las columnas para fruta seleccionada
    const columnasSeleccionadas = useMemo<ColumnDef<FilaTabla>[]>(
        () => [
            {
                header: "Variedad",
                accessorKey: "variedad",
            },
            ...calibres.map((calibre) => ({
                header: calibre,
                accessorKey: calibre,
            })),
        ],
        [calibres]
    );

    // Tabla de fruta proyectada
    const tablaProyectada = useReactTable({
        data: datosProyectados,
        columns: columnasProyectadas,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 9 },
        },
    });

    // Tabla de fruta seleccionada
    const tablaSeleccionada = useReactTable({
        data: datosSeleccionados,
        columns: columnasSeleccionadas,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: { pageSize: 9 },
        },
    });

    return (
        <PageWrapper name='Detalle Programa Producción'>
            <Subheader>
                <SubheaderLeft>
                    <h2>Detalle Stock Fruta</h2>
                </SubheaderLeft>
            </Subheader>

            <Container>
                <Card >
               < CardHeader>
                <CardTitle>Stock Real Fruta Proyectada</CardTitle>
                </CardHeader>
                
                <CardBody>
                    <TableTemplate className='table-fixed max-md:min-w-[50rem]' table={tablaProyectada} />
                </CardBody>
                <TableCardFooterTemplate table={tablaProyectada} />
                </Card>
            </Container>

            <Container>
            <Card >
                <CardHeader>
                <CardTitle>Stock Real Fruta Seleccionada</CardTitle>
                <CardTitle>{calidadSeleccionada}</CardTitle>
                <SelectReact
                    placeholder={calidadSeleccionada || 'Seleccione una calidad'}
                    name="calidad"
                    className='w-60 h-16 py-2'
                    value={calidadSeleccionada}
                    onChange={(e) => setCalidadSeleccionada(e.label)}
                    options={calidades.map((calidad) => ({ label: calidad, value: calidad }))}
                />
                </CardHeader>
                
                <CardBody className='h-full  overflow-x-auto'>
                    <TableTemplate className='table-fixed max-md:min-w-[70rem]' table={tablaSeleccionada} />
                </CardBody>
                <TableCardFooterTemplate table={tablaSeleccionada} />
                </Card>
            </Container>

            {/* Sección de Fruta Seleccionada */}

        </PageWrapper>
    );
};

export default DetalleProyeccion;