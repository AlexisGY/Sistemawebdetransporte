# Arquitectura Final — Sistema de Transporte

> Documento de memoria del proyecto para usar como base del nuevo Diseño Externo.  
> Enfoque: arquitectura refinada según la separación **Seguridad / On-Line / Batch**, evitando arrastrar módulos de versiones anteriores.

---

## 0. Criterio general para el diseño externo

Antes de prototipar pantallas, se debe respetar esta regla:

**Cada módulo definido en la arquitectura debe tener una interfaz correspondiente**, pero no todos los módulos se comportan igual:

- Los módulos **On-Line** sí representan interacción directa del usuario.
- Los módulos **Data-Entry** registran transacciones y modifican la base de datos.
- Los módulos **Reportes** muestran documentos o vistas operativas, sin representar una nueva transacción.
- Los módulos **Batch** no deben verse como pantallas operativas normales; deben representarse como paneles de monitoreo, control o consulta técnica de procesos automáticos.
- Los **catálogos/parámetros** deben permitir mantenimiento completo, no solo mostrar una lista.

### Regla para catálogos en mockups

Todo catálogo debe mostrar tres estados visuales:

1. **Estado vacío:** formulario limpio para agregar un nuevo registro.
2. **Estado con datos:** grilla/lista de registros existentes.
3. **Estado de edición:** formulario con campos llenos para modificar un registro.

Además, toda pantalla de catálogo debe permitir seis acciones:

1. Ver lista de registros.
2. Agregar registro.
3. Modificar registro.
4. Eliminar o desactivar registro.
5. Buscar / filtrar registros.
6. Ver detalle de un registro.

---

# 1. Seguridad

El bloque de Seguridad controla quién puede ingresar al sistema y qué puede hacer dentro de él.

## 1.1 Control de acceso

Pantallas recomendadas:

- Login.
- Recuperación de acceso.
- Autenticación adicional simple: PIN, OTP o código interno.
- Selección de perfil.

Elementos mínimos:

- URL visible y coherente con el sistema.
- Nombre o logo del sistema.
- Campo de usuario / DNI.
- Campo de contraseña.
- Botón de ingreso.
- Método adicional de autenticación justificable.
- Mensajes de error claros.

## 1.2 Perfiles y permisos

Este módulo permite definir qué funcionalidades puede utilizar cada perfil.

Perfiles sugeridos:

| Perfil | Acceso principal |
|---|---|
| Administrador | Seguridad, catálogos, parámetros, protocolos, control técnico |
| Operativo | Cotización, reserva, orden de pago, check-in, embarque, llegada, cierre y reportes operativos |
| Gerencial | Consultas, gráficas, indicadores y estadísticas |
| Técnico | Monitoreo Batch, backup, restore y mantenimiento de base de datos |

La pantalla debe permitir:

- Listar perfiles.
- Ver detalle de permisos.
- Agregar perfil.
- Modificar perfil.
- Desactivar perfil.
- Asignar módulos permitidos por perfil.

---

# 2. On-Line

El bloque On-Line agrupa los módulos que interactúan directamente con el usuario. Se divide en:

- **2.1 Gerencial**
- **2.2 Operativo**

---

# 2.1 Gerencial

El bloque Gerencial está orientado a usuarios que toman decisiones. Sus pantallas no deben registrar transacciones operativas, sino mostrar información histórica, estadística y de tendencia.

Se divide en:

- **2.1.1 Mantenimiento de parámetros**
- **2.1.2 Consulta**

---

## 2.1.1 Mantenimiento de parámetros

Este bloque contiene los catálogos que parametrizan el sistema. Permite que el sistema sea flexible, multi-sede, multi-servicio, multi-cliente y configurable sin modificar el código.

Los catálogos se agrupan en tres frentes:

1. Recursos físicos.
2. Tipología comercial.
3. Normativos y protocolos.

---

## A. Recursos físicos

Son los recursos con los que cuenta el sistema antes de operar.

### 2.1.1.1 Catálogo de Vehículos

**Función:** define los recursos móviles disponibles para prestar el servicio.

**Importancia:** permite que el sistema conozca la flota disponible y sus características. Si se incorpora un nuevo tipo de vehículo, se registra en el catálogo sin cambiar el código del sistema.

**Funcionamiento en el proceso central:** limita la cantidad de pasajeros o carga que se puede vender, según la capacidad física del vehículo.

