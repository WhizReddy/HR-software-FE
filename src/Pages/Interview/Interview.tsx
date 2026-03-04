import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Check, Trash2, CalendarRange } from 'lucide-react'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { InterviewProvider, useInterviewContext } from './Hook/InterviewContext'
import style from './styles/Interview.module.css'
import Button from '@/Components/Button/Button'
import RescheduleModal from './Component/ScheduleForm'
import Input from '@/Components/Input/Index'
import Selecter from '@/Components/Input/components/Select/Selecter'

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
        onDragEnd,
        handleNavigateToProfile,
        formatDate,
        phases,
        handleAccept,
        handleApplyFilter,
        handleClearFilter,
        handleTabChange,
        currentTab,
        currentPhase,
        startDate,
        endDate,
        setCurrentPhase,
        setStartDate,
        setEndDate,
        filteredInterviews,
        isFiltered,
        processingIds,
    } = useInterviewContext()

    if (loading) return <div>Loading...</div>
    if (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        return <div>Error loading interviews: {errorMessage}</div>
    }
    return (
        <div className={style.kanbanBoard}>
            <div className={style.filterContainer}>
                <Selecter
                    name="currentPhase"
                    label="Current Phase"
                    multiple={false}
                    value={currentPhase}
                    width='250px'
                    options={phases}
                    onChange={(newValue) =>
                        setCurrentPhase(Array.isArray(newValue) ? newValue[0] : newValue)
                    }
                />
                <Input
                    IsUsername
                    name=""
                    shrink
                    label="Start Date"
                    type="date"
                    value={startDate || ''}
                    width="250px"
                    onChange={(e) => setStartDate(e.target.value)}
                    className={style.filterField}
                />
                <Input
                    IsUsername
                    name=""
                    label="End Date"
                    type="date"
                    shrink
                    value={endDate || ''}
                    width="250px"
                    onChange={(e) => setEndDate(e.target.value)}
                    className={style.filterField}
                />
                <Button
                    type={ButtonTypes.PRIMARY}
                    width="170px"
                    btnText="Apply Filter"
                    onClick={handleApplyFilter}
                />
                {isFiltered && (
                    <Button
                        type={ButtonTypes.SECONDARY}
                        width="170px"
                        btnText="Clear Filter"
                        onClick={handleClearFilter}
                    />
                )}
            </div>

            <div className="flex border-b border-gray-200 mb-6 gap-6 overflow-x-auto">
                {phases.map((phase) => (
                    <button
                        key={phase}
                        className={`pb-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${currentTab === phase
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        onClick={() => handleTabChange({} as React.SyntheticEvent, phase)}
                    >
                        {phase.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                ))}
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <div className={style.kanbanColumns}>
                    <div key={currentTab} className={style.kanbanColumn}>
                        <h2>
                            {currentTab.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                            <span className="text-slate-600 ml-2">
                                ({filteredInterviews.length})
                            </span>
                        </h2>
                        <Droppable droppableId={currentTab}>
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className={style.kanbanList}
                                >
                                    {filteredInterviews.length === 0 ? (
                                        <p>Sorry, there is nothing to show here.</p>
                                    ) : (
                                        filteredInterviews.map((interview, index) => (
                                            <Draggable
                                                key={interview._id.toString()}
                                                draggableId={interview._id.toString()}
                                                index={index}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className={style.kanbanItem}
                                                    >
                                                        <h3
                                                            onClick={() =>
                                                                handleNavigateToProfile(interview._id.toString())
                                                            }
                                                            className={style.candidateName}
                                                        >
                                                            {`${interview.firstName} ${interview.lastName}`} {interview.positionApplied}
                                                        </h3>
                                                        {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                                            <>
                                                                <p>
                                                                    <b>Interview Date:</b>{' '}
                                                                    {interview.currentPhase === 'second_interview'
                                                                        ? formatDate(interview.secondInterviewDate)
                                                                        : formatDate(interview.firstInterviewDate)}
                                                                </p>
                                                                <p><b>Email:</b> {interview.email}</p>
                                                                <p><b>Phone:</b> {interview.phoneNumber}</p>
                                                                <p><b>Notes:</b> {interview.notes}</p>
                                                            </>
                                                        )}
                                                        {currentTab !== 'employed' && currentTab !== 'applicant' && (
                                                            <div className={style.buttonContainer}>
                                                                <span title="Reschedule">
                                                                    <Button
                                                                        type={ButtonTypes.SECONDARY}
                                                                        btnText=""
                                                                        width="40px"
                                                                        height="30px"
                                                                        display="flex"
                                                                        justifyContent="center"
                                                                        alignItems="center"
                                                                        color="#2457A3"
                                                                        borderColor="#2457A3"
                                                                        icon={<CalendarRange size={18} />}
                                                                        onClick={() =>
                                                                            handleOpenModal(interview, true)
                                                                        }
                                                                        disabled={processingIds.has(interview._id.toString())}
                                                                    />
                                                                </span>
                                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                                    <span title="Reject">
                                                                        {currentTab !== 'rejected' && (
                                                                            <Button
                                                                                btnText=" "
                                                                                type={ButtonTypes.SECONDARY}
                                                                                width="35px"
                                                                                height="30px"
                                                                                color="#C70039"
                                                                                borderColor="#C70039"
                                                                                display="flex"
                                                                                justifyContent="center"
                                                                                alignItems="center"
                                                                                icon={<Trash2 size={18} />}
                                                                                onClick={() => handleCancel(interview)}
                                                                                disabled={processingIds.has(interview._id.toString())}
                                                                            />
                                                                        )}
                                                                    </span>
                                                                    {currentTab !== 'applicant' && (
                                                                        <span title="Accept">
                                                                            <Button
                                                                                btnText=""
                                                                                type={ButtonTypes.SECONDARY}
                                                                                width="35px"
                                                                                height="30px"
                                                                                color="rgb(2, 167, 0)"
                                                                                borderColor="rgb(2, 167, 0)"
                                                                                display="flex"
                                                                                justifyContent="center"
                                                                                alignItems="center"
                                                                                icon={<Check size={18} />}
                                                                                onClick={() => handleAccept(interview)}
                                                                                disabled={processingIds.has(interview._id.toString())}
                                                                            />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))
                                    )}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </div>
            </DragDropContext>

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
    )
}

const InterviewKanban = () => (
    <InterviewProvider>
        <InterviewKanbanContent />
    </InterviewProvider>
)

export default InterviewKanban
