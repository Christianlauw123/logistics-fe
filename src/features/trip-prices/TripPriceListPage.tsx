import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
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
    function handleDeleteDetail(id: string) {
        if (confirm("Are you sure you want to delete this trip price?")) {
            deleteTripPrice.mutate({id: id})
        }
    }

    if (isError) {
        return <div>Failed to load trip prices, Please reload the page</div>
    }

    return (
        <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
            <h1 className="text-2xl font-bold">Trip Prices</h1>
            <p className="text-sm text-muted-foreground">
                Manage Trip Prices.
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                New Trip Price
            </Button>
            <TripPriceFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} tripPrice={selectedTripPrice}/>
            
        </div>

        <Input
            placeholder="Search trip prices..."
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
                <TableHead>Customer</TableHead>
                <TableHead>Asal</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead className="w-[120px]">Action</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {tripPrices?.data.map((tripPrice) => (
                <TableRow key={tripPrice.id}>
                    <TableCell className="font-medium">{tripPrice.customer?.name}</TableCell>
                    <TableCell>{tripPrice.origin_sub_district?.name}, {tripPrice.origin_sub_district?.district?.name}</TableCell>
                    <TableCell>{tripPrice.destination_sub_district?.name}, {tripPrice.destination_sub_district?.district?.name}</TableCell>
                    <TableCell>{tripPrice.base_price}</TableCell>
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
                                            handleDeleteDetail(tripPrice.id)
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
                    No trip prices found.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {tripPrices?.current_page} of {tripPrices?.last_page}
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