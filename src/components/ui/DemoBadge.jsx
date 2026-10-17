import { FlaskConical } from "lucide-react";
import { cn } from "../../utils/cn";

export default function DemoBadge({ className, label = "Demo data" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-amber-700",
        className
      )}
    >
      <FlaskConical className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}
