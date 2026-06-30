import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { Download, Filter, Loader2, MoreHorizontalIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { createExportTransaction, createExportTransactionSimple, deleteTransaction, getExportTransactionStatus, getTransactions } from "./transaction.hooks"
import { transactionStatusBadge, transactionStatusStage } from "./transaction.helper"

import type { CustomerFilters } from "../customers/customer.api"
import { useCustomersQuery } from "../customers/customer.hooks"

import TransactionFormPage from "./TransactionFormPage"
import type { TransactionStatus } from "@/types"
import type { VehicleFilters } from "../vehicles/vehicle.api"
import { useVehiclesQuery } from "../vehicles/vehicle.hooks"
import { useAuthStore } from "../auth/auth.store"
import { toast } from "sonner"
import { errorHandler } from "@/lib/utils"
import { ListPaginationFooter } from "@/components/layout/ListFooter"
import { ListHeader, SearchBar } from "@/components/layout/ListHeader"

type FilterDateKey = "do_date" | "do_actual_date"

interface ExportState {
    isExporting: boolean
    jobId: string | null
    status: "idle" | "processing" | "completed" | "failed"
    error: string | null
}

interface FilterState { customer_id: string | null, dateStart: string, dateEnd: string, status: string | null, filterDateKey: FilterDateKey | null, vehicle_id: string | null }

export default function TransactionListPage() {
    const navigate = useNavigate() 
    const user = useAuthStore((state) => state.user)
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<null | "add">(null)
    const [showFilters, setShowFilters] = useState(false);
    
    const [customerKeywordSearch, setCustomerKeywordSearch] = useState<string>("")
    const [customerSearch, setCustomerSearch] = useState<CustomerFilters>({})
    const { data: customerData, isLoading: customerLoading } = useCustomersQuery(customerSearch);
    const customerOptions = customerData?.data || []
    
    const getCustomerDisplayValue = () => {
        if (customerKeywordSearch) return customerKeywordSearch;
        if (!filters.customer_id) return "";
        const selected = customerOptions.find((c) => c.id.toString() === filters.customer_id);
        return selected ? selected.name : "";
    };

    const [vehicleKeywordSearch, setVehicleKeywordSearch] = useState<string>("")
    const [vehicleSearch, setVehicleSearch] = useState<VehicleFilters>({})
    const { data: vehicleData, isLoading: vehicleLoading } = useVehiclesQuery(vehicleSearch);
    const vehicleOptions = vehicleData?.data || []
    
    const getVehicleDisplayValue = () => {
        if (vehicleKeywordSearch) return vehicleKeywordSearch;
        if (!filters.vehicle_id) return "";
        const selected = vehicleOptions.find((v) => v.id.toString() === filters.vehicle_id);
        return selected ? selected.plate_number : "";
    };

    const [filters, setFilters] = useState<FilterState>({
        customer_id: null,
        dateStart: "",
        dateEnd: "",
        filterDateKey: null,
        status: null,
        vehicle_id: null,
    })

    const [exportState, setExportState] = useState<ExportState>({
        isExporting: false,
        jobId: null,
        status: "idle",
        error: null,
    })

    const hasActiveFilters = filters.customer_id || filters.status || filters.dateStart || filters.dateEnd || search || filters.filterDateKey || filters.vehicle_id

    const { data, isError } = getTransactions({
        search: search || undefined,
        page: page,
        per_page: 15,
        customer_id: filters.customer_id || undefined,
        date_start: filters.dateStart || undefined,
        date_end: filters.dateEnd || undefined,
        status: filters.status || undefined,
        sort_by: "created_at",
        sort_dir: "desc",
        filter_date_key: filters.filterDateKey || undefined,
        vehicle_id: filters.vehicle_id || undefined,
    })

    const handleDateFilterChange = (type: FilterDateKey | null) => {
        setFilters((prev) => ({
            ...prev,
            filterDateKey: type
        }))
        setPage(1)
    }

    const clearFilters = () => {
        setFilters({
            customer_id: null,
            dateStart: "",
            dateEnd: "",
            filterDateKey: null,
            status: null,
            vehicle_id: null,
        })
        setSearch("")
        setPage(1)
    }

    // Dropdown Search Handlers
    useEffect(() => {
        const timer = setTimeout(() => {
            if (customerKeywordSearch) setCustomerSearch({ search: customerKeywordSearch })
            if (vehicleKeywordSearch) setVehicleSearch({ search: vehicleKeywordSearch })
        }, 400)
        return () => clearTimeout(timer)
    }, [customerKeywordSearch, vehicleKeywordSearch])


    if (isError) {
        return <div>Gagal memuat transaksi, Silakan muat ulang halaman</div>
    }

    const startExportTransaction = createExportTransaction();
    const startExportTransactionSimple = createExportTransactionSimple();
    const exportTransactionStatus = getExportTransactionStatus();

    
    const deleteTrans = deleteTransaction();
    
    async function handleDelete(id: string) {
        if (confirm("Yakin menghapus transaksi ini?")) {
            await deleteTrans.mutateAsync({transactionId: id})
        }
    }
    
    async function handleExport(){
        if (filters.filterDateKey === null || filters.dateStart === '' || filters.dateEnd === ''){
            toast.error('Silakan pilih filter tanggal, atur tanggal mulai & selesai sebelum mengekspor')
            return;
        }

        setExportState({
            isExporting: true,
            jobId: null,
            status: "processing",
            error: null,
        })
        try {
            const basePayload = { 
                search: search as string, // Ensure 'id' is available in this scope
                customer_id: filters.customer_id === null ? undefined : filters.customer_id,
                date_start: filters.dateStart,
                date_end: filters.dateEnd,
                filter_date_key: filters.filterDateKey === null ? undefined :filters.filterDateKey,
                vehicle_id: filters.vehicle_id === null ? undefined :filters.vehicle_id,
            }
            const response = await startExportTransaction.mutateAsync({ payload: basePayload })

            setExportState({
                isExporting: true,
                jobId: response.job_id,
                status: "processing",
                error: null,
            })
        }
        catch(error){
            errorHandler(error)
            setExportState({
                isExporting: false,
                jobId: null,
                status: "failed",
                error: "Failed to start export. Please try again.",
            })
        }
    }

    async function handleExportDetail(){
        if (filters.filterDateKey === null || filters.dateStart === '' || filters.dateEnd === ''){
            toast.error('Silakan pilih filter tanggal, atur tanggal mulai & selesai sebelum mengekspor')
            return;
        }

        setExportState({
            isExporting: true,
            jobId: null,
            status: "processing",
            error: null,
        })
        try {
            const basePayload = { 
                search: search as string, // Ensure 'id' is available in this scope
                customer_id: filters.customer_id === null ? undefined : filters.customer_id,
                date_start: filters.dateStart,
                date_end: filters.dateEnd,
                filter_date_key: filters.filterDateKey === null ? undefined :filters.filterDateKey,
                vehicle_id: filters.vehicle_id === null ? undefined :filters.vehicle_id,
            }
            const response = await startExportTransactionSimple.mutateAsync({ payload: basePayload })

            setExportState({
                isExporting: true,
                jobId: response.job_id,
                status: "processing",
                error: null,
            })
        }
        catch(error){
            errorHandler(error)
            setExportState({
                isExporting: false,
                jobId: null,
                status: "failed",
                error: "Failed to start export. Please try again.",
            })
        }
    }

    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Poll for export status
    useEffect(() => {
        // 1. Guard clause: Do nothing if there's no jobId
        if (!exportState.jobId) return;

        // 2. Local copy of the jobId to prevent race conditions during updates
        const currentJobId = exportState.jobId;

        const pollExportStatus = async () => {
            try {
                const response = await exportTransactionStatus.mutateAsync({ job_id: currentJobId });
                
                if (response.status === "completed") {
                    // Clear intervals instantly before making state changes
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }

                    window.open(`${import.meta.env.VITE_API_URL}/transactions/download-export/${currentJobId}`, '_blank', 'noopener,noreferrer');
                    
                    setExportState({
                        isExporting: false,
                        jobId: null,
                        status: "completed",
                        error: null,
                    });

                    // Smooth reset back to normal without disrupting active jobs
                    setTimeout(() => {
                        setExportState(prev => {
                            // Only reset if a new export hasn't been started in the meantime
                            if (prev.status === "completed") {
                                return { isExporting: false, jobId: null, status: "idle", error: null };
                            }
                            return prev;
                        });
                    }, 3000);

                } else if (response.status === "failed") {
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                    }

                    setExportState({
                        isExporting: false,
                        jobId: null,
                        status: "failed",
                        error: "Export failed",
                    });
                }
            } catch (error) {
                errorHandler(error);
                if (pollIntervalRef.current) {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                }
                setExportState({
                    isExporting: false,
                    jobId: null,
                    status: "failed",
                    error: "Network error checking status",
                });
            }
        };

        // 3. Prevent duplicate intervals by clearing an existing one first
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
        }

        // Run immediately on mount/id change
        pollExportStatus();

        // Setup the 1-second cadence safely
        pollIntervalRef.current = setInterval(pollExportStatus, 1000);

        // 4. Return cleanup function to run when jobId changes or component unmounts
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
        };
    }, [exportState.jobId]);

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                <ListHeader
                    user={user}
                    title="Transaksi"
                    onButtonClick={() => {
                        setModeMainAction("add")
                        setOpenMainAction(true)
                    }}
                />
                <TransactionFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} transaction={null} user={user} />
            </div>

            <SearchBar title="Transaksi" searchValue={search} onChange= {(event) => {
                setSearch(event.target.value)
                setPage(1)
            }} />
            <Button 
                size="sm"
                variant={showFilters ? "default" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
            >
                <Filter className="h-4 w-4" />
                Filters
            </Button>

            <Button 
                size="sm"
                variant="default"
                onClick={handleExport}
                disabled={exportState.isExporting}
                className="gap-2"
            >
                {exportState.isExporting && exportState.status === "processing" ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting...</>
                ) : exportState.status === "completed" ? (
                    <><Download className="mr-2 h-4 w-4" />Done!</>
                ) : ( <><Download className="mr-2 h-4 w-4" />Full Export</>
                )}
            </Button>

            <Button 
                size="sm"
                variant="default"
                onClick={handleExportDetail}
                disabled={exportState.isExporting}
                className="gap-2"
            >
                {exportState.isExporting && exportState.status === "processing" ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Exporting...</>
                ) : exportState.status === "completed" ? (
                    <><Download className="mr-2 h-4 w-4" />Done!</>
                ) : ( <><Download className="mr-2 h-4 w-4" />Export Detail</>
                )}
            </Button>

            {showFilters && (
                <div className="rounded-lg border bg-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Filter Lanjutan</h3>
                        {hasActiveFilters && (
                            <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={clearFilters}
                            >
                                <X className="h-4 w-4 mr-1" />
                                Clear All
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        {/* ================= ROW 1 ================= */}
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pelanggan</label>
                                <Combobox 
                                    items={customerOptions}
                                    value={filters.customer_id || ""}
                                    onInputValueChange={(value) => {
                                        const isJustSelected = customerOptions.some(
                                            (b) => b.id.toString() === value.toString()
                                        );
                                        
                                        if (isJustSelected) {
                                            return;
                                        }

                                        setCustomerKeywordSearch(value);
                                    }}
                                    onValueChange={(id) => {
                                        if (id){
                                            setFilters((prev) => ({
                                                ...prev,
                                                customer_id: id || null,
                                            }))
                                            setPage(1)
                                        }
                                        else setFilters((prev) => ({ ...prev, customer_id: null }));
                                        setCustomerKeywordSearch("");
                                    }}
                                >
                                    <ComboboxInput placeholder="Select a Customer" value={getCustomerDisplayValue()}/>
                                    <ComboboxContent>
                                        {customerLoading && (
                                            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Mencari database...
                                            </div>
                                        )}
                                        
                                        {!customerLoading && customerOptions.length === 0 && (
                                            <ComboboxEmpty>Pelanggan tidak ditemukan.</ComboboxEmpty>
                                        )}
                                        <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </ComboboxItem>
                                        )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kendaraan</label>
                                <Combobox 
                                    items={vehicleOptions}
                                    value={filters.vehicle_id || ""}
                                    onInputValueChange={(value) => {
                                        const isJustSelected = vehicleOptions.some(
                                            (b) => b.id.toString() === value.toString()
                                        );
                                        
                                        if (isJustSelected) {
                                            return;
                                        }

                                        setVehicleKeywordSearch(value);
                                    }}
                                    onValueChange={(id) => {
                                        if (id){
                                            setFilters((prev) => ({
                                                ...prev,
                                                vehicle_id: id || null,
                                            }))
                                            setPage(1)
                                        }
                                        else setFilters((prev) => ({ ...prev, vehicle_id: null }));
                                        setVehicleKeywordSearch("");
                                    }}
                                >
                                    <ComboboxInput placeholder="Pilih Kendaraan" value={getVehicleDisplayValue()}/>
                                    <ComboboxContent>
                                        {vehicleLoading && (
                                            <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Mencari database...
                                            </div>
                                        )}
                                        
                                        {!vehicleLoading && vehicleOptions.length === 0 && (
                                            <ComboboxEmpty>Kendaraan tidak ditemukan.</ComboboxEmpty>
                                        )}
                                        <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item.id} value={item.id.toString()}>
                                                {item.plate_number}
                                            </ComboboxItem>
                                        )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                        </div>
                        
                        {user?.role.name !== 'Staff' ? (
                            <div className="p-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Status</label>
                                    <select 
                                        value={filters.status || ""}
                                        onChange={(e) => {
                                            setFilters((prev) => ({
                                                ...prev,
                                                status: e.target.value || null,
                                            }))
                                            setPage(1)
                                        }}
                                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                    >
                                        <option value="">All Status</option>
                                        {(Object.keys(transactionStatusStage[user?.role.name as string]) as TransactionStatus[]).map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4">
                            </div>
                        )}
                        
                        <div className="p-4">
                        </div>


                        {/* ================= ROW 2 ================= */}
                        {/* Item 5: Column 1 */}
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Filter Tanggal</label>
                                <select 
                                    value={filters.filterDateKey || ""}
                                    onChange={(e) => handleDateFilterChange(e.target.value as FilterDateKey || null)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                >
                                    <option value="">No Filter</option>
                                    <option value="do_date">Tanggal DO</option>
                                    <option value="do_actual_date">Tanggal DO Actual</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Item 6: Column 2 */}
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <Input
                                    type="date"
                                    value={filters.dateStart}
                                    onChange={(e) => {
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateStart: e.target.value,
                                        }))
                                        setPage(1)
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Item 7: Column 3 */}
                        <div className="p-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Tanggal Selesai</label>
                                <Input
                                    type="date"
                                    value={filters.dateEnd}
                                    onChange={(e) => {
                                        setFilters((prev) => ({
                                            ...prev,
                                            dateEnd: e.target.value,
                                        }))
                                        setPage(1)
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Item 8: Column 4 */}
                        <div className="p-4"></div>
                    </div>
                </div>
            )}


            <div className="overflow-hidden rounded-md border bg-background">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead className="w-[120px]">Aksi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal DO Dibuat</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Supir</TableHead>
                    <TableHead>Tujuan</TableHead>
                    <TableHead>No DO</TableHead>
                    <TableHead>Tanggal Actual DO</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Asal</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data?.data.map((transaction) => (
                    <TableRow key={transaction.id}>
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
                                                navigate(`/transactions/${transaction.id}`);
                                            }}
                                        >View
                                        </DropdownMenuItem>
                                        {user?.role?.name === "Super Admin" && (
                                            <DropdownMenuItem variant="destructive"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(transaction.id)
                                                }}
                                            >Delete</DropdownMenuItem>
                                        )}

                                        
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                        <TableCell><Badge className={`${transactionStatusBadge[transaction.status]}`}>{transaction.status}</Badge></TableCell>
                        <TableCell>{transaction.do_date}</TableCell>
                        <TableCell>{transaction.vehicle_plate}</TableCell>
                        <TableCell>{transaction.driver_name}</TableCell>
                        <TableCell>{transaction.revision_destination_district}</TableCell>
                        <TableCell className="font-medium">{transaction.do_number}</TableCell>
                        <TableCell>{transaction.do_actual_date}</TableCell>
                        <TableCell>{transaction.customer_name}</TableCell>
                        <TableCell>{transaction.origin_district}</TableCell>
                    </TableRow>
                    ))}

                    {data?.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                        Transaksi tidak ditemukan.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>

            <ListPaginationFooter data={data} page={page} setPage={setPage} />
        </div>
    )
}