import React, {
    createContext,
    startTransition,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import { EventsData, EventsContextProps } from '@/Pages/Events/Interface/Events'
import {
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
} from '@/Pages/Events/Hook/index'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useSearchParams } from 'react-router-dom'
import AxiosInstance from '@/Helpers/Axios'

const EventsContext = createContext<EventsContextProps | undefined>(undefined)

export const EventsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [showEventModal, setShowEventModal] = useState<boolean>(false)
    const [selectedEvent, setSelectedEvent] = useState<EventsData | null>(null)
    const [selectedEventError, setSelectedEventError] = useState<string | null>(
        null,
    )
    const [isSelectedEventLoading, setIsSelectedEventLoading] = useState(false)
    const closingEventIdRef = useRef<string | null>(null)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerAction, setDrawerAction] = useState<'create' | 'edit'>(
        'create',
    )
    const { currentUser } = useAuth()
    const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'hr'
    const typesofEvent = ['sports', 'teambuilding', 'training', 'other']

    const formatDate = (date: string): string => {
        if (!date || typeof date !== 'string' || !date.includes('T')) return ''
        return date.split('T')[0].replace(/-/g, '/')
    }

    const loadEventById = useCallback(async (id: string) => {
        setShowEventModal(true)
        setIsSelectedEventLoading(true)
        setSelectedEventError(null)
        try {
            const res = await AxiosInstance.get(`/event/${id}`)
            startTransition(() => {
                setSelectedEvent(res.data)
                setShowEventModal(true)
            })
        } catch {
            setSelectedEvent(null)
            setSelectedEventError('Event details could not be loaded.')
        } finally {
            setIsSelectedEventLoading(false)
        }
    }, [])

    const [searchParams, setSearchParams] = useSearchParams()

    const eventId = searchParams.get('event')

    const handleSeeEventDetails = useCallback(
        (event: EventsData) => {
            closingEventIdRef.current = null
            setSelectedEventError(null)
            setIsSelectedEventLoading(false)
            setSearchParams(
                (prev) => {
                    const next = new URLSearchParams(prev)
                    next.set('event', event._id.toString())
                    return next
                },
                { replace: true },
            )
            startTransition(() => {
                setSelectedEvent(event)
                setShowEventModal(true)
            })
        },
        [setSearchParams],
    )

    const handleCloseEventDetails = useCallback(() => {
        closingEventIdRef.current = selectedEvent?._id || eventId
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev)
                next.delete('event')
                return next
            },
            { replace: true },
        )
        setSelectedEvent(null)
        setSelectedEventError(null)
        setIsSelectedEventLoading(false)
        setShowEventModal(false)
    }, [eventId, selectedEvent?._id, setSearchParams])

    const retrySelectedEvent = useCallback(() => {
        if (eventId) {
            void loadEventById(eventId)
        }
    }, [eventId, loadEventById])

    useEffect(() => {
        if (!eventId) {
            closingEventIdRef.current = null
            return
        }

        if (
            eventId &&
            eventId !== selectedEvent?._id &&
            eventId !== closingEventIdRef.current
        ) {
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
        handleEditChange,
        updateEvent,
        toggleForm,
        handleEditClick,
        handleToggleForm,
        handleUpdateToastClose,
        updateToastMessage,
        updateToastOpen,
        updateToastSeverity,
        isUpdating,
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
                isUpdating,
                handleDelete,
                handleEditChange,
                event,
                editingEvent,
                handleChange,
                handleEditClick,
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
                selectedEventError,
                isSelectedEventLoading,
                retrySelectedEvent,
                updateToastMessage,
                updateToastOpen,
                updateToastSeverity,
                type: event.type,
                toastOpen,
                toastMessage,
                toastSeverity,
                endDate: event.endDate,
                isAdmin,
                typesofEvent,
                eventToDeleteId,
                handleSeeEventDetails,
                handleCloseEventDetails,
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
                setEditParticipants,
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
