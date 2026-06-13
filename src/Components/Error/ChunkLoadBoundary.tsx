import { Component, type ReactNode } from 'react'

const CHUNK_RELOAD_KEY = 'hr-software:last-chunk-reload'
const CHUNK_RELOAD_WINDOW_MS = 30_000

export const isChunkLoadError = (error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)

    return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk \d+ failed|dynamically imported module|module script/i.test(
        message,
    )
}

type ChunkLoadBoundaryProps = {
    children: ReactNode
}

type ChunkLoadBoundaryState = {
    error: Error | null
}

export class ChunkLoadBoundary extends Component<
    ChunkLoadBoundaryProps,
    ChunkLoadBoundaryState
> {
    state: ChunkLoadBoundaryState = {
        error: null,
    }

    componentDidCatch(error: Error) {
        if (isChunkLoadError(error) && typeof window !== 'undefined') {
            const lastReload = Number(
                window.sessionStorage.getItem(CHUNK_RELOAD_KEY) || 0,
            )
            const now = Date.now()

            if (!lastReload || now - lastReload > CHUNK_RELOAD_WINDOW_MS) {
                window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(now))
                window.location.reload()
                return
            }
        }

        this.setState({ error })
    }

    render() {
        if (!this.state.error) {
            return this.props.children
        }

        const isChunkError = isChunkLoadError(this.state.error)

        return (
            <div className="flex min-h-[280px] items-center justify-center bg-slate-50 px-4 py-10">
                <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                    <h2 className="text-lg font-semibold text-slate-950">
                        {isChunkError
                            ? 'A new app version is available'
                            : 'This page could not load'}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500">
                        {isChunkError
                            ? 'Refresh the page to load the latest files.'
                            : 'Please refresh the page and try again.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-[#2457a3] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#1b4285] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2457a3]/30"
                    >
                        Refresh page
                    </button>
                </div>
            </div>
        )
    }
}
