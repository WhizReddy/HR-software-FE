import { useEffect, useState } from 'react'
import AxiosInstance from '@/Helpers/Axios'
import { EventsCreationData, EventsData } from '../Interface/Events'
import { useSearchParams } from 'react-router-dom'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchEvents } from '../utils/utils'

export const useGetAllEvents = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [searchEvent, setSearchEvent] = useState(searchParams.get('search') || '')

    const query = useInfiniteQuery({
        queryKey: ['events', searchEvent],
        queryFn: ({ pageParam = 0 }) =>
            fetchEvents(searchEvent || '', pageParam),
        initialPageParam: 0,
        getNextPageParam: (lastPage: any, allPages) => {
            if (lastPage?.data && lastPage.data.length < 6) {
                return undefined
            }
            return allPages.length
        },
    })

    const search = ((value: string) => {
        setSearchParams((prev: URLSearchParams) => {
            const newParams = new URLSearchParams(prev)
            if (value) {
                newParams.set('search', value)
            } else {
                newParams.delete('search')
            }
            return newParams
        })
    })

    const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchEvent(e.target.value)
        search(e.target.value)
    }

    useEffect(() => {
        setSearchEvent(searchParams.get('search') || '')
    }, [searchParams])


    return {
        ...query,
        searchEvent,
        onSearchChange,
    }
}

