import { Suspense, lazy, useEffect, useState } from 'react'
import { Calendar, MapPin, X } from 'lucide-react'
import { useEvents } from '@/Pages/Events/Context/EventsContext'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { ChunkLoadBoundary } from '@/Components/Error/ChunkLoadBoundary'

const EventCarousel = lazy(() => import('@/Components/Carosel/Carosel'))
const EventMap = lazy(() => import('../GoogleMap/MapPicker'))

const SelectedEventCard = () => {
    const {
        selectedEvent,
        selectedEventError,
        isSelectedEventLoading,
        retrySelectedEvent,
        handleCloseEventDetails,
        formatDate,
    } = useEvents()
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        setShowMap(false)
    }, [selectedEvent?._id])

    if (isSelectedEventLoading) {
        return (
            <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-white p-6 shadow-xl">
                <div className="h-8 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="mt-6 h-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-40 animate-pulse rounded bg-slate-100" />
            </div>
        )
    }

    if (selectedEventError) {
        return (
            <div className="w-full rounded-lg bg-white p-6 text-center shadow-xl">
                <h2 className="text-lg font-semibold text-slate-950">
                    Event details unavailable
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                    {selectedEventError}
                </p>
                <div className="mt-5 flex justify-center gap-3">
                    <Button
                        btnText="Close"
                        type={ButtonTypes.SECONDARY}
                        onClick={handleCloseEventDetails}
                    />
                    <Button
                        btnText="Retry"
                        type={ButtonTypes.PRIMARY}
                        onClick={retrySelectedEvent}
                    />
                </div>
            </div>
        )
    }

    if (!selectedEvent) {
        return null
    }

    return (
        <div className="flex max-h-[90vh] w-full flex-col overflow-hidden rounded-lg bg-white shadow-xl">
            {selectedEvent?.photo && selectedEvent.photo.length > 0 && (
                <div className="w-full bg-slate-900">
                    <ChunkLoadBoundary>
                        <Suspense
                            fallback={
                                <div className="h-56 w-full animate-pulse bg-slate-200" />
                            }
                        >
                            <EventCarousel images={selectedEvent.photo} />
                        </Suspense>
                    </ChunkLoadBoundary>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <h2 className="pr-4 text-2xl font-semibold leading-tight text-slate-950 md:text-3xl">
                        {selectedEvent.title}
                    </h2>
                    <button
                        onClick={handleCloseEventDetails}
                        aria-label="Close event details"
                        className="-mr-2 flex-shrink-0 rounded-md p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="prose prose-slate mb-8 max-w-none whitespace-pre-line leading-7 text-slate-600">
                    {selectedEvent.description}
                </div>

                <div className="mb-8 grid grid-cols-1 gap-4 rounded-lg border border-slate-200/80 bg-slate-50 p-5 sm:grid-cols-2">
                    <div className="flex items-start gap-3 text-slate-700">
                        <Calendar className="mt-0.5 text-slate-600" size={20} />
                        <div>
                            <div className="text-sm font-semibold text-slate-900 mb-0.5">
                                Date & Time
                            </div>
                            <div className="text-sm">
                                {formatDate(selectedEvent.startDate)} -{' '}
                                {formatDate(selectedEvent.endDate)}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700">
                        <MapPin className="mt-0.5 text-slate-600" size={20} />
                        <div>
                            <div className="text-sm font-semibold text-slate-900 mb-0.5">
                                Location
                            </div>
                            <div className="text-sm line-clamp-2">
                                {selectedEvent.location}
                            </div>
                        </div>
                    </div>
                </div>

                {selectedEvent.location && (
                    <div className="mb-8 rounded-lg border border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Event map
                                </p>
                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Open the map when you need the exact
                                    placement.
                                </p>
                            </div>
                            <Button
                                icon={<MapPin size={16} />}
                                btnText={showMap ? 'Hide map' : 'Show map'}
                                type={ButtonTypes.SECONDARY}
                                color="#2457A3"
                                borderColor="#E2E8F0"
                                onClick={() => setShowMap((value) => !value)}
                                padding="8px 12px"
                            />
                        </div>

                        {showMap && (
                            <div className="mt-4 h-[300px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white">
                                <ChunkLoadBoundary>
                                    <Suspense
                                        fallback={
                                            <div className="h-full w-full animate-pulse bg-slate-100" />
                                        }
                                    >
                                        <EventMap
                                            onLocationChange={() => {}}
                                            savedLocation={
                                                selectedEvent.location
                                            }
                                            showInput={false}
                                            containerClassName="h-full w-full"
                                        />
                                    </Suspense>
                                </ChunkLoadBoundary>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectedEventCard
