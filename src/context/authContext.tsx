import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { appPages, authPages } from '../config/pages.config';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { GUARDAR_PERSONALIZACION, GUARDAR_TOKENS, GUARDAR_USER, GUARDAR_GRUPO } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import toast from 'react-hot-toast';
import useDarkMode from '../hooks/useDarkMode';
import Cookies from 'js-cookie'
import { TAuth, TPersonalizacion, TUser } from '../types/TypesRegistros.types';
import { fetchWithToken, fetchWithTokenPost } from '../utils/peticiones.utils';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from '@reduxjs/toolkit';

export interface IAuthContextProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
  verificarToken: (token: TAuth | null) => Promise<string | false | undefined>;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: FC<IAuthProviderProps> = ({ children }) => {
	const auth = useAppSelector((state: RootState) => state.auth.authTokens)
  const dataUser = useAppSelector((state: RootState) => state.auth.dataUser)
  const { setDarkModeStatus } = useDarkMode();
	const navigate = useNavigate();
	const dispatch = useDispatch<ThunkDispatch<any, any, any>>()
  const [token_previo, setTokenPrevio] = useState<string>('')


  useEffect(() => {
    const verificar_token_cookie_redux_y_logeado = async () => {
      const tokenCookies = Cookies.get('token')
      if (tokenCookies){
        const token: TAuth = JSON.parse(tokenCookies)
        const verify = await verificar_token(token)
        if (verify) {
          dispatch(GUARDAR_TOKENS({ access: token.access, refresh: token.refresh }))
        } else {
          Cookies.remove('token')
          navigate(`${authPages.loginPage.to}`, { replace: true })
        }
      } else {
        Cookies.remove('token')
        navigate(`${authPages.loginPage.to}`, { replace: true })
      }
    }
    verificar_token_cookie_redux_y_logeado()
  }, [])

  useEffect(() => {
    if (auth) {
      const verificacion_token = async () => {
        const token_validado = await verificar_token(auth!)
    
        if (token_validado){
          if (!dataUser) {
            await obtener_perfil(auth?.access!)
          }
        }
      }
    
      verificacion_token()
    }
  }, [auth])


  const onLogin = async (email:string, password: string) => {
    const responsePost = await fetch(`${process.env.VITE_BASE_URL}/auth/jwt/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })
    
    if (responsePost.ok) {
      const dataPost: TAuth = await responsePost.json()
      dispatch(GUARDAR_TOKENS(dataPost))
      setTokenPrevio(dataPost.access)
      await obtener_perfil(dataPost.access)
      Cookies.set('token', JSON.stringify(dataPost), { expires: 1 })
      toast.success("Has ingresado correctamente")
      navigate(`${appPages.mainAppPages.to}`, { replace: true })

    } else {
      const data = await responsePost.json()
      toast.error(`No se ha encontrado la cuenta. Verifica tu correo y tu contraseña.`)
    }
  }



const obtener_perfil = async (token: string) => {
  const response_user = await fetchWithToken(`auth/users/me/`, token)

  if (response_user.ok){
    const data_user: TUser = await response_user.json()
    dispatch(GUARDAR_USER(data_user))

    const response_personalizacion = await fetchWithToken(`api/registros/personalizacion-perfil/${data_user.id}`, token)

    if (response_personalizacion.ok) {
      const data_personalizacion: TPersonalizacion = await response_personalizacion.json()
      dispatch(GUARDAR_PERSONALIZACION(data_personalizacion))
      setDarkModeStatus(data_personalizacion.estilo)
    }

    const response_grupos_usuario = await fetchWithToken(`api/user_groups/`, token)

    if (response_grupos_usuario.ok){
      const data_grupos_usuario = await response_grupos_usuario.json()
      dispatch(GUARDAR_GRUPO(data_grupos_usuario))
    }
  } 
}

const verificar_token = async (token: TAuth | null) => {
  const response_verificado = await fetchWithTokenPost(`auth/jwt/verify`, { token: token?.access } )

  if (response_verificado.ok){
    return token?.access
  } else if (response_verificado.status === 401) {
    const token_refrescado = await refresh_token(token?.refresh!)
    
    if (token_refrescado){
      return token_refrescado
    } else {
      return false
    }
  } else {
    return false
  }

}

const refresh_token = async (refresh: string) => {
  const response_refresh = await fetchWithTokenPost(`auth/jwt/refresh`, { refresh: refresh })

  if (response_refresh.ok){
    const data_refresh: { access: string } = await response_refresh.json()
    dispatch(GUARDAR_TOKENS({ access: data_refresh.access, refresh: refresh }))
    Cookies.set('token', JSON.stringify({ access: data_refresh.access, refresh: refresh }), { expires: 1 })
    return data_refresh.access
  } else if (response_refresh.status === 401){
    navigate('/login', { replace: true })
  } else {
    return false
  }
}

  const onLogout = async () => {
    dispatch(GUARDAR_TOKENS(null))
    dispatch(GUARDAR_USER(null))
    dispatch(GUARDAR_PERSONALIZACION(null))
    Cookies.remove('token')

    navigate(`../${authPages.loginPage.to}`, { replace: true });
  };

  const value: IAuthContextProps = {
    onLogin,
    onLogout,
    verificarToken: verificar_token
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
