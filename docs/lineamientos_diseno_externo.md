# Lineamientos de Diseño Externo

## Propósito

Este documento define las reglas que deben seguirse para rehacer el Diseño Externo del Sistema de Transporte. Su objetivo es asegurar que las pantallas, navegación y componentes del prototipo respeten la arquitectura final del sistema, evitando arrastrar módulos antiguos o mezclar procesos Online con procesos Batch.

El diseño externo debe representar lo que el usuario ve y utiliza. Por ello, las pantallas deben corresponder directamente a los módulos definidos en la arquitectura: Seguridad, Online Gerencial, Online Operativo, Reportes y, solo si corresponde, herramientas técnicas o administrativas.

---

## 1. Reglas generales

1. Cada pantalla debe corresponder a un módulo o submódulo definido en el inventario de pantallas.
2. No se deben agregar pantallas que no estén en el inventario aprobado.
3. No se deben representar procesos Batch como si fueran transacciones normales del usuario operativo.
4. El módulo Operativo Online no fabrica tickets ni genera lotes; solo trabaja con viajes y tickets previamente generados por procesos internos.
5. La emisión de ticket no debe existir como transacción independiente. El ticket de viaje se presenta como reporte y la confirmación comercial ocurre en Orden de pago.
6. Los reportes no deben modificar información. Solo muestran, imprimen o descargan datos.
7. Las consultas gerenciales deben mostrar información consolidada, histórica o estadística, no registrar transacciones operativas.
8. Los catálogos deben permitir mantenimiento completo de parámetros: listar, buscar, ver detalle, agregar, modificar y eliminar o desactivar.
9. La interfaz debe usar datos representativos del negocio de transporte, no textos genéricos.
10. La navegación debe reflejar claramente la separación entre Seguridad, Gerencial, Operativo y Reportes.

---

## 2. Navegación principal

La navegación del sistema debe organizarse en bloques coherentes con la arquitectura.

### 2.1 Seguridad

- Login / Pantalla de ingreso.
- Métodos alternativos de acceso.
- Gestión de perfiles y permisos.

### 2.2 Gerencial

- Dashboard gerencial.
- Mantenimiento de parámetros.
- Consultas gerenciales.

### 2.3 Operativo

- Dashboard operativo.
- Data-Entry operativo.
- Reportes operativos.

### 2.4 Técnico / Administrativo

- Backup.
- Restore.
- Verificación de integridad.

Este bloque puede mostrarse solo para perfiles técnicos o administradores. No debe formar parte del flujo operativo normal.

---

## 3. Lineamientos para pantallas de Seguridad

Las pantallas de seguridad deben controlar el acceso al sistema y mostrar claramente el perfil autorizado.

### 3.1 Login / Pantalla de ingreso

Debe incluir:

- Identificación del sistema.
- Campo usuario, DNI o correo.
- Campo contraseña.
- Botón de ingreso.
- Acceso a recuperación de contraseña, si se considera necesario.
- Mensaje de error ante credenciales inválidas.
- Diseño sobrio, institucional y sin elementos operativos del negocio.

### 3.2 Métodos alternativos de acceso

Debe incluir:

- Opción de ingreso mediante PIN, QR u otro método definido.
- Mensaje de validación.
- Botón para volver al ingreso normal.
- Explicación breve del método seleccionado.

### 3.3 Gestión de perfiles y permisos

Debe incluir:

- Lista de perfiles.
- Detalle del perfil seleccionado.
- Módulos permitidos.
- Usuarios asociados al perfil.
- Acciones para agregar, modificar y desactivar perfiles.
- No debe permitir que el usuario elija libremente su rol operativo al ingresar; el rol está asociado al usuario.

---

## 4. Lineamientos para catálogos y parámetros

Todo catálogo debe tener tres estados visuales mínimos y seis acciones funcionales.

### 4.1 Estados visuales obligatorios

| Estado | Descripción |
|---|---|
| Estado vacío | Formulario limpio para registrar un nuevo elemento. |
| Estado con datos | Lista o grilla de registros existentes. |
| Estado de edición | Formulario con campos cargados para modificar un registro existente. |

### 4.2 Acciones obligatorias

Cada catálogo debe permitir:

1. Ver lista de registros.
2. Buscar o filtrar.
3. Ver detalle.
4. Agregar.
5. Modificar.
6. Eliminar o desactivar.

### 4.3 Estructura visual recomendada

Cada pantalla de catálogo debe incluir:

- Título del catálogo.
- Descripción breve de su función.
- Barra de búsqueda.
- Filtros principales.
- Tabla o grilla de registros.
- Botón “Agregar”.
- Acción “Ver detalle”.
- Acción “Editar”.
- Acción “Eliminar” o “Desactivar”.
- Panel o modal de detalle.
- Formulario de creación/edición.

### 4.4 Criterios por tipo de catálogo

#### Recursos físicos

Incluye vehículos, operarios, sedes, contenedores, bienes y unidades de medida.

Estos catálogos deben mostrar datos relacionados con capacidad, disponibilidad, estado físico, ubicación o uso operativo.

#### Tipología comercial

Incluye clientes, servicios, rutas, horarios y tarifarios.

