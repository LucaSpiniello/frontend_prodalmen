
export default function startWebSocket({access, url} : {access: string | undefined, url: string}) {
    const socket = new WebSocket(`ws://${process.env.VITE_WEB}/${url}/?token=${access}`);
    socket.onopen = () => {
        console.log('WebSocket connected');
        // socket.send('{"accion": "get_clase_actual_y_siguiente"}')
        // x = setInterval(() => {
        //     socket.send('{"accion": "get_clase_actual_y_siguiente"}')
        // }, 1000 * 5)
        // setSocketState(socket)
    };

    // socket.onmessage = (event) => {
    //     console.log('Message received:', event.data);
    //     const data: {type: string, clase_actual: IWebDocenteClase | null, siguiente_clase: IWebDocenteClase | null} = JSON.parse(event.data)
    //     if (data.type === "clase_actual_y_siguiente") {
    //         const clase_actual: IWebDocenteClase | null = data.clase_actual
    //         console.log(clase_actual)
    //     }
    // };

    socket.onclose = async (e) => {
        console.log('WebSocket close: ' + e)
        // if (e.code === 4001) {
        //     try {
        //         const refresh = Cookies.get('refresh');
        //         const response = await axios.post<{access: string}>(`${import.meta.env.VITE_API_URL}/auth/jwt/refresh/`, {refresh: refresh}, {headers: {'Content-Type': 'application/json'}})
        //         const data = response.data
        //         dispatch(GUARDAR_TOKEN(data.access))
        //         Cookies.set('access', response.data.access);
        //     } catch {
        //         console.log('fallo refresh')
        //     }
        // }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return socket
}