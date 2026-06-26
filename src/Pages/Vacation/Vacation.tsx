import { useContext, useEffect } from 'react'
import { VacationProvider, VacationContext } from './VacationContext'
import { VacationTable } from './components/VacationTable'
import { EmployeesWithVacations } from './components/EmployeesWithVacations'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { Plus } from 'lucide-react'

import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import { upsertFilterParams } from '@/Helpers/urlFilters'
import PageIntro from '@/Components/PageIntro/PageIntro'

function VacationComponent() {
    const { searchParams, setSearchParams, createVacationToggler } =
        useContext(VacationContext)

    const handleChange = (value: string) => {
        if (value) {
            setSearchParams(
                (prev) =>
                    upsertFilterParams(prev, {
                        vacationType: value,
                        selectedVacation: null,
                    }),
                { replace: true },
            )
        }
    }

    useEffect(() => {
        if (!searchParams.get('vacationType')) {
            setSearchParams(
                (prev) =>
                    upsertFilterParams(prev, { vacationType: 'requests' }),
                { replace: true },
            )
        }
    }, [searchParams, setSearchParams])

    const currentTab = searchParams.get('vacationType') || 'requests'

    return (
        <div className="mx-auto w-full max-w-full space-y-6">
            <PageIntro
                eyebrow="People"
                title="Vacation Management"
                description="Review vacation requests, leave history, and employee balances."
            />

            <div className="flex flex-col items-stretch justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center">
                <ToggleGroup
                    type="single"
                    value={currentTab}
                    onValueChange={handleChange}
                    className="justify-start rounded-md bg-slate-100 p-1"
                >
                    <ToggleGroupItem
                        value="requests"
                        className="rounded-md px-6 text-sm font-semibold transition-all data-[state=on]:bg-white data-[state=on]:text-slate-800 data-[state=on]:shadow-sm"
                    >
                        Requests
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="userLeaves"
                        className="rounded-md px-6 text-sm font-semibold transition-all data-[state=on]:bg-white data-[state=on]:text-slate-800 data-[state=on]:shadow-sm"
                    >
                        User Leaves
                    </ToggleGroupItem>
                </ToggleGroup>

                <Button
                    onClick={createVacationToggler}
                    btnText="Request Vacation"
                    type={ButtonTypes.PRIMARY}
                    icon={<Plus size={18} />}
                    className="w-full sm:w-auto"
                />
            </div>

            {searchParams.get('createVacation') && (
                <div className="animate-in fade-in slide-in-from-top-4">
                    <CreateVacationForm />
                </div>
            )}
            {currentTab === 'requests' && <VacationTable />}
            {currentTab === 'userLeaves' && <EmployeesWithVacations />}
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
