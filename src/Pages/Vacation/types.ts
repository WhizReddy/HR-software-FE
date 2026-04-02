export type Vacation = {
    _id: string
    type: 'maternity' | 'personal' | 'sick' | 'vacation'
    startDate: string
    endDate: string
    description?: string
    userId: {
        _id: string
        firstName: string
        lastName: string
    }
    status: 'accepted' | 'pending' | 'rejected'
}

export type Vacations = {
    data: Vacation[]
    totalPages: number
    all: number
}

export type UserWithVacation = {
    _id: string
    firstName: string
    lastName: string
    role: 'dev' | 'hr'
    phone: string
    email: string
    imageUrl: string
    vacations: Vacation[]
}

export type UsersWithVacations = {
    data: UserWithVacation[]
    totalPages: number
    all: number
}
