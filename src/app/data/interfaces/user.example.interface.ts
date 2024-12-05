export interface User {
    id?:               number;
    nombre?:           string;
    apellido?:         string;
    correoPersonal?:   string;
    telefono?:         string;
    estado?:           Estado;
    sala_entrevista?:  string;
    fecha_entrevista?: string;
}

export interface Estado {
    id?:          number;
    descripcion?: string;
}