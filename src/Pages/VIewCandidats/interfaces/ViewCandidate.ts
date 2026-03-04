export interface CandidateView {
    id: number
    originalId: string | number
    firstName: string
    lastName: string
    phoneNumber: string
    email: string
    experience: string
    applicationMethod: string
    dob: string
    positionApplied: string
    technologiesUsed: string[]
    salaryExpectations: string
    status: string
    cvAttachment: string
    currentPhase?: string
    firstInterviewDate?: string
    secondInterviewDate?: string
}

export type ModalAction = 'active' | 'reject' | 'employ'
