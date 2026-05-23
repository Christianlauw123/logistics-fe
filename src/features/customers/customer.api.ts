import { api } from "../../lib/api"
import type { Paginated, Customer } from "../../types"

export type CustomerFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}

export interface CreateUpdateCustomerPayload {
  name: string
  phone?: string
  address?: string
}

export async function getCustomers(filters: CustomerFilters = {}): Promise<Paginated<Customer>> {
  const response = await api.get<Paginated<Customer>>("/customers", { params: filters })
  return response.data
}

export async function getCustomer(id: string | undefined): Promise<Customer> {
  const response = await api.get<Customer>(`/customers/${id}`)
  return response.data
}

export async function createCustomer(payload: CreateUpdateCustomerPayload): Promise<Customer> {
  const response = await api.post<Customer>("/customers", payload)
  return response.data
}

export async function updateCustomer(id: string, payload: CreateUpdateCustomerPayload): Promise<Customer> {
  const response = await api.put<Customer>(`/customers/${id}`, payload)
  return response.data
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete<Customer>(`/customers/${id}`)
}

