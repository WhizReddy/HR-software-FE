import React, {
    createContext,
    startTransition,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'
import { EventsData, EventsContextProps } from '@/Pages/Events/Interface/Events'
import { useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/Pages/Events/Hook/index'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useSearchParams } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'

const EventsContext = createContext<EventsContextProps | undefined>(undefined)

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [showEventModal, setShowEventModal] = useState<boolean>(false)
    const [selectedEvent, setSelectedEvent] = useState<EventsData | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerAction, setDrawerAction] = useState<'create' | 'edit'>('create')
    const { currentUser } = useAuth()
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
    const typesofEvent = ['sports', 'teambuilding', 'training', 'other']

    const formatDate = (date: string): string => {
        if (!date || typeof date !== 'string' || !date.includes('T')) return '';
        return date.split('T')[0].replace(/-/g, '/');
    };

    const loadEventById = useCallback(async (id: string) => {
        try {
            const res = await AxiosInstance.get(`/event/${id}`)
            startTransition(() => {
                setSelectedEvent(res.data)
                setShowEventModal(true)
            })
        } catch {
            // mute modal fetch errors here; card click should stay responsive
        }
    }, [])

    const handleSeeEventDetails = useCallback((event: EventsData) => {
        startTransition(() => {
            setSelectedEvent(event)
            setShowEventModal(true)
        })
    }, [])

    const [searchParams] = useSearchParams()

    const eventId = searchParams.get('event')

    useEffect(() => {
        if (eventId && eventId !== selectedEvent?._id) {
            void loadEventById(eventId)
        }
    }, [eventId, loadEventById, selectedEvent?._id])

    const handleOpenDrawer = (
        action: 'create' | 'edit',
        event?: EventsData,
    ) => {
        setDrawerAction(action)
        if (action === 'edit' && event) {
            handleEditClick(event._id)
        }
        setDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setDrawerOpen(false)
        if (drawerAction === 'edit') {
            handleToggleForm()
        }
    }

    const [eventPhotos, setEventPhotos] = useState<File[]>([])

    const handleFileUpload = (photo: File[]) => {
        setEventPhotos(photo)
    }

    const {
        handleChange,
        event,
        createEvent,
        isCreating,
        pollQuestion,
        pollOptions,
        handleOptionChange,
        handleAddOption,
        includesPoll,
        toastOpen,
        toastMessage,
        handleToastClose,
        toastSeverity,
        handleLocationChange,
        participants,
        setParticipants,
    } = useCreateEvent(handleCloseDrawer, eventPhotos, setEventPhotos)

    const [allEmails] = useState<string[]>([])
    const [editParticipants, setEditParticipants] = useState<string[]>([])

    const {
        editingEvent,
        includePollInEdit,
        editPollQuestion,
        editPollOptions,
        handleEditChange,
        handleEditOptionChange,
        handleAddEditOption,
        updateEvent,
        toggleForm,
        handleEditClick,
        handleToggleForm,
        handleUpdateToastClose,
        updateToastMessage,
        updateToastOpen,
        updateToastSeverity,
        editType,
        setEditType,
    } = useUpdateEvent(handleCloseDrawer, eventPhotos, setEventPhotos)

    const {
        handleDelete,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
    } = useDeleteEvent()

    return (
        <EventsContext.Provider
            value={{
                handleLocationChange,
                createEvent,
                isCreating,
                updateEvent,
                handleDelete,
                handleEditChange,
                handleOptionChange,
                handleAddOption,
                handleAddEditOption,
                event,
                editingEvent,
                includesPoll,
                includePollInEdit,
                handleChange,
                handleEditClick,
                handleEditOptionChange,
                toggleForm,
                handleToggleForm,
                handleToastClose,
                handleUpdateToastClose,
                showModal,
                closeModal,
                handleDeleteEventModal,
                showEventModal,
                setShowEventModal,
                selectedEvent,
                setSelectedEvent,
                updateToastMessage,
                updateToastOpen,
                updateToastSeverity,
                editPollQuestion,
                editPollOptions,
                type: event.type,
                pollQuestion,
                pollOptions,
                toastOpen,
                toastMessage,
                toastSeverity,
                endDate: event.endDate,
                isAdmin,
                typesofEvent,
                eventToDeleteId,
                handleSeeEventDetails,
                drawerOpen,
                handleOpenDrawer,
                handleCloseDrawer,
                editType,
                setEditType,
                handleFileUpload,
                eventPhotos,
                formatDate,
                allEmails,
                participants,
                setParticipants,
                editParticipants,
                setEditParticipants
            }}
        >
            {children}
        </EventsContext.Provider>
    )
}

export const useEvents = () => {
    const context = useContext(EventsContext)
    if (context === undefined) {
        throw new Error('useEvents must be used within an EventsProvider')
    }
    return context
}
