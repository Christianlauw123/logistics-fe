import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useCustomersQuery } from "../customers/customer.hooks";
import { useBankAccountsQuery } from "../bank-accounts/bankAccount.hooks";
import { useSubDistrictsQuery } from "../sub-districts/subDistrict.hooks";
import { useVehiclesQuery } from "../vehicles/vehicle.hooks";
import { Loader2 } from "lucide-react";
import type { SubDistrictFilters } from "../sub-districts/subDistrict.api";
import type { CustomerFilters } from "../customers/customer.api";
import type { VehicleFilters } from "../vehicles/vehicle.api";
import type { BankAccountFilters } from "../bank-accounts/bankAccount.api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";
import { createTransaction, updateTransaction } from "./transaction.hooks";

export default function TransactionFormPage({ openMainAction, setOpenMainAction, mode, transaction }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; transaction: any }) {
    const [customerKeywordSearch, setCustomerKeywordSearch] = useState<string>("")
    const [originSubDistrictKeywordSearch, setOriginSubDistrictKeywordSearch] = useState<string>("")
    const [destinationSubDistrictKeywordSearch, setDestinationSubDistrictKeywordSearch] = useState<string>("")
    const [vehicleKeywordSearch, setVehicleKeywordSearch] = useState<string>("")
    const [bankAccountKeywordSearch, setBankAccountKeywordSearch] = useState<string>("")
    
    const [customerSearch, setCustomerSearch] = useState<CustomerFilters>({})
    const [subOriginDistrictSearch, setOriginSubDistrictSearch] = useState<SubDistrictFilters>({})
    const [subDestinationDistrictSearch, setDestinationSubDistrictSearch] = useState<SubDistrictFilters>({})
    const [vehicleSearch, setVehicleSearch] = useState<VehicleFilters>({})
    const [bankAccountSearch, setBankAccountSearch] = useState<BankAccountFilters>({})

    // Fetch Query
    const { data: customerData, isLoading: customerLoading } = useCustomersQuery(customerSearch);
    const { data: originSubDistrictData, isLoading: originSubDistrictLoading } = useSubDistrictsQuery(subOriginDistrictSearch);
    const { data: destinationSubDistrictData, isLoading: destinationSubDistrictLoading } = useSubDistrictsQuery(subDestinationDistrictSearch);
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
    const [transactionItems, setTransactionItems] = useState<string>("")
    const [destAddress, setDestAddress] = useState<string>("")
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
            const selected = originSubDistrictOptions.find((o) => o.id.toString() === originSubDistrictId.toString());
            return selected ? `${selected.name} - ${selected.district.name}` : "";
        }
        return "";
    };
    const getDestinationSubDistrictDisplayValue = () => {
        if (destinationSubDistrictKeywordSearch) return destinationSubDistrictKeywordSearch;
        if (!destinationSubDistrictId) return "";
        const selected = destinationSubDistrictOptions.find((d) => d.id.toString() === destinationSubDistrictId.toString());
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
            if (customerKeywordSearch) setCustomerSearch({ search: customerKeywordSearch })
            if (originSubDistrictKeywordSearch) setOriginSubDistrictSearch({ search: originSubDistrictKeywordSearch })
            if (destinationSubDistrictKeywordSearch) setDestinationSubDistrictSearch({ search: destinationSubDistrictKeywordSearch })
            if (vehicleKeywordSearch) setVehicleSearch({ search: vehicleKeywordSearch })
            if (bankAccountKeywordSearch) setBankAccountSearch({ search: bankAccountKeywordSearch })
        }, 400)
        return () => clearTimeout(timer)
    }, [customerKeywordSearch, originSubDistrictKeywordSearch, destinationSubDistrictKeywordSearch, vehicleKeywordSearch, bankAccountKeywordSearch])

    // Add Edit
    useEffect(() => {
        if (mode === "edit" && transaction) {
            setCustomerId(transaction.customer_id?.toString() || "")
            setOriginSubDistrictId(transaction.origin_sub_district_id?.toString() || "")
            setDestinationSubDistrictId(transaction.dest_sub_district_id?.toString() || "")
            setVehicleId(transaction.vehicle_id?.toString() || "")
            setBankAccountId(transaction.bank_account_id?.toString() || "")
            setTransactionCapacity(transaction.transaction_capacity || 0)
            setTransactionItems(transaction.transaction_items || "")
            setDestAddress(transaction.dest_address || "")
            setDoNumber(transaction.do_number || "")
            setDoActualDate(transaction.do_actual_date || "")
            setNote(transaction.note || "")

            if (transaction.customer_id) setCustomerSearch({ id: transaction.customer_id })
            if (transaction.origin_sub_district_id) setOriginSubDistrictSearch({ id: transaction.origin_sub_district_id })
            if (transaction.dest_sub_district_id) setDestinationSubDistrictSearch({ id: transaction.dest_sub_district_id })
            if (transaction.vehicle_id) setVehicleSearch({ id: transaction.vehicle_id })
            if (transaction.bank_account_id) setBankAccountSearch({ id: transaction.bank_account_id })
        } else {
            // Completely reset fields when user opens an "Add New" form
            setCustomerId("")
            setOriginSubDistrictId("")
            setDestinationSubDistrictId("")
            setVehicleId("")
            setBankAccountId("")
            setTransactionCapacity(0)
            setTransactionItems("")
            setDestAddress("")
            setDoNumber("")
            setDoActualDate("")
            setNote("")
        }
    }, [mode, transaction?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !transaction?.id) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Transaction ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            do_number: rawData.do_number as string, // Ensure 'id' is available in this scope
            do_actual_date: rawData.do_actual_date as string,
            note: rawData.note as string,
            amount: Number(rawData.amount), 
			transaction_capacity: Number(rawData.transaction_capacity),
			transaction_items: (rawData.transaction_items as string),
			dest_address: (rawData.dest_address as string),
			customer_id: customerId,
			origin_sub_district_id: originSubDistrictId,
			dest_sub_district_id: destinationSubDistrictId,
			vehicle_id: vehicleId,
			bank_account_id: bankAccountId,
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createMainTransaction.mutate({ payload: basePayload })
            } else if (mode === "edit") {
                await updateMainTransaction.mutate({ transactionId: transaction?.id, payload: basePayload })
            }
            setOpenMainAction(false); // Close dialog
        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={openMainAction} onOpenChange={setOpenMainAction}>
            <DialogContent className="w-[95%] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Transaction Main</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="do_number" className="text-xs font-medium">DO Number</label>
                        <Input id="do_number" defaultValue={doNumber || ""} name="do_number" placeholder="e.g. Server hosting fee" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="do_actual_date" className="text-xs font-medium">DO Actual Date</label>
                        <Input id="do_actual_date" defaultValue={doActualDate || ""} name="do_actual_date" type="date" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="dest_address" className="text-xs font-medium">Alamat Tujuan</label>
                        <Input id="dest_address" defaultValue={destAddress || ""} name="dest_address" placeholder="e.g. Server hosting fee" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="transaction_capacity" className="text-xs font-medium">Kapasitas</label>
                        <Input id="transaction_capacity" defaultValue={transactionCapacity || ""} name="transaction_capacity" type="number" placeholder="e.g. 0.1" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="transaction_items" className="text-xs font-medium">Jenis Barang</label>
                        <Input id="transaction_items" defaultValue={transactionItems || ""} name="transaction_items" placeholder="e.g. Server hosting fee" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="purpose" className="text-xs font-medium">Customer</label>
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
                                if (id) setCustomerId(id.toString())
                                else setCustomerId("");
                                setCustomerKeywordSearch("");
                            }}
                        >
                            <ComboboxInput placeholder="Select a customer" value={getCustomerDisplayValue()}/>
                            <ComboboxContent>
                                {customerLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Searching database...
                                    </div>
                                )}
                                
                                {!customerLoading && customerOptions.length === 0 && (
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
                                    (b) => b.id.toString() === value.toString()
                                );
                                
                                if (isJustSelected) {
                                    return;
                                }

                                setOriginSubDistrictKeywordSearch(value);
                            }}
                            onValueChange={(id) => {
                                if (id) setOriginSubDistrictId(id.toString())
                                else setOriginSubDistrictId("");
                                setOriginSubDistrictKeywordSearch("")
                            }}
                        >
                            <ComboboxInput placeholder="Select a origin sub district" value={getOriginSubDistrictDisplayValue()}/>
                            <ComboboxContent>
                                {originSubDistrictLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Searching database...
                                    </div>
                                )}
                                
                                {!originSubDistrictLoading && originSubDistrictOptions.length === 0 && (
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
                                    (b) => b.id.toString() === value.toString()
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
                                    Searching database...
                                    </div>
                                )}
                                
                                {!destinationSubDistrictLoading && destinationSubDistrictOptions.length === 0 && (
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
                        <label htmlFor="purpose" className="text-xs font-medium">Bank</label>
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
                                    Searching database...
                                    </div>
                                )}
                                
                                {!bankLoading && bankAccountOptions.length === 0 && (
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
                                    Searching database...
                                    </div>
                                )}
                                
                                {!vehicleLoading && vehicleOptions.length === 0 && (
                                    <ComboboxEmpty>No items found.</ComboboxEmpty>
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
                    <div className="space-y-1">
                        <label htmlFor="note" className="text-xs font-medium">Note</label>
                        <Input id="note" defaultValue={note || ""} name="note" placeholder="e.g. Server hosting fee" required />
                    </div>
                    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpenMainAction(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Save Detail"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}