import { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useGetUsersWithVacations } from '../Hook/index.ts'
import { UserWithVacation } from '../types.ts'
import { VacationContext } from '../VacationContext'
import { EmployeesWithVacationsSearchFilter } from './SearchFilters.tsx'
import SimpleCollapsableCard from '@/Components/Vacation_Asset/SimpleCollapsableCard.tsx'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'
import { dateFormatter } from '@/Helpers/dateFormater'
import {
    formatVacationType,
    getVacationDurationDays,
    getVacationStatusColor,
    sortVacationsNewestFirst,
} from '../utils'

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

    const { searchParams, setSearchParams } = useContext(VacationContext)
    const { ref, inView } = useInView()

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])

    if (isError) return <div className="p-6 text-sm text-red-600">Error: {error.message}</div>

    if (isLoading) {
        return (
            <div className="flex min-h-[30vh] items-center justify-center p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        )
    }

    return (
        <div className="space-y-4 p-6">
            <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Team Vacation History
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                        Browse employee leave records without leaving the page.
                    </h2>
                </div>
                <EmployeesWithVacationsSearchFilter />
            </div>

            {data?.pages.map((page) =>
                page.data.map((user: UserWithVacation) => {
                    const orderedVacations = sortVacationsNewestFirst(
                        user.vacations ?? [],
                    )

                    return (
                        <SimpleCollapsableCard
                            key={user._id}
                            user={user}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            items={
                                user.vacations
                                    ? {
                                          type: 'Vacation',
                                          itemArr: user.vacations,
                                      }
                                    : undefined
                            }
                        >
                            <div className="space-y-4 bg-slate-50/60 p-5">
                                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm text-slate-600">
                                        Open the employee profile for the full self-service view.
                                    </p>
                                    <Link
                                        to={`/vacation/${user._id}`}
                                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#2457a3] transition hover:bg-blue-50"
                                    >
                                        Open Profile
                                    </Link>
                                </div>

                                {orderedVacations.length === 0 ? (
                                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
                                        No vacations this year
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {orderedVacations.map((vacation) => {
                                            const duration = getVacationDurationDays(
                                                vacation.startDate,
                                                vacation.endDate,
                                            )

                                            return (
                                                <article
                                                    key={vacation._id}
                                                    className="rounded-2xl border border-slate-200 bg-white p-4"
                                                >
                                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                                        <div className="space-y-2">
                                                            <div className="flex flex-wrap items-center gap-3">
                                                                <h3 className="text-base font-semibold text-slate-900">
                                                                    {formatVacationType(
                                                                        vacation.type,
                                                                    )}
                                                                </h3>
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
                                                                <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
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
                                                                <span className="inline-flex rounded-full bg-slate-50 px-3 py-1.5">
                                                                    {duration} day
                                                                    {duration === 1
                                                                        ? ''
                                                                        : 's'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <p className="mt-4 text-sm leading-7 text-slate-600">
                                                        {vacation.description?.trim()
                                                            ? vacation.description
                                                            : 'No note was added to this request.'}
                                                    </p>
                                                </article>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        </SimpleCollapsableCard>
                    )
                }),
            )}

            <div ref={ref} className="py-4 text-center text-sm text-slate-400">
                {isFetchingNextPage ? 'Loading more employees...' : ''}
            </div>
        </div>
    )
}
