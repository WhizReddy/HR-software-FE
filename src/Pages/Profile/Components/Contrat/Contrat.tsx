import Input from '../../../../Components/Input/Index'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import Button from '../../../../Components/Button/Button'
import { useCreatePayroll, useUpdatePayroll } from '../ProfileForm/Context/Hook'
import Toast from '@/Components/Toast/Toast'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole, isSelfUser } from '@/features/auth/lib/access'
import { useParams } from 'react-router-dom'

const ContratContent = () => {
    const { currentUser, userRole } = useAuth()
    const { id } = useParams<{ id: string }>()
    const {
        EditingPayroll,
        handleUpdateChangePayroll,
        handleUpdatePayroll,
        toastMessage,
        toastOpen,
        handleToastClose,
        toastSeverity,
    } = useUpdatePayroll()

    const {
        handleChangePayroll,
        payroll,
        handleCreatePayroll,
        createToastMessage,
        createToastSeverity,
        createToastOpen,
        handleCreateToastClose,
    } = useCreatePayroll()

    const canManagePayroll = isAdminRole(userRole)
    const canViewPayroll = canManagePayroll || isSelfUser(currentUser?._id, id)

    if (!canViewPayroll) {
        return (
            <div className="rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-8">
                <h3 className="text-lg font-semibold text-slate-950">Payroll access restricted</h3>
                <p className="mt-2 text-sm text-slate-500">
                    Payroll details are only available for your own profile or HR/Admin users.
                </p>
            </div>
        )
    }

    return (
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
            <Toast
                severity={EditingPayroll ? toastSeverity : createToastSeverity}
                open={EditingPayroll ? toastOpen : createToastOpen}
                message={EditingPayroll ? toastMessage : createToastMessage}
                onClose={
                    EditingPayroll ? handleToastClose : handleCreateToastClose
                }
            />

            {/* Left Column - Payroll Information Card */}
            <div className="flex h-full flex-col rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-8">
                <h3 className="mb-6 border-b border-slate-100 pb-4 text-lg font-semibold text-[#2457a3]">Payroll Information</h3>

                <div className="flex-1 space-y-6">
                    <div className="space-y-1">
                        <Input
                            IsUsername
                            type="number"
                            label="Working Days"
                            name="workingDays"
                            shrink={true}
                            width="100%"
                            value={
                                EditingPayroll
                                    ? EditingPayroll?.workingDays
                                    : payroll.workingDays || ''
                            }
                            disabled={!canManagePayroll}
                            onChange={
                                EditingPayroll
                                    ? handleUpdateChangePayroll
                                    : handleChangePayroll
                            }
                        />
                    </div>
                    <div className="space-y-1">
                        <Input
                            IsUsername
                            shrink={true}
                            name="grossSalary"
                            label="Gross Salary"
                            width="100%"
                            value={
                                EditingPayroll
                                    ? EditingPayroll?.grossSalary
                                    : payroll.grossSalary || ''
                            }
                            disabled={!canManagePayroll}
                            onChange={
                                EditingPayroll
                                    ? handleUpdateChangePayroll
                                    : handleChangePayroll
                            }
                        />
                    </div>
                </div>
                <div className="mt-6 flex-1 space-y-6">
                    <div className="space-y-1">
                        <Input
                            IsUsername
                            type="number"
                            label="Extra Hours"
                            name="extraHours"
                            shrink={true}
                            width="100%"
                            value={
                                EditingPayroll
                                    ? EditingPayroll?.extraHours
                                    : payroll.extraHours || ''
                            }
                            disabled={!canManagePayroll}
                            onChange={
                                EditingPayroll
                                    ? handleUpdateChangePayroll
                                    : handleChangePayroll
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Right Column - Bonus Card */}
            <div className="flex h-full flex-col justify-between rounded-lg border border-slate-200/80 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.06)] sm:p-8">
                <div>
                    <h3 className="mb-6 border-b border-slate-100 pb-4 text-lg font-semibold text-emerald-600">Additional Bonus</h3>

                    <div className="space-y-6">
                        <div className="space-y-1">
                            <Input
                                IsUsername
                                label="Bonus Amount"
                                name="bonus"
                                type="number"
                                width="100%"
                                value={
                                    EditingPayroll
                                        ? EditingPayroll?.bonus
                                        : payroll.bonus || ''
                                }
                                disabled={!canManagePayroll}
                                onChange={
                                    EditingPayroll
                                        ? handleUpdateChangePayroll
                                        : handleChangePayroll
                                }
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                IsUsername
                                label="Bonus Description"
                                name="bonusDescription"
                                type="textarea"
                                multiline={true}
                                rows={3}
                                width="100%"
                                value={
                                    EditingPayroll
                                        ? EditingPayroll?.bonusDescription
                                        : payroll.bonusDescription || ''
                                }
                                disabled={!canManagePayroll}
                                onChange={
                                    EditingPayroll
                                        ? handleUpdateChangePayroll
                                        : handleChangePayroll
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-8">
                    {canManagePayroll ? (
                        <Button
                            type={ButtonTypes.PRIMARY}
                            btnText={EditingPayroll ? 'Update Payroll' : 'Create Payroll'}
                            onClick={EditingPayroll ? handleUpdatePayroll : handleCreatePayroll}
                            className="w-full"
                        />
                    ) : (
                        <p className="text-sm text-slate-500">
                            Payroll entries are managed by HR/Admin.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

const Contrat: React.FC = () => {
    return <ContratContent />
}

export default Contrat
