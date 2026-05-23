import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createCustomer, deleteCustomer, getCustomer, getCustomers, updateCustomer } from "./customer.api"
import { type CreateUpdateCustomerPayload, type CustomerFilters } from "./customer.api"

import { errorHandler } from "../../lib/utils"
import { toast } from "sonner"

export function useCustomersQuery(filters: CustomerFilters = {}) {
  return useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getCustomers(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useCustomerQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomer(id),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useCustomerCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateCustomerPayload) => {
      await createCustomer(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
      toast.success("Customer Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useCustomerUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateCustomerPayload }) => {
      await updateCustomer(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
      toast.success("Customer Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useCustomerDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteCustomer(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customers"],
      })
      toast.success("Customer Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


