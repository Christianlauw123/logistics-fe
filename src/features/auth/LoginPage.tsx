import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "./auth.api"
import { useAuthStore } from "./auth.store"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore((state) => state.setUser)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const deviceType = searchParams.get("device_type") || "web";
    try {
        setIsLoading(true)
        const user = await login({ email, password, device_type: deviceType })
        setUser(user)
        toast.success("Login successful")
        navigate("/transactions")
    } catch (error: any) {
        toast.error("Invalid email or password")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              
              {/* ⚡ THE FIX: This relative wrapper locks the absolute button inside it */}
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="pr-10" // Prevents password characters from slipping under the eye icon
                />
                <button
                  type="button" 
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 text-red-400 hover:text-red-600 focus:outline-none transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}