Estos catálogos deben mostrar datos relacionados con el servicio vendido, condiciones comerciales, horarios, rutas, precios y características del cliente.

#### Normativas y protocolos

Incluye políticas de negocio, reglas de negocio y protocolos.

Estos catálogos deben mostrar condiciones, restricciones, reglas aplicables, secuencias o pasos del proceso de atención.

---

## 5. Lineamientos para consultas gerenciales

Las consultas gerenciales deben presentar información consolidada para la toma de decisiones. No deben comportarse como formularios transaccionales.

### 5.1 Componentes mínimos

Cada consulta gerencial debe incluir:

- Filtros de periodo.
- Filtros por ruta, servicio, estado, categoría o recurso.
- KPIs resumen.
- Gráfico principal.
- Tabla de resultados.
- Opción de exportar o descargar.
- Fecha de última actualización.

### 5.2 Consultas gerenciales definidas

| Consulta | Enfoque |
|---|---|
| Dashboard gerencial | Vista global del sistema. |
| Desempeño de operarios | Productividad, cumplimiento, asignaciones e incidencias. |
| Desempeño vehicular | Uso, disponibilidad, frecuencia e incidencias de vehículos. |
| Ingresos | Análisis económico por ruta, servicio, horario o periodo. |
| Incidencias | Recurrencia, tipo de falla, área afectada y tendencia. |
| Demanda y ocupación | Demanda por ruta, horario, servicio y nivel de ocupación. |
| Indicadores KPI | Métricas consolidadas de operación, ingresos, incidencias y demanda. |

### 5.3 Reglas de diseño

- Las consultas deben priorizar lectura rápida.
- Los KPIs deben ubicarse en la parte superior.
- Los gráficos deben responder a los filtros seleccionados.
- La tabla debe permitir revisar el detalle que sustenta el indicador.
- No se deben colocar botones de registro de transacciones operativas dentro de consultas gerenciales.

---

## 6. Lineamientos para Data-Entry operativo

Las pantallas de Data-Entry representan transacciones que modifican la base de datos. Por eso deben guiar al usuario paso a paso, validar datos y confirmar la operación antes de registrar cambios.

### 6.1 Componentes mínimos

Cada pantalla de Data-Entry debe incluir:

- Título claro de la transacción.
- Datos de búsqueda o selección inicial.
- Formulario principal.
- Validaciones visibles.
- Resumen antes de confirmar.
- Botón de confirmación.
- Mensaje de resultado.
- Estado generado por la operación.
- Acceso al reporte relacionado, si corresponde.

### 6.2 Flujo operativo normal

El flujo operativo debe seguir esta secuencia:

Cotización → Reserva de tickets → Orden de pago → Check-in y embarque → Llegada y cierre.

El ajuste operativo de viaje queda fuera del flujo normal, porque atiende casos excepcionales sobre viajes ya programados.

### 6.3 Pantallas operativas definidas

| Pantalla | Lineamiento |
|---|---|
| Dashboard operativo | Debe mostrar viajes próximos, reservas pendientes, pagos, check-in y alertas operativas. |
| Ajuste operativo de viaje | Debe registrar cambios excepcionales sobre viajes ya programados, sin crear viajes ni fabricar tickets. |
| Cotización | Debe calcular disponibilidad, tarifa y condiciones del servicio solicitado. |
| Reserva de tickets | Debe asignar al cliente un ticket o cupo previamente generado por Batch. |
| Orden de pago | Debe registrar el cobro y confirmar comercialmente la reserva. |
| Check-in y embarque | Debe validar ticket, pasajero o carga y registrar embarque. |
| Llegada y cierre | Debe registrar culminación del viaje, incidencias y estado final. |

### 6.4 Reglas especiales

- Cotización evalúa disponibilidad, tarifa, políticas y reglas.
- Reserva compromete una existencia disponible.
- Orden de pago confirma comercialmente la reserva.
- Check-in y embarque validan el uso real del servicio.
- Llegada y cierre registran la culminación operativa.
- Ajuste operativo no pertenece al flujo normal de compra.

---

## 7. Lineamientos para reportes operativos

Los reportes operativos son salidas del sistema. Su función es mostrar, imprimir o descargar información, no modificar datos.

### 7.1 Componentes mínimos

Cada reporte debe incluir:

- Título del reporte.
- Código o identificador.
- Fecha y hora de generación.
- Datos principales del viaje, ticket, cliente o pago.
- Estado asociado.
- Botón para imprimir.
- Botón para descargar.
- Opción para volver al módulo relacionado.

### 7.2 Reportes definidos

| Reporte | Finalidad |
|---|---|
| Ticket de viaje | Acreditar el servicio adquirido por el cliente. |
| Comprobante de pago | Presentar constancia de la operación económica. |
| Manifiesto de viaje | Mostrar pasajeros, carga, vehículo, operarios y ocupación. |
| Cierre de viaje | Resumir el resultado final del viaje culminado. |
| Seguimiento de viaje | Visualizar estado actual, ruta, horario, incidencias y avance operativo. |

### 7.3 Reglas de diseño

