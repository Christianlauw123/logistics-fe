import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import type { BankAccount } from "../../types"
import { useBankAccountDeleteQuery, useBankAccountsQuery } from "./bankAccount.hooks"
import BankAccountFormPage from "./BankAccountFormPage"

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
    function handleDeleteDetail(id: string) {
        if (confirm("Are you sure you want to delete this bank account?")) {
            deleteBankAccount.mutate({id: id})
        }
    }

    if (isError) {
        return <div>Failed to load bank accounts, Please reload the page</div>
    }

    return (
        <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
            <h1 className="text-2xl font-bold">Bank Accounts</h1>
            <p className="text-sm text-muted-foreground">
                Manage Bank Accounts.
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                New Bank Account
            </Button>
            <BankAccountFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} bankAccount={selectedBankAccount}/>
            
        </div>

        <Input
            placeholder="Search bank accounts..."
            value={search}
            onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
            }}
            className="max-w-md"
        />

        <div className="overflow-hidden rounded-md border bg-background">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Bank Name</TableHead>
                <TableHead>Identifier Num</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Account Name</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {bankAccounts?.data.map((bankAccount) => (
                <TableRow key={bankAccount.id}>
                    <TableCell className="font-medium">
                    {bankAccount.bank_name}
                    </TableCell>
                    <TableCell>{bankAccount.account_identifier_number}</TableCell>
                    <TableCell>{bankAccount.account_number}</TableCell>
                    <TableCell>{bankAccount.account_name}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                            <DropdownMenuTrigger>
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Action</DropdownMenuLabel>
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
                                            handleDeleteDetail(bankAccount.id)
                                        }}
                                    >Delete</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
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

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {bankAccounts?.current_page} of {bankAccounts?.last_page}
            </p>

            <div className="space-x-2">
            <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((value) => value - 1)}
            >
                Previous
            </Button>

            <Button
                variant="outline"
                disabled={!bankAccounts || page >= bankAccounts.last_page}
                onClick={() => setPage((value) => value + 1)}
            >
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}