import { useQuery } from "@tanstack/react-query"
import { getBankAccounts, type BankAccountFilters } from "./bankAccount.api"

export function useBankAccountsQuery(filters: BankAccountFilters = {}) {
  return useQuery({
    queryKey: ["bank-accounts", filters],
    queryFn: () => getBankAccounts(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}