**Ejemplos de parámetros:**

- Tipo de vehículo: bus, minibus, SUV 4x4.
- Placa.
- Capacidad de pasajeros.
- Capacidad de carga.
- Capacidad de tanque.
- Estado de disponibilidad.

---

### 2.1.1.2 Catálogo de Operarios

**Función:** registra al personal operativo que ejecuta el servicio.

**Importancia:** permite controlar quién participa en la operación de los viajes.

**Funcionamiento en el proceso central:** se utiliza en la programación, ejecución y control del viaje. No debe despacharse un viaje sin operario asignado.

**Ejemplos de parámetros:**

- Código de operario.
- Nombre.
- Rol: conductor, ayudante, supervisor.
- Licencia o certificación.
- Estado de disponibilidad.

---

### 2.1.1.3 Catálogo de Sedes

**Función:** define los puntos físicos del sistema.

**Importancia:** permite operar en múltiples sedes, terminales, ciudades o plazas.

**Funcionamiento en el proceso central:** se usa para definir origen, destino, terminales y puntos de atención.

**Ejemplos de parámetros:**

- Ciudad.
- Terminal.
- Dirección.
- Tipo de sede: origen, destino, intermedia, administrativa.
- Estado.

---

### 2.1.1.4 Catálogo de Contenedores

**Función:** define los espacios o unidades disponibles para transportar carga.

**Importancia:** permite controlar capacidad volumétrica o de peso.

**Funcionamiento en el proceso central:** restringe la venta de encomiendas o carga cuando la capacidad ya está ocupada.

**Ejemplos de parámetros:**

- Tipo de contenedor: bodega, tolva, compartimento.
- Capacidad en metros cúbicos.
- Capacidad en toneladas.
- Estado.
- Vehículo asociado, si corresponde.

---

### 2.1.1.5 Catálogo de Bienes

**Función:** define los tipos de mercancías o carga aceptadas por el sistema.

**Importancia:** permite aplicar reglas según la naturaleza del bien transportado.

**Funcionamiento en el proceso central:** sirve como filtro semántico para determinar si un tipo de carga puede ser transportado y bajo qué condiciones.

**Ejemplos de parámetros:**

- Tipo de carga: perecible, frágil, peligrosa, animal vivo, documento, paquete.
- Restricciones.
- Requiere protocolo especial.
- Estado.

---

### 2.1.1.6 Catálogo de Unidades de Medida

**Función:** estandariza las unidades utilizadas en tarifas, carga y capacidad.

**Importancia:** evita inconsistencias de cálculo y permite medir datos de forma uniforme.

**Funcionamiento en el proceso central:** es la métrica base para calcular tarifas y capacidades.

**Ejemplos de parámetros:**

- Código de unidad.
- Abreviatura: KG, M3, TN, UND.
- Descripción: kilogramo, metro cúbico, tonelada, unidad.
- Factor de conversión, si aplica.

---

## B. Tipología comercial

Agrupa a quién se atiende, qué se vende y a qué precio.

### 2.1.1.7 Catálogo de Clientes

**Función:** registra y clasifica a los clientes del sistema.

**Importancia:** permite manejar clientes normales, VIP, corporativos u otros perfiles.

**Funcionamiento en el proceso central:** el sistema lo lee para determinar condiciones de venta, historial, restricciones o beneficios.

**Ejemplos de parámetros:**

- Tipo de cliente: normal, VIP, corporativo.
- Documento.
- Antigüedad.
- Límite de compras o crédito.
- Estado.

---

### 2.1.1.8 Catálogo de Servicios

**Función:** define los servicios que ofrece la empresa de transporte.

**Importancia:** es el corazón comercial del sistema, porque determina qué se puede vender.

**Funcionamiento en el proceso central:** a partir del servicio se programan viajes, tickets o cupos disponibles.

**Ejemplos de parámetros:**

- Código de servicio.
- Descripción: transporte de pasajeros, transporte de carga, encomienda.
- Modalidad.
- Precio base.
- Estado.

---

### 2.1.1.9 Catálogo de Rutas y Coberturas

**Función:** define las rutas y zonas donde opera el sistema.

**Importancia:** delimita el mapa operativo del negocio.

**Funcionamiento en el proceso central:** conecta sedes de origen y destino, y determina distancia, cobertura y restricciones.

**Ejemplos de parámetros:**

