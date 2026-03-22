import { Navigate } from "react-router";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuth = localStorage.getItem("auth") === "true";

  if (!isAuth) {
    return <Navigate to="/login" />;
  }

  return children;
}