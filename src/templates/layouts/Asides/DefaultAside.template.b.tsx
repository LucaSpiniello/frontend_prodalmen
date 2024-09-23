import Aside, { AsideBody, AsideFooter, AsideHead } from '../../../components/layouts/Aside/Aside';
import LogoAndAsideTogglePart from './_parts/LogoAndAsideToggle.part';
import DarkModeSwitcherPart from './_parts/DarkModeSwitcher.part';
import { appPages } from '../../../config/pages.config';
import Nav, {
	NavCollapse,
	NavItem,
	NavSeparator,
	NavTitle,
} from '../../../components/layouts/Navigation/Nav';
import UserTemplate from '../User/User.template';
import { useAppSelector } from '../../../redux/hooks';
import { RootState } from '../../../redux/store';
import { useWindowSize } from 'react-use';

const DefaultAsideTemplate = () => {
	const userGroup = useAppSelector((state: RootState) => state.auth.grupos);

	const hasGroup = (groups: any) => userGroup?.groups && groups.some((group: any) => group in userGroup.groups)
	const size = useWindowSize()

	return (
		<Aside>
			<AsideHead>
				<LogoAndAsideTogglePart to={appPages.mainAppPages.to} />
			</AsideHead>
			<AsideBody>
				<Nav>
					<NavTitle>Accesos</NavTitle>
					{ !hasGroup(['comercializador']) || hasGroup(['dnandres']) && (
							<NavCollapse
							text={appPages.registroAppPages.text}
							to={appPages.registroAppPages.to}
							icon={appPages.registroAppPages.icon}
						>
							<NavItem {...appPages.registroAppPages.subPages.clientes} />
							<NavItem {...appPages.registroAppPages.subPages.productores} />
							<NavItem {...appPages.registroAppPages.subPages.camiones} />
							<NavItem {...appPages.registroAppPages.subPages.conductores} />
							<NavItem {...appPages.registroAppPages.subPages.comercializadores} />
							<NavItem {...appPages.registroAppPages.subPages.operarios} />
						</NavCollapse>
					)
				}

					{(hasGroup(['controlcalidad', 'bodega', 'recepcion-mp', 'jefe-planta']) && !hasGroup(['comercializador']) || hasGroup(['dnandres'])) && (
						<NavCollapse
							text={appPages.recepcionAppPages.text}
							to={appPages.recepcionAppPages.to}
							icon={appPages.recepcionAppPages.icon}
						>
							<NavItem {...appPages.recepcionAppPages.subPages.recepcionMp} />
							<NavItem {...appPages.recepcionAppPages.subPages.envases} />
						</NavCollapse>
					)}

					{(hasGroup(['controlcalidad', 'bodega', 'jefe-planta']) && !hasGroup(['comercializador']) || hasGroup(['dnandres'])) && (
						<NavCollapse
							text={appPages.controles_calidad.text}
							to={appPages.controles_calidad.to}
							icon={appPages.controles_calidad.icon}
						>
							<NavCollapse
								text={appPages.controles_calidad.subPages.recepcion.text}
								to={appPages.controles_calidad.subPages.recepcion.to}
								icon={appPages.controles_calidad.icon}
							>
								<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.controlCalidad} />
								<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.control_calidad_vb} />
								<NavItem {...appPages.controles_calidad.subPages.recepcion.subPages.proyeccion} />
							</NavCollapse>
							<NavCollapse
								text={appPages.controles_calidad.subPages.produccion.text}
								to={appPages.controles_calidad.subPages.produccion.to}
								icon={appPages.controles_calidad.icon}
							>
								<NavItem {...appPages.controles_calidad.subPages.produccion.subPages.cc_tarja_produccion} />
								<NavItem {...appPages.controles_calidad.subPages.produccion.subPages.cc_tarja_reproceso} />
							</NavCollapse>
							<NavCollapse
								text={appPages.controles_calidad.subPages.seleccion.text}
								to={appPages.controles_calidad.subPages.seleccion.to}
								icon={appPages.controles_calidad.icon}
							>
								<NavItem {...appPages.controles_calidad.subPages.seleccion.subPages.cc_tarja_seleccion} />
							</NavCollapse>

							<NavCollapse
								text={appPages.controles_calidad.subPages.planta_harina.text}
								to={appPages.controles_calidad.subPages.planta_harina.to}
								icon={appPages.controles_calidad.icon}
							>
								<NavItem {...appPages.controles_calidad.subPages.planta_harina.subPages.cc_planta_harina} />
								<NavItem {...appPages.controles_calidad.subPages.planta_harina.subPages.cc_proceso_planta_harina} />
							</NavCollapse>
						</NavCollapse>
					)}

					{hasGroup(['jefe-planta', 'dnandres', 'produccion', 'produccion-jefatura', 'pesaje', 'seleccion', 'seleccion-jefatura']) && (
						<NavCollapse
							text={appPages.produccion.text}
							to={appPages.produccion.to}
							icon={appPages.produccion.icon}
						>
							{hasGroup(['jefe-planta', 'dnandres', 'produccion', 'produccion-jefatura', 'pesaje']) && (
								<>
									<NavItem {...appPages.produccion.subPages.p_produccion} />
									<NavItem {...appPages.produccion.subPages.reproceso} />
								</>
							)}
							{hasGroup(['jefe-planta', 'seleccion', 'seleccion-jefatura', 'dnandres']) && (
								<NavCollapse
									text={appPages.produccion.subPages.seleccion.text}
									to={appPages.produccion.subPages.seleccion.to}
									icon={appPages.produccion.subPages.seleccion.icon}
								>
									<NavItem {...appPages.produccion.subPages.seleccion.subPages.programa_seleccion} />
									<NavItem {...appPages.produccion.subPages.seleccion.subPages.bins_subproducto} />
									<NavItem {...appPages.produccion.subPages.seleccion.subPages.bins_subproducto_lista} />
								</NavCollapse>
							)}
						</NavCollapse>
					)}

					{hasGroup(['bodega', 'dnandres', 'jefe-planta', 'bodega-jefatura', 'produccion-jefatura']) && (
						<NavCollapse
							text={appPages.bodega.text}
							to={appPages.bodega.to}
							icon={appPages.bodega.icon}
						>
							<NavItem {...appPages.bodega.subPages.lotes} />
							<NavItem {...appPages.bodega.subPages.pallets_producto_terminado} />
							
							<NavCollapse
								text={appPages.bodega.subPages.bodegas.text}
								to={appPages.bodega.subPages.bodegas.to}
								icon={appPages.bodega.subPages.bodegas.icon}
							>
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g1} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g2} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g3} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g4} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g5} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g6} />
								<NavItem {...appPages.bodega.subPages.bodegas.subPages.bodega_g7} />
							</NavCollapse>
							<NavCollapse
								text={appPages.bodega.subPages.acciones.text}
								to={appPages.bodega.subPages.acciones.to}
								icon={appPages.produccion.icon}
							>
								<NavItem {...appPages.bodega.subPages.acciones.subPages.agrupacion_bin} />
								<NavItem {...appPages.bodega.subPages.acciones.subPages.fumigacion} />
 								<NavItem {...appPages.bodega.subPages.acciones.subPages.inventario_bodega} />
										
							</NavCollapse>
						</NavCollapse>
					)}

					{hasGroup(['bodega', 'dnandres', 'jefe-planta', 'bodega-jefatura', 'produccion-jefatura'])
						? (
								<NavCollapse
									text={appPages.ventas.text}
									to={appPages.ventas.to}
									icon={appPages.ventas.icon}
								>
									<NavItem {...appPages.ventas.subPages.pedidos} />
								</NavCollapse>
							)
						: null
					}

					{hasGroup(['bodega', 'dnandres', 'jefe-planta', 'bode	ga-jefatura', 'produccion-jefatura'])
						? (
								<NavCollapse
									text={appPages.embalaje.text}
									to={appPages.embalaje.to}
									icon={appPages.embalaje.icon}
								>
									<NavItem {...appPages.embalaje.subPages.programas_embalaje} />
									<NavItem {...appPages.embalaje.subPages.tipo_embalajes} />
									<NavItem {...appPages.embalaje.subPages.etiquetados} />
								</NavCollapse>
							)
						: null
					}

					{
					hasGroup(['bodega', 'dnandres', 'jefe-planta', 'bode	ga-jefatura', 'produccion-jefatura'])
						? (
								<NavCollapse
									text={appPages.planta_harina.text}
									to={appPages.planta_harina.to}
									icon={appPages.planta_harina.icon}
								>
									<NavItem {...appPages.planta_harina.subPages.programas_planta_harina} />
									<NavItem {...appPages.planta_harina.subPages.procesos_planta_harina} />
								</NavCollapse>
							)
						: null
					}

					{hasGroup(['comercializador'])
					? (
						<NavCollapse
							text={appPages.comercializadores.text}
							to={appPages.comercializadores.to}
							icon={appPages.comercializadores.icon}
							>
							<NavItem {...appPages.comercializadores.subPages.proyeccion} />
							<NavItem {...appPages.comercializadores.subPages.resultados} />
							</NavCollapse> )
							: null
					}
				</Nav>
			</AsideBody>
			<AsideFooter>
				<Nav>
					<UserTemplate />
					<DarkModeSwitcherPart />
				</Nav>
			</AsideFooter>
		</Aside>
	);
};

export default DefaultAsideTemplate;
