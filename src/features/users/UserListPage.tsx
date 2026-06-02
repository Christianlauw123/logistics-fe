import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontalIcon } from "lucide-react"
import { useUserDeleteQuery, useUsersQuery } from "./user.hooks"
import UserFormPage from "./UserFormPage"

export default function UserListPage() {
    const [search, setSearch] = useState("")
    const [page, setPage] = useState(1)
    const [openMainAction, setOpenMainAction] = useState(false);
    const [modeMainAction, setModeMainAction] = useState<"add" | "edit">("add")
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const { data: users, isError } = useUsersQuery({
        search,
        page,
        per_page: 5,
    })

    const deleteUser = useUserDeleteQuery();
    async function handleDelete(id: string) {
        if (confirm("Yakin menghapus user ini?")) {
            await deleteUser.mutateAsync({id: id})
        }
    }

    if (isError) {
        return <div>Gagal memuat users, Silakan muat ulang halaman</div>
    }

    return (
        <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">
                Pengaturan Users.
            </p>
            </div>

            <Button size="sm" onClick={() => {
                setModeMainAction("add")
                setOpenMainAction(true)
            }}>
                Tambah User
            </Button>
            <UserFormPage openMainAction={openMainAction} setOpenMainAction={setOpenMainAction} mode={modeMainAction!} user={selectedUser}/>
            
        </div>

        <Input
            placeholder="Mencari users..."
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
                <TableHead>Nama</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[120px]">Aksi</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {users?.data.map((user) => (
                <TableRow key={user.id}>
                    <TableCell className="font-medium">
                    {user.name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role?.name}</TableCell>
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
                                            setSelectedUser(user);
                                            setModeMainAction("edit");
                                            setOpenMainAction(true);
                                        }}
                                    >Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(user.id)
                                        }}
                                    >Delete</DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}

                {users?.data.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada users ditemukan.
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>

        <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
            Page {page} of {users?.last_page}
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
                disabled={!users || page >= users.last_page}
                onClick={() => setPage((value) => value + 1)}
            >
                Next
            </Button>
            </div>
        </div>
        </div>
    )
}