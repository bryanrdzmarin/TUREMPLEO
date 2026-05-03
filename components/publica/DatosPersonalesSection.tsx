/**
 * DatosPersonalesSection - Sección del formulario que recopila toda la información
 * personal del solicitante: nombres, apellidos, CI, teléfonos, fecha de nacimiento,
 * edad, sexo, color de piel/pelo, peso, estatura, estado civil, lugar de nacimiento,
 * nombres de padres, dirección completa y teléfonos adicionales (particular, laboral, familiar).
 *
 * Props:
 *   errors: Objeto con los errores de validación de cada campo
 *   onFechaNacimientoChange: Handler para calcular edad al seleccionar fecha
 *   onPesoChange: Handler para validar peso
 *   onEstaturaChange: Handler para validar estatura
 *   inputClass: Función que devuelve las clases CSS según si hay error
 *   errorClass: Clases CSS para mostrar mensajes de error
 *   fechaMinima: Fecha mínima permitida (hace 100 años)
 *   fechaMaxima: Fecha máxima permitida (hace 18 años)
 */
import { FormErrors } from "./types";

interface DatosPersonalesSectionProps {
  errors: FormErrors;
  onFechaNacimientoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPesoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEstaturaChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputClass: (hasError: boolean) => string;
  errorClass: string;
  fechaMinima: string;
  fechaMaxima: string;
}

