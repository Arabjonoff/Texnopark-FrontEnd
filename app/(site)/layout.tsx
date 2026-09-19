import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/api";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <div className="min-h-screen flex flex-col bg-dot-pattern relative">
      <Navbar logo={settings?.logo ?? null} />
      <main className="flex-1 pt-24">{children}</main>
      <Footer />
    </div>
  );
}
