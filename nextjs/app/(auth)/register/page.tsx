"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import Link from "next/link"
import { UserPlus, User, Mail, CheckCircle2, XCircle } from "lucide-react"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthHeader } from "@/components/auth/auth-header"
import { TextInput } from "@/components/auth/text-input"
import { PasswordInput } from "@/components/auth/password-input"
import { SubmitButton } from "@/components/auth/submit-button"
import { PasswordMatchWarning } from "@/components/auth/password-match-warning"
import { ErrorAlert } from "@/components/auth/error-error"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const { register } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        if (password !== passwordConfirmation) {
            setError("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            await register(name, email, password, passwordConfirmation)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Registration failed"
            const errors = err.response?.data?.errors

            if (errors) {
                const errorMessages = Object.values(errors).flat().join(", ")
                setError(errorMessages as string)
            } else {
                setError(errorMessage)
            }
        } finally {
            setLoading(false)
        }
    }

    const userIcon = <User className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
    const emailIcon = <Mail className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
    const addUserIcon = <UserPlus className="w-8 h-8 text-white" strokeWidth={1.5} />

    const passwordMismatch = passwordConfirmation && password !== passwordConfirmation

    return (
        <AuthCard>
            <AuthHeader title="Create Account" subtitle="Sign up to get started" icon={addUserIcon} />

            <ErrorAlert message={error} />

            <form onSubmit={handleSubmit} className="space-y-5">
                <TextInput label="Full Name" placeholder="John Doe" value={name} onChange={setName} icon={userIcon} required />

                <TextInput
                    label="Email Address"
                    placeholder="email@example.com"
                    value={email}
                    onChange={setEmail}
                    icon={emailIcon}
                    required
                />

                <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    required
                    minLength={8}
                    showStrength
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {passwordMismatch ? (
                                <XCircle className="w-5 h-5 text-red-400" strokeWidth={1.5} />
                            ) : (
                                <CheckCircle2 className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                            )}
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white ${passwordMismatch ? "border-red-300" : "border-gray-300"
                                }`}
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            required
                            minLength={8}
                        />
                    </div>
                    <PasswordMatchWarning show={passwordMismatch} />
                </div>

                <SubmitButton loading={loading}>Create Account</SubmitButton>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Sign in here
                </Link>
            </p>
        </AuthCard>
    )
}
