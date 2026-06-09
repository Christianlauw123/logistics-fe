import { api } from "@/lib/api"
import type { Paginated, Driver } from "@/types"

export type DriverFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
  is_active?: boolean
}

export interface CreateUpdateDriverPayload {
  name: string
}

export async function getDrivers(filters: DriverFilters = {}): Promise<Paginated<Driver>> {
  const response = await api.get<Paginated<Driver>>("/drivers", { params: filters })
  return response.data
}


export async function getDriver(id: string | undefined): Promise<Driver> {
  const response = await api.get<Driver>(`/drivers/${id}`)
  return response.data
}

export async function createDriver(payload: CreateUpdateDriverPayload): Promise<Driver> {
  const response = await api.post<Driver>("/drivers", payload)
  return response.data
}

export async function updateDriver(id: string, payload: CreateUpdateDriverPayload): Promise<Driver> {
  const response = await api.put<Driver>(`/drivers/${id}`, payload)
  return response.data
}

export async function deleteDriver(id: string): Promise<void> {
  await api.delete<Driver>(`/drivers/${id}`)
}