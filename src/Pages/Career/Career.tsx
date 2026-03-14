import { useState } from 'react'
import style from './Style/Career.module.css'
import Button from '@/Components/Button/Button'

import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import {
    useGetAllEvents,
    useCreateEvent,
    useUpdateEvent,
    useDeleteEvent,
    EventsData,
} from './Hook'
import { ModalComponent } from '@/Components/Modal/Modal'
import { MoreHorizontal } from 'lucide-react'
import { useAuth } from '@/Context/AuthProvider'
import Workers from '/public/Images/happy workers.webp'
import worker3 from '/public/Images/happyWork3.jpeg'
import worker2 from '/public/Images/happyWorkers2.jpg'
import { Link } from 'react-router-dom'

export const Careers = () => {
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

    const [showForm, setShowForm] = useState(false)
    const [filter, setFilter] = useState<string>('')

    const toggleForm = () => {
        setShowForm(!showForm)
    }

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilter(e.target.value)
    }

    const filteredEvents = events.filter(
        (event) =>
            event.title.toLowerCase().includes(filter.toLowerCase()) ||
            event.description.toLowerCase().includes(filter.toLowerCase()),
    )

    const [openDropdown, setOpenDropdown] = useState<string | number | null>(
        null,
    )

    const toggleDropdown = (eventId: string) => {
        if (openDropdown === eventId) {
            setOpenDropdown(null)
        } else {
            setOpenDropdown(eventId)
        }
    }

    const handleEditClick = (event: EventsData) => {
        setEditingEvent(event)
        setShowForm(true)
    }
    const isAdmin = currentUser?.role === 'admin'

    return (
        <div className={style.body}>
            <div className={style.container}>
                <div className={style.hero}>
                    <h1>Join Our Team</h1>
                    <p>
                        Be part of something bigger. Make a difference in the
                        world of technology.
                    </p>
                    <div className="mt-6 flex justify-center">
                        <Link
                            to="/recruitment"
                            className="inline-flex items-center rounded-xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1b4285]"
                        >
                            Submit General Application
                        </Link>
                    </div>
                </div>

                <div className={style.filter}>
                    <input
                        type="text"
                        placeholder="Filter by title or description"
                        value={filter}
                        onChange={handleFilterChange}
                        className={style.filterInput}
                    />
                </div>

                {/* {isAdmin ? (
                    <div className={style.createButton}>
                        <Button
                            btnText="New Job"
                            color="#007bff"
                            backgroundColor="white"
                            type={ButtonTypes.PRIMARY}
                            onClick={toggleForm}
                        />
                    </div>
                ) : (
                    ''
                )} */}

                <div className={style.jobList}>
                    {isLoading ? (
                        <div className="col-span-full flex justify-center py-12">
                            <p className="text-slate-400 animate-pulse">Loading amazing opportunities...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="col-span-full text-center py-12 glass-card">
                            <p className="text-slate-500 font-medium">We did not find what you are looking for.</p>
                            <div className="mt-4">
                                <Link
                                    to="/recruitment"
                                    className="inline-flex items-center rounded-xl bg-[#2457a3] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#1b4285]"
                                >
                                    Apply Anyway
                                </Link>
                            </div>
                        </div>
                    ) : (
                        filteredEvents.map((event) => (
                            <div key={event._id} className={style.jobCard}>
                                <div className={style.jobCardContent}>
                                    <h2>{event.title}</h2>
                                    <p className={style.description}>
                                        {event.description}
                                    </p>
                                    <div className={style.location}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {event.location}
                                    </div>
                                    <div className={style.actions}>
                                        <Link to={'/recruitment'}>Apply Now</Link>
                                    </div>
                                </div>
                                {isAdmin ? (
                                    <div className={style.dropdownContainer}>
                                        <button
                                            onClick={() => toggleDropdown(event._id.toString())}
                                            className="flex items-center justify-center p-2 rounded-full hover:bg-slate-100 transition-colors bg-white/50 border border-slate-200/50 shadow-sm"
                                        >
                                            <MoreHorizontal className={style.moreIcon} size={18} />
                                        </button>
                                        {openDropdown === event._id && (
                                            <div className={style.dropdownMenu}>
                                                <button
                                                    onClick={() =>
                                                        handleEditClick(event)
                                                    }
                                                >
                                                    Edit Position
                                                </button>
                                                <button
                                                    className="text-red-600 hover:bg-red-50"
                                                    onClick={() =>
                                                        handleDeleteEventModal(
                                                            event._id,
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        ))
                    )}
                </div>

                <ModalComponent open={showForm} handleClose={toggleForm}>
                    <div className={style.eventForm}>
                        <h2>{editingEvent ? 'Edit' : 'Create'}</h2>
                        <form>
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
                                placeholder="Event Title"
                            />
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
                                placeholder="Event Description"
                            />
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
                                placeholder="Location"
                            />
                            {createEventError && (
                                <p className={style.error}>
                                    {createEventError}
                                </p>
                            )}
                            <div className={style.modalFooter}>
                                <Button
                                    btnText={editingEvent ? 'Update' : 'Create'}
                                    type={ButtonTypes.PRIMARY}
                                    height="40px"
                                    alignItems="center"
                                    width="120px"
                                    onClick={
                                        editingEvent ? updateEvent : createEvent
                                    }
                                />
                                <Button
                                    btnText="Cancel"
                                    height="40px"
                                    alignItems="center"
                                    width="120px"
                                    type={ButtonTypes.SECONDARY}
                                    onClick={toggleForm}
                                />
                            </div>
                        </form>
                    </div>
                </ModalComponent>

                <ModalComponent open={showModal} handleClose={closeModal}>
                    <div>
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete this event?</p>
                        <div className={style.modalFooter}>
                            <Button
                                type={ButtonTypes.PRIMARY}
                                backgroundColor="#d32f2f"
                                borderColor="#d32f2f"
                                btnText="Confirm"
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

                <div className={style.culture}>
                    <h2>Our Culture</h2>
                    <p>
                        At our company, we value innovation, collaboration, and
                        growth. Join us and thrive in a supportive and dynamic
                        environment.
                    </p>
                    <div className={style.cultureImages}>
                        <img
                            src={Workers}
                            alt=""
                            className={style.cultureImage}
                        ></img>
                        <img
                            src={worker3}
                            alt=""
                            className={style.cultureImage}
                        ></img>
                        <img
                            src={worker2}
                            alt=""
                            className={style.cultureImage}
                        ></img>
                    </div>
                </div>

                <div className={style.testimonials}>
                    <h2>What Our Employees Say</h2>
                    <p>
                        "This company has provided me with numerous
                        opportunities for growth and development."
                    </p>
                    <p>
                        "I love the collaborative and inclusive culture here."
                    </p>
                </div>

                <div className={style.footer}>
                    <p>
                        &copy; 2024 CRM. All rights reserved.
                    </p>
                    <p>
                        Follow us on <a href="#">LinkedIn</a>.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Careers
