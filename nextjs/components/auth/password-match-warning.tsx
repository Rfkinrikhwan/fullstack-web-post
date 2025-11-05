"use client"

export function PasswordMatchWarning({ show }: { show: boolean | string }) {
    if (!show) return null
    return <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
}
