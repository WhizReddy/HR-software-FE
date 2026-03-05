import { ModalComponent } from '@/Components/Modal/Modal'
import { useContext, useEffect, useCallback } from 'react'
import { HoldingsContext } from '../../HoldingsContext'
import AxiosInstance from '@/Helpers/Axios'
import { Asset } from '../../TAsset'
import { Button } from '@/Components/ui/button'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { nonEmpty, pipe, string } from 'valibot'
import { useAssignAssetForm } from '../../Hook'
import { RingLoader } from 'react-spinners'

export const AssignAssetModal = () => {
    const {
        searchParams,
        handleCloseOnModal: handleClose,
        optionsAssignAsset: options,
        setOptionsAssignAsset: setOptions,
        autocompleteLoadingAssignAsset: autocompleteLoading,
        setAutocompleteLoadingAssignAsset: setAutocompleteLoading,
        autocompleteValueAssignAsset: autocompleteValue,
        setAutocompleteValueAssignAsset: setAutocompleteValue,
    } = useContext(HoldingsContext)

    const isOpen = !!searchParams.get('assignItem')

    const { form } = useAssignAssetForm()

    const fetchAssets = useCallback(async () => {
        const { data } = await AxiosInstance.get<Asset[]>(
            '/asset?availability=available',
        )
        setOptions(data)
    }, [setOptions])

    useEffect(() => {
        let active = true

        if (!isOpen) {
            return undefined
        }

        setAutocompleteLoading(true)
        fetchAssets().then(() => {
            if (active) {
                setAutocompleteLoading(false)
            }
        })

        return () => {
            active = false
        }
    }, [isOpen, fetchAssets, setAutocompleteLoading])

    return (
        <ModalComponent
            open={!!searchParams.get('assignItem')}
            handleClose={handleClose}
        >
            <div className="p-6 max-w-md w-full mx-auto bg-white rounded-xl shadow-lg relative">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Assign Item</h3>

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
                    <form.Field
                        name="assetId"
                        validators={{
                            onChange: pipe(
                                string('Asset is required'),
                                nonEmpty('Please select an asset')
                            ),
                        }}
                        children={(field) => (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Available Items</label>
                                <div className="relative">
                                    <select
                                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue/30 focus:border-primary-blue appearance-none"
                                        value={autocompleteValue?._id || ''}
                                        onChange={(e) => {
                                            const selectedId = e.target.value
                                            const selectedOption = options?.find((opt) => opt._id === selectedId) || null
                                            setAutocompleteValue(selectedOption)
                                            field.handleChange(selectedId)
                                        }}
                                        disabled={autocompleteLoading}
                                    >
                                        <option value="" disabled>Select an item to assign...</option>
                                        {options?.map((option) => (
                                            <option key={option._id} value={option._id}>
                                                {option.type} - {option.serialNumber}
                                            </option>
                                        ))}
                                    </select>

                                    {autocompleteLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <RingLoader size={16} color="#64748b" />
                                        </div>
                                    )}
                                </div>
                                {field.state.meta.errors ? (
                                    <ErrorText>
                                        {field.state.meta.errors.join(', ')}
                                    </ErrorText>
                                ) : null}
                            </div>
                        )}
                    />

                    <form.Field
                        name="date"
                        children={(field) => (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Assignment Date</label>
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
                            className="bg-primary-blue hover:bg-primary-blue-dark text-white shadow-sm"
                        >
                            Assign Item
                        </Button>
                    </div>
                </form>
            </div>
        </ModalComponent>
    )
}
