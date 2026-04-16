import React from 'react'
import { Dialog, DialogContent } from '@/Components/ui/dialog'

interface ModalComponentProps {
    open: boolean
    handleClose: () => void
    children: React.ReactNode
    width?: string
    height?: string
    padding?: string
    showCloseButton?: boolean
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
    open,
    handleClose,
    children,
    width = '500px',
    height,
    padding = '24px',
    showCloseButton = true,
}) => {
    const resolvedWidth =
        width === '100%'
            ? 'calc(100vw - 1.5rem)'
            : `min(calc(100vw - 1.5rem), ${width})`

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    handleClose()
                }
            }}
        >
            <DialogContent
                showCloseButton={showCloseButton}
                className="glass-modal overflow-hidden border-none p-0"
                style={{
                    width: resolvedWidth,
                    maxWidth: 'calc(100vw - 1.5rem)',
                    height: height || 'auto',
                    maxHeight: 'calc(100vh - 1.5rem)',
                }}
            >
                <div
                    style={{
                        padding,
                        height: height || 'auto',
                        maxHeight: 'calc(100vh - 1.5rem)',
                        overflowY: 'auto',
                    }}
                >
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}
