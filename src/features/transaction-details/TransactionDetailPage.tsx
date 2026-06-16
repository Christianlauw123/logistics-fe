import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { getTransaction, getTransactionLogs, updateTransactionStatus } from "../transactions/transaction.hooks"
import { createUploadAttachment, deleteUploadAttachment } from "../attachments/attachment.hooks"

import { AlertCircleIcon, HistoryIcon, MoreHorizontalIcon } from "lucide-react"
import type { TransactionDetailStatus, TransactionStatus } from "@/types"
import { useState } from "react"
import { deleteTransactionDetail, updateTransactionDetailStatus } from "../transaction-details/transaction-detail.hooks"
import { allowedMainTransactionEditDetailStatus, detailNotAllowedModify, detailTabunganClaimStatus, transactionStatusBadge, transactionStatusStage, transactionDetailStatusStage, allowedMainTransactionEdit, allowedMainTransactionEditRevisionDestination, allowedAttachmentModification } from "../transactions/transaction.helper"
import { errorHandler, formatCurrency } from "@/lib/utils"
import TransactionFormPage from "../transactions/TransactionFormPage"
import { useAuthStore } from "../auth/auth.store"
import TransactionDetailFormPage from "./TransactionDetailFormPage"
import { Info } from "@/components/info"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import TransactionDetailHistoryPage from "../transactions/TransactionDetailHistoryPage"

