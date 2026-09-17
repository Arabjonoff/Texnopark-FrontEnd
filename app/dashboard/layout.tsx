import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Boshqaruv paneli — Yoshlar Texnoparki",
    template: "%s — Boshqaruv paneli",
  },
  robots: { index: false, follow: false },
};

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-dash-bg text-dash-text">{children}</div>;
}
