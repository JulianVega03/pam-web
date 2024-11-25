export interface User {
    id?:             number;
    nombre?:         string;
    apellido?:       string;
    correoPersonal?: string;
    telefono?:       string;
    estado?:         Estado;
}

export interface Estado {
    id?:          number;
    descripcion?: string;
}