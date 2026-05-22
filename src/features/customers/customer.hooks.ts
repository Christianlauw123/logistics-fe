import { useQuery } from "@tanstack/react-query"
import { getCustomers, type CustomerFilters } from "./customer.api"


export function useCustomersQuery(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}