- Ciudad origen.
- Ciudad destino.
- Distancia en km.
- Tiempo estimado.
- Ruta habilitada o deshabilitada.

---

### 2.1.1.10 Catálogo de Horarios

**Función:** define los horarios programados del servicio.

**Importancia:** justifica que el sistema opera con servicios programados, no como taxi a demanda.

**Funcionamiento en el proceso central:** junto con servicios, rutas y vehículos, permite generar tickets o cupos para viajes futuros.

**Ejemplos de parámetros:**

- Día de semana.
- Hora de salida.
- Hora estimada de llegada.
- Frecuencia.
- Estado del horario.

---

### 2.1.1.11 Catálogo de Tarifarios

**Función:** define los precios aplicables a servicios, rutas, horarios o unidades de carga.

**Importancia:** separa la lógica de precios del código del sistema.

**Funcionamiento en el proceso central:** se utiliza en cotización, reserva y orden de pago para calcular el importe correspondiente.

**Ejemplos de parámetros:**

- Precio base.
- Moneda.
- Servicio asociado.
- Ruta asociada.
- Unidad de medida.
- Vigencia.
- Estado.

---

## C. Normativos y protocolos

Representan el cerebro normativo del sistema. Definen reglas, condiciones y secuencias bajo las cuales opera el servicio.

### 2.1.1.12 Catálogo de Políticas de Negocio

**Función:** define normas generales o restricciones de negocio.

**Importancia:** determina qué cruces o condiciones son válidas dentro del sistema.

**Funcionamiento en el proceso central:** autoriza o prohíbe acciones generales, como canales de atención o medios de pago permitidos.

**Ejemplos de parámetros:**

- Medio de pago aceptado.
- Canal permitido: presencial, web, teléfono.
- Política de anulación.
- Política de vencimiento de reservas.
- Estado.

---

### 2.1.1.13 Catálogo de Reglas de Negocio

**Función:** evalúa condiciones y aplica acciones comerciales u operativas.

**Importancia:** evita programar demasiados IF/ELSE fijos en el código.

**Funcionamiento en el proceso central:** lee variables durante la operación y, si se cumple una condición, aplica una acción.

**Ejemplos de parámetros:**

- Condición: total de compras mayor a un monto.
- Operador lógico: mayor que, menor que, igual.
- Acción: aplicar descuento, bloquear operación, solicitar validación.
- Valor de comparación.
- Estado.

---

### 2.1.1.14 Catálogo de Protocolos

**Función:** define la secuencia de pasos para ejecutar el servicio.

**Importancia:** ordena el proceso operativo y asegura que las etapas se cumplan en el orden correcto.

**Funcionamiento en el proceso central:** indica que para un viaje primero debe realizarse check-in, luego embarque, luego llegada y finalmente cierre.

**Ejemplos de parámetros:**

- Código de protocolo.
- Secuencia.
- Transacción asociada.
- Condición para pasar al siguiente paso.
- Estado.

---

## 2.1.2 Consulta

El submódulo Consulta del bloque Gerencial organiza la información clave del sistema para medir desempeño, supervisar recursos, controlar incidencias, analizar ingresos, entender la demanda y visualizar indicadores globales.

Toda pantalla de consulta gerencial debe mostrar:

- Filtros de periodo.
- Filtros por ruta, servicio, vehículo, operario o estado, según corresponda.
- Tabla de resultados.
- Gráfica.
- KPIs resumen.
- Opción de exportar o descargar.

---

### 2.1.2.1 Consulta de desempeño de operarios

Se incorpora porque los operarios son un recurso clave del sistema y están directamente vinculados con la ejecución del servicio.

Permite evaluar:

- Productividad.
- Asignaciones.
- Cumplimiento.
- Incidencias asociadas.
- Participación por viaje o periodo.

---

### 2.1.2.2 Consulta de desempeño vehicular

Se agrega porque los vehículos son el principal recurso físico del negocio y condicionan la capacidad de transporte.

Permite analizar:

- Uso de flota.
- Disponibilidad.
- Frecuencia de viajes.
- Ocupación.
- Incidencias vehiculares.
- Rendimiento operativo.

---

### 2.1.2.3 Consulta de ingresos

Se incorpora porque el sistema tiene una dimensión comercial vinculada con clientes, servicios, horarios, rutas y tarifarios.

Permite analizar:

