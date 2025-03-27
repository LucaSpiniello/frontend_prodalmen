import { Dispatch, SetStateAction } from "react";
import { TAuth } from "./TypesRegistros.types";

export type PostOptions = {
  endpoint?: string
  token: TAuth | null; // Ajuste para aceptar null
  id?: number;
  verificar_token: (token: TAuth | null) => Promise<string | false | undefined>; // Ajuste para aceptar null
  data?: any; // Tipo de datos que se enviarán en el cuerpo de la solicitud
  action?: Dispatch<SetStateAction<boolean>>;
  params?: Record<string, any>
}

export type FetchOptions = {
  endpoint?: string;
  token: TAuth | null; // Ajuste para aceptar null
  id?: any;
  verificar_token: (token: TAuth | null) => Promise<string | false | undefined>; // Ajuste para aceptar null
  params?: Record<string, any>;
  action?: Dispatch<SetStateAction<boolean>>;
  ids? : any;
};

export type PutOptions = {
  endpoint?: string;
  token: TAuth | null; // Ajuste para aceptar null
  verificar_token: (token: TAuth | null) => Promise<string | false | undefined>; // Ajuste para aceptar null
  data?: any;
  id?: number;
  mensaje?: string;
  action?: Dispatch<SetStateAction<boolean>>
  params?: Record<string, any>
};