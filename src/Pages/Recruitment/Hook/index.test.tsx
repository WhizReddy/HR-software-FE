import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createRef } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AxiosInstance from '@/Helpers/Axios'
import { RecruitmentContext } from '../Context/RecruitmentContext'
import { useRecruitmentForm } from '.'

vi.mock('@/Helpers/Axios', () => ({
    default: {
        post: vi.fn(),
    },
}))

const createFileList = (file: File) =>
    ({
        0: file,
        length: 1,
        item: (index: number) => (index === 0 ? file : null),
    }) as unknown as FileList

const wrapper = ({ children }: { children: ReactNode }) => (
    <RecruitmentContext.Provider
        value={{
            error: null,
            setError: vi.fn(),
            showModal: false,
            setShowModal: vi.fn(),
            fileInputRef: createRef<HTMLInputElement>(),
            fileName: 'cv.pdf',
            setFileName: vi.fn(),
        }}
    >
        {children}
    </RecruitmentContext.Provider>
)

const fillForm = (form: ReturnType<typeof useRecruitmentForm>['form']) => {
    const file = new File(['cv'], 'cv.pdf', { type: 'application/pdf' })

    form.setFieldValue('applicationMethod', 'website')
    form.setFieldValue('dob', '1998-01-01')
    form.setFieldValue('email', 'ana@example.com')
    form.setFieldValue('experience', '2 years')
    form.setFieldValue('file', createFileList(file))
    form.setFieldValue('firstName', 'Ana')
    form.setFieldValue('lastName', 'Hoxha')
    form.setFieldValue('phoneNumber', '+355 69 123 4567')
    form.setFieldValue('positionApplied', 'Frontend Developer')
    form.setFieldValue('salaryExpectations', '1000')
    form.setFieldValue('technologiesUsed', ['React'])
}

describe('useRecruitmentForm', () => {
    afterEach(() => {
        vi.mocked(AxiosInstance.post).mockReset()
    })

    it('lets Axios set the multipart boundary for CV uploads', async () => {
        vi.mocked(AxiosInstance.post).mockResolvedValue({ status: 201 })
        const { result } = renderHook(() => useRecruitmentForm(), { wrapper })

        act(() => fillForm(result.current.form))
        await act(async () => {
            await result.current.form.handleSubmit()
        })

        expect(AxiosInstance.post).toHaveBeenCalledTimes(1)
        expect(AxiosInstance.post).toHaveBeenCalledWith(
            '/applicant',
            expect.any(FormData),
        )
    })

    it('ignores repeated submit attempts while the CV request is pending', async () => {
        let resolvePost: (value: { status: number }) => void = () => undefined
        vi.mocked(AxiosInstance.post).mockReturnValue(
            new Promise((resolve) => {
                resolvePost = resolve
            }),
        )
        const { result } = renderHook(() => useRecruitmentForm(), { wrapper })

        act(() => fillForm(result.current.form))
        act(() => {
            void result.current.form.handleSubmit()
            void result.current.form.handleSubmit()
        })

        await waitFor(() => {
            expect(AxiosInstance.post).toHaveBeenCalledTimes(1)
        })

        await act(async () => {
            resolvePost({ status: 201 })
        })
    })
})