- Ingresos por ruta.
- Ingresos por servicio.
- Ingresos por horario.
- Comparación por periodos.
- Comportamiento económico del sistema.

Nota: si no se modelan costos operativos, es más seguro hablar de **ingresos** que de **rentabilidad**.

---

### 2.1.2.4 Consulta de incidencias

Se agrega porque el sistema no solo opera, sino que también debe cumplir políticas, reglas y protocolos.

Permite detectar:

- Fallas recurrentes.
- Incumplimientos.
- Retrasos.
- Problemas en check-in, embarque, llegada o cierre.
- Incidencias por ruta, vehículo, operario o periodo.

---

### 2.1.2.5 Consulta de demanda y ocupación

Se incorpora porque el sistema se basa en rutas, coberturas, horarios y servicios programados.

Permite identificar:

- Rutas con mayor demanda.
- Rutas con menor demanda.
- Horarios críticos.
- Ocupación por viaje.
- Tendencias de solicitud, reserva y venta.
- Necesidades de ajuste en capacidad, frecuencia o cobertura.

---

### 2.1.2.6 Consulta de indicadores KPI

Se agrega porque la gerencia necesita una vista resumen del estado general del sistema.

Permite consolidar indicadores de:

- Operación.
- Desempeño.
- Ingresos.
- Incidencias.
- Demanda.
- Ocupación.
- Recursos.

Sirve como punto de partida para profundizar en las demás consultas gerenciales.

---

# 2.2 Operativo

El bloque Operativo agrupa las funciones orientadas a la atención diaria del servicio de transporte.

Se divide en:

- **2.2.1 Data-Entry**
- **2.2.2 Reportes**

El módulo Operativo On-Line no fabrica tickets ni genera la disponibilidad del servicio. Esa función corresponde al Batch. El Operativo On-Line usa viajes y tickets previamente generados para cotizar, reservar, cobrar, controlar y cerrar la atención del servicio.

---

## 2.2.1 Data-Entry

Data-Entry representa el registro de transacciones operativas. Estas transacciones modifican datos reales del negocio, como reservas, pagos, estados de viaje, check-in, embarque o cierre.

No debe confundirse con Reportes, porque en Data-Entry sí se registran cambios en la base de datos.

---

### 2.2.1.1 Ajuste operativo de viaje

Permite registrar ajustes excepcionales sobre un viaje previamente programado por el proceso batch de fabricación de tickets.

Su función no es crear viajes ni fabricar tickets, sino corregir o adaptar datos operativos puntuales cuando ocurre una situación no prevista.

Ejemplos:

- Cambio de vehículo.
- Cambio de operario.
- Ajuste controlado de horario.
- Observación de capacidad.
- Incidencia previa a la salida.

Se ubica en Data-Entry porque actualiza un viaje ya existente, pero queda fuera del flujo normal de compra.

---

### 2.2.1.2 Cotización

Realiza la evaluación comercial del servicio solicitado.

Considera datos como:

- Ruta.
- Fecha.
- Horario.
- Tipo de servicio.
- Categoría de asiento.
- Características de carga.
- Tipo de cliente.
- Tarifa.
- Políticas.
- Reglas de negocio.

La cotización puede almacenarse si el cliente solicita una evaluación previa, pero no toda compra debe generar necesariamente una cotización formal almacenada. En una compra directa, el cálculo tarifario puede ejecutarse internamente dentro de la reserva u orden de pago.

Su importancia está en que antes de comprometer un ticket se validan disponibilidad, tarifa, políticas y reglas aplicables.

---

### 2.2.1.3 Reserva de tickets

Asigna a un cliente un ticket disponible previamente generado por Batch.

El sistema no crea el ticket ni abre capacidad futura. La disponibilidad ya existe porque fue fabricada por Batch a partir de rutas, horarios, vehículos, capacidad y reglas del servicio.

La reserva solo toma una existencia disponible y la asocia a un cliente o solicitud específica.

Resultado:

- El ticket cambia de disponible a reservado.
- Se evita que el mismo cupo sea utilizado por otro cliente mientras se completa el proceso comercial.
- Puede registrarse una fecha/hora de vencimiento de reserva.

---

### 2.2.1.4 Orden de pago

Formaliza el cobro asociado a una reserva de ticket.

Registra:

- Monto.
- Concepto.
- Medio de pago.
- Referencia de pago.
- Estado del pago.