- No colocar botones de edición en reportes.
- No registrar cambios desde la pantalla de reporte.
- Diferenciar claramente “ver reporte” de “registrar transacción”.
- Mostrar siempre el estado actual del documento o viaje.
- Incluir información suficiente para trazabilidad operativa.

---

## 8. Lineamientos para Batch Aplicativo

El Batch Aplicativo no debe representarse como una pantalla de atención al usuario final. Sus procesos se ejecutan internamente y sus resultados se reflejan en otros módulos.

### 8.1 Procesos internos considerados

- Fabricación de tickets.
- Regularización de estados de tickets.
- Regularización de estados de viaje.
- Liquidación de viajes.
- Generación de estadísticas e históricos.
- Pre-cálculo de KPIs.

### 8.2 Reflejo de Batch en el diseño externo

| Proceso Batch | Dónde se refleja |
|---|---|
| Fabricación de tickets | Disponibilidad usada en cotización y reserva. |
| Regularización de tickets | Estados consistentes para pago, check-in y reportes. |
| Regularización de viajes | Estados consistentes para seguimiento, cierre y consultas. |
| Liquidación de viajes | Información consolidada para reportes y estadísticas. |
| Estadísticas e históricos | Consultas gerenciales, dashboard y KPIs. |

### 8.3 Reglas de diseño

- No crear una pantalla operativa para fabricar tickets.
- No mostrar lotes de tickets como módulo de atención al usuario.
- No permitir actualización manual de procesos Batch desde el flujo operativo.
- Si se representa Batch, debe ser solo como monitoreo técnico o administrativo.
- El usuario operativo no debe ejecutar procesos Batch manualmente.

---

## 9. Lineamientos para Batch Técnico

El Batch Técnico puede existir como herramienta técnica o administrativa, pero no necesariamente como pantalla visible dentro del sistema principal.

### 9.1 Funciones técnicas consideradas

- Backup.
- Restore.
- Verificación de integridad.

### 9.2 Reglas de diseño

- Estas funciones deben estar restringidas a perfiles técnicos o administradores.
- No deben aparecer en el menú operativo.
- No deben mezclarse con cotización, reserva, pago o check-in.
- Deben mostrar estado, fecha de ejecución, responsable y resultado.
- Si se implementan fuera del sistema principal, debe indicarse como herramienta administrativa o técnica.

---

## 10. Pantallas o módulos prohibidos en Operativo

No deben aparecer como módulos operativos:

- Fabricación de tickets.
- Lotes de tickets.
- Liberación de reservas vencidas.
- Emisión de ticket como transacción independiente.
- Actualización manual de procesos Batch.
- Mantenimiento técnico de base de datos.
- Backup o restore dentro del flujo operativo.

### Justificación

La fabricación de tickets pertenece a procesos internos Batch.  
El ticket de viaje pertenece a Reportes.  
La confirmación comercial ocurre en Orden de pago.  
Las funciones técnicas pertenecen a perfiles técnicos o administrativos.

---

## 11. Criterios de aceptación del nuevo Diseño Externo

El nuevo diseño externo será considerado correcto si cumple los siguientes criterios:

1. La navegación coincide con la arquitectura final.
2. Las pantallas coinciden con el inventario aprobado.
3. No existen módulos operativos antiguos o eliminados.
4. Cada catálogo muestra lista, detalle, edición y estado vacío.
5. Cada catálogo permite agregar, modificar, eliminar o desactivar, buscar y ver detalle.
6. Cada consulta gerencial tiene filtros, KPIs, gráfica, tabla y exportación.
7. Cada Data-Entry tiene formulario, validación, confirmación y resultado.
8. Cada reporte permite visualizar, imprimir o descargar, sin modificar datos.
9. Batch no aparece como flujo operativo del usuario.
10. Las incidencias se registran en operación y se analizan en consultas gerenciales.
11. La emisión de ticket no existe como transacción independiente.
12. El sistema muestra datos representativos del negocio de transporte.
13. El diseño permite explicar claramente la diferencia entre Data-Entry, Reportes, Consultas, Catálogos y Batch.
14. Las pantallas están preparadas para ser defendidas frente al profesor sin contradicciones conceptuales.

---

## 12. Prompt base para implementación o generación de mockups

Usa este documento junto con el inventario de pantallas como fuente de verdad para rehacer el Diseño Externo del Sistema de Transporte.

Reglas obligatorias:

- No agregues pantallas fuera del inventario aprobado.
- No reutilices módulos antiguos que contradigan la arquitectura final.
- No muestres fabricación de tickets, lotes de tickets o emisión de ticket como transacciones operativas.
- Rehaz la navegación principal según Seguridad, Gerencial, Operativo, Reportes y Técnico.
- Usa datos representativos del negocio de transporte.
- Asegura que cada catálogo tenga lista, detalle, edición y estado vacío.
- Asegura que cada consulta gerencial tenga filtros, KPIs, gráfica y tabla.
- Asegura que cada Data-Entry tenga formulario, validación, confirmación y resultado.
- Asegura que cada reporte sea solo de visualización, impresión o descarga.
- Mantén Batch como proceso interno o, si se muestra, como monitoreo técnico.
