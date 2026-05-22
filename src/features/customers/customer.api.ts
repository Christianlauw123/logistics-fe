import { api } from "../../lib/api"
import type { Paginated, Customer } from "../../types"

export type CustomerFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}


export async function getCustomers(filters: CustomerFilters = {}): Promise<Paginated<Customer>> {
  const response = await api.get<Paginated<Customer>>("/customers", { params: filters })
  return response.data
}