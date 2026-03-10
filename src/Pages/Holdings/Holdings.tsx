import { EmployeesWithHoldings } from './Component/EmployeesWithHoldings.tsx'
import style from './style/holdings.module.scss'
import HoldingsProvider from './HoldingsContext.tsx'
import { HoldingsSearchFilter } from './Component/SearchFilters.tsx'

function HoldingsComponent() {
    return (
        <main className={style.main}>
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Holdings
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Review employee asset ownership, assign inventory, and process returns from one place.
                </p>
            </div>
            <HoldingsSearchFilter />

            <div className={style.mainContainer}>
                <EmployeesWithHoldings />
            </div>
        </main>
    )
}

export default function Holdings() {
    return (
        <HoldingsProvider>
            <HoldingsComponent />
        </HoldingsProvider>
    )
}
