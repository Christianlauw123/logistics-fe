import { api } from "../../lib/api"
import type { Paginated, BankAccount } from "../../types"

export type BankAccountFilters = {
  search?: string
  per_page?: number
  page?: number
  id?: string
}

export interface CreateUpdateBankAccountPayload {
  bank_name?: string
  account_identifier_number: string
  account_number?: string
  account_name?: string
}

export async function getBankAccounts(filters: BankAccountFilters = {}): Promise<Paginated<BankAccount>> {
  const response = await api.get<Paginated<BankAccount>>("/bank_accounts", { params: filters })
  return response.data
}

export async function getBankAccount(id: string | undefined): Promise<BankAccount> {
  const response = await api.get<BankAccount>(`/bank_accounts/${id}`)
  return response.data
}

export async function createBankAccount(payload: CreateUpdateBankAccountPayload): Promise<BankAccount> {
  const response = await api.post<BankAccount>("/bank_accounts", payload)
  return response.data
}

export async function updateBankAccount(id: string, payload: CreateUpdateBankAccountPayload): Promise<BankAccount> {
  const response = await api.put<BankAccount>(`/bank_accounts/${id}`, payload)
  return response.data
}

export async function deleteBankAccount(id: string): Promise<void> {
  await api.delete<BankAccount>(`/bank_accounts/${id}`)
}
