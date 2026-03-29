import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Clock3,
    MapPin,
    Pencil,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Trash2,
    Users,
} from 'lucide-react'
import { ModalComponent } from '@/Components/Modal/Modal'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import {
    EventsData,
    useCreateEvent,
    useDeleteEvent,
    useGetAllEvents,
    useUpdateEvent,
} from './Hook'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'
import Workers from '/public/Images/happy workers.webp'
import WorkerTwo from '/public/Images/happyWorkers2.jpg'
import WorkerThree from '/public/Images/happyWork3.jpeg'

type CareersProps = {
    managementMode?: boolean
}

const truncateText = (value: string, maxLength: number) => {
    if (value.length <= maxLength) {
        return value
    }

    return `${value.slice(0, maxLength).trimEnd()}...`
}

export const Careers = ({ managementMode = false }: CareersProps) => {
    const { events, setEvents, isLoading } = useGetAllEvents()
    const { createEvent, handleChange, event, createEventError } =
        useCreateEvent(setEvents)
    const { editingEvent, handleEditChange, updateEvent, setEditingEvent } =
        useUpdateEvent(setEvents)
    const {
        handleDelete,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
    } = useDeleteEvent(setEvents)
    const { currentUser } = useAuth()

    const isManager = isAdminRole(currentUser?.role)
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('')

    const filteredEvents = useMemo(
        () =>
            events.filter(
                (careerEvent) =>
                    careerEvent.title
                        .toLowerCase()
                        .includes(filter.toLowerCase()) ||
                    careerEvent.description
                        .toLowerCase()
                        .includes(filter.toLowerCase()) ||
                    careerEvent.location
                        .toLowerCase()
                        .includes(filter.toLowerCase()),
            ),
        [events, filter],
    )

    const handleOpenCreate = () => {
        setEditingEvent(null)
        setShowForm(true)
    }

    const handleOpenEdit = (careerEvent: EventsData) => {
        setEditingEvent(careerEvent)
        setShowForm(true)
    }

    const handleCloseForm = () => {
        setEditingEvent(null)
        setShowForm(false)
    }

    const handleSubmitForm = async () => {
        const wasSuccessful = editingEvent
            ? await updateEvent()
            : await createEvent()

        if (wasSuccessful) {
            handleCloseForm()
        }
    }

    const activeLocations = new Set(events.map((careerEvent) => careerEvent.location))
    const featuredLocations = Array.from(activeLocations)
        .filter(Boolean)
        .slice(0, 3)
    const heroMetrics = [
        {
            label: 'Open roles',
            value: String(events.length),
            icon: BriefcaseBusiness,
        },
        {
            label: 'Candidate replies',
            value: 'Fast feedback',
            icon: Clock3,
        },
        {
            label: 'Team style',
            value: 'Small, sharp squads',
            icon: Users,
        },
    ]
    const culturePrinciples = [
        {
            title: 'Focused teams',
            description:
                'Small squads own problems end to end, with less ceremony and clearer accountability.',
            icon: Users,
        },
        {
            title: 'Clear expectations',
            description:
                'People do their best work when the bar is high, explicit, and backed by good feedback.',
            icon: ShieldCheck,
        },
        {
            title: 'Steady growth',
            description:
                'We care about durable product decisions, clean execution, and teammates who keep improving.',
            icon: Sparkles,
        },
    ]
    const candidatePromises = [
        'Direct work with product and engineering, not layers of approval.',
        'Role expectations that are explicit from the start.',
        'A hiring process built around signal, not noise.',
    ]

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fef3c7_0%,#f8fafc_24%,#eef4ff_100%)]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {managementMode ? (
                    <section className="overflow-hidden rounded-[32px] border border-slate-200/70 bg-[linear-gradient(135deg,#12345d_0%,#2457a3_48%,#80a8ff_100%)] p-8 text-white shadow-2xl shadow-blue-900/20">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                            <div>
                                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
                                    <Sparkles size={14} />
                                    Internal Publishing
                                </p>
                                <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
                                    Career Post Studio
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm text-blue-100/90 sm:text-base">
                                    Publish, refine, and retire career opportunities without opening the public board editor.
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <Link
                                    to="/career"
                                    className="inline-flex items-center rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                                >
                                    View Public Page
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleOpenCreate}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-[#2457a3] shadow-lg shadow-blue-950/10 transition hover:bg-slate-100"
                                >
                                    <Plus size={16} />
                                    New Career Post
                                </button>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="relative overflow-hidden rounded-[36px] border border-slate-200/80 bg-[linear-gradient(135deg,#0f213d_0%,#17345d_52%,#2457a3_100%)] p-6 text-white shadow-2xl shadow-slate-300/60 sm:p-8 lg:p-10">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,184,77,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(125,211,252,0.18),transparent_26%)]" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30" />

                        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
                            <div className="max-w-3xl">
                                <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-100">
                                    <BriefcaseBusiness size={14} />
                                    Career Board
                                </p>
                                <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-[3.6rem] sm:leading-[1.02]">
                                    Join a product team that prefers clarity over noise.
                                </h1>
                                <p className="mt-5 max-w-2xl text-base leading-8 text-blue-100/92">
                                    We build internal tools that people depend on daily. The work is practical, the standards are high, and strong contributors get real ownership quickly.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-4">
                                    <Link
                                        to="/recruitment"
                                        className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#ffb84d] px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-900/20 transition hover:-translate-y-0.5 hover:bg-[#f5a623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb84d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17345d]"
                                    >
                                        Submit General Application
                                        <ArrowRight size={16} />
                                    </Link>
                                    {isManager && (
                                        <Link
                                            to="/career-posts"
                                            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/18 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#17345d]"
                                        >
                                            Manage Career Posts
                                        </Link>
                                    )}
                                </div>

                                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                    {heroMetrics.map(({ label, value, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                                        >
                                            <div className="flex items-center gap-2 text-blue-100">
                                                <Icon size={16} />
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
                                                    {label}
                                                </p>
                                            </div>
                                            <p className="mt-3 text-lg font-bold text-white">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="overflow-hidden rounded-[30px] border border-white/15 bg-slate-900/20 shadow-xl shadow-slate-950/20">
                                    <img
                                        src={Workers}
                                        alt="Team collaboration"
                                        className="h-full min-h-[320px] w-full object-cover"
                                    />
                                </div>
                                <div className="grid gap-4">
                                    <div className="overflow-hidden rounded-[26px] border border-white/15 bg-white/8 p-3 backdrop-blur-sm">
                                        <img
                                            src={WorkerTwo}
                                            alt="Team planning session"
                                            className="h-40 w-full rounded-[20px] object-cover"
                                        />
                                        <div className="mt-4 px-1 pb-1">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-100/90">
                                                Candidate signal
                                            </p>
                                            <p className="mt-2 text-base font-semibold leading-7 text-white">
                                                We care more about sharp execution and good judgment than polished buzzwords.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-[26px] border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100/80">
                                                Common locations
                                            </p>
                                            <ArrowUpRight size={16} className="text-amber-100" />
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {featuredLocations.length > 0 ? (
                                                featuredLocations.map((location) => (
                                                    <span
                                                        key={location}
                                                        className="inline-flex items-center rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-sm font-medium text-white"
                                                    >
                                                        {location}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-sm text-blue-100/80">
                                                    Flexible location details are shared per role.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mt-8 rounded-[28px] border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
                                {managementMode ? 'Filter Posts' : 'Find a Role'}
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                {managementMode
                                    ? 'Search your published career posts'
                                    : 'Browse opportunities by title, location, or keyword'}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                {filteredEvents.length} result
                                {filteredEvents.length === 1 ? '' : 's'}
                                {filter ? ` for "${filter}"` : ''}
                            </p>
                        </div>

                        <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:max-w-md focus-within:border-[#2457a3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2457a3]/15">
                            <Search size={18} className="text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search positions..."
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                            />
                        </label>
                    </div>
                </section>

                <section className="mt-8">
                    {isLoading ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-64 animate-pulse rounded-[28px] border border-slate-200/70 bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="rounded-[32px] border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <BriefcaseBusiness size={28} />
                            </div>
                            <h3 className="mt-6 text-2xl font-bold text-slate-900">
                                {managementMode
                                    ? 'No career posts match this filter'
                                    : 'No matching openings right now'}
                            </h3>
                            <p className="mt-3 text-sm text-slate-500">
                                {managementMode
                                    ? 'Clear the filter or publish a new role to populate the board.'
                                    : 'You can still send a general application and we will keep your profile on file.'}
                            </p>
                            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                {!managementMode && (
                                    <Link
                                        to="/recruitment"
                                        className="inline-flex items-center rounded-xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c4380]"
                                    >
                                        Apply Anyway
                                    </Link>
                                )}
                                {managementMode && (
                                    <button
                                        type="button"
                                        onClick={handleOpenCreate}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c4380]"
                                    >
                                        <Plus size={16} />
                                        Create Career Post
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredEvents.map((careerEvent) => (
                                <article
                                    key={careerEvent._id}
                                    className="group flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#2457a3]/35 hover:shadow-xl hover:shadow-slate-200/70"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                                                {managementMode
                                                    ? 'Published Post'
                                                    : 'Open Role'}
                                            </p>
                                            <h3 className="mt-5 text-[1.85rem] font-black leading-tight tracking-tight text-slate-900">
                                                {careerEvent.title}
                                            </h3>
                                            <div className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                                                <MapPin
                                                    size={15}
                                                    className="text-[#2457a3]"
                                                />
                                                <span>
                                                    {careerEvent.location ||
                                                        'Location to be confirmed'}
                                                </span>
                                            </div>
                                        </div>

                                        {managementMode && isManager && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(careerEvent)}
                                                    aria-label={`Edit ${careerEvent.title}`}
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/30"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteEventModal(
                                                            careerEvent._id,
                                                        )
                                                    }
                                                    aria-label={`Delete ${careerEvent.title}`}
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                                        {truncateText(careerEvent.description, 190)}
                                    </p>

                                    <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                        {managementMode ? (
                                            <Link
                                                to="/career"
                                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#2457a3] transition hover:text-[#183b74]"
                                            >
                                                Preview public page
                                                <ArrowRight size={14} />
                                            </Link>
                                        ) : (
                                            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                General application supported
                                            </span>
                                        )}

                                        {!managementMode && (
                                            <Link
                                                to="/recruitment"
                                                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2457a3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/30"
                                            >
                                                Apply Now
                                                <ArrowRight size={14} />
                                            </Link>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>

                {!managementMode && (
                    <>
                        <section className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                            <div className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Why join us
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                                    Serious work, calm collaboration, and standards that stay consistent.
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                                    The environment is structured enough to keep things moving and flexible enough for strong people to make a visible difference.
                                </p>

                                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                    {culturePrinciples.map(
                                        ({ title, description, icon: Icon }) => (
                                            <article
                                                key={title}
                                                className="rounded-[24px] border border-slate-200 bg-slate-50 p-5"
                                            >
                                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#2457a3] shadow-sm">
                                                    <Icon size={18} />
                                                </div>
                                                <h3 className="mt-4 text-lg font-bold text-slate-900">
                                                    {title}
                                                </h3>
                                                <p className="mt-3 text-sm leading-7 text-slate-600">
                                                    {description}
                                                </p>
                                            </article>
                                        ),
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-5">
                                <article className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                                    <img
                                        src={WorkerThree}
                                        alt="Team collaboration in the office"
                                        className="h-56 w-full object-cover"
                                    />
                                    <div className="p-6">
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            Team perspective
                                        </p>
                                        <blockquote className="mt-3 text-lg font-semibold leading-8 text-slate-900">
                                            “The work is practical and the bar is clear. You know what good looks like, and you get room to deliver it.”
                                        </blockquote>
                                    </div>
                                </article>

                                <article className="rounded-[30px] bg-slate-900 p-6 text-white shadow-xl shadow-slate-200/60">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                                        What candidates can expect
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        {candidatePromises.map((promise) => (
                                            <div
                                                key={promise}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ffb84d] text-slate-950">
                                                    <ArrowRight size={14} />
                                                </span>
                                                <p className="text-sm leading-7 text-slate-200">
                                                    {promise}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </article>
                            </div>
                        </section>

                        <section className="mt-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div className="max-w-2xl">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Ready to talk?
                                    </p>
                                    <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                                        Apply for an open role or send a strong general application.
                                    </h2>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        If your profile fits our direction, we would rather hear from you early than wait for a perfect listing.
                                    </p>
                                </div>

                                <Link
                                    to="/recruitment"
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#ffb84d] px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-[#f5a623] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
                                >
                                    Start Application
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </section>

                        <section className="mt-6 grid gap-5 lg:grid-cols-3">
                            {culturePrinciples.map((principle) => (
                                <article
                                    key={`${principle.title}-summary`}
                                    className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm"
                                >
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Candidate fit
                                    </p>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {principle.title === 'Focused teams'
                                            ? 'You are comfortable owning a problem directly and communicating without excess ceremony.'
                                            : principle.title === 'Clear expectations'
                                              ? 'You prefer feedback that is concrete, quick, and tied to actual output.'
                                              : 'You want work that compounds over time instead of short-lived cosmetic tasks.'}
                                    </p>
                                </article>
                            ))}
                        </section>
                    </>
                )}
            </div>

            {isManager && (
                <>
                    <ModalComponent open={showForm} handleClose={handleCloseForm}>
                        <div className="w-[min(560px,92vw)] rounded-[28px] bg-white p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Career Publishing
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                                        {editingEvent ? 'Edit Career Post' : 'Create Career Post'}
                                    </h2>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Title
                                    </span>
                                    <input
                                        type="text"
                                        name="title"
                                        value={editingEvent ? editingEvent.title : event.title}
                                        onChange={editingEvent ? handleEditChange : handleChange}
                                        placeholder="Frontend Developer"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Location
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={editingEvent ? editingEvent.location : event.location}
                                        onChange={editingEvent ? handleEditChange : handleChange}
                                        placeholder="Tirane / Hybrid"
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Description
                                    </span>
                                    <textarea
                                        name="description"
                                        value={editingEvent ? editingEvent.description : event.description}
                                        onChange={editingEvent ? handleEditChange : handleChange}
                                        placeholder="Describe the role, expectations, and why someone should apply."
                                        rows={6}
                                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                {createEventError && (
                                    <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                                        {createEventError}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    btnText={editingEvent ? 'Update Post' : 'Publish Post'}
                                    type={ButtonTypes.PRIMARY}
                                    width="100%"
                                    onClick={handleSubmitForm}
                                />
                                <Button
                                    btnText="Cancel"
                                    width="100%"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={handleCloseForm}
                                />
                            </div>
                        </div>
                    </ModalComponent>

                    <ModalComponent open={showModal} handleClose={closeModal}>
                        <div className="w-[min(460px,90vw)] rounded-[28px] bg-white p-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                Delete career post?
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                This removes the post from the public career page. You can publish a replacement immediately after.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    backgroundColor="#d32f2f"
                                    borderColor="#d32f2f"
                                    btnText="Delete Post"
                                    width="100%"
                                    onClick={() => handleDelete(eventToDeleteId)}
                                />
                                <Button
                                    btnText="Cancel"
                                    width="100%"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={closeModal}
                                />
                            </div>
                        </div>
                    </ModalComponent>
                </>
            )}
        </div>
    )
}

export default function Career(props: CareersProps) {
    return <Careers {...props} />
}
