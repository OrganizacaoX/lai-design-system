import { useId, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
export interface FormFieldDefinition {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "tel" | "url";
  description?: string;
  autoComplete?: string;
  validate?: (value: string) => string | undefined;
}
export interface ValidatedFormProps {
  fields: FormFieldDefinition[];
  initialValues?: Record<string, string>;
  onSubmit: (values: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
  pendingLabel?: string;
  successMessage?: string;
  errorMessage?: string;
}
export function ValidatedForm({
  fields,
  initialValues = {},
  onSubmit,
  submitLabel = "Salvar",
  pendingLabel = "Salvando…",
  successMessage = "Alterações salvas.",
  errorMessage = "Não foi possível salvar. Tente novamente.",
}: ValidatedFormProps) {
  const id = useId();
  const form = useRef<HTMLFormElement>(null);
  const submitting = useRef(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  return (
    <form
      ref={form}
      noValidate
      aria-busy={status === "pending"}
      className="space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        if (submitting.current) return;
        const nextErrors: Record<string, string> = {};
        for (const field of fields) {
          const message = field.validate?.(values[field.name] ?? "");
          if (message) nextErrors[field.name] = message;
        }
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length) {
          setStatus("idle");
          const first = fields.find((field) => nextErrors[field.name]);
          const input = form.current?.elements.namedItem(first!.name);
          if (input instanceof HTMLElement) input.focus();
          return;
        }
        submitting.current = true;
        setStatus("pending");
        try {
          await onSubmit(
            Object.fromEntries(
              fields.map((field) => [field.name, values[field.name] ?? ""]),
            ),
          );
          setStatus("success");
        } catch {
          setStatus("error");
        } finally {
          submitting.current = false;
        }
      }}
    >
      {fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const describedBy =
          [
            field.description && `${fieldId}-help`,
            errors[field.name] && `${fieldId}-error`,
          ]
            .filter(Boolean)
            .join(" ") || undefined;
        return (
          <div key={field.name} className="space-y-2">
            <label htmlFor={fieldId} className="text-sm font-medium">
              {field.label}
            </label>
            <Input
              id={fieldId}
              name={field.name}
              type={field.type ?? "text"}
              autoComplete={field.autoComplete}
              value={values[field.name] ?? ""}
              disabled={status === "pending"}
              aria-invalid={!!errors[field.name]}
              aria-describedby={describedBy}
              onChange={(event) => {
                setValues({ ...values, [field.name]: event.target.value });
                setStatus("idle");
                setErrors((previous) => ({ ...previous, [field.name]: "" }));
              }}
            />
            {field.description && (
              <p
                id={`${fieldId}-help`}
                className="text-sm text-muted-foreground"
              >
                {field.description}
              </p>
            )}
            {errors[field.name] && (
              <p
                id={`${fieldId}-error`}
                role="alert"
                className="text-sm text-destructive"
              >
                {errors[field.name]}
              </p>
            )}
          </div>
        );
      })}
      <Button type="submit" disabled={status === "pending"}>
        {status === "pending" ? pendingLabel : submitLabel}
      </Button>
      <p role="status" className="text-sm text-success">
        {status === "success"
          ? successMessage
          : status === "pending"
            ? pendingLabel
            : ""}
      </p>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
