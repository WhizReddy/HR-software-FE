import React, { Suspense, lazy, useEffect, useState } from 'react'
import { MapPinned, X } from 'lucide-react'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Dropzone from '@/Dropzone/Dropzone'
import DrawerComponent from '@/Components/Drawer/Drawer'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { useEvents } from '@/Pages/Events/Context/EventsContext'
import { useDebouncedValue } from '@/hooks/use-debounced-value'
import { ChunkLoadBoundary } from '@/Components/Error/ChunkLoadBoundary'

const EventMapPicker = lazy(() => import('../Components/GoogleMap/MapPicker'))

const toDateTimeLocalInput = (value?: Date | string | null) => {
    if (!value) return ''

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) {
        return typeof value === 'string' ? value.slice(0, 16) : ''
    }

    const pad = (number: number) => number.toString().padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export default function Forms() {
    const {
        editingEvent,
        createEvent,
        isCreating,
        updateEvent,
        handleChange,
        handleEditChange,
        event,
        typesofEvent,
        editType,
        setEditType,
        handleCloseDrawer,
        drawerOpen,
    } = useEvents()
    const [mountLocationPicker, setMountLocationPicker] = useState(false)

    const handleLocationChange = (address: string) => {
        if (editingEvent) {
            handleEditChange({
                target: {
                    name: 'location',
                    value: address,
                },
            } as React.ChangeEvent<HTMLInputElement>)
        } else {
            handleChange({
                target: {
                    name: 'location',
                    value: address,
                },
            } as React.ChangeEvent<HTMLInputElement>)
        }
    }

    const currentLocation = editingEvent
        ? editingEvent.location
        : event.location
    const debouncedLocation = useDebouncedValue(currentLocation, 700)
    const nowInputValue = toDateTimeLocalInput(new Date())
    const currentStartDate = editingEvent
        ? editingEvent.startDate
            ? toDateTimeLocalInput(editingEvent.startDate)
            : ''
        : event.startDate
    const currentEndDate = editingEvent
        ? editingEvent.endDate
            ? toDateTimeLocalInput(editingEvent.endDate)
            : ''
        : event.endDate
    const minStartDate =
        editingEvent && currentStartDate && currentStartDate < nowInputValue
            ? currentStartDate
            : nowInputValue
    const minEndDate = currentStartDate || minStartDate

    useEffect(() => {
        if (!drawerOpen) {
            setMountLocationPicker(false)
            return
        }
    }, [drawerOpen])

    return (
        <DrawerComponent
            open={drawerOpen}
            onClose={handleCloseDrawer}
            width="560px"
        >
            <div className="flex min-h-full min-w-0 flex-col">
                <div className="mb-6 flex shrink-0 items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-slate-800">
                        {editingEvent ? 'Edit Event' : 'Create New Event'}
                    </h2>
                    <button
                        type="button"
                        onClick={handleCloseDrawer}
                        aria-label="Close event form"
                        className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="flex flex-col gap-5 pb-5">
                    {/* General Info Card */}
                    <div className="space-y-4 rounded-lg border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Event Details
                        </h3>
                        <Input
                            IsUsername
                            label="Event Title"
                            name="title"
                            onChange={
                                editingEvent ? handleEditChange : handleChange
                            }
                            value={
                                editingEvent ? editingEvent.title : event.title
                            }
                            width="100%"
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Input
                                IsUsername
                                label="Start Date and Time"
                                shrink
                                name="startDate"
                                type="datetime-local"
                                onChange={
                                    editingEvent
                                        ? handleEditChange
                                        : handleChange
                                }
                                value={currentStartDate}
                                width="100%"
                                min={minStartDate}
                                max="2030-12-31T23:59"
                            />
                            <Input
                                IsUsername
                                label="End Date and Time"
                                shrink
                                name="endDate"
                                type="datetime-local"
                                onChange={
                                    editingEvent
                                        ? handleEditChange
                                        : handleChange
                                }
                                value={currentEndDate}
                                width="100%"
                                min={minEndDate}
                                max="2030-12-31T23:59"
                            />
                        </div>

                        <Input
                            IsUsername
                            label="Description"
                            type="textarea"
                            name="description"
                            multiline
                            rows={3}
                            onChange={
                                editingEvent ? handleEditChange : handleChange
                            }
                            value={
                                editingEvent
                                    ? editingEvent.description
                                    : event.description
                            }
                            width="100%"
                        />
                    </div>

                    {/* Location Card */}
                    <div className="space-y-4 rounded-lg border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Location
                        </h3>
                        <Input
                            IsUsername
                            label="Event location"
                            name="location"
                            value={currentLocation}
                            onChange={
                                editingEvent ? handleEditChange : handleChange
                            }
                            width="100%"
                        />

                        <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-4">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                <div className="flex min-w-0 flex-1 items-start gap-3">
                                    <div className="rounded-xl bg-white p-2 text-slate-500 shadow-sm ring-1 ring-slate-200">
                                        <MapPinned size={16} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-slate-800">
                                            Map picker
                                        </p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            Keep the address simple in the
                                            input, then click on the map to
                                            place the event more precisely.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    icon={<MapPinned size={16} />}
                                    btnText={
                                        mountLocationPicker
                                            ? 'Hide map'
                                            : 'Show map'
                                    }
                                    type={ButtonTypes.SECONDARY}
                                    color="#2457A3"
                                    borderColor="#E2E8F0"
                                    onClick={() =>
                                        setMountLocationPicker(
                                            (value) => !value,
                                        )
                                    }
                                    padding="8px 12px"
                                    className="w-full justify-center sm:w-auto sm:shrink-0"
                                />
                            </div>

                            <div className="mt-4 overflow-hidden rounded-lg border border-slate-100 bg-white">
                                {mountLocationPicker ? (
                                    <ChunkLoadBoundary>
                                        <Suspense
                                            fallback={
                                                <div className="flex h-[280px] w-full animate-pulse items-center justify-center bg-slate-100 md:h-[340px]" />
                                            }
                                        >
                                            <EventMapPicker
                                                onLocationChange={
                                                    handleLocationChange
                                                }
                                                savedLocation={
                                                    debouncedLocation
                                                }
                                                showInput={false}
                                                containerClassName="h-[280px] w-full md:h-[340px]"
                                            />
                                        </Suspense>
                                    </ChunkLoadBoundary>
                                ) : (
                                    <div className="flex min-h-[120px] w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),_transparent_55%),linear-gradient(135deg,_rgba(248,250,252,1),_rgba(241,245,249,0.9))] px-6 py-6 text-center">
                                        <div className="rounded-full bg-white p-3 text-slate-500 shadow-sm ring-1 ring-slate-200">
                                            <MapPinned size={18} />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <p className="text-sm font-semibold text-slate-800">
                                                Map picker is optional
                                            </p>
                                            <p className="mx-auto w-full max-w-full break-words text-xs leading-5 text-slate-500 sm:max-w-md">
                                                Type the location directly, or
                                                open the map only when you need
                                                precise placement.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="space-y-4 rounded-lg border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Organization
                        </h3>
                        <Selecter
                            width="100%"
                            value={editingEvent ? editType : event.type}
                            onChange={(newValue) => {
                                editingEvent
                                    ? setEditType(
                                          Array.isArray(newValue)
                                              ? newValue[0]
                                              : newValue,
                                      )
                                    : handleChange({
                                          target: {
                                              name: 'type',
                                              value: Array.isArray(newValue)
                                                  ? newValue[0]
                                                  : newValue,
                                          },
                                      } as React.ChangeEvent<HTMLInputElement>)
                            }}
                            options={typesofEvent}
                            multiple={false}
                            name="type"
                            label="Event Type"
                        />
                    </div>

                    {/* Media Card */}
                    <div className="space-y-4 rounded-lg border border-slate-100 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Media
                        </h3>
                        <Dropzone />
                    </div>
                </div>

                <div className="sticky bottom-0 z-10 -mx-5 -mb-5 mt-auto border-t border-slate-100 bg-white/95 p-5 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
                    <Button
                        btnText={
                            editingEvent
                                ? 'Update Event'
                                : isCreating
                                  ? 'Publishing...'
                                  : 'Publish Event'
                        }
                        type={ButtonTypes.PRIMARY}
                        backgroundColor="#2457A3"
                        border="none"
                        width="100%"
                        padding="12px"
                        disabled={isCreating}
                        onClick={editingEvent ? updateEvent : createEvent}
                    />
                </div>
            </div>
        </DrawerComponent>
    )
}
