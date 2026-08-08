import { Panel, SkeletonBlock } from "@/components/ui";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50">
      <div className="mx-auto max-w-7xl space-y-4">
        <SkeletonBlock className="h-12 w-44" />
        <Panel className="space-y-4">
          <SkeletonBlock className="h-8 w-2/5" />
          <SkeletonBlock className="h-6 w-3/5" />
          <div className="grid gap-4 md:grid-cols-3">
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
            <SkeletonBlock className="h-28" />
          </div>
        </Panel>
      </div>
    </div>
  );
}
