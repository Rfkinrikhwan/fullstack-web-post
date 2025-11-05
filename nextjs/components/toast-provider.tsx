"use client"

import { Toaster } from 'react-hot-toast'

export default function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#363636',
                    color: '#fff',
                    padding: '16px',
                    borderRadius: '10px',
                    fontSize: '14px',
                },
                success: {
                    duration: 3000,
                    style: {
                        background: '#10b981',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#10b981',
                    },
                },
                error: {
                    duration: 4000,
                    style: {
                        background: '#ef4444',
                    },
                    iconTheme: {
                        primary: '#fff',
                        secondary: '#ef4444',
                    },
                },
                loading: {
                    style: {
                        background: '#3b82f6',
                    },
                },
            }}
        />
    )
}