import { useState, useEffect } from 'react'
import AxiosInstance from '@/Helpers/Axios'

export interface EventsData {
    _id: number
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

    const fetchEvents = () => {
        setIsLoading(true)
        AxiosInstance.get<EventsData[]>('/event/career')
            .then((response) => {
                console.log('Fetched gertiii:', response.data)
                setTimeout(() => {
                    setIsLoading(false)
                }, 500)
                const careerEvents = response.data.filter(
                    (event) => event.type === 'career',
                )
                setEvents(careerEvents)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
            })
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

    const createEvent = () => {
        setCreateEventError(null)

        const newEvent = { ...event }

        console.log('Creating event with data:', newEvent)

        AxiosInstance.post('/event', newEvent)
            .then((response) => {
                console.log('Event created successfully:', response.data)
                setEvents((prevEvents) => [...prevEvents, response.data])
                setEvent({
                    title: '',
                    description: '',
                    location: '',
                    type: EventType.CAREER,
                })
            })
            .catch((error) => {
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
            })
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
            console.log('Event updated successfully:', response.data)
            setEvents((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === editingEvent._id ? response.data : event,
                ),
            )
            toggleForm()
        } catch (error) {
            console.error('Error updating event:', error)
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
    const [eventToDeleteId, setEventToDeleteId] = useState<number | null>(null)

    const handleDeleteEventModal = (eventId: number) => {
        setEventToDeleteId(eventId)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEventToDeleteId(null)
    }

    const handleDelete = (eventId: number | null) => {
        if (eventId === null) return

        AxiosInstance.delete(`/event/${eventId}`)
            .then(() => {
                console.log('Event deleted successfully')
                setEvents((prevEvents) =>
                    prevEvents.filter((event) => event._id !== eventId),
                )
                closeModal()
            })
            .catch((error) => {
                console.error('Error deleting event:', error)
            })
    }

    return {
        handleDelete,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
    }
}
