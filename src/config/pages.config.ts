export const examplePages = {
	examplesPage: {
		id: 'examplesPage',
		to: '/examples-page',
		text: 'Examples Page',
		icon: 'HeroBookOpen',
	},
	duotoneIconsPage: {
		id: 'duotoneIconsPage',
		to: '/duotone-icons',
		text: 'Duotone Icons',
		icon: 'HeroCubeTransparent',
	},
};

export const appPages = {
	mainAppPages: {
		id: 'main',
		to: '/home/dashboard',
		text: 'Dashboard',
	},
	registroAppPages: {
		id: 'registros',
		to: '/registros',
		text: 'Registros',
		icon: 'DuoWrite',
		subPages: {
			clientes: {
				id: 'clientes',
				to: '/registros/clientes/',
				text: 'Clientes',
				icon: 'DuoAddressBook2'
			},
			productores: {
				id: 'productores',
				to: '/registros/pdtor/',
				text: 'Productores',
				icon: 'DuoFlower1'
			},
			productor: {
				id: 'productores',
				to: '/registros/pdtor/:id',
				text: 'Productores',
				icon: 'DuoBriefcase'
			},
			camiones: {
				id: 'camiones',
				to: '/registros/camiones/',
				text: 'Camiones',
				icon: 'HeroTruck'
			},
			conductores: {
				id: 'conductores',
				to: '/registros/conductores/',
				text: 'Choferes',
				icon: 'DuoGroup'
			},
			comercializadores: {
				id: 'comercializadores',
				to: '/registros/comercializadores/',
				text: 'Comercializadores',
				icon: 'DuoBox2'
			},
			operarios: {
				id: 'operarios',
				to: '/registros/operarios/',
				text: 'Operarios',
				icon: 'DuoAddressCard'
			}
		}
	},
	recepcionAppPages: {
		id: 'recepcionmp',
		to: '/rmp',
		text: 'Materia Prima',
		icon: 'DuoFlower3',
		subPages: {
			recepcionMp: {
				id: 'recepcionmp',
				text: 'Recepcion MP',
				to: '/rmp/recepcionmp/',
				icon: 'DuoGithub',
			},
			registro_recepcionMp: {
				id: 'recepcionmp',
				to: '/rmp/registro-guia-recepcion/',
				icon: 'HeroListBullet',
			},
			detalle_recepcionMp: {
				id: 'recepcionmp',
				to: '/rmp/recepcionmp/:id',
				icon: 'HeroListBullet',
			},
			pdf_guia_recepcionMp: {
				id: 'recepcionmp',
				to: '/rmp/pdf-guia-recepcion/:id',
				icon: 'HeroListBullet',
			},
			edicion_recepcionMp: {
				id: 'recepcionmp',
				to: '/rmp/edicion-guia-recepcion/:id',
				icon: 'HeroListBullet',
			},
			envases: {
				id: 'envases',
				text: 'Envases MP',
				to: '/rmp/envases/',
				icon: 'DuoTwoBottles',
			}
		}
	},
	controles_calidad: {
		id: 'controles_calidad',
		to: '/cdc',
		text: 'Control de Calidad',
		icon: 'DuoLike',
		subPages: {
			recepcion: {
				id: 'cc_recepcionmp',
				text: 'CDC Recepcion MP',
				to: '/cdc/crmp',
				icon: 'DuoFlower3',
				subPages: {
					controlCalidad: {
						id: 'control_calidad',
						text: 'CDC Lotes Recepción',
						to: '/cdc/crmp/control-calidad/',
						icon: 'DuoFlower3',
					},
					detalle_control_calidad: {
						id: 'control_calidad',
						text: 'Ctrl Calidad',
						to: '/cdc/crmp/control-calidad/:id',
						icon: 'HeroArchiveBox',
					},
					detalle_muestra_controlCalidad: {
						id: 'control_calidad',
						text: 'Ctrl Calidad',
						to: '/cdc/crmp/control-calidad/:id/muestra/:id',
						icon: 'HeroArchiveBox',
					},
					control_calidad_vb: {
						id: 'vb_control_rendimiento',
						text: 'VB CDR Jefatura',
						to: '/cdc/crmp/vb_control/',
						icon: 'DuoLike',
					},
					detalle_control_calidad_vb: {
						id: 'vb_control_rendimiento',
						text: 'Detalle VB Control Rendimiento',
						to: '/cdc/crmp/vb_control/:id',
						icon: 'HeroArchiveBox',
					},
					pdf_control_calidad_vb: {
						id: 'vb_control_rendimiento',
						text: 'VB Control Rendimiento',
						to: '/cdc/crmp/pdf-rendimiento/:id',
						icon: 'HeroArchiveBox',
					},
					proyeccion: {
						id: 'proyeccion-fruta',
						text: 'Proyeccion Fruta',
						to: '/cdc/crmp/fruta-proyeccion/',
						icon: 'DuoChartPie',
					},
				}
			},
			produccion: {
				id: 'control_calidad_produccion',
				text: 'CDC Producción',
				to: '/cdc/cpro',
				icon: 'DuoBook',
				subPages: {
					cc_tarja_produccion: {
						id: 'cc_tarja_resultante_produccion',
						text: 'CDC Tarja Producción',
						icon: 'DuoUnion',
						to: '/cdc/cpro/tarjas-cc'
					},
					detalle_cc_tarja_produccion: {
						id: 'cc_tarja_resultante_produccion',
						text: 'Detalle CC Tarja Producción',
						icon: 'HeroArchiveBox',
						to: '/cdc/cpro/tarjas-cc/:id'
					},
					cc_tarja_reproceso: {
						id: 'cc_tarja_resultante_reproceso',
						text: 'CDC Tarja Reproceso',
						icon: 'DuoUnion',
						to: '/cdc/cpro/tarjas-cc-reproceso'
					},
					detalle_tarja_reproceso: {
						id: 'cc_tarja_resultante_reproceso',
						text: 'CC Tarja Reproceso',
						icon: 'HeroArchiveBox',
						to: '/cdc/cpro/tarjas-cc-reproceso/:id'
					}
				}
			},
			seleccion: {
				id: 'control_calidad_seleccion',
				text: 'CDC Selección',
				to: '/cdc/csel',
				icon: 'DuoBook',
				subPages: {
					cc_tarja_seleccion: {
						id: 'cc_tarja_seleccion',
						text: 'CDC Tarja Selección',
						icon: 'DuoUnion',
						to: '/cdc/csel/tarjas-cc-seleccion/'
					},
					detalle_cc_tarja_seleccion: {
						id: 'cc_tarja_seleccion',
						text: 'CC Tarja Selección',
						icon: 'HeroArchiveBox',
						to: '/cdc/csel/tarja-cc-seleccion/:id'
					}
				}
			},
			planta_harina: {
				id: 'control_calidad_planta_harina',
				text: 'CDC Planta Harina',
				to: '/cdc/cph',
				icon: 'DuoBook',
				subPages: {
					cc_planta_harina: {
						id: 'cc_planta_harina',
						text: 'CDC Programa PH',
						icon: 'DuoUnion',
						to: '/cdc/cph/cc_bin_resultante_planta_harina',
					},
					cc_detalle_planta_harina: {
						id: 'detalle_cc_planta_harina',
						text: 'CC Planta Harina',
						to: '/cdc/cph/cc_bin_resultante_planta_harina/:id',
					},
					cc_proceso_planta_harina: {
						id: 'cc_proceso_planta_harina',
						text: 'CDC Proceso PH',
						icon: 'DuoUnion',
						to: '/cdc/cph/cc_bin_resultante_proceso_planta_harina',
					},
					cc_detalle_proceso_planta_harina: {
						id: 'detalle_proceso_cc_planta_harina',
						text: 'CC Planta Harina',
						to: '/cdc/cph/cc_bin_resultante_proceso_planta_harina/:id',
					},

				}
			}
		}
	},
	produccion: {
		id: 'produccion',
		text: 'Producción',
		to: '/pro',
		icon: 'DuoExchange',
		subPages: {
			p_produccion: {
				id: 'programa',
				text: 'Programa Producción',
				to: '/pro/produccion',
				icon: 'DuoWood1',
				subPages: {
					control_rendimiento_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/proyeccion-rendimiento/:id',
						icon: 'DuoExchange',
					},
					detalle_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/programa/:id',
						icon: 'DuoExchange',
					},
					registro_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/registro-programa/:id',
						icon: 'DuoSettings',
					},
					pdf_doc_entrada_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-documento-entrada/:id',
						icon: 'HeroListBullet',
					},
					pdf_detalle_envase_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-detalle-envases/:id',
						icon: 'HeroListBullet',
					},
					pdf_pre_limpia_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-pre-limpia',
						icon: 'HeroListBullet',
					},
					pdf_despelonada_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-descascarado',
						icon: 'HeroListBullet',
					},
					pdf_informe_kilos_operario_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-operario-x-kilo',
						icon: 'HeroListBullet',
					},
					pdf_informe_kilos_operario_resumido_p_produccion: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-operario-resumido',
						icon: 'HeroListBullet',
					},
					pdfDocumentoSalida: {
						id: 'programa',
						text: 'Programa Producción',
						to: '/pro/produccion/pdf-produccion-salida/:id',
						icon: 'HeroListBullet',
					},
				}
			},
			reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/pro/reproceso',
				icon: 'DuoRepeat',
			},
			registro_reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/pro/reproceso/registro-programa/:id',
				icon: 'HeroListBullet',
			},
			detalle_reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/pro/reproceso/programa/:id',
				icon: 'HeroListBullet',
			},
			pdf_documento_entrada_reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/pro/reproceso/pdf-documento-entrada/:id',
				icon: 'HeroListBullet',
			},
			pdf_documento_salida_reproceso: {
				id: 'reproceso',
				text: 'Programa Reproceso',
				to: '/pro/reproceso/pdf-documento-salida/:id',
				icon: 'HeroListBullet',
			},
			pdf_informe_reprocesos: {
				id: 'pdf_informe_reprocesos',
				text: 'Programa Informe Reprocesos',
				to: '/pro/reproceso/pdf-informe-reproceso',
			},
			pdf_detalle_operarios: {
				id: 'pdf_detalle_operario',
				text: 'PDF Operario Detalle',
				to:'/pro/reproceso/pdf-operario-resumido',
			},
			seleccion: {
				id: 'seleccion',
				text: 'Programa Selección',
				to: '/pro/seleccion',
				icon: 'DuoSelect',
				subPages: {
					programa_seleccion: {
						id: 'proceso_seleccion',
						text: 'Programas Selección',
						to: '/pro/seleccion/programa-seleccion',
						subPages: {
							registro_seleccion: {
								id: 'detalle_seleccion',
								text: 'Detalle Selección',
								to: '/pro/seleccion/programa-seleccion/registro-programa/:id'
							},
							detalle_seleccion: {
								id: 'detalle_seleccion',
								text: 'Detalle Selección',
								to: '/pro/seleccion/programa-seleccion/programa/:id'
							},
							detalle_proyeccion_seleccion: {
								id: 'detalle_seleccion',
								text: 'Detalle Selección',
								to: '/pro/seleccion/programa-seleccion/proyeccion-rendimiento-cc/:id'
							},
							pdf_informe_seleccion: {
								id: 'pdf_seleccion',
								text: 'PDF Selección',
								to: '/pro/seleccion/programa-seleccion/pdf-informe-seleccion/'
							},
							pdf_informe_kilos_x_operario: {
								id: 'pdf_seleccion',
								text: 'PDF Selección',
								to: '/pro/seleccion/programa-seleccion/pdf-kilos-x-operario/'
							},
							pdf_informe_operario_resumido: {
								id: 'pdf_seleccion',
								text: 'PDF Selección',
								to: '/pro/seleccion/programa-seleccion/pdf-informe-operario-resumido/'
							},
							pdf_informe_detalle_envases: {
								id: 'pdf_seleccion',
								text: 'PDF Selección',
								to: '/pro/seleccion/programa-seleccion/pdf-detalle-entrada-seleccion/:id'
							},
							pdf_informe_detalle_salida: {
								id: 'pdf_seleccion',
								text: 'PDF Selección',
								to: '/pro/seleccion/programa-seleccion/pdf-detalle-salida-seleccion/:id'
							}
						},
						icon: 'DuoSelect',
					},
					bins_subproducto_lista: {
						id: 'registro_subproduto',
						text: 'Bins de SubProducto',
						to: '/pro/seleccion/bins-subproductos/',
						icon: 'DuoLoader'
					},
					bins_subproducto: {
						id: 'bins_subproduto',
						text: 'SubProductos Selección',
						to: '/pro/seleccion/subproducto-seleccion',
						icon: 'DuoPuzzle',
						subPages: {
							registro_subproducto: {
								id: 'registro_subproduto',
								to: '/pro/seleccion/subproducto-seleccion/agrupacion-subproductos/:id',
							},
							detalle_bin_subproducto: {
								id: 'registro_subproduto',
								to: '/pro/seleccion/subproducto-seleccion/bin-subproducto-agrupado/:id',
							}
						}
					}
				}

			}
		}
	},
	bodega: {
		id: 'bodega',
		text: 'Bodegas',
		to: '/bdg',
		icon: 'HeroBuildingLibrary',
		subPages: {
			// stock_bodega: {
			// 	id: 'bodega',
			// 	text: 'Bodegas',
			// 	to: '/bdg/bodega/',
			// 	icon: 'HeroListBullet',
			// },
			lotes: {
				id: 'lotes',
				text: 'Materia Prima',
				to: '/bdg/lotes-mp',
				icon: 'DuoFlower3',
			},
			pallets_producto_terminado: {
				id: 'pallets producto terminado',
				text: 'Pallets Producto Terminado',
				to: '/bdg/pallets-producto-terminado/',
				icon: 'HeroSquares2X2'
			},
			detalle_lotes: {
				id: 'lotes',
				text: 'Detalle Materia Prima',
				to: '/bdg/lotes-mp/:id',
				icon: 'HeroListBullet',
			},
			bodegas: {
				id: 'bodegas',
				text: 'Bodegas',
				to: '/bdg/bodegas',
				icon: 'HeroSquare3Stack3D',
				subPages: {
					bodega_g1: {
						id: 'bodega_g1',
						text: 'Bodega G1',
						to: '/bdg/bodegas/bodega-g1/',
						icon: 'HeroListBullet',
					},
					pdf_bodegas: {
						id: 'bodegas_all',
						text: 'Bodegas G',
						to: '/bdg/bodegas/pdf-bodegas/',
						icon: 'HeroListBullet',
					},
					bodega_g2: {
						id: 'bodega_g2',
						text: 'Bodega G2',
						to: '/bdg/bodegas/bodega-g2/',
						icon: 'HeroListBullet',
					},

					bodega_g3: {
						id: 'bodega_g3',
						text: 'Bodega G3',
						to: '/bdg/bodegas/bodega-g3/',
						icon: 'HeroListBullet',
					},
					bodega_g4: {
						id: 'bodega_g4',
						text: 'Bodega G4',
						to: '/bdg/bodegas/bodega-g4/',
						icon: 'HeroListBullet',
					},
					bodega_g5: {
						id: 'bodega_g5',
						text: 'Bodega G5',
						to: '/bdg/bodegas/bodega-g5/',
						icon: 'HeroListBullet',
					},
					bodega_g6: {
						id: 'bodega_g6',
						text: 'Bodega G6',
						to: '/bdg/bodegas/bodega-g6/',
						icon: 'HeroListBullet',
					},
					bodega_g7: {
						id: 'bodega_g7',
						text: 'Bodega G7',
						to: '/bdg/bodegas/bodega-g7/',
						icon: 'HeroListBullet',
					},

				}
			},
			acciones: {
				id: 'acciones',
				text: 'Acciones Bodega',
				to: '/bdg/acciones',
				icon: 'HeroListBullet',
				subPages: {
					fumigacion: {
						id: 'fumigacion',
						text: 'Fumigación Bins',
						to: '/bdg/acciones/fumigacion-bins/',
						icon: 'DuoWind',
					},
					agrupacion_bin: {
						id: 'agrupacion',
						text: 'Agrupación Bins',
						to: '/bdg/acciones/agrupaciones/',
						icon: 'DuoGit3',
						subPages: {
							registro_agrupacion: {
								id: 'agrupacion-registro',
								text: 'Registro Agrupación',
								to: '/bdg/acciones/agrupaciones/registro-agrupacion-bin/:id'
							},
							detalle_agrupacion: {
								id: 'agrupacion-detalle',
								text: 'Detalle Agrupación',
								to: '/bdg/acciones/agrupaciones/agrupacion/:id'
							}
						}
					},
					inventario_bodega: {
						id: 'inventario',
						text: 'Inventario Bodegas',
						to: '/bdg/acciones/inventario-bodega/',
						icon: 'HeroListBullet',
						subPages: {
							detalle_inventario: {
								id: 'detalle_inventario',
								to: '/bdg/acciones/inventario-bodega/:id'
							},
							PDFResumidoInventario: {
								id: 'PDFResumidoInventario',
								to: '/bdg/acciones/inventario-bodega/:id/pdf_resumido'
							},
							PDFDetalladoInventario: {
								id: 'PDFDetalladoInventario',
								to: '/bdg/acciones/inventario-bodega/:id/pdf_detallado'
							}
						}
					}
				}
			}

		},
	},
	ventas: {
		id: 'ventas',
		text: 'Ventas',
		icon: 'HeroShoppingCart',
		to: '/ventas',
		subPages: {
			pedidos: {
				id: 'pedidos',
				text: 'Pedidos',
				icon: 'HeroQueueList',
				to: '/ventas/pedidos',
				subPages: {
					detalle_pedido_interno: {
						id: 'pedido_interno',
						text: 'Pedido Mercado Interno',
						to: '/ventas/pedidos/pedido-interno/:id'
					},
					detalle_pedido_exportacion: {
						id: 'pedido_exportacion',
						text: 'Pedido Mercado Exportación',
						to: '/ventas/pedidos/pedido-exportacion/:id'
					},
					pdf_pedido_interno: {
						id: 'pdf_pedido_interno',
						to: '/ventas/pedidos/pdf-pedido-interno/:id'
					},
					pdf_pedido_exportacion: {
						id: 'pdf_pedido_interno',
						to: '/ventas/pedidos/pdf-pedido-exportacion/:id'
					},
					guia_salida: {
						id: 'guia_salida',
						text: 'Guía Salida',
						to: '/ventas/pedidos/guia',
						subPages: {
							detalle_guia_salida: {
								id: 'guia_salida',
								text: 'Guía Salida',
								to: '/ventas/pedidos/guia/guia-salida/:id'
							},
							pdf_guia: {
								id: 'pdf_guia_salida',
								to: '/ventas/pedidos/guia/pdf-guia-salida/:id'
							}
						}
					},
					registro_pedidos: {
						id: 'registro_pedidos',
						text: 'Registro Pedidos',
						to: '/ventas/pedidos/registro-pedido/'
					},
					detalle_pedido: {
						id: 'detalle_pedido',
						text: 'Detalle Pedido',
						to: '/ventas/pedidos/detalle/:id'
					}
					// detalle_pedido: {
					// 	id: 'detalle_pedido',
					// 	text: 'Detalle Pedido',
					// 	to: '/ventas/pedidos/pedido/:id'
					// },
				}
			}
		}
	},
	embalaje: {
		id: 'embalaje',
		text: 'Embalaje',
		to: '/emb',
		icon: 'HeroRectangleGroup',
		subPages: {
			registro_programa_embalaje: {
				id: 'registro_programa_embalaje',
				text: 'Registro Programa Embalaje',
				to: '/emb/registro-programa-embalaje/:id'
			},
			programas_embalaje: {
				id: 'programa_embalaje',
				text: 'Programa Embalaje',
				to: '/emb/embalaje-programa/',
				icon: 'HeroArrowsRightLeft'
			},
			detalle_programa_embalaje: {
				id: 'programa_embalaje_detalle',
				text: 'Detalle Programa Embalaje',
				to: '/emb/embalaje-programa/:id'
			},
			tipo_embalajes: {
				id: 'tipo_embalaje',
				text: 'Tipos Embalaje',
				to: '/emb/tipo-embalajes/',
				icon: 'DuoBox3'
			},
			etiquetados: {
				id: 'etiquetas',
				text: 'Etiquetas',
				to: '/emb/etiquetas',
				icon: 'HeroBookmarkSquare'
			},
			pdf_entrada_embalaje: {
				id: 'pdf_entrada_embalaje',
				to: '/emb/pdf-entrada/:id'
			},
			pdf_salida_embalaje: {
				id: 'pdf_entrada_embalaje',
				to: '/emb/pdf-salida/:id'
			}
		}
	},
	planta_harina: {
		id: 'planta_harina',
		icon: 'HeroHomeModern',
		to: '/ph',
		text: 'Planta Harina',
		subPages: {
			programas_planta_harina: {
				id: 'programas_planta_harina',
				text: 'Programas PH',
				icon: 'HeroArrowPathRoundedSquare',
				to: '/ph/ph-prog',
				subPages: {
					programa_planta_harina: {
						id: 'programa_planta_harina',
						to: '/ph/ph-prog/:id'
					},
					registro_planta_harina: {
						id: 'registro_planta_harina',
						to: '/ph/ph-prog/registro-programa-planta-harina/:id'
					},
					pdf_documento_entrada: {
						id: 'pdf_documentro_entrada_planta_harina',
						to: '/ph/ph-prog/pdf-detalle-entrada-planta-harina/:id'
					},
					pdf_documento_salida: {
						id: 'pdf_documentro_salida_planta_harina',
						to: '/ph/ph-prog/pdf-detalle-salida-planta-harina/:id'
					}
				}
			},
				procesos_planta_harina: {
				id: 'proceso_planta_harina',
				text: 'Procesos PH',
				icon: 'HeroArrowsRightLeft',
				to: '/ph/ph-proc',
				subPages: {
					proceso_planta_harina: {
						id: 'proceso_planta_harina',
						to: '/ph/ph-proc/:id'
					},
					registro_planta_harina: {
						id: 'registro_proceso-planta_harina',
						to: '/ph/ph-proc/registro-proceso-planta-harina/:id'
					},
					pdf_documento_entrada: {
						id: 'pdf_documentro_entrada_planta_harina',
						to: '/ph/ph-proc/pdf-detalle-entrada-proceso-planta-harina/:id'
					},
					pdf_documento_salida: {
						id: 'pdf_documentro_salida_planta_harina',
						to: '/ph/ph-proc/pdf-detalle-salida-proceso-planta-harina/:id'
					}
				}
			}

		}
	}

}

export const authPages = {
	loginPage: {
		id: 'loginPage',
		to: '/login',
		text: 'Login',
		icon: 'HeroArrowRightOnRectangle',
	},
	profilePage: {
		id: 'perfil',
		to: '/perfil',
		text: 'Perfil',
		icon: 'HeroUser',
	},
};

const pagesConfig = {
	...examplePages,
	...authPages,
};

export default pagesConfig;
