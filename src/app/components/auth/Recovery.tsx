import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, CheckCircle2, Mail, Phone, RefreshCcw, ShieldCheck } from "lucide-react";

import { AuthShell } from "./AuthShell";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "../ui/utils";

type RecoveryStep = "method" | "code" | "success";
type RecoveryMethod = "email" | "phone";

export function Recovery() {
  const [step, setStep] = useState<RecoveryStep>("method");
  const [method, setMethod] = useState<RecoveryMethod>("email");
  const [otp, setOtp] = useState("123456");

  const handleSendCode = (event: React.FormEvent) => {
    event.preventDefault();
    setStep("code");
  };

  const handleVerifyCode = (event: React.FormEvent) => {
    event.preventDefault();
    setStep("success");
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-[460px] border-border/70 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-sm">
        <CardHeader className="space-y-4 border-b border-border/60">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-border/80 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
              >
                Recuperacion
              </Badge>
              <CardTitle className="mt-4 text-3xl font-semibold">Recuperar acceso</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6">
                Flujo simplificado solo para demo visual, sin logica real de validacion.
              </CardDescription>
            </div>
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
              Paso {step === "method" ? "1" : step === "code" ? "2" : "3"} de 3
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {step === "method" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <Alert className="border-border/70 bg-muted/30">
                <ShieldCheck className="size-4" />
                <AlertTitle>Canal de recuperacion</AlertTitle>
                <AlertDescription>
                  Selecciona el medio que se usara en la maqueta para mostrar el envio del
                  codigo.
                </AlertDescription>
              </Alert>

              <RadioGroup
                value={method}
                onValueChange={(value) => setMethod(value as RecoveryMethod)}
                className="gap-3"
              >
                {[
                  {
                    value: "email",
                    title: "Correo corporativo",
                    description: "Enviar codigo a admin@*****.com",
                    icon: Mail,
                  },
                  {
                    value: "phone",
                    title: "SMS corporativo",
                    description: "Enviar codigo a +51 *** *** 789",
                    icon: Phone,
                  },
                ].map(({ value, title, description, icon: Icon }) => (
                  <Label
                    key={value}
                    htmlFor={`recover-${value}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-4 rounded-[24px] border p-4 transition-all",
                      method === value
                        ? "border-foreground/20 bg-muted/35 shadow-[0_12px_32px_rgba(15,23,42,0.08)]"
                        : "border-border/70 bg-background hover:bg-muted/15",
                    )}
                  >
                    <RadioGroupItem id={`recover-${value}`} value={value} className="mt-1" />
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/35">
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <Button type="submit" size="lg" className="h-11 w-full rounded-xl">
                Enviar codigo
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-5">
                <h3 className="text-lg font-semibold">Verificar codigo</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Introduce el codigo de seis digitos enviado a tu {method === "email" ? "correo" : "telefono"}.
                </p>

                <div className="mt-5 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    containerClassName="justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="h-12 w-12 text-base font-semibold" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-base font-semibold" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-base font-semibold" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-base font-semibold" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-base font-semibold" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-base font-semibold" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" size="lg" className="h-11 flex-1 rounded-xl">
                  Validar codigo
                </Button>
                <Button type="button" variant="outline" className="h-11 rounded-xl px-4">
                  <RefreshCcw className="size-4" />
                  Reenviar
                </Button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-5">
              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-border/70 bg-background shadow-inner">
                  <CheckCircle2 className="size-10 text-foreground" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold">Codigo validado</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Define una nueva contrasena para cerrar la historia del flujo.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva contrasena</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border/80 bg-background px-4"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar contrasena</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-border/80 bg-background px-4"
                  />
                </div>
                <Button asChild size="lg" className="h-11 rounded-xl">
                  <Link to="/login">Volver al acceso</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-start border-t border-border/60">
          <Button asChild variant="ghost" className="rounded-xl px-0 hover:bg-transparent">
            <Link to="/login">
              <ArrowLeft className="size-4" />
              Volver al inicio de sesion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
