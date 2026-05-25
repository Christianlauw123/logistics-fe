import { Outlet, NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/features/auth/auth.store"
import { logout } from "@/features/auth/auth.api"
import { useState } from "react"
import { Sheet, SheetContent } from "../ui/sheet"
import { Menu } from "lucide-react"

export default function DashboardLayout() {
  const setUser = useAuthStore((state) => state.setUser)
  const user = useAuthStore((state) => state.user)
  const [isOpen, setIsOpen] = useState(false);
  
  async function handleLogout() {
    await logout()
    setUser(null)
    window.location.href = "/login"
  }

  const NavLinks = () => (
    <nav className="space-y-2">
      <NavItem to="/transactions" label="Transactions" onClick={() => setIsOpen(false)} />
      {user?.role.name === "Super Admin" && (
        <>
          <NavItem to="/customers" label="Customers" onClick={() => setIsOpen(false)} />
          <NavItem to="/vehicles" label="Vehicles" onClick={() => setIsOpen(false)} />
          <NavItem to="/bank-accounts" label="Bank Accounts" onClick={() => setIsOpen(false)} />
          <NavItem to="/trip-prices" label="Trip Prices" onClick={() => setIsOpen(false)} />
          <NavItem to="/users" label="Users" onClick={() => setIsOpen(false)} />
        </>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/40">
      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-background p-4 md:block">
        <h1 className="mb-6 text-xl font-bold">Dashboard</h1>

        <NavLinks />
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <Button 
                variant="outline" 
                size="icon" 
                className="md:hidden"
                onClick={() => setIsOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>

              <SheetContent side="left" className="w-64 p-4">
                <h1 className="mb-6 text-xl font-bold">Dashboard</h1>
                <NavLinks />
              </SheetContent>
            </Sheet>

            <h2 className="font-semibold">Operations</h2>
          </div>

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

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
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