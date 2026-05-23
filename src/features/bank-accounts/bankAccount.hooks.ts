import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { errorHandler } from "../../lib/utils"
import { toast } from "sonner"
import { createBankAccount, deleteBankAccount, getBankAccount, getBankAccounts, updateBankAccount, type BankAccountFilters, type CreateUpdateBankAccountPayload } from "./bankAccount.api"

export function useBankAccountsQuery(filters: BankAccountFilters = {}) {
  return useQuery({
    queryKey: ["bankAccounts", filters],
    queryFn: () => getBankAccounts(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useBankAccountQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["bankAccount", id],
    queryFn: () => getBankAccount(id),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useBankAccountCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateBankAccountPayload) => {
      await createBankAccount(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bankAccounts"],
      })
      toast.success("Bank Account Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useBankAccountUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateBankAccountPayload }) => {
      await updateBankAccount(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bankAccounts"],
      })
      toast.success("Bank Account Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useBankAccountDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteBankAccount(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bankAccounts"],
      })
      toast.success("Bank Account Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


