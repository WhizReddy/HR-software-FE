import { Calendar, MapPin, Search } from 'lucide-react'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ModalComponent } from '@/Components/Modal/Modal'
import LongMenu from '@/Components/Menu/Menu'
import SelectedEventCard from './Components/SelectedEvent/SelectedEvent'
import Toast from '@/Components/Toast/Toast'
import { EventsProvider, useEvents } from '@/Pages/Events/Context/EventsContext'
import Forms from './Forms/Forms'
import { useGetAllEvents } from './Hook'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { EventsData } from './Interface/Events'
import EventsContentLoader from '@/Components/Content/ContentLoader'
import PageIntro from '@/Components/PageIntro/PageIntro'

const clampText = (lines: number) =>
    ({
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        overflow: 'hidden',
    }) as const

function EventsContentAndComponents() {
    const {
        handleDelete,
        handleToastClose,
        handleUpdateToastClose,
        showModal,
        closeModal,
        showEventModal,
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
        handleSeeEventDetails,
        handleCloseEventDetails,
    } = useEvents()

    const {
        data: events,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isLoading,
        onSearchChange,
        searchEvent,
    } = useGetAllEvents()

    const { ref, inView } = useInView()
    const visibleEvents = events?.pages.flatMap((page) => page.data) ?? []

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [fetchNextPage, hasNextPage, inView, isFetchingNextPage])

    return (
        <div
            id="events-root"
            className="mx-auto flex w-full max-w-full flex-col"
        >
            <Toast
                severity={toastOpen ? toastSeverity : updateToastSeverity}
                open={toastOpen || updateToastOpen}
                message={toastOpen ? toastMessage : updateToastMessage}
                onClose={toastOpen ? handleToastClose : handleUpdateToastClose}
            />
            <Forms />

            <PageIntro
                eyebrow="Operations"
                title="Events"
                description="Create events, search upcoming activities, and review voting or location details."
                className="mb-6"
                actions={
                    isAdmin && (
                        <Button
                            btnText="Create Event"
                            padding="10px 16px"
                            width="150px"
                            type={ButtonTypes.PRIMARY}
                            onClick={() => handleOpenDrawer('create')}
                        />
                    )
                }
            />

            <div className="mb-6 rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <div className="w-full sm:max-w-lg">
                    <Input
                        IsUsername
                        type="search"
                        label="Search events"
                        placeholder="Search by title or location..."
                        name="Search"
                        width="100%"
                        iconPosition="start"
                        icon={<Search size={18} className="text-slate-400" />}
                        value={searchEvent}
                        onChange={onSearchChange}
                        height={40}
                    />
                </div>
            </div>

            {/* Events Grid */}
            <div className="w-full flex-1">
                {isLoading ? (
                    <EventsContentLoader />
                ) : visibleEvents.length === 0 ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                        <Calendar size={34} className="text-slate-300" />
                        <h2 className="mt-4 text-base font-semibold text-slate-900">
                            No events found
                        </h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                            Events will appear here when they match the current
                            search. Try a different title or location.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {visibleEvents.map((event: EventsData) => (
                                <div
                                    key={event._id}
                                    className="group flex min-h-[400px] flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:border-slate-300 hover:shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                                >
                                    {event.photo && event.photo.length > 0 ? (
                                        <div className="h-40 w-full flex-shrink-0 overflow-hidden bg-slate-100">
                                            <img
                                                src={event.photo[0]}
                                                alt={event.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex h-40 w-full flex-shrink-0 items-center justify-center border-b border-slate-100 bg-slate-50">
                                            <Calendar
                                                className="text-slate-300"
                                                size={38}
                                            />
                                        </div>
                                    )}
                                    <div className="flex min-h-0 flex-1 flex-col p-4">
                                        <div className="min-h-0 flex-1 space-y-3">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3
                                                    className="text-base font-semibold leading-tight text-slate-950"
                                                    style={clampText(2)}
                                                >
                                                    {event.title}
                                                </h3>
                                                {isAdmin && (
                                                    <div className="opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                                                        <LongMenu
                                                            event={event}
                                                            onEdit={() =>
                                                                handleOpenDrawer(
                                                                    'edit',
                                                                    event,
                                                                )
                                                            }
                                                            onDelete={
                                                                handleDeleteEventModal
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <p
                                                className="min-h-[44px] text-sm leading-6 text-slate-500"
                                                style={clampText(2)}
                                            >
                                                {event.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto space-y-3 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <Calendar
                                                    size={17}
                                                    className="flex-shrink-0 text-slate-600"
                                                />
                                                <span
                                                    className="font-medium"
                                                    style={clampText(2)}
                                                >
                                                    {formatDate(
                                                        event.startDate,
                                                    )}{' '}
                                                    -{' '}
                                                    {formatDate(event.endDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2.5 text-sm text-slate-600">
                                                <MapPin
                                                    size={17}
                                                    className="mt-0.5 flex-shrink-0 text-slate-600"
                                                />
                                                <span style={clampText(1)}>
                                                    {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-5 pb-5 pt-2">
                                        <button
                                            onClick={() =>
                                                handleSeeEventDetails(event)
                                            }
                                            className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                                        >
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Confirm Delete Modal */}
                {showModal && (
                    <ModalComponent open={showModal} handleClose={closeModal}>
                        <div className="p-6 text-center">
                            <h3 className="mb-2 text-lg font-semibold text-slate-950">
                                Confirm Action
                            </h3>
                            <p className="mb-8 text-sm leading-6 text-slate-500">
                                Are you sure you want to delete this event?
                            </p>
                            <div className="flex gap-3">
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
                        handleClose={handleCloseEventDetails}
                        showCloseButton={false}
                    >
                        <SelectedEventCard />
                    </ModalComponent>
                )}
            </div>

            {/* Infinite Scroll trigger */}
            {(hasNextPage || isFetchingNextPage) && (
                <div
                    ref={ref}
                    className="flex h-10 w-full items-center justify-center text-sm text-slate-400"
                >
                    {isFetchingNextPage && 'Loading more events...'}
                </div>
            )}
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
