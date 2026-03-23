import { useContext, useEffect, useState } from 'react'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'
import { VacationContext } from '../VacationContext'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export const EmployeesWithVacationsSearchFilter = () => {
    const { searchParams, setSearchParams } = useContext(VacationContext)
    const [searchInput, setSearchInput] = useState(
        searchParams.get('search') || '',
    )
    const debouncedSearch = useDebouncedValue(searchInput, 400)

    useEffect(() => {
        setSearchInput(searchParams.get('search') || '')
    }, [searchParams])

    useEffect(() => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    search: debouncedSearch.trim() || null,
                    users: null,
                    selectedVacation: null,
                    userId: null,
                },
                { resetPage: true },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [debouncedSearch, setSearchParams])

    return (
        <div className="mb-4 w-full sm:max-w-sm">
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
    )
}
