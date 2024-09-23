

export const ESTADO_CLIENTE = [
  { value: 1, label: "Activo" },
  { value: 2, label: "Inactivo" },
];

export const TIPOS_OPERARIO = [
  { values: "seleccion", label: "Operario de Selección" },
  { values: "gruero", label: "Operario Gruero" },
  { values: "embalaje", label: "Operario Embalaje" },
  { values: "p_limpia", label: "Operario Pre Limpia" },
  { values: "despelo", label: "Operario Despelonado" },
  { values: "bodega", label: "Operario Bodega" },
  { values: "pesaje", label: "Operario Pesaje" },
  { values: "p_harina", label: "Operario Planta Harina" },
  { values: "sub_prod", label: "Operario Sub Producto" },
];

export const TIPO_ACOPLADO = [
  { values: "true", label: "Con Acoplado" },
  { values: "false", label: "Sin Acoplado" },
];

export const ACTIVO = [
  { id: 1, values: "true", label: "Si" },
  { id: 2, values: "false", label: "No" },
];

export const VARIEDADES_MP = [
  { value: "SL", label: "Solano" },
  { value: "MO", label: "Mono" },
  { value: "CM", label: "Carmel" },
  { value: "RB", label: "Ruby" },
  { value: "PR", label: "Price" },
  { value: "WC", label: "Wood Colony" },
  { value: "TK", label: "Tokio" },
  { value: "MD", label: "Merced" },
  { value: "TC", label: "Tuca" },
  { value: "NP", label: "Nonpareil" },
  { value: "RV", label: "Revueltas" },
  { value: "PD", label: "Padre" },
  { value: "TX", label: "Texas" },
  { value: "MC", label: "Marcona" },
  { value: "GU", label: "Guara" },
  { value: "DS", label: "Desmayo" },
  { value: "IX", label: "Ixl" },
  { value: "TH", label: "Thompson" },
  { value: "DK", label: "Drake" },
  { value: "VS", label: "Vesta" },
  { value: "NL", label: "Neplus" },
  { value: "FR", label: "Fritz" },
  { value: "BU", label: "Butte" },
  { value: "MI", label: "Mission" },
  { value: "NE", label: "Neplus" },
  { value: "CA", label: "Tipo California" },
  { value: "MZ", label: "Mezcla" },
  { value: "ID", label: "Independence" },
  { value: "AV", label: "Avijar" },
  { value: "IS", label: "Isabelona" },
  { value: "ST", label: "Soleta" },
  { value: "VI", label: "Vialfas" },
  { value: 'NN', label: 'Sin Variedad'},
  { value: 'NNM', label: '---'},
]

export const TIPO_PRODUCTOS_RECEPCIONMP = [
  { value: "1", label: "Almendra con Pelon" },
  { value: "2", label: "Pepa Calibrada" },
  { value: "3", label: "Canuto" },
];

export const ESTADOS_LOTE_COLOSOS = [
  { value: "1", label: "Lote Colosos Creado" },
  { value: "2", label: "Lote En Inspecion Visual Por CC" },
  { value: "3", label: "Lote Interno Aprobado" },
  { value: "4", label: "Lote Interno Rechazado" },
  { value: "5", label: "MP Almacenada" },
];

export const ESTADOS_MP = [
  { value: "1", label: "MP Recepcionada" },
  { value: "2", label: "MP En Inspecion Visual Por CC" },
  { value: "3", label: "MP Aprobada, Esperando Ubicacion Descarga" },
  { value: "4", label: "MP Rechazada" },
  { value: "5", label: "MP Almacenada" },
  { value: "6", label: "MP Recepcion Completada" },
  { value: "7", label: "Lote Procesado" },
];

export const ESTADOSGUIARECEPCION_MP = [
  { value: "1", label: "Guia Creada" },
  { value: "2", label: "Guia En Proceso" },
  { value: "3", label: "Guia Completada, esperando Tara" },
  { value: "4", label: "Guia Cerrada" },
];

export const ESTADOS_GUIA_MP = [
  { value: "1", label: "Iniciar Inspección" },
  { value: "2", label: "Registrar Control Calidad" },
];

