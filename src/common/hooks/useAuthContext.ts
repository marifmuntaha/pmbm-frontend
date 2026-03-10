import { createContext, use } from "react"
import type { UserType } from "@/types"

interface AuthContextInterface {
    isLogged: boolean
    setIsLogged?: any
    user: UserType | undefined
    setUser?: any
}

const INIT: AuthContextInterface = {
    isLogged: false,
    user: undefined,
}

export const AuthContext = createContext<AuthContextInterface>(INIT)

export function useAuthContext() {
    const context = use(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthContext')
    }
    return context
}

