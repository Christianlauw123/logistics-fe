import { z } from "zod"

export const createTransactionSchema = z.object({
  customer_id: z.uuid().min(1, "Customer is required"),
  origin_sub_district_id: z.uuid().min(1, "Origin is required"),
  dest_sub_district_id: z.uuid().min(1, "Destination is required"),
  vehicle_id: z.uuid().min(1, "Vehicle is required"),
  bank_account_id: z.uuid().min(1, "Bank account is required"),
  dest_address: z.string().min(1, "Destination address is required"),
  transaction_items: z.string().min(1, "Item Information is required"),
  do_number: z.string().optional(),
  do_actual_date: z.string().optional(),
  transaction_capacity: z.number().min(0.1),
})

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>