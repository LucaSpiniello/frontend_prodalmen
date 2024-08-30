import axios, { CancelTokenSource } from 'axios'


const api = axios.create({
  baseURL: process.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de respuesta
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    handleGlobalError(error);
    return Promise.reject(error);
  }
);

function handleGlobalError(error: any) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        console.error(`Solicitud incorrecta: ${data.message || 'Error de cliente'}`);
        break;
      case 401:
        console.error('No autorizado. Redirigiendo al login...');
        break;
      case 403:
        console.error('Prohibido: No tienes permiso para realizar esta acción.');
        break;
      case 404:
        console.error('Recurso no encontrado.');
        break;
      case 500:
        console.error('Error interno del servidor.');
        break;
      default:
        console.error(`Error inesperado: ${data.message || 'Ocurrió un error'}`);
    }
  } else if (error.request) {
    console.error('No se recibió respuesta del servidor. Verifica tu conexión a internet.');
  } else {
    console.error(`Error al configurar la solicitud: ${error.message}`);
  }
}


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function retryRequest(fn: () => Promise<any>, retries: number = 3, delayTime: number = 1000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i < retries - 1) {
        console.warn(`Intento ${i + 1} fallido. Reintentando en ${delayTime}ms...`);
        await delay(delayTime);
      } else {
        throw error;
      }
    }
  }
}


const createCancelToken = () => axios.CancelToken.source();

export async function fetchWithTokenPost(url: string, data: any, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}


export async function fetchWithTokenPostAction(url: string, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.post(url, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}

export async function fetchWithTokenPostWithFormData(url: string, data: any, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.post(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}


export async function fetchWithToken(url: string, token: string, cancelToken?: CancelTokenSource): Promise<any> {
  const response = await api.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    cancelToken: cancelToken ? cancelToken.token : undefined,
  });
  return response;
}



export async function fetchWithTokenPut(url: string, data: any, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.put(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}


export async function fetchWithTokenPutWithFiles(url: string, data: any, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.put(url, data, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}


export async function fetchWithTokenPatchAction(url: string, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.patch(url, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}

export async function fetchWithTokenPatch(url: string, data?: any, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
  const response = await api.patch(url, data, {
    headers: {
      'Authorization': `Bearer ${token}`,

    },
    cancelToken: cancelToken ? cancelToken.token : undefined,
  });
  return response.data;
}


export async function fetchWithTokenDelete(url: string, token?: string, cancelToken?: CancelTokenSource): Promise<any> {
    const response = await api.delete(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cancelToken: cancelToken ? cancelToken.token : undefined,
    });
    return response.data;
}


