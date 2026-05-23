import { Outlet, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/auth.store"
import { logout } from "@/features/auth/auth.api"

export default function DashboardLayout() {
  const setUser = useAuthStore((state) => state.setUser)
  const user = useAuthStore((state) => state.user)

  async function handleLogout() {
    await logout()
    setUser(null)
    window.location.href = "/login"
  }
  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-background p-4 md:block">
        <h1 className="mb-6 text-xl font-bold">Dashboard</h1>

        <nav className="space-y-2">
          <NavItem to="/transactions" label="Transactions" />
          {user?.role.name === "Super Admin" && (
            <>
              <NavItem to="/customers" label="Customers" />
              <NavItem to="/vehicles" label="Vehicles" />
              <NavItem to="/bank-accounts" label="Bank Accounts" />
              <NavItem to="/trip-prices" label="Trip Prices" />
              <NavItem to="/users" label="Users" />
            </>
          )}
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
          <h2 className="font-semibold">Operations</h2>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </header>

        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          "block rounded-md px-3 py-2 text-sm",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ].join(" ")
      }
    >
      {label}
    </NavLink>
  )
}