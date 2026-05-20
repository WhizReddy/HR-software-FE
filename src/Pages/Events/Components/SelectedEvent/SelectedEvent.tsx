import { Suspense, lazy, useEffect, useState } from 'react'
import EventPoll from '../EventPoll/EventsPoll'
import { Calendar, MapPin, X } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { useEvents } from '@/Pages/Events/Context/EventsContext'
import { useSearchParams } from 'react-router-dom'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'

const EventCarousel = lazy(() => import('@/Components/Carosel/Carosel'))
const EventMap = lazy(() => import('../GoogleMap/MapPicker'))

const SelectedEventCard = () => {
    const { currentUser } = useAuth()
    const { selectedEvent, setSelectedEvent, setShowEventModal, formatDate } = useEvents()
    const [, setSearchParams] = useSearchParams()
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        if (selectedEvent?._id) {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.set('event', selectedEvent._id.toString())
                return next
            }, { replace: true })
        }

        return () => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev)
                next.delete('event')
                return next
            }, { replace: true })
        }
    }, [selectedEvent?._id, setSearchParams])

    useEffect(() => {
        setShowMap(false)
    }, [selectedEvent?._id])

    if (!selectedEvent) {
        return null
    }

    return (
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh] w-full">
            {selectedEvent?.photo && selectedEvent.photo.length > 0 && (
                <div className="w-full bg-slate-900">
                    <Suspense
                        fallback={
                            <div className="h-56 w-full animate-pulse bg-slate-200" />
                        }
                    >
                        <EventCarousel images={selectedEvent.photo} />
                    </Suspense>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight pr-4">
                        {selectedEvent.title}
                    </h2>
                    <button
                        onClick={() => {
                            setSelectedEvent(null)
                            setShowEventModal(false)
                        }}
                        className="p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="prose prose-slate max-w-none mb-8 text-slate-600 whitespace-pre-line leading-relaxed">
                    {selectedEvent.description}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-start gap-3 text-slate-700">
                        <Calendar className="mt-0.5 text-blue-500" size={20} />
                        <div>
                            <div className="text-sm font-semibold text-slate-900 mb-0.5">Date & Time</div>
                            <div className="text-sm">{formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}</div>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700">
                        <MapPin className="mt-0.5 text-blue-500" size={20} />
                        <div>
                            <div className="text-sm font-semibold text-slate-900 mb-0.5">Location</div>
                            <div className="text-sm line-clamp-2">{selectedEvent.location}</div>
                        </div>
                    </div>
                </div>

                {selectedEvent.location && (
                    <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                            <div className="mt-4 h-[300px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white">
                                <Suspense
                                    fallback={
                                        <div className="h-full w-full animate-pulse bg-slate-100" />
                                    }
                                >
                                    <EventMap
                                        onLocationChange={() => {}}
                                        savedLocation={selectedEvent.location}
                                        showInput={false}
                                        containerClassName="h-full w-full"
                                    />
                                </Suspense>
                            </div>
                        )}
                    </div>
                )}

                {selectedEvent.poll && (
                    <div className="mt-8 pt-8 border-t border-slate-100">
                        <EventPoll
                            poll={selectedEvent.poll}
                            eventId={selectedEvent._id}
                            userId={currentUser?._id?.toString()}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default SelectedEventCard
