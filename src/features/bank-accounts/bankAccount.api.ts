import { api } from "../../lib/api"
import type { Paginated, BankAccount } from "../../types"

export type BankAccountFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}


export async function getBankAccounts(filters: BankAccountFilters = {}): Promise<Paginated<BankAccount>> {
  const response = await api.get<Paginated<BankAccount>>("/bank_accounts", { params: filters })
  return response.data
}