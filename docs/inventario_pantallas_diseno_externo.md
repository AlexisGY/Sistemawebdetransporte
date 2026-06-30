## Inventario de pantallas para el nuevo Diseño Externo

### 1. Seguridad

| Código | Pantalla                       | Finalidad                                                                                  |
| ------ | ------------------------------ | ------------------------------------------------------------------------------------------ |
| SEG-01 | Login / Pantalla de ingreso    | Controlar quién accede al sistema mediante usuario o DNI y contraseña.                     |
| SEG-02 | Métodos alternativos de acceso | Permitir el ingreso mediante métodos alternativos como PIN, QR u otros definidos.          |
| SEG-03 | Gestión de perfiles y permisos | Administrar perfiles, módulos accesibles y permisos por rol. El rol está fijo por usuario. |

---

### 2. Online Gerencial — Mantenimiento de parámetros

Cada catálogo debe tener interfaz propia, aunque puede usar el mismo patrón visual: lista, detalle y edición.

| Código | Pantalla                         | Módulo                  |
| ------ | -------------------------------- | ----------------------- |
| CAT-01 | Catálogo de vehículos            | Recursos físicos        |
| CAT-02 | Catálogo de operarios            | Recursos físicos        |
| CAT-03 | Catálogo de sedes                | Recursos físicos        |
| CAT-04 | Catálogo de contenedores         | Recursos físicos        |
| CAT-05 | Catálogo de bienes               | Recursos físicos        |
| CAT-06 | Catálogo de unidades de medida   | Recursos físicos        |
| CAT-07 | Catálogo de clientes             | Tipología comercial     |
| CAT-08 | Catálogo de servicios            | Tipología comercial     |
| CAT-09 | Catálogo de rutas y coberturas   | Tipología comercial     |
| CAT-10 | Catálogo de horarios             | Tipología comercial     |
| CAT-11 | Catálogo de tarifarios           | Tipología comercial     |
| CAT-12 | Catálogo de políticas de negocio | Normativas y protocolos |
| CAT-13 | Catálogo de reglas de negocio    | Normativas y protocolos |
| CAT-14 | Catálogo de protocolos           | Normativas y protocolos |

Cada catálogo debe mostrar como mínimo:

* Estado vacío para agregar un nuevo registro.
* Estado con datos en grilla o lista.
* Estado de edición con campos llenos.
* Buscar o filtrar registros.
* Ver detalle de un registro.
* Agregar, modificar y eliminar o desactivar.

---

### 3. Online Gerencial — Consultas

| Código | Pantalla                           | Finalidad                                                                       |
| ------ | ---------------------------------- | ------------------------------------------------------------------------------- |
| GER-01 | Dashboard gerencial                | Mostrar resumen general del sistema mediante KPIs principales.                  |
| GER-02 | Consulta de desempeño de operarios | Evaluar productividad, cumplimiento, asignaciones e incidencias de operarios.   |
| GER-03 | Consulta de desempeño vehicular    | Evaluar uso, disponibilidad, frecuencia e incidencias de vehículos.             |
| GER-04 | Consulta de ingresos               | Analizar ingresos por ruta, servicio, horario o periodo.                        |
| GER-05 | Consulta de incidencias            | Analizar incidencias registradas, recurrencia, tipo de falla y área afectada.   |
| GER-06 | Consulta de demanda y ocupación    | Analizar demanda por ruta, horario, servicio y nivel de ocupación.              |
| GER-07 | Consulta de indicadores KPI        | Mostrar indicadores consolidados de operación, ingresos, incidencias y demanda. |

Cada consulta gerencial debe tener:

* Filtros de periodo.
* Filtros por ruta, servicio, estado o categoría.
* Tabla de resultados.
* Gráfica.
* KPI resumen.
* Opción de exportar o descargar.

---

### 4. Online Operativo — Data-Entry

