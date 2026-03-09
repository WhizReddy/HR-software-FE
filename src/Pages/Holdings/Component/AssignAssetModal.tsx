import { ModalComponent } from '@/Components/Modal/Modal'
import { FormEvent, useContext, useEffect, useState } from 'react'
import { HoldingsContext } from '../HoldingsContext'
import AxiosInstance from '@/Helpers/Axios'
import { Asset } from '../TAsset'
import { useParams } from 'react-router-dom'
import { useHandleItemAssigner } from '../Hook'

import style from '../style/userHoldings.module.scss'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Input from '@/Components/Input/Index'

export default function AssignAssetModal() {
    const {
        searchParams,
        handleCloseOnModal: handleClose,
        setToastConfigs,
    } = useContext(HoldingsContext)

    const [isOpen] = useState(false)
    const [options, setOptions] = useState<Asset[]>([])
    const [autocompleteLoading, setAutocompleteLoading] = useState(false)
    const [assetId, setAssetId] = useState<string | null>(null)
    const [date, setDate] = useState<string>(new Date().toISOString())

    const itemAssigner = useHandleItemAssigner()
    const { id: userId } = useParams()

    useEffect(() => {
        let active = true

        if (!isOpen) {
            return undefined
        }

        setAutocompleteLoading(true)
            ; (async () => {
                if (active) {
                    const { data } = await AxiosInstance.get<Asset[]>(
                        '/asset?availability=available',
                    )
                    setOptions(data)
                }
                setAutocompleteLoading(false)
            })()

        return () => {
            active = false
        }
    }, [isOpen])
    return (
        <ModalComponent
            open={!!searchParams.get('assignItem')}
            handleClose={handleClose}
        >
            <form
                onSubmit={async (event: FormEvent<HTMLFormElement>) => {
                    event.preventDefault()
                    itemAssigner.mutate({
                        assetId: assetId as string,
                        userId: userId as string,
                        date,
                    })
                    if (itemAssigner.isError) {
                        setToastConfigs({
                            isOpen: true,
                            message: 'Error assigning item',
                            severity: 'error',
                        })
                    } else {
                        setToastConfigs({
                            isOpen: true,
                            message: 'Item assigned successfully',
                            severity: 'success',
                        })
                        handleClose()
                    }
                    setAssetId(null)
                }}
                className={style.itemAssigner}
            >
                <h3>Assign Item</h3>
                <div className="w-full mb-4 relative">
                    <select
                        id="users-list"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2.5 appearance-none"
                        value={assetId || ''}
                        onChange={(e) => {
                            const val = e.target.value
                            setAssetId(val)
                        }}
                        disabled={autocompleteLoading}
                    >
                        <option value="" disabled>Select Item</option>
                        {options.map((option) => (
                            <option key={option._id} value={option._id}>
                                {option.type} {option.serialNumber}
                            </option>
                        ))}
                    </select>
                    {autocompleteLoading && (
                        <div className="absolute right-3 top-2.5">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
                <Input
                    IsUsername
                    name="Date"
                    shrink
                    label="Date"
                    type="date"
                    value={date.split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                />

                <div className={style.buttonContainer}>
                    <Button
                        btnText={'Cancel'}
                        type={ButtonTypes.SECONDARY}
                        onClick={handleClose}
                    />
                    <Button
                        btnText={'Assign'}
                        isSubmit
                        type={ButtonTypes.PRIMARY}
                    />
                </div>
            </form>
        </ModalComponent>
    )
}
