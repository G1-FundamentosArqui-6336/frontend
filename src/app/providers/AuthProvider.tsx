import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { signIn } from '@/services/iam/auth.service';
import { setAuthToken } from '@/services/http/client';

type User = { id: number; email: string; roles?: string[] } | null;

type Session = { token: string; user: User } | null;

type AuthContextShape = {
  session: Session;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(() => {
    try {
      const raw = localStorage.getItem('auth');
      if (!raw) return null;
      return JSON.parse(raw) as Session;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setAuthToken(session?.token);
  }, [session]);

  async function login(email: string, password: string) {
    const res = await signIn(email, password);
    const token = res.token;
    function normalizeRoles(input: unknown): string[] {
      if (!input) return [];
      if (Array.isArray(input)) {
        return input
          .map((r) => {
            if (typeof r === 'string') return r.trim().toUpperCase();
            if (r && typeof r === 'object') {
              // common shapes: { name: 'ROLE_X' } or { role: 'ROLE_X' }
              // try several property names
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const obj = r as any;
              if (typeof obj.name === 'string') return obj.name.trim().toUpperCase();
              if (typeof obj.role === 'string') return obj.role.trim().toUpperCase();
              if (typeof obj.authority === 'string') return obj.authority.trim().toUpperCase();
            }
            return String(r).trim().toUpperCase();
          })
          .filter(Boolean);
      }
      if (typeof input === 'string') return input.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
      return [];
    }

    const roles = normalizeRoles(res.roles);
    const user = { id: res.id, email: res.email, roles };
    const s: Session = { token, user };
    setSession(s);
    localStorage.setItem('auth', JSON.stringify(s));
    setAuthToken(token);
  }

  function logout() {
    setSession(null);
    localStorage.removeItem('auth');
    setAuthToken();
  }

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
