
import { Calendar, MapPin, Search } from 'lucide-react'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ModalComponent } from '@/Components/Modal/Modal'
import LongMenu from '@/Components/Menu/Menu'
import SelectedEventCard from './Components/SelectedEvent/SelectedEvent'
import Toast from '@/Components/Toast/Toast'
import { EventsProvider, useEvents } from './Context/EventsContext'
import Forms from './Forms/Forms'
import { useGetAllEvents } from './Hook'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { EventsData } from './Interface/Events'
import EventsContentLoader from '@/Components/Content/ContentLoader'

function EventsContentAndComponents() {
    const {
        handleDelete,
        handleToastClose,
        handleUpdateToastClose,
        showModal,
        closeModal,
        showEventModal,
        setShowEventModal,
        updateToastMessage,
        updateToastOpen,
        updateToastSeverity,
        toastOpen,
        toastMessage,
        toastSeverity,
        isAdmin,
        eventToDeleteId,
        handleOpenDrawer,
        formatDate,
        handleDeleteEventModal,
        handleSeeEventDetails
    } = useEvents()

    const {
        data: events,
        isFetchingNextPage,
        fetchNextPage,
        isLoading,
        onSearchChange,
        searchEvent,
    } = useGetAllEvents()

    const { ref, inView } = useInView()


    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView])

    return (
        <div className="flex flex-col h-full max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            <Toast
                severity={toastOpen ? toastSeverity : updateToastSeverity}
                open={toastOpen || updateToastOpen}
                message={toastOpen ? toastMessage : updateToastMessage}
                onClose={toastOpen ? handleToastClose : handleUpdateToastClose}
            />
            <Forms />

            {/* Header section with search and actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-8 w-full">
                <div className="w-full sm:max-w-md">
                    <Input
                        IsUsername
                        type="search"
                        label="Search events..."
                        name="Search"
                        width="100%"
                        iconPosition="end"
                        icon={<Search size={20} className="text-slate-400" />}
                        value={searchEvent}
                        onChange={onSearchChange}
                    />
                </div>
                {isAdmin && (
                    <Button
                        btnText="Create Event"
                        padding="10px"
                        width="150px"
                        backgroundColor="#2469FF"
                        border="none"
                        type={ButtonTypes.PRIMARY}
                        onClick={() => handleOpenDrawer('create')}
                    />
                )}
            </div>

            {/* Events Grid */}
            <div className="flex-1 w-full">
                {isLoading ? (
                    <EventsContentLoader />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {events?.pages.map((page: any) =>
                            page.data.map((event: EventsData) => (
                                <div
                                    key={event._id}
                                    className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col h-[320px] group"
                                >
                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3 gap-2">
                                            <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight">
                                                {event.title}
                                            </h3>
                                            {isAdmin && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <LongMenu
                                                        event={event}
                                                        onEdit={() => handleOpenDrawer('edit', event)}
                                                        onDelete={handleDeleteEventModal}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                                            {event.description}
                                        </p>

                                        <div className="space-y-3 mt-auto pt-4 border-t border-slate-50">
                                            <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <Calendar size={18} className="text-blue-500 flex-shrink-0" />
                                                <span className="font-medium">
                                                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                <MapPin size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                                                <span className="line-clamp-1">{event.location}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5 pt-2">
                                        <button
                                            onClick={() => handleSeeEventDetails(event)}
                                            className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-600 font-medium text-sm transition-colors duration-200 flex items-center justify-center border border-slate-100 hover:border-blue-100"
                                        >
                                            {isAdmin ? 'See Details' : 'Vote & Details'}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Confirm Delete Modal */}
                {showModal && (
                    <ModalComponent open={showModal} handleClose={closeModal}>
                        <div className="p-6 text-center">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Action</h3>
                            <p className="text-slate-500 mb-8">Are you sure you want to delete this event?</p>
                            <div className="flex gap-4">
                                <Button
                                    type={ButtonTypes.SECONDARY}
                                    btnText="Cancel"
                                    width="100%"
                                    onClick={closeModal}
                                />
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    backgroundColor="#D32F2F"
                                    borderColor="#D32F2F"
                                    btnText="Confirm Delete"
                                    width="100%"
                                    onClick={() => {
                                        handleDelete(eventToDeleteId)
                                        closeModal()
                                    }}
                                />
                            </div>
                        </div>
                    </ModalComponent>
                )}

                {/* Event Detail Modal */}
                {showEventModal && (
                    <ModalComponent
                        height="auto"
                        width="800px"
                        padding="0"
                        open={showEventModal}
                        handleClose={() => setShowEventModal(false)}
                    >
                        <SelectedEventCard />
                    </ModalComponent>
                )}
            </div>

            {/* Infinite Scroll trigger */}
            <div ref={ref} className="w-full py-6 text-center text-slate-400">
                {isFetchingNextPage && 'Loading more events...'}
            </div>
        </div>
    )
}
const Events: React.FC = () => {
    return (
        <EventsProvider>
            <EventsContentAndComponents />
        </EventsProvider>
    )
}
export default Events