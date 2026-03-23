import { useGetUsersWithVacations } from '../Hook/index.ts'
import { UserWithVacation } from '../types.ts'
import style from '../style/employeesWithVacations.module.scss'
import { useContext, useEffect } from 'react'
import { VacationContext } from '../VacationContext'
import SimpleCollapsableCard from '@/Components/Vacation_Asset/SimpleCollapsableCard.tsx'
import { EmployeesWithVacationsSearchFilter } from './SearchFilters.tsx'
import { useInView } from 'react-intersection-observer'

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
        if (inView && hasNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView])

    if (isError) return <div>Error: {error.message}</div>
    if (isLoading)
        return (
            <div className={style.loading}>
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        )

    return (
        <div className={style.employeesContainer}>
            <EmployeesWithVacationsSearchFilter />
            {data?.pages.map((page) =>
                page.data.map((user: UserWithVacation) => (
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
                        <div className={style.collapsedData}>
                            <div className={style.collapseDataVacationList}>
                                <h3>Vacations this year</h3>
                                <div>
                                    {user.vacations &&
                                        user.vacations.length > 0 ? (
                                        user.vacations.map(({ type, _id }) => (
                                            <p key={_id}>{type}</p>
                                        ))
                                    ) : (
                                        <p>No vacations this year</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </SimpleCollapsableCard>
                )),
            )}
            <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>
        </div>
    )
}
