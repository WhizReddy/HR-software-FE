import Input from '../../../../Components/Input/Index'
import Button from '../../../../Components/Button/Button'
import { ButtonTypes } from '../../../../Components/Button/ButtonTypes'
import { usePassword } from './Context/Hook'
import { PasswordProvider } from './Context/PasswordProvider'

function ChangePassContent() {
    const {
        currentPassword,
        newPassword,
        confirmPassword,
        error,
        success,
        handleChange,
        handleUpdatePassword,
    } = usePassword()

    return (
        <>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                }}
            >
                {success && <div style={{ color: 'green' }}>{success}</div>}
                <div>
                    To change your password add your current password then your
                    new password.
                </div>
                <Input
                    label="Current Password"
                    name="currentPassword"
                    isPassword
                    type="password"
                    onChange={handleChange}
                    value={currentPassword}
                    width="350px"
                />
                <Input
                    label="New Password"
                    name="newPassword"
                    isPassword
                    type="password"
                    onChange={handleChange}
                    value={newPassword}
                    width="350px"
                />

                <Input
                    label="Confirm Password"
                    name="confirmPassword"
                    isPassword
                    type="password"
                    onChange={handleChange}
                    value={confirmPassword}
                    width="350px"
                />
                {error && <div style={{ color: '#d32f2f' }}>{error}</div>}
                <Button
                    type={ButtonTypes.PRIMARY}
                    btnText="Update Pass"
                    onClick={handleUpdatePassword}
                    width="350px"
                    marginTop="9px"
                />
            </div>
            <Button
                type={ButtonTypes.SECONDARY}
                btnText="Forget Password"
                width="350px"
                marginTop="9px"
                onClick={() => window.location.href = '/forgot-password'}
            />
        </>
    )
}

const ChangePass: React.FC = () => {
    return (
        <PasswordProvider>
            <ChangePassContent />
        </PasswordProvider>
    )
}

export default ChangePass
