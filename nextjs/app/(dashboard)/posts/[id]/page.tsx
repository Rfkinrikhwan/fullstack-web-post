"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { postsApi, type Post } from "@/lib/api/posts"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import PostNavbar from "@/components/posts/post-navbar"
import toast from "react-hot-toast"

export default function PostDetailPage() {
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const { user, logout } = useAuth()
    const router = useRouter()
    const params = useParams()

    const id = params.id as string

    useEffect(() => {
        if (!id) return
        fetchPost()
    }, [id])

    const fetchPost = async () => {
        try {
            setLoading(true)
            const response = await postsApi.getById(id)
            setPost(response.data)
        } catch (error) {
            console.error("Error fetching post:", error)
            toast.error("Post not found")
            router.push("/posts")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        const confirmToast = toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold">Are you sure you want to delete this post?</p>
                <p className="text-sm text-gray-300">This action cannot be undone.</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id)
                            performDelete()
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-medium"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm font-medium"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), {
            duration: 5000,
            style: {
                background: '#363636',
                color: '#fff',
                minWidth: '300px',
            },
        })
    }

    const performDelete = async () => {
        const loadingToast = toast.loading("Deleting post...")

        try {
            await postsApi.delete(Number(id))
            toast.success("Post deleted successfully!", { id: loadingToast })
            router.push("/posts")
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error("Failed to delete post. Please try again.", { id: loadingToast })
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
            <PostNavbar />

            <div className="container mx-auto p-4 max-w-4xl">
                <div className="mb-4">
                    <Link href="/posts" className="btn btn-ghost btn-sm">
                        ← Back to Posts
                    </Link>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h1 className="card-title text-3xl mb-4">{post.title}</h1>

                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-300">
                            <div className="avatar placeholder">
                                <div className="bg-neutral text-neutral-content rounded-full w-12">
                                    <span>{post.user.name.charAt(0).toUpperCase()}</span>
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold">{post.user.name}</p>
                                <p className="text-sm text-base-content/60">
                                    {new Date(post.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="prose prose-sm max-w-none mb-6">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>

                        {user?.id === post.user.id && (
                            <div className="card-actions justify-end">
                                <Link href={`/posts/${post.id}/edit`} className="btn btn-primary">
                                    Edit Post
                                </Link>
                                <button onClick={handleDelete} className="btn btn-error">
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}