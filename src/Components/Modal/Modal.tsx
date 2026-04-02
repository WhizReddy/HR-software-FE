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
                className="glass-modal border-none"
                style={{ width: width === '100%' ? '100%' : '95vw', maxWidth: width, height: height || 'auto', padding }}
            >
                {children}
            </DialogContent>
        </Dialog>
    )
}
