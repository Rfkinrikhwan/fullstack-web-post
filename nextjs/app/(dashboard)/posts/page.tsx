"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import { postsApi, type Post } from "@/lib/api/posts"
import Link from "next/link"
import { useRouter } from "next/navigation"
import PostNavbar from "@/components/posts/post-navbar"
import PostCard from "@/components/posts/post-card"
import PaginationControl from "@/components/posts/pagination-control"
import toast from "react-hot-toast"

export default function PostsPage() {
    const [posts, setPosts] = useState<Post[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [lastPage, setLastPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [debouncedSearch, setDebouncedSearch] = useState("")
    const { user, logout } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    useEffect(() => {
        fetchPosts(currentPage, debouncedSearch)
    }, [currentPage, debouncedSearch])

    const fetchPosts = async (page: number, search: string = "") => {
        try {
            setLoading(true)
            const response = await postsApi.getAll(page, 10, search)
            setPosts(response.data)
            setCurrentPage(response.current_page)
            setLastPage(response.last_page)
        } catch (error) {
            console.error("Error fetching posts:", error)
            toast.error("Failed to load posts. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: number) => {
        const confirmToast = toast((t) => (
            <div className="flex flex-col gap-3">
                <p className="font-semibold">Are you sure you want to delete this post?</p>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            toast.dismiss(t.id)
                            performDelete(id)
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
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

    const performDelete = async (id: number) => {
        const loadingToast = toast.loading("Deleting post...")

        try {
            await postsApi.delete(id)
            toast.success("Post deleted successfully!", { id: loadingToast })
            fetchPosts(currentPage, debouncedSearch)
        } catch (error) {
            console.error("Error deleting post:", error)
            toast.error("Failed to delete post. Please try again.", { id: loadingToast })
        }
    }

    const handleClearSearch = () => {
        setSearchQuery("")
        toast.success("Search cleared")
    }

    if (loading && posts.length === 0 && !searchQuery) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-base-200">
            <PostNavbar />

            <div className="container mx-auto p-4 max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">All Posts</h1>
                    <p className="text-base-content/70">Browse and manage your posts</p>
                </div>

                <div className="mb-6">
                    <div className="form-control">
                        <div className="input-group flex gap-3">
                            <input
                                type="text"
                                placeholder="Search posts by title..."
                                className="input input-bordered w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="btn btn-square btn-ghost"
                                    onClick={handleClearSearch}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                            <button className="btn btn-square btn-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    {debouncedSearch && (
                        <p className="text-sm text-base-content/60 mt-2">
                            Searching for: <span className="font-semibold">"{debouncedSearch}"</span>
                        </p>
                    )}
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        {searchQuery ? (
                            <>
                                <p className="text-xl mb-4">No posts found matching "{searchQuery}"</p>
                                <button onClick={handleClearSearch} className="btn btn-ghost">
                                    Clear Search
                                </button>
                            </>
                        ) : (
                            <>
                                <p className="text-xl mb-4">No posts yet</p>
                                <Link href="/posts/create" className="btn btn-primary">
                                    Create Your First Post
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4">
                            {posts.map((post) => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    canEdit={user?.id === post.user.id}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>

                        <PaginationControl
                            currentPage={currentPage}
                            lastPage={lastPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    )
}