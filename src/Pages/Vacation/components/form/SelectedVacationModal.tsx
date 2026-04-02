import { useContext } from 'react'
import { VacationContext } from '../../VacationContext'
import { useGetVacation } from '../../Hook'
import { UpdateVacationForm } from './UpdateVacationForm'
import { ModalComponent } from '@/Components/Modal/Modal'

export const SelectedVacationModal = () => {
    const { searchParams, handleCloseVacationModalOpen: handleClose } =
        useContext(VacationContext)
    const vacation = useGetVacation()
    const isOpen = searchParams.get('selectedVacation') !== null

    if (!isOpen) return null

    return (
        <ModalComponent open={isOpen} handleClose={handleClose} width="760px">
            {vacation.isLoading ? (
                <div className="flex min-h-[180px] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                </div>
            ) : vacation.error ? (
                <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">
                    Error: {vacation.error.message}
                </div>
            ) : (
                <UpdateVacationForm data={vacation} />
            )}
        </ModalComponent>
    )
}
