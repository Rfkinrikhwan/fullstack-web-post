"use client"

import type React from "react"

export function AuthHeader({ title, subtitle, icon }: { title: string; subtitle: string; icon: React.ReactNode }) {
    return (
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
                {icon}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600">{subtitle}</p>
        </div>
    )
}