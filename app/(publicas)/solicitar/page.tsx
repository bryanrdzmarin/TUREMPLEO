"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface Plaza {
  id: number;
  nombre: string;
  requisitos: string;
  funciones: string;
  activo: boolean;
}

const parseRequisitos = (texto: string): { tieneFormato: boolean; lista: string[]; opcionesMultiple: { texto: string; opciones: string[] }[] } => {
  if (!texto) return { tieneFormato: false, lista: [], opcionesMultiple: [] };
  
  let listaFiltrada: string[] = [];
  const opcionesMultiple: { texto: string; opciones: string[] }[] = [];
  
  const lineas = texto.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lineas.length > 0) {
    for (const linea of lineas) {
      const cleanLinea = linea.replace(/^[-•*\d.)]+\s*/, '').trim();
      if (cleanLinea.length === 0) continue;
      
      if (cleanLinea.includes(' o ') || cleanLinea.includes(' O ')) {
        const partes = cleanLinea.split(/\s+o\s+/i);
        opcionesMultiple.push({ texto: cleanLinea, opciones: partes });
      } else if (cleanLinea.includes(',') && cleanLinea.length < 100) {
        const partes = cleanLinea.split(',').map(p => p.trim()).filter(p => p.length > 0);
        listaFiltrada.push(...partes);
      } else {
        listaFiltrada.push(cleanLinea);
      }
    }
  }
  
  const tieneFormato = listaFiltrada.length > 0 || opcionesMultiple.length > 0;
  
  return { tieneFormato, lista: listaFiltrada, opcionesMultiple };
};

interface FormErrors {
  nombre?: string;
  primerApellido?: string;
  segundoApellido?: string;
  ci?: string;
  fechaNacimiento?: string;
  email?: string;
  telefono?: string;
  telefonoParticular?: string;
  telefonoLaboral?: string;
  telefonoFamiliar?: string;
  edad?: string;
  peso?: string;
  estatura?: string;
  plazaId?: string;
  sexo?: string;
  colorPiel?: string;
  colorPelo?: string;
  estadoCivil?: string;
  municipioNacimiento?: string;
  nombrePadre?: string;
  nombreMadre?: string;
  direccion?: string;
  reparto?: string;
  municipio?: string;
  provincia?: string;
  nivelEscolar?: string;
  especialidad?: string;
  experienciaTurismo?: string;
  fuenteProcedencia?: string;
}

