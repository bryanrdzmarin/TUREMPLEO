/**
 * EscolaridadSection - Sección del formulario que recopila la información académica
 * del solicitante: checkboxes para seleccionar el/los nivel(es) escolar(es) alcanzados
 * y un campo de texto para la especialidad.
 *
 * Props:
 *   errors: Objeto con los errores de validación de nivelEscolar y especialidad
 *   inputClass: Función que devuelve las clases CSS según si hay error
 *   errorClass: Clases CSS para mostrar mensajes de error
 */
import { FormErrors } from "./types";

interface EscolaridadSectionProps {
  errors: FormErrors;
  inputClass: (hasError: boolean) => string;
  errorClass: string;
}

export default function EscolaridadSection({ errors, inputClass, errorClass }: EscolaridadSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Nivel Escolar <span className="text-red-500">*</span></h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nivelEscolar" value="primaria" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Primaria</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nivelEscolar" value="secundaria" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Secundaria</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nivelEscolar" value="preuniversitario" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Pre-Universitario</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nivelEscolar" value="tecnico" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Técnico Medio</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="nivelEscolar" value="universitario" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Universitario</span>
        </label>
      </div>
      {errors.nivelEscolar && <p className={errorClass}>{errors.nivelEscolar}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Especialidad <span className="text-red-500">*</span>
        </label>
        <input type="text" name="especialidad" className={inputClass(!!errors.especialidad)} />
        {errors.especialidad && <p className={errorClass}>{errors.especialidad}</p>}
      </div>
    </>
  );
}