export default function TransactionDetailPage() {
    const user = useAuthStore((state) => state.user)
    const { id } = useParams()

    const [fileInputKey, setFileInputKey] = useState(Date.now());

    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<null | "edit">(null)

    const [openRevisionDestinationAction, setOpenRevisionDestinationAction] = useState(false);

    const [openDetailAction, setOpenDetailAction] = useState(false);
    const [openHistoryAction, setOpenHistoryAction] = useState(false);
    const [modeDetailAction, setModeDetailAction] = useState<"add" | "edit">("add")
    const [dataDetailEdit, setDataDetailEdit] = useState<any>(null);

    const { data: transaction, isLoading, isError } = getTransaction(id)
    const { data: transactionLogs } = getTransactionLogs(id, openHistoryAction)

    const updateStatus = updateTransactionStatus();
    const uploadTransactionAttachment = createUploadAttachment();
    const deleteTransactionAttachment = deleteUploadAttachment();

    const updateStatusTransactionDetail = updateTransactionDetailStatus();
    const deleteDetail = deleteTransactionDetail();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [attachmentUploadLoading, setAttachmentUploadLoading] = useState<boolean>(false);

    if (isLoading) {
        return <div>Mengambil Transaksi...</div>
    }

    if (isError || !transaction) {
        return <div>Gagal memuat transaksi, Silakan muat ulang halaman</div>
    }

    async function handleTransactionStatusChange(status: TransactionStatus) {
        if (!id) return
        await updateStatus.mutateAsync({ id, status })
    }

    // Attachment upload mutation
    // Handle file upload for transaction attachment
  
    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
       const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    async function handleSubmitUpload(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedFile || !id) {
            toast.error("Message ")
            return
        }

        try {
            await uploadTransactionAttachment.mutateAsync({
                transactionId: id,
                file: selectedFile,
            })
            setSelectedFile(null)
            setFileInputKey(Date.now());
        } catch (error) {
            errorHandler(error)
        }
    }

    async function handleDeleteAttachment(attachmentId: string) {
        if (!id || !attachmentId) return
        setAttachmentUploadLoading(true)
        try {
            await deleteTransactionAttachment.mutateAsync({
                transactionId: id,
                attachmentId: attachmentId,
            })
            
            setFileInputKey(Date.now());
        } catch (error) {
            errorHandler(error)
        } finally{
            setAttachmentUploadLoading(false)
        }
    }

    async function handleDeleteDetail(transactionDetailId: string) {
        if (!transactionDetailId) return
        if (!id) return
        if (confirm("Yakin menghapus detail ini?")) {
            await deleteDetail.mutateAsync({ transactionId: id, transactionDetailId: transactionDetailId })
        }
    }
    
    async function handleTransactionDetailStatusChange(transactionDetailId: string, status: TransactionDetailStatus) {
        if (!id) return
        if (!transactionDetailId) return
        await updateStatusTransactionDetail.mutateAsync({ transactionId: id, id: transactionDetailId, status })
    }

    function dateFormat(dateString: string) {
        const d = new Date(dateString);
        try{
            const yyyymmdd = d.toISOString().split('T')[0]; // Returns "2026-06-02"
            const time = d.toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' }); // Returns "12.55"
            
            return `${yyyymmdd} ${time}`;
        }catch(error){
            return ``;
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold">No DO: {transaction.do_number}</h1>
                    <p className="text-sm text-muted-foreground">
                        Detail Transaksi dan Upload Bukti untuk No DO: {transaction.do_number}
                    </p>
                </div>
                <div className="flex flex-col md:flex-row items-start gap-1">
                    <Badge className={`${transactionStatusBadge[transaction.status]}`}>{transaction.status}</Badge>
                    <HistoryIcon onClick={() => {
                        setOpenHistoryAction(true)
                    }}/>
                    
                </div>
            </div>

            <TransactionDetailHistoryPage openHistoryAction={openHistoryAction} setOpenHistoryAction={setOpenHistoryAction} logs={transactionLogs} />

            <Card>
                <CardHeader>
                    <CardTitle>Main Information {user?.role?.name}</CardTitle>
                    <div className="flex">
                        {(user?.role?.name === "Super Admin" || (user?.role?.name === "Operational" && allowedMainTransactionEdit.includes(transaction.status))) && (
                        <Button size="sm" onClick={() => {
                            setModeMainAction("edit")
                            setOpenMainAction(true)
                        }}>
                            Edit Detail Main
                        </Button>)}
                    </div>
                    
                    <TransactionFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} transaction={transaction} user={user}/>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info label="Tanggal DO" value={transaction.do_date ?? ''} />
                    <Info label="Tanggal DO Aktual" value={transaction.do_actual_date ?? "-"}/>
                    <Info label="Pelanggan" value={transaction.customer_name} />
                    <Info label="Note" value={transaction.note ?? "-"}/>
                </CardContent>
                <Separator></Separator>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info label="Asal" value={transaction.origin_district} />
                    <Info label="Tujuan" value={transaction.destination_district} />
                    <Info label="Harga Trip Normal" value={transaction?.trip_price_amount?.toString() ?? "-"}/>
                </CardContent>
                <Separator></Separator>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {/* { transaction?.revision_destination_district !== transaction.destination_district && ( */}
                        <>
                            <Info label="Tujuan Revisi" value={transaction?.revision_destination_district?.toString() ?? "-"} />
                            <Info label="Harga Trip Revisi" value={transaction?.revision_trip_price_amount?.toString() ?? "-"}/>
                        </>
                    {/* )} */}
                </CardContent>
                <Separator></Separator>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Info label="Kendaraan" value={transaction.vehicle_plate} />
                    <Info label="Supir" value={transaction.driver_name} />
                    {/* <Info label="Tujuan" value={transaction.dest_address} /> */}
                    <Info label="Akun Bank" value={transaction.bank_account_num ?? ''} />
                    <Info label="Kapasitas (Kg)" value={Number(transaction?.weight_category)?.toLocaleString('id-ID') ?? "-"}/>
                    {/* { transaction?.revision_destination_district !== transaction.destination_district && ( */}
                        <>
                            <Info label="Kapasitas (Kg) - Revisi" value={Number(transaction?.revision_weight_category)?.toLocaleString('id-ID') ?? "-"}/>
                        </>
                    {/* )} */}
                </CardContent>
                <Separator></Separator>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    {/* <Info label="Item" value={transaction.transaction_items ?? "-"}/> */}
                    <Info label="Dibuat oleh" value={transaction?.user?.name ?? "-"}/>
                    <Info label="Tanggal/Jam Dibuat" value={`${dateFormat(transaction.created_at)}`} />
                    <Info label="Terakhir dirubah oleh" value={transaction?.lastUpdatedBy?.name ?? "-"}/>
                    <Info label="Terakhir Dirubah" value={`${dateFormat(transaction.updated_at)}`} />
                </CardContent>
            </Card>

            {transactionStatusStage[user?.role?.name || ''][transaction.status]?.length !== 0 && user?.role?.name === "Super Admin" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Aksi</CardTitle>
                    </CardHeader>

                    <CardContent className="flex flex-wrap gap-2">
                        {transactionStatusStage[user?.role?.name || ''][transaction.status].map((transactionStage) => (
                            <Button key={transactionStage[0]} className={`${transactionStatusBadge[transactionStage[0]]}`} onClick={() => handleTransactionStatusChange(transactionStage[0] as TransactionStatus)}>{transactionStage[1]}</Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Detail Transaksi</CardTitle>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <Info label="Total Pengajuan" value={formatCurrency(transaction.current_total || 0)} icon={ (transaction.current_total || 0) > (transaction.revision_trip_price_amount - (transaction?.current_total_approved ?? 0)) ? <AlertCircleIcon className="text-red-400 text-sm" /> : <></>} />
                        <Info label="Total Pengajuan Approved" value={formatCurrency(transaction.current_total_approved || 0)} />
                        <Info label="Sisa Pengajuan" value={formatCurrency(transaction.revision_trip_price_amount - (transaction?.current_total_approved ?? 0))} />
                    </CardContent>
                    {(user?.role?.name === "Super Admin" || (user?.role?.name !== "Operational" && allowedMainTransactionEditDetailStatus.includes(transaction.status))) && (
                    <Button size="sm" onClick={() => {
                        setModeDetailAction("add")
                        setOpenDetailAction(true)
                    }}>
                        Tambah Detail
                    </Button>)}
                    
                    <TransactionDetailFormPage openDetailAction={openDetailAction} setOpenDetailAction={setOpenDetailAction} mode={modeDetailAction!} detailTransaction={dataDetailEdit} transaction={transaction} setDetailTransaction={setDataDetailEdit}/>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Actions</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Keperluan</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    {user?.role.name === 'Super Admin' && (
                                        <TableHead>Jumlah Transfer</TableHead>
                                    )}
                                    <TableHead>Note</TableHead>
                                    <TableHead>Kasus Khusus</TableHead>
                                    <TableHead>Bukti</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.details?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center">
                                            No details added yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {transaction.details?.map((detail) => (
                                    <TableRow key={detail.id}>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger >
                                                    <MoreHorizontalIcon />
                                                    <span className="sr-only">Open menu</span>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    {detail.status === "SUBMITTED" && user?.role?.name !== "Operational" && allowedMainTransactionEditDetailStatus.includes(transaction.status) && (
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
                                                            {user?.role?.name === "Super Admin" && !detailNotAllowedModify?.includes(detail?.purpose) && (
                                                                <DropdownMenuItem variant="destructive" onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteDetail(detail.id)
                                                                }}>
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuGroup>
                                                    )}
                                                    {transactionDetailStatusStage[user?.role?.name || ''][detail.status as TransactionDetailStatus].length !== 0 && (
                                                        <>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuGroup>
                                                            <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                                                            {transactionDetailStatusStage[user?.role?.name || ''][detail.status as TransactionDetailStatus].map((transactionDetailStage) => {
                                                                const detailTabunganClaimInfo = detailNotAllowedModify?.includes(detail?.purpose)
                                                                const shouldRenderButton = !detailTabunganClaimInfo || detailTabunganClaimStatus.includes(transactionDetailStage[0])
                                                                return (shouldRenderButton && (
                                                                        <DropdownMenuItem 
                                                                            key={transactionDetailStage[0]} 
                                                                            onClick={() => handleTransactionDetailStatusChange(detail.id, transactionDetailStage[0] as TransactionDetailStatus)}
                                                                        >
                                                                            {transactionDetailStage[1]}
                                                                        </DropdownMenuItem>
                                                                    )
                                                                );
                                                            })}
                                                        </DropdownMenuGroup>
                                                        </>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${transactionStatusBadge[detail.status]}`}>{detail.status}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{detail.purpose}</TableCell>
                                        <TableCell>{formatCurrency(detail.amount)}</TableCell>
                                        {user?.role.name === 'Super Admin' && (
                                            <TableHead>{formatCurrency(detail.total_transfer)}</TableHead>
                                        )}
                                        <TableCell>{detail.note}</TableCell>
                                        <TableCell>{detail.is_special_case ? 'y' : 'x'}</TableCell>
                                        <TableCell>
                                            {detail.attachment && (
                                                <Button variant="outline" >
                                                    <a href={detail.attachment} target="_blank" rel="noreferrer">Open</a>
                                                </Button>
                                            )}
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
                    {(user?.role?.name === "Super Admin" ||  (user?.role?.name !== "Staff" && allowedAttachmentModification.includes(transaction.status))) && (
                        <form onSubmit={handleSubmitUpload} className="space-y-4 pt-2">
                            <Field>
                                <FieldLabel htmlFor="file">File</FieldLabel>
                                <Input key={fileInputKey}type="file" id="file" onChange={handleFileChange} />
                                <FieldDescription>Select a file to upload.</FieldDescription>
                            </Field>
                            <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                                <Button type="submit" disabled={attachmentUploadLoading}>{attachmentUploadLoading ? "Menyimpan..." : "Upload Attachment"}</Button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>ID - Name</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transaction.attachments?.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center">
                                            No attachments uploaded.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {transaction.attachments?.map((attachment) => (
                                    <TableRow key={attachment.id}>
                                        <TableCell className="font-medium">{attachment.original_file_name}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="outline" >
                                                <a href={attachment.file_url} target="_blank" rel="noreferrer">Open</a>
                                            </Button>
                                            {user?.role?.name === "Super Admin" || allowedAttachmentModification.includes(transaction.status) && (
                                                <Button variant="destructive" onClick={() => 
                                                    handleDeleteAttachment(attachment.id)
                                                }>
                                                    Delete
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
        )
}

