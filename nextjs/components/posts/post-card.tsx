"use client"

import type { Post } from "@/lib/api/posts"
import Link from "next/link"

interface PostCardProps {
    post: Post
    canEdit: boolean
    onDelete: (id: number) => void
}

export default function PostCard({ post, onDelete }: PostCardProps) {
    const excerptLength = 150
    const excerpt = post.content.substring(0, excerptLength) + (post.content.length > excerptLength ? "..." : "")

    return (
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body">
                <h2 className="card-title text-lg">{post.title}</h2>
                <p className="text-base-content/70 text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: excerpt }}/>
                <div className="flex items-center gap-2 text-sm text-base-content/60 mt-2">
                    <span>By {post.user.name}</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                    <Link href={`/posts/${post.slug}`} className="btn btn-sm btn-ghost">
                        View
                    </Link>
                    <Link href={`/posts/${post.id}/edit`} className="btn btn-sm btn-primary">
                        Edit
                    </Link>
                    <button onClick={() => onDelete(post.id)} className="btn btn-sm btn-error">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}
