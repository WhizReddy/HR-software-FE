import { useContext } from 'react'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import { VacationContext } from '../../VacationContext'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { ModalComponent } from '@/Components/Modal/Modal'
import { Textarea } from '@/Components/ui/textarea'
import { CreateVacationSchema } from '@/Schemas/Vacations/CreateVacation.schema'
import { useCreateVacationForm } from '../../Hook'

export const CreateVacationForm = () => {
    const {
        searchParams,
        createVacationToggler,
        errors: { createError: error },
    } = useContext(VacationContext)
    const { form } = useCreateVacationForm()

    if (searchParams.get('createVacation') === null) {
        return null
    }

    return (
        <ModalComponent
            open
            handleClose={createVacationToggler}
            width="720px"
        >
            <div className="space-y-6">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Vacation Request
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-slate-900">
                        Submit a new leave request
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        Add the leave type, the date range, and any short note your manager should see.
                    </p>
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
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: CreateVacationSchema.entries.type,
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
                                    onChange={(
                                        newValue:
                                            | 'vacation'
                                            | 'sick'
                                            | 'personal'
                                            | 'maternity',
                                    ) => handleChange(newValue)}
                                />
                                {errors && <ErrorText>{errors}</ErrorText>}
                            </div>
                        )}
                    />

                    <div className="grid gap-5 md:col-span-1">
                        <form.Field
                            name="startDate"
                            validatorAdapter={valibotValidator()}
                            validators={{
                                onChange:
                                    CreateVacationSchema.entries.startDate,
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
                            validatorAdapter={valibotValidator()}
                            validators={{
                                onChange: CreateVacationSchema.entries.endDate,
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
                    </div>

                    <form.Field
                        name="description"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: CreateVacationSchema.entries.description,
                        }}
                        children={({
                            handleChange,
                            state: {
                                value,
                                meta: { errors },
                            },
                        }) => (
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Request Note
                                </label>
                                <Textarea
                                    value={value}
                                    onChange={(e) =>
                                        handleChange(e.target.value)
                                    }
                                    placeholder="Optional note for coverage, context, or any special detail."
                                />
                                {errors && <ErrorText>{errors}</ErrorText>}
                            </div>
                        )}
                    />

                    <div className="flex flex-col-reverse gap-3 pt-2 md:col-span-2 md:flex-row md:justify-end">
                        <Button
                            type={ButtonTypes.SECONDARY}
                            btnText="Cancel"
                            onClick={createVacationToggler}
                        />
                        <Button
                            type={ButtonTypes.PRIMARY}
                            btnText={
                                form.state.isSubmitting
                                    ? 'Sending request...'
                                    : 'Request vacation'
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
        </ModalComponent>
    )
}
