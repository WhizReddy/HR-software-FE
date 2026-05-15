import React, { ReactNode } from 'react'
import { ProfileContext } from './Interface'
import { useGetAndUpdateUserById } from './Hook'

interface ProfileProviderProps {
    children: ReactNode
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({
    children,
}) => {
    const {
        user,
        error,
        isLoading,
        isCurrentUser,
        isAdmin,
        handleChange,
        handleUpdate,
    } = useGetAndUpdateUserById()

    const value = {
        user,
        error,
        isLoading,
        isCurrentUser,
        isAdmin,
        handleChange,
        handleUpdate,
    }

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    )
}
