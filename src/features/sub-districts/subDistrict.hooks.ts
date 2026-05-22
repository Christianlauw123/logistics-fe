import { useQuery } from "@tanstack/react-query"
import { getSubDistricts, type SubDistrictFilters } from "./subDistrict.api"

export function useSubDistrictsQuery(filters: SubDistrictFilters = {}) {
  return useQuery({
    queryKey: ["sub-districts", filters],
    queryFn: () => getSubDistricts(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}