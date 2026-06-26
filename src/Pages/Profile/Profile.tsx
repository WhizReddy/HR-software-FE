import Contrat from './Components/Contrat/Contrat'
import ProfileForm from './Components/ProfileForm/ProfileForm'
import ChangePass from './Components/ChangePass/ChangePass'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { useAuth } from '@/features/auth/context/AuthProvider'
import {
    getDefaultPrivatePath,
    isAdminRole,
    isSelfUser,
} from '@/features/auth/lib/access'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/Components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { getReturnTo } from '@/Helpers/navigation'

export default function Profile() {
    const { currentUser, userRole } = useAuth()
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const canViewPayroll =
        isAdminRole(userRole) || isSelfUser(currentUser?._id, id)
    const canViewSecurity = isSelfUser(currentUser?._id, id)
    const returnTo = getReturnTo(
        location.state,
        canViewSecurity
            ? getDefaultPrivatePath(userRole || currentUser?.role)
            : '/employees',
    )

    return (
        <main className="w-full flex-1">
            <div className="mb-4">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(returnTo)}
                >
                    <ArrowLeft size={16} />
                    Back
                </Button>
            </div>
            <div className="w-full overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.06)]">
                <Tabs
                    defaultValue="profile"
                    className="flex flex-col gap-6 p-4 md:flex-row md:p-6"
                >
                    <TabsList className="flex h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-100 p-1 md:w-64 md:flex-col md:items-stretch">
                        <TabsTrigger
                            value="profile"
                            className="w-full justify-start rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                        >
                            Profile details
                        </TabsTrigger>
                        {canViewPayroll && (
                            <TabsTrigger
                                value="payroll"
                                className="w-full justify-start rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                            >
                                Payroll & Contracts
                            </TabsTrigger>
                        )}
                        {canViewSecurity && (
                            <TabsTrigger
                                value="security"
                                className="w-full justify-start rounded-md px-4 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-white/70 data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm"
                            >
                                Security
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <div className="min-h-[500px] flex-1">
                        <TabsContent
                            value="profile"
                            className="m-0 focus-visible:outline-none focus-visible:ring-0"
                        >
                            <ProfileForm />
                        </TabsContent>

                        {canViewPayroll && (
                            <TabsContent
                                value="payroll"
                                className="m-0 focus-visible:outline-none focus-visible:ring-0"
                            >
                                <Contrat />
                            </TabsContent>
                        )}

                        {canViewSecurity && (
                            <TabsContent
                                value="security"
                                className="m-0 focus-visible:outline-none focus-visible:ring-0"
                            >
                                <ChangePass />
                            </TabsContent>
                        )}
                    </div>
                </Tabs>
            </div>
        </main>
    )
}
