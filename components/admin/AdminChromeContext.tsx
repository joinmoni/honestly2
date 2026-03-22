"use client";

import { createContext, useContext } from "react";

export type AdminChromeContextValue = {
  displayName: string;
  email: string;
  avatarUrl?: string;
};

const AdminChromeContext = createContext<AdminChromeContextValue | null>(null);

export function AdminChromeProvider({ value, children }: { value: AdminChromeContextValue; children: React.ReactNode }) {
  return <AdminChromeContext.Provider value={value}>{children}</AdminChromeContext.Provider>;
}

export function useAdminChromeOptional(): AdminChromeContextValue | null {
  return useContext(AdminChromeContext);
}
