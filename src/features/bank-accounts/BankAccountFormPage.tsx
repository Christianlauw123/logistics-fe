import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";
import { useBankAccountCreateQuery, useBankAccountUpdateQuery } from "./bankAccount.hooks";

export default function BankAccountFormPage({ openMainAction, setOpenMainAction, mode, bankAccount }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; bankAccount: any }) {
    const [bankAccountId, setBankAccountId] = useState<string>("")
    const [bankName, setBankName] = useState<string>("")
    const [accountIdentifierNumber, setAccountIdentifierNumber] = useState<string>("")
    const [accountNumber, setAccountNumber] = useState<string>("")
    const [accountName, setAccountName] = useState<string>("")
    const [loading, setLoading] = useState(false);

    const createBankAccount = useBankAccountCreateQuery();
    const updateBankAccount = useBankAccountUpdateQuery();
    // Add Edit
    useEffect(() => {
        if (mode === "edit" && bankAccount) {
            setBankAccountId(bankAccount.id?.toString() || "")
            setBankName(bankAccount.bank_name || "")
            setAccountIdentifierNumber(bankAccount.account_identifier_number || "")
            setAccountNumber(bankAccount.account_number || "")
            setAccountName(bankAccount.account_name || "")
        } else {
            // Completely reset fields when user opens an "Add New" form
            setBankAccountId("")
            setBankName("")
            setAccountIdentifierNumber("")
            setAccountNumber("")
            setAccountName("")
        }
    }, [mode, bankAccount?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !bankAccountId) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("Bank Account tidak ditemukan")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            bank_name: rawData.bank_name as string ?? bankName,
            account_identifier_number: rawData.account_identifier_number as string ?? accountIdentifierNumber,
            account_number: rawData.account_number as string | undefined ?? accountNumber,
            account_name: rawData.account_name as string | undefined ?? accountName
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                await createBankAccount.mutateAsync({ ...basePayload })
            } else if (mode === "edit") {
                await updateBankAccount.mutateAsync({ id: bankAccount?.id, payload: basePayload })
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
            <DialogContent className="w-[95%] max-w-[425px] max-h-[90vh] overflow-y-auto rounded-lg sm:w-full">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Akun Bank</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="bank_name" className="text-xs font-medium">Nama Bank</label>
                        <Input id="bank_name" value={bankName} onChange={(e) => setBankName(e.target.value)}  name="bank_name" placeholder="e.g. John Doe"/>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_identifier_number" className="text-xs font-medium">Nomor Unik Akun</label>
                        <Input id="account_identifier_number" value={accountIdentifierNumber} onChange={(e) => setAccountIdentifierNumber(e.target.value)} name="account_identifier_number" placeholder="e.g. 123456789" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_number" className="text-xs font-medium">Nomor Akun</label>
                        <Input id="account_number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} name="account_number" placeholder="e.g. 987654321" />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="account_name" className="text-xs font-medium">Nama Akun</label>
                        <Input id="account_name" value={accountName} onChange={(e) => setAccountName(e.target.value)} name="account_name" placeholder="e.g. John Doe" />
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