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
        <div className="flex flex-col gap-4 mt-6">
            {data?.pages.map((page) =>
                page.data.map((user: UserWithHoldings) => (
                    <SimpleCollapsableCard
                        key={user._id}
                        user={user}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        items={
                            user.assets
                                ? { type: 'Holding', itemArr: user.assets }
                                : undefined
                        }
                    >
                        <div className="p-4 mt-0 bg-slate-50 border-t border-slate-100 rounded-b-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Occupied items</h3>
                                    <div className="flex flex-wrap gap-2 min-h-8">
                                        {user.assets &&
                                            user.assets.length > 0 ? (
                                            user.assets.map(({ type, _id }) => (
                                                <p
                                                    onClick={() => {
                                                        setClickedOnHolding(_id)
                                                    }}
                                                    key={_id}
                                                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer border border-blue-200/50"
                                                >
                                                    {type}
                                                </p>
                                            ))
                                        ) : (
                                            <p className="flex items-center text-sm text-slate-500 italic py-1">No holdings</p>
                                        )}
                                    </div>
                                </div>
                                <div className="shrink-0 flex items-center">
                                    <Button
                                        onClick={() => setClickedOnAssignItem(user._id)}
                                        variant="default"
                                        className="shadow-sm"
                                    >
                                        Assign asset
                                    </Button>
                                </div>
                            </div>
                            {searchParams.get('assignItem') && (
                                <AssignAssetModal />
                            )}
                            {searchParams.get('ownedItem') && (
                                <ReturnAssetModal />
                            )}
                        </div>
                    </SimpleCollapsableCard>
                )),
            )}
            <div ref={ref} className="text-center py-4 text-slate-500 text-sm">
                {isFetchingNextPage && 'Loading...'}
            </div>
        </div>
    )
}
