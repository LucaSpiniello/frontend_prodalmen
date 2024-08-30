export function urlNumeros(url: string) {
  // Buscar todos los grupos de dígitos en la URL
  const digitos = url.match(/\d+/g);

  // Convertir cada grupo de dígitos a un número entero
  const numeros = digitos ? digitos.map(Number) : [];

  // Retornar la lista de números
  return numeros;
}
