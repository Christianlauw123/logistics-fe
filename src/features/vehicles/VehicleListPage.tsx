import { useState } from "react"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useVehicleDeleteQuery, useVehiclesQuery } from "./vehicle.hooks"
import { Badge } from "@/components/ui/badge"
import VehicleFormPage from "./VehicleFormPage"
import { ListPaginationFooter } from "@/components/layout/ListFooter"
import { ListHeader, SearchBar } from "@/components/layout/ListHeader"

export default function VehicleListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    const { data: vehicles, isError } = useVehiclesQuery({
        search,
        page,
        per_page: 15,
    })

    const deleteVehicle = useVehicleDeleteQuery();
    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this vehicle?")) {
            await deleteVehicle.mutateAsync({id: id})
        }
    }

    if (isError) {
        return <div>Gagal memuat kendaraan, Silakan muat ulang halaman</div>
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <ListHeader
                    title="Kendaraan"
                    onButtonClick={() => {
                        setModeMainAction("add")
                        setOpenMainAction(true)
                    }}
                />
                <VehicleFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} vehicle={selectedVehicle}/>
                
            </div>

            <SearchBar title="Kendaraan" searchValue={search} onChange= {(event) => {
                setSearch(event.target.value)
                setPage(1)
            }} />

            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Nomor Plat</TableHead>
                    <TableHead>Jenis</TableHead>
                    <TableHead>Kapasitas (Kg)</TableHead>
                    <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {vehicles?.data.map((vehicle) => (
                    <TableRow key={vehicle.id}>
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
                                                setSelectedVehicle(vehicle);
                                                setModeMainAction("edit");
                                                setOpenMainAction(true);
                                            }}
                                        >Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(vehicle.id)
                                            }}
                                        >Delete</DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell className="font-medium">
                        {vehicle.name}
                        </TableCell>
                        <TableCell>{vehicle.plate_number}</TableCell>
                        <TableCell>{vehicle.type}</TableCell>
                        <TableCell>{Number(vehicle?.capacity).toLocaleString('id-ID')}</TableCell>
                        <TableCell>
                            <Badge variant={vehicle.is_active ? "default" : "secondary"}>
                                {vehicle.is_active ? "Active" : "Inactive"}
                            </Badge>
                        </TableCell>
                        
                    </TableRow>
                    ))}

                    {vehicles?.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        Tidak ada kendaraan ditemukan.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            <ListPaginationFooter data={vehicles} page={page} setPage={setPage} />
        </div>
    )
}