export const ESTADO_CONTROL = [
  { value: "1", label: "Lote Aprobado x CC" },
  { value: "0", label: "Lote Rechazado x CC" },
  { value: "2", label: "Pendiente CC" },
];

export const UBICACION_PATIO_TECHADO_EXT = [
  { value: "0", label: "Pendiente Ubicacion" },
  { value: "1", label: "Sector 1" },
  { value: "2", label: "Sector 2" },
  { value: "3", label: "Sector 3" },
];

export const perfilesPermitidos = ["Recepcion", "Control Calidad", "Bodega"];
export const usuarioRole = {
  name: "Nicolas",
  area: "Recepcion",
};


export const RESULTADO_RECHAZO = [
  { value: '0', label: 'Rechazo Registrado'},
  { value: '1', label: 'Devuelto a Productor'},
  { value: '2', label: 'Derivado a Campo Secado'},
]


export const CARGOS_PERFILES = [
  'RecepcionMP',
  'CDC Jefatura',
  'CDC Operario MP',
  'Bodega Patio Exterior',
  'Produccion',
  'Produccion Admin',
  'Seleccion',
  'Seleccion Admin',
  'Administrador'
]


export const TIPO_INFORME = [
  {value: 1, label: 'Pre Limpia'},
  {value: 2, label: 'Descascarado/ Despelonado'}
]


export const Years = [
  {value: 1, label: '2024'},
  {value: 2, label: '2023'},
  {value: 3, label: '2022'},
  {value: 4, label: '2021'},
  {value: 5, label: '2020'},
]


export const TIPO_RESULTANTE = [
  { value: '1', label: 'Borrel'},
  { value: '2', label: 'Maseto'},
  { value: '3', label: 'Pepa Calibrada'},   
  { value: '4', label: 'Pepa Huerto'},
]

export const CALLE_BODEGA = [
  { value: '-', label: 'Asigne Calle'},
  { value: 'F', label: 'Calle de Fumigado'},
  { value: '1', label: 'Calle 1'},
  { value: '2', label: 'Calle 2'},
  { value: '3', label: 'Calle 3'},
  { value: '4', label: 'Calle 4'},
  { value: '5', label: 'Calle 5'},
  { value: '6', label: 'Calle 6'},
  { value: '7', label: 'Calle 7'},
  { value: '8', label: 'Calle 8'},
  { value: '9', label: 'Calle 9'},
  { value: '10',label:  'Calle 10'},
  { value: '11',label:  'Calle 11'},
  { value: '12',label:  'Calle 12'},
  { value: '13', label: 'Calle 13'},
  { value: '14', label: 'Calle 14'},
  { value: '15', label: 'Calle 15'},
  { value: '16', label: 'Calle 16'},
  { value: '17', label: 'Calle 17'},
  { value: '18', label: 'Calle 18'},
  { value: '19',label:  'Calle 19'},
  { value: '20',label:  'Calle 20'},
  { value: '21',label:  'Calle 21'},
  { value: '22', label: 'Calle 22'},
  { value: '23',label:  'Calle 23'},
  { value: '24',label:  'Calle 24'},
  { value: '25',label:  'Calle 25'},
]


export const TIPOS_BIN = [
    { value: '40.0',  label: 'Patineta Negra'},
    { value: '43.5', label: 'Patineta Blanca'},
    { value: '44.6', label: 'UPC'}
]




export const CALIBRES = [
  {
    name: 'Categoria 1',
    calibres: [
      { id: '0', name: 'Sin Calibre' },
      { id: '1', name: 'PreCalibre' },
      { id: '2', name: '18/20' },
      { id: '3', name: '20/22' },
      { id: '4', name: '23/25' },
      { id: '5', name: '25/27' },
      { id: '6', name: '27/30' },
      { id: '7', name: '30/32' },
      { id: '8', name: '32/34' },
      { id: '9', name: '34/36' },
      { id: '10', name: '36/40' },
      { id: '11', name: '40+' },
    ],
  },
  {
    name: 'Elaborados',
    calibres: [
      { id: '12', name: '3x5mm' },
      { id: '13', name: '2x4mm' },
      { id: '14', name: '4x6mm' },
      { id: '15', name: '3x5mm' },
      { id: '16', name: '2x4mm' },
      { id: '17', name: '4x6mm' },
      { id: '18', name: '+2mm' },
      { id: '19', name: '-2mm' },
      { id: '20', name: '+2mm' },
      { id: '21', name: '-2mm' },
    ],
  },
];

