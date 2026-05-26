"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) setCollapsed(stored === "true");
  }, []);

  const handleCollapseChange = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("sidebar-collapsed", String(value));
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar collapsed={collapsed} onCollapseChange={handleCollapseChange} />
      <main className="flex-1 overflow-y-auto md:pl-0">
        {children}
      </main>
    </div>
  );
}
