import { useContext } from 'react'
import { Link } from 'react-router-dom'
import {
    CalendarDays,
    CalendarRange,
    Clock3,
    Mail,
    Phone,
    UserRound,
} from 'lucide-react'
import dayjs from 'dayjs'
import { VacationContext, VacationProvider } from './VacationContext'
import { useGetUserWithVacations } from './Hook'
import { Vacation } from './types'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { useAuth } from '@/features/auth/context/AuthProvider'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import Toast from '@/Components/Toast/Toast'
import { dateFormatter } from '@/Helpers/dateFormater'
import {
    formatVacationType,
    getAcceptedVacationDaysForYear,
    getVacationDurationDays,
    getVacationStatusColor,
    sortVacationsNewestFirst,
} from './utils'
import { isAdminRole } from '@/features/auth/lib/access'

type UserVacationsContentProps = {
    userId?: string
}

const initialsFromName = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'U'

const VacationSummaryCard = ({
    label,
    value,
    helper,
}: {
    label: string
    value: string
    helper: string
}) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {label}
        </p>
        <p className="mt-3 text-3xl font-black tracking-tight text-slate-900">
            {value}
        </p>
        <p className="mt-2 text-sm text-slate-500">{helper}</p>
    </div>
)

export const UserVacationsContent = ({
    userId,
}: UserVacationsContentProps) => {
    const { currentUser } = useAuth()
    const { error, isError, isLoading, data } = useGetUserWithVacations(userId)
    const {
        createVacationToggler,
        searchParams,
        toastConfigs,
        handleToastClose,
    } = useContext(VacationContext)

    if (isError) {
        return <div className="p-6 text-sm text-red-600">Error: {error.message}</div>
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center p-6">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        )
    }

    if (!data) {
        return null
    }

    const isOwnVacationPage =
        currentUser?._id && String(currentUser._id) === String(data._id)
    const isManagerView = isAdminRole(currentUser?.role) && !isOwnVacationPage
    const orderedVacations = sortVacationsNewestFirst(data.vacations ?? [])
    const pendingRequests = orderedVacations.filter(
        (vacation) => vacation.status === 'pending',
    ).length
    const approvedRequests = orderedVacations.filter(
        (vacation) => vacation.status === 'accepted',
    ).length
    const approvedDaysThisYear = getAcceptedVacationDaysForYear(orderedVacations)
    const currentYear = dayjs().year()

    return (
        <>
            <Toast
                open={toastConfigs.isOpen}
                onClose={handleToastClose}
                message={toastConfigs.message || ''}
                severity={toastConfigs.severity}
            />

            <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid gap-6 xl:grid-cols-[340px,1fr]">
                    <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            {data.imageUrl ? (
                                <img
                                    src={data.imageUrl}
                                    alt={`${data.firstName} ${data.lastName}`}
                                    className="h-20 w-20 rounded-2xl object-cover ring-4 ring-slate-100"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-xl font-bold text-slate-700">
                                    {initialsFromName(
                                        data.firstName,
                                        data.lastName,
                                    )}
                                </div>
                            )}

                            <div className="min-w-0">
                                <h1 className="truncate text-2xl font-black tracking-tight text-slate-900">
                                    {data.firstName} {data.lastName}
                                </h1>
                                <p className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium capitalize text-slate-600">
                                    {data.role}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="mt-0.5 text-[#2457a3]" />
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Email
                                    </p>
                                    <p className="break-all text-sm text-slate-700">
                                        {data.email || 'No email available'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Phone size={18} className="mt-0.5 text-[#2457a3]" />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        Phone
                                    </p>
                                    <p className="text-sm text-slate-700">
                                        {data.phone || 'No phone available'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <UserRound
                                    size={18}
                                    className="mt-0.5 text-[#2457a3]"
                                />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                        View
                                    </p>
                                    <p className="text-sm text-slate-700">
                                        {isManagerView
                                            ? 'Manager review mode'
                                            : 'Self-service overview'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            {isOwnVacationPage ? (
                                <Button
                                    onClick={createVacationToggler}
                                    btnText="Request Vacation"
                                    type={ButtonTypes.PRIMARY}
                                    className="w-full"
                                />
                            ) : (
                                <Link
                                    to="/vacation"
                                    className="inline-flex min-h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Back to Vacation Manager
                                </Link>
                            )}
                        </div>
                    </aside>

                    <section className="space-y-6">
                        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Vacation Overview
                                    </p>
                                    <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                                        {isOwnVacationPage
                                            ? 'See every request clearly in one place.'
                                            : `Review ${data.firstName}'s vacation history.`}
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                        Every request shows its exact dates, day count, status, and request note so there is no guessing.
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                                    <CalendarDays
                                        size={16}
                                        className="text-[#2457a3]"
                                    />
                                    {orderedVacations.length} total request
                                    {orderedVacations.length === 1 ? '' : 's'}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-3">
                            <VacationSummaryCard
                                label={`Approved Days In ${currentYear}`}
                                value={String(approvedDaysThisYear)}
                                helper="Accepted leave already counted this year"
                            />
                            <VacationSummaryCard
                                label="Pending Requests"
                                value={String(pendingRequests)}
                                helper="Requests waiting for a decision"
                            />
                            <VacationSummaryCard
                                label="Approved Requests"
                                value={String(approvedRequests)}
                                helper="Requests that were already accepted"
                            />
                        </div>

                        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-3 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Request History
                                    </p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                                        Vacation requests
                                    </h3>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600">
                                    <CalendarRange
                                        size={16}
                                        className="text-[#2457a3]"
                                    />
                                    Sorted from newest to oldest
                                </div>
                            </div>

                            {orderedVacations.length === 0 ? (
                                <div className="py-10 text-center">
                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                        <CalendarDays size={24} />
                                    </div>
                                    <h4 className="mt-5 text-lg font-semibold text-slate-900">
                                        No vacation requests yet
                                    </h4>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {isOwnVacationPage
                                            ? 'Create your first request and it will appear here with its status and dates.'
                                            : 'This employee has not submitted any vacation requests yet.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-6 space-y-4">
                                    {orderedVacations.map((vacation: Vacation) => {
                                        const durationDays =
                                            getVacationDurationDays(
                                                vacation.startDate,
                                                vacation.endDate,
                                            )

                                        return (
                                            <article
                                                key={vacation._id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5"
                                            >
                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                    <div className="space-y-3">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <h4 className="text-lg font-bold text-slate-900">
                                                                {formatVacationType(
                                                                    vacation.type,
                                                                )}
                                                            </h4>
                                                            <StatusBadge
                                                                status={
                                                                    vacation.status
                                                                }
                                                                color={getVacationStatusColor(
                                                                    vacation.status,
                                                                )}
                                                            />
                                                        </div>

                                                        <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                                                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                                                                <CalendarDays
                                                                    size={15}
                                                                    className="text-[#2457a3]"
                                                                />
                                                                {dateFormatter(
                                                                    vacation.startDate,
                                                                )}{' '}
                                                                to{' '}
                                                                {dateFormatter(
                                                                    vacation.endDate,
                                                                )}
                                                            </span>
                                                            <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5">
                                                                <Clock3
                                                                    size={15}
                                                                    className="text-[#2457a3]"
                                                                />
                                                                {durationDays}{' '}
                                                                day
                                                                {durationDays === 1
                                                                    ? ''
                                                                    : 's'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-4 rounded-2xl bg-white p-4">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                        Request Note
                                                    </p>
                                                    <p className="mt-2 text-sm leading-7 text-slate-600">
                                                        {vacation.description?.trim()
                                                            ? vacation.description
                                                            : 'No additional note was provided for this request.'}
                                                    </p>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {searchParams.get('createVacation') && <CreateVacationForm />}
        </>
    )
}

export default function UserVacations() {
    return (
        <VacationProvider>
            <UserVacationsContent />
        </VacationProvider>
    )
}
