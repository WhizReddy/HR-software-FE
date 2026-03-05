import { ModalComponent } from '@/Components/Modal/Modal'
import { useReturnAssetForm } from '../../Hook'
import { TitleCaser } from '@/Helpers/TitleCaser'
import dayjs from 'dayjs'
import { useContext } from 'react'
import { Button } from '@/Components/ui/button'
import { HoldingsContext } from '../../HoldingsContext'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { picklist } from 'valibot'

export const ReturnAssetModal = () => {
    const { searchParams, handleCloseOnModal: handleClose } =
        useContext(HoldingsContext)
    const { form, itemGetter } = useReturnAssetForm()

    return (
        <ModalComponent
            open={!!searchParams.get('ownedItem')}
            handleClose={handleClose}
        >
            <div className="p-6 max-w-md w-full mx-auto bg-white rounded-xl shadow-lg relative">
                {itemGetter.isLoading ? (
                    <div className="py-8 text-center text-slate-500">Loading...</div>
                ) : itemGetter.isError ? (
                    <div className="py-8 text-center text-red-500">Error: {itemGetter.error.message}</div>
                ) : (
                    <>
                        {itemGetter.data && (
                            <div className="flex flex-col gap-6">
                                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-col items-center text-center">
                                    <h3 className="text-xl font-bold text-slate-800 mb-1">
                                        {TitleCaser(itemGetter.data.type)}
                                    </h3>
                                    <div className="space-y-0.5">
                                        <p className="text-slate-600 font-medium">SN: {itemGetter.data.serialNumber}</p>
                                        <p className="text-xs text-slate-400">
                                            Assigned: {dayjs(itemGetter.data.takenDate).format('DD MMM YYYY')}
                                        </p>
                                    </div>
                                </div>

                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        if (document.activeElement instanceof HTMLElement) {
                                            document.activeElement.blur()
                                        }
                                        form.handleSubmit()
                                    }}
                                    className="flex flex-col gap-5"
                                >
                                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
                                        Return Configuration
                                    </h3>

                                    <form.Field
                                        name="status"
                                        validators={{
                                            onChange: picklist(
                                                ['available', 'broken'],
                                                "Please select an item status"
                                            ),
                                        }}
                                        children={(field) => (
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-medium text-slate-700">Condition upon return</label>
                                                <select
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value as any)}
                                                >
                                                    <option value="" disabled>Select status...</option>
                                                    <option value="available">Available (Good Condition)</option>
                                                    <option value="broken">Broken / Damaged</option>
                                                </select>
                                                {field.state.meta.errors ? (
                                                    <ErrorText>
                                                        {field.state.meta.errors.join(', ')}
                                                    </ErrorText>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <form.Field
                                        name="returnDate"
                                        children={(field) => (
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-sm font-medium text-slate-700">Return Date</label>
                                                <input
                                                    type="date"
                                                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue"
                                                    value={field.state.value}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                />
                                                {field.state.meta.errors ? (
                                                    <ErrorText>
                                                        {field.state.meta.errors.join(', ')}
                                                    </ErrorText>
                                                ) : null}
                                            </div>
                                        )}
                                    />

                                    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => {
                                                if (document.activeElement instanceof HTMLElement) {
                                                    document.activeElement.blur()
                                                }
                                                handleClose()
                                            }}
                                            className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                                        >
                                            {form.state.isSubmitting ? 'Processing...' : 'Return Item'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </>
                )}
            </div>
        </ModalComponent>
    )
}
