import React from 'react'
import { X } from 'lucide-react'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Dropzone from '@/Dropzone/Dropzone'
import DrawerComponent from '@/Components/Drawer/Drawer'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { useEvents } from '@/Pages/Events/Context/EventsContext'
import MapComponent from '../Components/GoogleMap/MapPicker'

export default function Forms() {
    const {
        editingEvent,
        editPollQuestion,
        editPollOptions,
        handleOptionChange,
        handleEditOptionChange,
        handleAddOption,
        handleAddEditOption,
        createEvent,
        isCreating,
        updateEvent,
        pollQuestion,
        pollOptions,
        includePollInEdit,
        includesPoll,
        handleChange,
        handleEditChange,
        event,
        typesofEvent,
        editType,
        setEditType,
        handleCloseDrawer,
        drawerOpen,
    } = useEvents()

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

    return (
        <DrawerComponent open={drawerOpen} onClose={handleCloseDrawer}>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold tracking-tight text-slate-800">
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                </h2>
                <div
                    onClick={handleCloseDrawer}
                    className="p-2 rounded-full hover:bg-slate-100 cursor-pointer transition-colors"
                >
                    <X className="text-slate-500 hover:text-slate-800 h-5 w-5" />
                </div>
            </div>

            <div className="flex flex-col gap-6 h-full pb-20">
                {/* General Info Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-sm font-semibold text-slate-800">Event Details</h3>
                    <Input
                        IsUsername
                        label="Event Title"
                        name="title"
                        onChange={editingEvent ? handleEditChange : handleChange}
                        value={editingEvent ? editingEvent.title : event.title}
                        width="100%"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            IsUsername
                            label="Start Date and Time"
                            shrink
                            name="startDate"
                            type="datetime-local"
                            onChange={editingEvent ? handleEditChange : handleChange}
                            value={editingEvent ? (editingEvent.startDate ? editingEvent.startDate.slice(0, 16) : '') : event.startDate}
                            width="100%"
                            min={new Date().toISOString().slice(0, 16)} // Cannot be further in the past than right now
                            max="2030-12-31T23:59" // Prevent typing weird years like 20000
                        />
                        <Input
                            IsUsername
                            label="End Date and Time"
                            shrink
                            name="endDate"
                            type="datetime-local"
                            onChange={editingEvent ? handleEditChange : handleChange}
                            value={editingEvent ? (editingEvent.endDate ? editingEvent.endDate.slice(0, 16) : '') : event.endDate}
                            width="100%"
                            min={event.startDate || new Date().toISOString().slice(0, 16)} // Must be after start date
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
                        onChange={editingEvent ? handleEditChange : handleChange}
                        value={editingEvent ? editingEvent.description : event.description}
                        width="100%"
                    />
                </div>

                {/* Location Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-sm font-semibold text-slate-800">Location</h3>
                    <div className="rounded-xl overflow-hidden border border-slate-100">
                        <MapComponent
                            onLocationChange={handleLocationChange}
                            savedLocation={editingEvent ? editingEvent.location : event.location}
                            showInput={true}
                        />
                    </div>
                </div>

                {/* Organization Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-sm font-semibold text-slate-800">Organization</h3>
                    <Selecter
                        width='100%'
                        value={editingEvent ? editType : event.type}
                        onChange={(newValue) => {
                            editingEvent ? setEditType(Array.isArray(newValue) ? newValue[0] : newValue)
                                :
                                handleChange({ target: { name: 'type', value: Array.isArray(newValue) ? newValue[0] : newValue } } as React.ChangeEvent<HTMLInputElement>)
                        }}
                        options={typesofEvent}
                        multiple={false}
                        name="type"
                        label="Event Type"
                    />
                </div>

                {/* Media Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-300">
                    <h3 className="text-sm font-semibold text-slate-800">Media</h3>
                    <Dropzone />
                </div>

                {/* Poll Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-shadow duration-300">
                    <div className="flex items-center justify-between cursor-pointer group" onClick={() => {
                        const evt = { target: { name: 'includesPoll', checked: !(editingEvent ? includePollInEdit : includesPoll), type: 'checkbox' } }
                        editingEvent ? handleEditChange(evt as any) : handleChange(evt as any)
                    }}>
                        <div className="flex flex-col">
                            <h3 className="text-sm font-semibold text-slate-800 group-hover:text-primary-blue transition-colors">
                                {editingEvent ? 'Include poll in event' : 'Add poll to event'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Allow participants to vote on options</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={editingEvent ? includePollInEdit : includesPoll}
                            onChange={(e) => editingEvent ? handleEditChange(e as any) : handleChange(e as any)}
                            name="includesPoll"
                            className="w-5 h-5 rounded text-primary-blue focus:ring-primary-blue cursor-pointer"
                        />
                    </div>

                    {(editingEvent ? includePollInEdit : includesPoll) && (
                        <div className="mt-5 space-y-4 pt-5 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                            <Input
                                label="Poll Question"
                                name="pollQuestion"
                                IsUsername
                                value={editingEvent ? editPollQuestion : pollQuestion}
                                onChange={editingEvent ? handleEditChange : handleChange}
                                width="100%"
                            />

                            <div className="space-y-3">
                                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Options</h4>
                                {(editingEvent ? editPollOptions : pollOptions).map(
                                    (option, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs font-medium text-slate-500 shrink-0">
                                                {index + 1}
                                            </div>
                                            <Input
                                                IsUsername
                                                label={`Option text`}
                                                name={`option${index + 1}`}
                                                value={option}
                                                onChange={(e) => editingEvent ? handleEditOptionChange(index, e.target.value)
                                                    : handleOptionChange(index, e.target.value)}
                                                width="100%"
                                            />
                                        </div>
                                    ),
                                )}
                            </div>

                            <div className="flex justify-between items-center mt-2">
                                <Button
                                    onClick={editingEvent ? handleAddEditOption : handleAddOption}
                                    btnText="Add new option"
                                    type={ButtonTypes.SECONDARY}
                                    color="#2457A3"
                                    borderColor="#E2E8F0"
                                    disabled={(editingEvent ? editPollOptions : pollOptions).length >= 3}
                                />
                                {(editingEvent ? editPollOptions.length >= 3 : pollOptions.length >= 3) &&
                                    <span className="text-rose-500 text-xs font-medium bg-rose-50 px-2.5 py-1 rounded-md">Max 3 options</span>
                                }
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100" style={{ zIndex: 10 }}>
                <Button
                    btnText={editingEvent ? 'Update Event' : isCreating ? 'Publishing...' : 'Publish Event'}
                    type={ButtonTypes.PRIMARY}
                    backgroundColor="#2457A3"
                    border="none"
                    width="100%"
                    padding="12px"
                    disabled={isCreating}
                    onClick={editingEvent ? updateEvent : createEvent}
                />
            </div>
        </DrawerComponent>
    )
}
