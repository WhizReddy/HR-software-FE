import Input from '../../../../Components/Input/Index'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import Button from '../../../../Components/Button/Button'
import { ProfileProvider } from '../ProfileForm/Context/ProfileProvider'
import { useCreatePayroll, useUpdatePayroll } from '../ProfileForm/Context/Hook'
import Toast from '@/Components/Toast/Toast'
import { useAuth } from '@/Context/AuthProvider'
import { isAdminRole, isSelfUser } from '@/Helpers/access'
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
            <div className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70">
                <h3 className="text-lg font-bold text-slate-800">Payroll access restricted</h3>
                <p className="mt-2 text-sm text-slate-500">
                    Payroll details are only available for your own profile or HR/Admin users.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            <Toast
                severity={EditingPayroll ? toastSeverity : createToastSeverity}
                open={EditingPayroll ? toastOpen : createToastOpen}
                message={EditingPayroll ? toastMessage : createToastMessage}
                onClose={
                    EditingPayroll ? handleToastClose : handleCreateToastClose
                }
            />

            {/* Left Column - Payroll Information Card */}
            <div className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 h-full flex flex-col">
                <h3 className="text-lg font-bold text-[#2457a3] mb-6 border-b border-slate-100/50 pb-4">Payroll Information</h3>

                <div className="space-y-6 flex-1">
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
                <div className="space-y-6 flex-1 mt-6">
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
            <div className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 h-full flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-emerald-600 mb-6 border-b border-slate-100/50 pb-4">Additional Bonus</h3>

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

                <div className="pt-8 mt-auto">
                    {canManagePayroll ? (
                        <Button
                            type={ButtonTypes.PRIMARY}
                            btnText={EditingPayroll ? 'Update Payroll' : 'Create Payroll'}
                            onClick={EditingPayroll ? handleUpdatePayroll : handleCreatePayroll}
                            className="w-full bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
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
    return (
        <ProfileProvider>
            <ContratContent />
        </ProfileProvider>
    )
}

export default Contrat
