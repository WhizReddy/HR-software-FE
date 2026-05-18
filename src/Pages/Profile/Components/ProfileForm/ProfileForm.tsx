import { useRef } from 'react'
import { ShieldCheck, UserRound } from 'lucide-react'
import Input from '../../../../Components/Input/Index'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import Button from '../../../../Components/Button/Button'
import Image from '../../../../Components/uploads/uploadImage'
import { useFileUpload } from '../../Context/Hook'
import { useProfile } from './Context/ProfileContext'
import { FileUploadProvider } from '../../Context/FileUpoadProvider'
import { ProfileProvider } from './Context/ProfileProvider'

const ProfileFormContext = () => {
    const { uploadImage, previewImage } = useFileUpload()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { user, isCurrentUser, isAdmin, handleChange, handleUpdate } =
        useProfile()

    if (!user) {
        return <div>No user data available</div>
    }

    const fullName = `${user.firstName} ${user.lastName}`.trim()
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`
        .trim()
        .toUpperCase()
    const profileImage = previewImage || user.imageUrl
    const statusCards = [
        {
            label: 'Role',
            value: user.role || 'Employee',
        },
        {
            label: 'Profile Access',
            value: isAdmin ? 'Admin editable' : 'Read only',
        },
        {
            label: 'Photo Updates',
            value: isCurrentUser ? 'Self upload enabled' : 'Owner only',
        },
    ]

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left Column - Photo & Status Card */}
            <div className="xl:col-span-1 space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative group">
                        <div className="relative z-10 flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt={fullName || 'Profile'}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-blue-50 text-3xl font-black text-[#2457a3]">
                                    {initials || <UserRound size={36} />}
                                </div>
                            )}
                        </div>
                        {isCurrentUser && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Image onChange={uploadImage} />
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{fullName}</h2>
                        <p className="break-all text-sm font-medium text-slate-500">{user.auth.email}</p>
                    </div>

                    <div className="w-full pt-4 border-t border-slate-100/50">
                        {isAdmin ? (
                            <Button
                                onClick={handleUpdate}
                                type={ButtonTypes.PRIMARY}
                                btnText="Save Changes"
                                className="w-full bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
                            />
                        ) : (
                            isCurrentUser && (
                                <>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={uploadImage}
                                        className="hidden"
                                    />
                                    <Button
                                        onClick={() => fileInputRef.current?.click()}
                                        type={ButtonTypes.PRIMARY}
                                        btnText="Upload New Picture"
                                        className="w-full bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
                                    />
                                </>
                            )
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2457a3]">
                            <ShieldCheck size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
                                Account Status
                            </h3>
                            <p className="text-sm text-slate-500">
                                Saved permissions and profile ownership.
                            </p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {statusCards.map((item) => (
                            <div
                                key={item.label}
                                className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3"
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">
                                    {item.label}
                                </p>
                                <p className="mt-2 text-sm font-semibold text-slate-800">
                                    {item.value}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column - Personal Information Card */}
            <div className="xl:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm h-full">
                    <h3 className="text-lg font-bold text-[#2457a3] mb-6 border-b border-slate-100 pb-4">Personal Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="space-y-1">
                            <Input
                                IsUsername
                                label="First Name"
                                width="100%"
                                disabled={!isAdmin}
                                name="firstName"
                                onChange={handleChange}
                                value={user.firstName}
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                IsUsername
                                label="Last Name"
                                name="lastName"
                                width="100%"
                                disabled={!isAdmin}
                                onChange={handleChange}
                                value={user.lastName}
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                IsUsername
                                type="email"
                                width="100%"
                                label="Email"
                                name="email"
                                disabled={!isAdmin}
                                onChange={handleChange}
                                value={user.auth.email}
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                IsUsername
                                name="phone"
                                width="100%"
                                disabled={!isAdmin}
                                label="Phone Number"
                                onChange={handleChange}
                                value={user.phone ? (user.phone.startsWith('+') ? user.phone : `+355${user.phone}`) : ''}
                            />
                        </div>

                        <div className="space-y-1">
                            <Input
                                IsUsername
                                label="Birth Date"
                                width="100%"
                                disabled={!isAdmin}
                                name="dob"
                                onChange={handleChange}
                                value={user.dob}
                            />
                        </div>
                        <div className="space-y-1">
                            <Input
                                IsUsername
                                disabled={!isAdmin}
                                width="100%"
                                label="Country of Birth"
                                name="pob"
                                onChange={handleChange}
                                value={user.pob}
                            />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <Input
                                IsUsername
                                label="Gender"
                                width="100%"
                                disabled={!isAdmin}
                                name="gender"
                                onChange={handleChange}
                                value={user.gender}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProfileForm: React.FC = () => {
    return (
        <FileUploadProvider>
            <ProfileProvider>
                <ProfileFormContext />
            </ProfileProvider>
        </FileUploadProvider>
    )
}

export default ProfileForm
