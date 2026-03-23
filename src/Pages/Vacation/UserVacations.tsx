import Card from '@/Components/Card/Card'
import style from './style/userVacations.module.scss'

import { VacationContext, VacationProvider } from './VacationContext'
import { useGetUserWithVacations } from './Hook'
import { Vacation } from './types'
import { Check, X, Clock } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { useAuth } from '@/Context/AuthProvider'
import { useParams } from 'react-router-dom'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

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

    if (isError) return <div>Error: {error.message}</div>
    if (isLoading) return <div className={style.loading}>Loading...</div>
    if (!data) return null

    const isOwnVacationPage = currentUser?._id === id

    return (
        <>
            <Card
                border="2px solid rgb(211,211,211,.5)"
                padding="1.5rem"
                borderRadius="1.25rem"
            >
                <div className={style.userImageNameRole}>
                    <img src={data.imageUrl} alt="" />
                    <div>
                        <h3>
                            {data.firstName} {data.lastName}
                        </h3>
                        <p>{data.role}</p>
                    </div>
                </div>
                <div className={style.generalInfo}>
                    <div>
                        <h4>Email</h4>
                        <p>{data.email}</p>
                    </div>
                    <div>
                        <h4>Phone</h4>
                        <p>{data.phone}</p>
                    </div>
                </div>

                <div className={style.itemsDiv}>
                    <h4>Vacation Requests</h4>
                    <div className={style.itemsListingContainer}>
                        {data.vacations.map((item: Vacation) => (
                            <div key={item._id} className={style.vacationContainer}>
                                {item.type}{' '}
                                {item.status === 'pending' ? (
                                    <Clock size={20} className="text-slate-400" />
                                ) : item.status === 'accepted' ? (
                                    <Check size={20} className="text-emerald-500" />
                                ) : (
                                    <X size={20} className="text-rose-500" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-sm font-medium text-slate-600 mt-2">
                        {takenLeaveDays} days taken this year
                    </div>
                </div>
                {isOwnVacationPage && (
                    <Button
                        onClick={createVacationToggler}
                        btnText="Request Vacation"
                        type={ButtonTypes.PRIMARY}
                        className="mt-4 w-full"
                    />
                )}
            </Card>
            {searchParams.get('createVacation') && <CreateVacationForm />}
        </>
    )
}

export default function UserVacations() {
    return (
        <VacationProvider>
            <UserVacationsComponent />
        </VacationProvider>
    )
}
