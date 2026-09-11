import { createContext, useContext } from "react";

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

export interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  startSignup: (details: SignupDetails) => Promise<AuthChallenge>;
  startLogin: (email: string) => Promise<AuthChallenge>;
  verifyCode: (challengeId: string, code: string) => Promise<AuthUser>;
  updateProfile: (details: Pick<SignupDetails, "firstName" | "lastName" | "phone" | "smsConsent">) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}
