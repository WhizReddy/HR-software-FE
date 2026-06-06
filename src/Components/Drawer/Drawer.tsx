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
        <Drawer
            open={open}
            onOpenChange={(value) => !value && onClose()}
            direction={anchor}
        >
            <DrawerContent
                className="max-w-none overflow-hidden border-slate-200 bg-white"
                style={{ width: 'calc(100vw - 16px)', maxWidth: width }}
                onCloseAutoFocus={(e) => {
                    e.preventDefault()
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur()
                    }
                }}
            >
                {title ? (
                    <DrawerHeader className="border-b border-slate-100 px-5 py-4">
                        <DrawerTitle>{title}</DrawerTitle>
                    </DrawerHeader>
                ) : (
                    <>
                        <DrawerTitle className="sr-only">
                            Drawer Menu
                        </DrawerTitle>
                        <DrawerDescription className="sr-only">
                            Menu Description
                        </DrawerDescription>
                    </>
                )}
                <div className="custom-scrollbar min-h-0 flex-1 overflow-x-hidden overflow-y-auto p-5">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default DrawerComponent
