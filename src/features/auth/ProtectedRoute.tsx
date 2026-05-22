import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "./auth.store"

export default function ProtectedRoute() {
  const user = useAuthStore((state) => state.user)
  const isAuthChecked = useAuthStore((state) => state.isAuthChecked)

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Checking authentication...
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}