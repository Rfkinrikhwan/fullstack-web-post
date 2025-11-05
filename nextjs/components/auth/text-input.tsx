"use client"

import type React from "react"

interface TextInputProps {
    label: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    icon: React.ReactNode
    type?: string
    required?: boolean
    minLength?: number
}

export function TextInput({
    label,
    placeholder,
    value,
    onChange,
    icon,
    type = "text",
    required = false,
    minLength,
}: TextInputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                    minLength={minLength}
                />
            </div>
        </div>
    )
}
