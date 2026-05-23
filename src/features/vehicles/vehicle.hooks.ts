import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createVehicle, deleteVehicle, getVehicle, getVehicles, updateVehicle, type CreateUpdateVehiclePayload, type VehicleFilters } from "./vehicle.api"
import { toast } from "sonner"
import { errorHandler } from "@/lib/utils"

export function useVehiclesQuery(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ["vehicles", "list", filters],
    queryFn: () => getVehicles(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useVehicleQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["vehicles", "list"],
    queryFn: () => getVehicle(id),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useVehicleCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateVehiclePayload) => {
      await createVehicle(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", "list"],
      })
      toast.success("Vehicle Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useVehicleUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateVehiclePayload }) => {
      await updateVehicle(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", "list"],
      })
      toast.success("Vehicle Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useVehicleDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteVehicle(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vehicles", "list"],
      })
      toast.success("Vehicle Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


