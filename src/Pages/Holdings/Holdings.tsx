import { EmployeesWithHoldings } from './Component/EmployeesWithHoldings.tsx'
import style from './style/holdings.module.scss'
import HoldingsProvider from './HoldingsContext.tsx'
import { HoldingsSearchFilter } from './Component/SearchFilters.tsx'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'
import { MyAssets } from './Component/MyAssets.tsx'
import PageIntro from '@/Components/PageIntro/PageIntro'

function HoldingsComponent() {
    return (
        <main className={style.main}>
            <PageIntro
                eyebrow="Equipment"
                title="Holdings"
                description="Review employee asset ownership, inspect active assignments, and process returns from one place."
                className="mb-6"
            />
            <HoldingsSearchFilter />

            <div className={style.mainContainer}>
                <EmployeesWithHoldings />
            </div>
        </main>
    )
}

export default function Holdings() {
    const { currentUser } = useAuth()

    if (!isAdminRole(currentUser?.role)) {
        return <MyAssets />
    }

    return (
        <HoldingsProvider>
            <HoldingsComponent />
        </HoldingsProvider>
    )
}
