# Sistema web de transporte — Diseño Externo

Prototipo del Diseño Externo del Sistema de Transporte, alineado a la arquitectura
final (separación **Seguridad / On-Line / Batch**). Las pantallas corresponden al
inventario aprobado en `docs/`.

## Fuentes de verdad

- `docs/arquitectura_final_sistema_transporte.md`
- `docs/inventario_pantallas_diseno_externo.md`
- `docs/lineamientos_diseno_externo.md`

## Ejecutar

```bash
npm i        # instalar dependencias
npm run dev  # servidor de desarrollo
npm run build  # build de producción (dist/)
```

## Acceso y roles (modo demo)

El rol está **fijo por usuario**. El selector de perfil del encabezado es solo una
ayuda de navegación del prototipo (**modo demo**) para recorrer todos los módulos:
Administrador (todo), Gerencial, Operativo y Técnico. El menú lateral se filtra
según el rol activo.

## Estructura de pantallas

- **Seguridad:** Login (SEG-01), Métodos alternativos de acceso PIN/QR/OTP (SEG-02),
  Gestión de perfiles y permisos (SEG-03).
- **Gerencial:** Dashboard (GER-01); Mantenimiento de parámetros (14 catálogos,
  CAT-01…14, con estados vacío/lista/edición y acciones listar, buscar, ver detalle,
  agregar, modificar, eliminar); Consultas (GER-02…07: desempeño de operarios,
  desempeño vehicular, ingresos, incidencias, demanda y ocupación, indicadores KPI),
  cada una con filtros, KPIs, gráfica, tabla y exportación.
- **Operativo (Data-Entry):** Dashboard (OPE-01), Ajuste operativo de viaje (OPE-02,
  fuera del flujo normal) y el flujo Cotización → Reserva → Orden de pago →
  Check-in y embarque → Llegada y cierre (OPE-03…07).
- **Reportes operativos (solo ver/imprimir/descargar):** Ticket de viaje, Comprobante
  de pago, Manifiesto de viaje, Cierre de viaje, Seguimiento de viaje (REP-01…05).
- **Técnico / Administrativo (restringido, fuera del flujo operativo):** Monitor
  Batch Aplicativo (solo lectura), Backup, Restore, Verificación de integridad.

## Decisiones de diseño relevantes

- **No** se muestran como transacciones operativas: fabricación de tickets, lotes de
  tickets, liberación de reservas vencidas ni emisión de ticket. La confirmación
  comercial ocurre en **Orden de pago**; el ticket es un **reporte**.
- **Batch** no es un flujo del usuario: solo se refleja como monitor técnico de
  solo lectura.
- La consulta de **Ingresos** no muestra utilidad/margen/rentabilidad (no se modelan
  costos operativos).

## Despliegue (GitHub Pages)

El build de producción usa `/Sistemawebdetransporte/` como base path y se publica con
GitHub Actions (`.github/workflows/deploy-pages.yml`), sirviendo la carpeta `dist/`.

- **Settings → Pages → Source:** `GitHub Actions`
