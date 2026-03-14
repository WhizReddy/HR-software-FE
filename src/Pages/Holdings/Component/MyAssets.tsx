import { useAuth } from '@/Context/AuthProvider'
import { getUserHoldings } from '../Hook/queries'
import { useQuery } from '@tanstack/react-query'
import { RingLoader } from 'react-spinners'
import { Package, ShieldCheck, UserRound } from 'lucide-react'

export const MyAssets = () => {
    const { currentUser } = useAuth()

    const { data, isError, error, isPending } = useQuery({
        queryKey: ['my-assets', currentUser?._id],
        queryFn: () => getUserHoldings(String(currentUser?._id)),
        enabled: Boolean(currentUser?._id),
    })

    if (isPending) {
        return (
            <div className="flex min-h-[320px] items-center justify-center">
                <RingLoader color="#2457A3" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-600">
                {error instanceof Error ? error.message : 'Failed to load assets.'}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-[28px] border border-slate-200/70 bg-[linear-gradient(135deg,#f4f8ff_0%,#ffffff_45%,#eef5ff_100%)] p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                            <ShieldCheck size={14} className="text-[#2457a3]" />
                            Personal Equipment
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">
                            My Assets
                        </h1>
                        <p className="mt-2 max-w-2xl text-sm text-slate-500">
                            Review the company equipment currently assigned to your account.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-white/80 bg-white/90 px-5 py-4 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-[#2457a3]">
                                <UserRound size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-800">
                                    {data?.firstName} {data?.lastName}
                                </p>
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                    {data?.role ?? 'Employee'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {data?.assets?.length ? (
                <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {data.assets.map((asset) => (
                        <article
                            key={asset._id}
                            className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                        {asset.type}
                                    </p>
                                    <h2 className="mt-2 text-lg font-bold text-slate-900">
                                        {asset.serialNumber}
                                    </h2>
                                </div>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${asset.status === 'assigned'
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-slate-100 text-slate-600'
                                    }`}>
                                    {asset.status}
                                </span>
                            </div>

                            <div className="mt-5 space-y-3 text-sm text-slate-600">
                                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <span className="font-medium text-slate-500">Taken date</span>
                                    <span className="font-semibold text-slate-800">
                                        {asset.takenDate
                                            ? new Date(asset.takenDate).toLocaleDateString()
                                            : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                                    <span className="font-medium text-slate-500">Return date</span>
                                    <span className="font-semibold text-slate-800">
                                        {asset.returnDate
                                            ? new Date(asset.returnDate).toLocaleDateString()
                                            : 'Not returned'}
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            ) : (
                <section className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Package size={28} />
                    </div>
                    <h2 className="mt-5 text-xl font-bold text-slate-900">
                        No assigned assets
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        You do not currently have any company equipment assigned.
                    </p>
                </section>
            )}
        </div>
    )
}
