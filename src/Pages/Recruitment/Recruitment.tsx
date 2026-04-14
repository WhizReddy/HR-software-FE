import MyButton from '../../Components/Button/Button'
import { ButtonTypes } from '../../Components/Button/ButtonTypes'
import Input from '../../Components/Input/Index'

import image from '/Images/Vector-illustration-of-communication-Graphics-69695603-1-removebg-preview.png'
import { UploadCloud } from 'lucide-react'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { useContext } from 'react'
import Toast from '@/Components/Toast/Toast'
import { ValidationError } from '@tanstack/react-form'
import Selecter from '@/Components/Input/components/Select/Selecter'
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
        <main className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Left Panel - Branding Split */}
            <div className="hidden md:flex flex-col flex-1 bg-gradient-to-br from-[#1a407a] to-[#2457a3] p-12 relative overflow-hidden text-white justify-center">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400 opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                <div className="relative z-10 max-w-xl mx-auto xl:mx-0">
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Transform Your Career at <span className="text-blue-200">CRM</span>
                    </h1>
                    <p className="text-lg lg:text-xl text-blue-100 font-medium mb-12 leading-relaxed opacity-90">
                        Join our innovative team building the next generation of HR Management platforms. Unleash your potential and shape the future of work.
                    </p>
                    <img alt="Team Collaboration" src={image} className="w-full max-w-lg object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
                </div>
            </div>

            {/* Right Panel - Form Container */}
            <div className="flex-1 w-full bg-slate-50/50 backdrop-blur-3xl flex items-start justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
                <div className="absolute inset-0 z-0 bg-grid-slate-200/[0.04] bg-[bottom_1px_center] pointer-events-none"></div>
                <div className="flex-1 w-full max-w-2xl bg-white/80 backdrop-blur-xl md:rounded-[2rem] shadow-2xl border border-white p-8 md:p-12 relative z-10 my-auto">
                    <div className="mb-8">
                        <h2 className="text-3xl font-extrabold text-[#2457a3] tracking-tight">Join Our Team</h2>
                        <p className="text-slate-500 mt-2">Take the next step in your career with CRM.</p>
                        <p className="mt-3 rounded-xl bg-blue-50 px-4 py-3 text-sm text-slate-600">
                            Use an email address that is not already tied to an existing employee login.
                            If you are testing with Gmail, a plus alias like
                            {' '}
                            <code className="font-semibold text-slate-800">yourname+candidate@gmail.com</code>
                            {' '}
                            still lands in the same inbox.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            form.handleSubmit()
                        }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    <div className="space-y-1">
                                        <Input
                                            label="First Name"
                                            name="firstName"
                                            IsUsername
                                            value={value}
                                            onChange={(e: any) =>
                                                handleChange(e.target.value)
                                            }
                                            width="100%"
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
                                    <div className="space-y-1">
                                        <Input
                                            label="Last Name"
                                            name="lastName"
                                            IsUsername
                                            value={value}
                                            onChange={(e: any) =>
                                                handleChange(e.target.value)
                                            }
                                            width="100%"
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
                                    <div className="space-y-1 md:col-span-2">
                                        <Input
                                            label="Email"
                                            name="Email"
                                            IsUsername
                                            value={value}
                                            onChange={(e: any) =>
                                                handleChange(e.target.value)
                                            }
                                            width="100%"
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
                                    <div className="space-y-1">
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
                                            width="100%"
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
                                    <div className="space-y-1">
                                        <Input
                                            icon={
                                                <p className="text-slate-500 font-medium pr-2 border-r border-slate-200 mr-2">
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
                                            width="100%"
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
                                    <div className="space-y-1 md:col-span-2">
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
                                    <div className="space-y-1">
                                        <Input
                                            label="Work position"
                                            name="positionApplied"
                                            IsUsername
                                            value={value}
                                            onChange={(e: any) =>
                                                handleChange(e.target.value)
                                            }
                                            width="100%"
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
                                    <div className="space-y-1">
                                        <Input
                                            label="Wage expectation"
                                            name="salaryExpectations"
                                            IsUsername
                                            value={value}
                                            onChange={(e: any) =>
                                                handleChange(e.target.value)
                                            }
                                            width="100%"
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
                                    <div className="space-y-1 md:col-span-2">
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
                                    <div className="space-y-1 md:col-span-2">
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
                                    <div className="space-y-1 md:col-span-2 pt-2">
                                        <label className="flex flex-col items-center justify-center gap-3 cursor-pointer w-full py-6 px-4 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#2457a3] bg-slate-50 hover:bg-blue-50/50 transition-all group">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#2457a3] group-hover:scale-110 transition-transform">
                                                <UploadCloud size={24} />
                                            </div>
                                            <div className="text-center">
                                                <p className="font-semibold text-slate-700">Upload your CV</p>
                                                <p className="text-xs text-slate-500 mt-1 max-w-[200px] truncate">{fileName || 'PDF, DOCX up to 10MB'}</p>
                                            </div>
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

                        </div>

                        <div className="pt-6 grid grid-cols-2 gap-4">
                            <MyButton
                                type={ButtonTypes.SECONDARY}
                                btnText="Reset"
                                width="100%"
                                onClick={() => {
                                    form.reset()
                                    setFileName(null)
                                }}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-all shadow-sm active:scale-95 py-3 rounded-xl font-bold"
                            />
                            <MyButton
                                type={ButtonTypes.PRIMARY}
                                btnText={
                                    form.state.isSubmitting ? 'Sending...' : 'Apply Now'
                                }
                                disabled={form.state.isSubmitting}
                                isSubmit
                                width="100%"
                                className="bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md hover:shadow-lg active:scale-95 py-3 rounded-xl font-bold"
                            />
                        </div>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50/80 backdrop-blur-md border border-red-200 rounded-xl shadow-sm">
                            <ErrorText>{error}</ErrorText>
                        </div>
                    )}
                </div>
            </div>

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
