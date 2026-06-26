import { useEffect, useState, useCallback } from 'react'
import AxiosInstance from '../../../Helpers/Axios'
import { useParams } from 'react-router-dom'
import {
    CandidateView,
    InterviewStep,
    ModalAction,
} from '../interfaces/ViewCandidate'

const toDateTimeLocalValue = (value?: string | Date | null) => {
    if (!value) return ''

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ''

    const timezoneOffsetMs = date.getTimezoneOffset() * 60 * 1000
    return new Date(date.getTime() - timezoneOffsetMs)
        .toISOString()
        .slice(0, 16)
}

export const useApplicantById = () => {
    const [applicant, setApplicant] = useState<CandidateView | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalAction, setModalAction] = useState<ModalAction | ''>('')
    const [interviewStep, setInterviewStep] =
        useState<InterviewStep>('first')
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [firstInterviewDate, setFirstInterviewDate] = useState('')
    const [secondInterviewDate, setSecondInterviewDate] = useState('')
    const [customMessage, setCustomMessage] = useState('')
    const [customSubject, setCustomSubject] = useState('')
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')
    const [isActionPending, setIsActionPending] = useState(false)
    const handleToastClose = () => setToastOpen(false)

    const { id } = useParams<{ id: string }>()

    const fetchApplicant = useCallback(async () => {
        try {
            const response = await AxiosInstance.get<CandidateView>(
                `/applicant/${id}`,
            )
            setApplicant(response.data)
        } catch (error) {
            setApplicant(null)
        }
    }, [id])

    useEffect(() => {
        fetchApplicant()
    }, [fetchApplicant])

    const handleConfirm = () => {
        if (modalAction === 'active') {
            // Just open the scheduling modal — the PATCH happens in handleSend
            setShowConfirmationModal(true)
        } else if (modalAction === 'reject') {
            handleReject()
        } else if (modalAction === 'employ') {
            handleEmploy()
        }
        setShowModal(false)
    }

    const handleReject = async () => {
        if (isActionPending) return
        setIsActionPending(true)
        try {
            await AxiosInstance.patch(`/applicant/${id}`, {
                status: 'rejected',
                currentPhase: 'rejected',
            })
            fetchApplicant()
            setToastMessage('Applicant rejected successfully')
            setToastSeverity('success')
            setToastOpen(true)
        } catch (error: any) {
            console.error('Error rejecting applicant:', error)
            const errorMsg = error.response?.data?.message || 'Error rejecting applicant'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setIsActionPending(false)
        }
    }

    const handleEmploy = async () => {
        if (isActionPending) return
        setIsActionPending(true)
        try {
            await AxiosInstance.patch(`/applicant/${id}`, {
                status: 'employed',
                currentPhase: 'employed',
            })
            fetchApplicant()
            setToastMessage('Applicant employed successfully')
            setToastSeverity('success')
            setToastOpen(true)
        } catch (error: any) {
            console.error('Error employing applicant:', error)
            const errorMsg = error.response?.data?.message || 'Error employing applicant'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setIsActionPending(false)
        }
    }

    const handleAccept = async () => {
        if (isActionPending) return
        setIsActionPending(true)
        try {
            await AxiosInstance.patch(`/applicant/${id}`, {
                status: 'active',
            })
            fetchApplicant()
        } catch (error: any) {
            console.error('Error accepting applicant:', error)
            const errorMsg = error.response?.data?.message || 'Error accepting applicant'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setIsActionPending(false)
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false)
    }

    const handleOpenModal = (
        action: ModalAction,
        nextInterviewStep: InterviewStep = 'first',
    ) => {
        if (action === 'active') {
            setInterviewStep(nextInterviewStep)

            if (nextInterviewStep === 'first') {
                setFirstInterviewDate(
                    toDateTimeLocalValue(applicant?.firstInterviewDate),
                )
            } else {
                setSecondInterviewDate(
                    toDateTimeLocalValue(applicant?.secondInterviewDate),
                )
            }
        }

        setModalAction(action)
        setShowModal(true)
    }

    const handleSend = async () => {
        if (!applicant) return
        if (isActionPending) return

        setIsActionPending(true)
        try {
            const payload: any = {
                customMessage: customMessage || undefined,
                customSubject: customSubject || undefined,
            }

            if (interviewStep === 'first') {
                if (!firstInterviewDate) {
                    setToastMessage('Please select an interview date')
                    setToastSeverity('error')
                    setToastOpen(true)
                    return
                }
                payload.firstInterviewDate = new Date(
                    firstInterviewDate,
                ).toISOString()
                payload.currentPhase = 'first_interview'
                payload.status = 'active' // Critical: transition status to active so they appear in Interview board
            } else {
                if (!secondInterviewDate) {
                    setToastMessage('Please select an interview date')
                    setToastSeverity('error')
                    setToastOpen(true)
                    return
                }
                payload.secondInterviewDate = new Date(
                    secondInterviewDate,
                ).toISOString()
                payload.currentPhase = 'second_interview'
            }

            await AxiosInstance.patch(`/applicant/${id}`, payload)
            fetchApplicant()
            setShowConfirmationModal(false)
            setToastMessage('Interview scheduled successfully')
            setToastSeverity('success')
            setToastOpen(true)
        } catch (error: any) {
            console.error('Error updating applicant:', error)
            const errorMsg = error.response?.data?.message || 'Failed to schedule the interview'
            setToastMessage(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg)
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setIsActionPending(false)
        }
    }

    return {
        applicant,
        showModal,
        handleCloseModal,
        handleOpenModal,
        modalAction,
        interviewStep,
        handleCloseConfirmationModal,
        showConfirmationModal,
        handleConfirm,
        firstInterviewDate,
        setFirstInterviewDate,
        secondInterviewDate,
        setSecondInterviewDate,
        customMessage,
        setCustomMessage,
        handleSend,
        handleAccept,
        handleReject,
        handleEmploy,
        customSubject,
        setCustomSubject,
        toastOpen,
        toastMessage,
        toastSeverity,
        handleToastClose,
        isActionPending,
    }
}
