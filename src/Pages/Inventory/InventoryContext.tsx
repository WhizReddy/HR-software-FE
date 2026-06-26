import {
    createContext,
    ReactNode,
    useState,
    Dispatch,
    SetStateAction,
    FC,
} from 'react'
import { useSearchParams } from 'react-router-dom'

type SearchParamUpdater =
    | URLSearchParams
    | ((prev: URLSearchParams) => URLSearchParams)

type SearchParamSetter = (
    nextInit: SearchParamUpdater,
    navigateOptions?: { replace?: boolean },
) => void

interface AssetContextType {
    error: string | null
    setError: Dispatch<SetStateAction<string | null>>
    createModalOpen: boolean
    handleCloseCreateModalOpen: () => void
    handleOpenCreateModalOpen: () => void
    viewAssetModalOpen: boolean
    handleCloseViewAssetModalOpen: () => void
    handleOpenViewAssetModalOpen: () => void
    searchParams: URLSearchParams
    setSearchParams: SearchParamSetter
}

const defaultContextValue: AssetContextType = {
    error: null,
    setError: () => {},
    searchParams: new URLSearchParams(),
    setSearchParams: () => {},
    createModalOpen: false,
    handleCloseCreateModalOpen: () => {},
    handleOpenCreateModalOpen: () => {},
    viewAssetModalOpen: false,
    handleCloseViewAssetModalOpen: () => {},
    handleOpenViewAssetModalOpen: () => {},
}

export const InventoryContext =
    createContext<AssetContextType>(defaultContextValue)

export const InventoryProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [error, setError] = useState<string | null>(null)
    const [createModalOpen, setCreateModalOpen] = useState<boolean>(false)
    const handleCloseCreateModalOpen = () => setCreateModalOpen(false)
    const handleOpenCreateModalOpen = () => setCreateModalOpen(true)
    const [viewAssetModalOpen, setViewAssetModalOpen] = useState<boolean>(false)
    const handleCloseViewAssetModalOpen = () => setViewAssetModalOpen(false)
    const handleOpenViewAssetModalOpen = () => setViewAssetModalOpen(true)
    const [searchParams, setSearchParams] = useSearchParams()

    return (
        <InventoryContext.Provider
            value={{
                error,
                setError,
                searchParams,
                setSearchParams,
                createModalOpen,
                handleCloseCreateModalOpen,
                handleOpenCreateModalOpen,
                viewAssetModalOpen,
                handleCloseViewAssetModalOpen,
                handleOpenViewAssetModalOpen,
            }}
        >
            {children}
        </InventoryContext.Provider>
    )
}
