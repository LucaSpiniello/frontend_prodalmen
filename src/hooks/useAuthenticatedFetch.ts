import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useAuth } from '../context/authContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { GUARDAR_TOKENS } from '../redux/slices/authSlice';
import Cookies from 'js-cookie'
import { fetchWithToken } from '../utils/peticiones.utils';
import toast from 'react-hot-toast';

interface IToken {
  access: string;
  refresh: string;
}

interface IUseAuthenticatedFetchResult<T> {
  loading: boolean;
  data: T | null;
  error: string | null;
  setData: Dispatch<SetStateAction<T | null>>;
  setRefresh: Dispatch<SetStateAction<boolean>>;
}

export const useAuthenticatedFetch = <T>(url: string): IUseAuthenticatedFetchResult<T> => {
  const auth = useAppSelector((state: RootState) => state.auth.authTokens)
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(true);
  const base_url = process.env.VITE_BASE_URL_DEV;
  const { verificarToken } = useAuth()

  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      try {
        setLoading(true);
  
        const token_verificado = await verificarToken(auth!)
  
        if (!token_verificado){
          throw new Error('Todo mal')
        } 
  
        const response = await fetchWithToken(url, token_verificado)
  
        if (response.ok) {
          const fetchedData: T = await response.json();
          setData(fetchedData);
        } else {
        }
        
      } catch (error: any) {
        setError(error.message);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1500)
      }
    };

    fetchData()
  
    return () => {
      isMounted = false;
      setRefresh(false)
    };
  }, [url, auth, base_url, refresh]);


  return {
    loading,
    data,
    error,
    setData,
    setRefresh
  };
};

