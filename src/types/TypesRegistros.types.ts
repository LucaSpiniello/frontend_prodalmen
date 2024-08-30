import { StringDecoder } from "string_decoder";
import { TDarkMode } from "./darkMode.type";

export type TVerificar = (token: TAuth | null) => Promise<string | false | undefined>

export type TAuth = {
  access: string;
  refresh: string;
}

export type TUser = {
  id: number;
  email: string;
  first_name: string;
  second_name: string | null;
  last_name: string;
  second_last_name: string | null;
  rut: string | null;
  celular: number | null;
  genero: string;
  fecha_nacimiento: string;
  image: string;
}

export type TPersonalizacion = {
  id: number;
  user: TUser;
  activa: boolean;
  estilo: TDarkMode
  cabecera: string;
  anio: string;
  iot_balanza_recepcionmp: string;
}



export type TProductor = {
    id: number;
    rut_productor: string;
    nombre: string;
    telefono: string;
    region: number;
    provincia: number;
    comuna: number;
    region_nombre: string;
    provincia_nombre: string;
    comuna_nombre: string;
    direccion: string;
    movil: string;
    pagina_web: string;
    email: string;
    fecha_creacion: string;
    fecha_modificacion: string;
    numero_contrato: number;
    usuarios: [];
  };

  export type TOperarios = {
    id: number;
    fecha_creacion: string;
    fecha_modificacion: string;
    nombre: string;
    apellido: string;
    rut: string;
    activo: boolean;
    skills: TSkill[]
  }

  export type TSkill ={
    id: number
    tipo_operario: string;
    pago_x_kilo: number;
    operario: number
    tipo_operario_label: string
  }

  export type TConductor = {
    id: number;
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    fecha_creacion: string;
    fecha_modificacion: string;
  }

  export type TCamion = {
    id: number;
    fecha_creacion: string;
    fecha_modificacion: string;
    patente: string;
    acoplado: boolean;
    observaciones: string;
  };

  export type TComercializador = {
    id: number;
    nombre: string;
    razon_social: string;
    giro: string;
    direccion: string;
    zip_code: string;
    email_comercializador: string;
  };


  export type TClientes = {
    rut_dni: string
    razon_social: string
    pais_ciudad: string
    telefono: string
    movil: string
    email_cliente: string;
    id?: number;
    fecha_creacion?: string; 
    fecha_modificacion?: string; 
    rut_cliente?: string;
    nombre_fantasia?: string;
    region?: number;
    provincia?: number;
    comuna?: number;
    direccion?: string;
    pagina_web?: string;
    carpeta_tributaria?: string | null;
    creado_por?: number;
    dni_cliente?: string;
    direccion_1?: string;
    direccion_2?: string;
    codigo_postal?: string;
    ciudad?: number;
    pais?: number;
  }


  export type TSucursales = {
    id: number,
    fecha_creacion: string,
    fecha_modificacion: string,
    nombre: string,
    region?: number,
    comuna?: number,
    provincia?: number,
    direccion: string,
    telefono: string,
    email_sucursal: string,
    cliente: number
    region_nombre?: string
    provincia_nombre?: string
    comuna_nombre?: string
    pais?: number
    ciudad?: number
    pais_nombre?: string
    ciudad_nombre?: string
    }





  export type TPaises = {
    id: number,
    name: string
  }

  export type TCuidadPais = {
    id: number
    name: string
    country: string
  }

  export type TRegion = {
    region_id: number
    region_nombre: string 
  }

  export type TProvincia = {
    provincia_id: number
    provincia_nombre: string
  }

  export type TComuna = {
    comuna_id: number
    comuna_nombre: string
  }


export type TCuentasCorrientes = {
  id: number
  cliente: number
  banco: string
  numero_cuenta: string
  tipo_cuenta: string
  banco_nombre: string
  tipo_cuenta_label: string
}

export type TRepresentantes = {
  id: number
  nombres: string
  apellidos: string
  telefono: string
  direccion: string
  email: string
}

export type TNotificaciones = {
  type: string
  message: string
  timestamp: string
}