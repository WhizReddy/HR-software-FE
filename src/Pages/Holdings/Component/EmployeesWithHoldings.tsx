import { useEmployeesWithHoldings } from '../Hook/index.ts'
import { UserWithHoldings } from '../TAsset'
import { useInView } from 'react-intersection-observer'
import { useContext, useEffect } from 'react'
import SimpleCollapsableCard from '@/Components/Vacation_Asset/SimpleCollapsableCard.tsx'
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
        <div className="flex flex-col mt-6">
            <div className={style.tableHeader}>
                <span>Employee</span>
                <span>Role</span>
                <span>Active Holdings</span>
                <span>Status</span>
                <span className="text-right">Action</span>
            </div>

            <div className="flex flex-col gap-3">
                {data?.pages.map((page) =>
                    page.data.map((user: UserWithHoldings) => (
                        <div key={user._id} className={style.rowWrapper}>
                            <SimpleCollapsableCard
                                user={user}
                                searchParams={searchParams}
                                setSearchParams={setSearchParams}
                            >
                                {/* Custom Row Header that aligns with Table Header */}
                                <div
                                    className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                >
                                    <div className={style.gridRow}>
                                        <div className={style.employeeCol}>
                                            {user.imageUrl ? (
                                                <img
                                                    src={user.imageUrl}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                                                    {user.firstName[0]}{user.lastName[0]}
                                                </div>
                                            )}
                                            <span className="font-semibold text-slate-800">
                                                {user.firstName} {user.lastName}
                                            </span>
                                        </div>

                                        <div className={style.roleCol}>
                                            {user.role || 'Employee'}
                                        </div>

                                        <div className={style.holdingsCol}>
                                            {user.assets && user.assets.length > 0 ? (
                                                <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                                    {user.assets.length} Assets
                                                </span>
                                            ) : (
                                                <span className={style.emptyState}>No assets</span>
                                            )}
                                        </div>

                                        <div className="flex items-center">
                                            <span className={`${style.statusBadge} ${user.assets && user.assets.length > 0 ? style.active : style.inactive}`}>
                                                {user.assets && user.assets.length > 0 ? 'W/ ASSETS' : 'W/O ASSETS'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action button inside the row header for quick access */}
                                    <div className="flex items-center gap-4">
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setClickedOnAssignItem(user._id);
                                            }}
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
                                        >
                                            Assign
                                        </Button>
                                    </div>
                                </div>

                                {/* Expanded Content (Details) */}
                                <div className="p-6 bg-slate-50/30 border-t border-slate-100/50">
                                    <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Inventory Details</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {user.assets && user.assets.length > 0 ? (
                                            user.assets.map(({ type, _id }) => (
                                                <div
                                                    key={_id}
                                                    onClick={() => setClickedOnHolding(_id)}
                                                    className={style.assetBadge}
                                                >
                                                    {type}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-slate-400 italic">This employee currently has no company assets assigned.</p>
                                        )}
                                    </div>

                                    {searchParams.get('assignItem') && (
                                        <AssignAssetModal />
                                    )}
                                    {searchParams.get('ownedItem') && (
                                        <ReturnAssetModal />
                                    )}
                                </div>
                            </SimpleCollapsableCard>
                        </div>
                    )),
                )}
            </div>
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