function SolicitarForm() {
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
  const [plazaSeleccionada, setPlazaSeleccionada] = useState<Plaza | null>(null);
  const [requisitosData, setRequisitosData] = useState<{ tieneFormato: boolean; lista: string[]; opcionesMultiple: { texto: string; opciones: string[] }[] }>({ tieneFormato: false, lista: [], opcionesMultiple: [] });
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

  const validateCI = (ci: string): string | undefined => {
    if (!ci) return "El Carné de Identidad es obligatorio";
    if (!/^\d{11}$/.test(ci)) return "El CI debe tener exactamente 11 dígitos numéricos";
    return undefined;
  };

  const validateName = (name: string, fieldName: string): string | undefined => {
    if (!name || name.trim().length < 2) return `${fieldName} es obligatorio (mínimo 2 caracteres)`;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return `${fieldName} solo debe contener letras`;
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Formato de email inválido";
    return undefined;
  };

  const validateTelefono = (telefono: string): string | undefined => {
    if (telefono && !/^\+53\s?[1-9]\d{7}$/.test(telefono)) {
      return "Formato de teléfono inválido (ej: +53 51234567)";
    }
    return undefined;
  };

  const filterLettersOnly = (value: string): string => {
    return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
  };

  const filterNumbersOnly = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
  };

  const handleLettersOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterLettersOnly(e.target.value);
    e.target.value = filtered;
  };

  const handleNumbersOnly = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filtered = filterNumbersOnly(e.target.value);
    e.target.value = filtered;
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mesDiff = hoy.getMonth() - fechaNac.getMonth();
    if (mesDiff < 0 || (mesDiff === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
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
        setErrors(prev => ({
          ...prev,
          fechaNacimiento: "Debe ser mayor de 18 años"
        }));
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
      setErrors(prev => ({
        ...prev,
        peso: "El peso debe estar entre 30 y 250 kg"
      }));
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
      setErrors(prev => ({
        ...prev,
        estatura: "La estatura debe estar entre 100 y 230 cm"
      }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.estatura;
        return newErrors;
      });
    }
  };

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

  const validateNumber = (value: string, min: number, max: number, fieldName: string): string | undefined => {
    if (!value) return undefined;
    const num = parseFloat(value);
    if (isNaN(num) || num < min || num > max) {
      return `${fieldName} debe estar entre ${min} y ${max}`;
    }
    return undefined;
  };

  const validateForm = (formData: FormData): FormErrors => {
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setError(null);
    setErrors({});

    const fechaNacimiento = formData.get("fechaNacimiento") as string;
    const nombreCompleto = [
      formData.get("nombre"),
      formData.get("primerApellido"),
      formData.get("segundoApellido")
    ].filter(Boolean).join(" ");

    const plazaId = parseInt(formData.get("plazaId") as string);
    const plazaSeleccionada = plazas.find(p => p.id === plazaId);

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
        plazaNombre: plazaSeleccionada?.nombre || "",
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

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none transition-colors ${
      hasError ? "border-red-500 bg-red-50" : "border-gray-300"
    }`;

  const errorClass = "text-red-500 text-xs mt-1";

  if (success) {
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
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Volver al Inicio
              </button>
              <button
                onClick={() => router.push("/estado")}
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

            <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
              <h2 className="text-xl font-semibold text-[#002A8F]">Datos Personales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombre"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.nombre)}
                />
                {errors.nombre && <p className={errorClass}>{errors.nombre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  1er Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="primerApellido"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.primerApellido)}
                />
                {errors.primerApellido && <p className={errorClass}>{errors.primerApellido}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  2do Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="segundoApellido"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.segundoApellido)}
                />
                {errors.segundoApellido && <p className={errorClass}>{errors.segundoApellido}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Carné de Identidad <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="ci"
                  maxLength={11}
                  onChange={handleNumbersOnly}
                  placeholder="11 dígitos"
                  className={inputClass(!!errors.ci)}
                />
                {errors.ci && <p className={errorClass}>{errors.ci}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefono"
                  onChange={handleTelefonoConPrefijo}
                  placeholder="+53 51234567"
                  maxLength={13}
                  className={inputClass(!!errors.telefono)}
                />
                {errors.telefono && <p className={errorClass}>{errors.telefono}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  onChange={handleFechaNacimientoChange}
                  min={fechaMinima}
                  max={fechaMaxima}
                  className={inputClass(!!errors.fechaNacimiento)}
                />
                {errors.fechaNacimiento && <p className={errorClass}>{errors.fechaNacimiento}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Edad
                </label>
                <input
                  type="number"
                  name="edad"
                  min="18"
                  max="100"
                  className={inputClass(!!errors.edad)}
                />
                {errors.edad && <p className={errorClass}>{errors.edad}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <select
                  name="sexo"
                  className={inputClass(!!errors.sexo)}
                >
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
                <select
                  name="colorPiel"
                  className={inputClass(!!errors.colorPiel)}
                >
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
                <select
                  name="colorPelo"
                  className={inputClass(!!errors.colorPelo)}
                >
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
                <input
                  type="number"
                  name="peso"
                  min="30"
                  max="250"
                  step="0.1"
                  onChange={handlePesoChange}
                  className={inputClass(!!errors.peso)}
                />
                {errors.peso && <p className={errorClass}>{errors.peso}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estatura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="estatura"
                  min="100"
                  max="230"
                  onChange={handleEstaturaChange}
                  className={inputClass(!!errors.estatura)}
                />
                {errors.estatura && <p className={errorClass}>{errors.estatura}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil <span className="text-red-500">*</span>
                </label>
                <select
                  name="estadoCivil"
                  className={inputClass(!!errors.estadoCivil)}
                >
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
                <input
                  type="text"
                  name="municipioNacimiento"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.municipioNacimiento)}
                />
                {errors.municipioNacimiento && <p className={errorClass}>{errors.municipioNacimiento}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Padre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombrePadre"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.nombrePadre)}
                />
                {errors.nombrePadre && <p className={errorClass}>{errors.nombrePadre}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Madre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nombreMadre"
                  onChange={handleLettersOnly}
                  className={inputClass(!!errors.nombreMadre)}
                />
                {errors.nombreMadre && <p className={errorClass}>{errors.nombreMadre}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Particular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="direccion"
                placeholder="Calle, No., Entre, etc."
                className={inputClass(!!errors.direccion)}
              />
              {errors.direccion && <p className={errorClass}>{errors.direccion}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reparto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="reparto"
                  className={inputClass(!!errors.reparto)}
                />
                {errors.reparto && <p className={errorClass}>{errors.reparto}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="municipio"
                  className={inputClass(!!errors.municipio)}
                />
                {errors.municipio && <p className={errorClass}>{errors.municipio}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="provincia"
                  className={inputClass(!!errors.provincia)}
                />
                {errors.provincia && <p className={errorClass}>{errors.provincia}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono Particular <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefonoParticular"
                  onChange={handleTelefonoConPrefijo}
                  placeholder="+53 51234567"
                  maxLength={13}
                  className={inputClass(!!errors.telefonoParticular)}
                />
                {errors.telefonoParticular && <p className={errorClass}>{errors.telefonoParticular}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono Laboral <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefonoLaboral"
                  onChange={handleTelefonoConPrefijo}
                  placeholder="+53 51234567"
                  maxLength={13}
                  className={inputClass(!!errors.telefonoLaboral)}
                />
                {errors.telefonoLaboral && <p className={errorClass}>{errors.telefonoLaboral}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono Familiar <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefonoFamiliar"
                  onChange={handleTelefonoConPrefijo}
                  placeholder="+53 51234567"
                  maxLength={13}
                  className={inputClass(!!errors.telefonoFamiliar)}
                />
                {errors.telefonoFamiliar && <p className={errorClass}>{errors.telefonoFamiliar}</p>}
              </div>
            </div>

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
              <input
                type="text"
                name="especialidad"
                onChange={handleLettersOnly}
                className={inputClass(!!errors.especialidad)}
              />
              {errors.especialidad && <p className={errorClass}>{errors.especialidad}</p>}
            </div>

            <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
              <h2 className="text-xl font-semibold text-[#002A8F]">Experiencia Laboral</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profesiones u oficios
              </label>
              <textarea
                name="profesiones"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                placeholder="Liste sus profesiones u oficios"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Idiomas
              </label>
              <textarea
                name="idiomas"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                placeholder="Idioma, Nivel, Dónde lo adquirió"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cursos Realizados
              </label>
              <textarea
                name="cursos"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                placeholder="Liste los cursos que ha realizado"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Licencia de Conducción
              </label>
              <input
                type="text"
                name="licenciaConduccion"
                placeholder="Tipo de licencia"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
              />
            </div>

            <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
              <h2 className="text-xl font-semibold text-[#002A8F]">Experiencia en Turismo <span className="text-red-500">*</span></h2>
            </div>

            <div>
              <label className="flex items-center gap-2 mb-4">
                <input 
                  type="checkbox" 
                  name="haTrabajadoTurismo" 
                  className="w-4 h-4 text-[#002A8F]"
                  onChange={(e) => setHaTrabajadoTurismoChecked(e.target.checked)}
                />
                <span className="text-sm text-gray-700">¿Ha sido usted empleado en el Sistema de Turismo?</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Centros donde ha trabajado
              </label>
              <textarea
                name="experienciaTurismo"
                rows={4}
                disabled={!haTrabajadoTurismoChecked}
                className={`${inputClass(!!errors.experienciaTurismo)} ${!haTrabajadoTurismoChecked ? "bg-gray-100 cursor-not-allowed" : ""}`}
                placeholder={haTrabajadoTurismoChecked ? "Centro, Cargos, Motivos de baja" : "Seleccione primero si ha trabajado en Turismo"}
              />
              {errors.experienciaTurismo && <p className={errorClass}>{errors.experienciaTurismo}</p>}
            </div>

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
                  <input type="checkbox" name="fuenteProcedencia" value="otra" className="w-4 h-4 text-[#002A8F]" />
                  <span className="text-sm text-gray-700">Otra (especifique):</span>
                </label>
                <input
                  type="text"
                  name="otraFuente"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none mt-1"
                />
              </div>
            </div>
            {errors.fuenteProcedencia && <p className={errorClass}>{errors.fuenteProcedencia}</p>}

            <div className="border-b-2 border-[#002A8F] pb-2 mb-4">
              <h2 className="text-xl font-semibold text-[#002A8F]">Trayectoria Política</h2>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizaciones, Desde, Hasta, Condecoraciones
              </label>
              <textarea
                name="trayectoriaPolitica"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
              />
            </div>

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
                  setPlazaSeleccionada(plaza);
                  if (plaza) {
                    const parsed = parseRequisitos(plaza.requisitos);
                    setRequisitosData(parsed);
                    setRequisitosCumplidos(parsed.tieneFormato ? parsed.lista : []);
                    setRequisitosTexto("");
                  } else {
                    setRequisitosData({ tieneFormato: false, lista: [], opcionesMultiple: [] });
                  }
                }}
              >
                <option value="">Seleccione una plaza</option>
                {plazas.map((plaza) => (
                  <option key={plaza.id} value={plaza.id}>
                    {plaza.nombre}
                  </option>
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
                                    setRequisitosSeleccionadosMultiple(prev => ({
                                      ...prev,
                                      [idx]: e.target.value
                                    }));
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
                                setRequisitosCumplidos([...requisitosCumplidos, req]);
                              } else {
                                setRequisitosCumplidos(requisitosCumplidos.filter(r => r !== req));
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Indique los requisitos que cumple:
                      </label>
                      <textarea
                        name="requisitosCumplidosTexto"
                        rows={4}
                        value={requisitosTexto}
                        onChange={(e) => setRequisitosTexto(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#002A8F] focus:border-[#002A8F] outline-none"
                        placeholder="Liste los requisitos que cumple..."
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={inputClass(!!errors.email)}
              />
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

export default function SolicitarPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Cargando...</p>
        </div>
      </div>
    }>
      <SolicitarForm />
    </Suspense>
  );
}
