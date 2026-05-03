export const parseRequisitos = (texto: string): { tieneFormato: boolean; lista: string[]; opcionesMultiple: { texto: string; opciones: string[] }[] } => {
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

export const validateCI = (ci: string): string | undefined => {
  if (!ci) return "El Carné de Identidad es obligatorio";
  if (!/^\d{11}$/.test(ci)) return "El CI debe tener exactamente 11 dígitos numéricos";
  return undefined;
};

export const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name || name.trim().length < 2) return `${fieldName} es obligatorio (mínimo 2 caracteres)`;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name)) return `${fieldName} solo debe contener letras`;
  return undefined;
};

export const validateEmail = (email: string): string | undefined => {
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Formato de email inválido";
  return undefined;
};

export const validateTelefono = (telefono: string): string | undefined => {
  if (telefono && !/^\+53\s?[1-9]\d{7}$/.test(telefono)) {
    return "Formato de teléfono inválido (ej: +53 51234567)";
  }
  return undefined;
};

export const validateNumber = (value: string, min: number, max: number, fieldName: string): string | undefined => {
  if (!value) return undefined;
  const num = parseFloat(value);
  if (isNaN(num) || num < min || num > max) {
    return `${fieldName} debe estar entre ${min} y ${max}`;
  }
  return undefined;
};

export const filterLettersOnly = (value: string): string => {
  return value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
};

export const filterNumbersOnly = (value: string): string => {
  return value.replace(/[^0-9]/g, "");
};

export const calcularEdad = (fechaNacimiento: string): number => {
  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  const hoy = new Date();
  
  let edad = hoy.getFullYear() - anio;
  
  const mesCumple = mes;
  const mesActual = hoy.getMonth() + 1;
  const diaActual = hoy.getDate();
  
  if (mesCumple > mesActual || (mesCumple === mesActual && dia > diaActual)) {
    edad--;
  }
  
  return edad;
};
