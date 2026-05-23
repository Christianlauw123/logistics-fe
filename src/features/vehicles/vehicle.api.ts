import { api } from "../../lib/api"
import type { Paginated, Vehicle } from "../../types"

export type VehicleFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}

export interface CreateUpdateVehiclePayload {
  name?: string
  plate_number: string
  type?: string
  capacity?: number
  is_active?: boolean
}

export async function getVehicles(filters: VehicleFilters = {}): Promise<Paginated<Vehicle>> {
  const response = await api.get<Paginated<Vehicle>>("/vehicles", { params: filters })
  return response.data
}


export async function getVehicle(id: string | undefined): Promise<Vehicle> {
  const response = await api.get<Vehicle>(`/vehicles/${id}`)
  return response.data
}

export async function createVehicle(payload: CreateUpdateVehiclePayload): Promise<Vehicle> {
  const response = await api.post<Vehicle>("/vehicles", payload)
  return response.data
}

export async function updateVehicle(id: string, payload: CreateUpdateVehiclePayload): Promise<Vehicle> {
  const response = await api.put<Vehicle>(`/vehicles/${id}`, payload)
  return response.data
}

export async function deleteVehicle(id: string): Promise<void> {
  await api.delete<Vehicle>(`/vehicles/${id}`)
}