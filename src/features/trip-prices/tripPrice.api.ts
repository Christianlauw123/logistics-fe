import { api } from "@/lib/api"
import type { District, Paginated, TripPrice } from "@/types"

export type TripPriceFilters = {
  search?: string
  customer_id?: string
  origin_sub_district_id?: string
  dest_sub_district_id?: string
  per_page?: number
  page?: number
  id?: string
}

export interface CreateUpdateTripPricePayload {
  customer_id: string
  origin_sub_district_id?: string
  dest_sub_district_id?: string
  base_price: number
}

export interface TripPriceAllowedDistrict {
  id: string
  name: string
  district: District
}

export async function getTripPrices(filters: TripPriceFilters = {}): Promise<Paginated<TripPrice>> {
  const response = await api.get<Paginated<TripPrice>>("/trip_prices", { params: filters })
  return response.data
}

export async function getTripPrice(id: string | undefined): Promise<TripPrice> {
  const response = await api.get<TripPrice>(`/trip_prices/${id}`)
  return response.data
}

export async function createTripPrice(payload: CreateUpdateTripPricePayload): Promise<TripPrice> {
  const response = await api.post<TripPrice>("/trip_prices", payload)
  return response.data
}

export async function updateTripPrice(id: string, payload: CreateUpdateTripPricePayload): Promise<TripPrice> {
  const response = await api.put<TripPrice>(`/trip_prices/${id}`, payload)
  return response.data
}

export async function deleteTripPrice(id: string): Promise<void> {
  await api.delete<TripPrice>(`/trip_prices/${id}`)
}

export async function listTripAllowedSubDistricts(filters: TripPriceFilters = {}): Promise<Paginated<TripPriceAllowedDistrict>> {
  const response = await api.get<Paginated<TripPriceAllowedDistrict>>(`/trip_prices/sub_districts`, { params: filters })
  return response.data
}

