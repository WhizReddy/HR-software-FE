import { useContext, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
    AlertCircle,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    Globe2,
    LogIn,
    Mail,
    Phone,
    RotateCcw,
    Send,
    Sparkles,
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
import { usePageMeta } from '@/hooks/use-page-meta'
import Workers from '/Images/career-workspace-hero.jpg'
import WorkerTwo from '/Images/career-planning-table.jpg'

function RecruitmentBase() {
    usePageMeta({
        title: 'Submit Application | People Hub',
        description:
            'Submit your candidate profile, CV, preferred role, and technology background to the People Hub recruitment team.',
    })

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
    const isSubmitting = form.state.isSubmitting

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
        <main className="min-h-screen overflow-x-hidden bg-[#f5f7fb]">
            <div className="mx-auto flex w-full min-w-0 max-w-[1500px] flex-col gap-3 px-4 pt-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <Link
                    to="/career"
                    className="inline-flex min-h-10 w-full items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:bg-slate-50 sm:w-auto"
                >
                    Career Board
                </Link>
                <Link
                    to="/"
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md bg-[#2457a3] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1b4285] sm:w-auto"
                >
                    <LogIn size={16} />
                    Login
                </Link>
            </div>

            <section className="mx-auto grid w-full min-w-0 max-w-[1500px] gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[minmax(340px,0.9fr)_minmax(0,1.1fr)] lg:px-8 lg:py-8">
                <aside className="min-w-0 space-y-5 lg:sticky lg:top-6 lg:self-start">
                    <div className="relative min-h-[430px] w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-950 text-white shadow-[0_22px_70px_rgba(15,23,42,0.16)]">
                        <img
                            alt="Focused office workspace"
                            src={Workers}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(140deg,rgba(15,23,42,0.94),rgba(15,23,42,0.70)_56%,rgba(15,23,42,0.20))]" />
                        <div className="relative flex min-h-[430px] min-w-0 flex-col justify-between p-6 sm:p-7">
                            <div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/85 backdrop-blur">
                                        <Sparkles size={14} />
                                        Recruitment
                                    </span>
                                    <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase text-white/85 backdrop-blur">
                                        Candidate form
                                    </span>
                                </div>
                                <h1 className="mt-8 max-w-full break-words text-3xl font-semibold leading-tight sm:max-w-xl sm:text-4xl">
                                    Tell us where you can make the strongest
                                    impact.
                                </h1>
                                <p className="mt-4 max-w-full break-words text-sm leading-7 text-white/75 sm:max-w-xl sm:text-base">
                                    Send your details once, attach your CV, and
                                    the hiring team will review your profile
                                    from the recruitment dashboard.
                                </p>
                            </div>

                            <div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-[11px] font-semibold uppercase text-white/60">
                                        CV
                                    </p>
                                    <p className="mt-2 font-semibold">
                                        Required
                                    </p>
                                </div>
                                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-[11px] font-semibold uppercase text-white/60">
                                        Phone
                                    </p>
                                    <p className="mt-2 font-semibold">
                                        International
                                    </p>
                                </div>
                                <div className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
                                    <p className="text-[11px] font-semibold uppercase text-white/60">
                                        Review
                                    </p>
                                    <p className="mt-2 font-semibold">
                                        Email check
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                        <img
                            alt="Planning table"
                            src={WorkerTwo}
                            className="h-40 w-full object-cover"
                        />
                        <div className="p-5">
                            <p className="text-xs font-semibold uppercase text-slate-400">
                                Application flow
                            </p>
                            <p className="mt-3 break-words text-sm leading-7 text-slate-600">
                                Keep the information direct. The stronger the
                                role context and CV, the easier it is to review
                                your fit quickly.
                            </p>
                        </div>
                    </div>

                    <div className="grid min-w-0 gap-3 sm:grid-cols-3 lg:grid-cols-1">
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

                    <div className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                        <p className="text-[11px] font-semibold uppercase text-slate-400">
                            Contact Fields
                        </p>
                        <div className="mt-4 grid gap-3">
                            <div className="flex min-w-0 items-center gap-3 rounded-md bg-slate-50 px-4 py-3">
                                <Mail size={16} className="text-[#2457a3]" />
                                <span className="min-w-0 break-words text-sm font-semibold text-slate-700">
                                    Email confirmation enabled
                                </span>
                            </div>
                            <div className="flex min-w-0 items-center gap-3 rounded-md bg-slate-50 px-4 py-3">
                                <Globe2 size={16} className="text-[#2457a3]" />
                                <span className="min-w-0 break-words text-sm font-semibold text-slate-700">
                                    International phone numbers accepted
                                </span>
                            </div>
                        </div>
                    </div>
                </aside>

                <section className="min-w-0 rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase text-slate-400">
                                Application Form
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                Candidate Details
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Complete the required profile, role, and CV
                                fields so the hiring team can process your
                                application correctly.
                            </p>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-semibold uppercase text-[#2457a3]">
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
                                                    <Phone size={16} />
                                                }
                                                iconPosition="start"
                                                label="Phone Number"
                                                name="phoneNumber"
                                                IsUsername
                                                type="tel"
                                                placeholder="+355 69 123 4567"
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
                                        <label className="flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-[#2457a3] hover:bg-blue-50/60">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-[#2457a3] shadow-sm ring-1 ring-slate-200">
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

                        {isSubmitting && (
                            <div className="flex gap-3 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-[#2457a3]">
                                <Send size={18} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        Sending your application...
                                    </p>
                                    <p className="mt-1 leading-6 text-blue-700/80">
                                        Keep this page open while the CV and
                                        profile details are uploaded.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />
                                <div>
                                    <p className="font-semibold">
                                        Application could not be submitted
                                    </p>
                                    <p className="mt-1 leading-6">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="grid gap-3 border-t border-slate-100 pt-6 sm:grid-cols-[160px_minmax(0,1fr)]">
                            <MyButton
                                type={ButtonTypes.SECONDARY}
                                btnText="Reset"
                                width="100%"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                icon={<RotateCcw size={16} />}
                                className="justify-center whitespace-nowrap rounded-md py-3"
                            />
                            <MyButton
                                type={ButtonTypes.PRIMARY}
                                btnText={
                                    isSubmitting
                                        ? 'Sending...'
                                        : 'Submit Application'
                                }
                                disabled={isSubmitting}
                                isSubmit
                                width="100%"
                                icon={<Send size={16} />}
                                className="justify-center whitespace-nowrap rounded-md py-3"
                            />
                        </div>
                    </form>
                </section>
            </section>

            <Toast
                message="Application submitted. Please check your inbox or spam folder to confirm your identity."
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
    <article className="min-w-0 rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
        <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#2457a3]">
                {icon}
            </div>
            <div className="min-w-0">
                <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                <p className="mt-1 break-words text-sm leading-5 text-slate-500">
                    {text}
                </p>
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
    <section className="min-w-0 border-t border-slate-100 pt-6 first:border-t-0 first:pt-0">
        <div className="mb-5">
            <h3 className="text-base font-semibold text-slate-950">
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
