import { VacationSchema } from '@/Schemas/Vacations/Vacation.schema'
import { UseQueryResult } from '@tanstack/react-query'
// import { Controller, SubmitHandler, useForm } from 'react-hook-form'
// import { valibotResolver } from '@hookform/resolvers/valibot'
import dayjs from 'dayjs'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import { useUpdateVacation } from '../../Hook'
import { useContext, useState } from 'react'
import { VacationContext } from '../../VacationContext'
import { AxiosError } from 'axios'
import Selecter from '@/Components/Input/components/Select/Selecter'
import Input from '@/Components/Input/Index'
import style from '../../style/vacationForm.module.scss'
import { useForm } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'

type MyComponentProps = {
    data: UseQueryResult<any, Error>
}

export const VacationForm: React.FC<MyComponentProps> = ({
    data: vacation,
}) => {
    const [error, setError] = useState<string | null>(null)
    const { handleCloseVacationModalOpen, setToastConfigs } =
        useContext(VacationContext)
    const updater = useUpdateVacation()

    const form = useForm({
        defaultValues: {
            status: vacation.data.status,
            type: vacation.data.type,
            startDate: dayjs(vacation.data.startDate).format('YYYY-MM-DD'),
            endDate: dayjs(vacation.data.endDate).format('YYYY-MM-DD'),
        },
        validatorAdapter: valibotValidator(),
        onSubmit: async ({ value }) => {
            console.log(value)

            value.endDate = dayjs(value.endDate).toISOString()
            value.startDate = dayjs(value.startDate).toISOString()
            updater.mutate({ vacation: value })
            if (updater.isError) {
                setToastConfigs({
                    isOpen: true,
                    message:
                        updater.error?.message || 'Failed to update vacation',
                    severity: 'error',
                })
                if (updater.error instanceof AxiosError)
                    setError(updater.error.response?.data)
                else {
                    setError('something happened')
                }
            } else {
                setToastConfigs({
                    isOpen: true,
                    message: 'Vacation updated successfully',
                    severity: 'success',
                })
                handleCloseVacationModalOpen()
            }
        },
    })
    return (
        <>
            <h3 className={style.fullName}>
                {vacation.data.userId?.firstName ?? 'Unknown'} {vacation.data.userId?.lastName ?? ''}
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
                            width='100%'
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
                            width='100%'
                                label="Vacation Status"
                                name="Vacation Status"
                                multiple={false}
                                options={['pending', 'accepted', 'rejected']}
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
                                onChange={(e) => handleChange(e.target.value)}
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
                                onChange={(e) => handleChange(e.target.value)}
                            />
                            {errors && <ErrorText>{errors}</ErrorText>}
                        </div>
                    )}
                />

                <div className={style.buttonsContainer}>
                    <Button
                        type={ButtonTypes.PRIMARY}
                        btnText={`${form.state.isSubmitting ? 'Submitting' : 'Submit'}`}
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
}