Cuando el pago se confirma, el ticket reservado puede pasar a estado pagado, confirmado o vendido, según las reglas del sistema.

No se requiere un submódulo separado de emisión de ticket, porque la confirmación del derecho del cliente queda integrada dentro de la orden de pago. El ticket de viaje se muestra como reporte/documento.

---

### 2.2.1.5 Check-in y embarque

Registra el control operativo previo a la ejecución del viaje.

Incluye:

- Validación del pasajero o carga.
- Validación de ticket confirmado.
- Validación de viaje programado.
- Registro de ingreso al vehículo.
- Observaciones de embarque.

Representa la transición entre la venta confirmada y la ejecución real del transporte.

---

### 2.2.1.6 Llegada y cierre

Registra la culminación operativa del viaje.

Incluye:

- Llegada al destino.
- Hora real de cierre.
- Estado final del servicio.
- Incidencias ocurridas.
- Observaciones finales.

Con esta transacción se completa el ciclo de atención del viaje desde el punto de vista operativo.

Posteriormente, esta información puede ser consolidada por Batch en liquidación de viajes, regularización de estados y estadísticas.

---

## Flujo operativo normal de Data-Entry

El flujo normal del proceso operativo es:

**Cotización → Reserva de tickets → Orden de pago → Check-in y embarque → Llegada y cierre**

Antes de este flujo ya debe haber intervenido el Batch, generando viajes y tickets disponibles.

El ajuste operativo de viaje queda fuera del flujo normal, porque atiende casos excepcionales sobre viajes ya programados.

---

## 2.2.2 Reportes

Reportes agrupa salidas operativas del sistema. No representan nuevas transacciones de negocio, sino documentos o vistas necesarias para controlar, validar o consultar la operación.

---

### 2.2.2.1 Ticket de viaje

Documento operativo que representa el servicio adquirido por el cliente y acredita su derecho a usar una salida específica.

Incluye:

- Número de ticket.
- Datos del cliente.
- Ruta.
- Origen y destino.
- Fecha y hora.
- Asiento o capacidad asignada.
- Condiciones básicas del servicio.

No fabrica el ticket. El ticket fue generado por Batch, reservado por Online y confirmado mediante orden de pago.

---

### 2.2.2.2 Comprobante de pago

Documento operativo que presenta el detalle de la transacción económica realizada por el cliente.

Incluye:

- Monto pagado.
- Fecha y hora.
- Medio de pago.
- Referencia de transacción.
- Concepto de cobro.
- Datos del cliente y servicio asociado.

---

### 2.2.2.3 Manifiesto de viaje

Reporte operativo que presenta la relación de pasajeros y/o carga vinculados a una salida específica.

Incluye:

- Datos del viaje.
- Fecha y hora de salida.
- Ruta.
- Vehículo.
- Operarios responsables.
- Detalle de pasajeros.
- Carga asociada.
- Totales de ocupación.
- Observaciones relevantes.

Su finalidad es apoyar el control operativo previo a la partida.

---

### 2.2.2.4 Cierre de viaje

Reporte operativo que resume el resultado final de un viaje culminado.

Incluye:

- Identificación del viaje.
- Hora real de salida.
- Hora real de llegada.
- Estado de culminación.
- Incidencias.
- Observaciones finales.

---

### 2.2.2.5 Seguimiento de viaje

Reporte operativo de visualización que permite consultar el avance de un viaje programado o en ejecución.

Puede mostrar:

- Ruta.
- Horario.
- Vehículo.
- Operarios.
- Estado actual.
- Pasajeros o carga asociados.
- Incidencias registradas.

No actualiza la base de datos; solo presenta información para el control operativo del servicio. Por eso se ubica en Reportes y no en Data-Entry.

---

# 3. Batch

El bloque Batch agrupa procesos automáticos e internos. No atiende directamente al usuario final y no debe presentarse como un flujo operativo normal.

Se divide en:

- **3.1 Aplicativo**
- **3.2 Técnico**

---

# 3.1 Batch Aplicativo

El Batch Aplicativo agrupa procesos internos orientados al negocio.

Estos procesos:

- No interactúan directamente con el usuario durante la atención online.
- Procesan información acumulada.
- Generan existencias del servicio.
- Regularizan estados.
- Consolidan resultados.
- Preparan históricos, estadísticas e indicadores.

Se divide en:

