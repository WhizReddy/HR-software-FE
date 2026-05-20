// import React, { useEffect, useState } from 'react';
// import {  useNavigate, useSearchParams } from 'react-router-dom';
// import AxiosInstance from '../../../Helpers/Axios';

// const EmailConfirmation: React.FC = () => {
//     const [searchParams,setSearchParams] = useSearchParams()
//     const token = searchParams.get('token');
//     const [status, setStatus] = useState<'confirming' | 'success' | 'error'>('confirming');
//     const navigate = useNavigate();
// const [shouldNavigate, setShouldNavigate] = useState(false);

// useEffect(() => {
//     const confirm = async () => {
//         if (token) {
//             try {
//                 const confirmationUrl = `http://localhost:5173/recruitment/confirm?token=${token}&status=success`;
//                 await AxiosInstance.post(confirmationUrl, {token });
//                 setStatus('success');
//                 setTimeout(() => {
//                     setShouldNavigate(true);
//                 }, 3000);
//             } catch (error) {
//                 console.error('Error confirming application:', error);
//                 setStatus('error');
//             }
//         } else {
//             setStatus('error');
//         }
//     };

//     confirm();
// }, [token]);

// useEffect(() => {
//     if (shouldNavigate) {
//         navigate('/career');
//     }
// }, [shouldNavigate, navigate]);

//     if (status === 'confirming') {
//         return <div>Confirming your application...</div>;
//     }

//      if (status === 'error') {
//         return (
//             <div>
//                 <h1>Confirmation Failed</h1>
//                 <p>There was an issue with confirming your application. Please try again later.</p>
//             </div>
//         );
//     }

//     if (status === 'success') {
//         return (
//             <div>
//                 <h1>Confirmation Successful!</h1>
//                 <p>Your application has been confirmed. You can now proceed to the recruitment page.</p>
//             </div>
//         );
//     }

// };

// export default EmailConfirmation;

import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../Helpers/Axios'

const EmailConfirmation: React.FC = () => {
    const { search } = useLocation()
    const query = new URLSearchParams(search)
    const token = query.get('token')
    const [status, setStatus] = useState<'confirming' | 'success' | 'error'>(
        'confirming',
    )
    const navigate = useNavigate()

    useEffect(() => {
        const confirm = async () => {
            if (token) {
                try {
                    const confirmationUrl = `/applicant/confirm?token=${token}&status=success`
                    const response = await AxiosInstance.get(confirmationUrl)

                    if (response.status === 200) {
                        setStatus('success')
                    } else {
                        setStatus('error')
                    }
                } catch (error) {
                    console.error('Error confirming application:', error)
                    setStatus('error')
                }
            } else {
                setStatus('error')
            }
        }

        confirm()
    }, [navigate, token])

    useEffect(() => {
        if (status === 'success') {
            setTimeout(() => {
                navigate('/career')
            }, 3000)
        }
    }, [status, navigate])

    if (status === 'confirming') {
        return <div>Confirming your application...</div>
    }

    if (status === 'success') {
        return (
            <div>
                <h1>Confirmation Successful!</h1>
                <p>
                    Your application has been confirmed. You will be redirected
                    shortly.
                </p>
            </div>
        )
    }

    return (
        <div>
            <h1>Confirmation Failed</h1>
            <p>
                There was an issue with confirming your application. Please try
                again later.
            </p>
        </div>
    )
}

export default EmailConfirmation
