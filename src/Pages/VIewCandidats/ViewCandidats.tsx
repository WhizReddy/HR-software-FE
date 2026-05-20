import { useMemo, useState } from 'react'
import {
    BriefcaseBusiness,
    CalendarClock,
    CheckCircle2,
    FileText,
    MessageSquareText,
    Send,
    UserRound,
    XCircle,
} from 'lucide-react'
import PageIntro from '@/Components/PageIntro/PageIntro'
import { Card } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { ModalComponent } from '../../Components/Modal/Modal'
import Input from '@/Components/Input/Index'
import Toast from '@/Components/Toast/Toast'
import { resolveApiAssetUrl } from '@/Helpers/Axios'
import { useApplicantById } from './Hook'

const formatPhase = (phase?: string) => {
    if (!phase) return 'Applied'

    return phase
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const formatList = (items?: string[] | string) => {
    if (Array.isArray(items)) {
        return items.length ? items.join(', ') : 'Not specified'
    }

    return items || 'Not specified'
}

export default function ViewCandidats() {
    const {
        applicant,
        showModal,
        handleCloseModal,
        handleOpenModal,
        handleConfirm,
        showConfirmationModal,
        firstInterviewDate,
        setFirstInterviewDate,
        customMessage,
        setCustomMessage,
        handleSend,
        handleCloseConfirmationModal,
        customSubject,
        setCustomSubject,
        secondInterviewDate,
        setSecondInterviewDate,
        modalAction,
        toastOpen,
        toastMessage,
        toastSeverity,
        handleToastClose,
    } = useApplicantById()
    const [useCustomEmail, setUseCustomEmail] = useState(false)

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDifference = today.getMonth() - birthDate.getMonth()

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--
        }

        return age
    }

    const details = useMemo(
        () => [
            {
                label: 'Full name',
                value: applicant
                    ? `${applicant.firstName} ${applicant.lastName}`
                    : 'Loading...',
            },
            {
                label: 'Email',
                value: applicant?.email || 'Not specified',
            },
            {
                label: 'Phone',
                value: applicant?.phoneNumber
                    ? applicant.phoneNumber.startsWith('+')
                        ? applicant.phoneNumber
                        : `+355${applicant.phoneNumber}`
                    : 'Not specified',
            },
            {
                label: 'Age',
                value: applicant?.dob
                    ? calculateAge(applicant.dob.split('T')[0])
                    : 'N/A',
            },
            {
                label: 'Applying method',
                value: applicant?.applicationMethod || 'Not specified',
            },
            {
                label: 'Experience',
                value: applicant?.experience || 'Not specified',
            },
        ],
        [applicant],
    )

    const workDetails = useMemo(
        () => [
            {
                label: 'Position',
                value: applicant?.positionApplied || 'Not specified',
            },
            {
                label: 'Wage expectation',
                value: applicant?.salaryExpectations || 'Not specified',
            },
            {
                label: 'Technologies',
                value: formatList(applicant?.technologiesUsed),
            },
            {
                label: 'Current phase',
                value: formatPhase(applicant?.currentPhase),
            },
        ],
        [applicant],
    )

    const isClosed =
        applicant?.status === 'rejected' || applicant?.status === 'employed'
    const canSchedulePhaseOne =
        !applicant?.currentPhase ||
        applicant.currentPhase === 'applied' ||
        applicant.currentPhase === 'applicant'
    const canSchedulePhaseTwo = applicant?.currentPhase === 'first_interview'
    const canEmploy = Boolean(applicant)
    const interviewNotes = applicant?.notes?.trim()
    const interviewLabel =
        applicant?.currentPhase === 'first_interview'
            ? 'Phase 2 Interview Date'
            : 'Phase 1 Interview Date'
    const interviewValue =
        applicant?.currentPhase === 'first_interview'
            ? secondInterviewDate
            : firstInterviewDate
    const cvUrl = applicant?.cvAttachment
        ? resolveApiAssetUrl(applicant.cvAttachment)
        : ''

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            <PageIntro
                eyebrow="Recruitment"
                title={
                    applicant
                        ? `${applicant.firstName} ${applicant.lastName}`
                        : 'Candidate Profile'
                }
                description="Review candidate details, schedule interview phases, and keep the hiring decision flow aligned with the interview pipeline."
                actions={
                    applicant && (
                        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                            <span
                                className={`h-2.5 w-2.5 rounded-full ${
                                    applicant.status === 'employed'
                                        ? 'bg-emerald-500'
                                        : applicant.status === 'rejected'
                                          ? 'bg-rose-500'
                                          : 'bg-blue-500'
                                }`}
                            />
                            <span className="text-sm font-bold capitalize text-slate-800">
                                {applicant.status || 'active'}
                            </span>
                        </div>
                    )
                }
            />

            <section className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
                <div className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2457a3]">
                                    <UserRound size={22} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black tracking-tight text-slate-900">
                                        Candidate Details
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        Contact and application basics.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <dl className="mt-5 grid gap-4 md:grid-cols-2">
                            {details.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                                >
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        {item.label}
                                    </dt>
                                    <dd className="mt-2 break-words text-sm font-semibold text-slate-800">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                                <BriefcaseBusiness size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900">
                                    Role Fit
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Hiring stage, expected wage, and relevant skills.
                                </p>
                            </div>
                        </div>

                        <dl className="mt-5 grid gap-4 md:grid-cols-2">
                            {workDetails.map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
                                >
                                    <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        {item.label}
                                    </dt>
                                    <dd className="mt-2 break-words text-sm font-semibold text-slate-800">
                                        {item.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                <MessageSquareText size={22} />
                            </div>
                            <div>
                                <h2 className="text-lg font-black tracking-tight text-slate-900">
                                    Interview Notes
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Notes saved while scheduling or rescheduling interviews.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                            {interviewNotes ? (
                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                                    {interviewNotes}
                                </p>
                            ) : (
                                <p className="text-sm font-semibold text-slate-500">
                                    No interview notes have been added yet.
                                </p>
                            )}
                        </div>
                    </Card>
                </div>

                <aside className="space-y-6">
                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-black tracking-tight text-slate-900">
                            Candidate File
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            CV and interview readiness.
                        </p>

                        <div className="mt-5 space-y-3">
                            <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    CV Attachment
                                </span>
                                {cvUrl ? (
                                    <a
                                        href={cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-[#2457a3] hover:text-[#1a407a]"
                                    >
                                        <FileText size={16} />
                                        View CV
                                    </a>
                                ) : (
                                    <p className="mt-3 text-sm font-semibold text-slate-500">
                                        No CV attached
                                    </p>
                                )}
                            </div>

                            <div className="grid gap-3">
                                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Hiring Phase
                                    </span>
                                    <p className="mt-2 text-sm font-semibold text-slate-800">
                                        {formatPhase(applicant?.currentPhase)}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                        Status
                                    </span>
                                    <p className="mt-2 text-sm font-semibold capitalize text-slate-800">
                                        {applicant?.status || 'active'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="rounded-2xl border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-black tracking-tight text-slate-900">
                            Actions
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Move the candidate through the current hiring flow.
                        </p>

                        {!applicant ? (
                            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm font-semibold text-slate-500">
                                Loading candidate actions...
                            </div>
                        ) : !isClosed ? (
                            <div className="mt-5 grid gap-3">
                                {canSchedulePhaseOne && (
                                    <Button
                                        type="button"
                                        onClick={() => handleOpenModal('active')}
                                        className="w-full justify-start"
                                    >
                                        <CalendarClock size={16} />
                                        Schedule Phase 1 Interview
                                    </Button>
                                )}

                                {canSchedulePhaseTwo && (
                                    <Button
                                        type="button"
                                        onClick={() => handleOpenModal('active')}
                                        className="w-full justify-start"
                                    >
                                        <CalendarClock size={16} />
                                        Schedule Phase 2 Interview
                                    </Button>
                                )}

                                {canEmploy && (
                                    <Button
                                        type="button"
                                        variant="success"
                                        onClick={() => handleOpenModal('employ')}
                                        className="w-full justify-start"
                                    >
                                        <CheckCircle2 size={16} />
                                        Employ Candidate
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleOpenModal('reject')}
                                    className="w-full justify-start"
                                >
                                    <XCircle size={16} />
                                    Reject Candidate
                                </Button>
                            </div>
                        ) : (
                            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm font-semibold text-slate-500">
                                This candidate is already marked as{' '}
                                <span className="capitalize">
                                    {applicant?.status || 'closed'}
                                </span>
                                .
                            </div>
                        )}
                    </Card>
                </aside>
            </section>

            {showModal && (
                <ModalComponent open={showModal} handleClose={handleCloseModal}>
                    <div className="flex max-w-md flex-col gap-4">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-slate-900">
                                Confirm Action
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                {modalAction === 'active'
                                    ? 'Schedule the next interview step for this candidate?'
                                    : modalAction === 'reject'
                                      ? 'Reject this candidate from the hiring process?'
                                      : 'Mark this candidate as employed?'}
                            </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Button type="button" onClick={handleConfirm}>
                                Confirm
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalComponent>
            )}

            {showConfirmationModal && (
                <ModalComponent
                    open={showConfirmationModal}
                    handleClose={handleCloseConfirmationModal}
                >
                    <div className="flex max-w-xl flex-col gap-5">
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-slate-900">
                                Notify Applicant
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                Choose the interview time and optionally add a
                                custom email subject or message.
                            </p>
                        </div>

                        <Input
                            IsUsername
                            type="datetime-local"
                            name="interviewDate"
                            label={interviewLabel}
                            value={interviewValue}
                            onChange={(event: any) =>
                                applicant?.currentPhase === 'first_interview'
                                    ? setSecondInterviewDate(event.target.value)
                                    : setFirstInterviewDate(event.target.value)
                            }
                        />

                        <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
                            <input
                                type="checkbox"
                                checked={useCustomEmail}
                                onChange={(event) =>
                                    setUseCustomEmail(event.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer rounded accent-[#2457a3] focus:ring-[#2457a3]"
                            />
                            <span className="text-sm font-semibold text-slate-700">
                                Use custom email
                            </span>
                        </label>

                        {useCustomEmail && (
                            <div className="grid gap-4">
                                <Input
                                    IsUsername
                                    type="textarea"
                                    name="customSubject"
                                    label="Subject"
                                    multiline
                                    rows={1}
                                    value={customSubject}
                                    onChange={(event: any) =>
                                        setCustomSubject(event.target.value)
                                    }
                                />
                                <Input
                                    IsUsername
                                    type="textarea"
                                    name="customMessage"
                                    label="Message"
                                    multiline
                                    rows={3}
                                    value={customMessage}
                                    onChange={(event: any) =>
                                        setCustomMessage(event.target.value)
                                    }
                                />
                            </div>
                        )}

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Button type="button" onClick={handleSend}>
                                <Send size={16} />
                                Send
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseConfirmationModal}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </ModalComponent>
            )}

            <Toast
                open={toastOpen}
                message={toastMessage}
                severity={toastSeverity}
                onClose={handleToastClose}
            />
        </main>
    )
}
