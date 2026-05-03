/**
 * PlazaYRequisitosSection - Sección del formulario que permite seleccionar la plaza
 * solicitada de un dropdown y, una vez seleccionada, muestra los requisitos de esa plaza
 * para que el usuario marque los que cumple. Soporta requisitos simples (checkboxes),
 * opciones múltiples (radio buttons) y un fallback de texto libre si los requisitos
 * no tienen formato estructurado.
 *
 * Props:
 *   plazas: Lista de plazas disponibles
 *   plazaIdParam: ID de la plaza preseleccionada desde la URL
 *   errors: Objeto con errores de validación (plazaId)
 *   plazaSeleccionada: La plaza actualmente seleccionada
 *   onPlazaChange: Callback cuando se cambia de plaza
 *   requisitosData: Datos parseados de los requisitos
 *   requisitosCumplidos: Lista de requisitos que el usuario marca como cumplidos
 *   onRequisitosChange: Callback para actualizar requisitos cumplidos
 *   requisitosSeleccionadosMultiple: Selecciones de opciones múltiples
 *   onRequisitosMultipleChange: Callback para actualizar selecciones múltiples
 *   requisitosTexto: Texto libre de requisitos cuando no hay formato
 *   onRequisitosTextoChange: Callback para actualizar texto de requisitos
 *   inputClass: Función que devuelve las clases CSS según si hay error
 *   errorClass: Clases CSS para mostrar mensajes de error
 */
import { Plaza, FormErrors, RequisitosData } from "./types";

interface PlazaYRequisitosSectionProps {
  plazas: Plaza[];
  plazaIdParam: string | null;
  errors: FormErrors;
  plazaSeleccionada: Plaza | null;
  onPlazaChange: (plaza: Plaza | null) => void;
  requisitosData: RequisitosData;
  requisitosCumplidos: string[];
  onRequisitosChange: (requisitos: string[]) => void;
  requisitosSeleccionadosMultiple: { [key: string]: string };
  onRequisitosMultipleChange: (seleccionados: { [key: string]: string }) => void;
  requisitosTexto: string;
  onRequisitosTextoChange: (texto: string) => void;
  inputClass: (hasError: boolean) => string;
  errorClass: string;
}

export default function PlazaYRequisitosSection({
  plazas,
  plazaIdParam,
  errors,
  plazaSeleccionada,
  onPlazaChange,
  requisitosData,
  requisitosCumplidos,
  onRequisitosChange,
  requisitosSeleccionadosMultiple,
  onRequisitosMultipleChange,
  requisitosTexto,
  onRequisitosTextoChange,
  inputClass,
  errorClass,
}: PlazaYRequisitosSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Plaza Solicitada</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Seleccione la plaza <span className="text-red-500">*</span>
        </label>
        <select
          name="plazaId"
          defaultValue={plazaIdParam || ""}
          className={inputClass(!!errors.plazaId)}
          onChange={(e) => {
            const plazaId = parseInt(e.target.value);
            const plaza = plazas.find(p => p.id === plazaId) || null;
            onPlazaChange(plaza);
          }}
        >
          <option value="">Seleccione una plaza</option>
          {plazas.map((plaza) => (
            <option key={plaza.id} value={plaza.id}>{plaza.nombre}</option>
          ))}
        </select>
        {errors.plazaId && <p className={errorClass}>{errors.plazaId}</p>}
      </div>

      {plazaSeleccionada && requisitosData.lista.length > 0 && (
        <>
          <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
            <h2 className="text-xl font-semibold text-[#002A8F]">Requisitos de la Plaza</h2>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-3">
              A continuación se muestran los requisitos de la plaza seleccionada.
              Seleccione aquellos que usted cumple (están marcados por defecto):
            </p>

            {requisitosData.tieneFormato ? (
              <div className="space-y-3">
                {requisitosData.opcionesMultiple.map((item, idx) => (
                  <div key={`multi-${idx}`} className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">Seleccione una opción:</p>
                    <div className="flex flex-wrap gap-3">
                      {item.opciones.map((opcion, opIdx) => (
                        <label key={opIdx} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`opcionMultiple-${idx}`}
                            value={opcion}
                            checked={requisitosSeleccionadosMultiple[`${idx}`] === opcion}
                            onChange={(e) => {
                              onRequisitosMultipleChange({
                                ...requisitosSeleccionadosMultiple,
                                [idx]: e.target.value
                              });
                            }}
                            className="w-4 h-4 text-[#002A8F]"
                          />
                          <span className="text-sm text-gray-700">{opcion}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {requisitosData.lista.map((req, index) => (
                  <label key={index} className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="requisitosCumplidos"
                      value={req}
                      checked={requisitosCumplidos.includes(req)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onRequisitosChange([...requisitosCumplidos, req]);
                        } else {
                          onRequisitosChange(requisitosCumplidos.filter(r => r !== req));
                        }
                      }}
                      className="w-4 h-4 mt-1 text-[#002A8F] rounded"
                    />
                    <span className="text-sm text-gray-700">{req}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{plazaSeleccionada.requisitos}</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Indique los requisitos que cumple:</label>
                <textarea
                  name="requisitosCumplidosTexto"
                  rows={4}
                  value={requisitosTexto}
                  onChange={(e) => onRequisitosTextoChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                  placeholder="Liste los requisitos que cumple..."
                />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
