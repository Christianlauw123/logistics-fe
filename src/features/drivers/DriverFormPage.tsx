import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useDriverCreateQuery, useDriverUpdateQuery } from "../drivers/driver.hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";

export default function DriverFormPage({ openMainAction, setOpenMainAction, mode, driver }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; driver: any }) {
    const [driverId, setDriverId] = useState<string>("")
    const [driverName, setDriverName] = useState<string>("")
    const [loading, setLoading] = useState(false);

    const createDriver = useDriverCreateQuery();
    const updateDriver = useDriverUpdateQuery();
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && driver) {
            setDriverId(driver.id?.toString() || "")
            setDriverName(driver.name)
        } else {
            // Completely reset fields when user opens an "Add New" form
            setDriverId("")
            setDriverName("")
        }
    }, [mode, driver?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !driverId) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Driver ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            name: rawData.name as string ?? driverName
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createDriver.mutateAsync({ ...basePayload })
            } else if (mode === "edit") {
                await updateDriver.mutateAsync({ id: driver?.id, payload: basePayload })
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
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Driver</DialogTitle>
                </DialogHeader>
                

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-medium">Nama</label>
                        <Input id="name" value={driverName} onChange={(e) => setDriverName(e.target.value)} name="name" placeholder="e.g. John Doe" required />
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