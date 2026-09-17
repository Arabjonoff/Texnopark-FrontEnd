import type { Partner } from "@/lib/types";

export function Partners({ partners }: { partners: Partner[] }) {
  if (partners.length === 0) return null;

  // Uzluksiz aylanish uchun ro'yxat ikki marta takrorlanadi
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="py-20 max-w-full overflow-hidden bg-foreground/[0.02] border-y border-foreground/[0.05]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full mb-10 text-center">
        <p className="text-foreground/60 font-semibold uppercase tracking-widest text-sm">
          Bizning Hamkorlarimiz
        </p>
      </div>

      <div className="relative flex overflow-hidden group">
        {/* Left and Right Fade overlays for seamless loop */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex animate-scroll group-hover:pause gap-16 md:gap-24 w-max px-8">
          {duplicatedPartners.map((partner, index) => {
            const isCopy = index >= partners.length;
            const content = partner.logo ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin yuklagan logotip
              <img src={partner.logo} alt={partner.name} className="max-h-12 max-w-[160px] object-contain" />
            ) : (
              partner.name
            );
            const cardClass = "h-20 w-full rounded-2xl bg-foreground/5 flex items-center justify-center text-center px-3 border border-foreground/10 text-foreground/50 font-bold text-xl grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:text-blue-600 transition-all duration-300";
            return (
              <div
                key={index}
                className="flex items-center justify-center shrink-0 w-[200px]"
                aria-hidden={isCopy || undefined}
              >
                {partner.url ? (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className={cardClass} tabIndex={isCopy ? -1 : undefined}>
                    {content}
                  </a>
                ) : (
                  <div className={cardClass}>{content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
