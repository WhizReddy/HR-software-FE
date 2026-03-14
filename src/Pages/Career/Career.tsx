import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BriefcaseBusiness, MapPin, Pencil, Plus, Search, Sparkles, Trash2 } from 'lucide-react'
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
import { useAuth } from '@/Context/AuthProvider'
import { isAdminRole } from '@/Helpers/access'
import Workers from '/public/Images/happy workers.webp'
import worker3 from '/public/Images/happyWork3.jpeg'
import worker2 from '/public/Images/happyWorkers2.jpg'

type CareersProps = {
    managementMode?: boolean
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

    return (
        <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7fb_0%,#ffffff_28%,#f8fafc_100%)]">
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
                    <section className="relative overflow-hidden rounded-[36px] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(36,87,163,0.14),_transparent_30%),linear-gradient(135deg,#ffffff_0%,#eef5ff_46%,#f7fbff_100%)] p-8 shadow-xl shadow-slate-200/50">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/30 blur-3xl" />
                        <div className="pointer-events-none absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-100/60 blur-3xl" />

                        <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                            <div>
                                <p className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#2457a3]">
                                    <BriefcaseBusiness size={14} />
                                    Career Board
                                </p>
                                <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
                                    Build your next chapter with a team that ships thoughtfully.
                                </h1>
                                <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                                    Explore open positions, understand the culture before you apply, and submit a general application even when the perfect role is not listed yet.
                                </p>

                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        to="/recruitment"
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-[#1c4380]"
                                    >
                                        Submit General Application
                                        <ArrowRight size={16} />
                                    </Link>
                                    {isManager && (
                                        <Link
                                            to="/career-posts"
                                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                                        >
                                            Manage Career Posts
                                        </Link>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Open Roles
                                    </p>
                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {events.length}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Locations
                                    </p>
                                    <p className="mt-3 text-3xl font-black text-slate-900">
                                        {activeLocations.size}
                                    </p>
                                </div>
                                <div className="rounded-3xl border border-white/80 bg-white/85 p-5 shadow-sm">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Focus
                                    </p>
                                    <p className="mt-3 text-lg font-bold text-slate-900">
                                        Product + delivery excellence
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                <section className="mt-8 rounded-[28px] border border-slate-200/70 bg-white/90 p-5 shadow-sm backdrop-blur">
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
                        </div>

                        <label className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 lg:max-w-md">
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
                                    className="group flex h-full flex-col rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#2457a3]">
                                                Career Opportunity
                                            </p>
                                            <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                                                {careerEvent.title}
                                            </h3>
                                        </div>

                                        {managementMode && isManager && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEdit(careerEvent)}
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800"
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
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-rose-200 text-rose-500 transition hover:bg-rose-50 hover:text-rose-700"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <MapPin size={16} className="text-[#2457a3]" />
                                        <span>{careerEvent.location || 'Location to be confirmed'}</span>
                                    </div>

                                    <p className="mt-5 flex-1 text-sm leading-7 text-slate-600">
                                        {careerEvent.description}
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
                                                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2457a3]"
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
                    <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                        <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-6">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Culture Snapshot
                                    </p>
                                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                                        Small-team ownership, clear standards, and room to grow.
                                    </h2>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-3">
                                    {[Workers, worker3, worker2].map((image, index) => (
                                        <div
                                            key={index}
                                            className="overflow-hidden rounded-3xl border border-slate-200/60 bg-slate-100"
                                        >
                                            <img
                                                src={image}
                                                alt="Team culture"
                                                className="h-52 w-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-[30px] border border-slate-200/70 bg-[#0f213d] p-8 text-white shadow-xl shadow-slate-200/50">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                                Why people stay
                            </p>
                            <blockquote className="mt-5 text-xl font-semibold leading-9 text-white">
                                “The expectations are high, but they are clear. You get support, ownership, and enough trust to do serious work.”
                            </blockquote>
                            <p className="mt-4 text-sm text-blue-100">
                                Teams are expected to communicate well, document decisions, and keep improving the product and the process.
                            </p>
                        </section>
                    </div>
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
