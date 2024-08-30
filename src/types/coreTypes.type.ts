export type TProgramasInfo = {
    tipo_programa: string,
    total_kilos_introducidos: number,
    total_kilos_resultantes: number
}


export type TContentTypes = {
    id: number
    model: string
    app_label: string
}

export type UserMe = {
    id: number
    first_name: string
    second_name: string
    last_name: string
    second_last_name: string
    email: string
    username: string
    genero: string
    fecha_nacimiento: string
    rut: string,
    image: File
    is_staff: boolean
  }
  
export type UserGroups = {
    groups: {
      grupo: string
    }
  }
  
export  type Usuario = {
    id: number
    first_name: string
    last_name: string
  }