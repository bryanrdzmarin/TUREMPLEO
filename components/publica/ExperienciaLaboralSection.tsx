/**
 * ExperienciaLaboralSection - Sección del formulario que recopila la experiencia
 * laboral del solicitante: profesiones u oficios, idiomas (con nivel y dónde lo adquirió),
 * cursos realizados y licencia de conducción.
 *
 * Props:
 *   inputClass: Función que devuelve las clases CSS para los inputs
 */
interface ExperienciaLaboralSectionProps {
  inputClass: (hasError: boolean) => string;
}

export default function ExperienciaLaboralSection({ inputClass }: ExperienciaLaboralSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Experiencia Laboral</h2>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profesiones u oficios</label>
        <textarea name="profesiones" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none" placeholder="Liste sus profesiones u oficios" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Idiomas</label>
        <textarea name="idiomas" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none" placeholder="Idioma, Nivel, Dónde lo adquirió" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Cursos Realizados</label>
        <textarea name="cursos" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none" placeholder="Liste los cursos que ha realizado" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Licencia de Conducción</label>
        <input type="text" name="licenciaConduccion" placeholder="Tipo de licencia" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none" />
      </div>
    </>
  );
}
