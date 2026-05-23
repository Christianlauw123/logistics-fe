import { useQuery } from "@tanstack/react-query"
import { getRoles, type RoleFilters } from "./role.api"

export function useRolesQuery(filters: RoleFilters = {}) {
  return useQuery({
    queryKey: ["roles", "list", filters],
    queryFn: () => getRoles(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}
