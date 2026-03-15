import { useContext } from 'react'
import { InventoryContext, InventoryProvider } from './InventoryContext.tsx'
import style from './style/inventory.module.scss'
import { ModalComponent } from '@/Components/Modal/Modal'
import { InventoryTable } from './components/InventoryTable.tsx'
import { CreateItemForm } from './components/Form/CreateItemForm.tsx'
import { Button } from '@/Components/ui/button'
import { Plus } from 'lucide-react'
import PageIntro from '@/Components/PageIntro/PageIntro'

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
            <PageIntro
                eyebrow="Assets"
                title="Inventory"
                description="Track company equipment, monitor assignment status, and inspect serial-level details without leaving the inventory workspace."
                className="mb-6"
                actions={
                    <Button type="button" onClick={handleOpenCreateModalOpen}>
                        <Plus size={16} />
                        Add Item
                    </Button>
                }
            />
            <InventoryTable />
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
