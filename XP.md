# XP - TurEmpleo

---

## TABLA RESUMEN - 12 HISTORIAS DE USUARIO

| Iteración | HU | Historia de Usuario | Pto. Est | Pto. Real |
|-----------|----|---------------------|----------|-----------|
| 1 | 1 | Gestionar plazas | 0.9 | 0.9 |
| 1 | 2 | Realizar solicitud de plazas | 0.11 | 0.11 |
| 1 | 3 | Gestionar solicitudes | 0.7 | 0.7 |
| 2 | 4 | Gestionar candidatos | 0.6 | 0.6 |
| 2 | 5 | Gestionar reserva | 0.8 | 0.8 |
| 3 | 6 | Gestionar roles | 0.4 | 0.4 |
| 3 | 7 | Gestionar usuarios | 0.7 | 0.7 |
| 3 | 8 | Autenticarse en el sistema | 0.5 | 0.5 |
| 4 | 9 | Realizar gráficos estadísticos | 0.10 | 0.10 |
| 4 | 10 | Generar informes | 0.7 | 0.7 |
| 4 | 11 | Validación de campos críticos | 0.3 | 0.3 |
| 4 | 12 | Consultar estado de solicitud | 0.5 | 0.5 |

**Total: 6.31 puntos**

---

## DESCRIPCIONES DE HU

**HU-1: Gestionar plazas**
Usuario: Técnico de Turempleo | Iteración: 1 | Prioridad: Alta | Riesgo: Bajo
Pto. Est: 0.5 | Pto. Real: 0.5
Descripción: El técnico accede al módulo de gestión de plazas para administrar la información de las vacantes disponibles. Cada registro debe incluir el nombre de la plaza, requisitos, funciones y la opción de definir si la plaza será visible o no en la vista pública donde los candidatos realizan sus solicitudes. El sistema debe permitir crear nuevas plazas, modificar datos existentes o eliminar registros. Las plazas activas estarán disponibles en línea para que los aspirantes puedan postalarse directamente desde el portal.

---

**HU-2: Realizar solicitud de plazas**
Usuario: Candidato | Iteración: 1 | Prioridad: Alta | Riesgo: Bajo
Pto. Est: 0.5 | Pto. Real: 0.5
Descripción: El candidato accede al portal público para visualizar las plazas de empleo disponibles y seleccionar aquella que desea solicitar. El sistema presenta un formulario extenso con datos personales, familiares, dirección, nivel escolar, experiencia laboral, idiomas, cursos, licencia de conducción y experiencia en turismo. El candidato debe marcar los requisitos de la plaza que cumple y proporcionar un correo electrónico válido. Al finalizar, el sistema genera un PIN único de 6 dígitos que se envía por correo electrónico al candidato para el seguimiento de su solicitud.

---

**HU-3: Gestionar solicitudes**
Usuario: Técnico de Turempleo | Iteración: 1 | Prioridad: Alta | Riesgo: Bajo
Pto. Est: 0.5 | Pto. Real: 0.5
Descripción: El técnico accede al módulo de gestión de solicitudes para visualizar, filtrar, aceptar o rechazar las solicitudes enviadas por los aspirantes. Cada solicitud debe incluir datos personales del aspirante, plaza solicitada y estado actual. Se deben guardar los cambios y ofrecer un historial de acciones. El técnico puede aprobar una solicitud (pasando al proceso de entrevista) o rechazarla con un motivo documentado.

---

**HU-4: Gestionar candidatos**
Usuario: Técnico de Turempleo | Iteración: 2 | Prioridad: Alta | Riesgo: Bajo
Pto. Est: 0.5 | Pto. Real: 0.5
Descripción: El técnico accede al módulo de gestión de candidatos para visualizar el listado completo de personas que han aplicado a las plazas disponibles. Desde este módulo puede citar a los candidatos para entrevistas presenciales, registrar información adicional resultante de la evaluación y determinar si el candidato cumple con el perfil requerido. El sistema permite organizar candidatos por estado: pendientes de citar, citados, aprobados y rechazados.

---

**HU-5: Gestionar reserva**
Usuario: Técnico de Turempleo | Iteración: 2 | Prioridad: Media | Riesgo: Bajo
Pto. Est: 0.3 | Pto. Real: 0.3
Descripción: El técnico accede al listado de candidatos que forman parte de la reserva laboral. Desde este módulo puede filtrar por las plazas que necesitan cubrir una vacante y, dentro de ellas, aplicar filtros adicionales según los requisitos establecidos para identificar al candidato más cualificado. Una vez seleccionado, el candidato es citado a la entrevista de trabajo.

