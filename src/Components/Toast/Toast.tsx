import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Severity = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
    open: boolean
    onClose: () => void
    message: string
    severity?: Severity
}

const Toast: React.FC<ToastProps> = ({ open, onClose, message, severity = 'info' }) => {
    useEffect(() => {
        if (!open) {
            return
        }

        const toastMethod = severity === 'warning' ? toast : toast[severity]
        toastMethod(message, {
            duration: 4000,
            onDismiss: onClose,
            onAutoClose: onClose,
        })
    }, [open, onClose, message, severity])

    return null
}

export default Toast
