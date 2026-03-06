import type { MockSession } from "@/lib/types/domain";

export const mockUserSession: MockSession = {
  user: {
    id: "usr-001",
    name: "Avery Johnson",
    email: "avery@example.com",
    role: "user"
  }
};

export const mockAdminSession: MockSession = {
  user: {
    id: "adm-001",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin"
  }
};

export const mockAnonymousSession: MockSession = {
  user: null
};