---

**HU-6: Gestionar roles**
Usuario: Administrador | Iteración: 3 | Prioridad: Media | Riesgo: Bajo
Pto. Est: 0.3 | Pto. Real: 0.3
Descripción: El administrador accede al módulo de gestión de roles para asignar a los usuarios uno o varios perfiles de acceso según lo estime conveniente. Los roles disponibles son tres y están definidos por defecto en el sistema, por lo que no pueden ser modificados ni se permite la creación de nuevos roles. Cada rol establece permisos y restricciones específicas que determinan las acciones que un usuario puede realizar dentro de la plataforma.

---

**HU-7: Gestionar usuarios**
Usuario: Administrador | Iteración: 3 | Prioridad: Alta | Riesgo: Medio
Pto. Est: 0.3 | Pto. Real: 0.3
Descripción: El administrador es responsable de gestionar los usuarios del sistema. Esto incluye las operaciones de registro, edición, eliminación y asignación de roles. Cada usuario debe tener nombre completo, correo electrónico, contraseña segura y rol asignado. Al realizar cualquier acción, el sistema debe guardar los cambios y notificar el resultado.

---

**HU-8: Autenticarse en el sistema**
Usuario: Técnico de Turempleo / Administrador | Iteración: 3 | Prioridad: Alta | Riesgo: Medio
Pto. Est: 0.3 | Pto. Real: 0.3
Descripción: Los especialistas y técnicos que trabajan en la entidad acceden al sistema mediante un proceso de autenticación seguro. El sistema debe validar las credenciales (correo electrónico y contraseña), generar un token de sesión válido y proteger las rutas privadas del panel de administración. Las contraseñas deben almacenarse de forma segura utilizando algoritmos de hash. El sistema debe permitir cerrar sesión de manera segura.

---

**HU-9: Realizar gráficos estadísticos**
Usuario: Administrador / Técnico de Turempleo | Iteración: 4 | Prioridad: Media | Riesgo: Medio
Pto. Est: 0.4 | Pto. Real: 0.4
Descripción: Los administradores y técnicos de Turempleo pueden visualizar gráficos interactivos sobre el comportamiento del proceso de selección: cantidad de solicitudes por mes, porcentaje de aceptación, categorías más demandadas y evolución de la reserva laboral. Debe poder elegir el rango temporal y exportar los resultados.

---

**HU-10: Generar informes**
Usuario: Administrador | Iteración: 4 | Prioridad: Media | Riesgo: Bajo
Pto. Est: 0.3 | Pto. Real: 0.3
Descripción: El administrador genera y descarga informes personalizados sobre el estado de las solicitudes, número de plazas ocupadas, aspirantes activos y desempeño del personal técnico. El sistema debe permitir seleccionar filtros de búsqueda y generar documentos en formatos PDF o Excel.

---

**HU-11: Validación de campos críticos**
Usuario: Sistema | Iteración: 4 | Prioridad: Media | Riesgo: Bajo
Pto. Est: 0.2 | Pto. Real: 0.2
Descripción: El sistema debe garantizar la validación de los campos críticos en cada módulo, evitando registros incompletos o inconsistentes. Esta validación asegura que los datos obligatorios —como nombre, identificación, correo electrónico, requisitos de la plaza o resultados de evaluación— se ingresen correctamente antes de permitir guardar o procesar la información. El objetivo es mantener la integridad de los datos, reducir errores y asegurar que las decisiones sobre candidatos, plazas y reservas se basen en información confiable y completa.

---

**HU-12: Consultar estado de solicitud**
Usuario: Candidato | Iteración: 4 | Prioridad: Alta | Riesgo: Bajo
Pto. Est: 0.3 | Pto. Real: -
Descripción: El candidato accede a la página pública de consulta usando su número de carné de identidad y el PIN recibido por correo electrónico al realizar la solicitud. El sistema muestra el estado actual de su solicitud con mensajes contextuales según el progreso: pendiente de revisión, aprobada pendiente de cita, citado con fecha y dirección de la entrevista, aprobado en reserva laboral, o rechazado. Si está citado, se muestran los detalles de la cita: fecha, hora, dirección y requisitos que debe traer.

