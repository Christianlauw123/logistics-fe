import { api } from "../../lib/api"
import type { User } from "../../types"

export type LoginInput = {
    email: string
    password: string,
    device_type?: string
}

export async function login(input: LoginInput) {
    const finalInput: LoginInput = {...input, device_type: "web"}
    const response = await api.post<{ user: User; message: string }>("/auth/login", finalInput)
    return response.data.user
}

export async function getMe() {
  const response = await api.get<{ user: User }>("/auth/me")

  return response.data.user
}

export async function logout() {
    await api.post("/auth/logout")
}