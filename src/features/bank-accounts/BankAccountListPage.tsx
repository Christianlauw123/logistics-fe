import { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import type { BankAccount } from "@/types"
import { useBankAccountDeleteQuery, useBankAccountsQuery } from "./bankAccount.hooks"
import BankAccountFormPage from "./BankAccountFormPage"
import { ListPaginationFooter } from "@/components/layout/ListFooter"
import { ListHeader, SearchBar } from "@/components/layout/ListHeader"

export default function BankAccountListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedBankAccount, setSelectedBankAccount] = useState<BankAccount | null>(null);

    const { data: bankAccounts, isError } = useBankAccountsQuery({
        search,
        page,
        per_page: 5,
    })

    const deleteBankAccount = useBankAccountDeleteQuery();
    async function handleDelete(id: string) {
        if (confirm("Yakin menghapus akun bank ini?")) {
            await deleteBankAccount.mutateAsync({id: id})
        }
    }

    if (isError) {
        return <div>Gagal memuat akun bank, Silakan muat ulang halaman</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <ListHeader
                    title="Akun Bank"
                    onButtonClick={() => {
                        setModeMainAction("add")
                        setOpenMainAction(true)
                    }}
                />
                <BankAccountFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} bankAccount={selectedBankAccount}/>
                
            </div>

            <SearchBar title="Akun Bank" searchValue={search} onChange= {(event) => {
                setSearch(event.target.value)
                setPage(1)
            }} />

            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Aksi</TableHead>
                        <TableHead>Nama Bank</TableHead>
                        <TableHead>Nomor Unik</TableHead>
                        <TableHead>Nomor Akun</TableHead>
                        <TableHead>Nama Akun</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bankAccounts?.data.map((bankAccount) => (
                    <TableRow key={bankAccount.id}>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <MoreHorizontalIcon />
                                    <span className="sr-only">Open menu</span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                        <DropdownMenuItem 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedBankAccount(bankAccount);
                                                setModeMainAction("edit");
                                                setOpenMainAction(true);
                                            }}
                                        >Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(bankAccount.id)
                                            }}
                                        >Delete</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">
                        {bankAccount.bank_name}
                        </TableCell>
                        <TableCell>{bankAccount.account_identifier_number}</TableCell>
                        <TableCell>{bankAccount.account_number}</TableCell>
                        <TableCell>{bankAccount.account_name}</TableCell>
                        
                    </TableRow>
                    ))}

                    {bankAccounts?.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        No bank accounts found.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <ListPaginationFooter data={bankAccounts} page={page} setPage={setPage} />

        </div>
    )
}