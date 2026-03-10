import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/Components/ui/breadcrumb'

const routeLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    employees: 'Employees',
    candidates: 'Candidates',
    interview: 'Interview',
    events: 'Events',
    payroll: 'Payroll',
    vacation: 'Vacation',
    holdings: 'Holdings',
    inventory: 'Inventory',
    historic: 'History',
    profile: 'Profile',
    view: 'Candidate Details',
    user: 'User Payroll',
}

export const BreadcrumbComponent: React.FC = () => {
    const { pathname } = useLocation()
    const crumbs = pathname.split('/').filter(Boolean)

    if (crumbs.length === 0) return null

    return (
        <Breadcrumb className="mb-5">
            <BreadcrumbList className="inline-flex rounded-full border border-white/80 bg-white/80 px-3 py-1.5 text-xs text-slate-500 shadow-sm backdrop-blur">
                <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/dashboard" className="hover:text-[#2457a3]" />}>
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {crumbs.map((crumb, idx) => {
                    const path = '/' + crumbs.slice(0, idx + 1).join('/')
                    const label = routeLabels[crumb] || crumb
                    const isLast = idx === crumbs.length - 1

                    return (
                        <React.Fragment key={path}>
                            <BreadcrumbSeparator className="text-slate-300" />
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="font-semibold capitalize text-slate-700">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        render={<Link to={path} className="capitalize hover:text-[#2457a3]" />}
                                    >
                                        {label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
