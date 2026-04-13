import { AlertTriangle, RotateCcw } from 'lucide-react'
import {
    Link,
    isRouteErrorResponse,
    useLocation,
    useRouteError,
} from 'react-router-dom'

const getFallbackPath = (pathname: string) => {
    if (
        pathname === '/' ||
        pathname.startsWith('/forgot-password') ||
        pathname.startsWith('/reset-password')
    ) {
        return '/'
    }

    if (
        pathname.startsWith('/career') ||
        pathname.startsWith('/recruitment') ||
        pathname.startsWith('/applicant/confirm')
    ) {
        return '/career'
    }

    return '/dashboard'
}

export default function RouteErrorBoundary() {
    const error = useRouteError()
    const { pathname } = useLocation()

    let title = 'Something went wrong'
    let description =
        'This page could not be loaded. Please refresh or go back to a safe route.'

    if (isRouteErrorResponse(error)) {
        title = error.status === 404 ? 'Page not found' : `Error ${error.status}`
        description =
            typeof error.data === 'string'
                ? error.data
                : error.statusText || description
    } else if (error instanceof Error) {
        description = error.message || description
    }

    const fallbackPath = getFallbackPath(pathname)

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-xl rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-900">
                    {title}
                </h1>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                    {description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#2457a3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1c4380]"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reload Page
                    </button>
                    <Link
                        to={fallbackPath}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Go Back
                    </Link>
                </div>
            </div>
        </div>
    )
}
