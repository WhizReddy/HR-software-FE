import { useAuth } from '@/features/auth/context/AuthProvider'
import { isAdminRole } from '@/features/auth/lib/access'
import AxiosInstance from '@/Helpers/Axios'
import { UserProfileData } from '@/Pages/Employees/interfaces/Employe'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EmployeePayroll, EmployePayroll } from './Interface'
import { getReturnTo } from '@/Helpers/navigation'

type PayrollResponse =
    | EmployeePayroll[]
    | {
          data?: EmployeePayroll[]
      }

const normalizePayrollRows = (payload: PayrollResponse) => {
    if (Array.isArray(payload)) {
        return payload
    }

    return Array.isArray(payload.data) ? payload.data : []
}

export const useGetAndUpdateUserById = () => {
    const { id } = useParams<{ id: string }>()
    const [user, setUser] = useState<UserProfileData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { userRole, currentUser } = useAuth()

    const isCurrentUser = currentUser?._id === id
    const isAdmin = isAdminRole(userRole)
    const returnTo = getReturnTo(
        location.state,
        isCurrentUser ? '/dashboard' : '/employees',
    )

    useEffect(() => {
        setIsLoading(true)
        AxiosInstance.get<UserProfileData>(`/user/${id}`)
            .then((response) => {
                setUser(response.data)
                setError(null)
            })
            .catch((error) => {
                console.error('Error fetching data:', error)
                setError('Failed to fetch user data')
                setUser(null)
            })
            .finally(() => setIsLoading(false))
    }, [id])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!isAdmin) return
        const { name, value } = event.target
        setUser((prevUser) => {
            if (!prevUser) return null
            if (name === 'email') {
                return {
                    ...prevUser,
                    auth: {
                        ...prevUser.auth,
                        email: value,
                    },
                }
            } else {
                return {
                    ...prevUser,
                    [name]: value,
                }
            }
        })
    }

    const handleUpdate = async (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault()
        if (!user) {
            setError('Only admins can update user information')
            return
        }

        const userToUpdate = {
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,

            pob: user.pob,
            dob: user.dob,
            gender: user.gender,
        }

        setIsLoading(true)
        try {
            await AxiosInstance.patch(`/user/${id}`, userToUpdate)
            navigate(returnTo)
        } catch (error) {
            console.error('Error updating user:', error)
            setError('Failed to update user')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        handleChange,
        handleUpdate,
        user,
        error,
        isLoading,
        isCurrentUser,
        isAdmin,
    }
}

export const useCreatePayroll = () => {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()

    const [payroll, setPayroll] = useState<EmployePayroll>({
        workingDays: undefined,
        grossSalary: undefined,
        bonus: undefined,
        bonusDescription: '',
        extraHours: undefined,
        userId: id || '',
    })
    const [createToastOpen, setCreateToastOpen] = useState(false)
    const [createToastMessage, setCreateToastMessage] = useState('')
    const [createToastSeverity, setCreateToastSeverity] = useState<
        'success' | 'error'
    >('success')
    const [isCreatingPayroll, setIsCreatingPayroll] = useState(false)

    const handleChangePayroll = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target
        setPayroll((prevPayroll) => ({
            ...prevPayroll,
            [name]:
                name === 'bonusDescription'
                    ? value
                    : value === ''
                      ? undefined
                      : Number(value),
        }))
    }

    const handleCreatePayroll = async (
        event: React.FormEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
        if (isCreatingPayroll) return
        const fieldsToCreate = {
            ...payroll,
            workingDays: payroll.workingDays,
            grossSalary: payroll.grossSalary,
            bonus: payroll.bonus,
            bonusDescription: payroll.bonusDescription,
            extraHours: payroll.extraHours,
        }

        setIsCreatingPayroll(true)
        try {
            await AxiosInstance.post('/salary', fieldsToCreate)
            queryClient.invalidateQueries({ queryKey: ['EditingPayroll', id] })
            queryClient.invalidateQueries({ queryKey: ['payroll'] })
            queryClient.invalidateQueries({ queryKey: ['payrollId', id] })
            setCreateToastOpen(true)
            setCreateToastMessage('Payroll created successfully')
            setCreateToastSeverity('success')
        } catch (error) {
            console.error('Error creating payroll:', error)
            setCreateToastOpen(true)
            setCreateToastMessage('Failed to create payroll')
            setCreateToastSeverity('error')
        } finally {
            setIsCreatingPayroll(false)
        }
    }

    const handleCreateToastClose = () => {
        setCreateToastOpen(false)
    }

    return {
        payroll,
        handleChangePayroll,
        handleCreatePayroll,
        createToastMessage,
        createToastOpen,
        createToastSeverity,
        handleCreateToastClose,
        isCreatingPayroll,
    }
}

