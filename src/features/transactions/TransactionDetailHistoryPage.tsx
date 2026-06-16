import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function TransactionDetailHistoryPage({ openHistoryAction, setOpenHistoryAction, logs }: { openHistoryAction: boolean; setOpenHistoryAction: (openHistoryAction: boolean) => void; logs:any; }) {
    return (
        <Dialog open={openHistoryAction} onOpenChange={setOpenHistoryAction}>
            <DialogContent className="md:max-w-[720px]">
                <DialogHeader>
                    <DialogTitle>History Transaksi</DialogTitle>
                </DialogHeader>
                <div className="overflow-hidden rounded-md border bg-background">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[120px]">Waktu</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Perubahan</TableHead>
                                    <TableHead>Jenis</TableHead>
                                </TableRow>
                            </TableHeader>
            
                            <TableBody>

                                {logs && logs?.map((data: any) => (
                                    <TableRow key={data.id}>
                                        <TableCell>{data.eventTime} - {data.state}</TableCell>
                                        <TableCell>{data.wodunnit}</TableCell>
                                        <TableCell className="whitespace-pre-line">{data.effect}</TableCell>
                                        <TableCell>{data.action}</TableCell>
                                    </TableRow>
                                ))}

            
                                {logs && logs?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    Transaksi tidak ditemukan.
                                    </TableCell>
                                </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
            </DialogContent>
        </Dialog>
    )
}