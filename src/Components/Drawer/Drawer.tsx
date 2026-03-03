import React from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/Components/ui/drawer'

interface DrawerProps {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    width?: string
    anchor?: 'left' | 'right'
}

const DrawerComponent: React.FC<DrawerProps> = ({
    open,
    onClose,
    children,
    title,
    width = '420px',
    anchor = 'right',
}) => {
    return (
        <Drawer open={open} onOpenChange={(value) => !value && onClose()} direction={anchor}>
            <DrawerContent
                className="max-w-none border-slate-200 bg-white"
                style={{ width, maxWidth: width }}
            >
                <DrawerHeader className="border-b border-slate-100 px-5 py-4">
                    {title ? <DrawerTitle>{title}</DrawerTitle> : <DrawerDescription className="hidden" />}
                </DrawerHeader>
                <div className="flex-1 overflow-y-auto p-5">{children}</div>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerComponent
