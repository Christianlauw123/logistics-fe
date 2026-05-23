import { api } from "../../lib/api"
import type { Paginated, TripPrice } from "../../types"

export type TripPriceFilters = {
  search?: string
  customerId?: string
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

