import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "../../lib/utils";
import { useBankAccountCreateQuery, useBankAccountUpdateQuery } from "./bankAccount.hooks";

export default function BankAccountFormPage({ openMainAction, setOpenMainAction, mode, bankAccount }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; bankAccount: any }) {
    const [bankAccountId, setBankAccountId] = useState<string>("")
    const [loading, setLoading] = useState(false);

    const createBankAccount = useBankAccountCreateQuery();
    const updateBankAccount = useBankAccountUpdateQuery();
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && bankAccount) {
            setBankAccountId(bankAccount.id?.toString() || "")
        } else {
            // Completely reset fields when user opens an "Add New" form
            setBankAccountId("")
        }
    }, [mode, bankAccount?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !bankAccount?.id) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Bank Account ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            bank_name: rawData.bank_name as string | undefined,
            account_identifier_number: rawData.account_identifier_number as string,
            account_number: rawData.account_number as string | undefined,
            account_name: rawData.account_name as string | undefined
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createBankAccount.mutate({ ...basePayload })
            } else if (mode === "edit") {
                await updateBankAccount.mutate({ id: bankAccount?.id, payload: basePayload })
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
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Bank Account</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="bank_name" className="text-xs font-medium">Bank Name</label>
                        <Input id="bank_name" defaultValue={bankAccount?.bank_name || ""} name="bank_name" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_identifier_number" className="text-xs font-medium">Account Identifier Number</label>
                        <Input id="account_identifier_number" defaultValue={bankAccount?.account_identifier_number || ""} name="account_identifier_number" placeholder="e.g. 123456789" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_number" className="text-xs font-medium">Account Number</label>
                        <Input id="account_number" defaultValue={bankAccount?.account_number || ""} name="account_number" placeholder="e.g. 987654321" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_name" className="text-xs font-medium">Account Name</label>
                        <Input id="account_name" defaultValue={bankAccount?.account_name || ""} name="account_name" placeholder="e.g. John Doe" />
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