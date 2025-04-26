import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px] w-full">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