export const CANTIDAD_MUESTRA_PRODUCCION = [
  { value: 250, label: '250 Gramos' },
  { value: 500, label: '500 Gramos' },
]


export const TIPO_RESULTANTE_SELECCION = [
  { value: '1', label: 'Descaste Sea'},
  { value: '2', label: 'Pepa Selecciónada'},
  { value: '3', label: 'Whole & Broken para PH'},
]


export const BODEGAS = [
  { value: 'g1', label: 'Bodega G1' },
  { value: 'g2', label: 'Bodega G2' },
  { value: 'g3', label: 'Bodega G3' },
  { value: 'g4', label: 'Bodega G4' },
  { value: 'g5', label: 'Bodega G5' },
  { value: 'g6', label: 'Bodega G6' },
  { value: 'g7', label: 'Bodega G7' }
]


export const TIPO_SUBPRODUCTO = [
  {value: '1', label: 'Piel Aderida'},
  {value: '2', label: 'Pepa Piso'},
  {value: '3', label: 'Basura'},
  {value: '4', label: 'Descarte Sea'},
  {value: '5', label: 'Cascara'},
  {value: '6', label: 'Trozo'},
  {value: '7', label: 'Picada'},
  {value: '8', label: 'Hongo'},
  {value: '9', label: 'Insecto'},
  {value: '10',label:  'Goma'},
  {value: '11',label:  'Punto Goma'},
  {value: '12',label:  'Polvillo'},
  {value: '13',label:  'Vana'},
  {value: '14',label:  'Mezcla Variedad'},
  {value: '15',label:  'Dobles'},
  {value: '16',label:  'Otros'},
]

export const CALIDAD = [
  {
      category: 'Categoria 1',
      options: [
          { value: 'EXT', label: 'Extra N°1' },
          { value: 'SUP', label: 'Supreme' },
          { value: 'W&B', label: 'Whole & Broken' }
      ]
  },
  {
      category: 'Elaborados',
      options: [
          { value: 'har_cn_piel', label: 'Harina Con Piel' },
          { value: 'har_sn_piel', label: 'Harina Sin Piel' },
          { value: 'gra_cn_piel', label: 'Granillo Con Piel' },
          { value: 'gra_sn_piel', label: 'Granillo Sin Piel' },
          { value: 'gra_tos_s_pl', label: 'Granillo Tostado Sin Piel' },
          { value: 'gra_tos_c_pl', label: 'Granillo Tostado Con Piel' },
          { value: 'alm_tostada', label: 'Almendras Tostadas' },
          { value: 'alm_repelada', label: 'Almendras Repeladas' }
      ]
  },
  {
      category: 'Categoria 2',
      options: [
          { value: 'vana', label: 'Vana' },
          { value: 'goma', label: 'Goma' },
          { value: 'insect', label: 'Insecto' },
          { value: 'hongo', label: 'Hongo' },
          { value: 'des_sea', label: 'Descarte Sea' },
          { value: 'polvillo', label: 'Polvillo' },
          { value: 'pepasuelo', label: 'Pepa Suelo' },
          { value: 'preca', label: 'Precalibre' }
      ]
  }
];


export const CALIDAD_FRUTA = [
  { value: 0 , label: 'Extra N° 1'},
  { value: 1, label: 'Supreme'},
  { value: 2, label: 'Whole & Broken'},
  { value: 3, label: 'Sin Calidad'},
  { value: 4, label: 'Whole para Harina'},
]


export const CONDICION_PAGO_NOTAPEDIDO = [
  { value: '1', label: '7 dias'},
  { value: '2', label: '15 dias'},
  { value: '3', label: '30 dias'},
  { value: '4', label: 'Contado'},
  { value: '5', label: 'Contra Entrega'}
]

