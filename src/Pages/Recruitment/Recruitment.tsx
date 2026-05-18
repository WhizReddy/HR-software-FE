import { useContext, type ReactNode } from 'react'
import {
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    Mail,
    Phone,
    RotateCcw,
    Send,
    UploadCloud,
} from 'lucide-react'
import { ValidationError } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import MyButton from '../../Components/Button/Button'
import { ButtonTypes } from '../../Components/Button/ButtonTypes'
import Input from '../../Components/Input/Index'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import Toast from '@/Components/Toast/Toast'
import Selecter from '@/Components/Input/components/Select/Selecter'
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
import image from '/Images/Vector-illustration-of-communication-Graphics-69695603-1-removebg-preview.png'

function RecruitmentBase() {
    const {
        error,
        setError,
        showModal,
        setShowModal,
        fileInputRef,
        fileName,
        setFileName,
    } = useContext(RecruitmentContext)
    const { form } = useRecruitmentForm()

    const resetForm = () => {
        form.reset()
        setError(null)
        setFileName(null)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleSuccessClose = () => {
        setShowModal(false)
        resetForm()
    }

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.12fr)] lg:px-8 lg:py-8">
                <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-[#2457a3] text-white shadow-sm">
                        <div className="p-6 sm:p-7">
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-100">
                                Careers
                            </p>
                            <h1 className="mt-3 max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                                Apply to join the CRM team
                            </h1>
                            <p className="mt-4 max-w-xl text-sm leading-6 text-blue-50 sm:text-base">
                                Send your details once, attach your CV, and our
                                hiring team will review your application from
                                the recruitment dashboard.
                            </p>
                        </div>
                        <div className="border-t border-white/15 bg-white/10 px-6 pt-3 sm:px-7">
                            <img
                                alt="Team collaboration"
                                src={image}
                                className="mx-auto h-52 w-full max-w-md object-contain sm:h-64"
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        <InfoCard
                            icon={<FileText size={18} />}
                            title="CV required"
                            text="PDF, DOC, or DOCX up to 10MB."
                        />
                        <InfoCard
                            icon={<Clock3 size={18} />}
                            title="Review flow"
                            text="Confirmed applications move into candidate review."
                        />
                        <InfoCard
                            icon={<CheckCircle2 size={18} />}
                            title="Email check"
                            text="Use an email not already tied to an employee login."
                        />
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            Contact Fields
                        </p>
                        <div className="mt-4 grid gap-3">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <Mail size={16} className="text-[#2457a3]" />
                                <span className="text-sm font-semibold text-slate-700">
                                    Email confirmation enabled
                                </span>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <Phone size={16} className="text-[#2457a3]" />
                                <span className="text-sm font-semibold text-slate-700">
                                    Albania mobile format
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                                Application Form
                            </p>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">
                                Candidate Details
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Complete the required profile, role, and CV
                                fields so the hiring team can process your
                                application correctly.
                            </p>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2457a3]">
                            <BriefcaseBusiness size={15} />
                            CRM Hiring
                        </div>
                    </div>

                    <form
                        onSubmit={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            setError(null)
                            form.handleSubmit()
                        }}
                        className="mt-6 space-y-8"
                    >
                        <FormSection
                            title="Personal Information"
                            description="Basic identity and contact details."
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <form.Field
                                    name="firstName"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries.firstName,
                                    }}
                                    children={({
                                        handleChange,
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="First Name"
                                                name="firstName"
                                                IsUsername
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="lastName"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries.lastName,
                                    }}
                                    children={({
                                        handleChange,
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="Last Name"
                                                name="lastName"
                                                IsUsername
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="email"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries.email,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="Email"
                                                name="email"
                                                IsUsername
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="phoneNumber"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries
                                                .phoneNumber,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                icon={
                                                    <span className="border-r border-slate-200 pr-2 text-sm font-bold text-slate-500">
                                                        +355
                                                    </span>
                                                }
                                                iconPosition="start"
                                                label="Phone Number"
                                                name="phoneNumber"
                                                IsUsername
                                                value={value}
                                                inputClassName="pl-16"
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
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
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="Date of birth"
                                                name="dob"
                                                IsUsername
                                                type="date"
                                                shrink
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="applicationMethod"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries
                                                .applicationMethod,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Selecter
                                                width="100%"
                                                label="Applying Method"
                                                name="applicationMethod"
                                                multiple={false}
                                                options={foundMethod}
                                                value={value}
                                                placeholder="Select source"
                                                onChange={(newValue) =>
                                                    handleChange(
                                                        newValue as string,
                                                    )
                                                }
                                            />
                                        </FieldFrame>
                                    )}
                                />
                            </div>
                        </FormSection>

                        <FormSection
                            title="Role Information"
                            description="Position, experience, and technical background."
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <form.Field
                                    name="positionApplied"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries
                                                .positionApplied,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="Work position"
                                                name="positionApplied"
                                                IsUsername
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="salaryExpectations"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries
                                                .salaryExpectations,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Input
                                                label="Wage expectation"
                                                name="salaryExpectations"
                                                IsUsername
                                                value={value}
                                                onChange={(event: any) =>
                                                    handleChange(
                                                        event.target.value,
                                                    )
                                                }
                                                width="100%"
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="experience"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries.experience,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Selecter
                                                width="100%"
                                                multiple={false}
                                                label="Experience"
                                                name="experience"
                                                options={experience}
                                                value={value as string}
                                                placeholder="Select experience"
                                                onChange={(newValue) =>
                                                    handleChange(
                                                        newValue as string,
                                                    )
                                                }
                                            />
                                        </FieldFrame>
                                    )}
                                />

                                <form.Field
                                    name="technologiesUsed"
                                    validatorAdapter={valibotValidator()}
                                    validators={{
                                        onChange:
                                            RecruitmentSchema.entries
                                                .technologiesUsed,
                                    }}
                                    children={({
                                        state: {
                                            value,
                                            meta: { errors },
                                        },
                                        handleChange,
                                    }) => (
                                        <FieldFrame errors={errors}>
                                            <Selecter
                                                width="100%"
                                                options={technologies}
                                                multiple
                                                label="Technologies"
                                                name="technologiesUsed"
                                                onChange={(newValue) =>
                                                    handleChange(
                                                        newValue as string[],
                                                    )
                                                }
                                                value={value}
                                            />
                                        </FieldFrame>
                                    )}
                                />
                            </div>
                        </FormSection>

                        <FormSection
                            title="CV Attachment"
                            description="Attach the document the hiring team should review."
                        >
                            <form.Field
                                name="file"
                                validators={{
                                    onChange: ({ value }) => {
                                        if (!value) {
                                            return 'File is required'
                                        }
                                        const selectedFile = value[0]
                                        if (!selectedFile?.name) {
                                            return 'File cannot be null'
                                        }
                                        if (
                                            !selectedFile.name.match(
                                                /\.(pdf|docx|doc)$/i,
                                            )
                                        ) {
                                            return 'Please select a valid PDF, DOCX, or DOC file'
                                        }
                                        if (selectedFile.size > 10 * 1024 * 1024) {
                                            return 'File must be 10MB or smaller'
                                        }
                                    },
                                }}
                                children={({
                                    state: {
                                        meta: { errors },
                                    },
                                    handleChange,
                                }) => (
                                    <FieldFrame errors={errors}>
                                        <label className="flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-[#2457a3] hover:bg-blue-50/60">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#2457a3] shadow-sm ring-1 ring-slate-200">
                                                <UploadCloud size={22} />
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                Upload your CV
                                            </span>
                                            <span className="max-w-full truncate text-sm font-medium text-slate-500">
                                                {fileName ||
                                                    'PDF, DOC, or DOCX up to 10MB'}
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(event: any) => {
                                                    const selectedFile =
                                                        event.target.files?.[0] ||
                                                        null
                                                    setFileName(
                                                        selectedFile?.name ||
                                                            null,
                                                    )
                                                    handleChange(
                                                        event.target.files,
                                                    )
                                                }}
                                                accept=".pdf,.doc,.docx"
                                                ref={fileInputRef}
                                            />
                                        </label>
                                    </FieldFrame>
                                )}
                            />
                        </FormSection>

                        {error && (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-[160px_minmax(0,1fr)]">
                            <MyButton
                                type={ButtonTypes.SECONDARY}
                                btnText="Reset"
                                width="100%"
                                onClick={resetForm}
                                icon={<RotateCcw size={16} />}
                                className="justify-center rounded-xl py-3"
                            />
                            <MyButton
                                type={ButtonTypes.PRIMARY}
                                btnText={
                                    form.state.isSubmitting
                                        ? 'Sending...'
                                        : 'Submit Application'
                                }
                                disabled={form.state.isSubmitting}
                                isSubmit
                                width="100%"
                                icon={<Send size={16} />}
                                className="justify-center rounded-xl py-3"
                            />
                        </div>
                    </form>
                </section>
            </section>

            <Toast
                message="Please check your inbox or spam to confirm your identity."
                onClose={handleSuccessClose}
                open={showModal}
                severity="success"
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

const InfoCard = ({
    icon,
    title,
    text,
}: {
    icon: ReactNode
    title: string
    text: string
}) => (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2457a3]">
                {icon}
            </div>
            <div>
                <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
            </div>
        </div>
    </article>
)

const FormSection = ({
    title,
    description,
    children,
}: {
    title: string
    description: string
    children: ReactNode
}) => (
    <section className="border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
        <div className="mb-5">
            <h3 className="text-base font-black tracking-tight text-slate-900">
                {title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-500">
                {description}
            </p>
        </div>
        {children}
    </section>
)

const FieldFrame = ({
    errors,
    children,
}: {
    errors: ValidationError[] | null
    children: ReactNode
}) => (
    <div className="space-y-1">
        {children}
        <ErrorRenderer errors={errors} />
    </div>
)

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
