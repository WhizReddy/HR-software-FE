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

    const { user, isCurrentUser, isAdmin, handleChange, handleUpdate } =
        useProfile()

    if (!user) {
        return <div>No user data available</div>
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

            {/* Left Column - Photo & Status Card */}
            <div className="xl:col-span-1 space-y-6">
                <div className="glass-card p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm border border-slate-100/50 bg-white/70">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 relative z-10">
                            <img
                                src={previewImage || user.imageUrl || 'https://via.placeholder.com/150'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                alt="Profile"
                            />
                        </div>
                        {isCurrentUser && (
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Image onChange={uploadImage} />
                            </div>
                        )}
                        {/* Decorative Background Glows */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#2457a3]/20 rounded-full blur-2xl z-0"></div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-800">{`${user.firstName} ${user.lastName}`}</h2>
                        <p className="text-sm font-medium text-slate-500">{user.auth.email}</p>
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
                                <Button
                                    onClick={handleUpdate}
                                    type={ButtonTypes.PRIMARY}
                                    btnText="Change Picture"
                                    className="w-full bg-[#2457a3] hover:bg-[#1a407a] text-white transition-all shadow-md active:scale-95 py-2.5 rounded-lg font-medium"
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Status Toggles Card */}
                <div className="glass-card p-6 shadow-sm border border-slate-100/50 bg-white/70 space-y-4">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100/50 pb-2">Employment Status</h3>
                    <div className="flex flex-col gap-3">
                        <Input
                            isCheckBox
                            label="Public Holidays"
                            name="check"
                            disabled={!isAdmin}
                        />
                        <Input
                            isCheckBox
                            label="Remote"
                            name="check"
                            disabled={!isAdmin}
                        />
                        <Input
                            isCheckBox
                            label="External"
                            name="check"
                            disabled={!isAdmin}
                        />
                    </div>
                </div>
            </div>

            {/* Right Column - Personal Information Card */}
            <div className="xl:col-span-2">
                <div className="glass-card p-8 shadow-sm border border-slate-100/50 bg-white/70 h-full">
                    <h3 className="text-lg font-bold text-[#2457a3] mb-6 border-b border-slate-100/50 pb-4">Personal Details</h3>

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
