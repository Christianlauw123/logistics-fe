export type Role = {
    id: string
    name: "Super Admin" | "Staff" | "Operational"
}

export type User = {
    id: string
    name: string
    email: string
    role: Role
    created_at: string
}

export type District = {
    id: string
    name: string
}

export type SubDistrict = {
    id: string
    name: string
    district: District
}

export type Customer = {
    id: string
    name: string
    phone: string | null
    address: string | null
}

export type Vehicle = {
    id: string
    name: string | null
    plate_number: string
    type: string
    capacity: number | null
    is_active: boolean
}

export type Driver = {
    id: string
    name: string
}

export type BankAccount = {
    id: string
    bank_name: string
    account_identifier_number: string
    account_number: string
    account_name: string
}

export type TripPrice = {
    id: string
    base_price: string
    customer: Customer
    origin_sub_district: SubDistrict
    destination_sub_district: SubDistrict
}

export type TransactionStatus = "SUBMITTED" | "APPROVED" | "DONE" | "CANCELLED" | "REJECTED" | "DONE_AND_WAITING_DOCUMENT" | "CANCELLED_NO_REFUND" | "CANCELLED_AND_REFUND"
export type TransactionDetailStatus = "SUBMITTED" | "APPROVED" | "DONE" | "CANCELLED" | "REJECTED" | "CANCELLED_FOR_REVISION"

export type AttachmentStatus = "PENDING" | "VERIFIED" | "REJECTED"

export type TransactionDetail = {
    id: string
    purpose: string
    amount: string
    note: string
    transaction: Transaction
    status: TransactionStatus
    is_special_case: boolean
    attachment?: string
}

export type Attachment = {
    id: string
    original_file_name?: string
    file_url: string
    file_id: string
    file_provider: string
    status: AttachmentStatus
    transaction?: Transaction
    transactionDetail?: TransactionDetail
}

export type Transaction = {
    id: string
    do_number: string | null
    do_date: string | null
    do_actual_date: string | null
    dest_address: string
    status: TransactionStatus
    customer: Customer
    vehicle: Vehicle
    bank_account: BankAccount
    trip_price: TripPrice
    user: User
    details: TransactionDetail[]
    attachments: Attachment[]
    trip_price_amount: number
    file_folder_id: string
    file_sub_folder_id: string
    file_provider: string
    vehicle_plate: string
    vehicle_type: string
    vehicle_capacity: number
    transaction_capacity: number
    transaction_items: string
    origin_district: string
    destination_district: string
    bank_account_num: string
    customer_name: string
    driver_name: string
    note: string
    created_at: string
    current_total?: number | 0
    current_total_approved?: number | 0
}

export type Paginated<T> = {
  data: T[]
  last_page: number
  per_page: number
  total: number
  next_page_url: string | null
  prev_page_url: string | null
  from: number
}