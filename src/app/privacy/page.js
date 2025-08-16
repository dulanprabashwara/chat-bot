import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Return to Homepage Button */}
          <div className="flex justify-start">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors group"
            >
              <svg
                className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              <span className="font-medium">Back to Homepage</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight text-green-600 dark:text-green-400">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This Privacy Policy explains how
              we collect, use, and protect your information.
            </p>
          </div>

          {/* Privacy Content */}
          <Card className="rounded-2xl shadow-md border border-gray-200 dark:border-gray-800">
            <CardContent className="p-6 space-y-6">
              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  1. Information We Collect
                </h2>
                <p>
                  We may collect personal details (like name, email, account
                  details) and usage data to improve your experience on our
                  platform.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  2. How We Use Your Data
                </h2>
                <p>
                  Your information helps us provide services, personalize
                  content, and enhance security. We never sell your personal
                  data to third parties.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  3. Cookies & Tracking
                </h2>
                <p>
                  We may use cookies and similar technologies to improve
                  functionality, analyze usage, and provide a smoother
                  experience.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  4. Data Protection
                </h2>
                <p>
                  We use secure methods to protect your data from unauthorized
                  access, disclosure, alteration, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  5. Sharing of Information
                </h2>
                <p>
                  We do not share your personal data with outside organizations,
                  except when required by law or to provide essential services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  6. Your Rights
                </h2>
                <p>
                  You have the right to access, update, or delete your data.
                  Please{" "}
                  <a
                    href="/contact"
                    className="underline text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                  >
                    contact us
                  </a>{" "}
                  if you wish to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  7. Updates to This Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time. Continued
                  use of our services means you accept the changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                  8. Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please{" "}
                  <a
                    href="/contact"
                    className="underline text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                  >
                    reach out to us
                  </a>
                  .
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