- **3.1.1 Actualización de la Base de Datos**
- **3.1.2 Generación de Estadísticas e Históricos**

---

## 3.1.1 Actualización de la Base de Datos

Agrupa procesos batch que modifican o consolidan información operativa.

A diferencia del Data-Entry online, que registra eventos unitarios en tiempo real, estos procesos trabajan sobre conjuntos de datos acumulados o sobre existencias generadas de forma masiva.

---

### 3.1.1.1 Fabricación de tickets

Proceso batch encargado de generar viajes programados y tickets disponibles para fechas futuras.

Toma como entrada:

- Servicios.
- Rutas.
- Horarios.
- Vehículos.
- Contenedores.
- Capacidad.
- Tarifas.
- Políticas.
- Reglas.
- Protocolos.

A partir de esos datos fabrica las existencias del servicio: tickets o cupos disponibles que luego serán utilizados por el módulo online.

En pasajeros, un ticket puede representar asiento o categoría de asiento. En carga, puede representar capacidad disponible en contenedor, bodega o unidad equivalente.

No vende ni asigna tickets a clientes. Solo crea el parque de tickets disponibles sobre el cual operan cotización, reserva y orden de pago.

---

### 3.1.1.2 Regularización de estados de tickets

Proceso batch que revisa de manera diferida los movimientos acumulados sobre tickets.

Considera:

- Reservas.
- Vencimientos.
- Pagos.
- Anulaciones.
- Confirmaciones.
- Uso durante check-in o embarque.

Su finalidad es corregir inconsistencias del parque de tickets, cuadrar estados individuales y recalcular saldos asociados a lotes de tickets.

Ejemplos:

- Tickets reservados que no fueron confirmados.
- Pagos registrados sin cambio de estado.
- Tickets usados sin marca final.
- Diferencias entre totales del lote y tickets individuales.

No libera disponibilidad inmediata de una reserva vencida. Esa validación corresponde al módulo online al momento de reservar o pagar. Su función es regularizar y consolidar estados acumulados.

---

### 3.1.1.3 Regularización de estados de viaje

Proceso batch que revisa de manera diferida eventos acumulados sobre viajes programados o ejecutados.

Considera:

- Ajustes operativos.
- Check-in.
- Embarque.
- Llegada.
- Cierre.
- Cancelaciones.
- Incidencias.

Su finalidad es corregir estados pendientes o inconsistentes del viaje y asegurar que la ejecución operativa coincida con los eventos registrados.

Ejemplos:

- Viajes que figuran como programados pese a tener eventos de embarque.
- Viajes con llegada registrada pero sin cierre.
- Viajes cancelados parcialmente.
- Incidencias pendientes de consolidación.

Se diferencia de la regularización de tickets porque trabaja sobre el estado global del viaje, mientras que tickets trabaja sobre existencias individuales.

---

### 3.1.1.4 Liquidación de viajes

Proceso batch que consolida la información acumulada de cada viaje ejecutado y actualiza su resultado final.

Integra:

- Tickets vendidos.
- Reservas confirmadas.
- Pagos.
- Pasajeros o carga embarcada.
- Incidencias.
- Hora real de salida.
- Hora real de llegada.
- Cierre operativo.

Su finalidad es dejar cerrado el viaje desde el punto de vista operativo y comercial.

Se ejecuta después de regularizar estados de tickets y viajes, para trabajar con información consistente. Deja información preparada para históricos, estadísticas e indicadores gerenciales.

---

## 3.1.2 Generación de Estadísticas e Históricos

Agrupa procesos batch orientados a consolidar información acumulada de la operación.

Su finalidad es generar datos históricos, estadísticas e indicadores previamente trabajados para apoyar la consulta gerencial y evitar cálculos pesados durante la interacción online.

A diferencia del Data-Entry, no registra una transacción individual, sino que procesa conjuntos de datos acumulados durante un periodo.

---

### 3.1.2.1 Generación de estadísticas de operarios

Consolida información histórica sobre asignaciones, cumplimiento, incidencias y participación de operarios.

Sirve como base para consultas gerenciales de desempeño de operarios.

---

### 3.1.2.2 Generación de estadísticas vehiculares

Consolida información histórica sobre uso, disponibilidad, frecuencia de viajes, ocupación e incidencias de vehículos.

Apoya decisiones sobre asignación, mantenimiento, rendimiento y mejora de la flota.

---

