type WorkspaceLoaderProps = {
    label?: string
    fullScreen?: boolean
}

const WorkspaceLoader = ({
    label = 'Loading workspace',
    fullScreen = false,
}: WorkspaceLoaderProps) => (
    <div
        className={`flex items-center justify-center bg-slate-50 px-4 text-center ${
            fullScreen ? 'min-h-screen' : 'min-h-[160px]'
        }`}
    >
        <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
            <div className="mx-auto mb-4 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-800">{label}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">
                Please wait while People Hub prepares this view.
            </p>
        </div>
    </div>
)

export default WorkspaceLoader