export const TIPO_VENTA = [
  { value: '1', label: 'Pesos Chilenos'},
  { value: '2', label: 'Dolares Americanos'},
]

export const TIPO_FLETE = [
  { value: 'EXW', label: 'EXW - Ex works'},
  { value: 'FAS', label: 'FAS - Free alongside ship'},
  { value: 'FOB', label: 'FOB - Free on board'},
  { value: 'FCA', label: 'FCA - Free carrier'},
  { value: 'CFR', label: 'CFR - Cost and freight'},
  { value: 'CIF', label: 'CIF - Cost, insurance and freight'},
  { value: 'CPT', label: 'CPT - Carriage paid to'},
  { value: 'CIP', label: 'CIP - Carriage and insurance paid to'},
  { value: 'DAT', label: 'DAT - Delivered at terminal'},
  { value: 'DAP', label: 'DAP - Delivered at place'},
  { value: 'DDP', label: 'DDP - Delivered duty paid'},
]

export const DESPACHO_EMBALAJE = [
  {value: '0', label: 'Seleccione Tipo Despacho'},
  {value: '1', label: 'Despachado por Prodalmen'},
  {value: '2', label: 'Despachado por Transportista'},
  {value: '3', label: 'Retira Cliente'},
]
  
export const NOMBRE_PRODUCTO = [
  { value: '1', label: 'Almendras'},
  { value: '2', label: 'Granillo'},
  { value: '3', label: 'Harina'},
]


export const TIPOS_GUIA_SALIDA = [
  { value: '0', label: 'Retiro Fruta Productor' },
  { value: '1', label: 'Regalo Fruta' },
  { value: '2', label: 'Fruta para Muestras' },
  { value: '3', label: 'Retiro de Fruta Usuario particular' }
];

export const ESTADO_GUIA_SALIDA = [
  { value: '0', label: 'Creada' },
  { value: '1', label: 'Aprobación Solicitada' },
  { value: '2', label: 'Completada y entregada' },
  { value: '3', label: 'Guía Rechazada' }
];

export const TIPO_CLIENTE = [
  { value: 'productor', label: 'Productor'},
  { value: 'clientemercadointerno', label: 'Cliente Mercado Interno'},
  { value: 'clienteexportacion', label: 'Cliente Exportacion'},
  { value: 'user', label: 'Usuario'},
]

export const TIPOS_RECHAZOS = [
  { value: '1', label: 'Piel Aderida'},
  { value: '2', label: 'Pepa Piso'},
  { value: '3', label: 'Basura'},
  { value: '4', label: 'Descarte Sea'},
  { value: '5', label: 'Cascara'},
  { value: '6', label: 'Otros no especificado'},
]

export const TIPO_PROGRAMA_PLANTA_HARINA = [
  { value: 'repelado', label: 'Repelado'},
  { value: 'tostado', label: 'Tostado'},
]


export const PERDIDAPROGRAMA = [
  { value: '2', label: '2 % de pieles perdida sugerida'},
  { value: '3', label: '3 % de pieles perdida sugerida'},
  { value: '4', label: '4 % de pieles perdida sugerida'},
  { value: '5', label: '5 % de pieles perdida sugerida'},
  { value: '6', label: '6 % de pieles perdida sugerida'},
  { value: '7', label: '7 % de pieles perdida sugerida'},
  { value: '8', label: '8 % de pieles perdida sugerida'},
  { value: '9', label: '9 % de pieles perdida sugerida'},
]


export const UBICACION_PRODUCTO = [
  { value: '1', label: 'En Planta Harina'},
  { value: '2', label: 'Almacenaje Temporal Frigorifico'},
  { value: '3', label: 'Ingreso de Semi Elab a G6'}
]


