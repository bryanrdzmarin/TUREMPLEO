/**
 * ExperienciaTurismoSection - Sección del formulario que pregunta si el solicitante
 * ha trabajado en el Sistema de Turismo y, de ser afirmativo, muestra un textarea
 * para que detalle los centros donde ha trabajado, cargos ocupados y motivos de baja.
 *
 * Props:
 *   errors: Objeto con errores de validación (experienciaTurismo)
 *   haTrabajadoChecked: Estado del checkbox principal
 *   onToggle: Callback cuando se activa/desactiva el checkbox
 *   inputClass: Función que devuelve las clases CSS según si hay error
 *   errorClass: Clases CSS para mostrar mensajes de error
 */
import { FormErrors } from "./types";

interface ExperienciaTurismoSectionProps {
  errors: FormErrors;
  haTrabajadoChecked: boolean;
  onToggle: (checked: boolean) => void;
  inputClass: (hasError: boolean) => string;
  errorClass: string;
}

export default function ExperienciaTurismoSection({
  errors,
  haTrabajadoChecked,
  onToggle,
  inputClass,
  errorClass,
}: ExperienciaTurismoSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Experiencia en Turismo <span className="text-red-500">*</span></h2>
      </div>

      <div>
        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" name="haTrabajadoTurismo" className="w-4 h-4 text-[#002A8F]" onChange={(e) => onToggle(e.target.checked)} />
          <span className="text-sm text-gray-700">¿Ha sido usted empleado en el Sistema de Turismo?</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Centros donde ha trabajado</label>
        <textarea name="experienciaTurismo" rows={4} disabled={!haTrabajadoChecked} className={`${inputClass(!!errors.experienciaTurismo)} ${!haTrabajadoChecked ? "bg-gray-100 cursor-not-allowed" : ""}`} placeholder={haTrabajadoChecked ? "Centro, Cargos, Motivos de baja" : "Seleccione primero si ha trabajado en Turismo"} />
        {errors.experienciaTurismo && <p className={errorClass}>{errors.experienciaTurismo}</p>}
      </div>
    </>
  );
}
