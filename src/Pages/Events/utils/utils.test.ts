import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchEvents } from './utils'

const axiosMock = vi.hoisted(() => ({
    get: vi.fn(),
}))

vi.mock('@/Helpers/Axios', () => ({
    default: axiosMock,
}))

describe('fetchEvents', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('normalizes array event responses to a paginated shape', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'event-1',
                    title: 'Team Day',
                    description: '',
                    startDate: '',
                    endDate: '',
                    email: [],
                    time: '',
                    creatingTime: '',
                    file: '',
                    location: 'Tirana',
                    type: 'other',
                    photo: [],
                    participants: [],
                    totalPages: 1,
                    onClose: () => undefined,
                },
            ],
        })

        const result = await fetchEvents('team', 0, 6)

        expect(axiosMock.get).toHaveBeenCalledWith(
            '/event?page=0&limit=6&search=team',
        )
        expect(result.data).toHaveLength(1)
        expect(result.totalPages).toBe(1)
        expect(result.all).toBe(1)
    })
})
