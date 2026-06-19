import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { Careers } from './Career'

const careerHookMock = vi.hoisted(() => ({
    events: [
        {
            _id: 'role-1',
            title: 'Frontend Developer',
            description: 'Build polished People Hub product screens.',
            location: 'Tirana',
            type: 'career',
        },
    ],
    isLoading: false,
}))

vi.mock('@/features/auth/context/AuthProvider', () => ({
    useAuth: () => ({
        currentUser: null,
    }),
}))

vi.mock('./Hook', () => ({
    useGetAllEvents: () => ({
        events: careerHookMock.events,
        setEvents: vi.fn(),
        isLoading: careerHookMock.isLoading,
    }),
    useCreateEvent: () => ({
        createEvent: vi.fn(),
        handleChange: vi.fn(),
        event: {
            title: '',
            description: '',
            location: '',
            type: 'career',
        },
        createEventError: null,
        isCreatingEvent: false,
    }),
    useUpdateEvent: () => ({
        editingEvent: null,
        handleEditChange: vi.fn(),
        updateEvent: vi.fn(),
        setEditingEvent: vi.fn(),
        isUpdatingEvent: false,
    }),
    useDeleteEvent: () => ({
        handleDelete: vi.fn(),
        closeModal: vi.fn(),
        showModal: false,
        handleDeleteEventModal: vi.fn(),
        eventToDeleteId: null,
        isDeletingEvent: false,
    }),
}))

describe('Career page', () => {
    afterEach(() => {
        cleanup()
        careerHookMock.events = [
            {
                _id: 'role-1',
                title: 'Frontend Developer',
                description: 'Build polished People Hub product screens.',
                location: 'Tirana',
                type: 'career',
            },
        ]
        careerHookMock.isLoading = false
    })

    it('renders People Hub public navigation and recruitment links', () => {
        render(
            <MemoryRouter>
                <Careers />
            </MemoryRouter>,
        )

        expect(screen.getByText('People Hub')).toBeTruthy()
        expect(
            screen
                .getAllByRole('link', { name: /^open roles$/i })[0]
                .getAttribute('href'),
        ).toBe('#open-roles')
        expect(
            screen
                .getAllByRole('link', { name: /sign in/i })[0]
                .getAttribute('href'),
        ).toBe('/')
        expect(
            screen
                .getByRole('link', { name: /submit application/i })
                .getAttribute('href'),
        ).toBe('/recruitment')
        expect(
            screen
                .getAllByRole('link', { name: /^apply$/i })[0]
                .getAttribute('href'),
        ).toBe('#application-notes')
        expect(screen.getByText('Open roles, written clearly.')).toBeTruthy()
        expect(screen.getByText('Before applying')).toBeTruthy()
    })

    it('renders loading and empty public states', () => {
        careerHookMock.isLoading = true

        const { rerender } = render(
            <MemoryRouter>
                <Careers />
            </MemoryRouter>,
        )

        expect(document.querySelector('.animate-pulse')).toBeTruthy()

        careerHookMock.isLoading = false
        careerHookMock.events = []

        rerender(
            <MemoryRouter>
                <Careers />
            </MemoryRouter>,
        )

        expect(screen.getByText('No open role matches right now')).toBeTruthy()
    })
})
