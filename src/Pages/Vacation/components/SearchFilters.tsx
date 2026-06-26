import { useContext } from 'react'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'
import { VacationContext } from '../VacationContext'
import { useUrlTableState } from '@/hooks/use-url-table-state'
import { Button } from '@/Components/ui/button'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'

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
            selectedVacation: null,
            userId: null,
        },
    })

    const handleUserFilterChange = (value: string) => {
        setSearchParams(
            (prev) => {
                const nextParams = upsertFilterParams(prev, {
                    users: value === 'all' ? null : value,
                    selectedVacation: null,
                    userId: null,
                })

                return hasSearchParamsChanged(prev, nextParams)
                    ? nextParams
                    : prev
            },
            { replace: true },
        )
    }

    const userFilterChoices = [
        { label: 'All users', value: 'all' },
        { label: 'With leave', value: 'with' },
        { label: 'No leave', value: 'without' },
    ]

    const currentUserFilter = searchParams.get('users') || 'all'
    const hasSearch = searchInput.trim() !== ''

    return (
        <div className="flex flex-col justify-between gap-4 rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)] lg:flex-row lg:items-end">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-end lg:max-w-xl">
                <div className="w-full sm:w-72">
                    <Input
                        type="search"
                        iconPosition="start"
                        icon={<Search size={18} className="text-slate-400" />}
                        IsUsername
                        placeholder="Search employees..."
                        name="search"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        height={40}
                    />
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={clearSearch}
                    disabled={!hasSearch}
                    className="h-10 w-full rounded-md sm:w-auto"
                >
                    Clear
                </Button>
            </div>

            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Leave records
                </span>
                <div className="grid grid-cols-3 rounded-md border border-slate-200 bg-slate-100 p-1">
                    {userFilterChoices.map((filter) => {
                        const isActive = currentUserFilter === filter.value
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() =>
                                    handleUserFilterChange(filter.value)
                                }
                                className={`min-h-9 rounded-md px-3 py-1.5 text-center text-xs font-semibold transition-all duration-200 ease-in-out ${
                                    isActive
                                        ? 'bg-white text-slate-800 shadow-sm ring-1 ring-slate-200/50'
                                        : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700'
                                }`}
                            >
                                {filter.label}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
