import { useContext } from 'react'
import { UseQueryResult } from '@tanstack/react-query'
import { VacationSchema } from '@/Schemas/Vacations/Vacation.schema'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Input from '@/Components/Input/Index'
import { Textarea } from '@/Components/ui/textarea'
import { VacationContext } from '../../VacationContext'
import { useUpdateVacationForm } from '../../Hook'
import { Vacation } from '../../types'
import { dateFormatter } from '@/Helpers/dateFormater'
import {
    formatVacationType,
    getVacationDurationDays,
    getVacationStatusColor,
} from '../../utils'
import { StatusBadge } from '@/Components/StatusBadge/StatusBadge'

export const UpdateVacationForm: React.FC<{
    data: UseQueryResult<Vacation>
}> = ({ data: vacation }) => {
    const {
        handleCloseVacationModalOpen,
        errors: { updateError: error },
    } = useContext(VacationContext)
    const { form } = useUpdateVacationForm(vacation)

    if (!vacation.data) {
        return null
    }

    const duration = getVacationDurationDays(
        vacation.data.startDate,
        vacation.data.endDate,
    )

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Vacation Review
                </p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {vacation.data.userId?.firstName ?? 'Unknown'}{' '}
                    {vacation.data.userId?.lastName ?? ''}
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                    Review the request note, date range, and approval status in one place.
                </p>
            </div>

            <div className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-3">
                <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Leave Type
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                        {formatVacationType(vacation.data.type)}
                    </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Date Range
                    </p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                        {dateFormatter(vacation.data.startDate)} to{' '}
                        {dateFormatter(vacation.data.endDate)}
                    </p>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Current Status
                    </p>
                    <div className="mt-2">
                        <StatusBadge
                            status={vacation.data.status}
                            color={getVacationStatusColor(vacation.data.status)}
                        />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">
                        {duration} day{duration === 1 ? '' : 's'} requested
                    </p>
                </div>
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Request Note
                </label>
                <Textarea
                    readOnly
                    value={
                        vacation.data.description?.trim() ||
                        'No additional note was provided for this request.'
                    }
                />
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className="grid gap-5 md:grid-cols-2"
            >
                <form.Field
                    name="type"
                    validators={{
                        onChange: VacationSchema.entries.type,
                    }}
                    children={({
                        handleChange,
                        state: {
                            value,
                            meta: { errors },
                        },
                    }) => (
                        <div>
                            <Selecter
                                label="Vacation Type"
                                name="Vacation Type"
                                multiple={false}
                                options={[
                                    'vacation',
                                    'sick',
                                    'personal',
                                    'maternity',
                                ]}
                                value={value}
                                onChange={(newValue) => handleChange(newValue)}
                            />
                            {errors && <ErrorText>{errors}</ErrorText>}
                        </div>
                    )}
                />

                <form.Field
                    name="status"
                    validators={{
                        onChange: VacationSchema.entries.status,
                    }}
                    children={({
                        handleChange,
                        state: {
                            value,
                            meta: { errors },
                        },
                    }) => (
                        <div>
                            <Selecter
                                label="Vacation Status"
                                name="Vacation Status"
                                multiple={false}
                                options={[
                                    'pending',
                                    'accepted',
                                    'rejected',
                                ]}
                                value={value}
                                onChange={(newValue) => handleChange(newValue)}
                            />
                            {errors && <ErrorText>{errors}</ErrorText>}
                        </div>
                    )}
                />

                <form.Field
                    name="startDate"
                    validators={{
                        onChange: VacationSchema.entries.startDate,
                    }}
                    children={({
                        handleChange,
                        state: {
                            value,
                            meta: { errors },
                        },
                    }) => (
                        <div>
                            <Input
                                IsUsername
                                name="Start Date"
                                label="Start Date"
                                type="date"
                                placeholder="Start Date"
                                shrink
                                value={value}
                                onChange={(e) =>
                                    handleChange(e.target.value)
                                }
                            />
                            {errors && <ErrorText>{errors}</ErrorText>}
                        </div>
                    )}
                />

                <form.Field
                    name="endDate"
                    validators={{
                        onChange: VacationSchema.entries.endDate,
                    }}
                    children={({
                        handleChange,
                        state: {
                            value,
                            meta: { errors },
                        },
                    }) => (
                        <div>
                            <Input
                                IsUsername
                                name="End Date"
                                label="End Date"
                                type="date"
                                placeholder="End Date"
                                shrink
                                value={value}
                                onChange={(e) =>
                                    handleChange(e.target.value)
                                }
                            />
                            {errors && <ErrorText>{errors}</ErrorText>}
                        </div>
                    )}
                />

                <div className="flex flex-col-reverse gap-3 pt-2 md:col-span-2 md:flex-row md:justify-end">
                    <Button
                        type={ButtonTypes.SECONDARY}
                        btnText="Cancel"
                        onClick={handleCloseVacationModalOpen}
                    />
                    <Button
                        type={ButtonTypes.PRIMARY}
                        btnText={
                            form.state.isSubmitting
                                ? 'Saving...'
                                : 'Save changes'
                        }
                        disabled={form.state.isSubmitting}
                        isSubmit
                    />
                </div>

                {error && (
                    <div className="md:col-span-2">
                        <ErrorText>{error}</ErrorText>
                    </div>
                )}
            </form>
        </div>
    )
}