---

## TAREAS DE INGENIERÍA

**HU-01: Gestionar plazas**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 1.1 | Listar plazas activas | 0.1 | - |
| 1.2 | Crear nueva plaza | 0.15 | - |
| 1.3 | Editar plaza existente | 0.1 | - |
| 1.4 | Eliminar plaza | 0.1 | - |
| 1.5 | Activar/inactivar plaza | 0.05 | - |

---

**HU-02: Realizar solicitud de plazas**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 2.1 | Ver plazas disponibles | 0.1 | - |
| 2.2 | Seleccionar plaza a solicitar | 0.05 | - |
| 2.3 | Completar formulario de datos personales | 0.15 | - |
| 2.4 | Marcar requisitos cumplidos | 0.1 | - |
| 2.5 | Recibir PIN por email | 0.1 | - |

---

**HU-03: Gestionar solicitudes**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 3.1 | Listar solicitudes | 0.1 | - |
| 3.2 | Filtrar solicitudes por estado | 0.1 | - |
| 3.3 | Ver detalle del candidato | 0.1 | - |
| 3.4 | Aprobar solicitud | 0.1 | - |
| 3.5 | Rechazar solicitud con motivo | 0.1 | - |

---

**HU-04: Gestionar candidatos**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 4.1 | Listar candidatos por estado | 0.1 | - |
| 4.2 | Programar cita de entrevista | 0.15 | - |
| 4.3 | Editar cita existente | 0.1 | - |
| 4.4 | Evaluar candidato post-entrevista | 0.15 | - |

---

**HU-05: Gestionar reserva**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 5.1 | Listar candidatos en reserva | 0.1 | - |
| 5.2 | Filtrar por plaza | 0.05 | - |
| 5.3 | Filtrar por idioma/titulación/licencia | 0.1 | - |
| 5.4 | Ver detalle del candidato | 0.05 | - |

---

**HU-06: Gestionar roles**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 6.1 | Listar roles disponibles | 0.1 | - |
| 6.2 | Asignar rol a usuario | 0.2 | - |

---

**HU-07: Gestionar usuarios**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 7.1 | Listar usuarios | 0.05 | - |
| 7.2 | Registrar nuevo usuario | 0.1 | - |
| 7.3 | Editar usuario | 0.05 | - |
| 7.4 | Eliminar usuario | 0.05 | - |
| 7.5 | Asignar rol | 0.05 | - |

---

**HU-08: Autenticarse en el sistema**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 8.1 | Iniciar sesión | 0.15 | - |
| 8.2 | Cerrar sesión | 0.05 | - |
| 8.3 | Proteger rutas privadas | 0.1 | - |

---

**HU-09: Realizar gráficos estadísticos**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 9.1 | Ver solicitudes por mes | 0.1 | - |
| 9.2 | Ver porcentaje de aceptación | 0.1 | - |
| 9.3 | Ver categorías más demandadas | 0.1 | - |
| 9.4 | Exportar gráficos | 0.1 | - |

---

**HU-10: Generar informes**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 10.1 | Seleccionar filtros de informe | 0.1 | - |
| 10.2 | Generar informe PDF | 0.1 | - |
| 10.3 | Generar informe Excel | 0.1 | - |

---

**HU-11: Validación de campos críticos**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 11.1 | Validar campos obligatorios | 0.1 | - |
| 11.2 | Validar formato de datos | 0.1 | - |

---

**HU-12: Consultar estado de solicitud**

| Hist. No | Tareas de Ingeniería | Pto. Est | Pto. Real |
|----------|---------------------|----------|-----------|
| 12.1 | Diseñar interfaz de consulta (CI + PIN) | 0.1 | - |
| 12.2 | Validar credenciales del candidato | 0.05 | - |
| 12.3 | Mostrar estado según progreso | 0.1 | - |

---

## TAREAS DE INGENIERÍA EXPLICADAS

**Tarea de Ingeniería #1**
```
Número Tarea: 1.5
Historia de Usuario: 1 - Gestionar plazas
Nombre Tarea: Activar/inactivar plaza
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.05
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: El técnico presiona el botón toggle de estado junto a cada plaza. El método PUT envía una petición al endpoint /api/plazas con el id de la plaza y el nuevo valor del campo activo (true/false). El backend ejecuta update() de Prisma que modifica el registro en la tabla "Plaza". Las plazas con activo=false no aparecen en la vista pública del portal donde los candidatos realizan sus solicitudes, pero permanecen en la base de datos para mantener el historial. El cambio se refleja inmediatamente en la interfaz sin recargar la página.
```

