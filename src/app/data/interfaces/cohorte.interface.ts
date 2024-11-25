export interface Cohorte {
  id?: number;
  fechaInicio: Date;
  fechaFin: Date;
  habilitado: boolean;
  enlace_entrevista: string;
  enlace_prueba: string;
  fechaMaxPrueba: Date;
}

export interface Evaluacion {
  link: string;
  fecha: Date;
}

export interface Puntaje {
  puntaje: number;
  message: string;
}

export interface DatosEval {
  fechaMaxPrueba: string,
  enlace_prueba: string,
  enlace_entrevista: string,
  fecha_entrevista: string
}
