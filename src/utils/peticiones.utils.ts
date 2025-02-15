const base_url = process.env.VITE_BASE_URL;

export async function fetchWithTokenPost(url: string, data: any, token?: any): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response;
}

export async function fetchWithTokenPostFile(url: string, data: any, token?: any): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  });
  return response;
}

export async function fetchWithTokenPostAction(url: string, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

export async function fetchWithTokenPostWithFormData(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  });
  return response;
}

export async function fetchWithTokenPostWithBody(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });
  return response;
}


export async function fetchWithToken(url: string, token: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

export async function fetchWithTokenPut(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response;
}

export async function fetchWithTokenPutWithFiles(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  });
  return response;
}

export async function fetchWithTokenPatchAction(url: string, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return response;
}

export async function fetchWithTokenDelete(url: string, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });
  return response;
}

export async function fetchWithTokenDeleteAction(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response;
}



export async function fetchWithTokenPatch(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return response;
  
}

export async function fetchWithTokenPatchWithFormData(url: string, data: any, token?: string): Promise<Response> {
  const response = await fetch(`${base_url}/${url}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: data
  });
  return response;
}



