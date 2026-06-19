import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor,
} from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import NotificationDropdown from './Notification'

const axiosMock = vi.hoisted(() => ({
    get: vi.fn(),
    patch: vi.fn(),
}))

vi.mock('@/Helpers/Axios', () => ({
    default: axiosMock,
}))

vi.mock('@/features/auth/context/AuthProvider', () => ({
    useAuth: () => ({
        currentUser: {
            _id: 'user-1',
            role: 'admin',
        },
    }),
}))

const LocationDisplay = () => {
    const location = useLocation()
    return (
        <div data-testid="location">{location.pathname + location.search}</div>
    )
}

const renderNotifications = () =>
    render(
        <MemoryRouter
            initialEntries={['/dashboard']}
            future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
            <Routes>
                <Route
                    path="*"
                    element={
                        <>
                            <NotificationDropdown />
                            <LocationDisplay />
                        </>
                    }
                />
            </Routes>
        </MemoryRouter>,
    )

describe('NotificationDropdown', () => {
    afterEach(() => {
        cleanup()
        vi.clearAllMocks()
    })

    it('marks an event notification as read and navigates to the event route', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'notification-1',
                    title: 'New event',
                    type: 'events',
                    typeId: 'event-1',
                    content: 'Open team event',
                    date: '2026-06-13',
                    isRead: false,
                },
            ],
        })
        axiosMock.patch.mockResolvedValueOnce({ data: {} })

        renderNotifications()

        fireEvent.click(
            await screen.findByLabelText(/Notifications, 1 unread/i),
        )
        fireEvent.click(await screen.findByText('New event'))

        await waitFor(() => {
            expect(axiosMock.patch).toHaveBeenCalledWith(
                'notification/notification-1/user/user-1',
            )
            expect(screen.getByTestId('location').textContent).toBe(
                '/events?event=event-1&page=0&limit=6',
            )
        })
    })

    it('loads the weekly notification view from the period switch', async () => {
        axiosMock.get
            .mockResolvedValueOnce({ data: [] })
            .mockResolvedValueOnce({ data: [] })

        renderNotifications()

        fireEvent.click(await screen.findByLabelText(/Notifications/i))
        fireEvent.click(await screen.findByText('This week'))

        await waitFor(() => {
            expect(axiosMock.get).toHaveBeenLastCalledWith(
                'notification/user/user-1?period=week',
            )
        })
    })

    it('marks a notification from the inline action without navigating', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'notification-2',
                    title: 'Vacation request',
                    type: 'vacation',
                    typeId: 'vacation-1',
                    content: 'A vacation request needs review',
                    date: '2026-06-14',
                    isRead: false,
                },
            ],
        })
        axiosMock.patch.mockResolvedValueOnce({ data: {} })

        renderNotifications()

        fireEvent.click(
            await screen.findByLabelText(/Notifications, 1 unread/i),
        )
        fireEvent.click(
            await screen.findByRole('button', {
                name: 'Mark notification as read',
            }),
        )

        await waitFor(() => {
            expect(axiosMock.patch).toHaveBeenCalledWith(
                'notification/notification-2/user/user-1',
            )
            expect(screen.getByTestId('location').textContent).toBe(
                '/dashboard',
            )
        })
    })

    it('uses the bulk endpoint when marking all notifications as read', async () => {
        axiosMock.get.mockResolvedValueOnce({
            data: [
                {
                    _id: 'notification-3',
                    title: 'Candidate update',
                    type: 'candidates',
                    typeId: 'candidate-1',
                    content: 'A candidate needs review',
                    date: '2026-06-14',
                    isRead: false,
                },
                {
                    _id: 'notification-4',
                    title: 'Leave request',
                    type: 'vacation',
                    typeId: 'vacation-2',
                    content: 'A leave request needs review',
                    date: '2026-06-14',
                    isRead: false,
                },
            ],
        })
        axiosMock.patch.mockResolvedValueOnce({ data: { updated: 2 } })

        renderNotifications()

        fireEvent.click(
            await screen.findByLabelText(/Notifications, 2 unread/i),
        )
        fireEvent.click(
            await screen.findByRole('button', {
                name: /mark all as read/i,
            }),
        )

        await waitFor(() => {
            expect(axiosMock.patch).toHaveBeenCalledTimes(1)
            expect(axiosMock.patch).toHaveBeenCalledWith(
                'notification/user/user-1/read-all?period=today',
            )
        })
    })
})
