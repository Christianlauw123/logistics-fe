import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createTripPrice, deleteTripPrice, getTripPrice, getTripPrices, updateTripPrice } from "./tripPrice.api"
import { type CreateUpdateTripPricePayload, type TripPriceFilters } from "./tripPrice.api"

import { errorHandler } from "../../lib/utils"
import { toast } from "sonner"

export function useTripPricesQuery(filters: TripPriceFilters = {}) {
  return useQuery({
    queryKey: ["trip_prices", filters],
    queryFn: () => getTripPrices(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useTripPriceQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["trip_price", id],
    queryFn: () => getTripPrice(id),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useTripPriceCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateTripPricePayload) => {
      await createTripPrice(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trip_prices"],
      })
      toast.success("Trip Price Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useTripPriceUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateTripPricePayload }) => {
      await updateTripPrice(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trip_prices"],
      })
      toast.success("Trip Price Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useTripPriceDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteTripPrice(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trip_prices"],
      })
      toast.success("Trip Price Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


