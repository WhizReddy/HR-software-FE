import { UseMutateFunction } from '@tanstack/react-query'

export interface EventsData {
    _id: string
    title: string
    description: string
    startDate: string
    endDate: string
    email: string[]
    time: string
    creatingTime: string
    file: string
    location: string
    type: string
    photo: string[]
    participants: string[]
    totalPages: number
    onClose: () => void
}

export interface EventsCreationData {
    title: string
    description: string
    startDate: string
    endDate: string
    location: string

    participants: string[]
    photo: File[]
    type: string
}

export interface EventsContextProps {
    createEvent: UseMutateFunction<any, Error, void, unknown>
    isCreating: boolean
    updateEvent: UseMutateFunction<any, Error, void, unknown>
    isUpdating: boolean
    handleDelete: (id: string | number) => void
    handleEditChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    setParticipants: React.Dispatch<React.SetStateAction<string[]>>
    participants: string[]
    event: EventsCreationData
    editingEvent: EventsData | null
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleEditClick: (event: EventsData['_id']) => void
    toggleForm: () => void
    handleToggleForm: () => void
    handleToastClose: () => void
    handleUpdateToastClose: () => void
    showModal: boolean
    closeModal: () => void
    handleDeleteEventModal: (eventToDeleteId: string | number) => void
    showEventModal: boolean
    setShowEventModal: React.Dispatch<React.SetStateAction<boolean>>
    selectedEvent: EventsData | null
    setSelectedEvent: React.Dispatch<React.SetStateAction<EventsData | null>>
    selectedEventError: string | null
    isSelectedEventLoading: boolean
    retrySelectedEvent: () => void
    updateToastMessage: string
    updateToastOpen: boolean
    updateToastSeverity: 'success' | 'error'
    setEditParticipants: React.Dispatch<React.SetStateAction<string[]>>
    type: string
    toastOpen: boolean
    toastMessage: string
    toastSeverity: 'success' | 'error'
    endDate: string
    isAdmin: boolean
    typesofEvent: string[]
    allEmails: string[]
    eventToDeleteId: string | number
    handleSeeEventDetails: (event: EventsData) => void
    handleCloseEventDetails: () => void
    drawerOpen: boolean
    handleOpenDrawer: (action: 'create' | 'edit', event?: EventsData) => void
    editParticipants: string[]
    handleCloseDrawer: () => void
    setEditType: React.Dispatch<React.SetStateAction<string>>
    editType: string
    handleFileUpload: (files: File[]) => void
    eventPhotos: File[]
    handleLocationChange: (address: string) => void
    hideToast?: () => void
    formatDate: (date: string) => string
}
