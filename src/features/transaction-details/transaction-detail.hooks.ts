import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { TransactionStatus } from "@/types"
import { errorHandler } from "@/lib/utils"

export function createTransactionDetail() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ transactionId, amount, note, purpose }: { transactionId: string, amount: number, note: string, purpose: string }) => {
      await api.post(`/transaction_details`, { transaction_id: transactionId, amount: amount, note: note, purpose: purpose }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Transaction Detail Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function updateTransactionDetail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionDetailId, amount, note, purpose }: { transactionId: string, transactionDetailId: string, amount: number, note: string, purpose: string }) => {
      await api.patch(`/transaction_details/${transactionDetailId}`, { amount: amount, note: note, purpose: purpose }, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Transaction Detail Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function deleteTransactionDetail() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionDetailId }: { transactionId: string, transactionDetailId: string }) => {
      await api.delete(`/transaction_details/${transactionDetailId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Transaction Detail Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function updateTransactionDetailStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, status }: { transactionId: string, id: string, status: TransactionStatus }) => {
      await api.patch(`/transaction_details/${id}/status`, { status })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Status updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}