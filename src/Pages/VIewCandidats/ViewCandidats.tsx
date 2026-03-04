import Card from '../../Components/Card/Card';
import style from './styles/ViewCandidats.module.css';
import { useApplicantById } from './Hook';
import Button from '../../Components/Button/Button';
import { ButtonTypes } from '../../Components/Button/ButtonTypes';
import { ModalComponent } from '../../Components/Modal/Modal';
import Input from '@/Components/Input/Index';
import { useState } from 'react';

import Toast from '@/Components/Toast/Toast';

export default function ViewCandidats() {
    const {
        applicant,
        showModal,
        handleCloseModal,
        handleOpenModal,
        handleConfirm,
        showConfirmationModal,
        firstInterviewDate,
        setFirstInterviewDate,
        customMessage,
        setCustomMessage,
        handleSend,
        handleCloseConfirmationModal,
        customSubject,
        setCustomSubject,
        secondInterviewDate,
        setSecondInterviewDate,
        modalAction,
        toastOpen,
        toastMessage,
        toastSeverity,
        handleToastClose
    } = useApplicantById()

    const calculateAge = (dob: string): number => {
        const birthDate = new Date(dob)
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDifference = today.getMonth() - birthDate.getMonth()

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--
        }
        return age;
    };
    const [useCustomEmail, setUseCustomEmail] = useState(false)


    return (
        <div className={style.container}>
            <Card
                flex="2"
                borderRadius="5px"
                padding="32px"
                border="1px solid #ebebeb"
            >
                <div className={style.columContanier}>
                    <div className={style.column}>
                        <div className={style.section}>
                            <div className={style.label}>First Name</div>
                            <div className={style.value}>
                                {applicant?.firstName}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Email</div>
                            <div className={style.value}>
                                {applicant?.email}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Age</div>

                            <div className={style.value}>
                                {applicant?.dob
                                    ? calculateAge(applicant.dob.split('T')[0])
                                    : 'N/A'}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Work Position</div>
                            <div className={style.value}>
                                {applicant?.positionApplied}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Experience</div>
                            <div className={style.value}>
                                {applicant?.experience}
                            </div>
                        </div>
                        <div className={style.border}></div>
                    </div>

                    <div className={style.column}>
                        <div className={style.section}>
                            <div className={style.label}>Last Name</div>
                            <div className={style.value}>
                                {applicant?.lastName}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Phone Number</div>
                            <div className={style.value}>
                                {applicant?.phoneNumber}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Applying Method</div>
                            <div className={style.value}>
                                {applicant?.applicationMethod}
                            </div>
                        </div>
                        <div className={style.border}></div>

                        <div className={style.section}>
                            <div className={style.label}>Wage Expectation</div>
                            <div className={style.value}>
                                {applicant?.salaryExpectations}
                            </div>
                        </div>
                        <div className={style.border}></div>
                        <div className={style.centerStatus}>
                            <div className={style.label}>Status</div>
                            <div
                                className={`${style.value} ${applicant?.status === 'active'
                                    ? style.statusActive
                                    : applicant?.status === 'rejected'
                                        ? style.statusRejected
                                        : ''
                                    }`}
                            >
                                {applicant?.status}
                            </div>
                        </div>
                        <div className={style.border}></div>
                    </div>
                </div>
            </Card>
            <Card
                flex="1"
                borderRadius="5px"
                padding="32px"
                border="1px solid #ebebeb"
            >
                <div className={style.section}>
                    <div className={style.section}>
                        <div className={style.label}>Technologies Used</div>
                        <div className={style.value}>
                            {applicant?.technologiesUsed}
                        </div>
                    </div>
                    <div className={style.border}></div>{' '}
                    <div className={style.section}>
                        <div className={style.label}>CV</div>
                        <div className={style.value}>
                            {applicant?.cvAttachment && (
                                <a
                                    href={applicant.cvAttachment}
                                    target="_blank"
                                >
                                    {' '}
                                    View CV
                                </a>
                            )}
                        </div>
                    </div>
                    <div className={style.border}></div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '10px',
                        flexDirection: 'column',
                        marginTop: '15px'
                    }}
                >
                    <div className={style.label}>Actions:</div>

                    {applicant?.status !== 'rejected' && applicant?.status !== 'employed' && (
                        <>
                            {applicant?.currentPhase === 'first_interview' ? (
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    btnText="Schedule Phase 2 Interview"
                                    width="100%"
                                    onClick={() => handleOpenModal('active')}
                                />
                            ) : (
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    btnText="Schedule Interview"
                                    width="100%"
                                    onClick={() => handleOpenModal('active')}
                                />
                            )}

                            {applicant?.currentPhase !== 'applicant' && (
                                <Button
                                    type={ButtonTypes.PRIMARY}
                                    btnText="Employ Candidate"
                                    width="100%"
                                    onClick={() => handleOpenModal('employ')}
                                />
                            )}

                            <Button
                                type={ButtonTypes.SECONDARY}
                                btnText="Reject Candidate"
                                width="100%"
                                onClick={() => handleOpenModal('reject')}
                            />
                        </>
                    )}
                </div>
            </Card>
            {showModal && (
                <ModalComponent open={showModal} handleClose={handleCloseModal}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                    >
                        <div className={style.title}>Confirm Action</div>
                        <div>
                            {' '}
                            {modalAction === 'active'
                                ? 'Are you sure you want to schedule an interview with this candidate?'
                                : modalAction === 'reject'
                                    ? 'Are you sure you want to reject this candidate?'
                                    : 'Are you sure you want to employ this candidate?'}
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '20px',
                            }}
                        >
                            <Button
                                type={ButtonTypes.PRIMARY}
                                btnText="Confirm"
                                width="100%"
                                onClick={handleConfirm}
                            />
                            <Button
                                type={ButtonTypes.SECONDARY}
                                btnText="Cancel"
                                width="100%"
                                onClick={handleCloseModal}
                            />
                        </div>
                    </div>
                </ModalComponent>
            )}

            {showConfirmationModal && (
                <ModalComponent
                    open={showConfirmationModal}
                    handleClose={handleCloseConfirmationModal}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                        }}
                    >
                        <div className={style.title}>Notify Applicant.</div>
                        <Input
                            IsUsername
                            type="datetime-local"
                            name="interviewDate"
                            label={applicant?.currentPhase === 'first_interview' ? 'Phase 2 Interview Date' : 'Phase 1 Interview Date'}
                            value={applicant?.currentPhase === 'first_interview' ? secondInterviewDate : firstInterviewDate}
                            onChange={(e: any) =>
                                applicant?.currentPhase === 'first_interview'
                                    ? setSecondInterviewDate(e.target.value)
                                    : setFirstInterviewDate(e.target.value)
                            }
                        />
                        <label className="flex items-center gap-2 cursor-pointer pt-2">
                            <input
                                type="checkbox"
                                checked={useCustomEmail}
                                onChange={(e) => setUseCustomEmail(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer accent-blue-600"
                            />
                            <span className="text-sm font-medium text-slate-700">Use custom email</span>
                        </label>{useCustomEmail && (
                            <>
                                <Input
                                    IsUsername
                                    type="textarea"
                                    name="costumMessage"
                                    label="Message"
                                    multiline
                                    rows={3}
                                    value={customMessage}
                                    onChange={(e: any) => setCustomMessage(e.target.value)}
                                />
                                <Input
                                    IsUsername
                                    type="textarea"
                                    name="customSubject"
                                    label="Subject"
                                    multiline
                                    rows={3}
                                    value={customSubject}
                                    onChange={(e: any) => setCustomSubject(e.target.value)}
                                />
                            </>
                        )}
                        <div
                            style={{
                                display: 'flex',
                                gap: '10px',
                                marginTop: '20px',
                            }}
                        >

                            <Button
                                type={ButtonTypes.PRIMARY}
                                btnText="Send"
                                width="100%"
                                onClick={handleSend}
                            />
                            <Button
                                type={ButtonTypes.SECONDARY}
                                btnText="Close"
                                width="100%"
                                onClick={handleCloseConfirmationModal}
                            />
                        </div>
                    </div>
                </ModalComponent>
            )}

            <Toast
                open={toastOpen}
                message={toastMessage}
                severity={toastSeverity}
                onClose={handleToastClose}
            />
        </div>
    )
}
