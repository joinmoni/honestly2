import type { MockSession } from "@/lib/types/domain";

export const mockUserSession: MockSession = {
  user: {
    id: "usr-001",
    name: "Avery Johnson",
    email: "avery@example.com",
    role: "user",
    authProvider: "google",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200"
  }
};

export const mockAdminSession: MockSession = {
  user: {
    id: "adm-001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    authProvider: "password"
  }
};

export const mockAnonymousSession: MockSession = {
  user: null
};
