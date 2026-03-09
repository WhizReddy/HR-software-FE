import { useContext } from 'react'
import { ModalComponent } from '@/Components/Modal/Modal'
import { QrCode } from 'lucide-react'
import { InventoryContext } from '../InventoryContext'
import { useGetOneInventoryItem } from '../Hook'
import style from '../style/singleInventoryItem.module.scss'
import { TitleCaser } from '@/Helpers/TitleCaser'
import { ItemHistory } from '../types'
import dayjs from 'dayjs'

export const SingleInventoryItem = () => {
    const {
        viewAssetModalOpen: open,
        handleCloseViewAssetModalOpen: handleClose,
    } = useContext(InventoryContext)

    const { error, isLoading, data } = useGetOneInventoryItem()
    return (
        <ModalComponent handleClose={handleClose} open={open}>
            {error ? (
                <p>Error fetching asset</p>
            ) : isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="p-2">
                        <div className={style.titleContainer}>
                            {data && <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{data.type && TitleCaser(data?.type)}</h3>}
                            <div className="text-right">
                                <p className={style.sn}>
                                    <span className="text-slate-400 text-sm font-medium uppercase tracking-widest mr-2">SN:</span>
                                    {data?.serialNumber}
                                    <QrCode size={18} className="text-blue-500 inline-block ml-2 opacity-70" />
                                </p>
                                {data && renderStatus(data.status, data.userId)}
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Assignment History
                            </h4>

                            <div className={style.historyContainer}>
                                {data?.history && data.history.length !== 0 ? (
                                    <div className="space-y-3">
                                        <div className={`${style.singleHistoryHeading} text-xs uppercase text-slate-400 font-bold px-4`}>
                                            <p>Taken</p>
                                            <p>Returned</p>
                                            <p>User</p>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                            {data?.history.map(
                                                (history: ItemHistory, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`${style.singleHistory} bg-slate-50/80 hover:bg-white hover:shadow-md transition-all rounded-xl p-4 border border-transparent hover:border-blue-100 group`}
                                                    >
                                                        <p className="text-slate-600 font-medium">
                                                            {dayjs(history?.takenDate).format('DD MMM YYYY')}
                                                            <span className="block text-[10px] text-slate-400 font-normal">
                                                                {dayjs(history?.takenDate).format('HH:mm')}
                                                            </span>
                                                        </p>
                                                        <p className="text-slate-600 font-medium">
                                                            {history.returnDate ? (
                                                                <>
                                                                    {dayjs(history.returnDate).format('DD MMM YYYY')}
                                                                    <span className="block text-[10px] text-slate-400 font-normal">
                                                                        {dayjs(history.returnDate).format('HH:mm')}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter">Current</span>
                                                            )}
                                                        </p>
                                                        <p className="text-[#2457a3] font-bold group-hover:scale-105 transition-transform origin-left">
                                                            {history.user?.firstName}{' '}
                                                            {history.user?.lastName}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                        <p className="text-slate-400 font-medium">No history found for this asset</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </ModalComponent>
    )
}

const renderStatus = (
    status: string,
    user: { firstName: string; lastName: string } | null = null,
) => {
    return (
        <span>
            <span
                style={{
                    color:
                        status === 'assigned'
                            ? '#d32f2f'
                            : status === 'available'
                                ? '#02a700'
                                : '4d4d4d',
                }}
            >
                {status}
            </span>
            {user && (
                <>
                    <span>to</span>
                    <strong>
                        {user.firstName} {user.lastName}
                    </strong>
                </>
            )}
        </span>
    )
}