---

**Tarea de Ingeniería #2**
```
Número Tarea: 2.3
Historia de Usuario: 2 - Realizar solicitud de plazas
Nombre Tarea: Completar formulario de datos personales
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.15
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: El candidato llena el formulario extenso organizado en secciones: datos personales (nombre, CI, teléfono, fecha nacimiento, sexo, color piel, color pelo, peso, estatura, estado civil, municipio nacimiento), familia (nombre padre, nombre madre), dirección (calle, reparto, municipio, provincia), teléfonos adicionales (particular, laboral, familiar), nivel escolar (checkboxes), experiencia laboral (profesiones, idiomas, cursos, licencia conducción), experiencia en turismo (checkbox + lista de centros), fuente de procedencia (radio buttons) y trayectoria política. El método POST envía los datos al endpoint /api/solicitudes, donde se crea/actualiza un registro en la tabla "Candidato" y se inserta en la tabla "Solicitud" con estado "pendiente" y pin generado.
```

---

**Tarea de Ingeniería #3**
```
Número Tarea: 2.5
Historia de Usuario: 2 - Realizar solicitud de plazas
Nombre Tarea: Recibir PIN por email
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.1
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: Al completarse la solicitud, el backend genera un PIN aleatorio de 6 dígitos mediante Math.random().toString().substring() y lo almacena en el campo pin de la tabla "Solicitud". Inmediatamente se invoca sendEmail() del servicio Resend con el email del candidato y el PIN. El API de Resend recibe la petición POST con los parámetros to, from y html. El correo enviado tiene asunto "Su solicitud ha sido recibida - TurEmpleo" y contiene un mensaje donde se indica el PIN para que el candidato pueda consultar el estado de su solicitud. Este PIN es la única forma pública de acceso para el candidato sin autenticación.
```

---

**Tarea de Ingeniería #4**
```
Número Tarea: 3.5
Historia de Usuario: 3 - Gestionar solicitudes
Nombre Tarea: Rechazar solicitud con motivo
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.1
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: El técnico selecciona una solicitud y presiona "Rechazar". El sistema muestra un campo obligatorio para ingresar el motivo de rechazo antes de confirmar la acción. El método PUT envía la petición al endpoint /api/solicitudes con id, estado "rechazado" y motivoDenegacion. El backend ejecuta update() de Prisma modificando la tabla "Solicitud": estado cambia a "rechazado" y se guarda el texto en motivoDenegacion. El candidato puede ver este motivo al consultar el estado con su CI y PIN. El motivo queda documentado para auditoría del proceso de selección.
```

---

**Tarea de Ingeniería #5**
```
Número Tarea: 4.2
Historia de Usuario: 4 - Gestionar candidatos
Nombre Tarea: Programar cita de entrevista
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.15
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: El técnico accede al tab "Pendientes a Citar", selecciona un candidato aprobado y presiona "Citar". Se abre un modal con campos: fecha de cita (mínimo el día siguiente), dirección de la entrevista y requisitos a traer (prellenado desde la plaza). El método POST envía los datos al endpoint /api/citas, el cual ejecuta create() de Prisma para insertar en la tabla "Cita" con campos: solicitudId, fechaCita, direccion, requisitos. Simultáneamente, update() cambia citado=true en "Solicitud". Se invoca sendEmail() de Resend para notificar al candidato con asunto "Cita de Entrevista - [Plaza] - TurEmpleo". La relación uno a uno entre Cita y Solicitud se establece mediante foreign key solicitudId.
```

---

**Tarea de Ingeniería #6**
```
Número Tarea: 5.1
Historia de Usuario: 5 - Gestionar reserva
Nombre Tarea: Listar candidatos en reserva
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.1
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: El técnico accede al módulo de reserva laboral. El método GET envía una petición al endpoint /api/reserva, el cual ejecuta una consulta en la tabla "Solicitud" filtrando por entrevistaPasada=true (candidatos que aprobaron la entrevista). La consulta incluye relaciones con las tablas "Candidato" y "InformacionCan" mediante include() de Prisma para obtener los datos completos. El resultado muestra tarjetas o filas con información del candidato: nombre, CI, plaza aprobada, fecha de evaluación, idiomas, cursos y resultados de averiguaciones. Los candidatos permanecen en reserva hasta que sean contratados o rechazados en una entrevista posterior.
```

