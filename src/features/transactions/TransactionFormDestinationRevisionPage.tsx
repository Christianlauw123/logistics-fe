import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { errorHandler } from "@/lib/utils";
import { updateTransactionDestination } from "./transaction.hooks";
import type { TripPriceFilters } from "../trip-prices/tripPrice.api";
import { useTripPriceGetAllowedDistrictsQuery } from "../trip-prices/tripPrice.hooks";

export default function TransactionFormDestinationRevisionPage({ openRevisionDestinationAction, setOpenRevisionDestinationAction, transaction }: { openRevisionDestinationAction: boolean; setOpenRevisionDestinationAction: (openRevisionDestinationAction: boolean) => void; transaction: any; }) {

    const [destinationSubDistrictKeywordSearch, setDestinationSubDistrictKeywordSearch] = useState<string>("")
    const [subDestinationDistrictSearch, setDestinationSubDistrictSearch] = useState<TripPriceFilters>({})

    // Fetch Query
    const { data: destinationSubDistrictData, isLoading: destinationSubDistrictLoading } = useTripPriceGetAllowedDistrictsQuery({ filters: subDestinationDistrictSearch });
    const destinationSubDistrictOptions = destinationSubDistrictData?.data || []

    // Set Value for Form
    const [customerId, setCustomerId] = useState<string>("")
    const [originSubDistrictId, setOriginSubDistrictId] = useState<string>("")
    const [customerName, setCustomerName] = useState<string>("")
    const [originSubDistrictName, setOriginSubDistrictName] = useState<string>("")
    const [destinationSubDistrictId, setDestinationSubDistrictId] = useState<string>("")

    // Displaying Value Handler
    const getDestinationSubDistrictDisplayValue = () => {
        if (destinationSubDistrictKeywordSearch) return destinationSubDistrictKeywordSearch;
        if (!destinationSubDistrictId) return "";
        const selected = destinationSubDistrictOptions.find((d: any) => d.id.toString() === destinationSubDistrictId.toString());
        return selected ? `${selected.name} - ${selected.district.name}` : "";
    };

    const [loading, setLoading] = useState(false);

    // Function API
    const updateRevisionDestinationTransaction = updateTransactionDestination();

    // Dropdown Search Handlers
    useEffect(() => {
        const timer = setTimeout(() => {
            if (destinationSubDistrictKeywordSearch) setDestinationSubDistrictSearch({ customer_id: customerId, origin_sub_district_id: originSubDistrictId, search: destinationSubDistrictKeywordSearch })
            if (!destinationSubDistrictKeywordSearch && customerId && originSubDistrictId) setDestinationSubDistrictSearch({ customer_id: customerId, origin_sub_district_id: originSubDistrictId })
        }, 400)
        return () => clearTimeout(timer)
    }, [destinationSubDistrictKeywordSearch])

    // Add Edit
    useEffect(() => {
        if (transaction) {
            setTransaction(transaction)
        } else {
            // Completely reset fields when user opens an "Add New" form
            setTransaction(null)
        }
    }, [transaction?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);

        // 1. Gather all inputs automatically via the form DOM element
        const basePayload = { 
            revision_dest_sub_district_id: destinationSubDistrictId
        }

        try {
            const response = await updateRevisionDestinationTransaction.mutateAsync({ transactionId: transaction?.id, payload: basePayload })
            setTransaction(response.data) // Update form with response after update performed, so user can see the updated value immediately after update without reopening the form
            setOpenRevisionDestinationAction(false); // Close dialog
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
            setCustomerName(transaction.customer_name?.toString() || "")
            setOriginSubDistrictId(transaction.origin_sub_district_id?.toString() || "")
            setOriginSubDistrictName(transaction.origin_district?.toString() || "")
            setDestinationSubDistrictId(transaction.dest_sub_district_id?.toString() || "")
            if (transaction.dest_sub_district_id) setDestinationSubDistrictSearch({ customer_id: transaction.customer_id, origin_sub_district_id: transaction.origin_sub_district_id })
        }
        else{
            setCustomerId("")
            setOriginSubDistrictId("")
            setDestinationSubDistrictId("")
            setCustomerName("")
            setOriginSubDistrictName("")
        }
    }

    return (
        <Dialog open={openRevisionDestinationAction} onOpenChange={setOpenRevisionDestinationAction}>
            <DialogContent className="w-[95%] max-w-[425px] max-h-[85vh] overflow-y-auto rounded-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>Edit Tujuan Trip</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label className="text-s font-medium">Nama Pelanggan: {customerName}</label>
                    </div>
                    <div className="space-y-1">
                        <label className="text-s font-medium">Asal: {originSubDistrictName}</label>
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
                    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpenRevisionDestinationAction(false)}>Batal</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan Detail"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}