import { VacationSchema } from '@/Schemas/Vacations/Vacation.schema'
import { UseQueryResult } from '@tanstack/react-query'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { useUpdateVacationForm } from '../../Hook'
import { useContext } from 'react'
import { VacationContext } from '../../VacationContext'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Input from '@/Components/Input/Index'
import { Vacation } from '../../types'
import style from '../../style/vacationForm.module.scss'

export const UpdateVacationForm: React.FC<{
    data: UseQueryResult<Vacation>
}> = ({ data: vacation }) => {
    const {
        handleCloseVacationModalOpen,
        errors: { updateError: error },
    } = useContext(VacationContext)

    const { form } = useUpdateVacationForm(vacation)

    return (
        vacation.data && (
            <>
                <h3 className={style.fullName}>
                    {vacation.data.userId?.firstName ?? 'Unknown'}{' '}
                    {vacation.data.userId?.lastName ?? ''}
                </h3>
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
                                    onChange={(newValue) =>
                                        handleChange(newValue)
                                    }
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
                                    onChange={(newValue) =>
                                        handleChange(newValue)
                                    }
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

                    <div className={style.buttonsContainer}>
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
                        <Button
                            type={ButtonTypes.SECONDARY}
                            btnText="Cancel"
                            onClick={handleCloseVacationModalOpen}
                        />
                    </div>
                    {error && <ErrorText>{error}</ErrorText>}
                </form>
            </>
        )
    )
}
