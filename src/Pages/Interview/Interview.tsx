import { useMemo, type SyntheticEvent } from 'react'
import {
    BriefcaseBusiness,
    CalendarRange,
    Check,
    Mail,
    Phone,
    Trash2,
} from 'lucide-react'
import DataTable from '@/Components/Table/Table'
import PageIntro from '@/Components/PageIntro/PageIntro'
import { Button } from '@/Components/ui/button'
import { ColDef, RenderCellParams } from '@/types/table'
import { InterviewProvider, useInterviewContext } from './Hook/InterviewContext'
import RescheduleModal from './Component/ScheduleForm'
import { Interview } from './interface/interface'

const phaseLabels: Record<string, string> = {
    first_interview: 'First Interview',
    second_interview: 'Second Interview',
    rejected: 'Rejected',
    employed: 'Employed',
}

const phaseDescriptions: Record<string, string> = {
    first_interview:
        'Candidates currently queued for the first interview stage.',
    second_interview: 'Candidates moved forward for deeper evaluation.',
    rejected: 'Candidates rejected from the hiring process.',
    employed: 'Candidates accepted and moved into employment.',
}

const getPhaseLabel = (phase: string) =>
    phaseLabels[phase] ||
    phase.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

function InterviewContent() {
    const {
        loading,
        error,
        isReschedule,
        selectedInterview,
        isModalOpen,
        handleOpenModal,
        handleCloseModal,
        handleSchedule,
        handleCancel,
        handleNavigateToProfile,
        formatDate,
        handleAccept,
        phases,
        handleTabChange,
        currentTab,
        searchQuery,
        setSearchQuery,
        filteredInterviews,
        getInterviewsByPhase,
        processingIds,
    } = useInterviewContext()

    const isTerminalPhase =
        currentTab === 'employed' || currentTab === 'rejected'
    const currentLabel = getPhaseLabel(currentTab)
    const currentDescription =
        phaseDescriptions[currentTab] ||
        'Interview records for the selected phase.'

    const columns = useMemo<ColDef<Interview>[]>(() => {
        const baseColumns: ColDef<Interview>[] = [
            {
                field: 'fullName',
                headerName: 'Candidate',
                width: 240,
                renderCell: ({ row }: RenderCellParams<Interview>) => (
                    <div className="min-w-0">
                        <button
                            type="button"
                            onClick={(event) => {
                                event.stopPropagation()
                                handleNavigateToProfile(row._id.toString())
                            }}
                            className="block max-w-[220px] truncate text-left text-sm font-bold text-slate-900 transition-colors hover:text-[#2457a3]"
                        >
                            {row.firstName} {row.lastName}
                        </button>
                        {row.notes && (
                            <p
                                className="mt-1 max-w-[220px] truncate text-xs font-medium text-slate-400"
                                title={row.notes}
                            >
                                {row.notes}
                            </p>
                        )}
                    </div>
                ),
            },
            {
                field: 'positionApplied',
                headerName: 'Position',
                width: 210,
                renderCell: ({ value }: RenderCellParams<Interview>) => (
                    <span className="inline-flex max-w-[190px] items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
                        <BriefcaseBusiness size={14} />
                        <span className="truncate">
                            {String(value || 'Not specified')}
                        </span>
                    </span>
                ),
            },
        ]

        if (!isTerminalPhase) {
            baseColumns.push({
                field: 'firstInterviewDate',
                headerName: 'Interview Date',
                width: 210,
                renderCell: ({ row }: RenderCellParams<Interview>) => {
                    const date =
                        row.currentPhase === 'second_interview'
                            ? row.secondInterviewDate
                            : row.firstInterviewDate
                    const formattedDate = formatDate(date)

                    return (
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                            <CalendarRange
                                size={15}
                                className="text-[#2457a3]"
                            />
                            {formattedDate === 'No Date Provided'
                                ? 'Not scheduled'
                                : formattedDate}
                        </span>
                    )
                },
            })
        }

        baseColumns.push(
            {
                field: 'email',
                headerName: 'Contact',
                width: 280,
                renderCell: ({ row }: RenderCellParams<Interview>) => (
                    <div className="space-y-1 text-xs font-medium text-slate-500">
                        <p className="flex max-w-[260px] items-center gap-2 truncate">
                            <Mail
                                size={14}
                                className="shrink-0 text-slate-400"
                            />
                            {row.email || 'No email'}
                        </p>
                        <p className="flex items-center gap-2 text-slate-400">
                            <Phone size={14} className="shrink-0" />
                            {row.phoneNumber || 'No phone'}
                        </p>
                    </div>
                ),
            },
            {
                field: 'actions',
                headerName: 'Actions',
                width: 260,
                renderCell: ({ row }: RenderCellParams<Interview>) => {
                    const rowId = row._id.toString()
                    const isProcessing = processingIds.has(rowId)

                    if (isTerminalPhase) {
                        return (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleNavigateToProfile(rowId)
                                }}
                            >
                                View Details
                            </Button>
                        )
                    }

                    return (
                        <div className="flex flex-wrap justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isProcessing}
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleOpenModal(row, true)
                                }}
                            >
                                <CalendarRange size={15} />
                                Edit Date
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                disabled={isProcessing}
                                aria-label={`Reject ${row.firstName} ${row.lastName}`}
                                className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleCancel(row)
                                }}
                            >
                                <Trash2 size={16} />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon-sm"
                                disabled={isProcessing}
                                aria-label={
                                    currentTab === 'second_interview'
                                        ? `Hire ${row.firstName} ${row.lastName}`
                                        : `Advance ${row.firstName} ${row.lastName}`
                                }
                                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    handleAccept(row)
                                }}
                            >
                                <Check size={16} />
                            </Button>
                        </div>
                    )
                },
            },
        )

        return baseColumns
    }, [
        currentTab,
        formatDate,
        handleAccept,
        handleCancel,
        handleNavigateToProfile,
        handleOpenModal,
        isTerminalPhase,
        processingIds,
    ])

    return (
        <main className="mx-auto w-full max-w-full space-y-6">
            <PageIntro
                eyebrow="Hiring"
                title="Interview Pipeline"
                description="Review scheduled interviews and move candidates through each hiring step."
            />

            {error && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-medium text-rose-700">
                    Error loading interviews:{' '}
                    {error instanceof Error ? error.message : 'Unknown error'}
                </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex gap-2 overflow-x-auto">
                    {phases.map((phase) => {
                        const isActive = currentTab === phase
                        const count = getInterviewsByPhase(phase).length

                        return (
                            <button
                                key={phase}
                                type="button"
                                onClick={() =>
                                    handleTabChange({} as SyntheticEvent, phase)
                                }
                                className={`flex min-w-[170px] items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                                    isActive
                                        ? 'border-[#2457a3] bg-blue-50 text-[#2457a3]'
                                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <span className="text-sm font-semibold">
                                    {getPhaseLabel(phase)}
                                </span>
                                <span
                                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                        isActive
                                            ? 'bg-white text-[#2457a3]'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}
                                >
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </section>

            <DataTable
                rows={filteredInterviews}
                columns={columns}
                getRowId={(row) => row._id}
                handleRowClick={({ row }) =>
                    handleNavigateToProfile(row._id.toString())
                }
                totalPages={1}
                totalCount={filteredInterviews.length}
                page={0}
                pageSize={Math.max(filteredInterviews.length, 5)}
                onPaginationModelChange={() => undefined}
                title={currentLabel}
                searchValue={searchQuery}
                onSearchChange={(event) => setSearchQuery(event.target.value)}
                onSearchClear={() => setSearchQuery('')}
                searchPlaceholder="Search candidates..."
                onResetFilters={() => setSearchQuery('')}
                hasActiveFilters={searchQuery.trim() !== ''}
                filterNode={
                    <span className="max-w-md text-sm leading-6 text-slate-500">
                        {currentDescription}
                    </span>
                }
                isLoading={loading}
                loadingLabel="Loading interview records..."
                showPaginationControls={false}
            />

            {isModalOpen && selectedInterview && (
                <RescheduleModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    handleSchedule={handleSchedule}
                    selectedInterview={selectedInterview}
                    isReschedule={isReschedule}
                />
            )}
        </main>
    )
}

const InterviewPage = () => (
    <InterviewProvider>
        <InterviewContent />
    </InterviewProvider>
)

export default InterviewPage
