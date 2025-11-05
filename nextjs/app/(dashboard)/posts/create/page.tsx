"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { postsApi } from "@/lib/api/posts"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostNavbar from "@/components/posts/post-navbar"
import RichTextEditor from "@/components/posts/rich-text-editor"
import toast from "react-hot-toast"

export default function CreatePostPage() {
    const [title, setTitle] = useState("") 
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim()) {
            toast.error("Please enter a title")
            return
        }

        if (!content.trim() || content === "<p><br></p>") {
            toast.error("Please write some content")
            return
        }

        setLoading(true)
        const loadingToast = toast.loading("Creating your post...")

        try {
            await postsApi.create({ title, content })
            toast.success("Post created successfully! 🎉", { id: loadingToast })
            router.push("/posts")
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to create post"
            toast.error(errorMessage, { id: loadingToast })
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-base-200">
            <PostNavbar showCreateButton={false} />

            <div className="container mx-auto p-4 max-w-4xl">
                <div className="mb-4">
                    <Link href="/posts" className="btn btn-ghost btn-sm">
                        ← Back to Posts
                    </Link>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Create New Post</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-control flex flex-col">
                                <label className="label">
                                    <span className="label-text font-semibold">Post Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter an engaging title..."
                                    className="input border w-full"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mt-4">
                                <RichTextEditor value={content} onChange={setContent} />
                            </div>

                            <div className="card-actions justify-end mt-6">
                                <Link href="/posts" className="btn btn-ghost">
                                    Cancel
                                </Link>
                                <button type="submit" className={`btn btn-primary ${loading ? "loading" : ""}`} disabled={loading}>
                                    {loading ? "Creating..." : "Create Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}