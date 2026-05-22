import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import { getTransactions } from "./transaction.hooks"
import { transactionStatusBadge } from "./transaction.helper"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import TransactionFormPage from "./TransactionFormPage"

export default function TransactionListPage() {
    const navigate = useNavigate() 
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<null | "add">(null)

    const { data, isLoading, isError } = getTransactions({
        search,
        page,
        per_page: 5,
    })

    if (isLoading) {
        return <div>Loading transactions...</div>
    }

    if (isError) {
        return <div>Failed to load transactions.</div>
    }

    

    return (
        <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">
                Manage delivery order transactions.
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                New Transaction
            </Button>
            <TransactionFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} transaction={null}/>
            
        </div>

        <Input
            placeholder="Search DO number, customer..."
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
                <TableHead>DO Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>DO Date</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {data?.data.map((transaction) => (
                <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                    {transaction.do_number}
                    </TableCell>
                    <TableCell>{transaction.customer?.name}</TableCell>
                    <TableCell>{transaction.vehicle?.plate_number}</TableCell>
                    <TableCell>
                    <Badge className={`${transactionStatusBadge[transaction.status]}`}>{transaction.status}</Badge>
                    </TableCell>
                    <TableCell>{transaction.do_date}</TableCell>
                    <TableCell>
                    <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <MoreHorizontalIcon />
                                <span className="sr-only">Open menu</span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Action</DropdownMenuLabel>
                                    <DropdownMenuItem 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            navigate(`/transactions/${transaction.id}`);
                                        }}
                                    >View
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}

                {data?.data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    No transactions found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {data?.current_page} of {data?.last_page}
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
                disabled={!data || page >= data.last_page}
                onClick={() => setPage((value) => value + 1)}
            >
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}