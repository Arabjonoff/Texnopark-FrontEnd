import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/dashboard/LoginForm";

export const metadata: Metadata = { title: "Kirish" };

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/dashboard";
  const notice = params.expired ? "Sessiya muddati tugagan. Iltimos, qaytadan kiring." : undefined;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <Link href="/" className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 font-bold backdrop-blur">YT</span>
          <span className="font-semibold">Andijon Yoshlar Texnoparki</span>
        </Link>
        <div className="relative max-w-md">
          <h1 className="text-4xl font-black leading-tight">Sayt kontentini bir joydan boshqaring</h1>
          <p className="mt-4 text-white/80">
            Kurslar, tadbirlar, yangiliklar va kelgan arizalar — barchasi qulay boshqaruv panelida.
          </p>
        </div>
        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} Andijon Yoshlar Texnoparki</p>
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-dash-primary text-sm font-bold text-white lg:hidden">YT</span>
            <h2 className="text-2xl font-bold tracking-tight text-dash-text">Boshqaruv paneliga kirish</h2>
            <p className="mt-1 text-sm text-dash-muted">Administrator login va parolingizni kiriting</p>
          </div>
          <div className="rounded-2xl border border-dash-border bg-dash-surface p-6 shadow-sm">
            <LoginForm next={next} notice={notice} />
          </div>
          <p className="mt-6 text-center text-sm text-dash-muted">
            <Link href="/" className="hover:text-dash-text">← Saytga qaytish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
