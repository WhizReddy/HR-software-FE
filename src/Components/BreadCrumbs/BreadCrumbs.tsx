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

type BreadcrumbRoute = {
    label: string
    to?: string
}

const staticRoutes: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/employees': 'Employees',
    '/candidates': 'Candidates',
    '/interview': 'Interview',
    '/events': 'Events',
    '/career-posts': 'Career Posts',
    '/payroll': 'Payroll',
    '/vacation': 'Vacation',
    '/holdings': 'Holdings',
    '/inventory': 'Inventory',
    '/historic': 'Analytics',
}

const getBreadcrumbRoutes = (pathname: string): BreadcrumbRoute[] => {
    const normalizedPath = pathname.replace(/\/+$/, '') || '/'

    if (staticRoutes[normalizedPath]) {
        return [{ label: staticRoutes[normalizedPath] }]
    }

    if (/^\/profile\/[^/]+$/.test(normalizedPath)) {
        return [{ label: 'Profile' }]
    }

    if (/^\/view\/[^/]+$/.test(normalizedPath)) {
        return [
            { label: 'Candidates', to: '/candidates' },
            { label: 'Candidate Details' },
        ]
    }

    if (/^\/vacation\/[^/]+$/.test(normalizedPath)) {
        return [
            { label: 'Vacation', to: '/vacation' },
            { label: 'User Vacation' },
        ]
    }

    if (/^\/payroll\/user\/[^/]+$/.test(normalizedPath)) {
        return [
            { label: 'Payroll', to: '/payroll' },
            { label: 'User Payroll' },
        ]
    }

    return normalizedPath
        .split('/')
        .filter(Boolean)
        .map((segment) => ({
            label: decodeURIComponent(segment)
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (letter) => letter.toUpperCase()),
        }))
}

export const BreadcrumbComponent: React.FC = () => {
    const { pathname } = useLocation()
    const crumbs = getBreadcrumbRoutes(pathname)

    if (crumbs.length === 0) return null

    return (
        <Breadcrumb className="mb-4">
            <BreadcrumbList className="inline-flex rounded-md border border-slate-200/80 bg-white px-3 py-1.5 text-xs text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <BreadcrumbItem>
                    <BreadcrumbLink render={<Link to="/dashboard" className="hover:text-[#2457a3]" />}>
                        Home
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {crumbs.map((crumb, idx) => {
                    const isLast = idx === crumbs.length - 1

                    return (
                        <React.Fragment key={`${crumb.label}-${idx}`}>
                            <BreadcrumbSeparator className="text-slate-300" />
                            <BreadcrumbItem>
                                {isLast || !crumb.to ? (
                                    <BreadcrumbPage className="font-semibold capitalize text-slate-700">
                                        {crumb.label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink
                                        render={<Link to={crumb.to} className="capitalize hover:text-[#2457a3]" />}
                                    >
                                        {crumb.label}
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
