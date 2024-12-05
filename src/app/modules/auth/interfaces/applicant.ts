export interface Applicant {
  nombre: string;
  genero: string;
  lugar_nac: string;
  fecha_exp_di: Date;
  fecha_nac: Date;
  no_documento: string;
  correoPersonal: string;
  departamento_residencia: string;
  municipio_residencia: string;
  direccion_residencia: string;
  telefono: string;
  empresa_trabajo: string;
  pais_trabajo: string;
  departamento_trabajo: string;
  municipio_trabajo: string;
  direccion_trabajo: string;
  estudios_pregrado: string;
  estudios_posgrado: string;
  exp_laboral: string;
  es_egresado_ufps: boolean;
  sala_entrevista: string;
  fecha_entrevista: string;
}