---

**Tarea de Ingeniería #7**
```
Número Tarea: 5.2
Historia de Usuario: 5 - Gestionar reserva
Nombre Tarea: Filtrar por plaza
Tipo de Tarea: Desarrollo
Puntos Estimados: 0.05
Fecha Inicio: ___
Fecha Fin: ___
Programador Responsable: Bryan Rodríguez Marín

Descripción: En el módulo de reserva laboral, el técnico selecciona una plaza del dropdown de filtros. El método GET envía una petición con parámetro ?plaza=[nombre] al endpoint /api/reserva. El backend ejecuta una consulta where en la tabla "Solicitud" combinando: entrevistaPasada=true AND plazaNombre equals [plaza]. Se retornan únicamente los candidatos aprobados que pertenecen a esa plaza específica. Adicionalmente, el técnico puede aplicar filtros secundarios: por idioma (nivel), titulación, tipo de licencia, oficios y cursos. Cada filtro adicional se concatena al where de Prisma para refinar la búsqueda del candidato más cualificado.
```

---

## PRUEBAS DE ACEPTACIÓN

---

**Prueba de Aceptación #01 - Gestionar plazas**

```
Caso de Prueba de Aceptación
Código: PA-01                                   Historia de Usuario: HU-01 - Gestionar plazas
Nombre: Gestionar plazas
Descripción: Comprobar que el técnico puede crear, editar, eliminar y activar/inactivar plazas de empleo.
Condiciones de Ejecución: Tener sesión activa como técnico de Turempleo.
Entrada / Pasos de ejecución:
1. Iniciar sesión como técnico.
2. Acceder al módulo "Plazas".
3. Crear una nueva plaza con nombre, requisitos y funciones.
4. Verificar que la plaza aparece en la lista.
5. Editar la plaza creada.
6. Activar/inactivar la plaza usando el toggle.
7. Intentar eliminar una plaza con solicitudes asociadas.
Resultado Esperado: La plaza se crea, edita y activa/inactiva correctamente. La eliminación de plaza con solicitudes muestra mensaje de error.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #02 - Realizar solicitud de plazas**

```
Caso de Prueba de Aceptación
Código: PA-02                                   Historia de Usuario: HU-02 - Realizar solicitud de plazas
Nombre: Realizar solicitud de plazas
Descripción: Comprobar que el candidato puede ver plazas, completar el formulario y recibir PIN por email.
Condiciones de Ejecución: Acceso a la página pública del portal.
Entrada / Pasos de ejecución:
1. Acceder a la página principal del portal.
2. Visualizar las plazas disponibles.
3. Seleccionar una plaza.
4. Completar el formulario con datos personales, familiares, dirección, nivel escolar, experiencia laboral.
5. Marcar los requisitos cumplidos de la plaza.
6. Proporcionar correo electrónico válido.
7. Enviar la solicitud.
Resultado Esperado: El sistema genera un PIN de 6 dígitos, envía email de confirmación y muestra mensaje de éxito con el PIN.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #03 - Gestionar solicitudes**

