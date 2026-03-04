import React from 'react'
import { X } from 'lucide-react'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Dropzone from '@/Dropzone/Dropzone'
import DrawerComponent from '@/Components/Drawer/Drawer'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { useEvents } from '../Context/EventsContext'
import style from '../styles/Events.module.css'
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
        updateEvent,
        pollQuestion,
        pollOptions,
        includePollInEdit,
        includesPoll,
        handleChange,
        handleEditChange,
        event,
        setParticipants,
        participants,
        allEmails,
        typesofEvent,
        editParticipants,
        setEditParticipants,
        editType,
        setEditType,
        endDate,
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
        <div>
            <DrawerComponent open={drawerOpen} onClose={handleCloseDrawer}>
                <div className={style.create}>
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                    <X
                        onClick={handleCloseDrawer}
                        className="cursor-pointer text-slate-500 hover:text-slate-800"
                    />
                </div>

                <Input
                    IsUsername
                    label="Event Title"
                    name="title"
                    onChange={editingEvent ? handleEditChange : handleChange}
                    value={editingEvent ? editingEvent.title : event.title}
                />
                <div style={{ display: 'flex', width: '100%', gap: 15 }}>
                    <Input
                        IsUsername
                        label="Start Date and Time"
                        shrink
                        name="startDate"
                        type="datetime-local"
                        onChange={editingEvent ? handleEditChange : handleChange}
                        value={editingEvent ? editingEvent.startDate.slice(0, 16) : event.startDate}
                        width={178}
                    />
                    <Input
                        IsUsername
                        label="End Date and Time"
                        shrink
                        name="endDate"
                        type="datetime-local"
                        width={173}
                        onChange={editingEvent ? handleEditChange : handleChange}
                        value={editingEvent ? editingEvent.endDate.slice(0, 16) : event.endDate
                        }
                    />
                </div>
                <MapComponent
                    onLocationChange={handleLocationChange}
                    savedLocation={editingEvent ? editingEvent.location : event.location}
                    showInput={true}
                />
                <Input
                    IsUsername
                    label="Description"
                    type="textarea"
                    name="description"
                    multiline
                    rows={4}
                    onChange={editingEvent ? handleEditChange : handleChange}
                    value={editingEvent ? editingEvent.description : event.description}
                />
                <Selecter
                    width='100%'
                    value={editingEvent ? editParticipants : participants}
                    onChange={(newValue) => {
                        editingEvent ? setEditParticipants(Array.isArray(newValue) ? newValue : [newValue])
                            : setParticipants(Array.isArray(newValue) ? newValue : [newValue])
                    }}
                    options={allEmails}
                    multiple
                    name="participants"
                    label="Participants"
                />
                <Selecter
                    width='100%'
                    value={editingEvent ? editType : event.type}
                    onChange={(newValue) => {
                        editingEvent ? setEditType(Array.isArray(newValue) ? newValue[0] : newValue)
                            :
                            handleChange({ target: { name: 'type', value: Array.isArray(newValue) ? newValue[0] : newValue } } as React.ChangeEvent<HTMLInputElement>)
                    }
                    }
                    options={typesofEvent}
                    multiple={false}
                    name="type"
                    label="Event Type"
                />
                <div> Add Event Images</div>
                <Dropzone />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        checked={editingEvent ? includePollInEdit : includesPoll}
                        onChange={(e) => editingEvent ? handleEditChange(e as any) : handleChange(e as any)}
                        name="includesPoll"
                        className="w-5 h-5 accent-primary-blue cursor-pointer"
                    />
                    <div>
                        {editingEvent ? 'Include poll in event' : 'Add poll to event'}
                    </div>
                </div>
                {(editingEvent ? includePollInEdit : includesPoll) && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <Input
                            label="Poll Question"
                            name="pollQuestion"
                            IsUsername
                            value={editingEvent ? editPollQuestion : pollQuestion}
                            onChange={editingEvent ? handleEditChange : handleChange}
                        />
                        <>Options</>
                        {(editingEvent ? editPollOptions : pollOptions).map(
                            (option, index) => (
                                <Input key={index} IsUsername label={`Option ${index + 1}`} name={`option${index + 1}`} value={option}
                                    onChange={(e) => editingEvent ? handleEditOptionChange(index, e.target.value)
                                        : handleOptionChange(index, e.target.value)}
                                />
                            ),
                        )}
                        <Button
                            onClick={editingEvent ? handleAddEditOption : handleAddOption}
                            btnText="Add new option"
                            type={ButtonTypes.SECONDARY}
                            color="#2469FF"
                            borderColor="#2469FF"
                            disabled={(editingEvent ? editPollOptions : pollOptions).length >= 3}
                        />
                        {editingEvent ? editPollOptions : pollOptions.length >= 3 &&
                            <div style={{ color: 'red', fontSize: '14px' }}> Maximum of 3 options allowed.</div>}
                    </div>
                )}
                <div className={style.border}></div>
                <Button
                    btnText={editingEvent ? 'Update' : 'Save event'}
                    type={ButtonTypes.PRIMARY}
                    backgroundColor="#2469FF"
                    border="none"
                    onClick={editingEvent ? updateEvent : createEvent}
                />
            </DrawerComponent>
        </div>
    )
}