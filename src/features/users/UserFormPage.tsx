import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUserCreateQuery, useUserUpdateQuery } from "../users/user.hooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { errorHandler } from "@/lib/utils";
import type { RoleFilters } from "../roles/role.api";
import { useRolesQuery } from "../roles/role.hooks";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuthStore } from "../auth/auth.store";
import { logout } from "../auth/auth.api";

export default function UserFormPage({ openMainAction, setOpenMainAction, mode, user }: { openMainAction: boolean; setOpenMainAction: (openMainAction: boolean) => void; mode: "add" | "edit"; user: any }) {
    const [userId, setUserId] = useState<string>("")
    const [loading, setLoading] = useState(false);
    const [roleId, setRoleId] = useState<string>("")
    const [roleSearch, setRoleSearch] = useState<RoleFilters>({})
    const [roleKeywordSearch, setRoleKeywordSearch] = useState<string>("")
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const createUser = useUserCreateQuery();
    const updateUser = useUserUpdateQuery();

    // Fetch Query
    const { data: roleData, isLoading: roleLoading } = useRolesQuery(roleSearch);

    const roleOptions = roleData?.data || []

    // Displaying Value Handler
    const getRoleDisplayValue = () => {
        if (roleKeywordSearch) return roleKeywordSearch;
        if (!roleId) return "";
        
        const selected = roleOptions.find((r) => r.id.toString() === roleId.toString());
        return selected ? selected.name : "";
    };

    // Dropdown Search Handlers
    useEffect(() => {
        const timer = setTimeout(() => {
            if (roleKeywordSearch) setRoleSearch({ search: roleKeywordSearch })
        }, 400)
        return () => clearTimeout(timer)
    }, [roleKeywordSearch])

    // Set Logout
    const setUser = useAuthStore((state) => state.setUser)
    
    async function handleLogout() {
        await logout()
        setUser(null)
        window.location.href = "/login"
    }

    // Add Edit
    useEffect(() => {
        if (mode === "edit" && user) {
            setUserId(user.id?.toString() || "")
            setRoleId(user.role_id?.toString() || "")

            if (user.role_id) setRoleSearch({ id: user.role_id })
        } else {
            // Completely reset fields when user opens an "Add New" form
            setUserId("")
            setRoleId("")
        }
    }, [mode, user?.id])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        if (mode === "edit" && !userId) {
            setLoading(false);
            setOpenMainAction(false); 
            toast.error("User ID tidak ditemukan")
            return
        }

        // 1. Gather all inputs automatically via the form DOM element
        const formData = new FormData(event.currentTarget);
        const rawData = Object.fromEntries(formData.entries());
        const basePayload = { 
            name: rawData.name as string | undefined,
            email: rawData.email as string | undefined,
            password: rawData.password as string | undefined,
            password_confirmation: rawData.password_confirmation as string | undefined,
            role_id: roleId || undefined,
        }

        try {
            if (mode === "add") {
                // Call create API here with basePayload
                // await createTransaction.mutateAsync(basePayload);
                await createUser.mutateAsync({ ...basePayload })
            } else if (mode === "edit") {
                await updateUser.mutateAsync({ id: user?.id, payload: basePayload })
                if (basePayload.password !== ""){
                    handleLogout()
                }
            }
            setOpenMainAction(false); // Close dialog
        } catch (error) {
            errorHandler(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={openMainAction} onOpenChange={setOpenMainAction}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{mode === "add" ? "Add" : "Edit"} User</DialogTitle>
                </DialogHeader>
                

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-xs font-medium">Nama</label>
                        <Input id="name" defaultValue={user?.name || ""} name="name" placeholder="e.g. John Doe" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-xs font-medium">Email</label>
                        <Input id="email" defaultValue={user?.email || ""} name="email" placeholder="e.g. john.doe@example.com" required />
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="purpose" className="text-xs font-medium">Role</label>
                        <Combobox 
                            items={roleOptions}
                            value={roleId}
                            onInputValueChange={(value) => {
                                const isJustSelected = roleOptions.some(
                                    (b) => b.id.toString() === value.toString()
                                );
                                
                                if (isJustSelected) {
                                    return;
                                }

                                setRoleKeywordSearch(value);
                            }}
                            onValueChange={(id) => {
                                if (id) setRoleId(id.toString())
                                else setRoleId("");
                                setRoleKeywordSearch("");
                            }}
                        >
                            <ComboboxInput placeholder="Select a role" value={getRoleDisplayValue()}/>
                            <ComboboxContent>
                                {roleLoading && (
                                    <div className="flex items-center justify-center p-4 text-sm text-muted-foreground gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Mencari di database...
                                    </div>
                                )}
                                
                                {!roleLoading && roleOptions.length === 0 && (
                                    <ComboboxEmpty>Tidak ditemukan.</ComboboxEmpty>
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
                    <div className="space-y-1">
                        <label htmlFor="password" className="text-xs font-medium">Password</label>
                        <div className="relative flex items-center">
                            <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            name="password"
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="e.g. ********"
                            className="pr-10" // Prevents password characters from slipping under the eye icon
                            />
                            <button
                            type="button" 
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-3 text-red-400 hover:text-red-600 focus:outline-none transition-colors"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label htmlFor="password_confirmation" className="text-xs font-medium">Password Confirmation</label>
                        <div className="relative flex items-center">
                            <Input
                            type={showPasswordConfirmation ? "text" : "password"}
                            value={passwordConfirmation}
                            name="password_confirmation"
                            onChange={(event) => setPasswordConfirmation(event.target.value)}
                            placeholder="e.g. ********"
                            className="pr-10" // Prevents password characters from slipping under the eye icon
                            />
                            <button
                            type="button" 
                            onClick={() => setShowPasswordConfirmation((prev) => !prev)}
                            className="absolute right-3 text-red-400 hover:text-red-600 focus:outline-none transition-colors"
                            aria-label={showPasswordConfirmation ? "Hide password" : "Show password"}
                            >
                            {showPasswordConfirmation ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
                        <Button type="button" variant="outline" onClick={() => setOpenMainAction(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Submitting..." : "Save"}</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}