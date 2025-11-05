"use client"

import { useAuth } from "@/lib/hooks/useAuth"
import Link from "next/link"

interface PostNavbarProps {
    showCreateButton?: boolean
}

export default function PostNavbar({ showCreateButton = true }: PostNavbarProps) {
    const { user, logout } = useAuth()

    return (
        <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
            <div className="flex-1">
                <Link href="/posts" className="btn btn-ghost text-xl">
                    My Posts
                </Link>
            </div>
            <div className="flex-none gap-2">
                {showCreateButton && (
                    <Link href="/posts/create" className="btn btn-primary">
                        Create Post
                    </Link>
                )}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span>{user?.name?.charAt(0).toUpperCase()}</span>
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li className="menu-title">
                            <span>{user?.name}</span>
                        </li>
                        <li>
                            <button onClick={logout}>Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
