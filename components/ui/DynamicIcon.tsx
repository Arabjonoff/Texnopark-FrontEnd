import {
  Box,
  Briefcase,
  Cpu,
  Hammer,
  Layers,
  Monitor,
  Printer,
  Rocket,
  Smartphone,
  Terminal,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

// API'dan kelgan ikonka kaliti -> lucide ikonka.
// Kalitlar ro'yxati backend'dagi apps/core/models.py -> Icon bilan bir xil bo'lishi kerak.
export function DynamicIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "smartphone":
      return <Smartphone className={className} />;
    case "layers":
      return <Layers className={className} />;
    case "cpu":
      return <Cpu className={className} />;
    case "box":
      return <Box className={className} />;
    case "briefcase":
      return <Briefcase className={className} />;
    case "rocket":
      return <Rocket className={className} />;
    case "zap":
      return <Zap className={className} />;
    case "users":
      return <Users className={className} />;
    case "trophy":
      return <Trophy className={className} />;
    case "printer":
      return <Printer className={className} />;
    case "monitor":
      return <Monitor className={className} />;
    case "hammer":
      return <Hammer className={className} />;
    default:
      return <Terminal className={className} />;
  }
}
