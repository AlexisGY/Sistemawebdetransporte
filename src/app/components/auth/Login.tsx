import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  QrCode,
  Scan,
  ShieldCheck,
} from "lucide-react";

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
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

type LoginMethod = "password" | "qr" | "biometric";

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("password");
  const navigate = useNavigate();

  const handleLogin = (event?: React.FormEvent) => {
    event?.preventDefault();
    navigate("/seleccionar-rol");
  };

  return (
    <AuthShell>
      <Card className="w-full max-w-[460px] border-border/70 bg-card/95 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-sm">
        <CardHeader className="space-y-4 border-b border-border/60">
          <div>
            <Badge
              variant="outline"
              className="rounded-full border-border/80 bg-muted/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]"
            >
              Acceso seguro
            </Badge>
            <CardTitle className="mt-4 text-3xl font-semibold">Iniciar sesion</CardTitle>
            <CardDescription className="mt-2 text-sm leading-6">
              Pantalla de acceso orientada a prototipado visual, con una estetica mas seria y
              consistente con el resto del sistema.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <Tabs
            value={loginMethod}
            onValueChange={(value) => setLoginMethod(value as LoginMethod)}
            className="gap-5"
          >
            <TabsList className="grid h-auto w-full grid-cols-3 rounded-2xl bg-muted/80 p-1">
              <TabsTrigger
                value="password"
                className="h-11 rounded-xl text-[11px] font-semibold uppercase tracking-[0.18em]"
              >
                <KeyRound className="size-4" />
                Clave
              </TabsTrigger>
              <TabsTrigger
                value="qr"
                className="h-11 rounded-xl text-[11px] font-semibold uppercase tracking-[0.18em]"
              >
                <QrCode className="size-4" />
                QR
              </TabsTrigger>
              <TabsTrigger
                value="biometric"
                className="h-11 rounded-xl text-[11px] font-semibold uppercase tracking-[0.18em]"
              >
                <Fingerprint className="size-4" />
                Biometrico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="password" className="space-y-5">
              <Alert className="border-border/70 bg-muted/30">
                <ShieldCheck className="size-4" />
                <AlertTitle>Credenciales de prototipo</AlertTitle>
                <AlertDescription>
                  Usa <strong>admin@transportesaas.com</strong> y <strong>admin123</strong> para
                  navegar el mockup.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="login-identity">Usuario o correo</Label>
                  <Input
                    id="login-identity"
                    type="text"
                    defaultValue="admin@transportesaas.com"
                    placeholder="usuario@empresa.com"
                    className="h-11 rounded-xl border-border/80 bg-background px-4"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="login-password">Contrasena</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      defaultValue="admin123"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-border/80 bg-background px-4 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox id="remember-session" />
                    <Label
                      htmlFor="remember-session"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Recordar sesion
                    </Label>
                  </div>
                  <Link
                    to="/recuperar"
                    className="text-sm font-semibold text-foreground transition-colors hover:text-primary/80"
                  >
                    Recuperar acceso
                  </Link>
                </div>

                <Button type="submit" size="lg" className="h-11 w-full rounded-xl">
                  Ingresar al sistema
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="qr" className="space-y-5">
              <div className="rounded-[24px] border border-dashed border-border/80 bg-muted/25 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex size-48 items-center justify-center rounded-[28px] border border-border/80 bg-background shadow-inner">
                    <QrCode className="size-28 text-muted-foreground/70" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">Acceso por QR</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Variante visual para mostrar un flujo de autenticacion sin recargar la
                    interfaz con colores innecesarios.
                  </p>
                  <div className="mt-6 flex w-full gap-3">
                    <Button className="flex-1 rounded-xl" onClick={() => handleLogin()}>
                      <Scan className="size-4" />
                      Simular escaneo
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl">
                      Regenerar
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="biometric" className="space-y-5">
              <div className="rounded-[24px] border border-border/70 bg-muted/25 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="flex size-28 items-center justify-center rounded-full border border-border/80 bg-background shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <Fingerprint className="size-14 text-foreground" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">Acceso biometrico</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                    Otra variante de prototipo para demostrar metodos de entrada con el mismo
                    lenguaje visual.
                  </p>
                  <Button
                    size="lg"
                    className="mt-6 h-11 w-full rounded-xl"
                    onClick={() => handleLogin()}
                  >
                    Iniciar validacion
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex-col items-start gap-3 border-t border-border/60 text-sm text-muted-foreground">
          <span>Prototipo visual basado en componentes de shadcn/ui.</span>
          <Link className="font-semibold text-foreground hover:text-primary/80" to="/recuperar">
            Necesitas otra vista de acceso
          </Link>
        </CardFooter>
      </Card>
    </AuthShell>
  );
}
