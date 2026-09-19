import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Sahifa chizilishidan OLDIN rejimni qo'yadi — aks holda tungi rejimda oq ekran miltillaydi.
// localStorage bo'sh bo'lsa atribut qo'yilmaydi va CSS'dagi `prefers-color-scheme` ishlaydi.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export const metadata: Metadata = {
  title: "Andijon Yoshlar Texnoparki | Innovatsiya, Ta'lim, Startup",
  description: "Andijon Yoshlar Texnoparki - Yoshlarning innovatsion va texnologik loyihalarini qo'llab-quvvatlash, dasturlash va muhandislik ko'nikmalarini rivojlantirish markazi.",
};

// Umumiy qobiq: sayt (app/(site)) va dashboard (app/dashboard) o'z layout'lariga ega
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" className={`${plusJakarta.variable} antialiased scroll-smooth`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
