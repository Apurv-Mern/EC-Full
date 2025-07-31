import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Building2,
  Code,
  Layers,
  Clock,
  Package,
  DollarSign,
  Settings,
  FileText,
  Menu,
  X
} from "lucide-react";

const navigation = [
  // { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Industries", href: "/admin/industries", icon: Building2 },
  { name: "Software Types", href: "/admin/software-types", icon: Code },
  { name: "OS Types", href: "/admin/os-types", icon: Code },
  { name: "Tech Stacks", href: "/admin/tech-stacks", icon: Layers },
  { name: "Delivery Timeline", href: "/admin/timeline", icon: Clock },
  { name: "Feature Library", href: "/admin/features", icon: Package },
  { name: "Currency Management", href: "/admin/currencies", icon: DollarSign },
  { name: "Estimation Management", href: "/admin/estimation/management", icon: Settings },
];

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-admin-secondary">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold text-admin-primary">Admin Panel</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SidebarNav />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex min-h-0 flex-1 flex-col bg-white border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold text-admin-primary">Admin Panel</h1>
            <Badge variant="secondary">v1.0</Badge>
          </div>
          <SidebarNav />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-border" />
              <span className="text-sm text-muted-foreground">
                Welcome to the Admin Panel
              </span>
            </div>
          </div>
        </div>

        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarNav() {
  const location = useLocation();

  return (
    <nav className="flex-1 space-y-1 p-4">
      {navigation.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-admin-primary text-admin-primary-foreground"
                : "text-foreground hover:bg-admin-accent hover:text-admin-primary"
            )}
          >
            <item.icon
              className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                isActive ? "text-admin-primary-foreground" : "text-muted-foreground group-hover:text-admin-primary"
              )}
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}