export interface ColombianStatesAndCities{
  id:           number;
  departamento: string;
  ciudades:     string[];
}

export interface ColombianState {
  region:                       Region;
  c_digo_dane_del_departamento: string;
  departamento:                 string;
  c_digo_dane_del_municipio:    string;
  municipio:                    string;
}

export enum Region {
  RegiónCaribe = "Región Caribe",
  RegiónCentroOriente = "Región Centro Oriente",
  RegiónCentroSur = "Región Centro Sur",
  RegiónEjeCafeteroAntioquia = "Región Eje Cafetero - Antioquia",
  RegiónLlano = "Región Llano",
  RegiónPacífico = "Región Pacífico",
}

