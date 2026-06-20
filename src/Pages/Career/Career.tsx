import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    ArrowRight,
    BriefcaseBusiness,
    Clock3,
    MapPin,
    Pencil,
    Plus,
    Search,
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
            : 'See current People Hub roles and send an application with your CV and role details.',
    })

    useEffect(() => {
        if (managementMode || window.location.hash !== '#application-notes') {
            return
        }

        window.history.replaceState(
            null,
            document.title,
            `${window.location.pathname}${window.location.search}`,
        )
    }, [managementMode])

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

    const heroMetrics = [
        {
            label: 'Open roles',
            value: String(events.length),
            icon: BriefcaseBusiness,
        },
        {
            label: 'Reply window',
            value: '2-3 days',
            icon: Clock3,
        },
        {
            label: 'Working style',
            value: 'Small product team',
            icon: Users,
        },
    ]
    const applicationNotes = [
        'Use the exact role title when applying so the team can match your profile quickly.',
        'Attach a CV that shows recent work, tools, and project responsibilities.',
        'After email confirmation, the application appears in the HR review board.',
    ]
    return (
        <div className="min-h-screen overflow-x-hidden">
            <div
                className={
                    managementMode
                        ? 'mx-auto w-full max-w-full'
                        : 'mx-auto box-border w-full min-w-0 max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8'
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

                        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-6">
                                <div className="grid gap-3 sm:grid-cols-3">
                                    {heroMetrics.map(
                                        ({ label, value, icon: Icon }) => (
                                            <article
                                                key={label}
                                                className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                                            >
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Icon
                                                        size={16}
                                                        className="text-slate-600"
                                                    />
                                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                                                        {label}
                                                    </p>
                                                </div>
                                                <p className="mt-3 text-lg font-semibold text-slate-950">
                                                    {value}
                                                </p>
                                            </article>
                                        ),
                                    )}
                                </div>

                                <div className="mt-5 border-t border-slate-100 pt-5">
                                    <h2 className="text-base font-semibold text-slate-950">
                                        Publishing checklist
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-slate-500">
                                        Keep every public post plain, current,
                                        and easy for candidates to match with
                                        their application.
                                    </p>
                                </div>
                            </div>

                            <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                    Good post rules
                                </p>
                                <div className="mt-4 space-y-3">
                                    {[
                                        'Use the same role title applicants should enter.',
                                        'Keep the location short and practical.',
                                        'Preview the public board after publishing.',
                                    ].map((item) => (
                                        <p
                                            key={item}
                                            className="border-l border-slate-200 pl-3 text-sm leading-6 text-slate-600"
                                        >
                                            {item}
                                        </p>
                                    ))}
                                </div>
                            </aside>
                        </section>
                    </>
                ) : (
                    <>
                        <PublicPageNav
                            contextLabel="Careers"
                            className="mb-5"
                            navItems={[
                                { href: '#open-roles', label: 'Open roles' },
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

                        <section className="mb-6 max-w-full overflow-hidden rounded-xl border border-slate-200 bg-[#fbfbf8] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        People Hub Careers
                                    </p>
                                    <h1 className="mt-5 max-w-2xl break-words text-2xl font-semibold leading-tight text-slate-950 min-[420px]:text-3xl sm:text-5xl">
                                        Open roles, written clearly.
                                    </h1>
                                    <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-slate-600 sm:text-base">
                                        Browse the roles currently published by
                                        the HR team. If nothing fits today, you
                                        can still send a general application.
                                    </p>

                                    <div className="mt-7 flex min-w-0 flex-col gap-3 sm:flex-row">
                                        <a
                                            href="#open-roles"
                                            className={`${publicButtonClasses.primary} w-full sm:w-auto`}
                                        >
                                            View roles
                                            <ArrowRight size={16} />
                                        </a>
                                        <Link
                                            to="/recruitment"
                                            className={`${publicButtonClasses.secondary} w-full sm:w-auto`}
                                        >
                                            Submit application
                                            <ArrowRight size={16} />
                                        </Link>
                                        {isManager && (
                                            <Link
                                                to="/career-posts"
                                                className={`${publicButtonClasses.secondary} w-full sm:w-auto`}
                                            >
                                                Manage posts
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                <aside className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Current board
                                    </p>
                                    <dl className="mt-5 divide-y divide-slate-100">
                                        <div className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                                            <dt className="text-sm font-medium text-slate-500">
                                                Open roles
                                            </dt>
                                            <dd className="shrink-0 break-words text-lg font-semibold text-slate-950">
                                                {events.length}
                                            </dd>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                                            <dt className="text-sm font-medium text-slate-500">
                                                Application form
                                            </dt>
                                            <dd className="shrink-0 break-words text-sm font-semibold text-slate-950">
                                                Available
                                            </dd>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-between gap-2 py-3 last:pb-0">
                                            <dt className="text-sm font-medium text-slate-500">
                                                Location
                                            </dt>
                                            <dd className="shrink-0 break-words text-sm font-semibold text-slate-950">
                                                Per role
                                            </dd>
                                        </div>
                                    </dl>
                                </aside>
                            </div>
                        </section>

                        <section
                            id="open-roles"
                            className="grid max-w-full scroll-mt-8 gap-5 overflow-hidden lg:grid-cols-[320px_minmax(0,1fr)]"
                        >
                            <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                                <label className="flex w-full items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-400/20">
                                    <Search
                                        size={18}
                                        className="shrink-0 text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search roles..."
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                        className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </label>

                                <div className="mt-6">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                        Before applying
                                    </p>
                                    <div className="mt-4 space-y-3">
                                        {applicationNotes.map((note) => (
                                            <p
                                                key={note}
                                                className="border-l border-slate-200 pl-3 text-sm leading-6 text-slate-600"
                                            >
                                                {note}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            </aside>

                            <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
                                <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-end sm:justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-500">
                                            Open roles
                                        </p>
                                        <h2 className="mt-1 text-2xl font-semibold text-slate-950">
                                            {filteredEvents.length} result
                                            {filteredEvents.length === 1
                                                ? ''
                                                : 's'}
                                        </h2>
                                    </div>
                                    {filter && (
                                        <p className="text-sm text-slate-500">
                                            Search: “{filter}”
                                        </p>
                                    )}
                                </div>

                                {isLoading ? (
                                    <div className="mt-5 space-y-3">
                                        {Array.from({ length: 3 }).map(
                                            (_, index) => (
                                                <div
                                                    key={index}
                                                    className="h-32 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                                                />
                                            ),
                                        )}
                                    </div>
                                ) : filteredEvents.length === 0 ? (
                                    <div className="mt-5 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-6">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-950">
                                                    No open role matches right
                                                    now
                                                </h3>
                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    Send a general application
                                                    and the HR team can review
                                                    your profile when a role
                                                    opens.
                                                </p>
                                            </div>
                                            <Link
                                                to="/recruitment"
                                                className={`${publicButtonClasses.secondary} w-full shrink-0 sm:w-auto`}
                                            >
                                                Apply anyway
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-5 space-y-3">
                                        {filteredEvents.map((careerEvent) => (
                                            <article
                                                key={careerEvent._id}
                                                className="rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:bg-slate-50/70"
                                            >
                                                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                    <div className="min-w-0">
                                                        <h3 className="break-words text-xl font-semibold text-slate-950">
                                                            {careerEvent.title}
                                                        </h3>
                                                        <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-500">
                                                            <MapPin
                                                                size={15}
                                                                className="shrink-0"
                                                            />
                                                            <span>
                                                                {careerEvent.location ||
                                                                    'Location to be confirmed'}
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <Link
                                                        to="/recruitment"
                                                        className={`${publicButtonClasses.primary} w-full shrink-0 sm:w-auto`}
                                                    >
                                                        Apply
                                                        <ArrowRight
                                                            size={16}
                                                        />
                                                    </Link>
                                                </div>
                                                <p className="mt-4 text-sm leading-7 text-slate-600">
                                                    {truncateText(
                                                        careerEvent.description,
                                                        220,
                                                    )}
                                                </p>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {managementMode && (
                    <>
                        <section
                            id="open-roles"
                            className="mt-8 scroll-mt-8 min-w-0 rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)]"
                        >
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-500">
                                        Filter posts
                                    </p>
                                    <h2 className="mt-1 text-xl font-semibold text-slate-950">
                                        Search your published career posts
                                    </h2>
                                    <p className="mt-2 text-sm text-slate-500">
                                        {filteredEvents.length} result
                                        {filteredEvents.length === 1
                                            ? ''
                                            : 's'}
                                        {filter ? ` for "${filter}"` : ''}
                                    </p>
                                </div>

                                <label className="flex w-full items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 lg:max-w-md focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-400/20">
                                    <Search
                                        size={18}
                                        className="text-slate-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search positions..."
                                        value={filter}
                                        onChange={(e) =>
                                            setFilter(e.target.value)
                                        }
                                        className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="mt-8">
                            {isLoading ? (
                                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                    {Array.from({ length: 3 }).map(
                                        (_, index) => (
                                            <div
                                                key={index}
                                                className="h-64 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
                                            />
                                        ),
                                    )}
                                </div>
                            ) : filteredEvents.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                                        <BriefcaseBusiness size={28} />
                                    </div>
                                    <h3 className="mt-6 text-2xl font-semibold text-slate-950">
                                        No career posts match this filter
                                    </h3>
                                    <p className="mt-3 text-sm text-slate-500">
                                        Clear the filter or publish a new role
                                        to populate the board.
                                    </p>
                                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleOpenCreate}
                                            className={
                                                publicButtonClasses.primary
                                            }
                                        >
                                            <Plus size={16} />
                                            Create Career Post
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    {filteredEvents.map((careerEvent) => (
                                        <article
                                            key={careerEvent._id}
                                            className="group flex h-full flex-col rounded-xl border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_18px_45px_rgba(15,23,42,0.10)]"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <p className="inline-flex rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                        Published post
                                                    </p>
                                                    <h3 className="mt-5 text-[1.85rem] font-semibold leading-tight text-slate-950">
                                                        {careerEvent.title}
                                                    </h3>
                                                    <div className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">
                                                        <MapPin
                                                            size={15}
                                                            className="text-slate-600"
                                                        />
                                                        <span>
                                                            {careerEvent.location ||
                                                                'Location to be confirmed'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isManager && (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenEdit(
                                                                    careerEvent,
                                                                )
                                                            }
                                                            aria-label={`Edit ${careerEvent.title}`}
                                                            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30"
                                                        >
                                                            <Pencil
                                                                size={16}
                                                            />
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
                                                            <Trash2
                                                                size={16}
                                                            />
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
                                                <Link
                                                    to="/career"
                                                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                                                >
                                                    Preview public page
                                                    <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            )}
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
                                    <p className="text-sm font-semibold text-slate-500">
                                        Career publishing
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
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
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
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
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
                                        className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white"
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
