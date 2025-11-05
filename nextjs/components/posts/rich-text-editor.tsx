"use client"

import { useEffect, useRef } from "react"

declare global {
    interface Window {
        Quill: any
    }
}

interface RichTextEditorProps {
    value: string
    onChange: (content: string) => void
    placeholder?: string
}

export default function RichTextEditor({
    value,
    onChange,
    placeholder = "Start writing your post...",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null)
    const quillRef = useRef<any>(null)
    const initializationRef = useRef(false)

    useEffect(() => {
        const styleId = "quill-snow-css"
        const scriptId = "quill-js"

        if (!document.getElementById(styleId)) {
            const scriptLink = document.createElement("link")
            scriptLink.id = styleId
            scriptLink.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css"
            scriptLink.rel = "stylesheet"
            document.head.appendChild(scriptLink)
        }

        if (!document.getElementById(scriptId) && !window.Quill) {
            const script = document.createElement("script")
            script.id = scriptId
            script.src = "https://cdn.quilljs.com/1.3.6/quill.js"
            script.onload = initializeQuill
            document.body.appendChild(script)
        } else if (window.Quill && !initializationRef.current) {
            initializeQuill()
        }

        return () => {
            if (quillRef.current && initializationRef.current) {
                quillRef.current = null
                initializationRef.current = false
            }
        }
    }, [])

    const initializeQuill = () => {
        if (!editorRef.current || quillRef.current || initializationRef.current) return

        initializationRef.current = true
        quillRef.current = new window.Quill(editorRef.current, {
            theme: "snow",
            placeholder,
            modules: {
                toolbar: [
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    ["bold", "italic", "underline", "strike"],
                    ["blockquote", "code-block"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    [{ indent: "-1" }, { indent: "+1" }],
                    [{ align: [] }],
                    ["link", "image", "video"],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                ],
            },
        })

        // Set initial value
        if (value) {
            quillRef.current.root.innerHTML = value
        }

        // Handle changes
        quillRef.current.on("text-change", () => {
            const html = quillRef.current.root.innerHTML
            onChange(html === "<p><br></p>" ? "" : html)
        })
    }

    return (
        <div className="form-control">
            <label className="label">
                <span className="label-text font-semibold">Post Content</span>
            </label>
            <div ref={editorRef} className="bg-base-100 rounded-lg border border-base-300 min-h-96" />
            <p className="text-xs text-base-content/60 mt-2">Add formatting, images, links and more to your post</p>
        </div>
    )
}
