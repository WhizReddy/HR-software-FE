import style from './style/userVacations.module.scss'

import { VacationContext, VacationProvider } from './VacationContext'
import { useGetUserWithVacations } from './Hook'
import { Vacation } from './types'
import {
    CalendarDays,
    Check,
    Clock,
    Mail,
    Phone,
    UserRound,
    X,
} from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useParams } from 'react-router-dom'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

const getVacationDays = (vacation: Vacation) => {
    const startDate = dayjs(vacation.startDate)
    const endDate = dayjs(vacation.endDate)

    if (!startDate.isValid() || !endDate.isValid()) {
        return 'N/A'
    }

    return `${endDate.diff(startDate, 'days') + 1} day${endDate.diff(startDate, 'days') === 0 ? '' : 's'}`
}

const formatVacationDate = (value: string) => {
    const date = dayjs(value)
    return date.isValid() ? date.format('DD MMM YYYY') : 'Date pending'
}

const getStatusConfig = (status: Vacation['status']) => {
    if (status === 'accepted') {
        return {
            label: 'Accepted',
            icon: Check,
            className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        }
    }

    if (status === 'rejected') {
        return {
            label: 'Rejected',
            icon: X,
            className: 'border-rose-200 bg-rose-50 text-rose-700',
        }
    }

    return {
        label: 'Pending',
        icon: Clock,
        className: 'border-amber-200 bg-amber-50 text-amber-700',
    }
}

