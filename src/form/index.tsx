import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { useId, type ComponentProps } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();
export function formErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") return error.message;
  return "";
}
export interface FormTextFieldProps extends Omit<ComponentProps<typeof Input>, "value" | "defaultValue" | "onChange" | "onBlur" | "name"> {
  label: string;
  description?: string;
}
export function FormTextField({ label, description, id: providedId, ...props }: FormTextFieldProps) {
  const field = useFieldContext<string>();
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const errors = field.state.meta.isTouched ? field.state.meta.errors.map(formErrorMessage).filter(Boolean) : [];
  return <div className="grid gap-2">
    <label htmlFor={id}>{label}</label>
    <Input {...props} id={id} name={field.name} value={field.state.value} onBlur={field.handleBlur}
      onChange={event => field.handleChange(event.target.value)} aria-invalid={errors.length > 0}
      aria-describedby={[description && `${id}-description`, errors.length && `${id}-errors`, props["aria-describedby"]].filter(Boolean).join(" ") || undefined} />
    {description && <p id={`${id}-description`}>{description}</p>}
    {errors.length > 0 && <div id={`${id}-errors`} role="alert" className="text-sm text-destructive">{errors.join("; ")}</div>}
  </div>;
}
export function FormSubmitButton(props: ComponentProps<typeof Button>) {
  const form = useFormContext();
  return <form.Subscribe selector={state => [state.canSubmit, state.isSubmitting] as const}>
    {([canSubmit, busy]) => <Button {...props} type="submit" disabled={props.disabled || !canSubmit || busy} aria-busy={busy} />}
  </form.Subscribe>;
}
export const { useAppForm: useLaiForm, withForm: withLaiForm } = createFormHook({
  fieldContext, formContext, fieldComponents: { TextField: FormTextField }, formComponents: { SubmitButton: FormSubmitButton },
});
/** Return from onSubmitAsync; translate server codes before calling this helper. */
export function formApiErrors<TName extends string>(fields: Partial<Record<TName, string>>, form?: string) {
  return { fields, ...(form ? { form } : {}) };
}
