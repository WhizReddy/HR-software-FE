import { useContext, useEffect } from 'react'
import { VacationProvider, VacationContext } from './VacationContext'
import { VacationTable } from './components/VacationTable'
import { EmployeesWithVacations } from './components/EmployeesWithVacations'
import { CreateVacationForm } from './components/form/CreateVacationForm'
import { Plus } from 'lucide-react'

import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { ToggleGroup, ToggleGroupItem } from '@/Components/ui/toggle-group'
import { Card } from '@/Components/ui/card'
import { upsertFilterParams } from '@/Helpers/urlFilters'

function VacationComponent() {
    const { searchParams, setSearchParams, createVacationToggler } =
        useContext(VacationContext)

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

    useEffect(() => {
        if (!searchParams.get('vacationType')) {
            setSearchParams((prev) =>
                upsertFilterParams(prev, { vacationType: 'requests' }),
            )
        }
    }, [searchParams, setSearchParams])

    const currentTab = searchParams.get('vacationType') || 'requests'

    return (
        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <ToggleGroup
                    type="single"
                    value={currentTab}
                    onValueChange={handleChange}
                    className="justify-start bg-slate-100/50 p-1 rounded-lg"
                >
                    <ToggleGroupItem
                        value="requests"
                        className="px-6 data-[state=on]:bg-white data-[state=on]:text-primary-blue data-[state=on]:shadow-sm transition-all"
                    >
                        Requests
                    </ToggleGroupItem>
                    <ToggleGroupItem
                        value="userLeaves"
                        className="px-6 data-[state=on]:bg-white data-[state=on]:text-primary-blue data-[state=on]:shadow-sm transition-all"
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
            {currentTab === 'userLeaves' && (
                <Card className="bg-white shadow-sm border border-slate-100 rounded-xl overflow-hidden mt-4">
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
