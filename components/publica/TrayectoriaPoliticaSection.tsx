/**
 * TrayectoriaPoliticaSection - Sección del formulario que recopila información sobre
 * la trayectoria política del solicitante: organizaciones a las que ha pertenecido,
 * períodos (desde/hasta) y condecoraciones recibidas.
 */
export default function TrayectoriaPoliticaSection() {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Trayectoria Política</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Organizaciones, Desde, Hasta, Condecoraciones
        </label>
        <textarea name="trayectoriaPolitica" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none" />
      </div>
    </>
  );
}
