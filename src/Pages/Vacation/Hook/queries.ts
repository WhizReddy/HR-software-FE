import AxiosInstance from '@/Helpers/Axios'
import { CreateVacationFormFields } from '@/Schemas/Vacations/CreateVacation.schema'
import { VacationFormFields } from '@/Schemas/Vacations/Vacation.schema'
import {
    UsersWithVacations,
    UserWithVacation,
    Vacation,
    Vacations,
} from '../types'

const LIMIT = 5

export const getAllVacations = async (
    page: string,
    limit: string,
    search?: string,
): Promise<Vacations> => {
    const params = new URLSearchParams({
        page,
        limit,
    })

    if (search) {
        params.set('search', search)
    }

    return (await AxiosInstance.get(`/vacation?${params.toString()}`)).data
}

export const getUsersWithVacations = async ({
    pageParam,
    search,
    users,
}: {
    pageParam: number
    search: string
    users: string
}): Promise<UsersWithVacations> => {
    const params = new URLSearchParams({
        page: String(pageParam),
        limit: String(LIMIT),
    })

    if (search) {
        params.set('search', search)
    }

    if (users) {
        params.set('users', users)
    }

    const response = await AxiosInstance.get(`/vacation/user?${params.toString()}`)
    return {
        data: response.data.data,
        totalPages: response.data.totalPages,
        all: response.data.all,
    }
}

export const getUserWithVacations = async (
    id: string,
): Promise<UserWithVacation> => {
    return (await AxiosInstance.get(`/vacation/user/${id}`)).data
}

export const getVacation = async (id: string): Promise<Vacation> => {
    return (await AxiosInstance.get(`/vacation/${id}`)).data
}

export const updateVacation = async (
    id: string,
    vacation: VacationFormFields,
) => {
    return (await AxiosInstance.patch(`/vacation/${id}`, vacation)).data
}
export const createVacation = async (vacation: CreateVacationFormFields) => {
    return (await AxiosInstance.post(`/vacation`, vacation)).data
}
