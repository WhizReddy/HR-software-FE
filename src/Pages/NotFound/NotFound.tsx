import { useNavigate } from 'react-router-dom'
import style from './notFound.module.scss'
import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/context/AuthProvider'
import { getDefaultPrivatePath } from '@/features/auth/lib/access'
export default function NotFound() {
    const navigate = useNavigate()
    const [count, setCount] = useState(5)
    const { currentUser, isAuthenticated, userRole } = useAuth()

    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate(
                isAuthenticated
                    ? getDefaultPrivatePath(userRole || currentUser?.role)
                    : '/',
            )
        }, 5500)
        return () => clearTimeout(timeout)
    }, [currentUser?.role, isAuthenticated, navigate, userRole])
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => prevCount - 1)
        }, 1000)
        if (count === 0) {
            clearInterval(interval)
        }
        return () => clearInterval(interval)
    }, [count])
    return (
        <main className={style.mainContainer}>
            <div className={style.itemsContainer}>
                <img src="/Images/notFound.png" alt="not found illustration" />
                <h3>Ooops, this page is not found</h3>
                {count > 0 ? (
                    <p>Redirecting you to the homepage in {count} seconds </p>
                ) : (
                    <p>Redirecting you to the homepage...</p>
                )}
            </div>
        </main>
    )
}
