import { useContext, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { VacationProvider, VacationContext } from './VacationContext'
import { VacationTable } from './components/VacationTable'
import { EmployeesWithVacations } from './components/EmployeesWithVacations'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { UserVacationsContent } from './UserVacations'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import { Card } from '@/Components/ui/card'
import { upsertFilterParams } from '@/Helpers/urlFilters'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'

function VacationComponent() {
    const { currentUser } = useAuth()
    const isManager = isAdminRole(currentUser?.role)
    const { searchParams, setSearchParams, createVacationToggler } =
        useContext(VacationContext)

    useEffect(() => {
        if (!isManager) {
            return
        }

        if (!searchParams.get('vacationType')) {
            setSearchParams((prev) =>
                upsertFilterParams(prev, { vacationType: 'requests' }),
            )
        }
    }, [isManager, searchParams, setSearchParams])

    if (!isManager) {
        const currentUserId = currentUser?._id

        if (!currentUserId) {
            return null
        }

        return <UserVacationsContent userId={String(currentUserId)} />
    }

    const handleChange = (value: string) => {
        if (value) {
            setSearchParams((prev) =>
                upsertFilterParams(prev, {
                    vacationType: value,
                    selectedVacation: null,
                }),
            )
        }
    }

    const currentTab = searchParams.get('vacationType') || 'requests'

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Vacation Manager
                        </p>
                        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                            Keep requests, approvals, and employee history in one flow.
                        </h1>
                        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
                            Requests stay in a review queue, while employee leave history stays on a separate team view. That keeps the admin side straightforward.
                        </p>
                    </div>

                    <Button
                        onClick={createVacationToggler}
                        btnText="Request Vacation"
                        type={ButtonTypes.PRIMARY}
                        icon={<Plus size={18} />}
                        className="w-full sm:w-auto"
                    />
                </div>
            </section>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <ToggleGroup
                    type="single"
                    value={currentTab}
                    onValueChange={handleChange}
                    className="justify-start rounded-xl bg-slate-100/70 p-1"
                >
                    <ToggleGroupItem
                        value="requests"
                        className="px-6 data-[state=on]:bg-white data-[state=on]:text-primary-blue data-[state=on]:shadow-sm transition-all"
                    >
                        Request Queue
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="userLeaves"
                        className="px-6 data-[state=on]:bg-white data-[state=on]:text-primary-blue data-[state=on]:shadow-sm transition-all"
                    >
                        Team History
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>

            {searchParams.get('createVacation') && (
                <div className="animate-in fade-in slide-in-from-top-4">
                    <CreateVacationForm />
                </div>
            )}

            {currentTab === 'requests' && <VacationTable />}

            {currentTab === 'userLeaves' && (
                <Card className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                    <EmployeesWithVacations />
                </Card>
            )}
        </div>
    )
}

export default function Vacation() {
    return (
        <VacationProvider>
            <VacationComponent />
        </VacationProvider>
    )
}
