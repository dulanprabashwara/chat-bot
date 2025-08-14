import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col transition-colors">
      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-8 flex-grow">
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-green-600 dark:text-green-400 mb-4">
            Privacy Policy
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
          This is a placeholder privacy policy. Customize with real details
          about data collection, usage, storage duration, third-party services,
          and user rights.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>We store account & chat data in Firebase (scoped per user).</li>
          <li>No public sharing of your private chats.</li>
          <li>Contact messages stored for support purposes.</li>
          <li>Delete your profile to remove associated bots & messages.</li>
        </ul>
      </div>
      <Footer />
    </div>
  );
}
