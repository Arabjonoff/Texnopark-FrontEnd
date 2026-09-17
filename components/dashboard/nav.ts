import {
  BarChart3,
  BookOpen,
  CalendarDays,
  FlaskConical,
  Handshake,
  Inbox,
  LayoutDashboard,
  Newspaper,
  UsersRound,
  PlayCircle,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { href: string; label: string; icon: LucideIcon; badgeKey?: "newApplications" };
export type NavGroup = { label: string; items: NavItem[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Asosiy",
    items: [
      { href: "/dashboard", label: "Umumiy ko'rinish", icon: LayoutDashboard },
      { href: "/dashboard/applications", label: "Arizalar", icon: Inbox, badgeKey: "newApplications" },
    ],
  },
  {
    label: "Kontent",
    items: [
      { href: "/dashboard/courses", label: "Kurslar", icon: BookOpen },
      { href: "/dashboard/events", label: "Tadbirlar", icon: CalendarDays },
      { href: "/dashboard/news", label: "Yangiliklar", icon: Newspaper },
    ],
  },
  {
    label: "Sayt bo'limlari",
    items: [
      { href: "/dashboard/statistics", label: "Statistika", icon: BarChart3 },
      { href: "/dashboard/features", label: "Afzalliklar", icon: Sparkles },
      { href: "/dashboard/equipment", label: "Laboratoriya", icon: FlaskConical },
      { href: "/dashboard/team", label: "Jamoa", icon: UsersRound },
      { href: "/dashboard/partners", label: "Hamkorlar", icon: Handshake },
      { href: "/dashboard/video-stories", label: "O'quvchilar natijalari", icon: PlayCircle },
    ],
  },
  {
    label: "Tizim",
    items: [{ href: "/dashboard/settings", label: "Sayt sozlamalari", icon: Settings }],
  },
];

/** Joriy sahifaga mos menyu bandi (eng uzun mos keluvchi yo'l) */
export function findActiveItem(pathname: string) {
  return NAV_GROUPS.flatMap((group) => group.items)
    .filter((item) => pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
}
