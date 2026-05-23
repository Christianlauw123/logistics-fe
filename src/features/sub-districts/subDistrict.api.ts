import { api } from "@/lib/api"
import type { Paginated, SubDistrict } from "@/types"

export type SubDistrictFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}


export async function getSubDistricts(filters: SubDistrictFilters = {}): Promise<Paginated<SubDistrict>> {
  const response = await api.get<Paginated<SubDistrict>>("/sub_districts", { params: filters })
  return response.data
}