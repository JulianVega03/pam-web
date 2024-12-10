export interface User {
    id?:                 number;
    nombre?:             string;
    apellido?:           string;
    correoPersonal?:     string;
    telefono?:           string;
    estado?:             Estado;
    sala_entrevista?:    string;
    fecha_entrevista?:   string;
    puntaje_entrevista?: number;
    es_egresado_ufps?: string;
    
    genero?: string;
    fecha_nac?: string;
    no_documento?: string;
    fecha_exp_di?: string;
    lugar_nac?: string;
    departamento_residencia?: string;
    municipio_residencia?: string;
    direccion_residencia?: string;

    pais_trabajo?: string;
    departamento_trabajo?: string;
    municipio_trabajo?: string;
    direccion_trabajo?: string;

    estudios_pregrado?: string;
    estudios_posgrados?: string;
    exp_laboral?: string;

    puntaje_prueba?: string;

    documentType?: string;
    estadoCivilTypes?: string;
    grupoEtnicoTypes?: string;
    puebloIndigenaTypes?: string;
    poseeDiscapacidadTypes?: string;
    capacidadxcepcionalTypes?: string;

    empresa_trabajo?: string;
    tipoVinculacionTypes?: string;
    promedioPregrado?: string;

    otroPueblo?: string;
    discapacidadTypes?: string;
    lugarExpedicion?: string;
}

export interface Estado {
    id?:          number;
    descripcion?: string;
}