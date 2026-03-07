import Contrat from './Components/Contrat/Contrat'
import ProfileForm from './Components/ProfileForm/ProfileForm'
import ChangePass from './Components/ChangePass/ChangePass'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs'
import { Card } from '@/Components/ui/card'

export default function Profile() {
    return (
        <Card className="glass-card w-full shadow-sm border-none overflow-hidden mt-5">
            <div className="p-6">
                <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-8">
                    <TabsList className="flex md:flex-col h-auto bg-slate-50/50 backdrop-blur-sm border md:border-r-0 border-slate-200/50 justify-start items-start gap-1 p-2 rounded-2xl w-full md:w-64 overflow-x-auto shadow-inner">
                        <TabsTrigger
                            value="profile"
                            className="w-full justify-start py-3 px-4 font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#2457a3] data-[state=active]:shadow-sm hover:bg-white/50 rounded-xl"
                        >
                            Profile details
                        </TabsTrigger>
                        <TabsTrigger
                            value="payroll"
                            className="w-full justify-start py-3 px-4 font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#2457a3] data-[state=active]:shadow-sm hover:bg-white/50 rounded-xl"
                        >
                            Payroll & Contracts
                        </TabsTrigger>
                        <TabsTrigger
                            value="security"
                            className="w-full justify-start py-3 px-4 font-medium text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-[#2457a3] data-[state=active]:shadow-sm hover:bg-white/50 rounded-xl"
                        >
                            Security
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex-1 min-h-[500px]">
                        <TabsContent value="profile" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            <ProfileForm />
                        </TabsContent>

                        <TabsContent value="payroll" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            <Contrat />
                        </TabsContent>

                        <TabsContent value="security" className="m-0 focus-visible:outline-none focus-visible:ring-0">
                            <ChangePass />
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </Card>
    )
}
