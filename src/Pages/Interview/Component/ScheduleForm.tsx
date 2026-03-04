import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Input from '@/Components/Input/Index'
import React, { useEffect, useState } from 'react'
import { ModalComponent } from '../../../Components/Modal/Modal'

interface Interview {
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    positionApplied: string
    status: string
    _id: string
    firstInterviewDate?: string
    secondInterviewDate?: string
    notes: string
    customMessage: string
    customSubject: string
    currentPhase: string
    isDeleted?: boolean
    fullName: string
}

interface RescheduleModalProps {
    open: boolean
    handleClose: () => void
    handleSchedule: (
        interviewDate: string,
        notes: string,
        customMessage: string,
        customSubject: string,
        useCustomEmail: boolean,
    ) => void
    selectedInterview: Interview
    isReschedule: boolean
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({
    open,
    handleClose,
    selectedInterview,
    handleSchedule,
    isReschedule,
}) => {
    const [interviewDate, setInterviewDate] = useState<string>('')
    const [notes, setNotes] = useState('')
    const [customMessage, setCustomMessage] = useState('')
    const [customSubject, setCustomSubject] = useState('')
    const [useCustomEmail, setUseCustomEmail] = useState(false)

    useEffect(() => {
        const initialDate =
            selectedInterview.currentPhase === 'first_interview'
                ? selectedInterview.firstInterviewDate
                : selectedInterview.secondInterviewDate

        // datetime-local input requires YYYY-MM-DDThh:mm format. 
        // ISO string contains seconds and 'Z' timezone which breaks the input
        const formattedDate = initialDate ? initialDate.slice(0, 16) : ''

        setInterviewDate(formattedDate)
        setNotes(selectedInterview.notes || '')
        setCustomMessage(selectedInterview.customMessage || '')
        setCustomSubject(selectedInterview.customSubject || '')
    }, [selectedInterview])

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()

        if (interviewDate) {
            handleSchedule(
                interviewDate,
                notes,
                customMessage,
                customSubject,
                useCustomEmail,
            )
            handleClose()
        } else {
            console.error('Interview date is required')
        }
    }

    return (
        <ModalComponent open={open} handleClose={handleClose}>
            <form className="flex flex-col gap-4 w-full">
                <h2 className="text-slate-800 font-semibold mb-2">
                    {isReschedule
                        ? 'Reschedule Interview'
                        : 'Schedule Interview'}
                </h2>

                <Input
                    IsUsername
                    type="datetime-local"
                    name="interviewDate"
                    label="Date"
                    value={interviewDate}
                    onChange={(e) => setInterviewDate(e.target.value)}
                />

                <Input
                    IsUsername
                    multiline={true}
                    width="100%"
                    label="Add Notes"
                    type="textarea"
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    name="notes"
                />

                <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                        type="checkbox"
                        checked={useCustomEmail}
                        onChange={(e) => setUseCustomEmail(e.target.checked)}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 accent-blue-600"
                    />
                    <span className="text-slate-700 font-medium">Use custom email</span>
                </label>

                {useCustomEmail && (
                    <>
                        <Input
                            IsUsername
                            type="textarea"
                            name="customSubject"
                            label="Subject"
                            multiline
                            rows={1}
                            value={customSubject}
                            onChange={(e) => setCustomSubject(e.target.value)}
                        />

                        <Input
                            IsUsername
                            multiline={true}
                            width="100%"
                            label="Message"
                            type="textarea"
                            rows={4}
                            value={customMessage}
                            onChange={(e) => setCustomMessage(e.target.value)}
                            name="message"
                        />
                    </>
                )}

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '10px',
                    }}
                >
                    <Button
                        type={ButtonTypes.PRIMARY}
                        btnText={isReschedule ? 'Reschedule' : 'Schedule'}
                        width="90px"
                        height="35px"
                        padding="10px"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        onClick={handleSubmit}
                    />
                </div>
            </form>
        </ModalComponent>
    )
}

export default RescheduleModal
