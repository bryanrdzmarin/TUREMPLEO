/**
 * SuccessView - Componente que muestra la pantalla de éxito después de enviar
 * la solicitud de empleo. Presenta el PIN de seguimiento y botones para volver
 * al inicio o consultar el estado de la solicitud.
 *
 * Props:
 *   token: El PIN de seguimiento generado por la API
 *   onHome: Callback para navegar al inicio
 *   onEstado: Callback para navegar a la página de consultar estado
 */
interface SuccessViewProps {
  token: string | null;
  onHome: () => void;
  onEstado: () => void;
}

export default function SuccessView({ token, onHome, onEstado }: SuccessViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#002A8F] mb-2">Solicitud Enviada</h2>
          <p className="text-gray-600 mb-4">
            Su solicitud ha sido registrada exitosamente.
          </p>
          {token && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 mb-6">
              <p className="text-sm text-blue-700 font-semibold mb-2">Su PIN de seguimiento:</p>
              <p className="text-4xl font-mono font-bold text-[#002A8F] tracking-widest">{token}</p>
              <p className="text-xs text-blue-600 mt-3">Guarde este PIN para consultar el estado de su solicitud</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onHome}
              className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Volver al Inicio
            </button>
            <button
              onClick={onEstado}
              className="px-6 py-2 bg-[#002A8F] text-white font-semibold rounded-lg hover:bg-[#003a99] transition-colors"
            >
              Consultar Estado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
