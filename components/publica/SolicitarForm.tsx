/**
 * SolicitarForm - Componente principal del formulario de solicitud de empleo.
 * Gestiona todo el estado global del formulario, las validaciones, el envío
 * a la API, y coordina todas las secciones hijas:
 *   - DatosPersonalesSection
 *   - EscolaridadSection
 *   - ExperienciaLaboralSection
 *   - ExperienciaTurismoSection
 *   - FuenteProcedenciaSection
 *   - TrayectoriaPoliticaSection
 *   - PlazaYRequisitosSection
 *
 * También maneja la vista de éxito (SuccessView) cuando la solicitud se envía correctamente.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import SuccessView from "./SuccessView";
import DatosPersonalesSection from "./DatosPersonalesSection";
import EscolaridadSection from "./EscolaridadSection";
import ExperienciaLaboralSection from "./ExperienciaLaboralSection";
import ExperienciaTurismoSection from "./ExperienciaTurismoSection";
import FuenteProcedenciaSection from "./FuenteProcedenciaSection";
import TrayectoriaPoliticaSection from "./TrayectoriaPoliticaSection";
import PlazaYRequisitosSection from "./PlazaYRequisitosSection";
import { Plaza, FormErrors, RequisitosData } from "./types";
import {
  parseRequisitos,
  validateCI,
  validateName,
  validateEmail,
  validateTelefono,
  validateNumber,
  calcularEdad,
  filterNumbersOnly,
} from "./form-utils";

const inputClass = (hasError: boolean) =>
  `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none transition-colors ${
    hasError ? "border-red-500 bg-red-50" : "border-gray-300"
  }`;

const errorClass = "text-red-500 text-xs mt-1";

export default function SolicitarForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const plazaIdParam = searchParams.get("id");

  const [plazas, setPlazas] = useState<Plaza[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [haTrabajadoTurismoChecked, setHaTrabajadoTurismoChecked] = useState(false);
  const [otraFuenteSelected, setOtraFuenteSelected] = useState(false);
  const [plazaSeleccionada, setPlazaSeleccionada] = useState<Plaza | null>(null);
  const [requisitosData, setRequisitosData] = useState<RequisitosData>({ tieneFormato: false, lista: [], opcionesMultiple: [] });
  const [requisitosCumplidos, setRequisitosCumplidos] = useState<string[]>([]);
  const [requisitosSeleccionadosMultiple, setRequisitosSeleccionadosMultiple] = useState<{ [key: string]: string }>({});
  const [requisitosTexto, setRequisitosTexto] = useState("");

  useEffect(() => {
    fetch("/api/plazas")
      .then(res => res.json())
      .then(data => {
        setPlazas(data);
        if (plazaIdParam) {
          const plaza = data.find((p: Plaza) => p.id === parseInt(plazaIdParam));
          if (plaza) {
            setPlazaSeleccionada(plaza);
            const parsed = parseRequisitos(plaza.requisitos);
            setRequisitosData(parsed);
            setRequisitosCumplidos(parsed.tieneFormato ? parsed.lista : []);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [plazaIdParam]);

  const hoy = new Date();
  const hace18Anos = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
  const hace100Anos = new Date(hoy.getFullYear() - 100, hoy.getMonth(), hoy.getDate());

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const fechaMaxima = formatDate(hace18Anos);
  const fechaMinima = formatDate(hace100Anos);

  const handleTelefonoConPrefijo = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    if (!value.startsWith("+53")) {
      value = "+53 " + filterNumbersOnly(value);
    } else {
      const soloNumeros = filterNumbersOnly(value.replace("+53 ", ""));
      value = "+53 " + soloNumeros;
    }
    const partes = value.split(" ");
    if (partes.length > 1 && partes[1].length > 8) {
      value = partes[0] + " " + partes[1].substring(0, 8);
    }
    e.target.value = value;
  };

  const handleFechaNacimientoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fecha = e.target.value;
    if (fecha) {
      const edad = calcularEdad(fecha);
      const edadInput = document.querySelector('input[name="edad"]') as HTMLInputElement;
      if (edadInput) {
        edadInput.value = String(edad);
      }
      if (edad < 18) {
        setErrors(prev => ({ ...prev, fechaNacimiento: "Debe ser mayor de 18 años" }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.fechaNacimiento;
          return newErrors;
        });
      }
    }
  };

  const handlePesoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterNumbersOnly(e.target.value);
    e.target.value = filtered;
    const peso = parseFloat(filtered);
    if (filtered && (isNaN(peso) || peso < 30 || peso > 250)) {
      setErrors(prev => ({ ...prev, peso: "El peso debe estar entre 30 y 250 kg" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.peso;
        return newErrors;
      });
    }
  };

  const handleEstaturaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterNumbersOnly(e.target.value);
    e.target.value = filtered;
    const estatura = parseFloat(filtered);
    if (filtered && (isNaN(estatura) || estatura < 100 || estatura > 230)) {
      setErrors(prev => ({ ...prev, estatura: "La estatura debe estar entre 100 y 230 cm" }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.estatura;
        return newErrors;
      });
    }
  };

  const validateForm = useCallback((formData: FormData): FormErrors => {
    const newErrors: FormErrors = {};

    const nombre = formData.get("nombre") as string;
    const primerApellido = formData.get("primerApellido") as string;
    const segundoApellido = formData.get("segundoApellido") as string;
    const ci = formData.get("ci") as string;
    const email = formData.get("email") as string;
    const telefono = formData.get("telefono") as string;
    const telefonoParticular = formData.get("telefonoParticular") as string;
    const telefonoLaboral = formData.get("telefonoLaboral") as string;
    const telefonoFamiliar = formData.get("telefonoFamiliar") as string;
    const edad = formData.get("edad") as string;
    const peso = formData.get("peso") as string;
    const estatura = formData.get("estatura") as string;
    const plazaId = formData.get("plazaId") as string;
    const fechaNacimiento = formData.get("fechaNacimiento") as string;
    const sexo = formData.get("sexo") as string;
    const colorPiel = formData.get("colorPiel") as string;
    const colorPelo = formData.get("colorPelo") as string;
    const estadoCivil = formData.get("estadoCivil") as string;
    const municipioNacimiento = formData.get("municipioNacimiento") as string;
    const nombrePadre = formData.get("nombrePadre") as string;
    const nombreMadre = formData.get("nombreMadre") as string;
    const direccion = formData.get("direccion") as string;
    const reparto = formData.get("reparto") as string;
    const municipio = formData.get("municipio") as string;
    const provincia = formData.get("provincia") as string;
    const nivelEscolarChecks = formData.getAll("nivelEscolar");
    const especialidad = formData.get("especialidad") as string;
    const experienciaTurismo = formData.get("experienciaTurismo") as string;
    const fuenteProcedenciaChecks = formData.getAll("fuenteProcedencia");
    const haTrabajadoTurismo = formData.get("haTrabajadoTurismo") === "on";

    newErrors.nombre = validateName(nombre, "El nombre");
    newErrors.primerApellido = validateName(primerApellido, "El primer apellido");
    newErrors.segundoApellido = validateName(segundoApellido, "El segundo apellido");
    newErrors.ci = validateCI(ci);
    newErrors.email = validateEmail(email);
    newErrors.telefono = validateTelefono(telefono);
    newErrors.telefonoParticular = validateTelefono(telefonoParticular);
    newErrors.telefonoLaboral = validateTelefono(telefonoLaboral);
    newErrors.telefonoFamiliar = validateTelefono(telefonoFamiliar);
    newErrors.edad = validateNumber(edad, 18, 100, "La edad");
    newErrors.peso = validateNumber(peso, 30, 250, "El peso");
    newErrors.estatura = validateNumber(estatura, 100, 230, "La estatura");
    newErrors.plazaId = !plazaId ? "Debe seleccionar una plaza" : undefined;
    newErrors.fechaNacimiento = !fechaNacimiento ? "La fecha de nacimiento es obligatoria" : undefined;
    newErrors.sexo = !sexo ? "El sexo es obligatorio" : undefined;
    newErrors.colorPiel = !colorPiel ? "El color de piel es obligatorio" : undefined;
    newErrors.colorPelo = !colorPelo ? "El color de pelo es obligatorio" : undefined;
    newErrors.estadoCivil = !estadoCivil ? "El estado civil es obligatorio" : undefined;
    newErrors.municipioNacimiento = !municipioNacimiento ? "El municipio de nacimiento es obligatorio" : undefined;
    newErrors.nombrePadre = !nombrePadre ? "El nombre del padre es obligatorio" : undefined;
    newErrors.nombreMadre = !nombreMadre ? "El nombre de la madre es obligatorio" : undefined;
    newErrors.direccion = !direccion ? "La dirección particular es obligatoria" : undefined;
    newErrors.reparto = !reparto ? "El reparto es obligatorio" : undefined;
    newErrors.municipio = !municipio ? "El municipio es obligatorio" : undefined;
    newErrors.provincia = !provincia ? "La provincia es obligatoria" : undefined;
    newErrors.nivelEscolar = nivelEscolarChecks.length === 0 ? "Debe seleccionar al menos un nivel escolar" : undefined;
    newErrors.especialidad = !especialidad ? "La especialidad es obligatoria" : undefined;
    newErrors.experienciaTurismo = haTrabajadoTurismo && !experienciaTurismo ? "Debe ingresar los centros donde ha trabajado" : undefined;
    newErrors.fuenteProcedencia = fuenteProcedenciaChecks.length === 0 ? "Debe seleccionar una fuente de procedencia" : undefined;

    Object.keys(newErrors).forEach(key => {
      if (newErrors[key as keyof FormErrors] === undefined) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    return newErrors;
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (otraFuenteSelected) {
      const otraFuente = formData.get("otraFuente") as string;
      if (!otraFuente || otraFuente.trim().length === 0) {
        setErrors({ ...validationErrors, otraFuente: "Debe especificar la otra fuente de procedencia" });
        return;
      }
    }

    setSubmitting(true);
    setError(null);
    setErrors({});

    const nombreCompleto = [
      formData.get("nombre"),
      formData.get("primerApellido"),
      formData.get("segundoApellido")
    ].filter(Boolean).join(" ");

    const plazaId = parseInt(formData.get("plazaId") as string);
    const plazaSeleccionadaData = plazas.find(p => p.id === plazaId);

    const nivelEscolarChecks = formData.getAll("nivelEscolar");
    const nivelEscolar = nivelEscolarChecks.length > 0 ? nivelEscolarChecks.join(", ") : null;

    const fuenteProcedenciaChecks = formData.getAll("fuenteProcedencia");
    const fuenteProcedencia = fuenteProcedenciaChecks.length > 0 ? fuenteProcedenciaChecks.join(", ") : null;

    const haTrabajadoTurismo = formData.get("haTrabajadoTurismo") === "on";

    const requisitosMultipleJson = Object.values(requisitosSeleccionadosMultiple).filter(v => v);

    const requisitosCumplidosFinal = [
      ...requisitosCumplidos,
      ...requisitosMultipleJson
    ].join(", ");

    const payload = {
      ci: formData.get("ci"),
      nombre: nombreCompleto,
      telefono: formData.get("telefono") || null,
      email: formData.get("email") || null,
      plazaId: plazaId,
      plazaNombre: plazaSeleccionadaData?.nombre || "",
      fechaNacimiento: formData.get("fechaNacimiento") || null,
      edad: formData.get("edad") ? parseInt(formData.get("edad") as string) : null,
      sexo: formData.get("sexo") || null,
      colorPiel: formData.get("colorPiel") || null,
      colorPelo: formData.get("colorPelo") || null,
      peso: formData.get("peso") ? parseFloat(formData.get("peso") as string) : null,
      estatura: formData.get("estatura") ? parseFloat(formData.get("estatura") as string) : null,
      estadoCivil: formData.get("estadoCivil") || null,
      municipioNacimiento: formData.get("municipioNacimiento") || null,
      nombrePadre: formData.get("nombrePadre") || null,
      nombreMadre: formData.get("nombreMadre") || null,
      direccion: formData.get("direccion") || null,
      reparto: formData.get("reparto") || null,
      municipio: formData.get("municipio") || null,
      provincia: formData.get("provincia") || null,
      telefonoParticular: formData.get("telefonoParticular") || null,
      telefonoLaboral: formData.get("telefonoLaboral") || null,
      telefonoFamiliar: formData.get("telefonoFamiliar") || null,
      nivelEscolar: nivelEscolar,
      especialidad: formData.get("especialidad") || null,
      profesiones: formData.get("profesiones") || null,
      idiomas: formData.get("idiomas") || null,
      cursos: formData.get("cursos") || null,
      licenciaConduccion: formData.get("licenciaConduccion") || null,
      haTrabajadoTurismo: haTrabajadoTurismo,
      experienciaTurismo: formData.get("experienciaTurismo") || null,
      fuenteProcedencia: fuenteProcedencia,
      otraFuente: formData.get("otraFuente") || null,
      trayectoriaPolitica: formData.get("trayectoriaPolitica") || null,
      requisitosCumplidos: requisitosData.tieneFormato
        ? requisitosCumplidosFinal
        : requisitosTexto || null,
    };

    try {
      const res = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar solicitud");
        setSubmitting(false);
        return;
      }

      setToken(data.pin);
      setSuccess(true);
    } catch {
      setError("Error de conexión");
    }
    setSubmitting(false);
  };

  const handlePlazaChange = (plaza: Plaza | null) => {
    setPlazaSeleccionada(plaza);
    if (plaza) {
      const parsed = parseRequisitos(plaza.requisitos);
      setRequisitosData(parsed);
      setRequisitosCumplidos(parsed.tieneFormato ? parsed.lista : []);
      setRequisitosTexto("");
    } else {
      setRequisitosData({ tieneFormato: false, lista: [], opcionesMultiple: [] });
    }
  };

  if (success) {
    return (
      <SuccessView
        token={token}
        onHome={() => router.push("/")}
        onEstado={() => router.push("/estado")}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-[#002A8F] text-center mb-2">
          Solicitud de Empleo
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Complete todos los campos solicitados
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Cargando plazas...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <DatosPersonalesSection
              errors={errors}
              onFechaNacimientoChange={handleFechaNacimientoChange}
              onPesoChange={handlePesoChange}
              onEstaturaChange={handleEstaturaChange}
              inputClass={inputClass}
              errorClass={errorClass}
              fechaMinima={fechaMinima}
              fechaMaxima={fechaMaxima}
            />

            <EscolaridadSection
              errors={errors}
              inputClass={inputClass}
              errorClass={errorClass}
            />

            <ExperienciaLaboralSection inputClass={inputClass} />

            <ExperienciaTurismoSection
              errors={errors}
              haTrabajadoChecked={haTrabajadoTurismoChecked}
              onToggle={setHaTrabajadoTurismoChecked}
              inputClass={inputClass}
              errorClass={errorClass}
            />

            <FuenteProcedenciaSection
              errors={errors}
              otraFuenteSelected={otraFuenteSelected}
              onOtraFuenteToggle={setOtraFuenteSelected}
              inputClass={inputClass}
              errorClass={errorClass}
            />

            <TrayectoriaPoliticaSection />

            <PlazaYRequisitosSection
              plazas={plazas}
              plazaIdParam={plazaIdParam}
              errors={errors}
              plazaSeleccionada={plazaSeleccionada}
              onPlazaChange={handlePlazaChange}
              requisitosData={requisitosData}
              requisitosCumplidos={requisitosCumplidos}
              onRequisitosChange={setRequisitosCumplidos}
              requisitosSeleccionadosMultiple={requisitosSeleccionadosMultiple}
              onRequisitosMultipleChange={setRequisitosSeleccionadosMultiple}
              requisitosTexto={requisitosTexto}
              onRequisitosTextoChange={setRequisitosTexto}
              inputClass={inputClass}
              errorClass={errorClass}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input type="email" name="email" className={inputClass(!!errors.email)} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto px-8 py-3 bg-[#002A8F] text-white font-semibold rounded-lg hover:bg-[#003a99] transition-colors disabled:opacity-50"
              >
                {submitting ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
