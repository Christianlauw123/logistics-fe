import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "@/features/auth/LoginPage"
import ProtectedRoute from "@/features/auth/ProtectedRoute"
import TransactionListPage from "@/features/transactions/TransactionListPage"
import TransactionDetailPage from "@/features/transaction-details/TransactionDetailPage"
import CustomerListPage from "@/features/customers/CustomerListPage"
import VehicleListPage from "@/features/vehicles/VehicleListPage"
import UserListPage from "@/features/users/UserListPage"
import BankAccountListPage from "@/features/bank-accounts/BankAccountListPage"
import TripPriceListPage from "@/features/trip-prices/TripPriceListPage"

import DashboardLayout from "@/components/layout/DashboardLayout"
import RoleProtectedRoute from "@/features/auth/RoleProtectedRoute"
import { allowedRoles } from "@/lib/utils"
import DriverListPage from "@/features/drivers/DriverListPage"


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/transactions" replace />} />

          <Route element={<RoleProtectedRoute allowedRoles={allowedRoles} />}>
            <Route path="/transactions" element={<TransactionListPage />} />
            <Route path="/transactions/:id" element={<TransactionDetailPage />} />
          </Route>
          
          <Route element={<RoleProtectedRoute allowedRoles={['Super Admin']} />}>
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/vehicles" element={<VehicleListPage />} />
            <Route path="/bank-accounts" element={<BankAccountListPage />} />
            <Route path="/trip-prices" element={<TripPriceListPage />} />
            <Route path="/drivers" element={<DriverListPage />} />
            <Route path="/users" element={<UserListPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}