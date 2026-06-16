import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCustomersQuery } from "../customers/customer.hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";
import { useTripPriceCreateQuery, useTripPriceUpdateQuery } from "./tripPrice.hooks";
import type { CustomerFilters } from "../customers/customer.api";
import type { SubDistrictFilters } from "../sub-districts/subDistrict.api";
import { useSubDistrictsQuery } from "../sub-districts/subDistrict.hooks";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Loader2 } from "lucide-react";

export default function TripPriceFormPage({ openMainAction, setOpenMainAction, mode, tripPrice }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; tripPrice: any }) {
    const [tripPriceId, setTripPriceId] = useState<string>("")
    const [customerId, setCustomerId] = useState<string>("")
    const [originSubDistrictId, setOriginSubDistrictId] = useState<string>("")
    const [destinationSubDistrictId, setDestinationSubDistrictId] = useState<string>("")
    const [tripPriceAmount, setTripPriceAmount] = useState<string>("");
    const [tripPriceWeight, setTripPriceWeight] = useState<string>("");

    const [customerSearch, setCustomerSearch] = useState<CustomerFilters>({})
    const [customerKeywordSearch, setCustomerKeywordSearch] = useState<string>("")
    const [originSubDistrictSearch, setOriginSubDistrictSearch] = useState<SubDistrictFilters>({})
    const [originSubDistrictKeywordSearch, setOriginSubDistrictKeywordSearch] = useState<string>("")
    const [destinationSubDistrictSearch, setDestinationSubDistrictSearch] = useState<SubDistrictFilters>({})
    const [destinationSubDistrictKeywordSearch, setDestinationSubDistrictKeywordSearch] = useState<string>("")

    const [loading, setLoading] = useState(false);

    const createTripPrice = useTripPriceCreateQuery();
    const updateTripPrice = useTripPriceUpdateQuery();

    // Fetch Query
    const { data: customerData, isLoading: customerLoading } = useCustomersQuery(customerSearch);
    const { data: originSubDistrictData, isLoading: originSubDistrictLoading } = useSubDistrictsQuery(originSubDistrictSearch);
    const { data: destinationSubDistrictData, isLoading: destinationSubDistrictLoading } = useSubDistrictsQuery(destinationSubDistrictSearch);

    const customerOptions = customerData?.data || []
    const originSubDistrictOptions = originSubDistrictData?.data || []
    const destinationSubDistrictOptions = destinationSubDistrictData?.data || []

    
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

    // Dropdown Search Handlers
    useEffect(() => {
        const timer = setTimeout(() => {
            if (customerKeywordSearch) setCustomerSearch({ search: customerKeywordSearch })
            if (originSubDistrictKeywordSearch) setOriginSubDistrictSearch({ search: originSubDistrictKeywordSearch })
            if (destinationSubDistrictKeywordSearch) setDestinationSubDistrictSearch({ search: destinationSubDistrictKeywordSearch })
        }, 400)
        return () => clearTimeout(timer)
    }, [customerKeywordSearch, originSubDistrictKeywordSearch, destinationSubDistrictKeywordSearch])

    function clearData(){
        setTripPriceId("")
        setCustomerId("")
        setOriginSubDistrictId("")
        setDestinationSubDistrictId("")
        setTripPriceAmount("")
        setTripPriceWeight("")
    }
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && tripPrice) {
            setTripPriceId(tripPrice.id?.toString() || "")
            setCustomerId(tripPrice.customer_id?.toString() || "")
            setOriginSubDistrictId(tripPrice.origin_sub_district_id?.toString() || "")
            setDestinationSubDistrictId(tripPrice.dest_sub_district_id?.toString() || "")
            setTripPriceAmount(tripPrice.base_price?.toString() || "")
            setTripPriceWeight(tripPrice.weight_category?.toString() || "")

            if (tripPrice.customer_id) setCustomerSearch({ id: tripPrice.customer_id })
            if (tripPrice.origin_sub_district_id) setOriginSubDistrictSearch({ id: tripPrice.origin_sub_district_id })
            if (tripPrice.dest_sub_district_id) setDestinationSubDistrictSearch({ id: tripPrice.dest_sub_district_id })

        } else {
            // Completely reset fields when user opens an "Add New" form
            clearData()
        }
    }, [mode, tripPrice?.id])


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !tripPriceId) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Trip Price ID tidak ditemukan")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            customer_id: customerId as string,
            origin_sub_district_id: originSubDistrictId as string,
            dest_sub_district_id: destinationSubDistrictId as string,
            base_price: Number(rawData.base_price) ?? Number(tripPriceAmount),
            weight_category: Number(rawData.weight_category) ?? Number(tripPriceWeight)
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createTripPrice.mutateAsync({ ...basePayload })
            } else if (mode === "edit") {
                await updateTripPrice.mutateAsync({ id: tripPrice?.id, payload: basePayload })
            }
            clearData();
            setOpenMainAction(false); // Close dialog
        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={openMainAction} onOpenChange={setOpenMainAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Harga Trip</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
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
                                if (id) setCustomerId(id.toString())
                                else setCustomerId("");
                                setCustomerKeywordSearch("");
                            }}
                        >
                            <ComboboxInput placeholder="Pilih Pelanggan" value={getCustomerDisplayValue()}/>
                            <ComboboxContent>
                                {customerLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mencari di database...
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
                            <ComboboxInput placeholder="Pilih wilayah asal" value={getOriginSubDistrictDisplayValue()}/>
                            <ComboboxContent>
                                {originSubDistrictLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mencari di database...
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
                            <ComboboxInput placeholder="Pilih wilayah tujuan" value={getDestinationSubDistrictDisplayValue()}/>
                            <ComboboxContent>
                                {destinationSubDistrictLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mencari di database...
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
                        <label htmlFor="base_price" className="text-xs font-medium">Harga Dasar</label>
                        <Input id="base_price" value={Number.parseFloat(tripPriceAmount).toString()} onChange={(e) => setTripPriceAmount(e.target.value)} name="base_price" type="number" placeholder="e.g. 1000" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="weight_category" className="text-xs font-medium">Kategori Berat (kg)</label>
                        <Input id="weight_category" value={Number.parseFloat(tripPriceWeight).toString()} onChange={(e) => setTripPriceWeight(e.target.value)} name="weight_category" type="number" placeholder="e.g. 1000" required />
                    </div>
                    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpenMainAction(false)}>Batal</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Menyimpan..." : "Simpan"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}