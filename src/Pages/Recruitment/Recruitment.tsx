import { useContext, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
    AlertCircle,
    BriefcaseBusiness,
    CheckCircle2,
    Clock3,
    FileText,
    LogIn,
    Phone,
    RotateCcw,
    Send,
    UploadCloud,
} from 'lucide-react'
import { ValidationError } from '@tanstack/react-form'
import { valibotValidator } from '@tanstack/valibot-form-adapter'
import Input from '../../Components/Input/Index'
import PublicPageNav, {
    publicButtonClasses,
} from '@/Components/Public/PublicPageNav'
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
import {
    RECRUITMENT_CV_MAX_SIZE_BYTES,
    RECRUITMENT_CV_MAX_SIZE_MB,
    RecruitmentSchema,
} from '@/Schemas/Recruitment/Recruitment.schema'
import { usePageMeta } from '@/hooks/use-page-meta'

function RecruitmentBase() {
    usePageMeta({
        title: 'Submit Application | People Hub',
        description:
            'Send your candidate details, CV, preferred role, and technology background to People Hub.',
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
            <div className="mx-auto box-border flex w-full min-w-0 max-w-[1500px] flex-col gap-3 px-4 pt-3 sm:px-6 sm:pt-4 lg:px-8">
                <PublicPageNav
                    contextLabel="Candidate application"
                    actions={
                        <>
                            <Link
                                to="/career"
                                className={`${publicButtonClasses.secondary} w-full sm:w-auto`}
                            >
                                Back to careers
                            </Link>
                            <Link
                                to="/"
                                className={`${publicButtonClasses.secondary} w-full sm:w-auto`}
                            >
                                <LogIn size={16} />
                                Sign in
                            </Link>
                        </>
                    }
                />
            </div>

            <section className="mx-auto box-border w-full min-w-0 max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                <section className="mb-6 rounded-xl border border-slate-200 bg-[#fbfbf8] p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-8">
                    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Candidate application
                            </p>
                            <h1 className="mt-5 max-w-2xl break-words text-2xl font-semibold leading-tight text-slate-950 min-[420px]:text-3xl sm:text-5xl">
                                Submit application, reviewed clearly.
                            </h1>
                            <p className="mt-4 max-w-2xl break-words text-sm leading-7 text-slate-600 sm:text-base">
                                Add your details, attach your CV, and the hiring
                                team will review the application from the HR
                                dashboard.
                            </p>
                        </div>

                        <aside className="min-w-0 rounded-lg border border-slate-200 bg-white p-5">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Before submitting
                            </p>
                            <dl className="mt-5 divide-y divide-slate-100">
                                <div className="flex flex-wrap items-center justify-between gap-2 py-3 first:pt-0">
                                    <dt className="text-sm font-medium text-slate-500">
                                        CV
                                    </dt>
                                    <dd className="text-sm font-semibold text-slate-950">
                                        Required
                                    </dd>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 py-3">
                                    <dt className="text-sm font-medium text-slate-500">
                                        Phone
                                    </dt>
                                    <dd className="text-sm font-semibold text-slate-950">
                                        International
                                    </dd>
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-2 py-3 last:pb-0">
                                    <dt className="text-sm font-medium text-slate-500">
                                        Review
                                    </dt>
                                    <dd className="text-sm font-semibold text-slate-950">
                                        Email check
                                    </dd>
                                </div>
                            </dl>
                        </aside>
                    </div>
                </section>

                <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="h-fit min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:sticky lg:top-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Application notes
                        </p>
                        <div className="mt-5 space-y-3">
                            <InfoCard
                                icon={<FileText size={18} />}
                                title="CV required"
                                text={`PDF, DOC, or DOCX up to ${RECRUITMENT_CV_MAX_SIZE_MB}MB.`}
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
                    </aside>

                    <section className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-7 lg:p-8">
                    <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-500">
                                Application form
                            </p>
                            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                                Candidate details
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                Complete the required profile, role, and CV
                                fields so the hiring team can review the
                                application clearly.
                            </p>
                        </div>
                        <div className="inline-flex w-fit items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                            <BriefcaseBusiness size={15} />
                            Hiring team
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
                            title="Personal information"
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
                                                placeholder="+44 7700 900123"
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
                            title="Role information"
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
                            title="CV attachment"
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
                                        if (
                                            selectedFile.size >
                                            RECRUITMENT_CV_MAX_SIZE_BYTES
                                        ) {
                                            return `File must be ${RECRUITMENT_CV_MAX_SIZE_MB}MB or smaller`
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
                                        <label className="flex min-h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-slate-400 hover:bg-white">
                                            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-white text-slate-600 shadow-sm ring-1 ring-slate-200">
                                                <UploadCloud size={22} />
                                            </span>
                                            <span className="font-bold text-slate-800">
                                                Upload your CV
                                            </span>
                                            <span className="max-w-full truncate text-sm font-medium text-slate-500">
                                                {fileName ||
                                                    `PDF, DOC, or DOCX up to ${RECRUITMENT_CV_MAX_SIZE_MB}MB`}
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
                            <div className="flex gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                <Send size={18} className="mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-semibold">
                                        Sending your application...
                                    </p>
                                    <p className="mt-1 leading-6 text-slate-600">
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
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className={`${publicButtonClasses.secondary} disabled:pointer-events-none disabled:opacity-55`}
                            >
                                <RotateCcw size={16} />
                                Reset
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`${publicButtonClasses.primary} disabled:pointer-events-none disabled:opacity-55`}
                            >
                                <Send size={16} />
                                {isSubmitting
                                    ? 'Sending...'
                                    : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                    </section>
                </div>
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
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
