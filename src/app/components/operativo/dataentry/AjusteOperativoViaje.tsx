import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardEdit, RotateCcw } from "lucide-react";

import { PageHeader } from "../../shared/PageHeader";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { getCatalog, getViajes, type Viaje } from "../../../store/localDb";

// OPE-02 — Ajuste operativo de viaje (fuera del flujo normal).
// Registra cambios EXCEPCIONALES sobre un viaje ya programado por Batch.
// No crea viajes ni fabrica tickets.

const TIPOS_AJUSTE = [
  "Cambio de vehículo",
  "Cambio de operario",
  "Ajuste de horario",
  "Observación de capacidad",
  "Incidencia previa a la salida",
] as const;

type TipoAjuste = (typeof TIPOS_AJUSTE)[number];

type AjusteRegistrado = {
  id: string;
  viajeCodigo: string;
  tipo: TipoAjuste;
  detalle: string;
  motivo: string;
  registradoAt: string;
};

const selectClass =
  "w-full h-11 rounded-xl border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

export function AjusteOperativoViaje() {
  const viajes = useMemo(() => getViajes(), []);
  const vehiculos = useMemo(() => getCatalog<any>("vehiculos", []), []);
  const operarios = useMemo(() => getCatalog<any>("operarios", []), []);

  const [viajeId, setViajeId] = useState<string>(viajes[0]?.id ?? "");
  const [tipo, setTipo] = useState<TipoAjuste>(TIPOS_AJUSTE[0]);
  const [valorNuevo, setValorNuevo] = useState<string>("");
  const [motivo, setMotivo] = useState<string>("");
  const [confirmando, setConfirmando] = useState(false);
  const [registros, setRegistros] = useState<AjusteRegistrado[]>([]);
  const [resultado, setResultado] = useState<AjusteRegistrado | null>(null);

  const viaje: Viaje | undefined = viajes.find((v) => v.id === viajeId);

  // Detalle del nuevo valor según el tipo de ajuste.
  const detalleAjuste = (() => {
    switch (tipo) {
      case "Cambio de vehículo": {
        const v = vehiculos.find((x) => x.idTipoVehiculo === valorNuevo);
        return v ? `${v.idTipoVehiculo} — ${v.marca} ${v.modelo}` : valorNuevo;
      }
      case "Cambio de operario": {
        const o = operarios.find((x) => x.idTipoOperario === valorNuevo);
        return o ? `${o.idTipoOperario} — ${o.rolFuncion}` : valorNuevo;
      }
      default:
        return valorNuevo;
    }
  })();

  const motivoValido = motivo.trim().length >= 8;
  const valorValido = valorNuevo.trim().length > 0;
  const puedeConfirmar = Boolean(viaje) && valorValido && motivoValido;

  const reset = () => {
    setTipo(TIPOS_AJUSTE[0]);
    setValorNuevo("");
    setMotivo("");
    setConfirmando(false);
    setResultado(null);
  };

  const confirmar = () => {
    if (!viaje || !puedeConfirmar) return;
    const registro: AjusteRegistrado = {
      id: `AJU-${Date.now()}`,
      viajeCodigo: viaje.codigo,
      tipo,
      detalle: detalleAjuste,
      motivo: motivo.trim(),
      registradoAt: new Date().toLocaleString("es-PE"),
    };
    setRegistros((prev) => [registro, ...prev]);
    setResultado(registro);
    setConfirmando(false);
    setValorNuevo("");
    setMotivo("");
  };

  return (
    <div className="min-h-full bg-background">
      <PageHeader
        title="Ajuste operativo de viaje"
        subtitle="Registra cambios excepcionales sobre un viaje ya programado. No crea viajes ni fabrica tickets."
        actions={
          <Badge variant="outline" className="rounded-full border-border/80 bg-muted/40 px-3 py-1 text-xs">
            Fuera del flujo normal
          </Badge>
        }
      />

      <div className="grid gap-6 p-6 lg:grid-cols-[1.4fr_1fr] lg:p-8">
        {/* Formulario */}
        <Card className="border-border/70 bg-card/90">
          <CardHeader className="border-b border-border/60">
            <CardTitle className="text-lg font-semibold">Registro de ajuste</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-6">
            {/* Selección inicial */}
            <div className="grid gap-2">
              <Label>Viaje programado</Label>
              {viajes.length === 0 ? (
                <p className="text-sm text-muted-foreground">No hay viajes programados disponibles.</p>
              ) : (
                <select
                  className={selectClass}
                  value={viajeId}
                  onChange={(e) => {
                    setViajeId(e.target.value);
                    setResultado(null);
                  }}
                >
                  {viajes.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.codigo} — {v.ruta} · {v.fechaISO} {v.horaSalida} ({v.estado})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Tipo de ajuste</Label>
              <select
                className={selectClass}
                value={tipo}
                onChange={(e) => {
                  setTipo(e.target.value as TipoAjuste);
                  setValorNuevo("");
                }}
              >
                {TIPOS_AJUSTE.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Valor nuevo según tipo */}
            <div className="grid gap-2">
              <Label>
                {tipo === "Cambio de vehículo"
                  ? "Nuevo vehículo"
                  : tipo === "Cambio de operario"
                  ? "Nuevo operario"
                  : tipo === "Ajuste de horario"
                  ? "Nueva hora de salida"
                  : tipo === "Observación de capacidad"
                  ? "Observación de capacidad"
                  : "Descripción de la incidencia"}
              </Label>
              {tipo === "Cambio de vehículo" ? (
                <select className={selectClass} value={valorNuevo} onChange={(e) => setValorNuevo(e.target.value)}>
                  <option value="">Seleccione…</option>
                  {vehiculos.map((v) => (
                    <option key={v.idTipoVehiculo} value={v.idTipoVehiculo}>
                      {v.idTipoVehiculo} — {v.marca} {v.modelo} (Cap: {v.capacidadPasajeros})
                    </option>
                  ))}
                </select>
              ) : tipo === "Cambio de operario" ? (
                <select className={selectClass} value={valorNuevo} onChange={(e) => setValorNuevo(e.target.value)}>
                  <option value="">Seleccione…</option>
                  {operarios.map((o) => (
                    <option key={o.idTipoOperario} value={o.idTipoOperario}>
                      {o.idTipoOperario} — {o.rolFuncion} ({o.licenciaRequerida})
                    </option>
                  ))}
                </select>
              ) : tipo === "Ajuste de horario" ? (
                <Input
                  type="time"
                  value={valorNuevo}
                  onChange={(e) => setValorNuevo(e.target.value)}
                  className="h-11 rounded-xl"
                />
              ) : (
                <Input
                  value={valorNuevo}
                  onChange={(e) => setValorNuevo(e.target.value)}
                  placeholder={
                    tipo === "Observación de capacidad"
                      ? "Ej: 4 asientos bloqueados por mantenimiento"
                      : "Ej: Retraso por revisión técnica en terminal"
                  }
                  className="h-11 rounded-xl"
                />
              )}
            </div>

            <div className="grid gap-2">
              <Label>Motivo del ajuste</Label>
              <Textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Explique brevemente por qué se realiza este ajuste excepcional (mín. 8 caracteres)."
                className="min-h-20 rounded-xl"
              />
              {!motivoValido && motivo.length > 0 && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="size-3.5" />
                  El motivo debe tener al menos 8 caracteres.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
              <Button variant="ghost" className="rounded-xl" onClick={reset}>
                <RotateCcw className="size-4" />
                Limpiar
              </Button>
              <Button
                className="rounded-xl"
                disabled={!puedeConfirmar}
                onClick={() => setConfirmando(true)}
              >
                <ClipboardEdit className="size-4" />
                Revisar y confirmar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Resumen / resultado / historial */}
        <div className="space-y-6">
          {resultado ? (
            <Card className="border-border/70 bg-card/90">
              <CardContent className="space-y-3 p-6 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border/70 bg-background">
                  <CheckCircle2 className="size-7 text-foreground" />
                </div>
                <h3 className="text-lg font-semibold">Ajuste registrado</h3>
                <p className="text-sm text-muted-foreground">
                  {resultado.tipo} sobre el viaje <strong>{resultado.viajeCodigo}</strong>.
                </p>
                <Badge variant="secondary" className="rounded-full">Estado: Ajuste aplicado</Badge>
              </CardContent>
            </Card>
          ) : confirmando && viaje ? (
            <Card className="border-border/70 bg-card/90">
              <CardHeader className="border-b border-border/60">
                <CardTitle className="text-base font-semibold">Resumen antes de confirmar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-6 text-sm">
                <SummaryRow label="Viaje" value={`${viaje.codigo} — ${viaje.ruta}`} />
                <SummaryRow label="Programación" value={`${viaje.fechaISO} ${viaje.horaSalida}`} />
                <SummaryRow label="Tipo de ajuste" value={tipo} />
                <SummaryRow label="Detalle" value={detalleAjuste || "—"} />
                <SummaryRow label="Motivo" value={motivo} />
                <div className="flex items-center justify-end gap-2 border-t border-border/60 pt-4">
                  <Button variant="ghost" className="rounded-xl" onClick={() => setConfirmando(false)}>
                    Volver
                  </Button>
                  <Button className="rounded-xl" onClick={confirmar}>
                    Confirmar ajuste
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border/70 bg-muted/20">
              <CardContent className="p-6 text-sm text-muted-foreground">
                Complete el formulario y pulse <strong>Revisar y confirmar</strong> para ver el resumen del ajuste
                antes de registrarlo.
              </CardContent>
            </Card>
          )}

          <Card className="border-border/70 bg-card/90">
            <CardHeader className="border-b border-border/60">
              <CardTitle className="text-base font-semibold">Ajustes registrados</CardTitle>
            </CardHeader>
            <CardContent className="p-3">
              {registros.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground">Aún no se han registrado ajustes en esta sesión.</p>
              ) : (
                <div className="divide-y divide-border/60">
                  {registros.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-3 p-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {r.viajeCodigo} · {r.tipo}
                        </p>
                        <p className="text-xs text-muted-foreground">{r.detalle}</p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{r.registradoAt}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}
