import { prisma } from './prisma';

const plazas = [
  {
  nombre: 'JARDINERO',
  requisitos: 'Curso de Habilitación o entrenamiento en el puesto.',
  funciones: 'Realiza mantenimiento de jardines, parques y áreas verdes; remueve tierra y perfila canteros; corta césped; poda plantas ornamentales; realiza siembras y trasplantes; recoge residuos; riega plantas; realiza tareas similares según se requiera.',
},
{
  nombre: 'OPERADOR GENERAL DE MANTENIMIENTO Y REPARACIÓN',
  requisitos: 'Curso de Habilitación o entrenamiento en el puesto.',
  funciones: 'Realiza reparaciones menores; mantenimiento general; sustituye bombillos; realiza instalaciones eléctricas simples; repara paredes y pisos; pinta superficies; instala y repara elementos sanitarios; limpia y engrasa equipos; arma andamios; repara muebles; realiza tareas similares según se requiera.',
},
{
  nombre: 'MECÁNICO EN CLIMATIZACIÓN Y REFRIGERACIÓN',
  requisitos: 'Graduado de Nivel Medio y Curso de Habilitación en Buenas Prácticas de Refrigeración.',
  funciones: 'Desarma, monta y repara sistemas de refrigeración; ejecuta instalaciones; realiza instalaciones eléctricas de control y fuerza; ajusta sistemas automáticos; realiza soldaduras; limpia y deshidrata sistemas; pone en marcha equipos; ensambla cámaras modulares; realiza tareas similares.',
},
{
  nombre: 'ELECTRICISTA B DE MANTENIMIENTO',
  requisitos: 'Graduado de Instituto Politécnico o Escuela Tecnológica con Curso de Habilitación.',
  funciones: 'Instala y repara transformadores de 2300V hasta 33KV; mantiene sistemas de control y subestaciones; repara motores y generadores hasta 5000KV; realiza pruebas y ajustes; tareas similares.',
},
{
  nombre: 'MECÁNICO DIESEL A',
  requisitos: 'Graduado de Instituto Politécnico o Escuela Tecnológica con Curso de Habilitación.',
  funciones: 'Diagnostica y repara motores Diesel; repara sistemas de escape, bombas e inyectores; alinea equipos; realiza pruebas de potencia; suelda y ajusta componentes; trabaja con motores de alta potencia; tareas similares.',
},
{
  nombre: 'ELECTRICISTA A DE MANTENIMIENTO',
  requisitos: 'Graduado de Instituto Politécnico o Escuela Tecnológica con Curso de Habilitación.',
  funciones: 'Instala y repara transformadores mayores de 33KV; mantiene sistemas eléctricos industriales; repara motores mayores de 5000KV; realiza pruebas y ajustes técnicos; tareas similares.',
},
{
  nombre: 'AUXILIAR GENERAL DE SERVICIOS',
  requisitos: 'Curso de habilitación o entrenamiento en el puesto.',
  funciones: 'Realiza limpieza en oficinas y áreas comunes; mantiene servicios sanitarios; recibe visitas; gestiona correspondencia interna; tareas similares.',
},
{
  nombre: 'SERENO',
  requisitos: 'Entrenamiento en el puesto de trabajo.',
  funciones: 'Vigila edificios y propiedades; controla accesos; realiza rondas periódicas; orienta visitantes; tareas similares.',
},
{
  nombre: 'COORDINADOR DE ALOJAMIENTO Y PASAJE',
  requisitos: 'Graduado de Nivel Medio con entrenamiento en el puesto.',
  funciones: 'Gestiona traslado y alojamiento de funcionarios; coordina planes de eventos; controla entrada y salida de huéspedes; confecciona informes; tareas similares.',
},
{
  nombre: 'DEPENDIENTE-TRANSPORTADOR DE MERCANCÍA',
  requisitos: 'Curso de habilitación o entrenamiento en el puesto.',
  funciones: 'Recepciona y revisa mercancías; conduce vehículo; carga y descarga productos; organiza almacén; tareas similares.',
},
{
  nombre: 'SECRETARIA',
  requisitos: 'Graduado de Nivel Medio con curso de habilitación o entrenamiento.',
  funciones: 'Asiste en actividades administrativas; redacta y archiva documentos; maneja información; atiende visitantes; opera equipos; aplica normas de secreto estatal; tareas similares.',
},
{
  nombre: 'SECRETARIA EJECUTIVA',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Asiste a altos directivos; maneja asuntos confidenciales; coordina reuniones; elabora informes; controla planes de trabajo; aplica normas de seguridad informática; tareas similares.',
},
{
  nombre: 'TÉCNICO EN ABASTECIMIENTO TÉCNICO MATERIAL',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Participa en planes de abastecimiento; evalúa necesidades de materiales; realiza estudios de aseguramiento; ejecuta controles; tareas similares.',
},
{
  nombre: 'TÉCNICO EN CLIMATIZACIÓN Y REFRIGERACIÓN',
  requisitos: 'Graduado de Nivel Medio Superior con curso especializado en Buenas Prácticas de Refrigeración.',
  funciones: 'Elabora proyectos de refrigeración; diseña equipos básicos; supervisa instalaciones; participa en mejoras técnicas; tareas similares.',
},
{
  nombre: 'TÉCNICO EN GESTIÓN DOCUMENTAL',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Organiza y controla archivos; gestiona documentación; asesora usuarios; participa en automatización; elabora instrumentos informativos; tareas similares.',
},
{
  nombre: 'BALANCISTA DISTRIBUIDOR',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Elabora balances materiales; planifica distribución; controla inventarios; gestiona contratos; propone medidas de ahorro; tareas similares.',
},
{
  nombre: 'CONTADOR D',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Organiza hechos económicos; elabora estados financieros; controla activos; realiza conciliaciones; participa en auditorías; tareas similares.',
},
{
  nombre: 'TÉCNICO EN GESTIÓN ECONÓMICA',
  requisitos: 'Graduado de Técnico Medio con entrenamiento en el puesto.',
  funciones: 'Elabora planes económicos; analiza indicadores financieros; controla consumos; realiza análisis estadísticos; asesora dirección; tareas similares.',
},
{
  nombre: 'TÉCNICO EN GESTIÓN DE RECURSOS HUMANOS',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Realiza estudios organizativos; ejecuta programas de selección; controla sistema salarial; planifica capacitación; analiza fluctuación laboral; tareas similares.',
},
{
  nombre: 'TÉCNICO EN AHORRO Y USO RACIONAL DE LA ENERGÍA',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Supervisa consumo energético; controla uso racional; propone medidas de ahorro; realiza estudios energéticos; tareas similares.',
},
{
  nombre: 'TÉCNICO EN GESTIÓN COMERCIAL',
  requisitos: 'Graduado de Nivel Medio Superior con entrenamiento en el puesto.',
  funciones: 'Elabora contratos; factura ingresos; controla cuentas; analiza precios y tarifas; participa en acciones comerciales; tareas similares.',
},
{
  nombre: 'ASESOR JURÍDICO',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Asesora en asuntos legales; elabora proyectos jurídicos; representa entidad en procesos; revisa contratos; actualiza legislación; tareas similares.',
},
{
  nombre: 'CONTADOR C',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Organiza y supervisa hechos económicos; elabora y revisa comprobantes; aplica sistemas contables; participa en auditorías; realiza conciliaciones bancarias; controla activos fijos; emite y consolida estados financieros; elabora informes presupuestarios; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN ABASTECIMIENTO TÉCNICO MATERIAL',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Controla aplicación de normativas de abastecimiento; confecciona y ejecuta planes de recursos; evalúa demandas; realiza estudios de necesidades; coordina aseguramientos; realiza visitas de control; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN AHORRO Y USO RACIONAL DE LA ENERGÍA',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Controla comportamiento energético; impulsa políticas de ahorro; supervisa consumo; recomienda medidas y sanciones; aplica políticas de uso racional; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN CIENCIAS INFORMÁTICAS',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Desarrolla programas informáticos; implementa software y sitios web; administra redes; atiende usuarios; repara y actualiza equipos; instala redes; analiza problemas técnicos; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN GESTIÓN DE RECURSOS HUMANOS',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Realiza estudios organizativos; diseña puestos; ejecuta programas de selección; controla sistema salarial; planifica capacitación; analiza estructura laboral; confecciona plantillas y funciones; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN GESTIÓN DE LA CALIDAD',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Participa en política de calidad; desarrolla cultura organizacional de calidad; elabora documentos normativos; realiza estudios técnicos; ejecuta superación profesional en calidad; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN GESTIÓN ECONÓMICA',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Elabora planes económicos; evalúa indicadores financieros; controla consumos; analiza productividad; elabora estados financieros; asesora dirección; participa en fijación de precios; realiza análisis estadísticos; tareas similares.',
},
{
  nombre: 'ESPECIALISTA EN INVERSIONES',
  requisitos: 'Graduado de Nivel Superior con entrenamiento en el puesto.',
  funciones: 'Participa en programas de inversión; elabora planes de inversión; controla ejecución de inversiones; coordina tareas con entidades; participa en estrategias de desarrollo; tareas similares.',
},
{
  nombre: 'AUXILIAR GENERAL DE COCINA',
  requisitos: 'Graduado de Nivel Medio con entrenamiento en el puesto.',
  funciones: 'Prepara puesto de trabajo; limpia utensilios y áreas de cocina; transporta residuos; cumple normas higiénicas; usa correctamente productos de limpieza; conserva equipos y utensilios; tareas similares.',
},
{
  nombre: 'JARDINERO B',
  requisitos: 'Graduado de Nivel Medio con entrenamiento o curso de habilitación. Demostración práctica del conocimiento idiomático requerido.',
  funciones: 'Ejecuta trabajos de jardinería de media y alta complejidad; mantiene jardines; poda y siembra plantas; riega; opera herramientas; cumple normas técnicas con alta calidad; tareas similares.',
},
{
  nombre: 'COCINERO B',
  requisitos: 'Graduado de Nivel Medio con entrenamiento en el puesto.',
  funciones: 'Elabora y procesa alimentos; prepara platos según normas establecidas; controla calidad y presentación; mantiene higiene en el área de cocina; cumple normas técnicas y sanitarias; tareas similares.',
}
  
];

async function main() {
  console.log('🌱 Starting seed de plazas...');

  for (const plaza of plazas) {
    await prisma.plaza.create({
      data: plaza as any,
    });
    console.log(`✓ Creado: ${plaza.nombre}`);
  }

  console.log('✅ Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
