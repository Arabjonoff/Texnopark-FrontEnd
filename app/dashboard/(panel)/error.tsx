"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { buttonVariants, Card } from "@/components/dashboard/ui";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="mx-auto mt-10 max-w-lg p-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h1 className="text-lg font-semibold text-dash-text">Ma&apos;lumotni yuklab bo&apos;lmadi</h1>
      <p className="mt-2 text-sm text-dash-muted">
        Server bilan aloqada muammo bo&apos;ldi. Birozdan keyin qayta urinib ko&apos;ring. Muammo takrorlansa, administratorga murojaat qiling.
      </p>
      <button type="button" onClick={reset} className={`${buttonVariants.primary} mt-6`}>
        <RotateCcw className="h-4 w-4" /> Qayta urinish
      </button>
    </Card>
  );
}
