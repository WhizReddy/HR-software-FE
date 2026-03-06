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
            <h2 className="text-base font-bold text-slate-800 mb-5 tracking-tight">Upcoming Events</h2>
            <ul className="space-y-3 m-0 p-0 list-none flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {events?.slice(0, 4).map((event: EventsData) => (
                    <li
                        key={event._id}
                        className="relative pl-6 py-3 border border-transparent hover:border-slate-100/50 hover:bg-white/60 transition-all duration-300 rounded-2xl px-3 flex gap-4 hover:shadow-sm group cursor-default"
                    >
                        {/* Blue Dot Indicator */}
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-blue-500 shadow-sm group-hover:scale-150 transition-transform duration-300"></span>

                        {event.photo && event.photo.length > 0 && (
                            <img
                                src={event.photo[0]}
                                alt={event.title}
                                className="w-12 h-12 rounded-xl object-cover flex-shrink-0 mt-0.5 shadow-sm group-hover:shadow-md transition-shadow duration-300"
                            />
                        )}

                        <div className="flex flex-col gap-1 w-full justify-center">
                            <div className="flex justify-between items-start w-full gap-2">
                                <h3 className="font-semibold text-slate-800 text-[15px] leading-tight group-hover:text-blue-600 transition-colors">
                                    {event.title}
                                </h3>
                                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap bg-slate-100/50 px-2 py-1 rounded-lg backdrop-blur-sm">
                                    {dayjs(event.startDate).format('ddd DD MMM YYYY')}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 line-clamp-2 mt-0.5 font-medium">
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