### 3.1.2.3 Generación de estadísticas de ingresos

Consolida información económica del sistema, agrupando ventas y pagos por periodo, ruta, horario, tipo de servicio o categoría comercial.

Alimenta la consulta gerencial de ingresos.

---

### 3.1.2.4 Generación de estadísticas de incidencias

Acumula y clasifica eventos irregulares durante la operación:

- Retrasos.
- Fallas de servicio.
- Cambios operativos.
- Incumplimientos de protocolo.
- Incidencias registradas durante el viaje.

Permite identificar patrones de falla y fortalecer el control operativo.

---

### 3.1.2.5 Generación de estadísticas de demanda por ruta

Consolida solicitudes, cotizaciones, reservas, ventas, ocupación y comportamiento de uso por origen, destino, horario y fecha.

Permite identificar tendencias de demanda, rutas críticas, horarios críticos y necesidades de ajuste en capacidad, frecuencia o cobertura.

---

### 3.1.2.6 Pre-cálculo y generación de KPIs

Integra estadísticas de operación, ingresos, incidencias y demanda para producir indicadores clave de rendimiento.

Permite que el módulo gerencial consulte métricas pre-calculadas sin ejecutar cálculos pesados en tiempo real.

---

# 3.2 Batch Técnico

El Batch Técnico agrupa procesos rutinarios cuyo propósito es mantener la base de datos en condiciones adecuadas de funcionamiento y garantizar recuperación ante fallos.

No atiende usuarios ni registra transacciones del negocio. Cumple función de soporte interno para conservar estabilidad, rendimiento y confiabilidad.

Se divide en:

- **3.2.1 Mantenimiento de Base de Datos**
- **3.2.2 Contingencia**

---

## 3.2.1 Mantenimiento de Base de Datos

Agrupa procesos técnicos periódicos sobre la estructura física o lógica de la base de datos.

### 3.2.1.1 Reorganización de la base de datos

Proceso técnico orientado a reorganizar internamente la base de datos cuando el uso continuo degrada su orden físico o lógico.

Finalidad:

- Mantener estabilidad.
- Prevenir degradación de performance.
- Mejorar eficiencia de almacenamiento y acceso.

---

### 3.2.1.2 Optimización del espacio de almacenamiento

Proceso técnico orientado a compactar, ordenar y reasignar espacio cuando existe fragmentación o uso ineficiente.

Finalidad:

- Optimizar recursos físicos.
- Reducir desperdicio de espacio.
- Sostener tiempos de respuesta adecuados.

---

## 3.2.2 Contingencia

Agrupa procesos que permiten recuperar información ante pérdida, daño o falla.

### 3.2.2.1 Back-up

Genera y conserva copias de seguridad de la base de datos en puntos definidos.

Debe registrar:

- Frecuencia del backup.
- Última copia.
- Estado.
- Destino.
- Responsable o proceso.
- Historial de copias.

---

### 3.2.2.2 Restore

Permite restaurar la información a partir de copias de seguridad previamente generadas.

Finalidad:

- Reconstruir la base de datos.
- Volver a un estado funcional válido.
- Restablecer la operación tras fallos o incidentes.

---

### 3.2.2.3 Verificación de integridad

Valida que la base de datos restaurada o mantenida conserve consistencia.

Permite detectar:

- Errores de integridad.
- Corrupción.
- Inconsistencias.
- Estructuras no utilizables.

---

# 4. Consultas críticas priorizadas

Estas consultas se consideran críticas porque combinan alto costo de acceso y alta demanda. Por ello se resuelven con tablas suplementarias o consolidadas, generadas por Batch o mantenidas como estructuras de consulta.

## 4.1 Disponibilidad y cotización del servicio

**Tipo:** Operativa  
**Tabla suplementaria:** `COMP_DISPONIBILIDAD_TARIFA`

Consulta usada en el frente de atención al cliente para conocer servicios disponibles y calcular el importe del servicio.

Integra:

- Servicio.
- Ruta.
- Horario.
- Viaje programado.
- Tickets disponibles.
- Tarifa.
- Tipo de cliente.
- Reglas.
- Políticas.
- Categoría de asiento o carga.

---

## 4.2 Demanda y ocupación por ruta

**Tipo:** Gerencial  
**Tabla suplementaria:** `COMP_DEMANDA_RUTA`

Consulta usada para analizar qué rutas, horarios y servicios tienen mayor o menor demanda.

