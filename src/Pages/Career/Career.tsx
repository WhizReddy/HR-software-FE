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
import PageIntro from '@/Components/PageIntro/PageIntro'
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
        <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_top_left,_rgba(36,87,163,0.14),_transparent_55%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.10),_transparent_48%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-80 h-[320px] bg-[radial-gradient(circle_at_center,_rgba(148,163,184,0.12),_transparent_60%)]" />

            <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {managementMode ? (
                    <>
                        <PageIntro
                            eyebrow="Internal Publishing"
                            title="Career Post Studio"
                            description="Publish, refine, and retire career opportunities from a cleaner workspace that matches the rest of the product."
                            className="mb-8"
                            actions={
                                <>
                                    <Link
                                        to="/career"
                                        className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                    >
                                        View Public Page
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleOpenCreate}
                                        className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#2457a3] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1c4380]"
                                    >
                                        <Plus size={16} />
                                        New Career Post
                                    </button>
                                </>
                            }
                        />

                        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Publishing Overview
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                                    Keep the public board clean, readable, and consistent.
                                </h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                    Career posts now sit on the same lighter visual system as the rest of the app, so the board feels like part of one product instead of a separate landing page.
                                </p>

                                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                    {heroMetrics.map(({ label, value, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                                        >
                                            <div className="flex items-center gap-2 text-slate-500">
                                                <Icon
                                                    size={16}
                                                    className="text-[#2457a3]"
                                                />
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                    {label}
                                                </p>
                                            </div>
                                            <p className="mt-3 text-lg font-bold text-slate-900">
                                                {value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </article>

                            <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
                                <img
                                    src={Workers}
                                    alt="Team collaboration"
                                    className="h-full min-h-[280px] w-full object-cover"
                                />
                            </article>
                        </section>
                    </>
                ) : (
                    <>
                        <PageIntro
                            eyebrow="Career Board"
                            title="Join a product team that prefers clarity over noise."
                            description="We build internal tools that people depend on daily. The work is practical, the standards are high, and strong contributors get real ownership quickly."
                            className="mb-8"
                            actions={
                                <>
                                    <Link
                                        to="/recruitment"
                                        className="inline-flex min-h-11 items-center gap-2 rounded-2xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c4380] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                                    >
                                        Submit General Application
                                        <ArrowRight size={16} />
                                    </Link>
                                    {isManager && (
                                        <Link
                                            to="/career-posts"
                                            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                                        >
                                            Manage Career Posts
                                        </Link>
                                    )}
                                </>
                            }
                        />

                        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                            <article className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm">
                                <img
                                    src={Workers}
                                    alt="Team collaboration"
                                    className="h-[320px] w-full object-cover"
                                />
                                <div className="border-t border-slate-100 p-6">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Team environment
                                    </p>
                                    <h2 className="mt-3 text-2xl font-black tracking-tight text-slate-900">
                                        Strong ownership, calmer collaboration, and less noise.
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                        We keep expectations clear, ship practical work, and give capable people room to contribute without adding layers of ceremony.
                                    </p>
                                </div>
                            </article>

                            <div className="grid gap-5">
                                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Quick Snapshot
                                    </p>
                                    <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                                        {heroMetrics.map(({ label, value, icon: Icon }) => (
                                            <div
                                                key={label}
                                                className="rounded-[22px] border border-slate-200 bg-slate-50 p-4"
                                            >
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Icon
                                                        size={16}
                                                        className="text-[#2457a3]"
                                                    />
                                                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                                                        {label}
                                                    </p>
                                                </div>
                                                <p className="mt-3 text-lg font-bold text-slate-900">
                                                    {value}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </article>

                                <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <div className="flex items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                Common locations
                                            </p>
                                            <h3 className="mt-2 text-xl font-bold text-slate-900">
                                                Flexible hiring, cleaner presentation
                                            </h3>
                                        </div>
                                        <ArrowUpRight
                                            size={16}
                                            className="text-[#2457a3]"
                                        />
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {featuredLocations.length > 0 ? (
                                            featuredLocations.map((location) => (
                                                <span
                                                    key={location}
                                                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                                                >
                                                    {location}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-sm text-slate-500">
                                                Flexible location details are shared per role.
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50">
                                        <img
                                            src={WorkerTwo}
                                            alt="Team planning session"
                                            className="h-36 w-full object-cover"
                                        />
                                        <div className="p-4">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                                Candidate signal
                                            </p>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                                We care more about sharp execution and good judgment than polished buzzwords.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </section>
                    </>
                )}

                <section className="mt-8 rounded-[28px] border border-white/70 bg-white/78 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl">
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
                        <div className="rounded-[32px] border border-dashed border-slate-200/80 bg-white/80 p-10 text-center shadow-lg shadow-slate-200/45 backdrop-blur-xl">
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
                                    className="group flex h-full flex-col rounded-[28px] border border-white/75 bg-white/82 p-6 shadow-lg shadow-slate-200/45 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-[#2457a3]/35 hover:shadow-2xl hover:shadow-slate-200/70"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sky-700">
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

                                <article className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        What candidates can expect
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        {candidatePromises.map((promise) => (
                                            <div
                                                key={promise}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#2457a3]">
                                                    <ArrowRight size={14} />
                                                </span>
                                                <p className="text-sm leading-7 text-slate-600">
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
                                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c4380] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
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
                    <ModalComponent
                        open={showForm}
                        handleClose={handleCloseForm}
                        width="560px"
                        padding="0"
                    >
                        <div className="w-full rounded-[28px] bg-white p-6 sm:p-7">
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

                    <ModalComponent
                        open={showModal}
                        handleClose={closeModal}
                        width="460px"
                        padding="0"
                    >
                        <div className="w-full rounded-[28px] bg-white p-6">
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
