"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { postsApi, type Post } from "@/lib/api/posts"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import PostNavbar from "@/components/posts/post-navbar"
import RichTextEditor from "@/components/posts/rich-text-editor"
import toast from "react-hot-toast"

export default function EditPostPage() {
    const [post, setPost] = useState<Post | null>(null)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const { user, logout } = useAuth()
    const router = useRouter()
    const params = useParams()

    const id = params.id as string

    useEffect(() => {
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        const loadingToast = toast.loading("Loading post...")

        try {
            setLoading(true)
            const response = await postsApi.getById(id)
            setPost(response.data)
            setTitle(response.data.title)
            setContent(response.data.content)
            toast.dismiss(loadingToast)

            if (user && response.data.user.id !== user.id) {
                toast.error("You are not authorized to edit this post")
                router.push("/posts")
            }
        } catch (error) {
            console.error("Error fetching post:", error)
            toast.error("Post not found", { id: loadingToast })
            router.push("/posts")
        } finally {
            setLoading(false)
        }
    }

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

        setSubmitting(true)
        const loadingToast = toast.loading("Updating post...")

        try {
            await postsApi.update(id, { title, content })
            toast.success("Post updated successfully! ✨", { id: loadingToast })
            router.push(`/posts/${params.id}`)
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Failed to update post"
            toast.error(errorMessage, { id: loadingToast })
            setSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    if (!post) return null

    return (
        <div className="min-h-screen bg-base-200">
            <PostNavbar showCreateButton={false} />

            <div className="container mx-auto p-4 max-w-4xl">
                <div className="mb-4">
                    <Link href={`/posts/${params.id}`} className="btn btn-ghost btn-sm">
                        ← Back to Post
                    </Link>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl mb-4">Edit Post</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="form-control flex flex-col">
                                <label className="label">
                                    <span className="label-text font-semibold">Post Title</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter post title"
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
                                <Link href={`/posts/${params.id}`} className="btn btn-ghost">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    className={`btn btn-primary ${submitting ? "loading" : ""}`}
                                    disabled={submitting}
                                >
                                    {submitting ? "Updating..." : "Update Post"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}