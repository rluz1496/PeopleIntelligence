import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  PerformanceIcon,
  ClimateIcon,
  Feedback360Icon,
  ReportIcon,
  SettingsIcon
} from "@/components/ui/icons";

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}

function SidebarItem({ href, icon, children, active }: SidebarItemProps) {
  return (
    <li className="mb-1">
      <Link href={href}>
        <a
          className={cn(
            "flex items-center px-4 py-3 rounded-lg transition-all",
            active 
              ? "text-primary bg-[hsl(var(--sidebar-accent))] font-medium" 
              : "text-gray-600 hover:text-primary hover:bg-[hsl(var(--sidebar-accent))]"
          )}
        >
          <span className="mr-3">{icon}</span>
          {children}
        </a>
      </Link>
    </li>
  );
}

export function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="w-full md:w-64 bg-[hsl(var(--sidebar-background))] md:min-h-screen p-5">
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary">
          <span className="text-white font-bold">IA</span>
        </div>
        <span className="ml-2 text-xl font-bold">AVALIAÇÕES</span>
      </div>

      <nav>
        <ul>
          <SidebarItem href="/" icon={<DashboardIcon />} active={location === "/"}>
            Dashboard
          </SidebarItem>
          <SidebarItem 
            href="/performance" 
            icon={<PerformanceIcon />} 
            active={location === "/performance"}
          >
            Avaliação de Desempenho
          </SidebarItem>
          <SidebarItem 
            href="/climate" 
            icon={<ClimateIcon />} 
            active={location === "/climate"}
          >
            Pesquisa de Clima
          </SidebarItem>
          <SidebarItem 
            href="/feedback360" 
            icon={<Feedback360Icon />} 
            active={location === "/feedback360"}
          >
            Avaliação 360°
          </SidebarItem>
          <SidebarItem 
            href="/reports" 
            icon={<ReportIcon />} 
            active={location === "/reports"}
          >
            Relatórios
          </SidebarItem>
          <SidebarItem 
            href="/settings" 
            icon={<SettingsIcon />} 
            active={location === "/settings"}
          >
            Configurações
          </SidebarItem>
        </ul>
      </nav>
    </aside>
  );
}
