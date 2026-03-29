import { createRoot } from 'react-dom/client'
import AppProviders from '@/app/AppProviders'
import AppRouter from '@/app/router'

import './index.scss'

createRoot(document.getElementById('root')!).render(
    <AppProviders>
        <AppRouter />
    </AppProviders>
)
