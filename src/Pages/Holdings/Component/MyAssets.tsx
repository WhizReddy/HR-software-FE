import { useAuth } from '@/features/auth/context/AuthProvider'
import { getUserHoldings } from '../Hook/queries'
import { useQuery } from '@tanstack/react-query'
import { RingLoader } from 'react-spinners'
import {
    CalendarClock,
    Package,
    ShieldCheck,
    UserRound,
} from 'lucide-react'
import PageIntro from '@/Components/PageIntro/PageIntro'

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

    const assets = data?.assets ?? []
    const activeAssets = assets.filter((asset) => asset.status === 'assigned')
    const latestTakenDate = assets
        .map((asset) => asset.takenDate)
        .filter(Boolean)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]

    return (
        <div className="space-y-6">
            <PageIntro
                eyebrow="Equipment"
                title="My Assets"
                description="Track the equipment currently assigned to you, check issue dates, and review return status without going through an oversized admin table."
                actions={
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/90 px-4 py-3 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-[#2457a3]">
                            <UserRound size={18} />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-semibold text-slate-800">
                                {data?.firstName} {data?.lastName}
                            </p>
                            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                                {data?.role ?? 'Employee'}
                            </p>
                        </div>
                    </div>
                }
            />

            <section className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Total Assets
                    </p>
                    <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-900">
                        {assets.length}
                    </strong>
                    <p className="mt-2 text-sm text-slate-500">
                        Items linked to your profile.
                    </p>
                </article>

                <article className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <ShieldCheck size={16} className="text-[#2457a3]" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                            Active Assignments
                        </p>
                    </div>
                    <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-900">
                        {activeAssets.length}
                    </strong>
                    <p className="mt-2 text-sm text-slate-500">
                        Assets currently marked as assigned.
                    </p>
                </article>

                <article className="rounded-[24px] border border-slate-200/70 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <CalendarClock size={16} className="text-[#2457a3]" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
                            Latest Issue Date
                        </p>
                    </div>
                    <strong className="mt-3 block text-xl font-black tracking-tight text-slate-900">
                        {latestTakenDate
                            ? new Date(latestTakenDate).toLocaleDateString()
                            : 'No date yet'}
                    </strong>
                    <p className="mt-2 text-sm text-slate-500">
                        Most recent asset handoff recorded in the system.
                    </p>
                </article>
            </section>

            {assets.length ? (
                <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
                    <div className="space-y-4">
                        {assets.map((asset) => (
                            <article
                                key={asset._id}
                                className="rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            {asset.type}
                                        </p>
                                        <h2 className="mt-2 text-xl font-black tracking-tight text-slate-900">
                                            {asset.serialNumber}
                                        </h2>
                                    </div>
                                    <span
                                        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                            asset.status === 'assigned'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-slate-100 text-slate-600'
                                        }`}
                                    >
                                        {asset.status}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Taken date
                                        </span>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {asset.takenDate
                                                ? new Date(
                                                      asset.takenDate,
                                                  ).toLocaleDateString()
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            Return date
                                        </span>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {asset.returnDate
                                                ? new Date(
                                                      asset.returnDate,
                                                  ).toLocaleDateString()
                                                : 'Not returned'}
                                        </p>
                                    </div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-3">
                                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                            History entries
                                        </span>
                                        <p className="mt-2 text-sm font-semibold text-slate-800">
                                            {asset.history?.length ?? 0}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <aside className="rounded-[28px] border border-slate-200/70 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-6 shadow-sm">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Account Snapshot
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#2457a3]">
                                <UserRound size={22} />
                            </div>
                            <div>
                                <p className="text-base font-bold text-slate-900">
                                    {data?.firstName} {data?.lastName}
                                </p>
                                <p className="text-sm text-slate-500">
                                    {data?.email}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Equipment status
                                </span>
                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                    {activeAssets.length > 0
                                        ? 'You currently have active company assets.'
                                        : 'No active company assets are assigned right now.'}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4">
                                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    What this page is for
                                </span>
                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                    This view is intentionally simple: see what
                                    is assigned to you and the key dates tied to
                                    each item.
                                </p>
                            </div>
                        </div>
                    </aside>
                </section>
            ) : (
                <section className="rounded-[28px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
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
