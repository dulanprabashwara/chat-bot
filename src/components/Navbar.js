import Link from "next/link";

export default function Navbar({ user, onLogout, onLogin }) {
  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-400">
            AI Chat
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300">Welcome, {user.email}</span>
                <button
                  onClick={onLogout}
                  className="bg-transparent border border-green-400 text-green-400 px-4 py-2 rounded-md hover:bg-green-400 hover:text-black transition-all duration-200 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="bg-green-400 text-black font-semibold px-4 py-2 rounded-md hover:bg-opacity-90 transition-all duration-200 text-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
