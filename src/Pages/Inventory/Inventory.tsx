import { useContext } from 'react'
import { InventoryContext, InventoryProvider } from './InventoryContext.tsx'
import style from './style/inventory.module.scss'
import { ModalComponent } from '@/Components/Modal/Modal'
import { InventoryTable } from './components/InventoryTable.tsx'
import { CreateItemForm } from './components/Form/CreateItemForm.tsx'
import { Button } from '@/Components/ui/button'
import { Plus } from 'lucide-react'

function InventoryBaseComponent() {
    const {
        createModalOpen,
        handleOpenCreateModalOpen,
        handleCloseCreateModalOpen,
    } = useContext(InventoryContext)
    return (
        <main className={style.main}>
            <ModalComponent
                open={createModalOpen}
                handleClose={handleCloseCreateModalOpen}
            >
                <CreateItemForm />
            </ModalComponent>
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Inventory
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-slate-500">
                    Track assets, monitor assignment status, and inspect serial-level details.
                </p>
            </div>
            <InventoryTable />
            <div className="mt-4 flex justify-end">
                <Button
                    type="button"
                    onClick={handleOpenCreateModalOpen}
                    className="h-10 rounded-xl bg-[#2457a3] px-5 text-sm font-semibold text-white hover:bg-[#1b4285]"
                >
                    <Plus size={16} />
                    Add Item
                </Button>
            </div>
        </main>
    )
}

export default function Inventory() {
    return (
        <InventoryProvider>
            <InventoryBaseComponent />
        </InventoryProvider>
    )
}
