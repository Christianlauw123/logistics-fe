import { useParams } from "react-router-dom"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "../../components/ui/field"
import { Input } from "../../components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"

import { getTransaction, updateTransactionStatus } from "./transaction.hooks"
import { createUploadAttachment } from "../attachments/attachment.hooks"

import { MoreHorizontalIcon } from "lucide-react"
import type { TransactionStatus } from "../../types"
import { useState } from "react"
import { toast } from "sonner"
import { createTransactionDetail, deleteTransactionDetail, updateTransactionDetail, updateTransactionDetailStatus } from "../transaction-details/transaction-detail.hooks"
import { transactionStatusBadge, transactionStatusStage } from "./transaction.helper"
import { errorHandler } from "../../lib/utils"
import TransactionFormPage from "./TransactionFormPage"

export default function TransactionDetailPage() {
    const { id } = useParams()
    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<null | "edit">(null)

    const [openDetailAction, setOpenDetailAction] = useState(false);
    const [modeDetailAction, setModeDetailAction] = useState<"add" | "edit">("add")
    const [dataDetailEdit, setDataDetailEdit] = useState<any>(null);

    const [loading, setLoading] = useState(false);

    const { data: transaction, isLoading, isError } = getTransaction(id)


    const updateStatus = updateTransactionStatus();
    const uploadTransactionAttachment = createUploadAttachment();

    const createDetail = createTransactionDetail();
    const updateStatusTransactionDetail = updateTransactionDetailStatus();
    const updateDetail = updateTransactionDetail();
    const deleteDetail = deleteTransactionDetail();

    if (isLoading) {
        return <div>Loading transaction...</div>
    }

    if (isError || !transaction) {
        return <div>Failed to load transaction.</div>
    }

    async function handleTransactionStatusChange(status: TransactionStatus) {
        if (!id) return
        updateStatus.mutate({ id, status })
    }

    // Attachment upload mutation
    // Handle file upload for transaction attachment
    async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0]
        if (!file || !id) return

        try {
            uploadTransactionAttachment.mutate({
                transactionId: id,
                file,
            })
            
            setFileInputKey(Date.now());
        } catch (error) {
            toast.error("Upload failed")
        }
    }

    // Transaction Detail mutation handlers
    // Transaction Detail data fetching and mutations
    async function handleDetailSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (!id){
            setLoading(false);
            setOpenDetailAction(false); 
            toast.error("Transaction ID is missing")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            transactionId: id, // Ensure 'id' is available in this scope
            purpose: rawData.purpose as string,
            note: rawData.note as string,
            amount: Number(rawData.amount), 
        };
        try {
            if (modeDetailAction === "add")
                createDetail.mutate(basePayload)
            else if (modeDetailAction === "edit" && dataDetailEdit){
                const updatedPayload = {...basePayload, transactionDetailId: dataDetailEdit.id}
                updateDetail.mutate(updatedPayload)

            }
            
            setOpenDetailAction(false); // Close dialog
            event.currentTarget.reset(); // Clear all form inputs cleanly
        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteDetail(transactionDetailId: string) {
        if (!transactionDetailId) return
        if (!id) return

        deleteDetail.mutate({ transactionId: id, transactionDetailId: transactionDetailId })
    }
    
    async function handleTransactionDetailStatusChange(transactionDetailId: string, status: TransactionStatus) {
        if (!id) return
        if (!transactionDetailId) return
        updateStatusTransactionDetail.mutate({ transactionId: id, id: transactionDetailId, status })
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
                <h1 className="text-2xl font-bold">DO Number: {transaction.do_number}</h1>
                <p className="text-sm text-muted-foreground">
                Transaction detail and attachment.
                </p>
            </div>
            <Badge className={`${transactionStatusBadge[transaction.status]}`}>{transaction.status}</Badge>
        </div>

            <Card>
                <CardHeader>
                    <CardTitle>Main Information</CardTitle>
                    <Button size="sm" onClick={() => {
                        setModeMainAction("edit")
                        setOpenMainAction(true)
                    }}>
                        Edit Detail Main
                    </Button>
                    <TransactionFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} transaction={transaction} />
                </CardHeader>

                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info label="Customer" value={transaction.customer_name} />
                    <Info label="Vehicle" value={transaction.vehicle_plate} />
                    <Info label="Destination" value={transaction.dest_address} />
                    <Info label="DO Date" value={transaction.do_date ?? ''} />
                    <Info label="Actual DO Date" value={transaction.do_actual_date ?? "-"}/>
                    <Info label="Normal Trip Price" value={transaction.trip_price_amount.toString() ?? "-"}/>
                    <Info label="Origin" value={transaction.origin_district} />
                    <Info label="Destination" value={transaction.destination_district} />
                    <Info label="Bank Account" value={transaction.bank_account_num ?? ''} />
                    <Info label="Tonase / Kapasitas" value={transaction.transaction_capacity.toString() ?? "-"}/>
                    <Info label="Item" value={transaction.transaction_items ?? "-"}/>
                    <Info label="Note" value={transaction.note ?? "-"}/>
                    <Info label="Creation Time" value={`${new Date(transaction.created_at).toLocaleString()} - (${transaction.created_at})`} />
                    <Info label="Creator" value={transaction.user.name ?? "-"}/>
                </CardContent>
            </Card>

            {transactionStatusStage[transaction.status].length !== 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Status Action</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-wrap gap-2">
                        {transactionStatusStage[transaction.status].map((transactionStage) => (
                            <Button key={transactionStage[0]} className={`${transactionStatusBadge[transactionStage[0]]}`} onClick={() => handleTransactionStatusChange(transactionStage[0] as TransactionStatus)}>{transactionStage[1]}</Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Transaction Request Details</CardTitle>
                    <Button size="sm" onClick={() => {
                        setModeDetailAction("add")
                        setOpenDetailAction(true)
                    }}>
                        Add Detail
                    </Button>
                    <Dialog open={openDetailAction} onOpenChange={setOpenDetailAction}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>{modeDetailAction === "add" ? "Add" : "Edit"} Transaction Detail</DialogTitle>
                            </DialogHeader>
                            
                            <form onSubmit={handleDetailSubmit} className="space-y-4 pt-2">
                                <div className="space-y-1">
                                    <label htmlFor="purpose" className="text-xs font-medium">Tujuan</label>
                                    <Input id="purpose" defaultValue={dataDetailEdit?.purpose || ""} name="purpose" placeholder="e.g. Server hosting fee" required />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="amount" className="text-xs font-medium">Amount</label>
                                    <Input id="amount" defaultValue={dataDetailEdit?.amount || ""} name="amount" type="number" placeholder="0.00" required />
                                </div>
                                <div className="space-y-1">
                                    <label htmlFor="note" className="text-xs font-medium">Note</label>
                                    <Input id="note" defaultValue={dataDetailEdit?.note || ""} name="note" placeholder="e.g. Server hosting fee" required />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button type="button" variant="outline" onClick={() => setOpenDetailAction(false)}>Cancel</Button>
                                    <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Save Detail"}</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tujuan</TableHead>
                                <TableHead>Jumlah</TableHead>
                                <TableHead>Note</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transaction.details.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                        No details added yet.
                                    </TableCell>
                                </TableRow>
                            )}
                            {transaction.details.map((detail) => (
                                <TableRow key={detail.id}>
                                    <TableCell className="font-medium">{detail.purpose}</TableCell>
                                    <TableCell>{detail.amount}</TableCell>
                                    <TableCell>{detail.note}</TableCell>
                                    <TableCell>
                                        <Badge className={`${transactionStatusBadge[detail.status]}`}>{detail.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger >
                                                <MoreHorizontalIcon />
                                                <span className="sr-only">Open menu</span>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {detail.status === "SUBMITTED" && (
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                                                        <DropdownMenuItem  onClick={(e) => {
                                                                e.stopPropagation(); 
                                                                setModeDetailAction("edit");
                                                                setDataDetailEdit(detail);
                                                                setOpenDetailAction(true);
                                                            }}>
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem variant="destructive" onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteDetail(detail.id)
                                                        }}>
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuGroup>
                                                )}
                                                {transactionStatusStage[detail.status].length !== 0 && (<DropdownMenuSeparator />)}
                                                {transactionStatusStage[detail.status].length !== 0 && (
                                                    <DropdownMenuGroup>
                                                        <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                                                        {transactionStatusStage[detail.status].map((transactionStage) => (
                                                            <DropdownMenuItem key={transactionStage[0]} onClick={() => handleTransactionDetailStatusChange(detail.id, transactionStage[0] as TransactionStatus)}>
                                                                {transactionStage[1]}
                                                            </DropdownMenuItem>
                                                        ))}
                                                    </DropdownMenuGroup>
                                                )}
                                                
                                                
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            
                        </TableBody>
                    </Table>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="file">File</FieldLabel>
                        <Input key={fileInputKey}type="file" id="file" onChange={handleUpload} />
                        <FieldDescription>Select a file to upload.</FieldDescription>
                    </Field>

                    <div className="space-y-2">
                    {transaction.attachments.map((attachment) => (
                        <div
                        key={attachment.id}
                        className="flex items-center justify-between rounded-md border p-3"
                        >
                        <Button variant="outline" >
                            <a
                            href={attachment.file_url}
                            target="_blank"
                            rel="noreferrer"
                            >
                            Open
                            </a>
                        </Button>
                        </div>
                    ))}

                    {transaction.attachments.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                        No attachments uploaded.
                        </p>
                    )}
                    </div>
                </CardContent>
            </Card>
        </div>
        )
    }

    function Info({ label, value }: { label: string; value: string }) {
        return (
        <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium">{value}</p>
        </div>
    )
}