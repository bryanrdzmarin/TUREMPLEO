/**
 * FuenteProcedenciaSection - Sección del formulario que recopila la fuente de
 * procedencia del solicitante mediante checkboxes: técnicos medios, desmovilizados
 * (SMG, MININT, MINFAR), trabajadores de otros sectores, reserva femenina, y una
 * opción "Otra" que muestra un campo de texto condicional para especificar.
 *
 * Props:
 *   errors: Objeto con errores de validación (fuenteProcedencia, otraFuente)
 *   otraFuenteSelected: Estado del checkbox "otra"
 *   onOtraFuenteToggle: Callback cuando se activa/desactiva el checkbox "otra"
 *   inputClass: Función que devuelve las clases CSS según si hay error
 *   errorClass: Clases CSS para mostrar mensajes de error
 */
import { FormErrors } from "./types";

interface FuenteProcedenciaSectionProps {
  errors: FormErrors;
  otraFuenteSelected: boolean;
  onOtraFuenteToggle: (checked: boolean) => void;
  inputClass: (hasError: boolean) => string;
  errorClass: string;
}

export default function FuenteProcedenciaSection({
  errors,
  otraFuenteSelected,
  onOtraFuenteToggle,
  inputClass,
  errorClass,
}: FuenteProcedenciaSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Fuente de Procedencia <span className="text-red-500">*</span></h2>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="tecnicosMedios" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Técnicos Medios de la reserva calificada del MTSS</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="desmovilizadosSMG" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Desmovilizados: SMG</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="desmovilizadosMININT" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Desmovilizados: MININT</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="desmovilizadosMINFAR" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Desmovilizados: MINFAR</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="trabajadoresOtrosSectores" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Trabajadores de otros sectores</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="fuenteProcedencia" value="reservaFemenina" className="w-4 h-4 text-[#002A8F]" />
          <span className="text-sm text-gray-700">Reserva femenina de las Direcciones de Trabajo</span>
        </label>
        <div className="mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="fuenteProcedencia" value="otra" className="w-4 h-4 text-[#002A8F]" onChange={(e) => onOtraFuenteToggle(e.target.checked)} />
            <span className="text-sm text-gray-700">Otra (especifique):</span>
          </label>
          <input type="text" name="otraFuente" className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none mt-1 ${!otraFuenteSelected ? 'hidden' : ''} ${errors.otraFuente ? 'border-red-500 bg-red-50' : 'border-gray-300'}`} placeholder="Especifique la fuente de procedencia" required={otraFuenteSelected} />
          {errors.otraFuente && otraFuenteSelected && <p className={errorClass}>{errors.otraFuente}</p>}
        </div>
      </div>
      {errors.fuenteProcedencia && <p className={errorClass}>{errors.fuenteProcedencia}</p>}
    </>
  );
}
