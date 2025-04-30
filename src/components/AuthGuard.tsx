import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AuthGuardProps {
  /**
   * If true, route is protected (only for authenticated users).
   * If false, route is public (redirects _away_ if user is already authenticated).
   */
  requireAuth?: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Protected route: must be logged in
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Public route: must NOT be logged in
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthGuard;
