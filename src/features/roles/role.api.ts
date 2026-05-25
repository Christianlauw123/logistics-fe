import { api } from "@/lib/api"
import type { Paginated, Role } from "@/types"

export type RoleFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}

export async function getRoles(filters: RoleFilters = {}): Promise<Paginated<Role>> {
  const response = await api.get<Paginated<Role>>("/roles", { params: filters })
  return response.data
}