import { useState, useEffect } from 'react'
import AxiosInstance from '@/Helpers/Axios'

export interface EventsData {
    _id: string
    title: string
    description: string
    location: string
    type: string
}

export interface EventsCreationData {
    title: string
    description: string
    location: string
    type: string
}

export enum EventType {
    SPORTS = 'sports',
    CAREER = 'career',
    TRAINING = 'training',
    TEAMBUILDING = 'teambuilding',
    OTHER = 'other',
}

// Hook to fetch all events
export const useGetAllEvents = () => {
    const [events, setEvents] = useState<EventsData[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchEvents = async () => {
        setIsLoading(true)
        try {
            const response = await AxiosInstance.get<EventsData[]>(
                '/event/career',
            )
            const careerEvents = response.data.filter(
                (event) => event.type === 'career',
            )
            setEvents(careerEvents)
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return { events, setEvents, fetchEvents, isLoading }
}

// Hook to create an event
export const useCreateEvent = (
    setEvents: React.Dispatch<React.SetStateAction<EventsData[]>>,
) => {
    const [createEventError, setCreateEventError] = useState<string | null>(
        null,
    )
    const [event, setEvent] = useState<EventsCreationData>({
        title: '',
        description: '',
        location: '',
        type: EventType.CAREER,
    })

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setEvent((prevEvent) => ({
            ...prevEvent,
            [name]: value,
        }))
    }

    const createEvent = async () => {
        setCreateEventError(null)

        try {
            const response = await AxiosInstance.post('/event', { ...event })
            setEvents((prevEvents) => [response.data, ...prevEvents])
            setEvent({
                title: '',
                description: '',
                location: '',
                type: EventType.CAREER,
            })
            return true
        } catch (error: any) {
            console.error('Error creating event:', error)
            if (error.response && error.response.data) {
                console.error(
                    'Backend error response:',
                    error.response.data,
                )
                setCreateEventError(
                    error.response.data.message ||
                    'Failed to create event. Please try again.',
                )
            } else {
                setCreateEventError(
                    'Failed to create event. Please try again.',
                )
            }
            return false
        }
    }

    return { createEvent, handleChange, event, createEventError }
}

// Hook to update an event
export const useUpdateEvent = (
    setEvents: React.Dispatch<React.SetStateAction<EventsData[]>>,
) => {
    const [editingEvent, setEditingEvent] = useState<EventsData | null>(null)
    const [showForm, setShowForm] = useState(false)

    const handleEditClick = (event: EventsData) => {
        setEditingEvent(event)
        setShowForm(true)
    }

    const toggleForm = () => {
        setEditingEvent(null)
        setShowForm(false)
    }

    const handleEditChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        if (editingEvent) {
            setEditingEvent((prevEvent) => ({
                ...prevEvent!,
                [name]: value,
            }))
        }
    }

    const updateEvent = async () => {
        if (!editingEvent) return

        const updatedEvent = {
            title: editingEvent.title,
            description: editingEvent.description,
            location: editingEvent.location,
            type: editingEvent.type,
        }

        try {
            const response = await AxiosInstance.patch(
                `/event/${editingEvent._id}`,
                updatedEvent,
            )
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === editingEvent._id ? response.data : event,
                ),
            )
            toggleForm()
            return true
        } catch (error) {
            console.error('Error updating event:', error)
            return false
        }
    }

    return {
        editingEvent,
        setEditingEvent,
        showForm,
        handleEditChange,
        handleEditClick,
        updateEvent,
        toggleForm,
    }
}

// Hook to delete an event
export const useDeleteEvent = (
    setEvents: React.Dispatch<React.SetStateAction<EventsData[]>>,
) => {
    const [showModal, setShowModal] = useState(false)
    const [eventToDeleteId, setEventToDeleteId] = useState<string | null>(null)

    const handleDeleteEventModal = (eventId: string) => {
        setEventToDeleteId(eventId)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEventToDeleteId(null)
    }

    const handleDelete = async (eventId: string | null) => {
        if (eventId === null) return

        try {
            await AxiosInstance.delete(`/event/${eventId}`)
            setEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== eventId),
            )
            closeModal()
            return true
        } catch (error) {
            console.error('Error deleting event:', error)
            return false
        }
    }

    return {
        handleDelete,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
    }
}
