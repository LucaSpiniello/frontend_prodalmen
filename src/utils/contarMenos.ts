export function tieneTresOMasMenoresQueValor(estados: string[], valor: number): boolean {
    let contador = 0;

    for (const estado of estados) {
        if (parseInt(estado) < valor) {
            contador++;
        }
        if (contador >= 3) {
            return false;
        }
    }
    
    return true;
}


