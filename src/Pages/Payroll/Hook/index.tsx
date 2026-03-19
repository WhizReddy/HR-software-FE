import AxiosInstance from '@/Helpers/Axios'
import { PayrollRow } from '../Interface/Payroll'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

export const usePayroll = (month?: number, year?: number) => {
    return useQuery<PayrollRow[], Error>({
        queryKey: ['payroll', month, year],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (month !== undefined) params.set('month', String(month))
            if (year !== undefined) params.set('year', String(year))
            const url = `/salary${params.toString() ? `?${params.toString()}` : ''}`
            const response = await AxiosInstance.get<PayrollRow[]>(url)
            return response.data
        },
    })
}

export const usePayrollUserId = (month?: number, year?: number) => {
    const { id } = useParams<{ id: string }>()
    return useQuery<PayrollRow[], Error>({
        queryKey: ['payrollId', id, month, year],
        queryFn: async () => {
            const params = new URLSearchParams()
            if (month !== undefined) params.set('month', String(month))
            if (year !== undefined) params.set('year', String(year))
            const url = `/salary/user/${id}${params.toString() ? `?${params.toString()}` : ''}`
            const response = await AxiosInstance.get<PayrollRow[]>(url)
            return response.data
        },
        enabled: Boolean(id),
    })
}
