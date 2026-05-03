/**
 * EvaluacionEntrevista - Sección de evaluación de entrevista visible exclusivamente
 * en el tab "citados". Muestra el candidato seleccionado y un botón "Evaluar" que
 * abre el modal de documentos aportados (ModalInfoForm) para aprobar o rechazar.
 */

import { Candidato } from "./hooks/useCandidatos";

interface EvaluacionEntrevistaProps {
  lista: Candidato[];
  candidatoSeleccionado: Candidato | null;
  onEvaluar: (candidato: Candidato) => void;
  enviando: boolean;
}

export function EvaluacionEntrevista({
  lista,
  candidatoSeleccionado,
  onEvaluar,
  enviando,
}: EvaluacionEntrevistaProps) {
  if (lista.length === 0) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Evaluación de Entrevista</h3>
      <p className="text-sm text-gray-500 mb-4">
        Selecciona un candidato de la tabla para evaluar
      </p>

      {candidatoSeleccionado ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            <strong>{candidatoSeleccionado.candidato.nombre}</strong> - {candidatoSeleccionado.candidato.ci}
          </span>
          <button
            onClick={() => onEvaluar(candidatoSeleccionado)}
            disabled={enviando}
            className="px-6 py-2 bg-[#002A8F] text-white rounded-lg hover:bg-[#003CB5] transition-colors disabled:opacity-50 font-medium"
          >
            Evaluar
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">Clic en un candidato para seleccionarlo</p>
      )}
    </div>
  );
}
