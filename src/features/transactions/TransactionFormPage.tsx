import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useCustomersQuery } from "../customers/customer.hooks";
import { useBankAccountsQuery } from "../bank-accounts/bankAccount.hooks";
import { useVehiclesQuery } from "../vehicles/vehicle.hooks";
import { Loader2 } from "lucide-react";

import type { CustomerFilters } from "../customers/customer.api";
import type { VehicleFilters } from "../vehicles/vehicle.api";
import type { BankAccountFilters } from "../bank-accounts/bankAccount.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";
import { createTransaction, updateTransaction } from "./transaction.hooks";
import type { TripPriceFilters } from "../trip-prices/tripPrice.api";
import { useTripPriceGetAllowedDistrictsQuery } from "../trip-prices/tripPrice.hooks";
import { useAuthStore } from "../auth/auth.store";

export default function TransactionFormPage({ openMainAction, setOpenMainAction, mode, transaction }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; transaction: any }) {
    const user = useAuthStore((state) => state.user)

    const [customerKeywordSearch, setCustomerKeywordSearch] = useState<string>("")
    const [originSubDistrictKeywordSearch, setOriginSubDistrictKeywordSearch] = useState<string>("")
    const [destinationSubDistrictKeywordSearch, setDestinationSubDistrictKeywordSearch] = useState<string>("")
    const [vehicleKeywordSearch, setVehicleKeywordSearch] = useState<string>("")
    const [bankAccountKeywordSearch, setBankAccountKeywordSearch] = useState<string>("")
    
    const [customerSearch, setCustomerSearch] = useState<CustomerFilters>({})
    const [subOriginDistrictSearch, setOriginSubDistrictSearch] = useState<TripPriceFilters>({})
    const [subDestinationDistrictSearch, setDestinationSubDistrictSearch] = useState<TripPriceFilters>({})
    const [vehicleSearch, setVehicleSearch] = useState<VehicleFilters>({})
    const [bankAccountSearch, setBankAccountSearch] = useState<BankAccountFilters>({})

    // Fetch Query
    const { data: customerData, isLoading: customerLoading } = useCustomersQuery(customerSearch);
    const { data: originSubDistrictData, isLoading: originSubDistrictLoading } = useTripPriceGetAllowedDistrictsQuery({ filters: subOriginDistrictSearch });
    const { data: destinationSubDistrictData, isLoading: destinationSubDistrictLoading } = useTripPriceGetAllowedDistrictsQuery({ filters: subDestinationDistrictSearch });
    const { data: vehicleData, isLoading: vehicleLoading } = useVehiclesQuery(vehicleSearch);
    const { data: bankAccountData, isLoading: bankLoading } = useBankAccountsQuery(bankAccountSearch);

    const customerOptions = customerData?.data || []
    const originSubDistrictOptions = originSubDistrictData?.data || []
    const destinationSubDistrictOptions = destinationSubDistrictData?.data || []
    const vehicleOptions = vehicleData?.data || []
    const bankAccountOptions = bankAccountData?.data || []

    // Set Value for Form
    const [customerId, setCustomerId] = useState<string>("")
    const [originSubDistrictId, setOriginSubDistrictId] = useState<string>("")
    const [destinationSubDistrictId, setDestinationSubDistrictId] = useState<string>("")
    const [vehicleId, setVehicleId] = useState<string>("")
    const [bankAccountId, setBankAccountId] = useState<string>("")
    const [transactionCapacity, setTransactionCapacity] = useState<number>(0)
    // const [transactionItems, setTransactionItems] = useState<string>("")
    // const [destAddress, setDestAddress] = useState<string>("")
    const [doNumber, setDoNumber] = useState<string>("")
    const [doActualDate, setDoActualDate] = useState<string>("")
    const [note, setNote] = useState<string>("")

    // Displaying Value Handler
    const getBankAccountDisplayValue = () => {
        if (bankAccountKeywordSearch) return bankAccountKeywordSearch;
        if (!bankAccountId) return "";
        
        const selected = bankAccountOptions.find((b) => b.id.toString() === bankAccountId.toString());
        return selected ? `${selected.bank_name} - ${selected.account_identifier_number}` : "";
    };
    const getOriginSubDistrictDisplayValue = () => {
        if (originSubDistrictKeywordSearch) return originSubDistrictKeywordSearch;
        if (originSubDistrictId){
            const selected = originSubDistrictOptions.find((o: any) => o.id.toString() === originSubDistrictId.toString());
            return selected ? `${selected.name} - ${selected.district.name}` : "";
        }
        return "";
    };
    const getDestinationSubDistrictDisplayValue = () => {
        if (destinationSubDistrictKeywordSearch) return destinationSubDistrictKeywordSearch;
        if (!destinationSubDistrictId) return "";
        const selected = destinationSubDistrictOptions.find((d: any) => d.id.toString() === destinationSubDistrictId.toString());
        return selected ? `${selected.name} - ${selected.district.name}` : "";
    };
    const getCustomerDisplayValue = () => {
        if (customerKeywordSearch) return customerKeywordSearch;
        if (!customerId) return "";
        const selected = customerOptions.find((c) => c.id.toString() === customerId.toString());
        return selected ? selected.name : "";
    };

    const getVehicleDisplayValue = () => {
        if (vehicleKeywordSearch) return vehicleKeywordSearch;
        if (!vehicleId) return "";
        const selected = vehicleOptions.find((v) => v.id.toString() === vehicleId.toString());
        return selected ? selected.plate_number : "";
    };

    const [loading, setLoading] = useState(false);

    // Function API
    const updateMainTransaction = updateTransaction();
    const createMainTransaction = createTransaction();
    // Dropdown Search Handlers
    useEffect(() => {
        const timer = setTimeout(() => {
            if (customerKeywordSearch)setCustomerSearch({ search: customerKeywordSearch })

            if (originSubDistrictKeywordSearch) setOriginSubDistrictSearch({ customer_id: customerId, search: originSubDistrictKeywordSearch })
            if (!originSubDistrictKeywordSearch && customerId) setOriginSubDistrictSearch({ customer_id: customerId })

            if (destinationSubDistrictKeywordSearch) setDestinationSubDistrictSearch({ customer_id: customerId, origin_sub_district_id: originSubDistrictId, search: destinationSubDistrictKeywordSearch })
            if (!destinationSubDistrictKeywordSearch && customerId && originSubDistrictId) setDestinationSubDistrictSearch({ customer_id: customerId, origin_sub_district_id: originSubDistrictId })

            if (vehicleKeywordSearch) setVehicleSearch({ search: vehicleKeywordSearch, is_active: true })
            if (bankAccountKeywordSearch) setBankAccountSearch({ search: bankAccountKeywordSearch })
        }, 400)
        return () => clearTimeout(timer)
    }, [customerKeywordSearch, originSubDistrictKeywordSearch, destinationSubDistrictKeywordSearch, vehicleKeywordSearch, bankAccountKeywordSearch])

    // Add Edit
    useEffect(() => {
        if (mode === "edit" && transaction) {
            setTransaction(transaction)
        } else {
            // Completely reset fields when user opens an "Add New" form
            setTransaction(null)
        }
    }, [mode, transaction?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !transaction?.id) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Transaction tidak ditemukan")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        console.log(transaction);
        console.log(transactionCapacity);
        console.log(rawData);
        const capacity = (rawData.transaction_capacity && !isNaN(Number(rawData.transaction_capacity))) ? Number(rawData.transaction_capacity) : Number(transactionCapacity || 0)
        const basePayload = { 
            do_number: rawData.do_number as string ?? doNumber, // Ensure 'id' is available in this scope
            do_actual_date: rawData.do_actual_date as string ?? doActualDate,
            note: rawData.note as string ?? note,
			transaction_capacity: capacity,
			// transaction_items: (rawData.transaction_items as string) ?? transactionItems,
			// dest_address: (rawData.dest_address as string) ?? destAddress,
			customer_id: customerId,
			origin_sub_district_id: originSubDistrictId,
			dest_sub_district_id: destinationSubDistrictId,
			vehicle_id: vehicleId,
			bank_account_id: bankAccountId,
        }
        console.log(basePayload);

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                await createMainTransaction.mutateAsync({ payload: basePayload })
                setTransaction(null)
            } else if (mode === "edit") {
                
                const response = await updateMainTransaction.mutateAsync({ transactionId: transaction?.id, payload: basePayload })
                setTransaction(response) // Update form with response after update performed, so user can see the updated value immediately after update without reopening the form
            }
            setOpenMainAction(false); // Close dialog

        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    // Goal set when initialize and when update performed, so user can see the updated value immediately after update without reopening the form
    function setTransaction(transaction: any | null){
        if (transaction){
            setCustomerId(transaction.customer_id?.toString() || "")
            setOriginSubDistrictId(transaction.origin_sub_district_id?.toString() || "")
            setDestinationSubDistrictId(transaction.dest_sub_district_id?.toString() || "")
            setVehicleId(transaction.vehicle_id?.toString() || "")
            setBankAccountId(transaction.bank_account_id?.toString() || "")
            setTransactionCapacity(Number(transaction.transaction_capacity))
            // setTransactionItems(transaction.transaction_items || "")
            // setDestAddress(transaction.dest_address || "")
            setDoNumber(transaction.do_number || "")
            setDoActualDate(transaction.do_actual_date || "")
            setNote(transaction.note || "")

            if (transaction.customer_id) setCustomerSearch({ id: transaction.customer_id })
            if (transaction.origin_sub_district_id) setOriginSubDistrictSearch({ customer_id: transaction.customer_id })
            if (transaction.dest_sub_district_id) setDestinationSubDistrictSearch({ customer_id: transaction.customer_id, origin_sub_district_id: transaction.origin_sub_district_id })
            if (transaction.vehicle_id) setVehicleSearch({ id: transaction.vehicle_id })
            if (transaction.bank_account_id) setBankAccountSearch({ id: transaction.bank_account_id })
        }
        else{
            setCustomerId("")
            setOriginSubDistrictId("")
            setDestinationSubDistrictId("")
            setVehicleId("")
            setBankAccountId("")
            setTransactionCapacity(0)
            // setTransactionItems("")
            // setDestAddress("")
            setDoNumber("")
            setDoActualDate("")
            setNote("")
        }
    }

    return (
        <Dialog open={openMainAction} onOpenChange={setOpenMainAction}>
            <DialogContent className="w-[95%] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Transaksi</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {user?.role?.name !== "Staff" && (
                        <>
                            <div className="space-y-1">
                                <label htmlFor="do_number" className="text-xs font-medium">No Do</label>
                                <Input id="do_number" value={doNumber || ""}  onChange={(e) => setDoNumber(e.target.value)} name="do_number" placeholder="e.g. Server hosting fee" />
                            </div>
                            <div className="space-y-1">
                                <label htmlFor="do_actual_date" className="text-xs font-medium">Tanggal Actual DO</label>
                                <Input id="do_actual_date" value={doActualDate || ""} onChange={(e) => setDoActualDate(e.target.value)} name="do_actual_date" type="date" />
                            </div>
                        </>
                    )}

                    {/* <div className="space-y-1">
                        <label htmlFor="dest_address" className="text-xs font-medium">Alamat Tujuan</label>
                        <Input id="dest_address" value={destAddress || ""} onChange={(e) => setDestAddress(e.target.value)} name="dest_address" placeholder="e.g. Server hosting fee" />
                    </div> */}
                    {user?.role?.name !== "Operational" && (
                        <>
                        <div className="space-y-1">
                            <label htmlFor="transaction_capacity" className="text-xs font-medium">Isian (Kg)</label>
                            <Input id="transaction_capacity" value={Number(transactionCapacity)} onChange={(e) => setTransactionCapacity(Number(e.target.value))} name="transaction_capacity" type="number" placeholder="e.g. 1000" required />
                        </div>
                        {/* <div className="space-y-1">
                            <label htmlFor="transaction_items" className="text-xs font-medium">Jenis Barang</label>
                            <Input id="transaction_items" value={transactionItems || ""} name="transaction_items" placeholder="e.g. Server hosting fee" />
                        </div> */}
                        <div className="space-y-1">
                            <label htmlFor="purpose" className="text-xs font-medium">Pelanggan</label>
                            <Combobox 
                                items={customerOptions}
                                value={customerId}
                                onInputValueChange={(value) => {
                                    const isJustSelected = customerOptions.some(
                                        (b) => b.id.toString() === value.toString()
                                    );
                                    
                                    if (isJustSelected) {
                                        return;
                                    }

                                    setCustomerKeywordSearch(value);
                                }}
                                onValueChange={(id) => {
                                    if (id) {
                                        setCustomerId(id.toString());
                                        setOriginSubDistrictSearch({ customer_id: id.toString() })
                                    } else {
                                        setCustomerId("");
                                        setOriginSubDistrictId("");
                                        setDestinationSubDistrictId("");
                                        setOriginSubDistrictSearch({})
                                        setDestinationSubDistrictSearch({})
                                    }
                                    setCustomerKeywordSearch("");
                                }}
                            >
                                <ComboboxInput placeholder="Select a customer" value={getCustomerDisplayValue()}/>
                                <ComboboxContent>
                                    {customerLoading && (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari database...
                                        </div>
                                    )}
                                    
                                    {!customerLoading && customerOptions.length === 0 && (
                                        <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    )}
                                    <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id.toString()}>
                                            {item.name}
                                        </ComboboxItem>
                                    )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="purpose" className="text-xs font-medium">Asal</label>
                            <Combobox 
                                items={originSubDistrictOptions}
                                value={originSubDistrictId}
                                onInputValueChange={(value) => {
                                    const isJustSelected = originSubDistrictOptions.some(
                                        (b: any) => b.id.toString() === value.toString()
                                    );
                                    
                                    if (isJustSelected) {
                                        return;
                                    }

                                    setOriginSubDistrictKeywordSearch(value);
                                }}
                                onValueChange={(id) => {
                                    if (id){
                                        setOriginSubDistrictId(id.toString())
                                        setDestinationSubDistrictSearch({ customer_id: customerId, origin_sub_district_id: id.toString() })
                                    }
                                    else{
                                        setOriginSubDistrictId("");
                                        setDestinationSubDistrictId("");
                                        setDestinationSubDistrictSearch({})
                                    }
                                    setOriginSubDistrictKeywordSearch("")
                                }}
                            >
                                <ComboboxInput placeholder="Select a origin sub district" value={getOriginSubDistrictDisplayValue()}/>
                                <ComboboxContent>
                                    {originSubDistrictLoading && (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari database...
                                        </div>
                                    )}
                                    
                                    {!originSubDistrictLoading && originSubDistrictOptions.length === 0 && (
                                        <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    )}
                                    <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id.toString()}>
                                            {item.name} - {item.district.name}
                                        </ComboboxItem>
                                    )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="purpose" className="text-xs font-medium">Tujuan</label>
                            <Combobox 
                                items={destinationSubDistrictOptions}
                                value={destinationSubDistrictId}
                                onInputValueChange={(value) => {
                                    const isJustSelected = destinationSubDistrictOptions.some(
                                        (b: any) => b.id.toString() === value.toString()
                                    );
                                    
                                    if (isJustSelected) {
                                        return;
                                    }

                                    setDestinationSubDistrictKeywordSearch(value);
                                }}
                                onValueChange={(id) => {
                                    if (id) setDestinationSubDistrictId(id.toString())
                                    else setDestinationSubDistrictId("");
                                    setDestinationSubDistrictKeywordSearch("");
                                }}
                            >
                                <ComboboxInput placeholder="Select a destination sub district" value={getDestinationSubDistrictDisplayValue()}/>
                                <ComboboxContent>
                                    {destinationSubDistrictLoading && (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari database...
                                        </div>
                                    )}
                                    
                                    {!destinationSubDistrictLoading && destinationSubDistrictOptions.length === 0 && (
                                        <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    )}
                                    <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id.toString()}>
                                            {item.name} - {item.district.name}
                                        </ComboboxItem>
                                    )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="purpose" className="text-xs font-medium">Akun Bank</label>
                            <Combobox 
                                items={bankAccountOptions}
                                value={bankAccountId}
                                onInputValueChange={(value) => {
                                    const isJustSelected = bankAccountOptions.some(
                                        (b) => b.id.toString() === value.toString()
                                    );
                                    
                                    if (isJustSelected) {
                                        return;
                                    }

                                    setBankAccountKeywordSearch(value);
                                }}
                                onValueChange={(id) => {
                                    if (id) setBankAccountId(id.toString())
                                    else setBankAccountId("");
                                    setBankAccountKeywordSearch("");
                                }}
                            >
                                <ComboboxInput placeholder="Select a bank account" value={getBankAccountDisplayValue()}/>
                                <ComboboxContent>
                                    {bankLoading && (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari database...
                                        </div>
                                    )}
                                    
                                    {!bankLoading && bankAccountOptions.length === 0 && (
                                        <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    )}
                                    <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id.toString()}>
                                            {item.bank_name} - {item.account_identifier_number}
                                        </ComboboxItem>
                                    )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                        <div className="space-y-1">
                            <label htmlFor="purpose" className="text-xs font-medium">Kendaraan</label>
                            <Combobox 
                                items={vehicleOptions}
                                value={vehicleId}
                                onInputValueChange={(value) => {
                                    const isJustSelected = vehicleOptions.some(
                                        (v) => v.id.toString() === value.toString()
                                    );
                                    
                                    if (isJustSelected) {
                                        return;
                                    }

                                    setVehicleKeywordSearch(value);
                                }}
                                onValueChange={(id) => {
                                    if (id) setVehicleId(id.toString())
                                    else setVehicleId("");
                                    setVehicleKeywordSearch("");
                                }}
                            >
                                <ComboboxInput placeholder="Select a vehicle" value={getVehicleDisplayValue()} />
                                <ComboboxContent>
                                    {vehicleLoading && (
                                        <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Mencari database...
                                        </div>
                                    )}
                                    
                                    {!vehicleLoading && vehicleOptions.length === 0 && (
                                        <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
                                    )}
                                    <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id.toString()}>
                                            {item.plate_number}
                                        </ComboboxItem>
                                    )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                        </div>
                     </>
                    )}
                    <div className="space-y-1">
                        <label htmlFor="note" className="text-xs font-medium">Note</label>
                        <Input id="note" value={note || ""} onChange={(e) => setNote(e.target.value)} name="note" placeholder="e.g. Server hosting fee" />
                    </div>
                    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpenMainAction(false)}>Batal</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Detail"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}