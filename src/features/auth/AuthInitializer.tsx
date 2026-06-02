import { type ReactNode, useEffect, useRef } from "react"
import { getMe } from "./auth.api"
import { useAuthStore } from "./auth.store"

type AuthInitializerProps = {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsAuthChecked = useAuthStore((state) => state.setIsAuthChecked)
  const hasStartedInit = useRef(false);
  useEffect(() => {
    async function initAuth() {
      if (hasStartedInit.current) return;
      
      hasStartedInit.current = true;
      
      try {
        const user = await getMe()
        setUser(user)
      } catch {
        setUser(null)
      } finally {
        setIsAuthChecked(true)
      }
    }

    initAuth()
  }, [setUser, setIsAuthChecked])

  return <>{children}</>
}