import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    useMemo,
    useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { DropResult } from 'react-beautiful-dnd'
import { useGetAllInterviews } from '.'
import { formatDate, getInterviewsByPhase } from './utils'
import AxiosInstance from '@/Helpers/Axios'
import Toast from '@/Components/Toast/Toast'
import { Interview, InterviewContextType } from '../interface/interface'

const InterviewContext = createContext<InterviewContextType | undefined>(
    undefined,
)
export const useInterviewContext = () => {
    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error(
            'useInterviewContext must be used within an InterviewProvider',
        )
    }
    return context
}

/** Valid forward-only phase transitions */
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
    first_interview: ['second_interview', 'rejected'],
    second_interview: ['employed', 'rejected'],
    rejected: [], // cannot move out of rejected
    employed: [],  // cannot move out of employed
}

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { data: interviewsData, error, loading } = useGetAllInterviews()
    const [interviews, setInterviews] = useState<Interview[]>([])
    const [selectedInterview, setSelectedInterview] =
        useState<Interview | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isReschedule, setIsReschedule] = useState(false)
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [currentTab, setCurrentTab] = useState<string>('first_interview')
    // Per-interview processing flag to prevent double-clicks
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

    const phases = [
        'first_interview',
        'second_interview',
        'rejected',
        'employed',
    ]
    const [scheduleType, setScheduleType] = useState<'schedule' | 'reschedule'>(
        'schedule',
    )
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>(
        'success',
    )

    // ── helpers ─────────────────────────────────────────────────────────────
    const setProcessing = (id: string, on: boolean) => {
        setProcessingIds((prev) => {
            const next = new Set(prev)
            on ? next.add(id) : next.delete(id)
            return next
        })
    }

    // ── Map raw API data → Interview objects ─────────────────────────────────
    useEffect(() => {
        if (interviewsData && Array.isArray(interviewsData)) {
            const mappedInterviews: Interview[] = interviewsData.map(
                (applicant) => {
                    // Trust the DB's currentPhase field directly.
                    let phase = applicant.currentPhase || 'applied'

                    // Normalise statuses that map to special board columns
                    if (applicant.status === 'rejected') phase = 'rejected'
                    if (applicant.status === 'employed') phase = 'employed'

                    return {
                        ...applicant,
                        fullName: `${applicant.firstName} ${applicant.lastName}`,
                        auth: { email: applicant.email },
                        secondInterviewDate: applicant.secondInterviewDate
                            ? new Date(
                                applicant.secondInterviewDate,
                            ).toISOString()
                            : undefined,
                        firstInterviewDate: applicant.firstInterviewDate
                            ? new Date(
                                applicant.firstInterviewDate,
                            ).toISOString()
                            : undefined,
                        notes: applicant.notes || '',
                        currentPhase: phase,
                        _id: applicant._id,
                        customMessage: applicant.customMessage || '',
                        customSubject: applicant.customSubject || '',
                    }
                },
            )

            setInterviews(mappedInterviews)
        }
    }, [interviewsData])

    // ── Derived filtered list (single source of truth) ───────────────────────
    const filteredInterviews = useMemo(() => {
        let filtered = interviews.filter((interview) => {
            if (currentTab === 'first_interview' && interview.currentPhase === 'first_interview') return true
            if (currentTab === 'second_interview' && interview.currentPhase === 'second_interview') return true
            if (currentTab === 'rejected' && interview.status === 'rejected') return true
            if (currentTab === 'employed' && interview.status === 'employed') return true
            return false
        })

        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase().trim()
            filtered = filtered.filter((interview) =>
                interview.firstName.toLowerCase().includes(query) ||
                interview.lastName.toLowerCase().includes(query) ||
                `${interview.firstName} ${interview.lastName}`.toLowerCase().includes(query)
            )
        }

        return filtered
    }, [interviews, currentTab, searchQuery])

    const handleTabChange = (
        _event: React.SyntheticEvent,
        newValue: string,
    ) => {
        setCurrentTab(newValue)
    }

    const handleOpenModal = (interview: Interview, isReschedule = false) => {
        setSelectedInterview(interview)
        setIsModalOpen(true)
        setIsReschedule(isReschedule)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedInterview(null)
    }

    const handleCancel = useCallback(async (interview: Interview) => {
        if (processingIds.has(interview._id.toString())) return
        setProcessing(interview._id.toString(), true)
        try {
            const response = await AxiosInstance.patch(`/applicant/${interview._id}`, {
                status: 'rejected',
                currentPhase: 'rejected',
            })

            if (response.status === 200) {
                setInterviews((prev) =>
                    prev.map((i) =>
                        i._id === interview._id
                            ? { ...i, status: 'rejected', currentPhase: 'rejected' }
                            : i,
                    ),
                )
                setToastMessage('This candidate will now be found in the rejected tab')
                setToastSeverity('success')
                setToastOpen(true)
            }
        } catch (error) {
            console.error('Failed to cancel interview:', error)
            setToastMessage('Failed to reject the candidate')
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setProcessing(interview._id.toString(), false)
        }
    }, [processingIds])

    const handleSchedule = async (
        interviewDate: string,
        notes: string,
        customMessage: string,
        customSubject: string,
    ) => {
        if (!selectedInterview) {
            console.error('No interview selected for scheduling')
            return
        }

        let dateField: string
        let newPhase: string

        if (isReschedule) {
            dateField = selectedInterview.currentPhase === 'second_interview'
                ? 'secondInterviewDate'
                : 'firstInterviewDate'
            newPhase = selectedInterview.currentPhase
        } else {
            if (selectedInterview.currentPhase === 'first_interview') {
                // Advancing from first → second interview
                dateField = 'secondInterviewDate'
                newPhase = 'second_interview'
            } else if (selectedInterview.currentPhase === 'second_interview') {
                dateField = 'secondInterviewDate'
                newPhase = 'second_interview'
            } else {
                // New candidate — schedule first interview
                dateField = 'firstInterviewDate'
                newPhase = 'first_interview'
            }
        }

        try {
            const isoDate = new Date(interviewDate).toISOString()
            const response = await AxiosInstance.patch(
                `/applicant/${selectedInterview._id}`,
                {
                    [dateField]: isoDate,
                    notes,
                    customMessage,
                    customSubject,
                    currentPhase: newPhase,
                },
            )

            if (response.status === 200) {
                const updatedFields = {
                    [dateField]: isoDate,
                    notes,
                    customMessage,
                    customSubject,
                    currentPhase: newPhase,
                }
                setInterviews((prev) =>
                    prev.map((i) =>
                        i._id === selectedInterview._id
                            ? { ...i, ...updatedFields }
                            : i,
                    ),
                )
                setToastMessage(
                    isReschedule
                        ? 'Interview rescheduled successfully'
                        : 'Interview scheduled successfully',
                )
                setToastSeverity('success')
                setToastOpen(true)
                handleCloseModal()
            }
        } catch (error: any) {
            console.error('Failed to schedule interview:', error)
            const errorMsg =
                error.response?.data?.message ||
                'Failed to schedule the interview. Please check for date conflicts.'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        }
    }

    const handleAccept = useCallback(async (interview: Interview) => {
        if (processingIds.has(interview._id.toString())) return
        setProcessing(interview._id.toString(), true)
        try {
            let newPhase = interview.currentPhase
            let status = interview.status

            if (interview.currentPhase === 'first_interview') {
                setProcessing(interview._id.toString(), false)
                newPhase = 'second_interview'
                status = 'active'
                handleOpenModal(interview, false)
                return
            } else if (interview.currentPhase === 'second_interview') {
                status = 'employed'
                newPhase = 'employed'
            }

            const response = await AxiosInstance.patch(
                `/applicant/${interview._id}`,
                {
                    status: status,
                    currentPhase: newPhase,
                },
            )
            if (response.status === 200) {
                setInterviews((prev) =>
                    prev.map((i) =>
                        i._id === interview._id
                            ? { ...i, status: status, currentPhase: newPhase }
                            : i,
                    ),
                )

                if (status === 'employed') {
                    setToastMessage(
                        'This candidate will now be found as an employee',
                    )
                    setToastSeverity('success')
                    setToastOpen(true)
                }
            }
        } catch (error: any) {
            console.error('Failed to update interview status:', error)
            const errorMsg = error.response?.data?.message || 'Failed to accept the candidate'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setProcessing(interview._id.toString(), false)
        }
    }, [processingIds])

    const onDragEnd = useCallback(async (result: DropResult) => {
        if (!result.destination) return

        const { source, destination } = result
        const destId = destination.droppableId
        const srcId = source.droppableId

        // Guard: no movement
        if (srcId === destId) return

        const draggedInterview = filteredInterviews.find(
            (interview) => interview._id.toString() === result.draggableId,
        )
        if (!draggedInterview) return

        // Guard: only allow defined forward transitions
        const allowed = ALLOWED_TRANSITIONS[srcId] ?? []
        if (!allowed.includes(destId)) {
            setToastMessage(
                `Cannot move a candidate from "${srcId.replace(/_/g, ' ')}" to "${destId.replace(/_/g, ' ')}"`,
            )
            setToastSeverity('error')
            setToastOpen(true)
            return
        }

        try {
            const response = await AxiosInstance.patch(
                `/applicant/${draggedInterview._id}`,
                {
                    currentPhase: destId,
                    status:
                        destId === 'employed'
                            ? 'employed'
                            : destId === 'rejected'
                                ? 'rejected'
                                : 'active',
                },
            )

            if (response.status === 200) {
                setInterviews((prev) =>
                    prev.map((interview) =>
                        interview._id === draggedInterview._id
                            ? {
                                ...interview,
                                currentPhase: destId,
                                status:
                                    destId === 'employed'
                                        ? 'employed'
                                        : destId === 'rejected'
                                            ? 'rejected'
                                            : 'active',
                            }
                            : interview,
                    ),
                )
            }
        } catch (error: any) {
            console.error('Failed to update interview phase:', error)
            const errorMsg = error.response?.data?.message || 'Failed to move candidate'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        }
    }, [filteredInterviews])

    const handleNavigateToProfile = (CandidateViewId: string) => {
        navigate(`/view/${CandidateViewId}`)
    }

    return (
        <InterviewContext.Provider
            value={{
                loading,
                error,
                interviews: filteredInterviews,
                selectedInterview,
                isModalOpen,
                isReschedule,
                allPhasesPassed: false,
                handleOpenModal,
                handleCloseModal,
                handleSchedule,
                handleCancel,
                onDragEnd,
                handleNavigateToProfile,
                handleAccept,
                getInterviewsByPhase: (phase: string) =>
                    getInterviewsByPhase(interviews, phase),
                formatDate: (dateString: string | number | Date | undefined) =>
                    formatDate(dateString ?? ''),
                phases,
                scheduleType,
                setIsReschedule,
                setScheduleType,
                setFilteredInterviews: () => { /* derived via useMemo — no-op kept for interface compat */ },
                handleTabChange,
                currentTab,
                searchQuery,
                setSearchQuery,
                filteredInterviews,
                processingIds,
            }}
        >
            {children}
            <Toast
                open={toastOpen}
                message={toastMessage}
                severity={toastSeverity}
                onClose={() => setToastOpen(false)}
            />
        </InterviewContext.Provider>
    )
}
