import React from 'react'
import { Dialog, DialogContent } from '@/Components/ui/dialog'

interface ModalComponentProps {
    open: boolean
    handleClose: () => void
    children: React.ReactNode
    width?: string
    height?: string
    padding?: string
}

export const ModalComponent: React.FC<ModalComponentProps> = ({
    open,
    handleClose,
    children,
    width = '500px',
    height,
    padding = '24px',
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
                style={{ width, height: height || 'auto', padding }}
            >
                {children}
            </DialogContent>
        </Dialog>
    )
}
