import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Card } from '@/Components/ui/card'

interface EventsDataMenu {
    _id: string
}

interface LongMenuProps {
    event: EventsDataMenu
    onEdit?: (event: EventsDataMenu) => void
    onDelete?: (id: string) => void
}

const LongMenu: React.FC<LongMenuProps> = ({ event, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={(e) => { e.stopPropagation(); setOpen(!open) }}
                className="text-slate-500"
            >
                <MoreVertical size={18} />
            </Button>
            {open && (
                <Card className="absolute right-0 top-8 z-30 min-w-[140px] rounded-xl border border-slate-200 py-1 shadow-lg">
                    {onEdit && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { setOpen(false); onEdit(event) }}
                            className="h-auto w-full justify-start rounded-none px-4 py-2.5 text-sm text-slate-700"
                        >
                            <Pencil size={15} /> Edit
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => { setOpen(false); onDelete(event._id) }}
                            className="h-auto w-full justify-start rounded-none px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-600"
                        >
                            <Trash2 size={15} /> Delete
                        </Button>
                    )}
                </Card>
            )}
        </div>
    )
}

export default LongMenu
