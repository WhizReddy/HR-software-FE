import { useContext, useEffect, useState } from 'react'
import { HoldingsContext } from '../HoldingsContext'
import Input from '@/Components/Input/Index'
import { Search } from 'lucide-react'
import {
    hasSearchParamsChanged,
    upsertFilterParams,
} from '@/Helpers/urlFilters'
import { useDebouncedValue } from '@/hooks/use-debounced-value'

export const HoldingsSearchFilter = () => {
    const { searchParams, setSearchParams } = useContext(HoldingsContext)
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
                },
                { resetPage: true },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }, [debouncedSearch, setSearchParams])

    const handleChange = (value: string) => {
        setSearchParams((prev) => {
            const nextParams = upsertFilterParams(
                prev,
                {
                    users: value === 'all' ? null : value,
                    selectedUser: null,
                    assignItem: null,
                    ownedItem: null,
                },
                { resetPage: true },
            )

            return hasSearchParamsChanged(prev, nextParams) ? nextParams : prev
        })
    }

    const userFilterChoices = [
        { label: 'ALL', value: 'all' },
        { label: 'W ASSETS', value: 'with' },
        { label: 'W/O ASSETS', value: 'without' }
    ]

    const currentUserFilter = searchParams.get('users') || 'all'

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="w-full sm:w-72">
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

            <div className="flex flex-col gap-1.5 sm:items-end">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Filter by
                </span>
                <div className="inline-flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                    {userFilterChoices.map((filter) => {
                        const isActive = currentUserFilter === filter.value
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() => handleChange(filter.value)}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ease-in-out ${isActive
                                        ? 'bg-white text-primary-blue shadow-sm ring-1 ring-slate-200/50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
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
