import Footer from "@/components/Footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8 flex-grow">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
            Terms of Service
          </h1>

          {/* Back to Home Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
        <p className="text-foreground leading-relaxed">
          These are placeholder terms. Replace with real legal language covering
          acceptable use, limitations, disclaimers, and liability.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Use the platform responsibly; no abusive or illegal content.</li>
          <li>We may update features; continued use implies acceptance.</li>
          <li>AI responses may be inaccurate; verify critical information.</li>
          <li>Deleting your account removes stored bots & messages.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