export const useCreateEvent = (handleCloseDrawer: () => void = () => { }) => {
    const queryClient = useQueryClient()
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')
    const [eventPhotos, setEventPhotos] = useState<File[]>([])
    const [createdEvents, setCreatedEvents] = useState<EventsData[]>([])

    const [event, setEvent] = useState<EventsCreationData>({
        title: '',
        description: '',
        endDate: '',
        startDate: '',
        location: '',
        photo: [],
        participants: [],
        type: '',
        poll: {
            question: '',
            options: [],
        },
    })
    const [pollQuestion, setPollQuestion] = useState('')
    const [pollOptions, setPollOptions] = useState<string[]>(['', ''])
    const [includesPoll, setIncludesPoll] = useState(false)
    const [participants, setParticipants] = useState<string[]>([])

    const createEventMutation = useMutation({
        mutationFn: async () => {
            // Guard: endDate must be after startDate
            if (event.startDate && event.endDate && new Date(event.endDate) <= new Date(event.startDate)) {
                throw new Error('End date and time must be after the start date')
            }

            const formData = new FormData()
            formData.append('title', event.title)
            formData.append('description', event.description)
            formData.append('startDate', event.startDate)
            formData.append('endDate', event.endDate)
            formData.append('location', event.location)
            formData.append('type', event.type)
            participants.forEach((participant, index) => {
                formData.append(`participants[${index}]`, participant)
            })
            if (includesPoll) {
                formData.append(
                    'poll',
                    JSON.stringify({
                        question: pollQuestion,
                        options: pollOptions
                            .filter((option) => option.trim() !== '')
                            .map((option) => ({
                                option,
                                votes: 0,
                                voters: [],
                            })),
                    }),
                )
            }
            eventPhotos.forEach((photo) => {
                formData.append('photo', photo)
            })
            const response = await AxiosInstance.post('event', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            return response.data
        },
        onSuccess: (data) => {
            setToastMessage('Event created successfully')
            setToastOpen(true)
            setToastSeverity('success')
            setCreatedEvents((prevEvents) => [...prevEvents, data])

            queryClient.invalidateQueries({
                queryKey: ['events'],
            })

            setEvent({
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                location: '',
                type: '',
                photo: [],
                participants: [],
                poll: { question: '', options: [] },
            })
            setPollQuestion('')
            setPollOptions(['', ''])
            setParticipants([])
            setEventPhotos([])
            handleCloseDrawer()
        },
        onError: (error: Error) => {
            console.error('Error creating event', error)
            setToastMessage('Error creating event')
            setToastSeverity('error')
            setToastOpen(true)
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        if (name === 'participants') {
            setParticipants(value.split(',').map((_id) => _id.trim()))
        } else if (name === 'includesPoll') {
            setIncludesPoll(e.target.checked)
        } else if (name === 'pollQuestion') {
            setPollQuestion(value)
        } else if (name === 'location') {
            setEvent((prevEvent) => ({
                ...prevEvent,

                location: value,
            }))
        } else {
            setEvent((prevEvent) => ({
                ...prevEvent,
                [name]: value,
            }))
        }
    }

    const handleLocationChange = (address: string) => {
        setEvent((prevEvent) => ({
            ...prevEvent,
            location: address,
        }))
    }

    const handleFileUpload = (photo: File[]) => {
        setEventPhotos(photo)
    }

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...pollOptions]
        newOptions[index] = value
        setPollOptions(newOptions)
    }

    const handleAddOption = () => {
        if (pollOptions.length < 3) {
            setPollOptions([...pollOptions, ''])
        }
    }

    const handleToastClose = () => {
        setToastOpen(false)
    }

    return {
        createEvent: createEventMutation.mutate,
        handleChange,
        event,
        endDate: event.endDate,
        pollQuestion,
        pollOptions,
        handleOptionChange,
        handleAddOption,
        includesPoll,
        participants,
        setParticipants,
        type: event.type,
        toastOpen,
        toastMessage,
        handleToastClose,
        toastSeverity,
        handleFileUpload,
        eventPhotos,
        handleLocationChange,
        createdEvents,
    }
}

export const useUpdateEvent = (handleCloseDrawer: () => void = () => { }) => {
    const queryClient = useQueryClient()
    const [editingEvent, setEditingEvent] = useState<EventsData | null>(null)
    const [showEditDrawer, setEditDrawer] = useState(false)
    const [includePollInEdit, setIncludePollInEdit] = useState(false)
    const [editPollQuestion, setEditPollQuestion] = useState('')
    const [editPollOptions, setEditPollOptions] = useState<string[]>(['', ''])
    const [updateToastOpen, setUpdateToastOpen] = useState(false)
    const [updateToastMessage, setUpdateToastMessage] = useState('')
    const [updatedEvent, setUpdatedEvent] = useState<EventsData[]>([])
    const [updateToastSeverity, setUpdateToastSeverity] = useState<
        'success' | 'error'
    >('success')
    const [editParticipants, setEditParticipants] = useState<string[]>([])
    const [editType, setEditType] = useState<string>('')

    const toggleForm = () => {
        setEditDrawer(!showEditDrawer)
        setEditingEvent(null)
        resetEditPollState()
    }

    const resetEditPollState = () => {
        setIncludePollInEdit(false)
        setEditPollQuestion('')
        setEditPollOptions(['', ''])
    }

    const handleEditClick = (eventToEdit: EventsData['_id']) => {
        AxiosInstance.get(`/event/${eventToEdit}`).then((response) => {
            setEditingEvent(response.data)
            setEditParticipants(response.data.participants)
            setEditType(response.data.type)
            setIncludePollInEdit(!!response.data.poll)
            if (response.data.poll) {
                setEditPollQuestion(response.data.poll.question)
                setEditPollOptions(
                    response.data.poll.options.map(
                        (opt: { option: string[] }) => opt.option,
                    ),
                )
            } else {
                resetEditPollState()
            }
            setEditDrawer(true)
        })
    }

    const handleToggleForm = () => {
        toggleForm()
    }

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target

        if (name === 'startDate' || name === 'endDate') {
            setEditingEvent((prevEvent) => ({
                ...prevEvent!,
                [name]: value,
            }))
        } else if (name === 'includesPoll') {
            setIncludePollInEdit(checked)
        } else if (name === 'pollQuestion') {
            setEditPollQuestion(value)
        } else if (name === 'participants') {
            setEditParticipants(value.split(',').map((_id) => _id.trim()))
        } else if (name === 'type') {
            setEditType(value)
        } else {
            setEditingEvent((prevEvent) => ({
                ...prevEvent!,
                [name]: type === 'checkbox' ? checked : value,
            }))
        }
    }

    const handleEditOptionChange = (index: number, value: string) => {
        const newOptions = [...editPollOptions]
        newOptions[index] = value
        setEditPollOptions(newOptions)
    }

    const handleAddEditOption = () => {
        if (editPollOptions.length < 3) {
            setEditPollOptions([...editPollOptions, ''])
        }
    }

    const setEventForEditing = (event: EventsData) => {
        setEditingEvent({
            ...event,
            startDate: new Date(event.startDate).toISOString().slice(0, 16),
            endDate: new Date(event.endDate).toISOString().slice(0, 16),
        })
        setEditParticipants(event.participants)
        setEditType(event.type)
    }
    const handleUpdateToastClose = () => {
        setUpdateToastOpen(false)
    }

    const updateEventMutation = useMutation({
        mutationFn: async () => {
            if (!editingEvent) {
                throw new Error('No event selected for editing')
            }
            // Guard: endDate must be after startDate
            if (
                editingEvent.startDate &&
                editingEvent.endDate &&
                new Date(editingEvent.endDate) <= new Date(editingEvent.startDate)
            ) {
                throw new Error('End date and time must be after the start date')
            }
            const fieldsToUpdate = {
                title: editingEvent.title,
                description: editingEvent.description,
                startDate: editingEvent.startDate,
                endDate: editingEvent.endDate,
                location: editingEvent.location,
                participants: editParticipants,
                type: editType,
                poll: includePollInEdit
                    ? {
                        question: editPollQuestion,
                        options: editPollOptions
                            .filter((option) => option.trim() !== '')
                            .map((option) => ({
                                option,
                                votes: 0,
                                voters: [],
                            })),
                    }
                    : null,
            }
            const response = await AxiosInstance.patch(
                `/event/${editingEvent._id}`,
                fieldsToUpdate,
            )
            return response.data
        },
        onSuccess: (data) => {
            setUpdateToastMessage('Event updated successfully')
            setUpdateToastOpen(true)
            setUpdateToastSeverity('success')
            setUpdatedEvent((prevEvents) =>
                prevEvents.map((event) =>
                    event._id === editingEvent?._id ? data : event,
                ),
            )

            queryClient.invalidateQueries({
                queryKey: ['events'],
            })

            setEditingEvent(null)
            resetEditPollState()
            setEditDrawer(false)
            handleCloseDrawer()
        },
        onError: (error) => {
            console.error('Error updating event:', error)
            setUpdateToastMessage('Error updating event')
            setUpdateToastOpen(true)
            setUpdateToastSeverity('error')
        },
    })

    return {
        editingEvent,
        setEditDrawer,
        includePollInEdit,
        editPollQuestion,
        editPollOptions,
        setEditingEvent,
        handleEditChange,
        handleEditOptionChange,
        handleAddEditOption,
        updateEvent: updateEventMutation.mutate,
        setEventForEditing,
        toggleForm,
        handleEditClick,
        handleToggleForm,
        handleUpdateToastClose,
        updateToastMessage,
        updateToastOpen,
        updateToastSeverity,
        editParticipants,
        setEditParticipants,
        editType,
        setEditType,
        updatedEvent,
    }
}

export const useDeleteEvent = () => {
    const queryClient = useQueryClient()
    const [showModal, setShowModal] = useState(false)
    const [deletedEvents, setDeletedEvents] = useState([] as EventsData[])
    const [eventToDeleteId, setEventToDeleteId] = useState<string | number>('')
    const handleDeleteEventModal = (eventToDeleteId: string | number) => {
        setEventToDeleteId(eventToDeleteId)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setEventToDeleteId('')
    }

    const handleDeleteEventMutation = useMutation({
        mutationFn: async (id: string | number) => {
            const response = await AxiosInstance.delete(`/event/${id}`)
            return response.data
        },
        onSuccess: (id) => {
            setDeletedEvents((prevEvents) =>
                prevEvents.filter((event) => event._id !== id),
            )
            queryClient.invalidateQueries({
                queryKey: ['events'],
            })
        },
        onError: (error: Error) => {
            console.error('Error creating event', error)
        },
    })

    return {
        handleDelete: handleDeleteEventMutation.mutate,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
        deletedEvents,
    }
}