import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { buttonVariants, Card, EmptyState } from "@/components/dashboard/ui";

export default function DashboardNotFound() {
  return (
    <Card className="mx-auto mt-10 max-w-lg">
      <EmptyState
        icon={FileQuestion}
        title="Sahifa topilmadi"
        description="Bu yozuv o'chirilgan yoki manzil noto'g'ri bo'lishi mumkin."
        action={<Link href="/dashboard" className={buttonVariants.primary}>Bosh sahifaga</Link>}
      />
    </Card>
  );
}
