import { VacationContext } from '../../VacationContext'
import { useContext } from 'react'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import style from '../../style/vacationForm.module.scss'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Input from '@/Components/Input/Index'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { CreateVacationSchema } from '@/Schemas/Vacations/CreateVacation.schema'
import { useCreateVacationForm } from '../../Hook'

export const CreateVacationForm = () => {
    const {
        searchParams,
        createVacationToggler,
        errors: { createError: error },
    } = useContext(VacationContext)

    const { form } = useCreateVacationForm()

    return searchParams.get('createVacation') !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-[33vw] relative max-h-[90vh] overflow-y-auto">
                <h3 className={style.fullName}>Vacation Request</h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                    className={style.formContainer}
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

                    <form.Field
                        name="description"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange:
                                CreateVacationSchema.entries.description,
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
                                    name="Description"
                                    label="Description"
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

                    <div className={style.buttonsContainer}>
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
                        <Button
                            type={ButtonTypes.SECONDARY}
                            btnText="Cancel"
                            onClick={createVacationToggler}
                        />
                    </div>
                    {error && <ErrorText>{error}</ErrorText>}
                </form>
            </div>
        </div>
    ) : null
}
