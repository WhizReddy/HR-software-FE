import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    ArrowUpRight,
    BriefcaseBusiness,
    Clock3,
    LogIn,
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
import PublicPageNav, {
    publicButtonClasses,
} from '@/Components/Public/PublicPageNav'
import { usePageMeta } from '@/hooks/use-page-meta'
import {
    EventsData,
    useCreateEvent,
    useDeleteEvent,
    useGetAllEvents,
    useUpdateEvent,
} from './Hook'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'
import Workers from '/Images/career-workspace-hero.jpg'
import WorkerTwo from '/Images/career-planning-table.jpg'
import WorkerThree from '/Images/career-meeting-room.jpg'

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
    usePageMeta({
        title: managementMode
            ? 'Career Post Studio | People Hub'
            : 'Careers | People Hub',
        description: managementMode
            ? 'Manage public career posts for the People Hub recruitment board.'
            : 'Explore open roles and submit a focused application to the People Hub team.',
    })

    const { events, setEvents, isLoading } = useGetAllEvents()
    const {
        createEvent,
        handleChange,
        event,
        createEventError,
        isCreatingEvent,
    } =
        useCreateEvent(setEvents)
    const {
        editingEvent,
        handleEditChange,
        updateEvent,
        setEditingEvent,
        isUpdatingEvent,
    } = useUpdateEvent(setEvents)
    const {
        handleDelete,
        closeModal,
        showModal,
        handleDeleteEventModal,
        eventToDeleteId,
        isDeletingEvent,
    } = useDeleteEvent(setEvents)
    const { currentUser } = useAuth()

    const isManager = isAdminRole(currentUser?.role)
    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState('')
    const isSavingPost = editingEvent ? isUpdatingEvent : isCreatingEvent

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

    const activeLocations = new Set(
        events.map((careerEvent) => careerEvent.location),
    )
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
        'A hiring process focused on real fit and clear communication.',
    ]
    const hiringSteps = [
        {
            title: 'Apply with context',
            description:
                'Send a focused application with the work, skills, and direction that best represent you.',
            icon: BriefcaseBusiness,
        },
        {
            title: 'Quick review',
            description:
                'Profiles are reviewed against the role expectations, not against generic checklists.',
            icon: Clock3,
        },
        {
            title: 'Clear conversation',
            description:
                'Interview steps stay practical, direct, and connected to the work you would actually do.',
            icon: ShieldCheck,
        },
    ]
    const benefits = [
        {
            title: 'Hybrid work',
            description:
                'Flexible office rhythm for focused work, team reviews, and planned collaboration.',
            icon: Users,
        },
        {
            title: 'Learning budget',
            description:
                'Support for practical courses, books, and tools that improve your product craft.',
            icon: Sparkles,
        },
        {
            title: 'Health insurance',
            description:
                'Benefits that keep the team covered while they do steady, responsible work.',
            icon: ShieldCheck,
        },
        {
            title: 'Team events',
            description:
                'Small, useful team gatherings connected to planning, feedback, and shared wins.',
            icon: BriefcaseBusiness,
        },
    ]

    return (
        <div className="min-h-screen overflow-x-hidden">
            <div
                className={
                    managementMode
                        ? 'mx-auto w-full max-w-full'
                        : 'mx-auto box-border w-full min-w-0 max-w-[calc(100vw-1.5rem)] px-3 py-6 sm:max-w-[1500px] sm:px-6 sm:py-8 lg:px-8'
                }
            >
                {managementMode ? (
                    <>
                        <PageIntro
                            eyebrow="Internal Publishing"
                            title="Career Post Studio"
                            description="Publish, edit, and close career posts from the admin board."
                            className="mb-8"
                            actions={
                                <>
                                    <Link
                                        to="/career"
                                        className={publicButtonClasses.secondary}
                                    >
                                        View Public Page
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={handleOpenCreate}
                                        className={publicButtonClasses.primary}
                                    >
                                        <Plus size={16} />
                                        New Career Post
                                    </button>
                                </>
                            }
                        />

                        <section className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                                <div className="p-6 sm:p-7">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold uppercase text-[#2457a3]">
                                            <Sparkles size={14} />
                                            Publishing overview
                                        </span>
                                        <span className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold uppercase text-slate-500">
                                            Admin board
                                        </span>
                                    </div>

                                    <h2 className="mt-5 max-w-2xl text-3xl font-semibold leading-tight text-slate-950">
                                        Keep every open role clear, current, and
                                        ready for candidates.
                                    </h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                                        Manage the posts that appear on the
                                        public career page. Keep titles,
                                        locations, and descriptions consistent
                                        so applicants know exactly what they are
                                        applying for.
                                    </p>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                        {heroMetrics.map(
                                            ({ label, value, icon: Icon }) => (
                                                <div
                                                    key={label}
                                                    className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <Icon
                                                            size={16}
                                                            className="text-[#2457a3]"
                                                        />
                                                        <p className="text-[11px] font-semibold uppercase text-slate-500">
                                                            {label}
                                                        </p>
                                                    </div>
                                                    <p className="mt-3 text-lg font-bold text-slate-900">
                                                        {value}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
                                        {[
                                            'Write a direct role title',
                                            'Keep location details accurate',
                                            'Preview the public page',
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
                                            >
                                                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                                                <span className="font-medium">
                                                    {item}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative min-h-[260px] overflow-hidden border-t border-slate-200 lg:border-l lg:border-t-0">
                                    <img
                                        src={WorkerThree}
                                        alt="Team planning in the office"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                                        <p className="text-xs font-semibold uppercase text-white/70">
                                            Public board preview
                                        </p>
                                        <p className="mt-2 max-w-sm text-lg font-semibold leading-7">
                                            Candidates see the posts you manage
                                            here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        <PublicPageNav
                            contextLabel="Careers"
                            className="mb-5"
                            navItems={[
                                { href: '#open-roles', label: 'Open roles' },
                                { href: '#culture', label: 'Culture' },
                                { href: '#benefits', label: 'Benefits' },
                            ]}
                            actions={
                                <Link
                                    to="/"
                                    className={publicButtonClasses.secondary}
                                >
                                    Sign in
                                </Link>
                            }
                        />

                        <section className="relative mb-8 min-h-[560px] w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-950 shadow-[0_22px_70px_rgba(15,23,42,0.18)]">
                            <img
                                src={Workers}
                                alt="Focused office workspace"
                                className="absolute inset-0 h-full w-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(15,23,42,0.93),rgba(15,23,42,0.72)_48%,rgba(15,23,42,0.18))]" />
                            <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950/80 to-transparent" />
                            <div className="relative flex min-h-[560px] min-w-0 flex-col justify-between p-5 text-white sm:p-8 lg:p-10">
                                <div className="max-w-full pt-2 sm:max-w-3xl sm:pt-6">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/85 backdrop-blur">
                                            <Sparkles size={14} />
                                            Career board
                                        </span>
                                        <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/85 backdrop-blur">
                                            Tirane based team
                                        </span>
                                    </div>
                                    <h1 className="mt-8 max-w-[38rem] break-words text-2xl font-semibold leading-tight [overflow-wrap:anywhere] min-[420px]:text-3xl sm:text-5xl lg:text-6xl">
                                        Work on HR tools people actually use.
                                    </h1>
                                    <p className="mt-5 max-w-full break-words text-base leading-8 text-white/78 [overflow-wrap:anywhere] sm:max-w-xl sm:text-lg">
                                        Join a focused team building practical
                                        tools for recruitment, payroll, assets,
                                        and planning.
                                    </p>
                                    <div className="mt-8 flex min-w-0 flex-col gap-3 sm:flex-row">
                                        <a
                                            href="#open-roles"
                                            className={`${publicButtonClasses.primary} w-full min-w-0 sm:w-auto`}
                                        >
                                            Open roles
                                            <ArrowRight size={16} />
                                        </a>
                                        <Link
                                            to="/recruitment"
                                            className={`${publicButtonClasses.secondary} w-full min-w-0 sm:w-auto`}
                                        >
                                            Submit General Application
                                            <ArrowRight size={16} />
                                        </Link>
                                        <Link
                                            to="/"
                                            className={`${publicButtonClasses.secondary} w-full min-w-0 sm:w-auto`}
                                        >
                                            <LogIn size={16} />
                                            Login
                                        </Link>
                                        {isManager && (
                                            <Link
                                                to="/career-posts"
                                                className={`${publicButtonClasses.secondary} w-full min-w-0 sm:w-auto`}
                                            >
                                                Manage Career Posts
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-10 grid min-w-0 gap-3 sm:grid-cols-3">
                                    {heroMetrics.map(
                                        ({ label, value, icon: Icon }) => (
                                            <div
                                                key={label}
                                                className="min-w-0 rounded-lg border border-white/15 bg-white/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur"
                                            >
                                                <div className="flex items-center gap-2 text-white/75">
                                                    <Icon size={16} />
                                                    <p className="text-[11px] font-semibold uppercase">
                                                        {label}
                                                    </p>
                                                </div>
                                                <p className="mt-3 break-words text-lg font-semibold text-white">
                                                    {value}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="grid min-w-0 items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
                            <article className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]">
                                <div className="relative min-h-[330px] min-w-0">
                                    <img
                                        src={WorkerThree}
                                        alt="Team collaboration"
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 min-w-0 p-6 text-white">
                                        <p className="text-xs font-semibold uppercase text-white/65">
                                            Team environment
                                        </p>
                                        <h2 className="mt-3 max-w-xl break-words text-xl font-semibold leading-tight [overflow-wrap:anywhere] min-[420px]:text-2xl sm:text-3xl">
                                            Clear ownership, steady
                                            collaboration, and practical work.
                                        </h2>
                                    </div>
                                </div>
                                <div className="min-w-0 border-t border-slate-100 p-6">
                                    <p className="max-w-2xl break-words text-sm leading-7 text-slate-600 [overflow-wrap:anywhere]">
                                        We keep expectations visible, ship
                                        useful work, and give people room to
                                        contribute without unnecessary process.
                                    </p>
                                    <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-3">
                                        {[
                                            'Real product work',
                                            'Direct feedback',
                                            'Low-noise execution',
                                        ].map((item) => (
                                            <div
                                                key={item}
                                                className="min-w-0 break-words rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </article>

                            <div className="grid min-w-0 gap-5">
                                <article className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Hiring rhythm
                                    </p>
                                    <div className="mt-5 grid gap-3">
                                        {hiringSteps.map(
                                            ({ title, description, icon: Icon }) => (
                                                <div
                                                    key={title}
                                                    className="flex min-w-0 gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white text-[#2457a3] shadow-sm">
                                                        <Icon
                                                            size={16}
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm font-semibold text-slate-950">
                                                            {title}
                                                        </h3>
                                                        <p className="mt-1 break-words text-sm leading-6 text-slate-600">
                                                            {description}
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </article>

                                <article className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                    <div className="flex min-w-0 items-center justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase text-slate-400">
                                                Common locations
                                            </p>
                                            <h3 className="mt-2 break-words text-xl font-semibold text-slate-950">
                                                Flexible roles, clear details
                                            </h3>
                                        </div>
                                        <ArrowUpRight
                                            size={16}
                                            className="text-[#2457a3]"
                                        />
                                    </div>
                                    <div className="mt-5 flex flex-wrap gap-2">
                                        {featuredLocations.length > 0 ? (
                                            featuredLocations.map(
                                                (location) => (
                                                    <span
                                                        key={location}
                                                        className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                                                    >
                                                        {location}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className="text-sm text-slate-500">
                                                Flexible location details are
                                                shared per role.
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                        <img
                                            src={WorkerTwo}
                                            alt="Team planning session"
                                            className="h-36 w-full object-cover"
                                        />
                                        <div className="p-4">
                                            <p className="text-[11px] font-semibold uppercase text-slate-400">
                                                Candidate fit
                                            </p>
                                            <p className="mt-2 text-sm leading-7 text-slate-600">
                                                We care about useful work, good
                                                judgment, and clear
                                                communication.
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </section>
                    </>
                )}

                <section
                    id="open-roles"
                    className="mt-8 scroll-mt-8 min-w-0 rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase text-slate-400">
                                {managementMode
                                    ? 'Filter Posts'
                                    : 'Find a Role'}
                            </p>
                            <h2 className="mt-1 text-xl font-semibold text-slate-950">
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

                        <label className="flex w-full items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 lg:max-w-md focus-within:border-[#2457a3] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#2457a3]/15">
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
                                    className="h-64 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                <BriefcaseBusiness size={28} />
                            </div>
                            <h3 className="mt-6 text-2xl font-semibold text-slate-950">
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
                                {managementMode && (
                                    <button
                                        type="button"
                                        onClick={handleOpenCreate}
                                        className={publicButtonClasses.primary}
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
                                    className="group flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-[#2457a3]/35 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="inline-flex rounded-md bg-sky-50 px-3 py-1 text-xs font-semibold uppercase text-sky-700">
                                                {managementMode
                                                    ? 'Published Post'
                                                    : 'Open Role'}
                                            </p>
                                            <h3 className="mt-5 text-[1.85rem] font-semibold leading-tight text-slate-950">
                                                {careerEvent.title}
                                            </h3>
                                            <div className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
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
                                                    onClick={() =>
                                                        handleOpenEdit(
                                                            careerEvent,
                                                        )
                                                    }
                                                    aria-label={`Edit ${careerEvent.title}`}
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/30"
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
                                                    className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-rose-200 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                                        {truncateText(
                                            careerEvent.description,
                                            190,
                                        )}
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
                                            <span className="text-xs font-semibold uppercase text-slate-400">
                                                General application supported
                                            </span>
                                        )}

                                        {!managementMode && (
                                            <Link
                                                to="/recruitment"
                                                className={`${publicButtonClasses.primary} shrink-0 whitespace-nowrap`}
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
                        <section
                            id="culture"
                            className="mt-12 scroll-mt-8 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]"
                        >
                            <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                <p className="text-xs font-semibold uppercase text-slate-400">
                                    Why join us
                                </p>
                                <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                                    Serious work, calm collaboration, and
                                    details that stay accurate.
                                </h2>
                                <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                                    The environment is structured enough to keep
                                    things moving and flexible enough for strong
                                    people to make a visible difference.
                                </p>

                                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                    {culturePrinciples.map(
                                        ({
                                            title,
                                            description,
                                            icon: Icon,
                                        }) => (
                                            <article
                                                key={title}
                                                className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                                            >
                                                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-[#2457a3] shadow-sm">
                                                    <Icon size={18} />
                                                </div>
                                                <h3 className="mt-4 text-lg font-semibold text-slate-950">
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
                                <article className="overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                    <img
                                        src={WorkerThree}
                                        alt="Team collaboration in the office"
                                        className="h-56 w-full object-cover"
                                    />
                                    <div className="p-6">
                                        <p className="text-xs font-semibold uppercase text-slate-400">
                                            Team perspective
                                        </p>
                                        <blockquote className="mt-3 text-lg font-semibold leading-8 text-slate-900">
                                            “The work is practical and the bar
                                            is clear. You know what good looks
                                            like, and you get room to deliver
                                            it.”
                                        </blockquote>
                                    </div>
                                </article>

                                <article className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        What candidates can expect
                                    </p>
                                    <div className="mt-5 space-y-4">
                                        {candidatePromises.map((promise) => (
                                            <div
                                                key={promise}
                                                className="flex items-start gap-3"
                                            >
                                                <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#2457a3]">
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

                        <section
                            id="benefits"
                            className="mt-6 scroll-mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                        >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Benefits
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                        Built for sustainable team work.
                                    </h2>
                                </div>
                                <p className="max-w-xl text-sm leading-6 text-slate-500">
                                    Practical support that fits the way People
                                    Hub teams plan, build, and improve the
                                    product.
                                </p>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                {benefits.map(
                                    ({ title, description, icon: Icon }) => (
                                        <article
                                            key={title}
                                            className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-5"
                                        >
                                            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-[#2457a3] shadow-sm">
                                                <Icon size={18} />
                                            </div>
                                            <h3 className="mt-4 text-base font-semibold text-slate-950">
                                                {title}
                                            </h3>
                                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                                {description}
                                            </p>
                                        </article>
                                    ),
                                )}
                            </div>
                        </section>

                        <section className="mt-6 grid gap-5 lg:grid-cols-3">
                            {culturePrinciples.map((principle) => (
                                <article
                                    key={`${principle.title}-summary`}
                                    className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                                >
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Candidate fit
                                    </p>
                                    <p className="mt-3 text-sm leading-7 text-slate-600">
                                        {principle.title === 'Focused teams'
                                            ? 'You are comfortable owning a problem directly and communicating without excess ceremony.'
                                            : principle.title ===
                                                'Clear expectations'
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
                        showCloseButton={false}
                    >
                        <div className="w-full rounded-lg bg-white p-6 sm:p-7">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-slate-400">
                                        Career Publishing
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                        {editingEvent
                                            ? 'Edit Career Post'
                                            : 'Create Career Post'}
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
                                        value={
                                            editingEvent
                                                ? editingEvent.title
                                                : event.title
                                        }
                                        onChange={
                                            editingEvent
                                                ? handleEditChange
                                                : handleChange
                                        }
                                        placeholder="Frontend Developer"
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Location
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={
                                            editingEvent
                                                ? editingEvent.location
                                                : event.location
                                        }
                                        onChange={
                                            editingEvent
                                                ? handleEditChange
                                                : handleChange
                                        }
                                        placeholder="Tirane / Hybrid"
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                <label className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">
                                        Description
                                    </span>
                                    <textarea
                                        name="description"
                                        value={
                                            editingEvent
                                                ? editingEvent.description
                                                : event.description
                                        }
                                        onChange={
                                            editingEvent
                                                ? handleEditChange
                                                : handleChange
                                        }
                                        placeholder="Describe the role, expectations, and why someone should apply."
                                        rows={6}
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-[#2457a3] focus:bg-white"
                                    />
                                </label>

                                {createEventError && (
                                    <p className="rounded-lg border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                                        {createEventError}
                                    </p>
                                )}
                            </div>

                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    btnText={
                                        isSavingPost
                                            ? 'Saving...'
                                            : editingEvent
                                              ? 'Update Post'
                                              : 'Publish Post'
                                    }
                                    type={ButtonTypes.PRIMARY}
                                    width="100%"
                                    onClick={handleSubmitForm}
                                    disabled={isSavingPost}
                                />
                                <Button
                                    btnText="Cancel"
                                    width="100%"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={handleCloseForm}
                                    disabled={isSavingPost}
                                />
                            </div>
                        </div>
                    </ModalComponent>

                    <ModalComponent
                        open={showModal}
                        handleClose={closeModal}
                        width="460px"
                        padding="0"
                        showCloseButton={false}
                    >
                        <div className="w-full rounded-lg bg-white p-6">
                            <h2 className="text-2xl font-semibold text-slate-950">
                                Delete career post?
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-slate-500">
                                This removes the post from the public career
                                page. You can publish a replacement immediately
                                after.
                            </p>
                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    backgroundColor="#d32f2f"
                                    borderColor="#d32f2f"
                                    btnText={
                                        isDeletingEvent
                                            ? 'Deleting...'
                                            : 'Delete Post'
                                    }
                                    width="100%"
                                    onClick={() =>
                                        handleDelete(eventToDeleteId)
                                    }
                                    disabled={isDeletingEvent}
                                />
                                <Button
                                    btnText="Cancel"
                                    width="100%"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={closeModal}
                                    disabled={isDeletingEvent}
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
