import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useVehicleCreateQuery, useVehicleUpdateQuery } from "../vehicles/vehicle.hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { errorHandler } from "@/lib/utils";

export default function VehicleFormPage({ openMainAction, setOpenMainAction, mode, vehicle }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; vehicle: any }) {
    const [vehicleId, setVehicleId] = useState<string>("")
    const [vehicleActive, setVehicleActive] = useState<boolean>(true)
    const [loading, setLoading] = useState(false);

    const createVehicle = useVehicleCreateQuery();
    const updateVehicle = useVehicleUpdateQuery();
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && vehicle) {
            setVehicleId(vehicle.id?.toString() || "")
            setVehicleActive(vehicle.is_active || false)
        } else {
            // Completely reset fields when user opens an "Add New" form
            setVehicleId("")
            setVehicleActive(true)
        }
    }, [mode, vehicle?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !vehicleId) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Vehicle ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            name: rawData.name as string | undefined,
            plate_number: rawData.plate_number as string,
            type: rawData.type as string | undefined,
            capacity: Number(rawData.capacity) || undefined,
            is_active: vehicleActive
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createVehicle.mutate({ ...basePayload })
            } else if (mode === "edit") {
                await updateVehicle.mutate({ id: vehicle?.id, payload: basePayload })
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
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Vehicle</DialogTitle>
                </DialogHeader>
                

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-medium">Name</label>
                        <Input id="name" defaultValue={vehicle?.name || ""} name="name" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="plate_number" className="text-xs font-medium">Plate Number</label>
                        <Input id="plate_number" defaultValue={vehicle?.plate_number || ""} name="plate_number" placeholder="e.g. ABC-123" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="type" className="text-xs font-medium">Type</label>
                        <Input id="type" defaultValue={vehicle?.type || ""} name="type" placeholder="e.g. Truck" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="capacity" className="text-xs font-medium">Capacity</label>
                        <Input id="capacity" defaultValue={vehicle?.capacity || ""} type="number" name="capacity" placeholder="e.g. 1000" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="vehicle-active">Status Vehicle</Label>
                        <Switch id="vehicle-active" checked={vehicleActive} onCheckedChange={setVehicleActive} />
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