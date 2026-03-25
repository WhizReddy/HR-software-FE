import { useEmployeesWithHoldings } from '../Hook/index.ts'
import { UserWithHoldings } from '../TAsset'
import { useInView } from 'react-intersection-observer'
import { useContext, useEffect } from 'react'
import { HoldingsContext } from '../HoldingsContext.tsx'
import { Button } from '@/Components/ui/button'
import { AssignAssetModal } from './Modals/AssignAssetModal.tsx'
import { ReturnAssetModal } from './Modals/ReturnAssetModal.tsx'
import { RingLoader } from 'react-spinners'
import style from '../style/employeesWithHoldings.module.scss'

export const EmployeesWithHoldings = () => {
    const {
        isError,
        error,
        data,
        isLoading,
        fetchNextPage,
        isFetchingNextPage,
    } = useEmployeesWithHoldings()
    const { searchParams, setSearchParams } =
        useContext(HoldingsContext)

    const { ref, inView } = useInView()
    const users = data?.pages.flatMap((page) => page.data) ?? []
    const totalUsers = data?.pages[0]?.all ?? users.length
    const withAssetsCount = users.filter((user) => user.assets?.length > 0).length
    const totalAssignedAssets = users.reduce(
        (sum, user) => sum + (user.assets?.length ?? 0),
        0,
    )

    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView])

    const setClickedOnHolding = (itemId: string) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams)
            newParams.set('ownedItem', itemId)
            return newParams
        })
    }
    const setClickedOnAssignItem = (userId: string) => {
        setSearchParams((prevParams) => {
            const newParams = new URLSearchParams(prevParams)
            newParams.set('assignItem', 'true')
            newParams.set('selectedUser', userId)
            return newParams
        })
    }

    if (isError) return <div className="p-4 text-red-500">Error: {error.message}</div>

    if (isLoading) return (
        <div className="flex justify-center flex-col items-center min-h-[400px]">
            <RingLoader color="#2457A3" />
        </div>
    )

    return (
        <div className="mt-6 space-y-5">
            <div className={style.statsGrid}>
                <article className={style.statCard}>
                    <span className={style.statLabel}>People</span>
                    <strong className={style.statValue}>{totalUsers}</strong>
                    <p className={style.statMeta}>Matching current filter</p>
                </article>
                <article className={style.statCard}>
                    <span className={style.statLabel}>With Assets</span>
                    <strong className={style.statValue}>{withAssetsCount}</strong>
                    <p className={style.statMeta}>Assigned right now</p>
                </article>
                <article className={style.statCard}>
                    <span className={style.statLabel}>Total Holdings</span>
                    <strong className={style.statValue}>
                        {totalAssignedAssets}
                    </strong>
                    <p className={style.statMeta}>Visible in this view</p>
                </article>
            </div>

            <div className={style.cardsList}>
                {users.map((user: UserWithHoldings) => (
                    <article key={user._id} className={style.employeeCard}>
                        <div className={style.employeeHeader}>
                            <div className={style.identityBlock}>
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className={style.avatar}
                                    />
                                ) : (
                                    <div className={style.avatarFallback}>
                                        {user.firstName?.[0]}
                                        {user.lastName?.[0]}
                                    </div>
                                )}

                                <div className={style.identityText}>
                                    <h2>
                                        {user.firstName} {user.lastName}
                                    </h2>
                                    <p>{user.email}</p>
                                    <p>{user.phone || 'No phone saved'}</p>
                                </div>
                            </div>

                            <div className={style.headerMeta}>
                                <div className={style.metaPills}>
                                    <span className={style.metaPill}>
                                        {user.role || 'Employee'}
                                    </span>
                                    <span
                                        className={`${style.statusBadge} ${
                                            user.assets &&
                                            user.assets.length > 0
                                                ? style.active
                                                : style.inactive
                                        }`}
                                    >
                                        {user.assets && user.assets.length > 0
                                            ? 'With assets'
                                            : 'No assets'}
                                    </span>
                                </div>

                                <Button
                                    onClick={() =>
                                        setClickedOnAssignItem(user._id)
                                    }
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 font-semibold text-blue-700 hover:bg-blue-50"
                                >
                                    Assign asset
                                </Button>
                            </div>
                        </div>

                        <div className={style.summaryGrid}>
                            <article className={style.summaryCard}>
                                <span className={style.summaryLabel}>
                                    Active holdings
                                </span>
                                <strong className={style.summaryValue}>
                                    {user.assets?.length ?? 0}
                                </strong>
                            </article>
                            <article className={style.summaryCard}>
                                <span className={style.summaryLabel}>
                                    Primary role
                                </span>
                                <strong className={style.summaryValue}>
                                    {user.role || 'Employee'}
                                </strong>
                            </article>
                            <article className={style.summaryCard}>
                                <span className={style.summaryLabel}>
                                    Availability
                                </span>
                                <strong className={style.summaryValue}>
                                    {user.assets?.length
                                        ? 'Has assigned gear'
                                        : 'Ready for assignment'}
                                </strong>
                            </article>
                        </div>

                        <div className={style.assetsSection}>
                            <div className={style.assetsHeader}>
                                <h3>Assigned items</h3>
                                <span>
                                    Click an item to open the return flow
                                </span>
                            </div>

                            {user.assets && user.assets.length > 0 ? (
                                <div className={style.assetGrid}>
                                    {user.assets.map(
                                        ({ type, _id, serialNumber }) => (
                                            <button
                                                key={_id}
                                                type="button"
                                                onClick={() =>
                                                    setClickedOnHolding(_id)
                                                }
                                                className={style.assetBadge}
                                            >
                                                <span>{type}</span>
                                                <small>{serialNumber}</small>
                                            </button>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className={style.emptyStatePanel}>
                                    <p className={style.emptyState}>
                                        This employee currently has no company
                                        assets assigned.
                                    </p>
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
            {searchParams.get('assignItem') && <AssignAssetModal />}
            {searchParams.get('ownedItem') && <ReturnAssetModal />}
            <div ref={ref} className="text-center py-8 text-slate-400 text-sm font-medium">
                {isFetchingNextPage && (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                )}
            </div>
        </div>
    )
}
