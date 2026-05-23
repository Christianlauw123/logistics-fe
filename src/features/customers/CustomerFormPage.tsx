import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { useCustomerCreateQuery, useCustomerUpdateQuery } from "../customers/customer.hooks";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "../../lib/utils";

export default function CustomerFormPage({ openMainAction, setOpenMainAction, mode, customer }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; customer: any }) {
    const [customerId, setCustomerId] = useState<string>("")
    const [loading, setLoading] = useState(false);

    const createCustomer = useCustomerCreateQuery();
    const updateCustomer = useCustomerUpdateQuery();
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && customer) {
            setCustomerId(customer.id?.toString() || "")
        } else {
            // Completely reset fields when user opens an "Add New" form
            setCustomerId("")
        }
    }, [mode, customer?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !customer?.id) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Customer ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            name: rawData.name as string,
            phone: rawData.phone as string | undefined,
            address: rawData.address as string | undefined
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createCustomer.mutate({ ...basePayload })
            } else if (mode === "edit") {
                await updateCustomer.mutate({ id: customer?.id, payload: basePayload })
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Customer</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-medium">Customer Name</label>
                        <Input id="name" defaultValue={customer?.name || ""} name="name" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="phone" className="text-xs font-medium">Phone</label>
                        <Input id="phone" defaultValue={customer?.phone || ""} name="phone" placeholder="e.g. 123-456-7890" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="address" className="text-xs font-medium">Address</label>
                        <Input id="address" defaultValue={customer?.address || ""} name="address" placeholder="e.g. 123 Main St" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpenMainAction(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}