export const TIPO_PROCESO = [
  { value: '1', label: 'Granillo Tostado con Piel 3x5mm' },
  { value: '2', label: 'Granillo Tostado con Piel 2x4mm' },
  { value: '3', label: 'Granillo Tostado con Piel 4x6mm' },
  { value: '4', label: 'Granillo Tostado sin Piel 3x5mm' },
  { value: '5', label: 'Granillo Tostado sin Piel 2x4mm' },
  { value: '6', label: 'Granillo Tostado sin Piel 4x6mm' },
  { value: '7', label: 'Harina Tostado Con Piel +2mm' },
  { value: '8', label: 'Harina Tostado Con Piel -2mm' },
  { value: '9', label: 'Harina Tostado Sin Piel +2mm' },
  { value: '10', label: 'Harina Tostado Sin Piel -2mm' },
  { value: '11', label: 'Granillo con Piel 3x5mm' },
  { value: '12', label: 'Granillo con Piel 2x4mm' },
  { value: '13', label: 'Granillo con Piel 4x6mm' },
  { value: '14', label: 'Granillo sin Piel 3x5mm' },
  { value: '15', label: 'Granillo sin Piel 2x4mm' },
  { value: '16', label: 'Granillo sin Piel 4x6mm' },
  { value: '17', label: 'Harina Con Piel +2mm' },
  { value: '18', label: 'Harina Con Piel -2mm' },
  { value: '19', label: 'Harina Sin Piel +2mm' },
  { value: '20', label: 'Harina Sin Piel -2mm' }
]

export const PARAMETRO_HARINA = [
  { value: '0',  label: 'Sin Parametro'},
  { value: 'harina_fina', label: '-2MM'},
  { value: 'harina_gruesa', label: '+2MM'},
]



export const BANCOS = [
  { value: '001', label: 'BANCO DE CHILE' },
  { value: '009', label: 'BANCO INTERNACIONAL' },
  { value: '012', label: 'BANCO ESTADO' },
  { value: '014', label: 'SCOTIABANK CHILE' },
  { value: '016', label: 'BANCO DE CREDITO E INVERSIONES - BCI' },
  { value: '027', label: 'CORPBANCA' },
  { value: '028', label: 'BANCO BICE' },
  { value: '031', label: 'HSBC BANK CHILE' },
  { value: '037', label: 'BANCO SANTANDER-CHILE' },
  { value: '039', label: 'BANCO ITAÚ CHILE' },
  { value: '049', label: 'BANCO SECURITY' },
  { value: '051', label: 'BANCO FALABELLA' },
  { value: '052', label: 'DEUTSCHE BANK CHILE' },
  { value: '053', label: 'BANCO RIPLEY' },
  { value: '054', label: 'RABOBANK CHILE ex HNS BANCO' },
  { value: '055', label: 'BANCO CONSORCIO' },
  { value: '056', label: 'BANCO PENTA' },
  { value: '057', label: 'BANCO PARIS' },
  { value: '504', label: 'BANCO BILBAO VIZCAYA ARGENTARIA, CHILE BBVA' },
  { value: '059', label: 'BANCO BTG PACTUAL CHILE' }
];

export const TIPO_CUENTA = [
  { value: '1', label: 'Cuenta Corriente' },
  { value: '2', label: 'Cuenta de Ahorro' },
  { value: '3', label: 'Cuenta Vista' }
];



export const TIPO_INVENTARIO = [
  {value: '1', label: 'Inventario por Bodega'},
  {value: '2', label: 'Inventario por Calle'},
  {value: '3', label: 'Inventario por Todas las Bodega'},
  {value: '4', label: 'Inventario Aleatorio por Calle'}
]

export const CALLES_BODEGA_G1 = [
  {value: 'F', label: 'Calle de Fumigado'},
  {value: '1', label: 'Calle 1'},
  {value: '2', label: 'Calle 2'},
  {value: '3', label: 'Calle 3'},
  {value: '4', label: 'Calle 4'},
  {value: '5', label: 'Calle 5'},
]

export const CALLES_BODEGA_G2 = [
  {value: 'F', label: 'Calle de Fumigado'},
  {value: '1', label: 'Calle 1'},
  {value: '2', label: 'Calle 2'},
  {value: '3', label: 'Calle 3'},
  {value: '4', label: 'Calle 4'},
  {value: '5', label: 'Calle 5'},
  {value: '6', label: 'Calle 6'},
  {value: '7', label: 'Calle 7'},
  {value: '8', label: 'Calle 8'},
  {value: '9', label: 'Calle 9'},
  {value: '10', label: 'Calle 10'},
  {value: '11', label: 'Calle 11'},
  {value: '12', label: 'Calle 12'},
]

