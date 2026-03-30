import { useContext } from 'react'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'
import { VacationContext } from '../VacationContext'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import { Button } from '@/Components/ui/button'

export const EmployeesWithVacationsSearchFilter = () => {
    const { searchParams, setSearchParams } = useContext(VacationContext)
    const {
        searchValue: searchInput,
        setSearchValue: setSearchInput,
        clearSearch,
    } = useUrlTableState({
        searchParams,
        setSearchParams,
        ensurePagination: false,
        resetPageOnSearch: false,
        additionalSearchUpdates: {
            users: null,
            selectedVacation: null,
            userId: null,
        },
    })
    const hasSearch = searchInput.trim() !== ''

    return (
        <div className="mb-4 flex w-full flex-col gap-2 sm:max-w-md sm:flex-row sm:items-end">
            <div className="flex-1">
                <Input
                    type="search"
                    iconPosition="end"
                    icon={<Search size={20} className="text-slate-400" />}
                    IsUsername
                    label="Search Employees"
                    name="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
            </div>
            <Button
                type="button"
                variant="outline"
                onClick={clearSearch}
                disabled={!hasSearch}
            >
                Clear
            </Button>
        </div>
    )
}
