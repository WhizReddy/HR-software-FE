import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AxiosInstance from '../../../Helpers/Axios'
import { useApplicantById } from '.'

vi.mock('../../../Helpers/Axios', () => ({
    default: {
        get: vi.fn(),
        patch: vi.fn(),
    },
}))

vi.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'candidate-1' }),
}))

const applicant = {
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
    currentPhase: 'first_interview',
    firstInterviewDate: '2026-07-01T10:00:00.000Z',
    secondInterviewDate: '',
    notes: 'Existing note',
}

describe('useApplicantById', () => {
    afterEach(() => {
        vi.mocked(AxiosInstance.get).mockReset()
        vi.mocked(AxiosInstance.patch).mockReset()
    })

    it('sends interview notes when rescheduling from candidate view', async () => {
        vi.mocked(AxiosInstance.get).mockResolvedValue({ data: applicant })
        vi.mocked(AxiosInstance.patch).mockResolvedValue({ status: 200 })

        const { result } = renderHook(() => useApplicantById())

        await waitFor(() => {
            expect(result.current.applicant?.originalId).toBe('candidate-1')
        })

        act(() => {
            result.current.handleOpenModal('active', 'first')
        })
        act(() => {
            result.current.setFirstInterviewDate('2026-07-10T10:30')
            result.current.setInterviewNotesDraft('Bring portfolio examples')
        })

        await act(async () => {
            await result.current.handleSend()
        })

        expect(AxiosInstance.patch).toHaveBeenCalledWith(
            '/applicant/candidate-1',
            expect.objectContaining({
                firstInterviewDate: new Date(
                    '2026-07-10T10:30',
                ).toISOString(),
                currentPhase: 'first_interview',
                status: 'active',
                notes: 'Bring portfolio examples',
            }),
        )
    })
})
