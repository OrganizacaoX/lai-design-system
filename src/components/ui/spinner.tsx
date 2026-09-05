import { useLaiTranslation } from "@/hooks/use-lai-translation";
import { cn } from "cn"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { t } = useLaiTranslation();
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={t("loading", {}, "Loading")} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
