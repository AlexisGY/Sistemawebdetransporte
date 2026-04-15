import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, QrCode, ShieldCheck } from "lucide-react";

import { AuthShell } from "./AuthShell";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/seleccionar-rol");
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-[960px] border-white/10 bg-[#17181c] shadow-[0_18px_60px_rgba(0,0,0,0.4)]">
        <CardHeader className="space-y-4 border-b border-white/10 px-8 pb-6 pt-7">
          <div className="flex items-start justify-between gap-4">
            <Badge
              variant="outline"
              className="rounded-full border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-400"
            >
              Control de acceso
            </Badge>

            <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
              Sistema de Transporte
            </span>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-semibold tracking-tight text-white">
              Acceso al sistema
            </CardTitle>
            <CardDescription className="max-w-xl text-sm leading-6 text-zinc-400">
              Ingrese sus credenciales para continuar según su perfil autorizado.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-8 py-6">
          <div className="grid items-start gap-5 lg:grid-cols-[1.42fr_0.82fr]">
            <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-5">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="login-identity" className="text-zinc-300">Usuario o correo</Label>
                  <Input
                    id="login-identity"
                    type="text"
                    placeholder="usuario@empresa.com"
                    className="h-11 rounded-xl border-white/15 bg-white/[0.05] px-4 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="login-password" className="text-zinc-300">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-white/15 bg-white/[0.05] px-4 pr-11 text-white placeholder:text-zinc-600 focus-visible:ring-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                      aria-label={
                        showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="remember-session"
                      className="border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-[#101114]"
                    />
                    <Label
                      htmlFor="remember-session"
                      className="text-sm font-medium text-zinc-400"
                    >
                      Recordar sesión
                    </Label>
                  </div>

                  <Link
                    to="/recuperar"
                    className="text-sm font-semibold text-zinc-300 transition-colors hover:text-white"
                  >
                    Recuperar acceso
                  </Link>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="h-11 w-full rounded-xl bg-white text-[#101114] font-semibold hover:bg-zinc-200 transition-colors"
                >
                  Ingresar
                </Button>
              </form>
            </div>

            <div className="flex h-full flex-col rounded-[22px] border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <QrCode className="size-5 text-zinc-300" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-white">
                    Acceso alternativo con QR
                  </h3>
                  <p className="text-xs leading-5 text-zinc-500">
                    Disponible en terminales autorizadas.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-1 items-center justify-center py-2">
                <div className="flex h-36 w-36 items-center justify-center rounded-[20px] border border-dashed border-white/15 bg-white/[0.04]">
                  <QrCode className="size-12 text-zinc-600" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t border-white/10 px-8 py-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4" />
            Acceso controlado según rol y permisos.
          </div>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}