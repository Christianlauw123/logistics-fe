import { api } from "../../lib/api"
import type { Paginated, Vehicle } from "../../types"

export type VehicleFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}


export async function getVehicles(filters: VehicleFilters = {}): Promise<Paginated<Vehicle>> {
  const response = await api.get<Paginated<Vehicle>>("/vehicles", { params: filters })
  return response.data
}