import { useGetUsersWithVacations } from '../Hook/index.ts'
import { UserWithVacation, Vacation } from '../types.ts'
import { useEffect } from 'react'
import { EmployeesWithVacationsSearchFilter } from './SearchFilters.tsx'
import { useInView } from 'react-intersection-observer'
import { CalendarDays, User } from 'lucide-react'
import dayjs from 'dayjs'

const formatVacationDate = (value: string) => {
    const date = dayjs(value)
    return date.isValid() ? date.format('DD MMM YYYY') : 'Date pending'
}

const getStatusClassName = (status: Vacation['status']) => {
    if (status === 'accepted') {
        return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
    }

    if (status === 'rejected') {
        return 'bg-rose-50 text-rose-700 ring-rose-200'
    }

    return 'bg-amber-50 text-amber-700 ring-amber-200'
}

export const EmployeesWithVacations = () => {
    const {
        isError,
        error,
        data,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
        hasNextPage,
    } = useGetUsersWithVacations()

    const { ref, inView } = useInView()
    const users = data?.pages.flatMap((page) => page.data) ?? []
    const totalUsers = data?.pages[0]?.all ?? users.length
    const withLeaveCount = users.filter(
        (user) => (user.vacations?.length ?? 0) > 0,
    ).length
    const totalRequests = users.reduce(
        (sum, user) => sum + (user.vacations?.length ?? 0),
        0,
    )

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView])

    if (isError) {
        return (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                User leaves failed to load: {error.message}
            </div>
        )
    }

    if (isLoading)
        return (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-600 border-t-transparent" />
                <p className="mt-3 text-sm font-medium text-slate-500">
                    Loading user leaves...
                </p>
            </div>
        )

    return (
        <div className="space-y-5">
            <section className="grid gap-4 sm:grid-cols-3">
                <article className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        People
                    </span>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-900">
                        {totalUsers}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">
                        Matching current filter
                    </p>
                </article>
                <article className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        With Leave
                    </span>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-900">
                        {withLeaveCount}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">
                        Visible employees with requests
                    </p>
                </article>
                <article className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requests
                    </span>
                    <strong className="mt-2 block text-2xl font-semibold text-slate-900">
                        {totalRequests}
                    </strong>
                    <p className="mt-1 text-sm text-slate-500">
                        Visible leave records
                    </p>
                </article>
            </section>

            <EmployeesWithVacationsSearchFilter />

            {users.length === 0 ? (
                <section className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <h2 className="text-base font-semibold text-slate-900">
                        No employees found
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Try clearing the search or changing the user leave
                        filter.
                    </p>
                </section>
            ) : (
                <div className="space-y-4">
                    {users.map((user: UserWithVacation) => (
                        <article
                            key={user._id}
                            className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                        >
                            <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex min-w-0 items-center gap-3">
                                    {user.imageUrl ? (
                                        <img
                                            src={user.imageUrl}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-12 w-12 rounded-md border border-slate-200 object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-slate-50 text-slate-700">
                                            <User size={20} />
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="truncate text-sm font-semibold text-slate-900">
                                            {user.firstName} {user.lastName}
                                        </h2>
                                        <p className="truncate text-sm text-slate-500">
                                            {user.email || 'No email saved'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-600">
                                        {user.role || 'Employee'}
                                    </span>
                                    <span className="rounded-md bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                        {user.vacations?.length ?? 0} leave
                                        {(user.vacations?.length ?? 0) === 1
                                            ? ''
                                            : 's'}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                    <CalendarDays
                                        size={16}
                                        className="text-slate-400"
                                    />
                                    Vacation records
                                </div>

                                {user.vacations && user.vacations.length > 0 ? (
                                    <div className="grid gap-3 lg:grid-cols-2">
                                        {user.vacations.map((vacation) => (
                                            <div
                                                key={vacation._id}
                                                className="rounded-lg border border-slate-200 bg-slate-50/70 p-3"
                                            >
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <span className="text-sm font-semibold capitalize text-slate-900">
                                                        {vacation.type}
                                                    </span>
                                                    <span
                                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ${getStatusClassName(
                                                            vacation.status,
                                                        )}`}
                                                    >
                                                        {vacation.status}
                                                    </span>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-500">
                                                    {formatVacationDate(
                                                        vacation.startDate,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatVacationDate(
                                                        vacation.endDate,
                                                    )}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
                                        No vacation records for this employee.
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}

            <div
                ref={ref}
                className="py-6 text-center text-sm font-medium text-slate-400"
            >
                {isFetchingNextPage && 'Loading more employees...'}
            </div>
        </div>
    )
}