```
Caso de Prueba de Aceptación
Código: PA-03                                   Historia de Usuario: HU-03 - Gestionar solicitudes
Nombre: Gestionar solicitudes
Descripción: Comprobar que el técnico puede visualizar, filtrar, aprobar y rechazar solicitudes.
Condiciones de Ejecución: Tener sesión activa como técnico de Turempleo.
Entrada / Pasos de ejecución:
1. Iniciar sesión como técnico.
2. Acceder al módulo "Solicitudes".
3. Visualizar la lista de solicitudes.
4. Filtrar solicitudes por estado (pendiente, aprobado, rechazado).
5. Buscar una solicitud por nombre o CI.
6. Ver el detalle completo de un candidato.
7. Aprobar una solicitud pendiente.
8. Rechazar una solicitud con motivo obligatorio.
Resultado Esperado: Las solicitudes se listan, filtran y buscan correctamente. Al aprobar, el estado cambia a "aprobado". Al rechazar, el sistema exige motivo obligatorio.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #04 - Gestionar candidatos**

```
Caso de Prueba de Aceptación
Código: PA-04                                   Historia de Usuario: HU-04 - Gestionar candidatos
Nombre: Gestionar candidatos
Descripción: Comprobar que el técnico puede citar candidatos y evaluar entrevistas.
Condiciones de Ejecución: Tener solicitudes aprobadas y candidatos citados.
Entrada / Pasos de ejecución:
1. Iniciar sesión como técnico.
2. Acceder al módulo "Candidatos".
3. Visualizar candidatos organizados por tabs (pendientes, citados, aprobados, rechazados).
4. Seleccionar un candidato aprobado y programar cita de entrevista.
5. Definir fecha, dirección y requisitos para la entrevista.
6. Editar una cita existente.
7. Evaluar al candidato post-entrevista con documentos y averiguaciones.
8. Aprobar o rechazar al candidato.
Resultado Esperado: Las citas se programan, editan y notifican por email. La evaluación permite registrar documentos y resultados. Aprobados pasan a reserva laboral.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #05 - Gestionar reserva**

```
Caso de Prueba de Aceptación
Código: PA-05                                   Historia de Usuario: HU-05 - Gestionar reserva
Nombre: Gestionar reserva laboral
Descripción: Comprobar que el técnico puede listar y filtrar candidatos en reserva laboral.
Condiciones de Ejecución: Tener candidatos aprobados en entrevistas.
Entrada / Pasos de ejecución:
1. Iniciar sesión como técnico.
2. Acceder al módulo "Reserva".
3. Visualizar la lista de candidatos aprobados.
4. Filtrar por plaza específica.
5. Aplicar filtros secundarios (idioma, titulación, licencia, oficios, cursos).
6. Ver el detalle completo de un candidato en reserva.
Resultado Esperado: Los candidatos en reserva se listan correctamente. Los filtros reducen los resultados según los criterios seleccionados.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #06 - Gestionar roles**

```
Caso de Prueba de Aceptación
Código: PA-06                                   Historia de Usuario: HU-06 - Gestionar roles
Nombre: Gestionar roles
Descripción: Comprobar que el administrador puede asignar roles a los usuarios.
Condiciones de Ejecución: Tener sesión activa como administrador.
Entrada / Pasos de ejecución:
1. Iniciar sesión como administrador.
2. Acceder al módulo "Roles".
3. Visualizar los roles disponibles (definidos por defecto).
4. Asignar un rol a un usuario específico.
5. Verificar que los permisos del rol se aplican correctamente.
Resultado Esperado: Los roles disponibles se listan. La asignación de rol a usuario se realiza correctamente y los permisos se reflejan en el acceso.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #07 - Gestionar usuarios**

```
Caso de Prueba de Aceptación
Código: PA-07                                   Historia de Usuario: HU-07 - Gestionar usuarios
Nombre: Gestionar usuarios
Descripción: Comprobar que el administrador puede registrar, editar, eliminar usuarios y asignar roles.
Condiciones de Ejecución: Tener sesión activa como administrador.
Entrada / Pasos de ejecución:
1. Iniciar sesión como administrador.
2. Acceder al módulo "Usuarios".
3. Registrar un nuevo usuario con nombre, email, contraseña y rol.
4. Editar los datos de un usuario existente.
5. Asignar un rol diferente a un usuario.
6. Eliminar un usuario.
7. Verificar que el sistema notifica el resultado de cada acción.
Resultado Esperado: Los usuarios se crean, editan, eliminan y asignan roles correctamente. El sistema muestra mensajes de confirmación.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #08 - Autenticarse en el sistema**

```
Caso de Prueba de Aceptación
Código: PA-08                                   Historia de Usuario: HU-08 - Autenticarse en el sistema
Nombre: Autenticarse en el sistema
Descripción: Comprobar que los técnicos/administradores pueden iniciar y cerrar sesión de forma segura.
Condiciones de Ejecución: Tener un usuario registrado en el sistema.
Entrada / Pasos de ejecución:
1. Acceder a la página de login.
2. Ingresar credenciales incorrectas (verificar mensaje de error).
3. Ingresar credenciales correctas.
4. Verificar acceso al panel de administración.
5. Intentar acceder a rutas privadas sin sesión (debe redirigir al login).
6. Cerrar sesión.
7. Verificar que las rutas privadas ya no son accesibles.
Resultado Esperado: Las credenciales válidas permiten el acceso y generan token JWT. Credenciales inválidas muestran error. Rutas protegidas redirigen a login si no hay sesión.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #09 - Realizar gráficos estadísticos**

