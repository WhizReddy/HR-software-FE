import { afterEach, describe, expect, it, vi } from 'vitest'
import { getHoldings } from '@/Pages/Holdings/Hook/queries'
import { getAllInventoryItems } from '@/Pages/Inventory/Hook/queries'
import { getUsersWithVacations } from '@/Pages/Vacation/Hook/queries'

const axiosMock = vi.hoisted(() => ({
    get: vi.fn(),
}))

vi.mock('@/Helpers/Axios', () => ({
    default: axiosMock,
}))

describe('backend table filter requests', () => {
    afterEach(() => {
        vi.clearAllMocks()
    })

    it('sends inventory search, status, and type filters', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: { data: [], totalPages: 1, all: 0 },
        })

        await getAllInventoryItems('0', '5', 'mac book', 'assigned', 'laptop')

        expect(axiosMock.get).toHaveBeenCalledWith(
            '/asset?page=0&limit=5&search=mac+book&status=assigned&type=laptop',
        )
    })

    it('sends holdings user and search filters while keeping local fallback', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: { data: [], totalPages: 1, all: 0 },
        })

        await getHoldings({
            pageParam: 0,
            users: 'with',
            search: 'redi',
        })

        expect(axiosMock.get).toHaveBeenCalledWith(
            '/asset/user?page=0&limit=100&search=redi&users=with',
        )
    })

    it('sends vacation user and search filters while keeping local fallback', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: { data: [], totalPages: 1, all: 0 },
        })

        await getUsersWithVacations({
            pageParam: 0,
            users: 'without',
            search: 'red',
        })

        expect(axiosMock.get).toHaveBeenCalledWith(
            '/vacation/user?page=0&limit=100&search=red&users=without',
        )
    })
})
