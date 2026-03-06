import { EventsData } from '../../Events/Interface/Events'
import dayjs from 'dayjs'
import AxiosInstance from '@/Helpers/Axios'
import { useQuery } from '@tanstack/react-query'

const InfoSection: React.FC = () => {
    const { data: events } = useQuery({
        queryKey: ['event'],
        queryFn: async () => {
            const response = await AxiosInstance.get(`/event`)
            return response.data
        },
    })

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Events</h2>
            <ul className="space-y-4 m-0 p-0 list-none flex-1 overflow-y-auto pr-2">
                {events?.slice(0, 4).map((event: EventsData) => (
                    <li
                        key={event._id}
                        className="relative pl-6 py-3 border-b border-slate-100 last:border-0 group hover:bg-slate-50 transition-colors rounded-md px-2 flex gap-3"
                    >
                        {/* Blue Dot Indicator */}
                        <span className="absolute left-2 top-5 w-2 h-2 rounded-full bg-primary-blue shadow-sm"></span>

                        {event.photo && event.photo.length > 0 && (
                            <img
                                src={event.photo[0]}
                                alt={event.title}
                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0 mt-1 shadow-sm"
                            />
                        )}

                        <div className="flex flex-col gap-1 w-full">
                            <div className="flex justify-between items-start w-full gap-2">
                                <h3 className="font-semibold text-slate-700 text-[15px] leading-tight group-hover:text-primary-blue transition-colors">
                                    {event.title}
                                </h3>
                                <span className="text-xs font-medium text-slate-400 whitespace-nowrap bg-slate-100 px-2 py-1 rounded-md">
                                    {dayjs(event.startDate).format('ddd DD MMM YYYY')}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                                {event.description}
                            </p>
                        </div>
                    </li>
                ))}

                {(!events || events.length === 0) && (
                    <li className="text-center py-8 text-slate-400 text-sm">
                        No upcoming events scheduled.
                    </li>
                )}
            </ul>
        </div>
    )
}

export default InfoSection
