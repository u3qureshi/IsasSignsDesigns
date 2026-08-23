import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  smsConsent: boolean;
  roles: string[];
}

export interface SignupDetails {
  firstName: string;
  lastName: string;
  email: string;
  emailConfirmation: string;
  phone: string;
  smsConsent: boolean;
}

export interface AuthChallenge {
  challengeId: string;
  message: string;
  expiresInSeconds: number;
  resendAvailableInSeconds: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  startSignup: (details: SignupDetails) => Promise<AuthChallenge>;
  startLogin: (email: string) => Promise<AuthChallenge>;
  verifyCode: (challengeId: string, code: string) => Promise<AuthUser>;
  updateProfile: (details: Pick<SignupDetails, "firstName" | "lastName" | "phone" | "smsConsent">) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

interface ApiErrorBody {
  message?: string;
  details?: string[];
}

const AuthContext = createContext<AuthContextValue | null>(null);
let initialSessionPromise: Promise<AuthUser | null> | null = null;
let refreshPromise: Promise<AuthUser> | null = null;
let csrfPromise: Promise<{ headerName: string; token: string }> | null = null;

async function parseResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  let body: ApiErrorBody = {};
  try {
    body = (await response.json()) as ApiErrorBody;
  } catch {
    // Preserve the status-based fallback when a proxy returns a non-JSON error page.
  }
  const message = body.details?.[0] || body.message || `Request failed (${response.status}).`;
  const error = new Error(message) as Error & { status?: number };
  error.status = response.status;
  throw error;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    credentials: "same-origin",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
  });
  return parseResponse<T>(response);
}

async function csrfHeaders(): Promise<Record<string, string>> {
  csrfPromise ??= request<{ headerName: string; token: string }>("/api/auth/csrf");
  try {
    const csrf = await csrfPromise;
    return { [csrf.headerName]: csrf.token };
  } catch (error) {
    csrfPromise = null;
    throw error;
  }
}

async function refreshSession(): Promise<AuthUser> {
  refreshPromise ??= (async () => {
    try {
      return await request<AuthUser>("/api/auth/refresh", {
        method: "POST",
        headers: await csrfHeaders(),
      });
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function loadInitialSession(): Promise<AuthUser | null> {
  try {
    return await request<AuthUser>("/api/auth/me");
  } catch (error) {
    if ((error as { status?: number }).status !== 401) throw error;
  }

  try {
    return await refreshSession();
  } catch (error) {
    if ((error as { status?: number }).status === 401) return null;
    throw error;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    initialSessionPromise ??= loadInitialSession();
    initialSessionPromise
      .then((nextUser) => {
        if (active) setUser(nextUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const startSignup = useCallback((details: SignupDetails) => request<AuthChallenge>(
    "/api/auth/signup",
    { method: "POST", body: JSON.stringify(details) },
  ), []);

  const startLogin = useCallback((email: string) => request<AuthChallenge>(
    "/api/auth/login",
    { method: "POST", body: JSON.stringify({ email }) },
  ), []);

  const verifyCode = useCallback(async (challengeId: string, code: string) => {
    const nextUser = await request<AuthUser>("/api/auth/verify", {
      method: "POST",
      body: JSON.stringify({ challengeId, code }),
    });
    setUser(nextUser);
    return nextUser;
  }, []);

  const updateProfile = useCallback(async (
    details: Pick<SignupDetails, "firstName" | "lastName" | "phone" | "smsConsent">,
  ) => {
    const nextUser = await request<AuthUser>("/api/auth/me", {
      method: "PATCH",
      headers: await csrfHeaders(),
      body: JSON.stringify(details),
    });
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await request<void>("/api/auth/logout", {
        method: "POST",
        headers: await csrfHeaders(),
      });
    } finally {
      setUser(null);
      initialSessionPromise = Promise.resolve(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    startSignup,
    startLogin,
    verifyCode,
    updateProfile,
    logout,
  }), [user, loading, startSignup, startLogin, verifyCode, updateProfile, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
