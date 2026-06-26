import {
    createContext,
    ReactNode,
    Dispatch,
    SetStateAction,
    FC,
    useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

type SearchParamUpdater =
    | URLSearchParams
    | ((prev: URLSearchParams) => URLSearchParams)

type SearchParamSetter = (
    nextInit: SearchParamUpdater,
    navigateOptions?: { replace?: boolean },
) => void

interface VacationContextType {
    errors: {
        createError: string | null
        updateError: string | null
    }
    setErrors: Dispatch<
        SetStateAction<{
            createError: string | null
            updateError: string | null
        }>
    >
    searchParams: URLSearchParams
    setSearchParams: SearchParamSetter
    handleOpenViewVacationModalOpen: (id: string) => void
    handleCloseVacationModalOpen: () => void
    createVacationToggler: () => void
    toastConfigs: {
        message: string | null
        severity: 'success' | 'error'
        isOpen: boolean
    }
    setToastConfigs: Dispatch<
        SetStateAction<{
            message: string | null
            severity: 'success' | 'error'
            isOpen: boolean
        }>
    >
    handleToastClose: () => void
}

const defaultContextValue: VacationContextType = {
    errors: {
        createError: null,
        updateError: null,
    },
    setErrors: () => {},
    searchParams: new URLSearchParams(),
    setSearchParams: () => {},
    handleOpenViewVacationModalOpen: () => {},
    handleCloseVacationModalOpen: () => {},
    createVacationToggler: () => {},
    toastConfigs: {
        message: null,
        severity: 'success',
        isOpen: false,
    },
    setToastConfigs: () => {},
    handleToastClose: () => {},
}

export const VacationContext =
    createContext<VacationContextType>(defaultContextValue)

export const VacationProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [errors, setErrors] = useState<{
        createError: string | null
        updateError: string | null
    }>({
        createError: null,
        updateError: null,
    })
    const [searchParams, setSearchParams] = useSearchParams()
    const createVacationToggler = () => {
        if (searchParams.get('createVacation') === null) {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev)
                newParams.set('createVacation', 'true')
                return newParams
            })
        } else {
            setSearchParams((prev) => {
                const newParams = new URLSearchParams(prev)
                newParams.delete('createVacation')
                return newParams
            })
        }
    }

    const handleOpenViewVacationModalOpen = (id: string) => {
        setSearchParams((prev) => {
            const newParams = new URLSearchParams(prev)
            newParams.set('selectedVacation', id)
            return newParams
        })
    }
    const handleCloseVacationModalOpen = () => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams)
            newParams.delete('selectedVacation')
            return newParams
        })
    }
    const [toastConfigs, setToastConfigs] = useState<{
        message: string | null
        severity: 'success' | 'error'
        isOpen: boolean
    }>({
        message: null,
        severity: 'success',
        isOpen: false,
    })

    const handleToastClose = () => {
        setToastConfigs({
            isOpen: false,
            message: null,
            severity: 'success',
        })
    }

    return (
        <VacationContext.Provider
            value={{
                errors,
                setErrors,
                searchParams,
                setSearchParams,
                handleOpenViewVacationModalOpen,
                handleCloseVacationModalOpen,
                createVacationToggler,
                toastConfigs,
                setToastConfigs,
                handleToastClose,
            }}
        >
            {children}
        </VacationContext.Provider>
    )
}
