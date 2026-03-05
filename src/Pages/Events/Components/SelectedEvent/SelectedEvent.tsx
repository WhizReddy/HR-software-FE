import EventPoll from '../EventPoll/EventsPoll'
import { Calendar, MapPin, X } from 'lucide-react'
import { useAuth } from '@/Context/AuthProvider'
import Example from '@/Components/Carosel/Carosel'
import { useEvents } from '../../Context/EventsContext'
import MapComponent from '../GoogleMap/MapPicker'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'

const SelectedEventCard = () => {
    const { currentUser } = useAuth()
    const { selectedEvent, setSelectedEvent, setShowEventModal, formatDate } = useEvents()
    const [, setSearchParams] = useSearchParams()

    useEffect(() => {
        console.log('Selected Event:', selectedEvent)
        if (selectedEvent?._id) {
            setSearchParams({ event: selectedEvent._id.toString() })
        } else {
            setSearchParams({})
        }

        return () => {
            setSearchParams({})
        }
    }, [selectedEvent, setSearchParams])

    if (!selectedEvent) {
        return null
    }

    return (
        <div className="flex flex-col bg-white rounded-xl overflow-hidden shadow-xl max-h-[90vh] w-full">
            {selectedEvent?.photo && selectedEvent.photo.length > 0 && (
                <div className="w-full bg-slate-900">
                    <Example images={selectedEvent.photo} />
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
                    <div className="w-full h-[300px] mb-8 rounded-xl overflow-hidden border border-slate-200">
                        <MapComponent
                            onLocationChange={(address, lat, lng) => console.log(address, lat, lng)}
                            savedLocation={selectedEvent.location}
                            showInput={false}
                        />
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