import { Navigate, useNavigate } from "react-router-dom";
import AuthDialog from "../auth/AuthDialog";
import { useAuth } from "../auth/auth-context";

export default function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return <main className="min-h-[65vh] bg-[hsl(var(--theme-kids-bg))]" />;
  if (user) return <Navigate to="/account/orders" replace />;

  return (
    <main className="min-h-[65vh] bg-[hsl(var(--theme-kids-bg))]">
      <AuthDialog
        initialView="login"
        origin={{ x: window.innerWidth / 2, y: Math.min(window.innerHeight / 2, 420) }}
        onClose={() => navigate("/", { replace: true })}
      />
    </main>
  );
}