export default function DatosPersonalesSection({
  errors,
  onFechaNacimientoChange,
  onPesoChange,
  onEstaturaChange,
  inputClass,
  errorClass,
  fechaMinima,
  fechaMaxima,
}: DatosPersonalesSectionProps) {
  return (
    <>
      <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
        <h2 className="text-xl font-semibold text-[#002A8F]">Datos Personales</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombres <span className="text-red-500">*</span>
          </label>
          <input type="text" name="nombre" className={inputClass(!!errors.nombre)} />
          {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            1er Apellido <span className="text-red-500">*</span>
          </label>
          <input type="text" name="primerApellido" className={inputClass(!!errors.primerApellido)} />
          {errors.primerApellido && <p className={errorClass}>{errors.primerApellido}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            2do Apellido <span className="text-red-500">*</span>
          </label>
          <input type="text" name="segundoApellido" className={inputClass(!!errors.segundoApellido)} />
          {errors.segundoApellido && <p className={errorClass}>{errors.segundoApellido}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            No. Carné de Identidad <span className="text-red-500">*</span>
          </label>
          <input type="text" name="ci" maxLength={11} placeholder="11 dígitos" className={inputClass(!!errors.ci)} />
          {errors.ci && <p className={errorClass}>{errors.ci}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono <span className="text-red-500">*</span>
          </label>
          <input type="text" name="telefono" onChange={(e) => {
            let value = e.target.value.replace(/[^0-9+]/g, "");
            if (!value.startsWith("+53")) {
              value = "+53 " + value.replace(/[^0-9]/g, "");
            }
            const partes = value.split(" ");
            if (partes.length > 1 && partes[1].length > 8) {
              value = partes[0] + " " + partes[1].substring(0, 8);
            }
            e.target.value = value;
          }} placeholder="+53 51234567" maxLength={13} className={inputClass(!!errors.telefono)} />
          {errors.telefono && <p className={errorClass}>{errors.telefono}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
          <input type="date" name="fechaNacimiento" onChange={onFechaNacimientoChange} min={fechaMinima} max={fechaMaxima} className={inputClass(!!errors.fechaNacimiento)} />
          {errors.fechaNacimiento && <p className={errorClass}>{errors.fechaNacimiento}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Edad</label>
          <input type="number" name="edad" min="18" max="100" className={inputClass(!!errors.edad)} readOnly />
          {errors.edad && <p className={errorClass}>{errors.edad}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexo <span className="text-red-500">*</span>
          </label>
          <select name="sexo" className={inputClass(!!errors.sexo)}>
            <option value="">Seleccione</option>
            <option value="masculino">Masculino</option>
            <option value="femenino">Femenino</option>
          </select>
          {errors.sexo && <p className={errorClass}>{errors.sexo}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color de Piel <span className="text-red-500">*</span>
          </label>
          <select name="colorPiel" className={inputClass(!!errors.colorPiel)}>
            <option value="">Seleccione</option>
            <option value="blanca">Blanca</option>
            <option value="mestiza">Mestiza</option>
            <option value="negra">Negra</option>
          </select>
          {errors.colorPiel && <p className={errorClass}>{errors.colorPiel}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color de Pelo <span className="text-red-500">*</span>
          </label>
          <select name="colorPelo" className={inputClass(!!errors.colorPelo)}>
            <option value="">Seleccione</option>
            <option value="negro">Negro</option>
            <option value="castaño">Castaño</option>
            <option value="rubio">Rubio</option>
            <option value="canoso">Canoso</option>
            <option value="otro">Otro</option>
          </select>
          {errors.colorPelo && <p className={errorClass}>{errors.colorPelo}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Peso (kg) <span className="text-red-500">*</span>
          </label>
          <input type="number" name="peso" min="30" max="250" step="0.1" onChange={onPesoChange} className={inputClass(!!errors.peso)} />
          {errors.peso && <p className={errorClass}>{errors.peso}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estatura (cm) <span className="text-red-500">*</span>
          </label>
          <input type="number" name="estatura" min="100" max="230" onChange={onEstaturaChange} className={inputClass(!!errors.estatura)} />
          {errors.estatura && <p className={errorClass}>{errors.estatura}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado Civil <span className="text-red-500">*</span>
          </label>
          <select name="estadoCivil" className={inputClass(!!errors.estadoCivil)}>
            <option value="">Seleccione</option>
            <option value="soltero">Soltero/a</option>
            <option value="casado">Casado/a</option>
            <option value="divorciado">Divorciado/a</option>
            <option value="viudo">Viudo/a</option>
          </select>
          {errors.estadoCivil && <p className={errorClass}>{errors.estadoCivil}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Municipio de Nacimiento <span className="text-red-500">*</span>
          </label>
          <input type="text" name="municipioNacimiento" className={inputClass(!!errors.municipioNacimiento)} />
          {errors.municipioNacimiento && <p className={errorClass}>{errors.municipioNacimiento}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Padre <span className="text-red-500">*</span>
          </label>
          <input type="text" name="nombrePadre" className={inputClass(!!errors.nombrePadre)} />
          {errors.nombrePadre && <p className={errorClass}>{errors.nombrePadre}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la Madre <span className="text-red-500">*</span>
          </label>
          <input type="text" name="nombreMadre" className={inputClass(!!errors.nombreMadre)} />
          {errors.nombreMadre && <p className={errorClass}>{errors.nombreMadre}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección Particular <span className="text-red-500">*</span>
        </label>
        <input type="text" name="direccion" placeholder="Calle, No., Entre, etc." className={inputClass(!!errors.direccion)} />
        {errors.direccion && <p className={errorClass}>{errors.direccion}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reparto <span className="text-red-500">*</span>
          </label>
          <input type="text" name="reparto" className={inputClass(!!errors.reparto)} />
          {errors.reparto && <p className={errorClass}>{errors.reparto}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Municipio <span className="text-red-500">*</span>
          </label>
          <input type="text" name="municipio" className={inputClass(!!errors.municipio)} />
          {errors.municipio && <p className={errorClass}>{errors.municipio}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Provincia <span className="text-red-500">*</span>
          </label>
          <input type="text" name="provincia" className={inputClass(!!errors.provincia)} />
          {errors.provincia && <p className={errorClass}>{errors.provincia}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Particular <span className="text-red-500">*</span>
          </label>
          <input type="text" name="telefonoParticular" onChange={(e) => {
            let value = e.target.value;
            if (!value.startsWith("+53")) {
              value = "+53 " + value.replace(/[^0-9]/g, "");
            }
            const partes = value.split(" ");
            if (partes.length > 1 && partes[1].length > 8) {
              value = partes[0] + " " + partes[1].substring(0, 8);
            }
            e.target.value = value;
          }} placeholder="+53 51234567" maxLength={13} className={inputClass(!!errors.telefonoParticular)} />
          {errors.telefonoParticular && <p className={errorClass}>{errors.telefonoParticular}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Laboral <span className="text-red-500">*</span>
          </label>
          <input type="text" name="telefonoLaboral" onChange={(e) => {
            let value = e.target.value;
            if (!value.startsWith("+53")) {
              value = "+53 " + value.replace(/[^0-9]/g, "");
            }
            const partes = value.split(" ");
            if (partes.length > 1 && partes[1].length > 8) {
              value = partes[0] + " " + partes[1].substring(0, 8);
            }
            e.target.value = value;
          }} placeholder="+53 51234567" maxLength={13} className={inputClass(!!errors.telefonoLaboral)} />
          {errors.telefonoLaboral && <p className={errorClass}>{errors.telefonoLaboral}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono Familiar <span className="text-red-500">*</span>
          </label>
          <input type="text" name="telefonoFamiliar" onChange={(e) => {
            let value = e.target.value;
            if (!value.startsWith("+53")) {
              value = "+53 " + value.replace(/[^0-9]/g, "");
            }
            const partes = value.split(" ");
            if (partes.length > 1 && partes[1].length > 8) {
              value = partes[0] + " " + partes[1].substring(0, 8);
            }
            e.target.value = value;
          }} placeholder="+53 51234567" maxLength={13} className={inputClass(!!errors.telefonoFamiliar)} />
          {errors.telefonoFamiliar && <p className={errorClass}>{errors.telefonoFamiliar}</p>}
        </div>
      </div>
    </>
  );
}
