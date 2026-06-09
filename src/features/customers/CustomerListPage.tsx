import { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import CustomerFormPage from "./CustomerFormPage"
import { useCustomerDeleteQuery, useCustomersQuery } from "./customer.hooks"
import type { Customer } from "@/types"
import { ListPaginationFooter } from "@/components/layout/ListFooter"
import { ListHeader, SearchBar } from "@/components/layout/ListHeader"

export default function CustomerListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const { data: customers, isError } = useCustomersQuery({
        search,
        page,
        per_page: 5,
    })

    const deleteCustomer = useCustomerDeleteQuery();
    async function handleDelete(id: string) {
        if (confirm("Yakin menghapus pelanggan ini?")) {
            await deleteCustomer.mutateAsync({id: id})
        }
    }

    if (isError) {
        return <div>Gagal memuat pelanggan, Silakan muat ulang halaman</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <ListHeader
                    title="Pelanggan"
                    onButtonClick={() => {
                        setModeMainAction("add")
                        setOpenMainAction(true)
                    }}
                />
                <CustomerFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} customer={selectedCustomer}/>
                
            </div>

            <SearchBar title="Pelanggan" searchValue={search} onChange= {(event) => {
                setSearch(event.target.value)
                setPage(1)
            }} />

            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Aksi</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead>Telepon</TableHead>
                        <TableHead>Alamat</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {customers?.data.map((customer) => (
                    <TableRow key={customer.id}>
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
                                                setSelectedCustomer(customer);
                                                setModeMainAction("edit");
                                                setOpenMainAction(true);
                                            }}
                                        >Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(customer.id)
                                            }}
                                        >Delete</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">
                        {customer.name}
                        </TableCell>
                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.address}</TableCell>
                        
                    </TableRow>
                    ))}

                    {customers?.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        Tidak ada pelanggan ditemukan.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            <ListPaginationFooter data={customers} page={page} setPage={setPage} />
        </div>
    )
}