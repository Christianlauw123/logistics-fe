import { useQuery } from "@tanstack/react-query"
import { getVehicles, type VehicleFilters } from "./vehicle.api"

export function useVehiclesQuery(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: () => getVehicles(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}