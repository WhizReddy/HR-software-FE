import { useContext } from 'react'
import Button from '@/Components/Button/Button'
import { ButtonTypes } from '@/Components/Button/ButtonTypes'
import Input from '@/Components/Input/Index'
import { InventoryContext } from '../../InventoryContext'
import { useCreateItemForm } from '../../Hook'
import style from '../../style/createItemForm.module.scss'
import Selecter from '@/Components/Input/components/Select/Selecter'
import { ErrorText } from '@/Components/Error/ErrorTextForm'
import { CreateInventoryItemSchema } from '@/Schemas/Inventory/CreateInventoryItem.schema'

export const CreateItemForm = () => {
    const { handleCloseCreateModalOpen, error } = useContext(InventoryContext)
    const { form } = useCreateItemForm()

    return (
        <>
            <h3 className={style.heading}>Create an asset</h3>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                className={style.form}
            >
                <div>
                    <form.Field
                        validators={{
                            onChange: CreateInventoryItemSchema.entries.type,
                        }}
                        name="type"
                        children={(field) => (
                            <div>
                                <Selecter
                                    label="Item Type"
                                    name="Item Type"
                                    multiple={false}
                                    options={['laptop', 'monitor', 'keyboard', 'mouse', 'phone', 'tablet', 'headset']}
                                    value={field.state.value}
                                    onChange={(newValue) =>
                                        field.handleChange(newValue as string)
                                    }
                                />
                                {field.state.meta.errors ? (
                                    <ErrorText>
                                        {field.state.meta.errors.join(', ')}
                                    </ErrorText>
                                ) : null}
                            </div>
                        )}
                    />
                </div>

                <div>
                    <form.Field
                        name="serialNumber"
                        validators={{
                            onChange:
                                CreateInventoryItemSchema.entries.serialNumber,
                        }}
                        children={(field) => (
                            <div>
                                <Input
                                    IsUsername
                                    name="serialNumber"
                                    width={'100%'}
                                    label="Serial Number"
                                    value={field.state.value}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                />
                                {field.state.meta.errors ? (
                                    <ErrorText>
                                        {field.state.meta.errors.join(', ')}
                                    </ErrorText>
                                ) : null}
                            </div>
                        )}
                    />
                </div>

                <div style={{ display: 'flex', gap: '0.3rem' }}>
                    <Button
                        type={ButtonTypes.SECONDARY}
                        btnText="Cancel"
                        border="none"
                        onClick={handleCloseCreateModalOpen}
                        width={'100%'}
                    />
                    <Button
                        type={ButtonTypes.PRIMARY}
                        btnText={
                            form.state.isSubmitting ? 'Submitting' : 'Submit'
                        }
                        disabled={form.state.isSubmitting}
                        width={'100%'}
                        isSubmit
                    />
                </div>
                {error && <ErrorText>{error}</ErrorText>}
            </form>
        </>
    )
}
