import {
    createContext,
    type Dispatch,
    type FC,
    type ReactNode,
    type SetStateAction,
    useState,
} from 'react'

interface LoginContextType {
    error: string | null
    setError: Dispatch<SetStateAction<string | null>>
    showPassword: boolean
    setShowPassword: Dispatch<SetStateAction<boolean>>
    checkingIsAuthenticated: boolean
    setCheckingIsAuthenticated: Dispatch<SetStateAction<boolean>>
}

const defaultContextValue: LoginContextType = {
    error: null,
    setError: () => {},
    showPassword: false,
    setShowPassword: () => {},
    checkingIsAuthenticated: true,
    setCheckingIsAuthenticated: () => {},
}

export const LoginContext = createContext<LoginContextType>(defaultContextValue)

export const LoginProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [error, setError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [checkingIsAuthenticated, setCheckingIsAuthenticated] = useState(true)

    return (
        <LoginContext.Provider
            value={{
                error,
                setError,
                showPassword,
                setShowPassword,
                checkingIsAuthenticated,
                setCheckingIsAuthenticated,
            }}
        >
            {children}
        </LoginContext.Provider>
    )
}
