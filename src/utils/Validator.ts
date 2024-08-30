import * as Yup from "yup";

function validarRut(rutCompleto: string) {
  if (!/^[0-9]+-[0-9kK]{1}$/.test(rutCompleto))
      return false;
  var tmp = rutCompleto.split('-');
  var digv = tmp[1];
  var rut = tmp[0];
  if (digv == 'K') digv = 'k';
  return (calcularDigitoVerificador(rut) == digv);
}

function calcularDigitoVerificador(T: any) {
  var M = 0,
      S = 1;
  for (; T; T = Math.floor(T / 10))
      S = (S + T % 10 * (9 - M++ % 6)) % 11;
  return S ? S - 1 : 'k';
}




export const headerGuiaRegistroSchema = Yup.object().shape({
  estado_recepcion: Yup.string().nullable(),
  mezcla_variedades: Yup.boolean().required('Mezcla Variedades es requerido'),
  tara_camion_1: Yup.number().nullable(),
  tara_camion_2: Yup.number().nullable(),
  terminar_guia: Yup.boolean().required(),
  numero_guia_productor: Yup.string().required('Número de guía es requerido!'),
  comercializador: Yup.string().nullable().required('Comercializador es requerido!'),
  productor: Yup.string().nullable().required('Productor es requerido!'),
  camionero: Yup.string().nullable().required('Camionero es requerido!'),
  camion: Yup.string().nullable().required('Camión es requerido!'),
});


export const ProductorSchema = Yup.object().shape({
  rut_productor: Yup.string().required('El RUT del productor es requerido').test('rut-valido', 'El RUT ingresado no es válido', validarRut),
  nombre: Yup.string().required('El nombre es requerido'),
  // telefono: Yup.string().matches(/^\d{9}$/, 'El teléfono debe tener 9 dígitos'),
  region: Yup.string().nullable().required('La región es requerida'),
  provincia: Yup.string().nullable().required('La provincia es requerida'),
  comuna: Yup.string().nullable().required('La comuna es requerida'),
  direccion: Yup.string().required('La dirección es requerida'),
  // movil: Yup.string().matches(/^\+569\d{8}$/, 'El móvil debe tener el formato "+56912345678"'),
  pagina_web: Yup.string().nullable().notRequired(),
  email: Yup.string().email('Ingrese un correo electrónico válido'),
  numero_contrato: Yup.string().nullable()
})


export const camionSchema = Yup.object().shape({
  patente: Yup.string().required('La patente es requerida'),
  acoplado: Yup.boolean(),
  observaciones: Yup.string(),  
});

export const conductorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  rut: Yup.string().required('El RUT es requerido').test('rut-valido', 'El RUT ingresado no es válido', validarRut),
  // telefono: Yup.string().matches(/^\+569\d{8}$/, 'El móvil debe tener el formato "+56912345678"'),
});

export const comercializadorSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  razon_social: Yup.string().required('La razón social es requerida'),
  giro: Yup.string().required('El giro es requerido'),
  direccion: Yup.string().required('La dirección es requerida'),
  zip_code: Yup.string(),
  email_comercializador: Yup.string().email('El correo electrónico debe tener un formato válido'),
});

export const operarioSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string(),
  rut: Yup.string().required('El RUT es requerido').test('rut-valido', 'El RUT ingresado no es válido', validarRut),
  activo: Yup.boolean().required('El estado activo/inactivo es requerido')
});

export const envaseSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  peso: Yup.number().nullable().min(0, 'El peso debe ser mayor o igual a cero'),
  descripcion: Yup.string(),
});


export const calibracionSchema = Yup.object().shape({
  pre_calibre: Yup.number().required('El pre calibre es requerido'),
  calibre_18_20: Yup.number().required('El calibre 18-20 es requerido'),
  calibre_20_22: Yup.number().required('El calibre 20-22 es requerido'),
  calibre_23_25: Yup.number().required('El calibre 23-25 es requerido'),
  calibre_25_27: Yup.number().required('El calibre 25-27 es requerido'),
  calibre_27_30: Yup.number().required('El calibre 27-30 es requerido'),
  calibre_30_32: Yup.number().required('El calibre 30-32 es requerido'),
  calibre_32_34: Yup.number().required('El calibre 32-34 es requerido'),
  calibre_34_36: Yup.number().required('El calibre 34-36 es requerido'),
  calibre_36_40: Yup.number().required('El calibre 36-40 es requerido'),
  calibre_40_mas: Yup.number().required('El calibre 40+ es requerido'),
  peso_muestra_calibre: Yup.number().required('El peso de muestra de calibre es requerido')
});


export const OperarioProgramaSchema = Yup.object().shape({
  operario: Yup.number().required('El operario es requerido'),
})