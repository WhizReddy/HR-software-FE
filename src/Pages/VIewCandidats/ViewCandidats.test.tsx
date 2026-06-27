import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import ViewCandidats from './ViewCandidats'

const candidateHookMock = vi.hoisted(() => ({
    handleOpenModal: vi.fn(),
    applicant: {
        id: 1,
        originalId: 'candidate-1',
        firstName: 'Ana',
        lastName: 'Hoxha',
        phoneNumber: '+355691234567',
        email: 'ana@example.com',
        experience: '2 years',
        applicationMethod: 'website',
        dob: '1998-01-01T00:00:00.000Z',
        positionApplied: 'Frontend Developer',
        technologiesUsed: ['React'],
        salaryExpectations: '1000',
        status: 'active',
        cvAttachment: 'cv/file.pdf',
        currentPhase: 'second_interview',
        firstInterviewDate: '2026-07-01T10:00:00.000Z',
        secondInterviewDate: '2026-07-05T10:00:00.000Z',
        notes: '',
    },
}))

vi.mock('./Hook', () => ({
    useApplicantById: () => ({
        applicant: candidateHookMock.applicant,
        showModal: false,
        handleCloseModal: vi.fn(),
        handleOpenModal: candidateHookMock.handleOpenModal,
        handleConfirm: vi.fn(),
        showConfirmationModal: false,
        firstInterviewDate: '',
        setFirstInterviewDate: vi.fn(),
        interviewNotesDraft: '',
        setInterviewNotesDraft: vi.fn(),
        customMessage: '',
        setCustomMessage: vi.fn(),
        handleSend: vi.fn(),
        handleCloseConfirmationModal: vi.fn(),
        customSubject: '',
        setCustomSubject: vi.fn(),
        secondInterviewDate: '',
        setSecondInterviewDate: vi.fn(),
        modalAction: '',
        interviewStep: 'second',
        toastOpen: false,
        toastMessage: '',
        toastSeverity: 'success',
        handleToastClose: vi.fn(),
        isActionPending: false,
    }),
}))

vi.mock('@/Helpers/Axios', () => ({
    resolveApiAssetUrl: (value: string) => value,
}))

describe('ViewCandidats', () => {
    afterEach(() => {
        cleanup()
        candidateHookMock.handleOpenModal.mockClear()
        candidateHookMock.applicant.currentPhase = 'second_interview'
        candidateHookMock.applicant.firstInterviewDate =
            '2026-07-01T10:00:00.000Z'
        candidateHookMock.applicant.secondInterviewDate =
            '2026-07-05T10:00:00.000Z'
    })

    it('lets HR reschedule the first interview from the candidate page', () => {
        candidateHookMock.applicant.currentPhase = 'first_interview'
        candidateHookMock.applicant.secondInterviewDate = ''

        render(
            <MemoryRouter>
                <ViewCandidats />
            </MemoryRouter>,
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /reschedule phase 1 interview/i,
            }),
        )

        expect(candidateHookMock.handleOpenModal).toHaveBeenCalledWith(
            'active',
            'first',
        )
    })

    it('lets HR reschedule the second interview from the candidate page', () => {
        render(
            <MemoryRouter>
                <ViewCandidats />
            </MemoryRouter>,
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: /reschedule phase 2 interview/i,
            }),
        )

        expect(candidateHookMock.handleOpenModal).toHaveBeenCalledWith(
            'active',
            'second',
        )
    })
})
