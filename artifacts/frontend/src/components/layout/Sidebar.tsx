import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Users, FileText, FileSignature, CreditCard,
  Home, UserCheck, Handshake, Bell, LogOut, ChevronDown,
  Building2
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const pfNav: NavItem[] = [
  { label: "Dashboard", href: "/pf", icon: LayoutDashboard },
  { label: "Clients", href: "/pf/clients", icon: Users },
  { label: "Proposals", href: "/pf/proposals", icon: FileText },
  { label: "Contracts", href: "/pf/contracts", icon: FileSignature },
  { label: "Deposits", href: "/pf/deposits", icon: CreditCard },
];

const alNav: NavItem[] = [
  { label: "Dashboard", href: "/al", icon: LayoutDashboard },
  { label: "Properties", href: "/al/properties", icon: Home },
  { label: "Leads", href: "/al/leads", icon: UserCheck },
  { label: "Deals", href: "/al/deals", icon: Handshake },
  { label: "Reminders", href: "/al/reminders", icon: Bell },
];

function NavSection({ title, items, accent }: { title: string; items: NavItem[]; accent: string }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
        data-testid={`nav-section-${title.toLowerCase().replace(/\s/g, "-")}`}
      >
        <span>{title}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", open ? "" : "-rotate-90")} />
      </button>
      {open && (
        <div className="space-y-0.5">
          {items.map(item => {
            const active = location === item.href || (item.href !== "/pf" && item.href !== "/al" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? `bg-sidebar-accent text-sidebar-accent-foreground`
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  data-testid={`nav-${item.href.replace(/\//g, "-")}`}
                >
                  <item.icon className={cn("h-4 w-4 flex-shrink-0", active ? "text-primary" : "")} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-56 flex-col bg-sidebar border-r border-sidebar-border" data-testid="sidebar">
      <div className="flex items-center gap-2 px-4 py-5 border-b border-sidebar-border">
        <Building2 className="h-6 w-6 text-primary flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-sidebar-foreground leading-tight truncate">ProposalForge</p>
          <p className="text-xs text-sidebar-foreground/50 leading-tight">& AgentLead</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <NavSection title="ProposalForge" items={pfNav} accent="blue" />
        <div className="border-t border-sidebar-border pt-4">
          <NavSection title="AgentLead" items={alNav} accent="emerald" />
        </div>
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">{user?.name}</p>
            <p className="text-xs text-sidebar-foreground/50 truncate">{user?.email}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={logout}
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
