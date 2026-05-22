import { type ReactNode, useEffect } from "react"
import { getMe } from "./auth.api"
import { useAuthStore } from "./auth.store"

type AuthInitializerProps = {
  children: ReactNode
}

export default function AuthInitializer({ children }: AuthInitializerProps) {
  const setUser = useAuthStore((state) => state.setUser)
  const setIsAuthChecked = useAuthStore((state) => state.setIsAuthChecked)

  useEffect(() => {
    async function initAuth() {
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