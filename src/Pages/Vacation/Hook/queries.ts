import AxiosInstance from '@/Helpers/Axios'
import { CreateVacationFormFields } from '@/Schemas/Vacations/CreateVacation.schema'
import { VacationFormFields } from '@/Schemas/Vacations/Vacation.schema'
import {
    UsersWithVacations,
    UserWithVacation,
    Vacation,
    Vacations,
} from '../types'
import {
    fetchAllPaginatedData,
    matchesSearchText,
    normalizePaginatedResponse,
    paginateClientRows,
    PaginatedResponse,
} from '@/Helpers/clientTableFiltering'

const LIMIT = 5

export const getAllVacations = async (
    page: string,
    limit: string,
    search?: string,
    status?: string,
    type?: string,
): Promise<Vacations> => {
    const params = new URLSearchParams({
        page,
        limit,
    })

    if (search) {
        params.set('search', search)
    }

    if (status) {
        params.set('status', status)
    }

    if (type) {
        params.set('type', type)
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
    const fetchUsersPage = async (
        page: number,
        limit: number,
    ): Promise<PaginatedResponse<UserWithVacation>> => {
        const params = new URLSearchParams({
            page: String(page),
            limit: String(limit),
        })

        if (search.trim()) {
            params.set('search', search)
        }

        if (users && users !== 'all') {
            params.set('users', users)
        }

        const response = await AxiosInstance.get(
            `/vacation/user?${params.toString()}`,
        )
        return normalizePaginatedResponse(response.data)
    }

    const shouldFilterClientSide = search.trim() !== '' || users !== ''

    if (shouldFilterClientSide) {
        const allUsers =
            await fetchAllPaginatedData<UserWithVacation>(fetchUsersPage)
        const filteredUsers = allUsers.filter((user) => {
            const vacationCount = user.vacations?.length ?? 0
            const matchesUserFilter =
                !users ||
                (users === 'with' && vacationCount > 0) ||
                (users === 'without' && vacationCount === 0)

            return (
                matchesUserFilter &&
                matchesSearchText(search, [
                    `${user.firstName} ${user.lastName}`,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phone,
                    user.role,
                ])
            )
        })
        const paginatedUsers = paginateClientRows(
            filteredUsers,
            pageParam,
            LIMIT,
        )

        return {
            data: paginatedUsers.data,
            totalPages: paginatedUsers.totalPages,
            all: paginatedUsers.all,
        }
    }

    const response = await fetchUsersPage(pageParam, LIMIT)
    return {
        data: response.data,
        totalPages: response.totalPages ?? 1,
        all: response.all ?? response.data.length,
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
