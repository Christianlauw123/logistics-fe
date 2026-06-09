import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createDriver, deleteDriver, getDriver, getDrivers, updateDriver, type CreateUpdateDriverPayload, type DriverFilters } from "./driver.api"
import { toast } from "sonner"
import { errorHandler } from "@/lib/utils"

export function useDriversQuery(filters: DriverFilters = {}) {
  return useQuery({
    queryKey: ["drivers", "list", filters],
    queryFn: () => getDrivers(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useDriverQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["drivers", "list"],
    queryFn: () => getDriver(id),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useDriverCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateDriverPayload) => {
      await createDriver(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", "list"],
      })
      toast.success("Driver Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useDriverUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateDriverPayload }) => {
      await updateDriver(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", "list"],
      })
      toast.success("Driver Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useDriverDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteDriver(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["drivers", "list"],
      })
      toast.success("Driver Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


