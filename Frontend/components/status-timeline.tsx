import { Badge, cn } from "./ui";

type TimelineStep = {
  label: string;
  time: string;
  tone: "neutral" | "primary" | "success" | "warning" | "danger";
};

export function StatusTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "mt-0.5 h-3 w-3 rounded-full",
                step.tone === "success"
                  ? "bg-emerald-400"
                  : step.tone === "warning"
                    ? "bg-amber-400"
                    : step.tone === "danger"
                      ? "bg-rose-400"
                      : step.tone === "primary"
                        ? "bg-orange-400"
                        : "bg-slate-500",
              )}
            />
            {index !== steps.length - 1 ? <span className="mt-2 h-10 w-px bg-white/10" /> : null}
          </div>
          <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium text-white">{step.label}</p>
              <Badge tone={step.tone}>{step.time}</Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
