import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Laravel + Next.js</h1>
        <p className="text-xl mb-8">Full Stack Application with Authentication & CRUD</p>
        <div className="space-x-4">
          <Link href="/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}