Integra:

- Solicitudes.
- Cotizaciones.
- Reservas.
- Ventas.
- Tickets.
- Viajes.
- Rutas.
- Horarios.
- Fechas.

---

## 4.3 Ingresos por ruta y servicio

**Tipo:** Gerencial  
**Tabla suplementaria:** `COMP_INGRESOS`

Consulta usada para analizar el comportamiento económico del sistema por periodo, ruta, servicio u horario.

Integra:

- Pagos.
- Tickets.
- Viajes.
- Rutas.
- Servicios.
- Tarifas.
- Periodos.

Nota: usar `COMP_RENTABILIDAD` solo si también se modelan costos operativos.

---

## 4.4 Historial y comportamiento del cliente

**Tipo:** Comercial / Gerencial  
**Tabla suplementaria:** `COMP_CLIENTE`

Consulta usada para visualizar comportamiento comercial del cliente.

Integra:

- Cliente.
- Reservas.
- Tickets.
- Viajes.
- Pagos.
- Incidencias.
- Frecuencia de uso.

---

# 5. Correcciones obligatorias para el diagrama final

Antes de iniciar el nuevo diseño externo, corregir en el diagrama:

1. En **3.1.1 Actualización BD**, retirar **Liberación de reservas vencidas** como submódulo independiente.
2. En su lugar usar:
   - **3.1.1.2 Regularización de estados de tickets**
   - **3.1.1.3 Regularización de estados de viaje**
   - **3.1.1.4 Liquidación de viajes**
3. El orden recomendado en Actualización BD es:
   - 3.1.1.1 Fabricación de tickets
   - 3.1.1.2 Regularización de estados de tickets
   - 3.1.1.3 Regularización de estados de viaje
   - 3.1.1.4 Liquidación de viajes
4. En **3.2 Técnico**, corregir numeración:
   - 3.2.1 Mantenimiento de Base de Datos
   - 3.2.1.1 Reorganización de la base de datos
   - 3.2.1.2 Optimización del espacio de almacenamiento
   - 3.2.2 Contingencia
   - 3.2.2.1 Back-up
   - 3.2.2.2 Restore
   - 3.2.2.3 Verificación de integridad
5. En **2.2.1 Data-Entry**, corregir numeración:
   - 2.2.1.1 Ajuste operativo de viaje
   - 2.2.1.2 Cotización
   - 2.2.1.3 Reserva de tickets
   - 2.2.1.4 Orden de pago
   - 2.2.1.5 Check-in y embarque
   - 2.2.1.6 Llegada y cierre
6. Eliminar del diseño externo anterior:
   - Recursos de viaje como flujo normal.
   - Lotes de tickets como pantalla operativa online.
   - Emisión de ticket como transacción independiente.
7. Agregar o reforzar:
   - Ajuste operativo de viaje.
   - Seguimiento de viaje como Reporte.
   - Monitor Batch Aplicativo.
   - Backup y Mantenimiento de BD como Batch Técnico.
   - Historial/comportamiento del cliente si se usará como consulta crítica.

---

# 6. Guía para empezar el nuevo diseño externo

El nuevo diseño externo debe construirse en este orden:

1. Login y seguridad.
2. Selección de perfil.
3. Menú principal según arquitectura corregida.
4. Catálogos con tres estados visuales.
5. Proceso operativo central:
   - Cotización.
   - Reserva.
   - Orden de pago.
   - Check-in y embarque.
   - Llegada y cierre.
6. Ajuste operativo de viaje como pantalla excepcional.
7. Reportes operativos.
8. Consultas gerenciales con tabla, filtros, gráfica y KPI.
9. Panel Batch Aplicativo como monitor de procesos automáticos.
10. Panel Batch Técnico: backup, restore, verificación y mantenimiento.

---

# 7. Defensa corta ante Tino

> Profesor, el diseño externo fue rehacido para que cada pantalla corresponda a la arquitectura corregida. En el Online Operativo solo se muestran transacciones unitarias del usuario: cotización, reserva, pago, check-in, embarque, llegada y cierre. La fabricación de tickets y la generación de disponibilidad no aparecen como pantallas operativas porque pertenecen al Batch Aplicativo. Los reportes solo muestran documentos o vistas, y las consultas gerenciales se apoyan en información estadística o consolidada. Con esto evitamos mezclar procesos internos Batch con atención Online.

