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
      <Card className="w-full max-w-[460px] border-white/10 bg-[#17181c] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
        <CardHeader className="space-y-4 border-b border-white/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge
                variant="outline"
                className="rounded-full border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-400"
              >
                Recuperacion
              </Badge>
              <CardTitle className="mt-4 text-3xl font-semibold text-white">Recuperar acceso</CardTitle>
              <CardDescription className="mt-2 text-sm leading-6 text-zinc-400">
                Flujo simplificado solo para demo visual, sin logica real de validacion.
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-zinc-400"
            >
              Paso {step === "method" ? "1" : step === "code" ? "2" : "3"} de 3
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {step === "method" && (
            <form onSubmit={handleSendCode} className="space-y-5">
              <Alert className="border-white/10 bg-white/[0.04] text-zinc-300">
                <ShieldCheck className="size-4 text-zinc-400" />
                <AlertTitle className="text-zinc-300">Canal de recuperacion</AlertTitle>
                <AlertDescription className="text-zinc-500">
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
                        ? "border-white/20 bg-white/[0.08] shadow-[0_12px_32px_rgba(0,0,0,0.3)]"
                        : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]",
                    )}
                  >
                    <RadioGroupItem
                      id={`recover-${value}`}
                      value={value}
                      className="mt-1 border-white/30 text-white"
                    />
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                      <Icon className="size-5 text-zinc-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-white">{title}</p>
                      <p className="mt-1 text-sm text-zinc-500">{description}</p>
                    </div>
                  </Label>
                ))}
              </RadioGroup>

              <Button
                type="submit"
                size="lg"
                className="h-11 w-full rounded-xl bg-white text-[#101114] font-semibold hover:bg-zinc-200 transition-colors"
              >
                Enviar codigo
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-lg font-semibold text-white">Verificar codigo</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
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
                      <InputOTPSlot index={0} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                      <InputOTPSlot index={1} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                      <InputOTPSlot index={2} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                      <InputOTPSlot index={3} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                      <InputOTPSlot index={4} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                      <InputOTPSlot index={5} className="h-12 w-12 text-base font-semibold border-white/15 bg-white/[0.06] text-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  size="lg"
                  className="h-11 flex-1 rounded-xl bg-white text-[#101114] font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Validar codigo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-white/15 bg-white/[0.05] px-4 text-zinc-300 hover:bg-white/[0.1] hover:text-white"
                >
                  <RefreshCcw className="size-4" />
                  Reenviar
                </Button>
              </div>
            </form>
          )}

          {step === "success" && (
            <div className="space-y-5">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-inner">
                  <CheckCircle2 className="size-10 text-zinc-300" />
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-white">Codigo validado</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Define una nueva contrasena para cerrar la historia del flujo.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="new-password" className="text-zinc-300">Nueva contrasena</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/15 bg-white/[0.05] px-4 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-zinc-300">Confirmar contrasena</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-xl border-white/15 bg-white/[0.05] px-4 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                </div>
                <Button
                  asChild
                  size="lg"
                  className="h-11 rounded-xl bg-white text-[#101114] font-semibold hover:bg-zinc-200 transition-colors"
                >
                  <Link to="/login">Volver al acceso</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-start border-t border-white/10">
          <Button
            asChild
            variant="ghost"
            className="rounded-xl px-0 text-zinc-400 hover:bg-transparent hover:text-zinc-200"
          >
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