export const useUpdatePayroll = () => {
    const { id } = useParams<{ id: string }>()
    const queryClient = useQueryClient()
    const currentDate = new Date()
    const targetMonth = currentDate.getMonth()
    const targetYear = currentDate.getFullYear()

    const [EditingPayroll, setEditingPayroll] =
        useState<EmployeePayroll | null>(null)
    const [toastOpen, setToastOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>(
        'success',
    )
    const [isUpdatingPayroll, setIsUpdatingPayroll] = useState(false)

    const { isLoading, error } = useQuery<EmployeePayroll[], Error>({
        queryKey: ['EditingPayroll', id, targetMonth, targetYear],
        queryFn: async () => {
            const params = new URLSearchParams({
                month: String(targetMonth),
                year: String(targetYear),
            })
            const url = `/salary/user/${id}?${params.toString()}`
            const response = await AxiosInstance.get<PayrollResponse>(url)
            const payrollRows = normalizePayrollRows(response.data)
            if (payrollRows.length > 0) {
                setEditingPayroll(payrollRows[0])
            } else {
                setEditingPayroll(null)
            }
            return payrollRows
        },
        enabled: Boolean(id),
    })

    const handleUpdateChangePayroll = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = event.target
        setEditingPayroll((prevPayroll) => {
            if (!prevPayroll) return null
            return {
                ...prevPayroll,
                [name]:
                    name === 'bonusDescription'
                        ? value
                        : value === ''
                          ? undefined
                          : Number(value),
            }
        })
    }

    const handleUpdatePayroll = async (
        event: React.FormEvent<HTMLButtonElement>,
    ) => {
        event.preventDefault()
        if (!EditingPayroll) return
        if (isUpdatingPayroll) return

        const fieldsToUpdate = {
            workingDays: EditingPayroll.workingDays,
            grossSalary: EditingPayroll.grossSalary,
            bonus: EditingPayroll.bonus,
            bonusDescription: EditingPayroll.bonusDescription,
            extraHours: EditingPayroll.extraHours,
        }
        setIsUpdatingPayroll(true)
        try {
            await AxiosInstance.patch(
                `/salary/${EditingPayroll._id}`,
                fieldsToUpdate,
            )
            queryClient.invalidateQueries({ queryKey: ['EditingPayroll', id] })
            queryClient.invalidateQueries({ queryKey: ['payroll'] })
            queryClient.invalidateQueries({ queryKey: ['payrollId', id] })
            setToastMessage('Payroll updated successfully')
            setToastOpen(true)
            setToastSeverity('success')
        } catch (error) {
            console.error('Error updating payroll:', error)
            setToastMessage('Error updating payroll')
            setToastSeverity('error')
            setToastOpen(true)
        } finally {
            setIsUpdatingPayroll(false)
        }
    }

    const handleToastClose = () => {
        setToastOpen(false)
    }

    return {
        EditingPayroll,
        handleUpdateChangePayroll,
        handleUpdatePayroll,
        isLoading,
        error,
        handleToastClose,
        toastOpen,
        toastMessage,
        toastSeverity,
        isUpdatingPayroll,
    }
}
