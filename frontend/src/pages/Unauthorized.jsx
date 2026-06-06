import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F0F4F8]">
      <h1 className="text-6xl font-bold text-[#0077B6] mb-4">403</h1>
      <p className="text-gray-500 mb-6">You are not authorized to view this page.</p>
      <Link to="/" className="bg-[#0077B6] text-white px-6 py-2 rounded-lg hover:bg-[#023E8A] transition">
        Go Home
      </Link>
    </div>
  )
}