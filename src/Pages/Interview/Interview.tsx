import { Check, Trash2, CalendarRange } from 'lucide-react'
import { InterviewProvider, useInterviewContext } from './Hook/InterviewContext'
import style from './styles/Interview.module.css'
import RescheduleModal from './Component/ScheduleForm'
import Input from '@/Components/Input/Index'

function InterviewKanbanContent() {
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
        processingIds,
    } = useInterviewContext()

    if (loading) return <div>Loading...</div>
    if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return <div>Error loading interviews: {errorMessage}</div>
    }
    return (
        <main className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8">
            <div className={`${style.kanbanBoard} max-w-7xl mx-auto backdrop-blur-sm bg-white/40 border border-white/60 shadow-xl rounded-[2rem]`}>
                <div className={style.filterContainer}>
                    <Input
                        IsUsername
                        name="searchQuery"
                        label="Search Candidates..."
                        type="search"
                        value={searchQuery}
                        width="100%"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`${style.filterField} bg-white/50 backdrop-blur-sm border-white/80 shadow-sm transition-all focus:bg-white/80`}
                    />
                </div>

                <div className="flex border-b border-slate-200/60 mb-8 gap-8 overflow-x-auto pb-2 custom-scrollbar px-2">
                    {(phases as string[]).map((phase) => (
                        <button
                            key={phase}
                            className={`pb-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap px-4 py-2 rounded-t-lg ${currentTab === phase
                                ? 'border-[#2457a3] text-[#2457a3] bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/50 hover:border-slate-300'
                                }`}
                            onClick={() => handleTabChange({} as React.SyntheticEvent, phase)}
                        >
                            {(phase as string).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto px-4 pb-8">
                    <table className="w-full border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-slate-500 text-sm font-semibold text-left">
                                <th className="px-6 py-3">Candidate</th>
                                <th className="px-6 py-3">Position</th>
                                {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                    <th className="px-6 py-3">Interview Date</th>
                                )}
                                <th className="px-6 py-3">Contact Info</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInterviews.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 text-slate-400 bg-white/30 rounded-2xl border border-dashed border-slate-200">
                                        No candidates found in this phase.
                                    </td>
                                </tr>
                            ) : (
                                filteredInterviews.map((interview) => (
                                    <tr key={interview._id.toString()} className="group hover:translate-y-[-2px] transition-all duration-300">
                                        {/* Candidate Name */}
                                        <td className="bg-white/70 backdrop-blur-md px-6 py-4 rounded-l-2xl border-y border-l border-white/60 shadow-sm group-hover:bg-white/90 group-hover:shadow-md">
                                            <div className="flex flex-col">
                                                <span
                                                    onClick={() => handleNavigateToProfile(interview._id.toString())}
                                                    className="font-bold text-slate-800 cursor-pointer hover:text-[#2457a3] transition-colors text-base"
                                                >
                                                    {`${interview.firstName} ${interview.lastName}`}
                                                </span>
                                                {interview.notes && (
                                                    <span className="text-xs text-slate-400 italic mt-1 line-clamp-1 truncate max-w-[200px]" title={interview.notes}>
                                                        {interview.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Position */}
                                        <td className="bg-white/70 backdrop-blur-md px-6 py-4 border-y border-white/60 shadow-sm group-hover:bg-white/90 group-hover:shadow-md">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wider">
                                                {interview.positionApplied}
                                            </span>
                                        </td>

                                        {/* Interview Date */}
                                        {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                            <td className="bg-white/70 backdrop-blur-md px-6 py-4 border-y border-white/60 shadow-sm group-hover:bg-white/90 group-hover:shadow-md">
                                                <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                                                    <CalendarRange size={14} className="text-[#2457a3]" />
                                                    {interview.currentPhase === 'second_interview'
                                                        ? formatDate(interview.secondInterviewDate)
                                                        : formatDate(interview.firstInterviewDate)}
                                                </div>
                                            </td>
                                        )}

                                        {/* Contact Info */}
                                        <td className="bg-white/70 backdrop-blur-md px-6 py-4 border-y border-white/60 shadow-sm group-hover:bg-white/90 group-hover:shadow-md">
                                            <div className="flex flex-col gap-0.5 text-xs">
                                                <span className="text-slate-500 flex items-center gap-1.5">
                                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                                    {interview.email}
                                                </span>
                                                <span className="text-slate-400 font-medium">
                                                    {interview.phoneNumber}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="bg-white/70 backdrop-blur-md px-6 py-4 rounded-r-2xl border-y border-r border-white/60 shadow-sm group-hover:bg-white/90 group-hover:shadow-md">
                                            <div className="flex justify-end items-center gap-2">
                                                {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                                    <button
                                                        onClick={() => handleOpenModal(interview, false)}
                                                        disabled={processingIds.has(interview._id.toString())}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors disabled:opacity-50"
                                                        title="Schedule Next Interview"
                                                    >
                                                        <CalendarRange size={18} />
                                                    </button>
                                                )}

                                                {currentTab !== 'employed' && currentTab !== 'rejected' && (
                                                    <button
                                                        onClick={() => handleCancel(interview)}
                                                        disabled={processingIds.has(interview._id.toString())}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}

                                                {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                                    <button
                                                        onClick={() => handleAccept(interview)}
                                                        disabled={processingIds.has(interview._id.toString())}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-xl transition-colors disabled:opacity-50"
                                                        title="Accept"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {isModalOpen && selectedInterview && (
                    <RescheduleModal
                        open={isModalOpen}
                        handleClose={handleCloseModal}
                        handleSchedule={handleSchedule}
                        selectedInterview={selectedInterview}
                        isReschedule={isReschedule}
                    />
                )}
            </div>
        </main>
    )
}

const InterviewKanban = () => (
    <InterviewProvider>
        <InterviewKanbanContent />
    </InterviewProvider>
)

export default InterviewKanban
