import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sessionKey = "lai-site-access";
const expectedPassword = import.meta.env.VITE_SITE_PASSWORD;

export function AuthGate({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => {
    if (!expectedPassword) return false;
    try {
      return sessionStorage.getItem(sessionKey) === "granted";
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (authenticated) return children;

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <p className="text-sm text-muted-foreground">LAI Design System</p>
          <h1 className="text-xl font-semibold">Acesso restrito</h1>
          <CardDescription>
            Digite a senha para acessar os componentes e a documentação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!expectedPassword || password !== expectedPassword) {
                setError("Senha incorreta. Tente novamente.");
                return;
              }
              try {
                sessionStorage.setItem(sessionKey, "granted");
              } catch {
                // O acesso continua nesta página quando o storage está bloqueado.
              }
              setPassword("");
              setAuthenticated(true);
            }}
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="site-password">Senha</Label>
              <Input
                id="site-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                disabled={!expectedPassword}
                aria-invalid={!!error}
                aria-describedby={error ? "auth-error" : undefined}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setError("");
                }}
              />
            </div>
            {error && (
              <p
                id="auth-error"
                role="alert"
                className="text-sm text-destructive"
              >
                {error}
              </p>
            )}
            {!expectedPassword && (
              <p role="alert" className="text-sm text-muted-foreground">
                Acesso indisponível. Entre em contato com o responsável pelo
                site.
              </p>
            )}
            <Button type="submit" disabled={!expectedPassword}>
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
