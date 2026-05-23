import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "./auth.store"

interface RoleProtectedRouteProps {
  allowedRoles: string[];
}
export default function ProtectedRoute({ allowedRoles }: RoleProtectedRouteProps) {
  const user = useAuthStore((state) => state.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role.name)) {
    return <Navigate to="/transactions" replace />
  }

  return <Outlet />
}