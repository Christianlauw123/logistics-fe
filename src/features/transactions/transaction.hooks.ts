import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { Paginated, Transaction, TransactionStatus } from "@/types"
import { errorHandler } from "@/lib/utils"

export type TransactionFilters = {
  search?: string
  status?: string
  customer_id?: string
  date_start?: string
  date_end?: string
  sort_by?: string
  sort_dir?: "asc" | "desc"
  per_page?: number
  page?: number
  filter_date_key?: string
  vehicle_id?: string
}

export function getTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", "list", filters],
    queryFn: async () => {
      const response = await api.get<Paginated<Transaction>>("/transactions", {
        params: filters,
      })

      return response.data
    },
  })
}

export function getTransaction(id: string | undefined) {
  return useQuery({
    queryKey: ["transactions", "detail", id],
    queryFn: async () => {
      const response = await api.get<{ data: Transaction }>(
        `/transactions/${id}`
      )

      return response.data.data
    },
    enabled: Boolean(id),
  })
}

export function deleteTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionId }: { transactionId: string }) => {
      await api.delete(`/transactions/${transactionId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "list"],
      })
      toast.success("Transaction Detail Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export interface CreateUpdateTransactionPayload {
  do_number: string
  do_actual_date: string
  note: string
  amount: number
  transaction_capacity: number
  transaction_items: string
  dest_address: string
  customer_id: string
  origin_sub_district_id: string
  dest_sub_district_id: string
  vehicle_id: string
  bank_account_id: string
}

export function updateTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionId, payload }: { transactionId: string; payload: CreateUpdateTransactionPayload }) => {
      await api.put(`/transactions/${transactionId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Transaction Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function createTransaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ payload }: { payload: CreateUpdateTransactionPayload }) => {
      await api.post("/transactions", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      })
      toast.success("Transaction Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function updateTransactionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: TransactionStatus
    }) => {
      await api.patch(`/transactions/${id}/status`, { status })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({
        queryKey: ["transactions", variables.id],
      })
      toast.success("Status updated")
    },
    onError: () => {
      toast.error("Failed to update status")
    },
  })
}