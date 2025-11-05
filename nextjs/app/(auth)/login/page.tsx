"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import Link from "next/link"
import { Lock, Mail } from "lucide-react"
import { AuthCard } from "@/components/auth/auth-card"
import { AuthHeader } from "@/components/auth/auth-header"
import { TextInput } from "@/components/auth/text-input"
import { PasswordInput } from "@/components/auth/password-input"
import { SubmitButton } from "@/components/auth/submit-button"
import { ErrorAlert } from "@/components/auth/error-error"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const emailIcon = <Mail className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
  const lockIcon = <Lock className="w-8 h-8 text-white" strokeWidth={1.5} />

  return (
    <AuthCard>
      <AuthHeader title="Welcome Back" subtitle="Please sign in to your account" icon={lockIcon} />

      <ErrorAlert message={error} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput
          label="Email Address"
          placeholder="email@example.com"
          value={email}
          onChange={setEmail}
          icon={emailIcon}
          required
        />

        <PasswordInput label="Password" placeholder="••••••••" value={password} onChange={setPassword} required />

        <SubmitButton loading={loading}>Sign In</SubmitButton>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          Create an account
        </Link>
      </p>
    </AuthCard>
  )
}