export const CALLES_BODEGA_G3 = [
  {value: 'F', label:'Calle de Fumigado'},
  {value: '1', label:'Calle 1'},
  {value: '2', label:'Calle 2'},
  {value: '3', label:'Calle 3'},
  {value: '4', label:'Calle 4'},
  {value: '5', label:'Calle 5'},
  {value: '6', label:'Calle 6'},
  {value: '7', label:'Calle 7'},
  {value: '8', label:'Calle 8'},
  {value: '9', label:'Calle 9'},
  {value: '10', label: 'Calle 10'},
  {value: '11', label: 'Calle 11'},
  {value: '12', label: 'Calle 12'},
  {value: '13', label: 'Calle 13'},
  {value: '14', label: 'Calle 14'},
  {value: '15', label: 'Calle 15'},
  {value: '16', label: 'Calle 16'},
  {value: '17', label: 'Calle 17'},
  {value: '18', label: 'Calle 18'},
  {value: '19', label: 'Calle 19'},
  {value: '20', label: 'Calle 20'},
  {value: '21', label: 'Calle 21'},
  {value: '22', label: 'Calle 22'},
  {value: '23', label: 'Calle 23'},
  {value: '24', label: 'Calle 24'},
  {value: '25', label: 'Calle 25'},
]

export const CALLES_BODEGA_G4 = [
  {value: 'F', label: 'Calle de Fumigado'},
  {value: '1', label: 'Calle 1'},
  {value: '2', label: 'Calle 2'},
  {value: '3', label: 'Calle 3'},
  {value: '4', label: 'Calle 4'},
  {value: '5', label: 'Calle 5'},
  {value: '6', label: 'Calle 6'},
  {value: '7', label: 'Calle 7'},
  {value: '8', label: 'Calle 8'},
  {value: '9', label: 'Calle 9'},
  {value: '10', label:  'Calle 10'},
  {value: '11', label:  'Calle 11'},
  {value: '12', label:  'Calle 12'},
  {value: '13', label:  'Calle 13'},
  {value: '14', label:  'Calle 14'},
  {value: '15', label:  'Calle 15'},
  {value: '16', label:  'Calle 16'},
  {value: '17', label:  'Calle 17'},
  {value: '18', label:  'Calle 18'},
  {value: '19', label:  'Calle 19'},
  {value: '20', label:  'Calle 20'},
  {value: '21', label:  'Calle 21'},
  {value: '22', label:  'Calle 22'},
  {value: '23', label:  'Calle 23'},
  {value: '24', label:  'Calle 24'},
  {value: '25', label:  'Calle 25'},
]

export const CALLES_BODEGA_G5_G6_G7 = [
  {value: 'F', label: 'Calle de Fumigado'},
  {value: '1', label: 'Calle 1'},
  {value: '2', label: 'Calle 2'},
  {value: '3', label: 'Calle 3'},
  {value: '4', label: 'Calle 4'},
  {value: '5', label: 'Calle 5'},
  {value: '6', label: 'Calle 6'},
  {value: '7', label: 'Calle 7'},
  {value: '8', label: 'Calle 8'},
  {value: '9', label: 'Calle 9'},
  {value: '10', label:  'Calle 10'},
  {value: '11', label:  'Calle 11'},
  {value: '12', label:  'Calle 12'},
  {value: '13', label:  'Calle 13'},
  {value: '14', label:  'Calle 14'},
  {value: '15', label:  'Calle 15'},
  {value: '16', label:  'Calle 16'},
  {value: '17', label:  'Calle 17'},
  {value: '18', label:  'Calle 18'},
  {value: '19', label:  'Calle 19'},
  {value: '20', label:  'Calle 20'},
]

