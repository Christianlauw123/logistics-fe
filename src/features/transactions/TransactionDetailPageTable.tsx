import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import type { Transaction, TransactionDetailStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Definisikan tipe data Props yang dibutuhkan komponen ini
interface TransactionDetailTableProps {
    type: string;
    user: any;
    transaction: Transaction;
    allowedMainTransactionEditDetailStatus: string[];
    detailNotAllowedModify: string[];
    transactionDetailStatusStage: Record<string, Record<string, any[]>>;
    detailTabunganClaimStatus: string[];
    transactionStatusBadge: Record<string, string>;
    setOpenHistoryAction: React.Dispatch<React.SetStateAction<"transaction" | "detail" | null>>
    setSelectedDetailId: (id: string) => void;
    setModeDetailAction: React.Dispatch<React.SetStateAction<"add" | "edit">>
    setDataDetailEdit: (detail: any) => void;
    setOpenDetailAction: (open: boolean) => void;
    handleDeleteDetail: (id: string) => void;
    handleTransactionDetailStatusChange: (id: string, status: TransactionDetailStatus) => void;
}

export const TransactionDetailPageTable: React.FC<TransactionDetailTableProps> = ({
    type,
    user,
    transaction,
    allowedMainTransactionEditDetailStatus,
    detailNotAllowedModify,
    transactionDetailStatusStage,
    detailTabunganClaimStatus,
    transactionStatusBadge,
    setOpenHistoryAction,
    setSelectedDetailId,
    setModeDetailAction,
    setDataDetailEdit,
    setOpenDetailAction,
    handleDeleteDetail,
    handleTransactionDetailStatusChange
}) => {
    const isSuperAdmin = user?.role?.name === 'Super Admin';
    const totalColumns = isSuperAdmin ? 7 : 6;
    const transactionDetails = type === "special" ? transaction.details?.filter((detail) => detail.is_special_case === true) : transaction.details?.filter((detail) => detail.is_special_case === false)

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Actions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Keperluan</TableHead>
                    <TableHead>Jumlah Nominal</TableHead>
                    {isSuperAdmin && <TableHead>Jumlah Transfer</TableHead>}
                    <TableHead>Catatan</TableHead>
                    <TableHead>Bukti</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {(!transactionDetails || transactionDetails.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={totalColumns} className="text-center py-4 text-muted-foreground">
                            No details added yet.
                        </TableCell>
                    </TableRow>
                )}
                {transactionDetails?.map((detail) => (
                    <TableRow key={detail.id}>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">Open menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenHistoryAction("detail");
                                            setSelectedDetailId(detail.id);
                                        }}>
                                            History
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>

                                    {detail.status === "SUBMITTED" && user?.role?.name !== "Operational" && allowedMainTransactionEditDetailStatus.includes(transaction.status) && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Action</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    setModeDetailAction("edit");
                                                    setDataDetailEdit(detail);
                                                    setOpenDetailAction(true);
                                                }}>
                                                    Edit
                                                </DropdownMenuItem>
                                                {isSuperAdmin && !detailNotAllowedModify?.includes(detail?.purpose) && (
                                                    <DropdownMenuItem variant="destructive" onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteDetail(detail.id);
                                                    }}>
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuGroup>
                                        </>
                                    )}

                                    {transactionDetailStatusStage?.[user?.role?.name || '']?.[detail.status]?.length > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Change Status To</DropdownMenuLabel>
                                                {transactionDetailStatusStage[user?.role?.name || ''][detail.status].map((stage) => {
                                                    const detailTabunganClaimInfo = detailNotAllowedModify?.includes(detail?.purpose);
                                                    const shouldRenderButton = !detailTabunganClaimInfo || detailTabunganClaimStatus.includes(stage[0]);
                                                    return shouldRenderButton ? (
                                                        <DropdownMenuItem
                                                            key={stage[0]}
                                                            onClick={() => handleTransactionDetailStatusChange(detail.id, stage[0])}
                                                        >
                                                            {stage[1]}
                                                        </DropdownMenuItem>
                                                    ) : null;
                                                })}
                                            </DropdownMenuGroup>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell>
                            <Badge className={transactionStatusBadge?.[detail.status] || ''}>
                                {detail.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{detail.purpose}</TableCell>
                        <TableCell>{formatCurrency(detail.amount)}</TableCell>
                        
                        {/* PERBAIKAN: Menggunakan TableCell (bukan TableHead) untuk isi data Super Admin */}
                        {isSuperAdmin && (
                            <TableCell>{formatCurrency(detail.total_transfer || 0)}</TableCell>
                        )}
                        
                        <TableCell>{detail.note || '-'}</TableCell>
                        <TableCell>
                            {detail.attachment ? (
                                <Button variant="outline" size="sm">
                                    <a href={detail.attachment} target="_blank" rel="noreferrer">Open</a>
                                </Button>
                            ) : '-'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};