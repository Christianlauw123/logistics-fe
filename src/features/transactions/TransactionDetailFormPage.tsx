import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { createTransactionDetail, updateTransactionDetail } from "../transaction-details/transaction-detail.hooks"
import { errorHandler, formatCurrency } from "@/lib/utils"
import { Info } from "@/components/info"
import { CardContent } from "@/components/ui/card"

export default function TransactionDetailFormPage({ openDetailAction, setOpenDetailAction, mode, detailTransaction, transaction }: { openDetailAction: boolean; setOpenDetailAction: (openDetailAction: boolean) => void; mode: "add" | "edit"; detailTransaction: any; transaction: any}) {
    const { id } = useParams()
    const [detailAmount, setDetailAmount] = useState<string>("")
    const [detailPurpose, setDetailPurpose] = useState<string>("")
    const [detailNote, setDetailNote] = useState<string>("")
    const [totalUsage, setTotalUsage] = useState<number>(0)
    const [remainingUsage, setRemainingUsage] = useState<number>(0)

    const [loading, setLoading] = useState(false);


    const createDetail = createTransactionDetail();
    const updateDetail = updateTransactionDetail();

    // Transaction Detail mutation handlers
    // Transaction Detail data fetching and mutations
    async function handleDetailSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (!id){
            setLoading(false);
            setOpenDetailAction(false); 
            toast.error("Transaction ID tidak ditemukan")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            transactionId: id, // Ensure 'id' is available in this scope
            purpose: rawData.purpose as string ?? detailPurpose,
            note: rawData.note as string ?? detailNote,
            amount: Number(rawData.amount) ?? Number(detailAmount)
        };
        try {
            console.log(mode)
            if (mode === "add")
                await createDetail.mutateAsync(basePayload)
            else if (mode === "edit" && detailTransaction){
                const updatedPayload = {...basePayload, transactionDetailId: detailTransaction.id}
                await updateDetail.mutateAsync(updatedPayload)
            }
            setOpenDetailAction(false); // Close dialog
        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(mode === 'edit' && detailTransaction){
            setTransaction(detailTransaction)
        }else{
            setTransaction(null)
        }
    }, [mode, detailTransaction?.id])

    function setTransaction(detail: any | null){
        if(detail){
            setDetailAmount(detail?.amount || "0");
            setDetailPurpose(detail?.purpose || "");
            setDetailNote(detail?.note || "");

            const detailAmount = Number.isNaN(Number.parseFloat(detail?.amount)) ? Number(detail?.amount) : Number.parseFloat(detail?.amount)

            setTotalUsage(transaction?.current_total - detailAmount || 0)
            setRemainingUsage(transaction?.trip_price_amount - transaction?.current_total + detailAmount || 0)
        }else{
            setDetailAmount("");
            setDetailPurpose("");
            setDetailNote("");
            setTotalUsage(detail?.current_total || 0)
            setRemainingUsage(detail?.trip_price_amount - detail?.current_total || 0)
        }
    }

    return (
        <Dialog open={openDetailAction} onOpenChange={setOpenDetailAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} Transaction Detail</DialogTitle>

                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Info label="Total Pengajuan" value={formatCurrency(totalUsage)} />
                        <Info label="Sisa Pengajuan" value={formatCurrency(remainingUsage)} />
                    </CardContent>
                </DialogHeader>
                
                <form onSubmit={handleDetailSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="purpose" className="text-xs font-medium">Keperluan</label>
                        <Input id="purpose" value={detailPurpose} onChange={(e) => setDetailPurpose(e.target.value)} name="purpose" placeholder="e.g. Server hosting fee" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="amount" className="text-xs font-medium">Amount</label>
                        <Input id="amount" value={Number.parseFloat(detailAmount || "0").toString()} onChange={(e) => setDetailAmount(e.target.value)} name="amount" type="number" placeholder="0.00" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="note" className="text-xs font-medium">Note</label>
                        <Input id="note" value={detailNote} onChange={(e) => setDetailNote(e.target.value)} name="note" placeholder="e.g. Server hosting fee"  />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setOpenDetailAction(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Save Detail"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}