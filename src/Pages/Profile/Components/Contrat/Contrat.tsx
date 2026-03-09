import Input from '../../../../Components/Input/Index'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import Button from '../../../../Components/Button/Button'
import { ProfileProvider } from '../ProfileForm/Context/ProfileProvider'
import { useCreatePayroll, useUpdatePayroll } from '../ProfileForm/Context/Hook'
import Toast from '@/Components/Toast/Toast'

const ContratContent = () => {
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
                    <Button
                        type={ButtonTypes.PRIMARY}
                        btnText={EditingPayroll ? 'Update Payroll' : 'Create Payroll'}
                        onClick={EditingPayroll ? handleUpdatePayroll : handleCreatePayroll}
                        className="w-full bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
                    />
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
