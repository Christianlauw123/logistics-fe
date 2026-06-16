import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import type { TransactionDetailStatus } from "@/types"
import { errorHandler } from "@/lib/utils"

export function createTransactionDetail() {
  return useMutation({
    mutationFn: async ({ transactionId, amount, note, purpose, file, is_special_case }: { transactionId: string, amount: number, note: string, purpose: string, file?: File, is_special_case?: boolean }) => {
      const response = await api.post(`/transaction_details`, { transaction_id: transactionId, amount: amount, note: note, purpose: purpose, file: file, is_special_case: is_special_case }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success("Transaction Detail Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function updateTransactionDetail() {
  return useMutation({
    mutationFn: async ({ transactionDetailId, amount, note, purpose, file, is_special_case }: { transactionId: string, transactionDetailId: string, amount: number, note: string, purpose: string, file?: File, is_special_case?: boolean }) => {
      const response = await api.patch(`/transaction_details/${transactionDetailId}`, { amount: amount, note: note, purpose: purpose, file: file, is_special_case: is_special_case }, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      return response.data
    },
    onSuccess: () => {
      toast.success("Transaction Detail Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function deleteTransactionDetail() {
  return useMutation({
    mutationFn: async ({ transactionDetailId }: { transactionId: string, transactionDetailId: string }) => {
      await api.delete(`/transaction_details/${transactionDetailId}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
    },
    onSuccess: () => {
      toast.success("Transaction Detail Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function updateTransactionDetailStatus() {
  return useMutation({
    mutationFn: async ({ id, status }: { transactionId: string, id: string, status: TransactionDetailStatus }) => {
      await api.patch(`/transaction_details/${id}/status`, { status })
    },
    onSuccess: () => {
      toast.success("Status updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}