import Input from '../../../../Components/Input/Index'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import Button from '../../../../Components/Button/Button'
import style from './ProfileForm.module.css'
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
        <div className={style.container}>
            <div className={style.title}>Personal Information</div>

            <div className={style.forms}>
                <div className={style.profile}>
                    <img
                        src={previewImage || user.imageUrl || 'https://via.placeholder.com/70'}
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                        alt="Profile"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{ fontSize: '20px', color: '#000000' }}
                        >{`${user.firstName} ${user.lastName}`}</div>
                        <div style={{ color: '#000000' }}>
                            {user.auth.email}
                        </div>
                    </div>

                    {isCurrentUser && <Image onChange={uploadImage} />}
                </div>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        label="FirstName"
                        width="350px"
                        disabled={!isAdmin}
                        name="firstName"
                        onChange={handleChange}
                        value={user.firstName}
                    />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        type="email"
                        width="350px"
                        label="Email"
                        name="email"
                        disabled={!isAdmin}
                        onChange={handleChange}
                        value={user.auth.email}
                    />
                </div>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        name="lastName"
                        width="350px"
                        disabled={!isAdmin}
                        label="LastName"
                        onChange={handleChange}
                        value={user.lastName}
                    />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        label="BirthDate"
                        width="350px"
                        disabled={!isAdmin}
                        name="dob"
                        onChange={handleChange}
                        value={user.dob}
                    />
                </div>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        disabled={!isAdmin}
                        width="350px"
                        label="CountryOfBirth"
                        name="pob"
                        onChange={handleChange}
                        value={user.pob}
                    />
                </div>
            </div>

            <div className={style.forms}>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        label="Gender"
                        width="350px"
                        disabled={!isAdmin}
                        name="gender"
                        onChange={handleChange}
                        value={user.gender}
                    />
                </div>
                <div className={style.inputWidth}>
                    <Input
                        IsUsername
                        name="phone"
                        width="350px"
                        disabled={!isAdmin}
                        label="PhoneNumber"
                        onChange={handleChange}
                        value={user.phone ? (user.phone.startsWith('+') ? user.phone : `+355${user.phone}`) : ''}
                    />
                </div>
            </div>

            <div className={style.checkboxDiv}>
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
            <div className={style.border}></div>
            {isAdmin ? (
                <div className={style.inputWidth}>
                    <Button
                        onClick={handleUpdate}
                        type={ButtonTypes.PRIMARY}
                        btnText="Save Changes"
                        width="350px"
                    />
                </div>
            ) : (
                isCurrentUser && (
                    <div className={style.inputWidth}>
                        <Button
                            onClick={handleUpdate}
                            type={ButtonTypes.PRIMARY}
                            btnText="Change Picture"
                            width="350px"
                        />
                    </div>
                )
            )}
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
