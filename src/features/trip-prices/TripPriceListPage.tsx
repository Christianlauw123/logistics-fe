import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useTripPriceDeleteQuery, useTripPricesQuery } from "./tripPrice.hooks"
import TripPriceFormPage from "./TripPriceFormPage"

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
            <div>
            <h1 className="text-2xl font-bold">Harga Trip</h1>
            <p className="text-sm text-muted-foreground">
                Pengaturan Harga Trip.
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                Tambah Harga Trip
            </Button>
            <TripPriceFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} tripPrice={selectedTripPrice}/>
            
        </div>

        <Input
            placeholder="Mencari harga trip..."
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
                <TableHead>Pelanggan</TableHead>
                <TableHead>Asal</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Harga Dasar</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {tripPrices?.data.map((tripPrice) => (
                <TableRow key={tripPrice.id}>
                    <TableCell className="font-medium">{tripPrice.customer?.name}</TableCell>
                    <TableCell>{tripPrice.origin_sub_district?.name}, {tripPrice.origin_sub_district?.district?.name}</TableCell>
                    <TableCell>{tripPrice.destination_sub_district?.name}, {tripPrice.destination_sub_district?.district?.name}</TableCell>
                    <TableCell>{Number.parseFloat(tripPrice?.base_price || "0").toLocaleString('id-ID') }</TableCell>
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

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {page} of {tripPrices?.last_page}
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
                disabled={!tripPrices || page >= tripPrices.last_page}
                onClick={() => setPage((value) => value + 1)}
            >
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}