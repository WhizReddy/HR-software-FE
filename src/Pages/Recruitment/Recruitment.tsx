import MyButton from '../../Components/Button/Button'
import { ButtonTypes } from '../../Components/Button/ButtonTypes'
import Input from '../../Components/Input/Index'

import image from '/Images/Vector-illustration-of-communication-Graphics-69695603-1-removebg-preview.png'
import Card from '../../Components/Card/Card'
import { UploadCloud } from 'lucide-react'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { useContext } from 'react'
import Toast from '@/Components/Toast/Toast'
import { ValidationError } from '@tanstack/react-form'
import Selecter from '@/Components/Input/components/Select/Selecter'
import style from './style/Recruitment.module.css'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import {
    experience,
    foundMethod,
    technologies,
} from './Component/RecruitmentData'
import {
    RecruitmentContext,
    RecruitmentProvider,
} from './Context/RecruitmentContext'
import { useRecruitmentForm } from './Hook'
import { RecruitmentSchema } from '@/Schemas/Recruitment/Recruitment.schema'

function RecruitmentBase() {
    const {
        error,
        showModal,
        setShowModal,
        fileInputRef,
        fileName,
        setFileName,
    } = useContext(RecruitmentContext)
    const { form } = useRecruitmentForm()
    return (
        <main className={style.background}>
            <Card
                gap="20px"
                padding="30px"
                borderRadius=".8rem"
                className={style.cardContainer}
            >
                <div className={style.header}>
                    <h2 className="text-2xl font-bold text-center w-full">Apply to CRM</h2>
                    <div className={style.title}>Apply to CRM</div>
                </div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        form.handleSubmit()
                    }}
                >
                    <form.Field
                        name="firstName"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.firstName,
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
                                    label="First Name"
                                    name="firstName"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />

                    <form.Field
                        name="lastName"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.lastName,
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
                                    label="Last Name"
                                    name="lastName"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />
                    <form.Field
                        name="email"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.email,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Input
                                    label="Email"
                                    name="Email"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />

                    <form.Field
                        name="dob"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.dob,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Input
                                    label="Date of birth"
                                    name="dob"
                                    IsUsername
                                    type="date"
                                    shrink={true}
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />
                    <form.Field
                        name="phoneNumber"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.phoneNumber,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Input
                                    icon={
                                        <p className={style.numberPrefix}>
                                            +355
                                        </p>
                                    }
                                    iconPosition="start"
                                    label="Phone Number"
                                    name="phoneNumber"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />

                    <form.Field
                        name="applicationMethod"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange:
                                RecruitmentSchema.entries.applicationMethod,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Selecter
                                    width='100%'

                                    label="Applying Method"
                                    name="applicationMethod"
                                    multiple={false}
                                    options={foundMethod}
                                    value={value}
                                    onChange={(newValue) =>
                                        handleChange(newValue as string)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />

                    <form.Field
                        name="positionApplied"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.positionApplied,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Input
                                    label="Work position"
                                    name="positionApplied"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />

                    <form.Field
                        name="salaryExpectations"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange:
                                RecruitmentSchema.entries.salaryExpectations,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div>
                                <Input
                                    label="Wage expectation"
                                    name="salaryExpectations"
                                    IsUsername
                                    value={value}
                                    onChange={(e: any) =>
                                        handleChange(e.target.value)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />
                    <form.Field
                        name="experience"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange: RecruitmentSchema.entries.experience,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div className={style.spanTwoDiv}>
                                <Selecter
                                    width='100%'
                                    multiple={false}
                                    label="Experience"
                                    name="experience"
                                    options={experience}
                                    value={value as string}
                                    onChange={(newValue) =>
                                        handleChange(newValue as string)
                                    }
                                />
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />
                    <form.Field
                        name="technologiesUsed"
                        validatorAdapter={valibotValidator()}
                        validators={{
                            onChange:
                                RecruitmentSchema.entries.technologiesUsed,
                        }}
                        children={({
                            state: {
                                value,
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div className={style.spanTwoDiv}>
                                <Selecter
                                    width='100%'

                                    options={technologies}
                                    multiple
                                    label="Technologies"
                                    name="technologiesUsed"
                                    onChange={(newValue) =>
                                        handleChange(newValue as [])
                                    }
                                    value={value}
                                />
                                <ErrorRenderer errors={errors} />
                            </div>
                        )}
                    />

                    <form.Field
                        name="file"
                        validators={{
                            onChange: ({ value }) => {
                                if (!value) {
                                    return 'File is required'
                                }
                                const name = value[0]?.name
                                if (!name) {
                                    return 'File cannot be null'
                                }
                                if (!name.match(/\.(pdf|docx|doc)$/i)) {
                                    return 'Please select a valid PDF, DOCX, or DOC file'
                                }
                            },
                        }}
                        children={({
                            state: {
                                meta: { errors },
                            },
                            handleChange,
                        }) => (
                            <div className={style.fileInput}>
                                <p>{fileName || 'No file selected'}</p>
                                <label className="flex items-center justify-center gap-2 cursor-pointer w-full py-2 px-4 rounded-md text-white font-medium" style={{ backgroundColor: '#2469FF', fontFamily: 'Outfit, sans-serif' }}>
                                    <UploadCloud size={20} />
                                    Upload CV
                                    <input
                                        type="file"
                                        className="hidden"
                                        onChange={(e: any) => {
                                            const file =
                                                e.target.files?.[0] || null
                                            setFileName(file?.name || null)
                                            handleChange(e.target.files)
                                        }}
                                        accept=".pdf,.doc,.docx"
                                        ref={fileInputRef}
                                    />
                                </label>
                                {<ErrorRenderer errors={errors} />}
                            </div>
                        )}
                    />
                    <MyButton
                        type={ButtonTypes.SECONDARY}
                        btnText="Reset"
                        width="100%"
                        onClick={() => {
                            console.log('Resetting form')
                            form.reset()
                            setFileName(null)
                        }}
                    />
                    <MyButton
                        type={ButtonTypes.TERTIARY}
                        // width='70px'
                        btnText={
                            form.state.isSubmitting ? 'Submitting...' : 'Submit'
                        }
                        disabled={form.state.isSubmitting}
                        isSubmit
                    />
                </form>
                {error && <ErrorText>{error}</ErrorText>}
            </Card>
            <img alt="image" src={image} className={style.illustration} />

            <Toast
                message="Please check your inbox or spam to confirm your identity."
                onClose={() => setShowModal(false)}
                open={showModal}
                severity={'success'}
            />
        </main>
    )
}

export default function Recruitment() {
    return (
        <RecruitmentProvider>
            <RecruitmentBase />
        </RecruitmentProvider>
    )
}

const ErrorRenderer: React.FC<{ errors: ValidationError[] | null }> = ({
    errors,
}) => {
    return (
        <>
            {errors && errors.length > 0 ? (
                <ErrorText>{errors.map((error) => error).join(', ')}</ErrorText>
            ) : null}
        </>
    )
}