| Código | Pantalla                  | Finalidad                                                                                          |
| ------ | ------------------------- | -------------------------------------------------------------------------------------------------- |
| OPE-01 | Dashboard operativo       | Mostrar viajes próximos, reservas pendientes, pagos, check-in y alertas operativas.                |
| OPE-02 | Ajuste operativo de viaje | Registrar cambios excepcionales sobre un viaje ya programado.                                      |
| OPE-03 | Cotización                | Calcular disponibilidad, tarifa y condiciones del servicio solicitado.                             |
| OPE-04 | Reserva de tickets        | Proceso central del sistema: el cliente o el operador selecciona y reserva el servicio disponible. |
| OPE-05 | Orden de pago             | Registrar el cobro y confirmar comercialmente la reserva.                                          |
| OPE-06 | Check-in y embarque       | Validar ticket, pasajero o carga y registrar embarque.                                             |
| OPE-07 | Llegada y cierre          | Registrar culminación del viaje, incidencias y estado final.                                       |

Flujo operativo normal:

Cotización → Reserva de tickets → Orden de pago → Check-in y embarque → Llegada y cierre.

El ajuste operativo de viaje queda fuera del flujo normal, porque atiende casos excepcionales sobre viajes ya programados.

---

### 5. Online Operativo — Reportes

| Código | Pantalla             | Finalidad                                                                          |
| ------ | -------------------- | ---------------------------------------------------------------------------------- |
| REP-01 | Ticket de viaje      | Mostrar o descargar el documento que acredita el servicio adquirido.               |
| REP-02 | Comprobante de pago  | Mostrar o descargar la constancia de pago.                                         |
| REP-03 | Manifiesto de viaje  | Mostrar pasajeros, carga, vehículo, operarios y ocupación del viaje.               |
| REP-04 | Cierre de viaje      | Mostrar el resumen final del viaje culminado.                                      |
| REP-05 | Seguimiento de viaje | Visualizar estado actual del viaje, ruta, horario, incidencias y avance operativo. |

Los reportes no deben modificar datos. Solo muestran, imprimen o descargan información.

---

### 6. Batch Aplicativo

El Batch Aplicativo no se representa como pantalla de atención al usuario final. Sus procesos existen internamente para fabricar tickets, regularizar estados, liquidar viajes y generar estadísticas.

Sus resultados se reflejan en otros módulos del sistema:

| Proceso Batch                           | Dónde se refleja                                              |
| --------------------------------------- | ------------------------------------------------------------- |
| Fabricación de tickets                  | Disponibilidad usada por cotización y reserva.                |
| Regularización de estados de tickets    | Estados consistentes para reserva, pago, check-in y reportes. |
| Regularización de estados de viaje      | Estados consistentes para seguimiento, cierre y consultas.    |
| Liquidación de viajes                   | Información consolidada para reportes y estadísticas.         |
| Generación de estadísticas e históricos | Consultas gerenciales, dashboards y KPIs.                     |

Opcionalmente, el sistema podría contar con una vista técnica de monitoreo, pero no forma parte del flujo operativo del usuario.

---

### 7. Batch Técnico

Estas funcionalidades pueden existir como herramientas técnicas o administrativas, pero no necesariamente como pantallas visibles dentro del sistema principal.

| Código | Pantalla                   | Finalidad                                                         |
| ------ | -------------------------- | ----------------------------------------------------------------- |
| TEC-01 | Backup                     | Gestionar copias de seguridad del sistema.                        |
| TEC-02 | Restore                    | Permitir la recuperación controlada de información desde backups. |
| TEC-03 | Verificación de integridad | Validar consistencia de datos después de procesos técnicos.       |

Estas funciones pertenecen al perfil técnico o administrador y pueden implementarse fuera del flujo principal del sistema.

---

## Pantallas que NO deben aparecer como módulos operativos

No deben aparecer como pantallas normales del módulo operativo:

* Fabricación de tickets.
* Lotes de tickets.
* Liberación de reservas vencidas.
* Emisión de ticket como transacción independiente.
* Actualización manual de procesos batch.

La fabricación de tickets pertenece a procesos internos Batch.
El ticket de viaje pertenece a Reportes.
La confirmación comercial ocurre en Orden de pago.
