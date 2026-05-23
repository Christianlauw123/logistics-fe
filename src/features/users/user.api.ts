import { api } from "../../lib/api"
import type { Paginated, User } from "../../types"

export type UserFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}

export interface CreateUpdateUserPayload {
  name: string | undefined,
  email: string | undefined,
  password: string | undefined,
  password_confirmation: string | undefined,
  role_id: string | undefined,
}

export async function getUsers(filters: UserFilters = {}): Promise<Paginated<User>> {
  const response = await api.get<Paginated<User>>("/users", { params: filters })
  return response.data
}


export async function getUser(id: string | undefined): Promise<User> {
  const response = await api.get<User>(`/users/${id}`)
  return response.data
}

export async function createUser(payload: CreateUpdateUserPayload): Promise<User> {
  const response = await api.post<User>("/users", payload)
  return response.data
}

export async function updateUser(id: string, payload: CreateUpdateUserPayload): Promise<User> {
  const response = await api.put<User>(`/users/${id}`, payload)
  return response.data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete<User>(`/users/${id}`)
}