```
Caso de Prueba de Aceptación
Código: PA-09                                   Historia de Usuario: HU-09 - Realizar gráficos estadísticos
Nombre: Realizar gráficos estadísticos
Descripción: Comprobar que los gráficos muestran datos del proceso de selección y se pueden exportar.
Condiciones de Ejecución: Tener datos de solicitudes, entrevistas y reserva laboral.
Entrada / Pasos de ejecución:
1. Iniciar sesión como administrador o técnico.
2. Acceder al módulo de estadísticas/gráficos.
3. Visualizar gráfico de solicitudes por mes.
4. Visualizar porcentaje de aceptación.
5. Visualizar categorías más demandadas.
6. Seleccionar un rango temporal específico.
7. Exportar los gráficos.
Resultado Esperado: Los gráficos se cargan con datos reales. La selección de rango temporal actualiza los gráficos. La exportación genera archivo descargable.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #10 - Generar informes**

```
Caso de Prueba de Aceptación
Código: PA-10                                   Historia de Usuario: HU-10 - Generar informes
Nombre: Generar informes
Descripción: Comprobar que el administrador puede generar informes en PDF y Excel con filtros.
Condiciones de Ejecución: Tener sesión activa como administrador y datos en el sistema.
Entrada / Pasos de ejecución:
1. Iniciar sesión como administrador.
2. Acceder al módulo de informes.
3. Seleccionar filtros (estado de solicitudes, plazas, rango de fechas).
4. Generar informe en formato PDF.
5. Generar informe en formato Excel.
6. Descargar los informes generados.
Resultado Esperado: Los informes se generan con los filtros seleccionados. Los formatos PDF y Excel contienen los datos correctos y se descargan exitosamente.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #11 - Validación de campos críticos**

```
Caso de Prueba de Aceptación
Código: PA-11                                   Historia de Usuario: HU-11 - Validación de campos críticos
Nombre: Validación de campos críticos
Descripción: Comprobar que el sistema valida campos obligatorios y formatos antes de procesar información.
Condiciones de Ejecución: Estar en cualquier formulario del sistema.
Entrada / Pasos de ejecución:
1. Intentar enviar formulario sin campos obligatorios (verificar mensaje de error).
2. Ingresar CI con formato incorrecto (menos o más de 11 dígitos).
3. Ingresar email con formato inválido.
4. Ingresar teléfono sin formato +53.
5. Dejar campos obligatorios vacíos en solicitudes, plazas o evaluaciones.
6. Verificar que el sistema no permite guardar datos incompletos.
Resultado Esperado: El sistema muestra mensajes de error para campos obligatorios vacíos. Los formatos de CI, email y teléfono se validan. No se permiten registros incompletos.
Evaluación de la Prueba:
```

---

**Prueba de Aceptación #12 - Consultar estado de solicitud**

```
Caso de Prueba de Aceptación
Código: PA-12                                   Historia de Usuario: HU-12 - Consultar estado de solicitud
Nombre: Consultar estado de solicitud
Descripción: Comprobar que el candidato puede consultar el estado de su solicitud con CI y PIN.
Condiciones de Ejecución: Haber realizado al menos una solicitud y tener el PIN.
Entrada / Pasos de ejecución:
1. Acceder a la página pública de consulta de estado.
2. Ingresar CI y PIN incorrectos (verificar mensaje de error).
3. Ingresar CI y PIN de una solicitud pendiente.
4. Verificar mensaje "Solicitud en revisión".
5. Ingresar CI y PIN de una solicitud aprobada.
6. Verificar mensaje "Pendiente de citar".
7. Ingresar CI y PIN de una solicitud citada.
8. Verificar que se muestra fecha, dirección y requisitos de la cita.
9. Ingresar CI y PIN de un candidato aprobado en reserva.
10. Verificar mensaje "En Reserva Laboral".
Resultado Esperado: El sistema muestra el estado correspondiente según el progreso de la solicitud. Los detalles de cita se muestran cuando aplica. Mensaje de rechazo incluye motivo.
Evaluación de la Prueba:
```
