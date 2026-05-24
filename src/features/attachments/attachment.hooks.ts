import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { errorHandler } from "@/lib/utils"

export function createUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ transactionId, file }: { transactionId: string, file: File }) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("transaction_id", transactionId)

      await api.post(`/attachments`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Attachment uploaded")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function deleteUploadAttachment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ attachmentId }: { transactionId: string, attachmentId: string }) => {
      await api.delete(`/attachments/${attachmentId}`)
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["transactions", "detail", variables.transactionId],
      })
      toast.success("Attachment deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}