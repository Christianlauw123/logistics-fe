import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createUser, deleteUser, getUsers, updateUser } from "./user.api"
import { type CreateUpdateUserPayload, type UserFilters } from "./user.api"
import { toast } from "sonner"
import { errorHandler } from "../../lib/utils"

export function useUsersQuery(filters: UserFilters = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => getUsers(filters),
    staleTime: 1000 * 60 * 5, // Cache options data for 5 minutes so it doesn't spam requests
  })
}

export function useUserQuery(id: string | undefined) {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => getUsers({ id }),
    enabled: !!id, // Only run this query if an ID is provided
  })
}

export function useUserCreateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: CreateUpdateUserPayload) => {
      await createUser(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      toast.success("User Created")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


export function useUserUpdateQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: CreateUpdateUserPayload }) => {
      await updateUser(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      toast.success("User Updated")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}

export function useUserDeleteQuery(){
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await deleteUser(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      })
      toast.success("User Deleted")
    },
    onError: (error: any) => {
      errorHandler(error)
    },
  })
}


