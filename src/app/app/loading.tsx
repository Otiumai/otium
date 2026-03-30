import { Loader2 } from "lucide-react";

export default function AppLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-4" />
        <p className="text-body-sm text-surface-400">Loading your interests...</p>
      </div>
    </div>
  );
}
