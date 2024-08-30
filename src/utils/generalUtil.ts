import { ESTADOS_MP, TIPO_INFORME } from "./constante";

export const cargolabels = (perfilData: any) => {
   if (!perfilData) {
     return [];
   }
 
   const cargoLabels = perfilData.cargos.map((cargo: any) => cargo.cargo_label) || [];
 
   return cargoLabels;
 }

export function transformLabel(key: string): string {
  let label = key.replace(/_/g, ' '); // Reemplazar guiones bajos por espacios
  label = label.charAt(0).toUpperCase() + label.slice(1); // Capitalizar la primera letra
  
  // Insertar guion entre números si corresponde
  label = label.replace(/(\d+)\s(\d+)/g, '$1-$2');
  
  return label;
}

export const estadoRecepcion = ESTADOS_MP?.map((estado) => ({
  value: String(estado.value),
  label: estado.label
})) ?? []

export const tipo_informe = TIPO_INFORME.map((informe) => ({
  value: String(informe.value),
  label: informe.label
})) ?? []


export function chartData(lista: any) {
  const labels: string[] = [];
  const valores: number[] = [];
  
  if (lista.length === 0) {
    return { labels, valores };
  }
  
  const keys = Object.keys(lista[0]);
  const indexToRemove = keys.indexOf('cc_lote');
  
  if (indexToRemove !== -1) {
    keys.splice(indexToRemove, 1);
  }
  
  lista.forEach((item: any) => {
    keys.forEach(key => {
      if (key !== 'cc_lote') {
        const porcentaje = item[key];
        const label = transformLabel(key);
        labels.push(`${label}: ${porcentaje.toFixed(1)}%`);
        valores.push(porcentaje);
      }
    });
  });
  
  return { labels, valores };
}


import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

export function calculateDateDifference(startDate: any) {
  const now = new Date();

  // Calcular la diferencia en días
  const daysDifference = differenceInDays(now, new Date(startDate));

  // Calcular la diferencia total en horas
  const hoursDifferenceTotal = differenceInHours(now, new Date(startDate));

  // Calcular las horas restantes después de contar los días
  const hoursDifference = hoursDifferenceTotal - (daysDifference * 24);

  // Calcular la diferencia total en minutos
  const minutesDifferenceTotal = differenceInMinutes(now, new Date(startDate));

  // Calcular los minutos restantes después de contar los días y horas
  const minutesDifference = minutesDifferenceTotal - (daysDifference * 24 * 60) - (hoursDifference * 60);

  return `${daysDifference} Día, ${hoursDifference} Horas, ${minutesDifference} Minutos`

}


export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}



export function americaDate() {
  const hoy = new Date()
  const formatter = new Intl.DateTimeFormat('es-CL', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
    timeZone: 'America/Santiago' // Zona horaria de Chile
  });

  const parts = formatter.formatToParts(hoy);
  const hoyLocal = `${parts.find(part => part.type === 'year')?.value}-${parts.find(part => part.type === 'month')?.value}-${parts.find(part => part.type === 'day')?.value}T${parts.find(part => part.type === 'hour')?.value}:${parts.find(part => part.type === 'minute')?.value}:${parts.find(part => part.type === 'second')?.value}.000Z`;
  return hoyLocal
}