import { useEffect, useState, useCallback } from 'react'
import AxiosInstance from '../../../Helpers/Axios'
import { useParams } from 'react-router-dom'
import { CandidateView, ModalAction } from '../interfaces/ViewCandidate'

export const useApplicantById = () => {
    const [applicant, setApplicant] = useState<CandidateView | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalAction, setModalAction] = useState<ModalAction | ''>('')
    const [showConfirmationModal, setShowConfirmationModal] = useState(false)
    const [firstInterviewDate, setFirstInterviewDate] = useState('')
    const [secondInterviewDate, setSecondInterviewDate] = useState('')
    const [customMessage, setCustomMessage] = useState('')
    const [customSubject, setCustomSubject] = useState('')
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')
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
            handleAccept()
            setShowConfirmationModal(true)
        } else if (modalAction === 'reject') {
            handleReject()
        } else if (modalAction === 'employ') {
            handleEmploy()
        }
        setShowModal(false)
    }

    const handleReject = async () => {
        try {
            await AxiosInstance.patch(`/applicant/${id}`, {
                status: 'rejected',
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
        }
    }

    const handleEmploy = async () => {
        try {
            await AxiosInstance.patch(`/applicant/${id}`, {
                status: 'employed',
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
        }
    }

    const handleAccept = async () => {
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
        }
    }

    const handleCloseModal = () => {
        setShowModal(false)
    }

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false)
    }

    const handleOpenModal = (action: ModalAction) => {
        setModalAction(action)
        setShowModal(true)
    }

    const handleSend = async () => {
        if (!applicant) return

        try {
            const payload: any = {
                customMessage: customMessage || undefined,
                customSubject: customSubject || undefined,
            }

            // Scheduling Phase 1: applicant has no interview yet
            if (applicant.currentPhase === 'applicant' || !applicant.currentPhase) {
                if (firstInterviewDate) payload.firstInterviewDate = new Date(firstInterviewDate).toISOString()
                payload.currentPhase = 'first_interview'
            }
            // Scheduling Phase 2: candidate already done Phase 1
            else if (applicant.currentPhase === 'first_interview') {
                if (secondInterviewDate) payload.secondInterviewDate = new Date(secondInterviewDate).toISOString()
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
        }
    }

    return {
        applicant,
        showModal,
        handleCloseModal,
        handleOpenModal,
        modalAction,
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
        handleToastClose
    }
}
