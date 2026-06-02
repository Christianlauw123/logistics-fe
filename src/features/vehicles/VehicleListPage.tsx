import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useVehicleDeleteQuery, useVehiclesQuery } from "./vehicle.hooks"
import { Badge } from "@/components/ui/badge"
import VehicleFormPage from "./VehicleFormPage"

export default function VehicleListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

    const { data: vehicles, isError } = useVehiclesQuery({
        search,
        page,
        per_page: 5,
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
            <div>
            <h1 className="text-2xl font-bold">Kendaraan</h1>
            <p className="text-sm text-muted-foreground">
                Pengaturan Kendaraan
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                Tambah Kendaraan
            </Button>
            <VehicleFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} vehicle={selectedVehicle}/>
            
        </div>

        <Input
            placeholder="Mencari kendaraan..."
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
                <TableHead>Kendaraan</TableHead>
                <TableHead>Nomor Plat</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Kapasitas (Kg)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {vehicles?.data.map((vehicle) => (
                <TableRow key={vehicle.id}>
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

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {page} of {vehicles?.last_page}
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
                disabled={!vehicles || page >= vehicles.last_page}
                onClick={() => setPage((value) => value + 1)}
            >
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}