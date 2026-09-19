import { cn } from "@/lib/utils";

/**
 * Sayt logotipi. Dashboard → "Sayt sozlamalari" → Logotip dan yuklanadi;
 * yuklanmagan bo'lsa "YT" harflari chiqadi (sayt logotipsiz ham to'liq ishlaydi).
 */
export function SiteLogo({ logo, className }: { logo: string | null; className?: string }) {
  const box = cn("h-10 w-10 shrink-0 rounded-xl", className);

  if (logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan rasm, o'lchami oldindan noma'lum
      <img
        src={logo}
        alt="Andijon Yoshlar Texnoparki"
        // object-contain — gorizontal logo yuklansa ham cho'zilmaydi
        className={cn(box, "object-contain")}
      />
    );
  }

  return (
    <div className={cn(box, "flex items-center justify-center bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30")}>
      YT
    </div>
  );
}