export const VARIEDAD_FRUTA_FICTICIA = [
  {value:'SL', label:'Solano'},
  {value:'MO', label:'Mono'},
  {value:'CM', label:'Carmel'},
  {value:'RB', label:'Ruby'},
  {value:'PR', label:'Price'},
  {value:'WC', label:'Wood Colony'},
  {value:'TK', label:'Tokio'},
  {value:'MD', label:'Merced'},
  {value:'TC', label:'Tuca'},
  {value:'NP', label:'Nonpareil'},
  {value:'RV', label:'Sin Especificar'},
  {value:'PD', label:'Padre'},
  {value:'TX', label:'Texas'},
  {value:'MC', label:'Marcona'},
  {value:'GU', label:'Guara'},
  {value:'DS', label:'Desmayo'},
  {value:'IX', label:'Ixl'},
  {value:'TH', label:'Thompson'},
  {value:'DK', label:'Drake'},
  {value:'VS', label:'Vesta'},
  {value:'NL', label:'Neplus'},
  {value:'FR', label:'Fritz'},
  {value:'BU', label:'Butte'},
  {value:'MI', label:'Mission'},
  {value:'NE', label:'Neplus'},
  {value:'CA', label:'Tipo California'},
  {value:'MZ', label:'Mezcla'},
  {value:'ID', label:'Independence'},
  {value:'AV', label:'Avijar'},
  {value:'IS', label:'Isabelona'},
  {value:'ST', label:'Soleta'},
  {value:'VI', label:'Vialfas'},
]

export const CALIBRES_FRUTA_FICTICIA = [
  {
    label: 'Categoria 1',
    options: [
      { value: '0', label: 'Sin Calibre' },
      { value: '1', label: 'PreCalibre' },
      { value: '2', label: '18/20' },
      { value: '3', label: '20/22' },
      { value: '4', label: '23/25' },
      { value: '5', label: '25/27' },
      { value: '6', label: '27/30' },
      { value: '7', label: '30/32' },
      { value: '8', label: '32/34' },
      { value: '9', label: '34/36' },
      { value: '10', label: '36/40' },
      { value: '11', label: '40+' },
    ],
  },
  {
    label: 'Elaborados',
    options: [
      { value: '12', label: '3x5mm' },
      { value: '13', label: '2x4mm' },
      { value: '14', label: '4x6mm' },
      { value: '15', label: '3x5mm' },
      { value: '16', label: '2x4mm' },
      { value: '17', label: '4x6mm' },
      { value: '18', label: '+2mm' },
      { value: '19', label: '-2mm' },
      { value: '20', label: '+2mm' },
      { value: '21', label: '-2mm' },
    ],
  },
];


export const CALIDAD_FRUTA_FICTICIA = [
  {
    label: 'Categoria 1',
    options: [
      {value: 'SN', label: 'Sin Calidad'},
      {value: 'EXT', label: 'Extra N°1'},
      {value: 'SUP', label: 'Supreme'},
      {value: 'W&B', label: 'Whole & Broken'},
    ]
  },
  {
    label: 'Elaborados',
    options: [
      {value: 'har_cn_piel', label: 'Harina Con Piel'},
      {value: 'har_sn_piel', label: 'Harina Sin Piel'},
      {value: 'gra_cn_piel', label: 'Granillo Con Piel'},
      {value: 'gra_sn_piel', label: 'Granillo Sin Piel'},
      {value: 'gra_tos_s_pl', label: 'Granillo Tostado Sin Piel'},
      {value: 'gra_tos_c_pl', label: 'Granillo Tostado Con Piel'},
      {value: 'alm_tostada', label: 'Almendras Tostadas'},
      {value: 'alm_repelada', label: 'Almendras Repeladas'},
    ]
  },
  {
    label: 'Categoria 2',
    options: [
      {value: 'vana', label: 'Vana'},
      {value: 'goma', label: 'Goma'},
      {value: 'insect', label: 'Insecto'},
      {value: 'hongo', label: 'Hongo'},
      {value: 'des_sea', label: 'Descarte Sea'},
      {value: 'polvillo', label: 'Polvillo'},
      {value: 'pepasuelo', label: 'Pepa Suelo'},
      {value: 'preca', label: 'Precalibre'},
    ]
  },
]