export interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
  funciones: string;
  activo: boolean;
}

export interface FormErrors {
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  ci?: string;
  fechaNacimiento?: string;
  email?: string;
  telefono?: string;
  telefonoParticular?: string;
  telefonoLaboral?: string;
  telefonoFamiliar?: string;
  edad?: string;
  peso?: string;
  estatura?: string;
  plazaId?: string;
  sexo?: string;
  colorPiel?: string;
  colorPelo?: string;
  estadoCivil?: string;
  municipioNacimiento?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  direccion?: string;
  reparto?: string;
  municipio?: string;
  provincia?: string;
  nivelEscolar?: string;
  especialidad?: string;
  experienciaTurismo?: string;
  fuenteProcedencia?: string;
  otraFuente?: string;
}

export interface RequisitosData {
  tieneFormato: boolean;
  lista: string[];
  opcionesMultiple: { texto: string; opciones: string[] }[];
}
