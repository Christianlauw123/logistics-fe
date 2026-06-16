import { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useTripPriceDeleteQuery, useTripPricesQuery } from "./tripPrice.hooks"
import TripPriceFormPage from "./TripPriceFormPage"
import { formatCurrency } from "@/lib/utils"
import { ListPaginationFooter } from "@/components/layout/ListFooter"
import { ListHeader, SearchBar } from "@/components/layout/ListHeader"

export default function TripPriceListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedTripPrice, setSelectedTripPrice] = useState<any>(null);

    const { data: tripPrices, isError } = useTripPricesQuery({
        search,
        page,
        per_page: 5,
    })

    const deleteTripPrice = useTripPriceDeleteQuery();
    async function handleDelete(id: string) {
        if (confirm("Yakin menghapus harga trip ini?")) {
            await deleteTripPrice.mutateAsync({id: id})
        }
    }

    if (isError) {
        return <div>Gagal memuat harga trip, Silakan muat ulang halaman</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <ListHeader
                    title="Harga Trip"
                    onButtonClick={() => {
                        setModeMainAction("add")
                        setOpenMainAction(true)
                    }}
                />
                <TripPriceFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} tripPrice={selectedTripPrice}/>
                
            </div>

            <SearchBar title="Harga Trip" searchValue={search} onChange= {(event) => {
                setSearch(event.target.value)
                setPage(1)
            }} />

            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[120px]">Aksi</TableHead>
                        <TableHead>Pelanggan</TableHead>
                        <TableHead>Asal</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Harga Dasar</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tripPrices?.data.map((tripPrice) => (
                    <TableRow key={tripPrice.id}>
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
                                                setSelectedTripPrice(tripPrice);
                                                setModeMainAction("edit");
                                                setOpenMainAction(true);
                                            }}
                                        >Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(tripPrice.id)
                                            }}
                                        >Delete</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">{tripPrice.customer?.name}</TableCell>
                        <TableCell>{tripPrice.origin_sub_district?.name}, {tripPrice.origin_sub_district?.district?.name}</TableCell>
                        <TableCell>{tripPrice.destination_sub_district?.name}, {tripPrice.destination_sub_district?.district?.name}</TableCell>
                        <TableCell>{tripPrice.weight_category}</TableCell>
                        <TableCell>{formatCurrency(tripPrice?.base_price) }</TableCell>
                    </TableRow>
                    ))}

                    {tripPrices?.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        Harga trip tidak ditemukan.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
            <ListPaginationFooter data={tripPrices} page={page} setPage={setPage} />
        </div>
    )
}