const UserVacationsComponent = () => {
    const { error, isError, isLoading, data } = useGetUserWithVacations()
    const { createVacationToggler, searchParams } = useContext(VacationContext)
    const { currentUser } = useAuth()
    const { id } = useParams<{ id: string }>()

    const [takenLeaveDays, setTakenLeaveDays] = useState<number>(0)
    useEffect(() => {
        if (data && data.vacations) {
            const totalLeaveDays = data.vacations.reduce(
                (
                    total: number,
                    item: {
                        endDate:
                            | string
                            | number
                            | Date
                            | dayjs.Dayjs
                            | null
                            | undefined
                        startDate:
                            | string
                            | number
                            | Date
                            | dayjs.Dayjs
                            | null
                            | undefined
                    },
                ) => {
                    if ((item as Vacation).status !== 'accepted') {
                        return total
                    }

                    const eD = dayjs(item.endDate)
                    const sD = dayjs(item.startDate)
                    const leaveDays = eD.diff(sD, 'days') + 1
                    return total + leaveDays
                },
                0,
            )
            setTakenLeaveDays(totalLeaveDays)
        }
    }, [data])

    if (isError) {
        return (
            <main className="w-full flex-1">
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    Vacation requests failed to load: {error.message}
                </div>
            </main>
        )
    }

    if (isLoading) {
        return (
            <main className="w-full flex-1">
                <div className={style.loading}>
                    Loading vacation requests...
                </div>
            </main>
        )
    }

    if (!data) return null

    const isOwnVacationPage = currentUser?._id === id
    const hasVacations = data.vacations.length > 0

    return (
        <main className="w-full flex-1">
            <section className="mx-auto w-full max-w-full space-y-6">
                <div className="rounded-lg border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                            {data.imageUrl ? (
                                <img
                                    src={data.imageUrl}
                                    alt={`${data.firstName} ${data.lastName}`}
                                    className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 object-cover"
                                />
                            ) : (
                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                                    <UserRound size={24} />
                                </div>
                            )}
                            <div className="min-w-0">
                                <p className="text-xs font-semibold uppercase text-slate-600">
                                    Vacation profile
                                </p>
                                <h1 className="mt-1 truncate text-2xl font-semibold text-slate-950">
                                    {data.firstName} {data.lastName}
                                </h1>
                                <p className="mt-1 inline-flex rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                                    {data.role || 'Employee'}
                                </p>
                            </div>
                        </div>

                        {isOwnVacationPage && (
                            <Button
                                onClick={createVacationToggler}
                                btnText="Request Vacation"
                                type={ButtonTypes.PRIMARY}
                                className="w-full justify-center sm:w-auto"
                            />
                        )}
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Mail size={16} className="text-slate-600" />
                                <p className="text-[11px] font-semibold uppercase">
                                    Email
                                </p>
                            </div>
                            <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                                {data.email || 'Not saved'}
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Phone size={16} className="text-slate-600" />
                                <p className="text-[11px] font-semibold uppercase">
                                    Phone
                                </p>
                            </div>
                            <p className="mt-2 break-words text-sm font-semibold text-slate-800">
                                {data.phone || 'Not saved'}
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3">
                            <div className="flex items-center gap-2 text-slate-500">
                                <CalendarDays
                                    size={16}
                                    className="text-slate-600"
                                />
                                <p className="text-[11px] font-semibold uppercase">
                                    Used leave
                                </p>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-slate-800">
                                {takenLeaveDays} days this year
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                        <h2 className="text-lg font-semibold text-slate-950">
                            Vacation Requests
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review request type, dates, duration, and status.
                        </p>
                    </div>

                    {!hasVacations ? (
                        <div className="p-6 text-sm font-medium text-slate-500">
                            No vacation requests have been submitted yet.
                        </div>
                    ) : (
                        <>
                            <div className="hidden overflow-x-auto md:block">
                                <table className="min-w-[760px] w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                                            <th className="px-5 py-3">Type</th>
                                            <th className="px-5 py-3">
                                                Start date
                                            </th>
                                            <th className="px-5 py-3">
                                                End date
                                            </th>
                                            <th className="px-5 py-3">
                                                Duration
                                            </th>
                                            <th className="px-5 py-3">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.vacations.map(
                                            (item: Vacation) => {
                                                const status = getStatusConfig(
                                                    item.status,
                                                )
                                                const StatusIcon = status.icon

                                                return (
                                                    <tr
                                                        key={item._id}
                                                        className="border-b border-slate-100 last:border-0"
                                                    >
                                                        <td className="px-5 py-4 font-semibold capitalize text-slate-800">
                                                            {item.type}
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-600">
                                                            {formatVacationDate(
                                                                item.startDate,
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-600">
                                                            {formatVacationDate(
                                                                item.endDate,
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4 text-slate-600">
                                                            {getVacationDays(
                                                                item,
                                                            )}
                                                        </td>
                                                        <td className="px-5 py-4">
                                                            <span
                                                                className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                                            >
                                                                <StatusIcon
                                                                    size={14}
                                                                />
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            },
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid gap-3 p-4 md:hidden">
                                {data.vacations.map((item: Vacation) => {
                                    const status = getStatusConfig(item.status)
                                    const StatusIcon = status.icon

                                    return (
                                        <article
                                            key={item._id}
                                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                                        Request type
                                                    </p>
                                                    <h3 className="mt-1 text-base font-semibold capitalize text-slate-950">
                                                        {item.type}
                                                    </h3>
                                                </div>
                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${status.className}`}
                                                >
                                                    <StatusIcon size={14} />
                                                    {status.label}
                                                </span>
                                            </div>

                                            <dl className="mt-4 grid gap-3">
                                                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                                                    <dt className="text-xs font-semibold uppercase text-slate-400">
                                                        Start
                                                    </dt>
                                                    <dd className="text-sm font-medium text-slate-700">
                                                        {formatVacationDate(
                                                            item.startDate,
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                                                    <dt className="text-xs font-semibold uppercase text-slate-400">
                                                        End
                                                    </dt>
                                                    <dd className="text-sm font-medium text-slate-700">
                                                        {formatVacationDate(
                                                            item.endDate,
                                                        )}
                                                    </dd>
                                                </div>
                                                <div className="grid grid-cols-[92px_minmax(0,1fr)] gap-2">
                                                    <dt className="text-xs font-semibold uppercase text-slate-400">
                                                        Duration
                                                    </dt>
                                                    <dd className="text-sm font-medium text-slate-700">
                                                        {getVacationDays(item)}
                                                    </dd>
                                                </div>
                                            </dl>
                                        </article>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>

                {searchParams.get('createVacation') && <CreateVacationForm />}
            </section>
        </main>
    )
}

export default function UserVacations() {
    return (
        <VacationProvider>
            <UserVacationsComponent />
        </VacationProvider>
    )
}
